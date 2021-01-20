<template>
  <div v-if="showField" :class="'color-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="color-picker-background" :style="'background-image: url(' + bgImg + ')'">
        <div id="color-picker-container" class="color-holder" ref="colorSquare" :style="'background-color: ' + valueToShow" @click.prevent="toggleColorPicker"></div>
      </div>
      <div v-if="label" class="field-label" @click.prevent="toggleColorPicker">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @update-all="updateAll" @update-previous-context="updatePreviousContext" @trigger-inherit="inheritValue" :position="'left'" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, getFieldNameByContext, checkIsFieldChanged, sendCssToFrame } from '../../store'
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
      isValid: true,
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
      ],
      colorPickerFields: { 
        hsl: ['.hsl-h input', '.hsl-s input', '.hsl-l input', '.hsl-a input'],
        rgb: ['.rgb-r input', '.rgb-g input', '.rgb-b input', '.rgb-a input']
      },
      defaultColorValues: [0, 0, 0, 1]
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
    prepareToSave(data) {
      if (Array.isArray(data)) {
        this.dataToSave = data
      } else {
        this.value = data
        this.valueToShow = this.value
        this.dataToSave.name = getFieldName(this.data.fieldConfig),
        this.dataToSave.value = data
      }

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
    toggleColorPicker() {
      const target = this.$refs.colorSquare.getBoundingClientRect()

      this.colorpicker.show({
        left: target.left,
        top: target.bottom,
        hideDelay: 300000
      }, this.valueToShow, this.onColorChange, this.onColorChanged)


      this.attachOnBlurEvent()
      this.checkTransparency()

      Fliplet.Studio.emit('editing-theme-field', {
        value: true
      })

    },
    onColorChanged(color) {
      if (!this.isValid) {
        return
      }

      // Save last used colors to Cookie
      cookieSavedColors.unshift(color)

      if (cookieSavedColors.length > 7) {
        cookieSavedColors.pop()
      }

      const json = JSON.stringify(cookieSavedColors)

      Cookies.set(COLOR_PALETTE_COOKIE, json, { expires: 30 })

      this.colorSets[2].colors = cookieSavedColors

      this.colorpicker.setUserPalette(this.colorSets)

      if (this.valueToShow !== color) {
        this.prepareToSave(color)

        return
      }

      // Make sure flag is only turned off after the check in "onClickOutside" in Studio
      // $nextTick is not enough
      setTimeout(() => {
        Fliplet.Studio.emit('editing-theme-field', {
          value: false
        })
      }, 500)
    },
    onColorChange(color) {
      this.checkTransparency()

      if (this.isValid) {
        Fliplet.Studio.emit('page-preview-send-event', {
          type: 'colorChange',
          color: color,
          label: this.label,
          widgetId: state.widgetId
        });
      }

      if (color === this.valueToShow || !this.isValid) {
        return
      }

      sendCssToFrame(color, this.data.fieldConfig)
    },
    attachOnBlurEvent(type) {
      this.colorPickerFields.rgb.forEach((selector) => {
        let field = document.querySelector(selector)

        field.addEventListener('blur', this.validateColor)
      })

      this.colorPickerFields.hsl.forEach((selector) => {
        let field = document.querySelector(selector)

        field.addEventListener('blur', this.validateColor)
      })
    },
    validateColor() {
      const errorsFields = document.querySelectorAll('input.error')
      const validationErrorClass = 'error'
      const colorFormat = document.querySelector('.codemirror-colorpicker .colorpicker-body .information').getAttribute('class').split(' ')[1]

      // Reset error fields
      for (let i = 0; i < errorsFields.length; i++) {
        errorsFields[i].classList.remove(validationErrorClass)
      }

      this.isValid = true

      // When a color format is 'hex' library won't let us save the incorrect value
      if ( colorFormat === 'hex' ) {
        return
      }

      let selectedColor = this.colorpicker.getColor(colorFormat)

      // When we first time set an empty value in the RGB info tab we will receive this kind of answer from the color-picker
      // rgba(0,0,0,0) which we should consider as an error because it will hide selected element from the screen for the user
      if (/0, 0, 0, 0|NaN/g.test(selectedColor)) {
        // Receiving previous saved value, first array element is a newest value, or using a default values
        let prevColor = cookieSavedColors[0].match(/[0-9]{1,3}/g) || this.defaultColorValues
        this.colorPickerFields[colorFormat].forEach((selector, i) => {
          let field = document.querySelector(selector)

          if (field.value.trim().length === 0) {
            field.classList.add(validationErrorClass)
            // Set previous or default field value so user won't be able to save wrong value
            // if there is no valid value in the preValue[i] we will set the field value to 1 
            // this may occur when the previous value is RGB(255, 255, 255) but user 
            // removed alfa value, in this case, we will place 1 instead of the undefined
            field.value = prevColor[i] || 1
          }
        })

        this.isValid = false
      }
      
      // If we got an error we show a toast message to a user in case he didn't notice highlighted field
      if (!this.isValid) {
        Fliplet.Modal.alert({ message: 'Your color wasn\'t saved, please set the correct color values'})
          .then(() => {
            // After user close alert message call the color picker so that user may change it values
            this.toggleColorPicker()
          })
      }
    },
    checkTransparency() {
      let informationChange = document.querySelector('.codemirror-colorpicker .information .information-change')
      let color = this.colorpicker.getColor('rgba')

      informationChange.removeAttribute('title')

      if (color.a < 1) {
        informationChange.setAttribute('title', 'Change the A value to 1 to use HEX code')
      }
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
    },
    updateAll() {
      const mobileFieldName = this.data.fieldConfig.name
      const currentFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: state.componentContext.toLowerCase()
      })

      // This function can only be run when the user is either
      // in the tablet or desktop context, so it is safe to assume
      // that if it's not one is the other
      const remainingFieldContext = state.componentContext.toLowerCase() === 'tablet'
        ? 'desktop'
        : 'tablet'
      const remainingFieldInheritance = remainingFieldContext === 'desktop'
        ? 'tablet'
        : 'mobile'
      const remainingFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: remainingFieldContext
      })

      const dataToSave = [
        {
          name: mobileFieldName,
          value: this.value
        },
        {
          name: currentFieldName,
          value: 'inherit-' + this.inheritingFrom
        },
        {
          name: remainingFieldName,
          value: 'inherit-' + remainingFieldInheritance
        }
      ]

      this.prepareToSave(dataToSave)
    },
    updatePreviousContext() {
      const fieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: this.inheritingFrom
      })
      const dataToSave = [
        {
          name: fieldName,
          value: this.value
        },
        {
          name: getFieldName(this.data.fieldConfig),
          value: 'inherit-' + this.inheritingFrom
        }
      ]

      this.prepareToSave(dataToSave)
    },
    inheritValue(value) {
      this.value = value
      this.prepareToSave(this.value)
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
