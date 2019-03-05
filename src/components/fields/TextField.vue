<template>
  <input type="text" class="form-control" v-model="value">
</template>

<script>
import { state, saveFieldData } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || this.getDefaultValue()
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
          name: this.getFieldName(),
          value: newVal
        }
        saveFieldData(data)
      }
    }
  },
  methods: {
    getDefaultValue() {
      const defaultValue = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.default
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].default

      return defaultValue
    },
    getFieldName() {
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.name
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].name

      return fieldName
    }
  }
}
</script>