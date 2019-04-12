<template>
  <div class="tablet-tab-content">
    <QuickSettings v-if="!state.widgetMode" :group-config="getQuickSettings()"></QuickSettings>
    <div class="components-buttons-holder">
      <SettingsButtons v-for="(configuration, index) in state.activeTheme.settings.configuration" :key="index" v-if="!configuration.quickSettings && !state.widgetMode" :group-config="configuration"></SettingsButtons>
    </div>
    <ComponentSettings></ComponentSettings>
  </div>
</template>

<script>
import { state } from '../store'
import SettingsButtons from './UI/SettingsButtons'
import QuickSettings from './fields/QuickSettings'
import ComponentSettings from './UI/ComponentSettings'

export default {
  data() {
    return {
      state
    }
  },
  components: {
    SettingsButtons,
    QuickSettings,
    ComponentSettings
  },
  methods: {
    getQuickSettings() {
      return _.find(state.activeTheme.settings.configuration, { quickSettings: true })
    }
  }
}
</script>