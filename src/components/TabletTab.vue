<template>
  <div class="tablet-tab-content">
    <QuickSettings :component-config="getQuickSettings()" :component-context="'Tablet'" :theme-instance="themeInstance" :web-fonts="webFonts" :custom-fonts="customFonts"></QuickSettings>
    <div class="components-buttons-holder">
      <SettingsButtons v-for="(configuration, index) in activeTheme.settings.configuration" :key="index" v-if="configuration.name !== 'Quick settings'" :component-config="configuration" :component-index="index" :theme-instance="themeInstance"></SettingsButtons>
    </div>
    <ComponentSettings :web-fonts="webFonts" :custom-fonts="customFonts" :theme-instance="themeInstance" :component-context="'Tablet'"></ComponentSettings>
  </div>
</template>

<script>
import SettingsButtons from './UI/SettingsButtons'
import ComponentSettings from './UI/ComponentSettings'
import QuickSettings from './fields/QuickSettings'

export default {
  data() {
    return {}
  },
  props: {
    activeTheme: Object,
    themeInstance: Object,
    webFonts: Array,
    customFonts: Array
  },
  components: {
    SettingsButtons,
    ComponentSettings,
    QuickSettings
  },
  methods: {
    getQuickSettings() {
      return _.find(this.activeTheme.settings.configuration, { quickSettings: true })
    }
  }
}
</script>