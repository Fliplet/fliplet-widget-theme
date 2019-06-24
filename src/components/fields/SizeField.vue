<template>
  <div v-show="showField" :class="'size-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="interactive-holder">
      <span ref="ondrag" class="drag-input-holder" :class="{ 'expanded': inputIsActive, 'hidden': property == 'auto' || property == 'none' || property == 'initial' }" @click.prevent="manualEdit">{{ valueToShow }}</span>
      <div v-if="property && properties" class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" ref="dropdowntoggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <template v-if="property == 'initial'">none</template>
          <template v-else>{{ property }}</template>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === property || prop.value && prop.value === property }">
            <a v-if="prop.hasOwnProperty('name') && prop.hasOwnProperty('value')" href="#" @click.prevent="onValueChange(prop.value)">{{ prop.name }}</a>
            <a v-else href="#" @click.prevent="onValueChange(prop)">{{ prop }}</a>
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
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, checkIsFieldChanged, checkSizeLogic, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import propertiesMap from '../../libs/size-field-properties'
import keyHandler from '../../libs/key-down-handler'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      property: undefined,
      properties: this.getProperties(),
      value: this.parseValue(getCurrentFieldValue(this.data.fieldConfig)),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
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
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    setValues() {
      // Set the value
      this.valueToShow = this.value == 'initial' ? 'none' : this.value
      // Set property
      this.property = this.getProperty(getCurrentFieldValue(this.data.fieldConfig))
      this.$nextTick(() => {
        this.fromCreated = false
      })
    },
    getValueToShow(toShow) {
      const parsedValue = this.parseValue(getCurrentFieldValue(this.data.fieldConfig))

      if (!toShow) {
        return parsedValue
      }

      const value = parsedValue == 'initial' ? 'none' : parsedValue
      return value
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
      if (value == 'auto' || value == 'none' || value == 'initial') {
        return value
      }

      const match = value.toString().match(new RegExp(this.properties.join('$|') + '$'))

      if (match && match.length) {
        return match[0]
      }

      return 'x'
    },
    parseValue(value) {
      if (value == 'auto' || value == 'none' || value == 'initial') {
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
        if (this.property == 'auto' || this.property == 'none' || this.property == 'initial') {
          this.value = this.property
          this.prepareToSave()
          return
        }

        if (this.value == 'auto' || this.value == 'none' || this.value == 'initial') {
          this.value = 100
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
        value: isInheriting || this.value == 'auto' || this.value == 'none' || this.value == 'initial' ? this.value : this.value !== '' ? this.value + (this.property !== 'x' ? this.property : '') : '0' + (this.property !== 'x' ? this.property : '')
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
      if (this.value == 'auto' || this.value == 'none' || this.value == 'initial') {
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
      this.editToggle()
      this.enterPressedToClose = false

      if (this.valueToShow != this.value) {
        if (isNaN(this.value) && this.value != 'auto' && this.value != 'none' && this.value != 'initial') {
          this.value = 100
        }

        this.valueToShow = this.checkIfIsInheriting(this.value)
        ? this.valueToShow == 'initial' ? 'none' : this.valueToShow
        : this.value == 'initial' ? 'none' : this.value

        this.prepareToSave()
      }
    },
    onInputEnter() {
      this.editToggle()
      this.enterPressedToClose = true

      if (this.valueToShow != this.value) {
        if (isNaN(this.value) && this.value != 'auto' && this.value != 'none' && this.value != 'initial') {
          this.value = 100
        }

        this.valueToShow = this.checkIfIsInheriting(this.value)
        ? this.valueToShow == 'initial' ? 'none' : this.valueToShow
        : this.value == 'initial' ? 'none' : this.value

        this.prepareToSave()
      }
    },
    onKeyDown(e) {
      this.value = keyHandler.getValue(e, this.value, this.allowNegative)
    },
    onKeyUp(e) {
      keyHandler.resetKeyMap(e)
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
      this.value = isNaN(this.value) ? 0 : this.value
      let tempValue = this.value

      // If dragging right
      if (e.deltaX > 0 && distanceX < distanceY) {
        tempValue += halfDeltaX
        this.valueToShow = tempValue
      }

      // If dragging left
      if (e.deltaX < 0 && distanceX < distanceY) {
        // When it should continue decreasing or stop at 0
        if (this.valueToShow > 0) {
          tempValue -= Math.abs(halfDeltaX)

          if (tempValue < 0) {
            this.valueToShow = 0
          } else {
            this.valueToShow = tempValue
          }
        }

        // If negative numbers are allowed
        if (this.allowNegative && this.valueToShow <= 0) {
          tempValue -= Math.abs(halfDeltaX)
          this.valueToShow = tempValue
        }
      }

      // When dragging stops
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
      this.valueToShow = this.getValueToShow(true)
      this.property = this.getProperty(getCurrentFieldValue(this.data.fieldConfig))

      if (this.fromReset) {
        this.value = this.getValueToShow()
        sendCssToFrame(this.value + (this.property !== 'x' ? this.property : ''), this.data.fieldConfig)
      }

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