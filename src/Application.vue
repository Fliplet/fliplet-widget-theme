<template>
  <div id="theme-application" :class="{ 'theme-selection-hidden': !themes || (themes && themes.length <= 1) }">
    <link rel="stylesheet" type="text/css" :href="customFontsCssUrl" />
    <div v-if="isLoading" class="spinner-holder animated">
      <div class="spinner-overlay">Loading...</div>
      <p>Loading your settings...</p>
    </div>
    <template v-else>
      <div class="top-area-fixed">
        <WidgetHeader></WidgetHeader>
        <ThemeSelection v-if="themes && themes.length > 1" :themes="themes"></ThemeSelection>

        <!-- <div v-if="state.themeInstance && state.themeInstance.id" @click.prevent="resetTheme">Reset theme</div> -->

      </div>
      <QuickSettings v-if="!state.widgetMode" :group-config="getQuickSettings()"></QuickSettings>
      <div class="components-buttons-holder">
        <SettingsButtons v-for="(configuration, index) in state.activeTheme.settings.configuration" :key="index" v-if="!configuration.quickSettings && !state.widgetMode" :group-config="configuration"></SettingsButtons>
      </div>
      <ComponentSettings></ComponentSettings>
      <transition name="slide-up">
        <div v-if="error" class="error-holder">
          <p>{{ error }}</p>
          <div class="dismiss-error" @click.prevent="dismissErrorToast"><i class="fa fa-times-thin fa-2x"></i></div>
        </div>
        <div v-if="state.isSaving" class="saving-holder">
          <div class="save-status">
            <i class="fa fa-fw fa-lg fa-refresh fa-spin"></i> Saving...
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { state, setComponentContext,
  setThemeInstance, setActiveTheme, setWidgetMode, setWidgetId,
  setWebFonts, setCustomFonts, setSavedFields, setWidgetData,
  resetStylesToTheme, prepareSettingsForTheme, clearDataToSave,
  toggleSavingStatus, openAppearanceGroupSettings } from './store'
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/UI/ThemeSelection'
import SettingsButtons from './components/UI/SettingsButtons'
import QuickSettings from './components/fields/QuickSettings'
import ComponentSettings from './components/UI/ComponentSettings'
import deviceTypes from './libs/device-types'
import widgetsMap from './libs/widgets-map'
import bus from './libs/bus'
import { dropdown } from './libs/dropdown'

const FLIPLET_THEME = 'Fliplet theme'

