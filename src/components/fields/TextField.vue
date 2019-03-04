<template>
  <input type="text" class="form-control" v-model="value">
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {
      value: this.savedValue || this.data.fieldConfig.default
    }
  },
  props: {
    data: Object,
    savedValue: String,
    componentContext: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        const data = {
          name: this.data.fieldConfig.name + (this.componentContext !== 'Mobile' ? this.componentContext : ''),
          value: newVal
        }
        saveFieldData(data)
      }
    }
  }
}
</script>