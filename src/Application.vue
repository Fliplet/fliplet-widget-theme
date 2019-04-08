<template>
  <div id="theme-application">
    <div v-if="isLoading" class="spinner-holder animated">
      <div class="spinner-overlay">Loading...</div>
      <p>Loading your settings...</p>
    </div>
    <template v-else>
      <WidgetHeader></WidgetHeader>
      <ThemeSelection :themes="themes"></ThemeSelection>
      <!-- Nav tabs -->
      <ul class="nav nav-tabs breakpoint-tabs">
        <li v-for="(tab, index) in tabs" :id="tab.type" :class="{ active: activeTab == index }" :ref="index">
          <a :href="'#tab-' + tab.type" data-toggle="tab" @click="setActiveTab(tab)"><i :class="tab.icon"></i></a>
        </li>
      </ul>
      <!-- Tab panes -->
      <div class="tab-content">
        <div v-for="(tab, index) in tabs" v-if="activeTab === index" :class="{ active: activeTab === index }" :ref="index" class="tab-pane" :id="'tab-' + tab.type">
          <component :is="componentType(tab.type)"></component>
        </div>
      </div>
      <transition name="slide-up">
        <div v-if="error" class="error-holder">
          <p>{{ error }}</p>
          <div class="dismiss-error" @click.prevent="dismissErrorToast"><i class="fa fa-times-thin fa-lg fa-2x"></i></div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { state, setComponentContext,
  setThemeInstance, setActiveTheme, setComponentMode, setComponentId,
  setWebFonts, setCustomFonts, setSavedFields, setWidgetData,
  resetStylesToTheme, prepareSettingsForTheme } from './store'
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/UI/ThemeSelection'
import MobileTab from './components/MobileTab'
import TabletTab from './components/TabletTab'
import DesktopTab from './components/DesktopTab'
import deviceTypes from './libs/device-types'
import componentsMap from './libs/components-map'
import bus from './libs/bus'
import { dropdown } from './libs/dropdown'
dropdown()