export default {
  data() {
    return {
      state,
      isLoading: true,
      fonts: undefined,
      customFontsCssUrl: [
        Fliplet.Env.get('apiUrl'),
        `v1/apps/${Fliplet.Env.get('appId')}/fonts/css`
      ].join(''),
      themes: undefined,
      savedFields: {
        values: [],
        widgetInstances: []
      },
      appearanceGroup: undefined,
      tabs: deviceTypes,
      error: undefined,
      dataToSave: {},
      debouncedSave: _.debounce(this.save, 500, { leading: true })
    }
  },
  components: {
    WidgetHeader,
    ThemeSelection,
    SettingsButtons,
    QuickSettings,
    ComponentSettings
  },
  methods: {
    getQuickSettings() {
      return _.find(state.activeTheme.settings.configuration, { quickSettings: true })
    },
    handleContextSwitch(tab) {
      tab = tab || this.tabs[0]
      setComponentContext(tab.name)
    },
    handleAppearanceGroup(group) {
      if (typeof group === 'undefined') {
        return
      }

      this.$nextTick(() => {
        openAppearanceGroupSettings(group.name, {
          appearanceGroup: group,
          instance: state.themeInstance
        })
      })
    },
    changeContext() {
      const tab = _.find(this.tabs, { name: state.componentContext })
      this.handleContextSwitch(tab)
    },
    tabType(type) {
      return `${type}-tab`
    },
    getThemes() {
      return Fliplet.Themes.get()
    },
    getFonts() {
      return Fliplet.App.Fonts.get()
    },
    storeFonts() {
      const webFonts = _.reject(this.fonts, (font) => { return font.url })
      setWebFonts(webFonts)
      const customFonts = _.filter(this.fonts, (font) => { return font.url })
      setCustomFonts(customFonts)
    },
    initialize(widgetInstanceData, toReuse) {
      const widgetId = Fliplet.Widget.getDefaultId()
      const widgetData = widgetInstanceData || Fliplet.Widget.getData(widgetId) || {}

      setWidgetData(widgetData)

      // Get themes and fonts simultaneously
      return Promise.all([this.getThemes(), this.getFonts()])
        .then((response) => {
          this.fonts = response[1]
          this.storeFonts()
          this.themes = response[0]
          this.getThemeInstance(response[0], toReuse)
        })
        .catch((err) => {
          this.error = Fliplet.parseError(err)
          console.error(err)
        })
    },
    getThemeInstance(themes, toReuse) {
      let themeWithoutInstances = 0
      let tab

      themes.forEach((theme) => {
        if (!theme.instances.length) {
          themeWithoutInstances++
          return
        }

        setThemeInstance(theme.instances[0])
        setActiveTheme(theme)

        // Check if there's a tab to be open
        if (typeof state.widgetData.activeTab !== 'undefined') {
          tab = this.tabs[state.widgetData.activeTab]
        }

        // Checks to understand if the provider was called from a component
        if (state.widgetData && state.widgetData.widgetInstanceId) {
          setWidgetId(state.widgetData.widgetInstanceId)

          // Check if there's a package name to open its component settings
          if (typeof state.widgetData.widgetPackage !== 'undefined') {
            this.appearanceGroup = _.find(state.activeTheme.settings.configuration, (config) => {
              return config.packages && config.packages.indexOf(state.widgetData.widgetPackage) > -1
            })

            setWidgetMode(!!this.appearanceGroup)
          }

          // Set the active tab from widget data
          this.isLoading = false
          this.handleContextSwitch(tab)
          this.handleAppearanceGroup(this.appearanceGroup)

          return
        }

        this.handleContextSwitch(tab)
        this.isLoading = false
      })

      // Automatically create a theme instance if one doesn't exist
      if (themeWithoutInstances == themes.length) {
        const flipletTheme = _.find(themes, { name: FLIPLET_THEME })
        this.createDefaultInstance(flipletTheme.id, toReuse)
          .then(this.initialize)
          .then(this.reloadPagePreview)
          .then(() => {
            bus.$emit('saved-fields-set')
          })
          .catch((err) => {
            this.error = Fliplet.parseError(err)
            console.error(err)
          })
      }
    },
    createDefaultInstance(themeId, toReuse) {
      toReuse = typeof toReuse === 'undefined' ? true : toReuse
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        method: 'POST',
        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
        data: {
          widgetId: themeId,
          reuse: toReuse
        }
      })
    },
    reloadPagePreview() {
      return Fliplet.Studio.emit('reload-page-preview');
    },
    onFieldSave(dataToSave) {
      // Processes data when a field is changed
      dataToSave = dataToSave || []
      dataToSave.forEach((data) => {
        // Checks if provider is in "widget mode"
        // (Widget mode is on when provider is initialized from a widget instance)
        if (state.widgetMode) {
          let widget = _.find(this.savedFields.widgetInstances, { id: state.widgetId })
          // If it is, check if settings of the same widget were previously saved
          if (widget) {
            widget.values[data.name] = data.value
          } else {
            widget = {
              id: state.widgetId,
              component: widgetsMap[state.widgetData.widgetPackage],
              values: {}
            }
            widget.values[data.name] = data.value
            this.savedFields.widgetInstances.push(widget)
          }
        } else {
          // If it isn't, it means you are saving general theme settings
          const field = _.find(this.savedFields.values, { name: data.name })
          // Check if the same field was previously saved
          if (field) {
            field.value = data.value
          } else {
            this.savedFields.values.push(data)
          }
        }
      })

      setSavedFields(this.savedFields)
      this.prepareToSave()
    },
    prepareToSave(fromStyleReset) {
      // Prepares the data in the right format and structure to be saved
      const themeSavedWidgetInstances = state.themeInstance.settings.widgetInstances || []

      // Checks if comes from a reset to theme styles
      if (fromStyleReset) {
        resetStylesToTheme(state.widgetId, this.appearanceGroup)
      }

      // General settings values
      this.dataToSave.values = _.mapValues(_.keyBy(state.savedFields.values, 'name'), 'value')
      this.dataToSave.values = _.assignIn({}, state.themeInstance.settings.values, this.dataToSave.values)

      // Widget settings values
      this.dataToSave.widgetInstances = state.savedFields.widgetInstances

      if (this.dataToSave.widgetInstances.length) {
        this.dataToSave.widgetInstances.forEach((wi) => {
          const widget = _.find(themeSavedWidgetInstances, { id: wi.id })
          if (widget) {
            themeSavedWidgetInstances.forEach((item, idx) => {
              if (widget.id === item.id) {
                _.merge(item, wi)
              }
            })
            this.dataToSave.widgetInstances = themeSavedWidgetInstances
          } else {
            themeSavedWidgetInstances.push(wi)
            this.dataToSave.widgetInstances = themeSavedWidgetInstances
          }
        })
      } else {
        this.dataToSave.widgetInstances = themeSavedWidgetInstances
      }

      this.debouncedSave()
    },
    updateInstance(dataObj) {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        url: 'v1/widget-instances/' + state.themeInstance.id,
        method: 'PUT',
        data: {
          package: state.activeTheme.package,
          values: dataObj.values || {},
          widgetInstances: dataObj.widgetInstances || []
        }
      })
    },
    save() {
      // Updates the theme saved settings
      toggleSavingStatus(true)
      this.updateInstance(this.dataToSave)
        .then((response) => {
          clearDataToSave()
          toggleSavingStatus(false)

          if (response && response.widgetInstance) {
            setThemeInstance(response.widgetInstance)
            // Reloads CSS files without reloading
            var settings = response.widgetInstance.settings.assets[0];
            Fliplet.Studio.emit('page-preview-send-event', {
              type: 'reloadCssAsset',
              path: settings.path,
              url: settings.url
            });
          }

          return 
        })
        .catch((err) => {
          this.error = Fliplet.parseError(err)
          console.error(err)
        })
    },
    reloadCustomFonts() {
      // Function to reload the custom fonts (Fonts added by the user)
      this.getFonts()
        .then((response) => {
          this.fonts = response
          this.storeFonts()
        })
    },
    applySettingsTheme() {
      // Apply settings to theme
      Fliplet.Modal.confirm({
        title: 'Apply styles to theme',
        message: '<p>Your changes will be applied to the theme.<br>Are you sure you want to continue?</p>'
      }).then((result) => {
        if (!result) {
          return
        }

        prepareSettingsForTheme(state.widgetId)
        this.prepareToSave()
      })
    },
    resetSettingsTheme() {
      // Reset settings to theme settings
      Fliplet.Modal.confirm({
        title: 'Reset to theme styles',
        message: '<p>You will lose your changes and the styles will be reset to the styles used in the theme.<br>Are you sure you want to continue?</p>'
      }).then((result) => {
        if (!result) {
          return
        }

        this.prepareToSave(true)
        bus.$emit('group-settings-changed')
      })
    },
    setError(error) {
      this.error = error
    },
    dismissErrorToast() {
      this.error = undefined
    },
    resetTheme() {
      // @TODO: Loading
      Fliplet.API.request({
        method: 'DELETE',
        url: 'v1/widget-instances/' + state.themeInstance.id
      })
      .then(() => {
        this.initialize(undefined, false)
      });
    }
  },
  created() {
    // Listeners
    bus.$on('field-saved', this.onFieldSave)
    bus.$on('initialize-widget', this.initialize)
    bus.$on('context-switch', this.handleContextSwitch)
    bus.$on('context-changed', this.changeContext)
    bus.$on('apply-to-theme', this.applySettingsTheme)
    bus.$on('reset-to-theme', this.resetSettingsTheme)
    bus.$on('on-error', this.setError)

    // Save Request from Image Picker
    Fliplet.Widget.onSaveRequest(() => {
      if (window.filePickerProvider) {
        window.filePickerProvider.forwardSaveRequest()
        return
      }
    })

    Fliplet.Studio.onMessage((eventData) => {
      if (eventData && eventData.data && eventData.data.type === 'theme-set-current-widget-instance') {
        bus.$emit('initialize-widget', eventData.data.widgetData)
      }
      if (eventData && eventData.data && eventData.data.type === 'custom-fonts-closed') {
        this.reloadCustomFonts()
      }
    })

    // Initialize
    this.initialize()
  },
  destroyed() {
    // Remove listeners
    bus.$off('field-saved', this.onFieldSave)
    bus.$off('initialize-widget', this.initialize)
    bus.$off('context-switch', this.handleContextSwitch)
    bus.$off('context-changed', this.changeContext)
    bus.$off('apply-to-theme', this.applySettingsTheme)
    bus.$off('reset-to-theme', this.resetSettingsTheme)
    bus.$off('on-error', this.setError)
  }
}
</script>