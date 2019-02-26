<template>
  <div id="theme-application">
    <div v-if="isLoading" class="spinner-holder animated">
      <div class="spinner-overlay">Loading...</div>
      <p>Loading your settings...</p>
    </div>
    <template v-else>
      <WidgetHeader></WidgetHeader>

      <ThemeSelection :themes="themes" :active-theme="activeTheme" :theme-instance="themeInstance"></ThemeSelection>

      <QuickSettings :component-config="getQuickSettings()" :component-index="index" :theme-instance="themeInstance" :web-fonts="webFonts" :custom-fonts="customFonts"></QuickSettings>

      <div class="components-buttons-holder">
        <SettingsButtons v-for="(configuration, index) in activeTheme.settings.configuration" :key="index" v-if="configuration.name !== 'Quick settings'" :component-config="configuration" :component-index="index" :theme-instance="themeInstance"></SettingsButtons>
      </div>

      <ComponentSettings :web-fonts="webFonts" :custom-fonts="customFonts"></ComponentSettings>
    </template>
  </div>
</template>

<script>
// @TODO: Handle errors
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/UI/ThemeSelection'
import SettingsButtons from './components/UI/SettingsButtons'
import ComponentSettings from './components/UI/ComponentSettings'
import QuickSettings from './components/fields/QuickSettings'
import bus from './libs/bus'

export default {
  data() {
    return {
      isLoading: true,
      themes: undefined,
      fonts: undefined,
      themeInstance: undefined,
      activeTheme: undefined,
      webFonts: undefined,
      customFonts: undefined,
      savedFields: []
    }
  },
  components: {
    WidgetHeader,
    ThemeSelection,
    SettingsButtons,
    ComponentSettings,
    QuickSettings
  },
  methods: {
    initialize() {
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
        // @TODO: Remove console.log
        console.log(theme)
        if (!theme.instances.length) {
          themeWithoutInstances++
          return
        }
        
        this.themeInstance = theme.instances[0] // Get the first instance
        this.activeTheme = theme
        this.webFonts = _.reject(this.fonts, (font) => { return font.url })
        this.customFonts = _.filter(this.fonts, (font) => { return font.url })

        this.isLoading = false
      })

      if (themeWithoutInstances == this.themes.length) {
        // @TODO: Update Fliplet Theme name
        const flipletTheme = _.find(this.themes, { name: 'Bootstrap' })
        this.createDefaultInstance(flipletTheme.id)
          .then(this.initialize)
          .then(this.reloadPage) // @TODO: Confirm we need this
          .catch((err) => {
            const error = Fliplet.parseError(err)
            console.error(error)
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
      const fieldIndex = _.findIndex(this.savedFields, (field) => {
        return field && field.name === data.name
      })
      
      if (fieldIndex >= 0) {
        this.savedFields[fieldIndex].value = data.value
      } else {
        this.savedFields.push(data)
      }

      console.log(this.savedFields)
      this.save()
    },
    updateInstance(dataObj) {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        url: 'v1/widget-instances/' + this.themeInstance.id,
        method: 'PUT',
        data: {
          package: this.activeTheme.package,
          values: dataObj || {}
        }
      })
    },
    save(forceRefresh) {
      // Map data
      const dataObj = _.mapValues(_.keyBy(this.savedFields, 'name'), 'value')

      this.updateInstance(dataObj)
        .then((response) => {
          if (response && response.widgetInstance && !forceRefresh) {
            var settings = response.widgetInstance.settings.assets[0];
            Fliplet.Studio.emit('page-preview-send-event', {
              type: 'reloadCssAsset',
              path: settings.path,
              url: settings.url
            });
          } else {
            this.reloadPage()
          }

          return 
        })
        .then(this.initialize)
        .catch((err) => {
          const error = Fliplet.parseError(err)
          console.error(error)
        })
    },
    getQuickSettings() {
      return _.find(this.activeTheme.settings.configuration, { quickSettings: true })
    },
    reloadCustomFonts() {
      this.getFonts()
        .then((response) => {
          this.fonts = response
          this.webFonts = _.reject(this.fonts, (font) => { return font.url })
          this.customFonts = _.filter(this.fonts, (font) => { return font.url })
        })
    }
  },
  created() {
    // Listeners
    bus.$on('field-saved', this.onFieldSave)
    bus.$on('initialize-widget', this.initialize)
    bus.$on('reload-custom-fonts', this.reloadCustomFonts)

    // Initialize
    this.initialize()

    // Save Request
    Fliplet.Widget.onSaveRequest(() => {
      if (window.filePickerProvider) {
        window.filePickerProvider.forwardSaveRequest()
        return
      }

      // @TODO: Decide if it should force refresh
      this.save(true)
    })
  },
  destroyed() {
    bus.$off('field-saved', this.onFieldSave)
    bus.$off('initialize-widget', this.initialize)
    bus.$off('reload-custom-fonts', this.reloadCustomFonts)
  }
}
</script>