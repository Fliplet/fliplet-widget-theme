<template>
  <div class="components-buttons" @click.prevent="componentSettings">
    {{ componentConfig.name }} <i class="fa fa-angle-right"></i>
  </div>
</template>

<script>
import { state, openComponentSettings } from '../../store'

export default {
  data() {
    return {
      state
    }
  },
  props: {
    componentConfig: Object,
    componentIndex: Number
  },
  methods: {
    componentSettings() {
      openComponentSettings(this.componentConfig.name, {
        component: this.componentConfig,
        instance: state.themeInstance
      })
    }
  }
}
</script>