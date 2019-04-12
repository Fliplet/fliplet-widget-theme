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
    }
  }
}
</script>