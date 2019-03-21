<template>
  <div v-show="showField" class="size-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow }">
    <div class="interactive-holder">
      <span ref="ondrag" class="drag-input-holder" :class="{ 'expanded': inputIsActive }" @click.prevent="manualEdit">{{ valueToShow }}</span>
      <div v-if="property && properties && valueToShow !== 'auto'" class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ property }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === property }">
            <a href="#" @click.prevent="onValueChange(prop)">{{ prop }}</a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div class="input-holder" v-show="inputIsActive">
      <input type="text" class="form-control" ref="inputfield" v-model="value" v-on:blur="onInputBlur" @keydown.enter="onInputEnter" @keydown="onKeyDown" @keyup="onKeyUp">
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, getInheritance } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      property: undefined,
      value: this.parseValue(getDefaultFieldValue(this.data.fieldConfig)),
      valueToShow: this.computeValueToShow(),
      label: this.data.fieldConfig.label,
      properties: this.data.fieldConfig.properties,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      inputIsActive: false,
      hammerInstance: undefined,
      keyMap: {},
      enterPressedToClose: false,
      isInheriting: this.checkInheritance(),
      inheritingFrom: getInheritance(),
      allowNegative: !!this.data.fieldConfig.allowNegative,
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      fromReset: false
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      const isInheriting = this.checkIfIsInheriting(newVal)
      this.valueToShow = isInheriting ? oldVal : newVal

      if (newVal !== oldVal && !this.fromReset) {
        this.prepareToSave()
        return
      }

      this.fromReset = false
    }
  },
  methods: {
    computeValueToShow() {
      return this.parseValue(getDefaultFieldValue(this.data.fieldConfig))
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
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.property
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].property
      const match = value.match(new RegExp(this.data.fieldConfig.properties.join('$|') + '$'))

      if (match && match.length) {
        return match[0]
      }

      return fieldName
    },
    parseValue(value) {
      const parsedValue = value.replace(new RegExp(this.data.fieldConfig.properties.join('$|') + '$'), '')
      const parsedFloatVal = parseFloat(parsedValue, 10)

      return isNaN(parsedFloatVal) ? parsedValue : parsedFloatVal
    },
    onValueChange(value) {
      this.property = value
      this.prepareToSave()
    },
    prepareToSave() {
      const isInheriting = this.checkIfIsInheriting(this.value)
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: isInheriting || this.value == 'auto' ? this.value : this.value + (this.property !== 'x' && this.property !== 'none' ? this.property : '')
      }
      saveFieldData(data)
    },
    editToggle() {
      this.inputIsActive = this.enterPressedToClose ? this.inputIsActive : !this.inputIsActive
    },
    manualEdit(e) {
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
    },
    onInputEnter() {
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
      const distanceX = e.distance - Math.abs(e.deltaX)
      const distanceY = e.distance - Math.abs(e.deltaY)

      if (e.deltaX > 0 && distanceX < distanceY) {
        // If dragging right, add 1
        this.value = isNaN(this.value) ? 0 : this.value
        this.value = parseInt(this.value) + 1
      } else if (e.deltaX < 0 && distanceX < distanceY) {
        this.value = isNaN(this.value) ? 0 : this.value
        // If dragging left, remove 1
        if (parseInt(this.value) > 0 || (this.allowNegative && parseInt(this.value) <= 0)) {
          // If value is 0 do nothing
          this.value = parseInt(this.value) - 1
        }
      }
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.valueToShow = this.computeValueToShow()

      if (this.fromReset) {
        this.value = this.computeValueToShow()
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  mounted() {
    // Set property
    this.property = this.getProperty(getDefaultFieldValue(this.data.fieldConfig))

    this.hammerInstance = new Hammer.Manager(this.$refs.ondrag)
    this.hammerInstance.on('hammer.input', this.onHammerInput)

    bus.$on('variables-computed', this.reCheckProps)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>