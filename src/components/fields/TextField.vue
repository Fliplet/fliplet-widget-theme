<template>
  <input type="text" class="form-control" v-model="value">
</template>

<script>
import { state, saveFieldData } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || this.data.fieldConfig.default
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        const data = {
          name: this.data.fieldConfig.name + (state.componentContext !== 'Mobile' ? state.componentContext : ''),
          value: newVal
        }
        saveFieldData(data)
      }
    }
  }
}
</script>