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
import bus from '../../libs/bus'

export default {
  data() {
    return {
      value: this.savedValue || this.data.fieldConfig.default,
      saveDebounced: _.debounce(this.saveData, 500)
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveDebounced()
      }
    }
  },
  methods: {
    saveData() {
      const newData = {
        name: this.data.fieldConfig.name,
        value: this.value
      }

      bus.$emit('field-saved', newData)
    }
  },
  mounted() {
    bus.$on('save-settings', this.saveDebounced)
  },
  destroyed() {
    bus.$off('save-settings', this.saveDebounced)
  }
}
</script>