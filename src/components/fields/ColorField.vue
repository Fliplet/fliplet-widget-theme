<template>
  <div id="color-picker-container" class="color-holder" :style="'background-color: ' + value" @click.prevent="toggleColorPicker"></div>
</template>

<script>
import { saveFieldData } from '../../store'
import { ColorPicker } from 'codemirror-colorpicker'

export default {
  data() {
    return {
      value: this.savedValue || this.data.fieldConfig.default,
      colorpicker: undefined
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
  },
  methods: {
    toggleColorPicker(e) {
      const target = e.target.getBoundingClientRect()

      this.colorpicker.show({
        left: target.left,
        top: target.bottom
      }, this.value, this.onColorChange, this.onColorChange)
    },
    onColorChange(color) {
      this.value = color
    }
  },
  mounted() {
    this.colorpicker = new ColorPicker()
  }
}
</script>