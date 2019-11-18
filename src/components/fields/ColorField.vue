<template>
  <div v-if="showField" :class="'color-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="color-picker-background" :style="'background-image: url(' + bgImg + ')'">
        <div id="color-picker-container" class="color-holder" ref="colorsquare" :style="'background-color: ' + valueToShow" @click.prevent="toggleColorPicker"></div>
      </div>
      <div v-if="label" class="field-label" @click.prevent="toggleColorPicker">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, checkIsFieldChanged, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'
import { ColorPicker } from 'codemirror-colorpicker'
import Cookies from 'js-cookie'

const COLOR_PALETTE_COOKIE = '_custom_color_palette'
const cookieSavedColors = Cookies.get(COLOR_PALETTE_COOKIE) ? JSON.parse(Cookies.get(COLOR_PALETTE_COOKIE)) : []

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      colorpicker: undefined,
      widgetId: Fliplet.Widget.getDefaultId(),
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      dataToSave: {
        name: undefined,
        value: undefined
      },
      debouncedSave: _.debounce(this.saveColor, 250),
      colorSets: [
        {
          name: "Fliplet",
          colors: ['#7d4b79', '#00abd1', '#ffd94b', '#f05865', '#36344c', '#474975', '#8d8ea6', '#f8f6f7']
        },
        { 
          name: "Material",  
          colors: [ 
            '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',  '#795548', '#9E9E9E', '#607D8B' 
          ]
        },
        { 
          name: "Last used",
          colors: cookieSavedColors
        }
      ]
    }
  },
  components: {
    InheritDot
  },
  props: {
    data: Object
  },
  computed: {
    bgImg() {
      return window.__widgetData[this.widgetId].assetsUrl ? window.__widgetData[this.widgetId].assetsUrl + 'static/img/color-bg.gif' : ''
    },
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    prepareToSave(color) {
      this.value = color
      this.valueToShow = this.value
      this.dataToSave.name = getFieldName(this.data.fieldConfig),
      this.dataToSave.value = color
      this.debouncedSave()
    },
    saveColor() {
      saveFieldData(this.dataToSave)
    },
    setValues() {
      this.valueToShow = this.value
    },
    getValueToShow() {
      return getCurrentFieldValue(this.data.fieldConfig)
    },
    inheritValue(value) {
      this.value = value
      this.prepareToSave(this.value)
    },
    toggleColorPicker() {
      const target = this.$refs.colorsquare.getBoundingClientRect()

      this.colorpicker.show({
        left: target.left,
        top: target.bottom
      }, this.valueToShow, this.onColorChange, this.onColorChanged)
    },
    onColorChanged(color) {
      // Save last used colors to Cookie
      cookieSavedColors.unshift(color)
      if (cookieSavedColors.length > 7) {
        cookieSavedColors.pop()
      }
      const json = JSON.stringify(cookieSavedColors)
      Cookies.set(COLOR_PALETTE_COOKIE, json, { expires: 30 })
      this.colorSets[2].colors = cookieSavedColors
      this.colorpicker.setUserPalette(this.colorSets)

      if (this.valueToShow != color) {
        this.prepareToSave(color)
      }
    },
    onColorChange(color) {
      if (color === this.valueToShow) {
        return
      }

      sendCssToFrame(color, this.data.fieldConfig)
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)
      this.valueToShow = this.getValueToShow()
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  created() {
    this.setValues()
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    this.colorpicker = new ColorPicker({
      colorSets: this.colorSets
    })
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>