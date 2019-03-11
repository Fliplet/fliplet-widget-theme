<template>
  <div class="background-field-holder">
    <div class="checkbox-holder inline-circle" v-for="(option, idx) in options" :key="idx">
      <input type="checkbox" :id="'checkbox-' + option" :value="option" v-model="value">
      <label :for="'checkbox-' + option">
        <span class="check-icon"></span> {{ option }}
      </label>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      options: ['None', 'Image', 'Color']
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      console.log('New value', newVal)
      console.log('Old value', oldVal)
    }
  },
  mounted() {
    console.log('Default value', this.value)
  }
}
</script>