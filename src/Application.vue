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
    </template>
  </div>
</template>

<script>
// @TODO: Handle errors
import { state, setComponentContext,
  setThemeInstance, setActiveTheme,
  setWebFonts, setCustomFonts, setSavedFields } from './store'
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/UI/ThemeSelection'
import MobileTab from './components/MobileTab'
import TabletTab from './components/TabletTab'
import DesktopTab from './components/DesktopTab'
import deviceTypes from './libs/device-types'
import bus from './libs/bus'

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
        values: []
      },
      tabs: deviceTypes,
      activeTab: 0,
      isFromUpdate: false
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
    componentType(type) {
      return `${type}-tab`
    },
    initialize() {
      // Get widget provider data
      const widgetId = parseInt(Fliplet.Widget.getDefaultId(), 10);
      this.widgetData = Fliplet.Widget.getData(widgetId) || {};

      // Check if there's a value to set as the active tab
      if (this.widgetData && this.widgetData.activeTab && !this.isFromUpdate) {
        this.setActiveTab(this.tabs[this.widgetData.activeTab])
      }
      
      // @TODO: Remove console.log
      console.log('data', this.widgetData)
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
        
        this.themeInstance = theme.instances[0]
        setThemeInstance(this.themeInstance)
        this.activeTheme = theme
        setActiveTheme(this.activeTheme)
        this.webFonts = _.reject(this.fonts, (font) => { return font.url })
        setWebFonts(this.webFonts)
        this.customFonts = _.filter(this.fonts, (font) => { return font.url })
        setCustomFonts(this.customFonts)

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
      const fieldIndex = _.findIndex(this.savedFields.values, (field) => {
        return field && field.name === data.name
      })
      
      if (fieldIndex >= 0) {
        this.savedFields.values[fieldIndex].value = data.value
      } else {
        this.savedFields.values.push(data)
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
          values: dataObj.values || {}
        }
      })
    },
    prepareToSave(forceRefresh) {
      // Map data
      const dataObj = {
        values: _.mapValues(_.keyBy(state.savedFields.values, 'name'), 'value')
      }

      dataObj.values = _.assignIn({}, state.themeInstance.settings.values, dataObj.values)

      this.save(forceRefresh, dataObj)
    },
    save(forceRefresh, data) {
      // @TODO: Remove console.log
      console.log('Data to save', data)

      this.updateInstance(data)
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

          this.isFromUpdate = true
          return 
        })
        .then(this.initialize)
        .catch((err) => {
          const error = Fliplet.parseError(err)
          console.error(error)
        })
    },
    reloadCustomFonts() {
      this.getFonts()
        .then((response) => {
          this.fonts = response
          this.webFonts = _.reject(this.fonts, (font) => { return font.url })
          setWebFonts(this.webFonts)
          this.customFonts = _.filter(this.fonts, (font) => { return font.url })
          setCustomFonts(this.customFonts)
        })
    }
  },
  created() {
    // Listeners
    bus.$on('field-saved', this.onFieldSave)
    bus.$on('initialize-widget', this.initialize)
    bus.$on('reload-custom-fonts', this.reloadCustomFonts)
    bus.$on('set-active-tab', this.setActiveTab)

    // Initialize
    this.initialize()

    // Save Request
    Fliplet.Widget.onSaveRequest(() => {
      if (window.filePickerProvider) {
        window.filePickerProvider.forwardSaveRequest()
        return
      }

      // @TODO: Decide if it should force refresh
      this.prepareToSave(true)
    })
  },
  destroyed() {
    bus.$off('field-saved', this.onFieldSave)
    bus.$off('initialize-widget', this.initialize)
    bus.$off('reload-custom-fonts', this.reloadCustomFonts)
    bus.$off('set-active-tab', this.setActiveTab)
  }
}
</script>