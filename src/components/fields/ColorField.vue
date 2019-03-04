<template>
  <div class="color-field-holder">
    <div class="color-picker-background" :style="'background-image: url(' + bgImg + ')'">
      <div id="color-picker-container" class="color-holder" :style="'background-color: ' + value" @click.prevent="toggleColorPicker"></div>
    </div>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'
import { ColorPicker } from 'codemirror-colorpicker'

export default {
  data() {
    return {
      value: this.savedValue || this.data.fieldConfig.default,
      colorpicker: undefined,
      widgetId: Fliplet.Widget.getDefaultId()
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
  },
  computed: {
    bgImg() {
      return window.__widgetData[this.widgetId].assetsUrl ? window.__widgetData[this.widgetId].assetsUrl + 'img/color-bg.gif' : ''
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
    this.colorpicker = new ColorPicker({
      colorSets: [
        {
          name: "Fliplet",
          colors: ['#7d4b79', '#4bebff', '#ffd94b', '#f05865', '#36344c', '#474975', '#8d8ea6', '#f8f6f7']
        },
        { 
          name : "Material",  
          colors: [ 
            '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',  '#795548', '#9E9E9E', '#607D8B' 
          ]
        },
        { 
          name : "Custom", "edit" : true, "colors" : []
        }
      ]
    })
  }
}
</script>