<template>
  <div class="form-group clearfix">
    <div class="col-xs-12 control-label">
      <label for="select-theme">{{ data.fieldConfig.description }}</label>
    </div>
    <div class="col-xs-12">
      <input type="text" class="form-control" v-model="value">
    </div>
  </div>
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
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        const data = {
          name: this.data.fieldConfig.name,
          value: newVal
        }
        saveFieldData(data)
      }
    }
  }
}
</script>