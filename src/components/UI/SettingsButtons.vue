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
      if (group.hasOwnProperty('variables') && group.name !== this.groupConfig.name) {
        return
      }

      group = group && group.hasOwnProperty('variables') ? group : this.groupConfig
      openAppearanceGroupSettings(group.name, {
        appearanceGroup: group,
        instance: state.themeInstance
      })
    }
  },
  mounted() {
    bus.$on('open-group-overlay', this.appearanceGroupSettings)
  },
  destroyed() {
    bus.$off('open-group-overlay', this.appearanceGroupSettings)
  }
}
</script>