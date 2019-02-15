<template>
  <div class="components-buttons" @click.prevent="componentSettings">
    {{ componentConfig.name }} <i class="fa fa-angle-right"></i>
  </div>
</template>

<script>
import { openComponentSettings } from '../../store'

export default {
  data() {
    return {}
  },
  props: {
    componentConfig: Object,
    componentIndex: Number,
    themeInstance: Object
  },
  methods: {
    componentSettings() {
      openComponentSettings(this.componentConfig.name, {
        component: this.componentConfig,
        instance: this.themeInstance
      })
    }
  }
}
</script>