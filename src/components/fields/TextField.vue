<template>
  <div class="text-field-holder">
    <input type="text" class="form-control" v-model="value">
    <span v-if="!isInheriting" class="inheritance-warn"></span>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      isInheriting: this.checkInheritance()
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
  },
  methods: {
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    }
  }
}
</script>