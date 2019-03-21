<template>
  <div v-if="showField" class="color-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow }">
    <div class="wrapper">
      <div class="color-picker-background" :style="'background-image: url(' + bgImg + ')'">
        <div id="color-picker-container" class="color-holder" :style="'background-color: ' + valueToShow" @click.prevent="toggleColorPicker"></div>
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, getInheritance } from '../../store'
import bus from '../../libs/bus'
import { ColorPicker } from 'codemirror-colorpicker'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      valueToShow: this.computeValueToShow(),
      label: this.data.fieldConfig.label,
      colorpicker: undefined,
      widgetId: Fliplet.Widget.getDefaultId(),
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      isInheriting: this.checkInheritance(),
      inheritingFrom: getInheritance(),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
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
  computed: {
    bgImg() {
      return window.__widgetData[this.widgetId].assetsUrl ? window.__widgetData[this.widgetId].assetsUrl + 'img/color-bg.gif' : ''
    }
  },
  methods: {
    computeValueToShow() {
      return getDefaultFieldValue(this.data.fieldConfig)
    },
    inheritValue(value) {
      this.value = value
    },
    toggleColorPicker(e) {
      const target = e.target.getBoundingClientRect()

      this.colorpicker.show({
        left: target.left,
        top: target.bottom
      }, this.valueToShow, this.onColorChange, this.onColorChange)
    },
    onColorChange(color) {
      this.value = color
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.valueToShow = this.computeValueToShow()
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
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
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>