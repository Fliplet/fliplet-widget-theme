<template>
  <div class="size-field-holder">
    <input type="text" class="form-control" v-model="value" @keydown="onKeyDown" @keyup="onKeyUp">
    <div class="drag-input-holder" ref="ondrag"></div>
    <div class="btn-group select-box">
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
  </div>
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {
      value: this.parseValue(this.savedValue || this.data.fieldConfig.default),
      property: this.data.fieldConfig.property,
      properties: this.data.fieldConfig.properties,
      hammerInstance: undefined,
      keyMap: {}
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
    parseValue(value) {
      return value.replace(new RegExp(this.data.fieldConfig.properties.join('$|') + '$'), '')
    },
    onValueChange(value) {
      this.property = value
      this.prepareToSave()
    },
    prepareToSave() {
      const data = {
        name: this.data.fieldConfig.name,
        value: this.value + (this.property !== 'none' ? this.property : '')
      }
      saveFieldData(data)
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
    }
  },
  mounted() {
    this.hammerInstance = new Hammer.Manager(this.$refs.ondrag)
    this.hammerInstance.on('hammer.input', this.onHammerInput)
  }
}
</script>