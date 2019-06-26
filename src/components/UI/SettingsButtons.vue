<template>
  <div v-if="!groupConfig.hide" class="components-buttons" @click.prevent="appearanceGroupSettings">
    {{ groupConfig.name }} <i class="fa fa-angle-right"></i>
  </div>
</template>

<script>
import { state, openAppearanceGroupSettings } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state
    }
  },
  props: {
    groupConfig: Object
  },
  methods: {
    appearanceGroupSettings(group) {
      openAppearanceGroupSettings(this.groupConfig.name, {
        appearanceGroup: this.groupConfig,
        instance: state.themeInstance
      })

      Fliplet.Analytics.trackEvent({
        category: 'theme_manager_v2',
        action: 'open_section',
        label: this.groupConfig.name
      })
    }
  }
}
</script>