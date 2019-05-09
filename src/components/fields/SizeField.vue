<template>
  <div v-show="showField" class="size-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="interactive-holder">
      <span ref="ondrag" class="drag-input-holder" :class="{ 'expanded': inputIsActive, 'hidden': property == 'auto' || property == 'none' }" @click.prevent="manualEdit">{{ valueToShow }}</span>
      <div v-if="property && properties" class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" ref="dropdowntoggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ property }}
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === property }">
            <a href="#" @click.prevent="onValueChange(prop)">{{ prop }}</a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label" @click.prevent="manualEdit">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div class="input-holder" v-show="inputIsActive">
      <input type="text" class="form-control" ref="inputfield" v-model="value" v-on:blur="onInputBlur" @keydown.enter="onInputEnter" @keydown="onKeyDown" @keyup="onKeyUp">
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, checkIsFieldChanged, checkSizeLogic, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import propertiesMap from '../../libs/size-field-properties'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      property: undefined,
      properties: this.getProperties(),
      value: this.parseValue(getDefaultFieldValue(this.data.fieldConfig)),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      inputIsActive: false,
      hammerInstance: undefined,
      keyMap: {},
      enterPressedToClose: false,
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      allowNegative: !!this.data.fieldConfig.allowNegative,
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      isAligned: typeof this.data.fieldConfig.isAligned !== 'undefined'
        ? this.data.fieldConfig.isAligned
        : false,
      fromReset: false,
      fromCreated: true
    }
  },
  components: {
    InheritDot
  },
  props: {
    data: Object
  },
  watch: {
    value(newVal, oldVal) {
      const isInheriting = this.checkIfIsInheriting(newVal)
      this.valueToShow = isInheriting ? oldVal : newVal

      if (newVal != oldVal && !this.fromReset && !this.inputIsActive) {
        this.prepareToSave()
        return
      }

      this.fromReset = false
    },
    valueToShow(newVal) {
      if (!this.fromCreated) {
        sendCssToFrame(newVal + (this.property !== 'x' ? this.property : ''), this.data.fieldConfig)
      }
    },
    property(newVal) {
      if (!this.fromCreated) {
        sendCssToFrame(this.value + (newVal !== 'x' ? newVal : ''), this.data.fieldConfig)
      }
    }
  },
  methods: {
    setValues() {
      // Set the value
      this.valueToShow = this.value
      // Set property
      this.property = this.getProperty(getDefaultFieldValue(this.data.fieldConfig))
      this.$nextTick(() => {
        this.fromCreated = false
      })
    },
    getValueToShow() {
      return this.parseValue(getDefaultFieldValue(this.data.fieldConfig))
    },
    getProperties() {
      const type = typeof this.data.fieldConfig.subtype !== 'undefined' && this.data.fieldConfig.subtype !== ''
          ? propertiesMap.types[this.data.fieldConfig.subtype]
          : propertiesMap.types['font']
      const properties = propertiesMap.properties[type]

      return properties
    },
    inheritValue(value) {
      this.value = value
      this.$nextTick(() => {
        this.fromReset = true
      })
    },
    checkIfIsInheriting(value) {
      // Checks if the value matches a variable name
      const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined
      // If the value matches to a variable get the name of the variable
      const variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined
      // Checks if the value matches the 'inherit-x' reserved key
      const matchInherit = typeof value === 'string' ? value.match(/^inherit-([a-z]+)$/) : undefined
      // If the value matches the 'inherit-x' reserved key get the inheritance key
      const inherit = matchInherit && matchInherit.length ? matchInherit[1] : undefined

      return inherit || variableName ? true : false
    },
    getProperty(value) {
      if (value == 'auto' || value == 'none' ) {
        return value
      }

      const match = value.toString().match(new RegExp(this.properties.join('$|') + '$'))

      if (match && match.length) {
        return match[0]
      }

      return 'x'
    },
    parseValue(value) {
      if (value == 'auto' || value == 'none' ) {
        return value
      }

      if (typeof value != 'string') {
        value = value.toString()
      }

      let parsedValue = value.replace(new RegExp(this.getProperties().join('$|') + '$'), '')
      if (parsedValue == '') {
        parsedValue = 0
      }
      const parsedFloatVal = parseFloat(parsedValue, 10)

      return isNaN(parsedFloatVal) ? parsedValue : parsedFloatVal
    },
    onValueChange(value) {
      this.property = value

      this.$nextTick(() => {
        if (this.property == 'auto' || this.property == 'none') {
          this.value = this.property
          this.prepareToSave()
          return
        }

        if (this.value == 'auto' || this.value == 'none') {
          this.value = 0
          this.prepareToSave()
          return
        }

        this.prepareToSave()
      })
    },
    prepareToSave() {
      const isInheriting = this.checkIfIsInheriting(this.value)
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: isInheriting || this.value == 'auto' || this.value == 'none' ? this.value : this.value !== '' ? this.value + (this.property !== 'x' ? this.property : '') : '0' + (this.property !== 'x' ? this.property : '')
      }

      if (this.isAligned) {
        this.isAligned = false
        checkSizeLogic(this.data.fieldConfig)
      }
        
      saveFieldData(data)
    },
    editToggle() {
      this.inputIsActive = this.enterPressedToClose ? this.inputIsActive : !this.inputIsActive
    },
    manualEdit(event) {
      if (this.value == 'auto' || this.value == 'none') {
        event.preventDefault()
        event.stopPropagation()
        $(this.$refs.dropdowntoggle).dropdown('toggle')
        return
      }

      this.editToggle()

      if (this.inputIsActive) {
        this.$nextTick(() => {
          this.$refs.inputfield.focus()
        })
      }
    },
    onInputBlur() {
      this.prepareToSave()
      this.editToggle()
      this.enterPressedToClose = false
    },
    onInputEnter() {
      this.prepareToSave()
      this.editToggle()
      this.enterPressedToClose = true
    },
    onKeyDown(e) {
      let value = parseFloat(this.value, 10)
      value = isNaN(value) ? 0 : value

      this.keyMap[e.keyCode] = true

      // Resets up and down keys when pressing Command
      if (this.keyMap[91] && e.keyCode == 38 && e.metaKey) {
        this.keyMap[40] = false
      } else if (this.keyMap[91] && e.keyCode == 40 && e.metaKey) {
        this.keyMap[38] = false
      }

      // Combos
      if (this.keyMap[91] && this.keyMap[38]) {
        // Command + Arrow up key
        this.value = new Number(value + 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[91] && this.keyMap[40]) {
        // Command + Arrow down key
        if (new Number(value - 100).toFixed(1).replace('.0', '') > 0 || (this.allowNegative && new Number(value - 100).toFixed(1).replace('.0', '') <= 0)) {
          // If value is 0 do nothing
          this.value = new Number(value - 100).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[17] && this.keyMap[38]) {
        // Control + Arrow up key
        this.value = new Number(value + 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[17] && this.keyMap[40]) {
        // Control + Arrow down key
        if (new Number(value - 100).toFixed(1).replace('.0', '') > 0 || (this.allowNegative && new Number(value - 100).toFixed(1).replace('.0', '') <= 0)) {
          // If value is 0 do nothing
          this.value = new Number(value - 100).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[16] && this.keyMap[38]) {
        // Shift + Arrow up key
        this.value = new Number(value + 10).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[16] && this.keyMap[40]) {
        // Shift + Arrow down key
        if (new Number(value - 10).toFixed(1).replace('.0', '') > 0 || (this.allowNegative && new Number(value - 10).toFixed(1).replace('.0', '') <= 0)) {
          // If value is 0 do nothing
          this.value = new Number(value - 10).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[18] && this.keyMap[38]) {
        // Alt/Option + Arrow up key
        this.value = new Number(value + 0.1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[18] && this.keyMap[40]) {
        // Alt/Option + Arrow down key
        if (new Number(value - 0.1).toFixed(1).replace('.0', '') > 0 || (this.allowNegative && new Number(value - 0.1).toFixed(1).replace('.0', '') <= 0)) {
          // If value is 0 do nothing
          this.value = new Number(value - 0.1).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[38]) {
        // Arrow up key
        this.value = new Number(value + 1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[40]) {
        // Arrow down key
        if (new Number(value - 1).toFixed(1).replace('.0', '') > 0 || (this.allowNegative && new Number(value - 1).toFixed(1).replace('.0', '') <= 0)) {
          // If value is 0 do nothing
          this.value = new Number(value - 1).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      }
    },
    onKeyUp(e) {
      this.keyMap[e.keyCode] = false

      // If used Command key resets Up and Down keys 
      if (e.keyCode == 91) {
        this.keyMap[40] = false
        this.keyMap[38] = false
      }
    },
    onHammerInput(e) {
      if (e.distance == 0 && e.isFinal) {
        // Click
        return
      }

      const distanceX = e.distance - Math.abs(e.deltaX)
      const distanceY = e.distance - Math.abs(e.deltaY)
      const halfDeltaX = Math.floor(e.deltaX / 1.5)

      // Normalize
      this.value = isNaN(this.value) ? 0 : parseInt(this.value)
      let tempValue = this.value

      // If dragging right
      if (e.deltaX > 0 && distanceX < distanceY) {
        tempValue += halfDeltaX
        this.valueToShow = tempValue
      }

      // If dragging right
      if (e.deltaX < 0 && distanceX < distanceY) {
        // If dragging left
        if (this.valueToShow > 0) {
          tempValue -= Math.abs(halfDeltaX)

          if (tempValue < 0) {
            this.valueToShow = 0
          } else {
            this.valueToShow = tempValue
          }
        }

        if (this.allowNegative && this.valueToShow <= 0) {
          tempValue -= Math.abs(halfDeltaX)
          this.valueToShow = tempValue
        }
      }

      if (e.isFinal) {
        this.value = this.valueToShow
        this.prepareToSave()
      }
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)
      this.valueToShow = this.getValueToShow()

      if (this.fromReset) {
        this.value = this.getValueToShow()
      }

      this.property = this.getProperty(getDefaultFieldValue(this.data.fieldConfig))
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
      this.isAligned = typeof this.data.fieldConfig.isAligned !== 'undefined'
        ? this.data.fieldConfig.isAligned
        : false
    }
  },
  created() {
    this.setValues()
  },
  mounted() {
    this.hammerInstance = new Hammer.Manager(this.$refs.ondrag)
    this.hammerInstance.on('hammer.input', this.onHammerInput)

    bus.$on('variables-computed', this.reCheckProps)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>