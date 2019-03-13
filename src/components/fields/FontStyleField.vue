<template>
  <div v-if="showField" class="style-field-holder" :class="{ 'full-width': isFullRow }">
    <div class="wrapper">
      <div class="style-field-container">
        <div class="checkbox-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
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
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
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
      value: this.parseValue(getDefaultFieldValue(this.data.fieldConfig)),
      properties: this.data.fieldConfig.properties,
      isFullRow: this.data.fieldConfig.isFullRow,
      isInheriting: this.checkInheritance(),
      inheritingFrom: getInheritance(),
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
      if (this.fromReset) {
        this.fromReset = false
        return
      }

      let index
      let difference = typeof newVal === 'string' ? '' : newVal.filter(x => !oldVal.includes(x))

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
    computeValueToShow() {
      return this.parseValue(getDefaultFieldValue(this.data.fieldConfig))
    },
    inheritValue(value) {
      this.value = value
      this.$nextTick(() => {
        this.fromReset = true
      })
    },
    parseValue(value) {
      return value.split(' ')
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
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
    reCheckProps() {
      this.isInheriting = this.checkInheritance()

      if (this.fromReset) {
        this.value = this.computeValueToShow()
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    },
    prepareToSave() {
      const isInheriting = this.checkIfIsInheriting(this.value)
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: isInheriting ? this.value : this.value.length ? this.value.join(' ') : 'normal'
      }

      saveFieldData(data)
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>