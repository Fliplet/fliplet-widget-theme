<template>
  <div v-if="!componentConfig.hide" class="components-buttons" @click.prevent="componentSettings">
    {{ componentConfig.name }} <i class="fa fa-angle-right"></i>
  </div>
</template>

<script>
import { state, openComponentSettings } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state
    }
  },
  props: {
    componentConfig: Object
  },
  methods: {
    componentSettings(component) {
      if (component.hasOwnProperty('variables') && component.name !== this.componentConfig.name) {
        return
      }

      component = component && component.hasOwnProperty('variables') ? component : this.componentConfig
      openComponentSettings(component.name, {
        component: component,
        instance: state.themeInstance
      })
    }
  },
  mounted() {
    bus.$on('open-component-overlay', this.componentSettings)
  },
  destroyed() {
    bus.$off('open-component-overlay', this.componentSettings)
  }
}
</script>