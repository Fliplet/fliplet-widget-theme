<template>
  <div class="size-field-holder">
    <div class="interactive-holder">
      <span ref="ondrag" class="drag-input-holder" :class="{ 'expanded': inputIsActive }" @click.prevent="manualEdit">{{ value }}</span>
      <div v-if="property && properties" class="btn-group select-box">
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
      <span v-if="!isInheriting" class="inheritance-warn"></span>
    </div>
    <div class="input-holder" v-show="inputIsActive">
      <input type="text" class="form-control" ref="inputfield" v-model="value" v-on:blur="onInputBlur" @keydown.enter="onInputEnter" @keydown="onKeyDown" @keyup="onKeyUp">
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: this.parseValue(this.savedValue || getDefaultFieldValue(this.data.fieldConfig)),
      label: this.data.fieldConfig.label,
      property: this.getDefaultProperty(),
      properties: this.data.fieldConfig.properties,
      inputIsActive: false,
      hammerInstance: undefined,
      keyMap: {},
      enterPressedToClose: false,
      isInheriting: this.checkInheritance()
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareToSave()
      }
    }
  },
  methods: {
    getDefaultProperty() {
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.property
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].property

      return fieldName
    },
    parseValue(value) {
      return value.replace(new RegExp(this.data.fieldConfig.properties.join('$|') + '$'), '')
    },
    onValueChange(value) {
      this.property = value
      this.prepareToSave()
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value + (this.property !== 'x' ? this.property : '')
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
        this.value = new Number(parseFloat(this.value, 10) + 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[91] && this.keyMap[40]) {
        // Command + Arrow down key
        if (new Number(parseFloat(this.value, 10) - 100).toFixed(1).replace('.0', '') > 0) {
          // If value is 0 do nothing
          this.value = new Number(parseFloat(this.value, 10) - 100).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[17] && this.keyMap[38]) {
        // Control + Arrow up key
        this.value = new Number(parseFloat(this.value, 10) + 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[17] && this.keyMap[40]) {
        // Control + Arrow down key
        if (new Number(parseFloat(this.value, 10) - 100).toFixed(1).replace('.0', '') > 0) {
          // If value is 0 do nothing
          this.value = new Number(parseFloat(this.value, 10) - 100).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[16] && this.keyMap[38]) {
        // Shift + Arrow up key
        this.value = new Number(parseFloat(this.value, 10) + 10).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[16] && this.keyMap[40]) {
        // Shift + Arrow down key
        if (new Number(parseFloat(this.value, 10) - 10).toFixed(1).replace('.0', '') > 0) {
          // If value is 0 do nothing
          this.value = new Number(parseFloat(this.value, 10) - 10).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[18] && this.keyMap[38]) {
        // Alt/Option + Arrow up key
        this.value = new Number(parseFloat(this.value, 10) + 0.1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[18] && this.keyMap[40]) {
        // Alt/Option + Arrow down key
        if (new Number(parseFloat(this.value, 10) - 0.1).toFixed(1).replace('.0', '') > 0) {
          // If value is 0 do nothing
          this.value = new Number(parseFloat(this.value, 10) - 0.1).toFixed(1).replace('.0', '')
          e.preventDefault()
        } else {
          this.value = 0
          e.preventDefault()
        }
      } else if (this.keyMap[38]) {
        // Arrow up key
        this.value = new Number(parseFloat(this.value, 10) + 1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else if (this.keyMap[40]) {
        // Arrow down key
        if (new Number(parseFloat(this.value, 10) - 1).toFixed(1).replace('.0', '') > 0) {
          // If value is 0 do nothing
          this.value = new Number(parseFloat(this.value, 10) - 1).toFixed(1).replace('.0', '')
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
        this.value = parseInt(this.value) + 1
      } else if (e.deltaX < 0 && distanceX < distanceY) {
        // If dragging left, remove 1
        if (parseInt(this.value) > 0) {
          // If value is 0 do nothing
          this.value = parseInt(this.value) - 1
        }
      }
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckInheritance() {
      this.isInheriting = this.checkInheritance()
    }
  },
  mounted() {
    this.hammerInstance = new Hammer.Manager(this.$refs.ondrag)
    this.hammerInstance.on('hammer.input', this.onHammerInput)
    bus.$on('variables-computed', this.reCheckInheritance)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckInheritance)
  }
}
</script>