<template>
  <div class="style-field-holder">
    <div class="style-field-container">
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
    <span v-if="!isInheriting" class="inheritance-warn"></span>
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
      properties: this.data.fieldConfig.properties,
      isInheriting: this.checkInheritance()
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
    parseValue(value) {
      return value.split(' ')
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckInheritance() {
      this.isInheriting = this.checkInheritance()
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value.length ? this.value.join(' ') : 'normal'
      }

      saveFieldData(data)
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckInheritance)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckInheritance)
  }
}
</script>