<template>
  <div id="theme-application">
    <div v-if="isLoading" class="spinner-holder animated">
      <div class="spinner-overlay">Loading...</div>
      <p>Loading your settings...</p>
    </div>
    <template v-else>
      <WidgetHeader></WidgetHeader>
      <ThemeSelection :themes="themes" :active-theme="activeTheme"></ThemeSelection>
      <div class="form-horizontal">
        <div class="panel-group" id="accordion">
          <SettingsAccordions v-for="(configuration, index) in activeTheme.settings.configuration" :accordion-config="configuration" :accordion-index="index" :key="index"></SettingsAccordions>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/ThemeSelection'
import SettingsAccordions from './components/UI/SettingsAccordions'
import { reject, filter } from 'lodash'

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
      emptyState: true
    }
  },
  components: {
    WidgetHeader,
    ThemeSelection,
    SettingsAccordions
  },
  methods: {
    getThemes() {
      return Fliplet.Themes.get()
    },
    getFonts() {
      return Fliplet.App.Fonts.get()
    },
    getThemeInstance() {
      this.themes.forEach((theme) => {
        console.log(theme)
        if (!theme.instances.length) {
          return
        }
        
        theme.instances.forEach((instance) => {
          this.themeInstance = instance
          this.activeTheme = theme
          this.webFonts = reject(this.fonts, (font) => { return font.url })
          this.customFonts = filter(this.fonts, (font) => { return font.url; })
        })

        this.emptyState = false
      })
    }
  },
  created() {
    // Get themes and fonts simultaneously
    Promise.all([this.getThemes(), this.getFonts()])
      .then((response) => {
        this.themes = response[0]
        this.fonts = response[1]
        this.isLoading = false

        this.getThemeInstance()
      })
  }
}
</script>