<template>
  <div class="style-field-holder">
    <div class="checkbox-holder" v-for="(prop, idx) in properties" :key="idx">
      <input type="checkbox" :id="'checkbox-' + prop" :value="prop" v-model="value">
      <label :for="'checkbox-' + prop">
        <span class="check-icon">
          <template v-if="prop !== 'lighter'">
            <i :class="'fa fa-' + prop"></i>
          </template>
          <template v-else>
            <span>L</span>
          </template>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.parseValue(this.savedValue || this.getDefaultValue()),
      properties: this.data.fieldConfig.properties
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      let index
      let difference = newVal.filter(x => !oldVal.includes(x))

      if (newVal.indexOf('normal') > -1) {
        // Remove "normal"
        index = newVal.indexOf('normal')
        if (index > -1) {
          newVal.splice(index, 1)
        }
      }
      if (difference.indexOf('bold') > -1) {
        // Remove "lighter" if "bold" is selected
        index = newVal.indexOf('lighter')
        if (index > -1) {
          newVal.splice(index, 1)
        }
      } else if (difference.indexOf('lighter') > -1) {
        // Remove "bold" if "lighter" is selected
        index = newVal.indexOf('bold')
        if (index > -1) {
          newVal.splice(index, 1)
        }
      }

      this.value = newVal
      this.prepareToSave()
    }
  },
  methods: {
    getDefaultValue() {
      const defaultValue = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.default
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].default

      return defaultValue
    },
    getFieldName() {
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.name
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].name

      return fieldName
    },
    parseValue(value) {
      return value.split(' ')
    },
    prepareToSave() {
      const data = {
        name: this.getFieldName(),
        value: this.value.length ? this.value.join(' ') : 'normal'
      }

      saveFieldData(data)
    }
  }
}
</script>