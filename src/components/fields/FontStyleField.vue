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
      value: this.parseValue(this.savedValue || this.data.fieldConfig.default),
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

      // Remove "lighter" if "bold" is selected
      if (difference.indexOf('bold') > -1) {
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
    parseValue(value) {
      return value.split(' ')
    },
    prepareToSave() {
      const data = {
        name: this.data.fieldConfig.name + (state.componentContext !== 'Mobile' ? state.componentContext : ''),
        value: this.value.length ? this.value.join(' ') : ''
      }

      saveFieldData(data)
    }
  }
}
</script>