export default {
  data() {
    return {
      state,
      widgetData: undefined,
      isLoading: true,
      themes: undefined,
      fonts: undefined,
      themeInstance: undefined,
      activeTheme: undefined,
      webFonts: undefined,
      customFonts: undefined,
      savedFields: {
        values: [],
        widgetInstances: []
      },
      component: undefined,
      tabs: deviceTypes,
      activeTab: 0,
      isFromUpdate: false,
      error: undefined
    }
  },
  components: {
    WidgetHeader,
    ThemeSelection,
    MobileTab,
    TabletTab,
    DesktopTab
  },
  methods: {
    setActiveTab(tab, component) {
      // Sets the activedevice tab
      tab = tab || this.tabs[0]
      const tabIndex = _.findIndex(this.tabs, { type: tab.type })
      this.activeTab = tabIndex
      setComponentContext(tab.name)

      if (component) {
        this.$nextTick(() => {
          bus.$emit('open-component-overlay', component)
        })
      }
    },
    changeContext() {
      const tab = _.find(this.tabs, { name: state.componentContext })
      this.setActiveTab(tab)
    },
    componentType(type) {
      return `${type}-tab`
    },
    initialize() {
      // Get widget provider data
      const widgetId = Fliplet.Widget.getDefaultId()
      this.widgetData = Fliplet.Widget.getData(widgetId) || {}
      setWidgetData(this.widgetData)

      // Get themes and fonts simultaneously
      return Promise.all([this.getThemes(), this.getFonts()])
        .then((response) => {
          this.themes = response[0]
          this.fonts = response[1]

          this.getThemeInstance()
        })
        .catch((err) => {
          const error = Fliplet.parseError(err)
          console.error(error)
          this.error = error
        })
    },
    getThemes() {
      return Fliplet.Themes.get()
    },
    getFonts() {
      return Fliplet.App.Fonts.get()
    },
    getThemeInstance() {
      let themeWithoutInstances = 0

      this.themes.forEach((theme) => {
        if (!theme.instances.length) {
          themeWithoutInstances++
          return
        }

        this.themeInstance = theme.instances[0]
        setThemeInstance(this.themeInstance)
        this.activeTheme = theme
        setActiveTheme(this.activeTheme)
        this.webFonts = _.reject(this.fonts, (font) => { return font.url })
        setWebFonts(this.webFonts)
        this.customFonts = _.filter(this.fonts, (font) => { return font.url })
        setCustomFonts(this.customFonts)

        // Checks to understand if the provider was called from a component
        if (this.widgetData) {
          let tab

          if (typeof this.widgetData.widgetId !== 'undefined') {
            setComponentId(this.widgetData.widgetId)
          }

          // Check if there's a package name to open its component settings
          if (typeof this.widgetData.widgetPackage !== 'undefined') {
            this.component = _.find(this.activeTheme.settings.configuration, (config) => {
              return config.packages && config.packages.indexOf(this.widgetData.widgetPackage) > -1
            })

            setComponentMode(!!this.component)
          }

          // Check if there's a tab to be open
          if (typeof this.widgetData.activeTab !== 'undefined') {
            tab = this.tabs[this.widgetData.activeTab]
          }

          // If it's not from an update set the active tab from widget data
          if (!this.isFromUpdate) {
            this.isLoading = false
            this.setActiveTab(tab, this.component)
          }

          return
        }

        this.isLoading = false
      })

      // Automatically create a theme instance if one doesn't exist
      if (themeWithoutInstances == this.themes.length) {
        const flipletTheme = _.find(this.themes, { name: 'Fliplet theme' })
        this.createDefaultInstance(flipletTheme.id)
          .then(this.initialize)
          .then(this.reloadPage)
          .catch((err) => {
            const error = Fliplet.parseError(err)
            console.error(error)
            this.error = error
          })
      }
    },
    createDefaultInstance(themeId) {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        method: 'POST',
        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
        data: {
          widgetId: !themeId ? undefined : themeId,
          reuse: true
        }
      })
    },
    reloadPage() {
      Fliplet.Studio.emit('reload-page-preview');
    },
    onFieldSave(data) {
      // Processes data when a field is changed
      let fieldIndex

      // Checks if provider is in "component mode" (Component mode is on when provider is initialized from a component)
      if (state.componentMode) {
        fieldIndex = _.findIndex(this.savedFields.widgetInstances, (field) => {
          return field && field.id === state.componentId
        })
      } else {
        fieldIndex = _.findIndex(this.savedFields.values, (field) => {
          return field && field.name === data.name
        })
      }

      if (fieldIndex >= 0) {
        if (state.componentMode) {
          this.savedFields.widgetInstances[fieldIndex].values[data.name] = data.value
        } else {
          this.savedFields.values[fieldIndex].value = data.value
        }
      } else {
        if (state.componentMode) {
          const dataObj = {
            id: state.componentId,
            component: componentsMap[this.widgetData.widgetPackage],
            values: {}
          }
          dataObj.values[data.name] = data.value

          this.savedFields.widgetInstances.push(dataObj)
        } else {
          this.savedFields.values.push(data)
        }
      }

      setSavedFields(this.savedFields)
      this.prepareToSave()
    },
    updateInstance(dataObj) {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        url: 'v1/widget-instances/' + this.themeInstance.id,
        method: 'PUT',
        data: {
          package: this.activeTheme.package,
          values: dataObj.values || {},
          widgetInstances: dataObj.widgetInstances || []
        }
      })
    },
    prepareToSave(componentId) {
      // Prepares the data in the right format and structure to be saved
      const dataObj = {}
      const savedWidgetInstances = state.themeInstance.settings.widgetInstances

      if (componentId) {
        resetStylesToTheme(componentId, this.component)
      }

      // General settings values
      dataObj.values = _.mapValues(_.keyBy(state.savedFields.values, 'name'), 'value')
      dataObj.values = _.assignIn(state.themeInstance.settings.values, dataObj.values)

      // Component settings values
      dataObj.widgetInstances = state.savedFields.widgetInstances
      if (dataObj.widgetInstances.length) {
        dataObj.widgetInstances.forEach((wi) => {
          const index = _.findIndex(savedWidgetInstances, { 'id' : wi.id })
          if (index > -1) {
            savedWidgetInstances.forEach((item, idx) => {
              if (index === idx) {
                _.merge(item, wi)
              }
            })
            dataObj.widgetInstances = savedWidgetInstances
          } else {
            savedWidgetInstances.push(wi)
            dataObj.widgetInstances = savedWidgetInstances
          }
        })
      } else {
        dataObj.widgetInstances = savedWidgetInstances
      }

      this.save(dataObj, componentId)
    },
    save(data, componentId) {
      // Updates the theme saved settings
      this.updateInstance(data)
        .then((response) => {
          if (response && response.widgetInstance) {
            // Reloads CSS files without reloading
            var settings = response.widgetInstance.settings.assets[0];
            Fliplet.Studio.emit('page-preview-send-event', {
              type: 'reloadCssAsset',
              path: settings.path,
              url: settings.url
            });
          }

          this.isFromUpdate = true
          return 
        })
        .then(this.initialize)
        .catch((err) => {
          const error = Fliplet.parseError(err)
          console.error(error)
          this.error = error
        })
    },
    reloadCustomFonts() {
      // Function to reload the custom fonts (Fonts added by the user)
      this.getFonts()
        .then((response) => {
          this.fonts = response
          this.webFonts = _.reject(this.fonts, (font) => { return font.url })
          setWebFonts(this.webFonts)
          this.customFonts = _.filter(this.fonts, (font) => { return font.url })
          setCustomFonts(this.customFonts)
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

        prepareSettingsForTheme(state.componentId)
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

        this.prepareToSave(state.componentId)
      })
    },
    setError(error) {
      this.error = error
    },
    dismissErrorToast() {
      this.error = undefined
    }
  },
  created() {
    // Listeners
    bus.$on('field-saved', this.onFieldSave)
    bus.$on('initialize-widget', this.initialize)
    bus.$on('reload-custom-fonts', this.reloadCustomFonts)
    bus.$on('set-active-tab', this.setActiveTab)
    bus.$on('context-changed', this.changeContext)
    bus.$on('apply-to-theme', this.applySettingsTheme)
    bus.$on('reset-to-theme', this.resetSettingsTheme)
    bus.$on('on-error', this.setError)

    // Initialize
    this.initialize()

    // Save Request from Image Picker
    Fliplet.Widget.onSaveRequest(() => {
      if (window.filePickerProvider) {
        window.filePickerProvider.forwardSaveRequest()
        return
      }
    })

    setTimeout(() => {
      this.error = 'Hello world!'
    }, 5000)
  },
  destroyed() {
    // Remove listeners
    bus.$off('field-saved', this.onFieldSave)
    bus.$off('initialize-widget', this.initialize)
    bus.$off('reload-custom-fonts', this.reloadCustomFonts)
    bus.$off('set-active-tab', this.setActiveTab)
    bus.$off('context-changed', this.changeContext)
    bus.$off('apply-to-theme', this.applySettingsTheme)
    bus.$off('reset-to-theme', this.resetSettingsTheme)
    bus.$off('on-error', this.setError)
  }
}
</script>