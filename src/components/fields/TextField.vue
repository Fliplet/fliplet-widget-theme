<template>
  <input type="text" class="form-control" v-model="value">
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig)
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
          name: getFieldName(this.data.fieldConfig),
          value: newVal
        }
        saveFieldData(data)
      }
    }
  }
}
</script>