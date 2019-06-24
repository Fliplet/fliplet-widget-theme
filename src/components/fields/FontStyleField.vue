<template>
  <div v-if="showField" :class="'style-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="style-field-container">
        <div class="checkbox-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="checkbox" :id="'checkbox-' + prop + uuid" :value="prop" v-model="value">
          <label :for="'checkbox-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span class="check-icon" :class="{ 'light-button': prop === 'lighter' }">
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
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, checkIsFieldChanged, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import fontProperties from '../../libs/font-style-properties'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: this.parseValue(getCurrentFieldValue(this.data.fieldConfig)),
      properties: fontProperties[this.data.fieldConfig.properties],
      subType: this.data.fieldConfig.subType,
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      fromReset: false,
      uuid: Fliplet.guid()
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
      if (this.fromReset) {
        this.fromReset = false
        return
      }

      let index
      let difference = typeof newVal === 'string' ? '' : _.difference(newVal, oldVal)

      if (newVal.indexOf('normal') > -1) {
        // Remove "normal"
        index = newVal.indexOf('normal')
        if (index > -1) {
          newVal.splice(index, 1)
        }
      }
      if (newVal.indexOf('none') > -1) {
        // Remove "none"
        index = newVal.indexOf('none')
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

      // Clean of everything else other than the possible options
      if (Array.isArray(newVal)) {
        newVal.forEach((value, index) => {
          if (value != 'normal'
            && value != 'bold'
            && value != 'lighter'
            && value != 'underline'
            && value != 'italic') {
            newVal.splice(index, 1)
          }
        })
      }

      this.value = newVal
      const compiledValue = this.checkIfIsInheriting(newVal)
        ? newVal
        : Array.isArray(newVal) && newVal.length
          ? newVal.join(' ')
          : this.subType === 'decoration' ? 'none' : 'normal'
      sendCssToFrame(compiledValue, this.data.fieldConfig)

      this.$nextTick(() => {
        this.prepareToSave()
      })
    }
  },
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    getTooltip(prop) {
      switch(prop) {
        case 'bold':
          return 'Bold'
          break;
        case 'lighter':
          return 'Lighter'
          break;
        case 'italic':
          return 'Italic'
          break;
        case 'underline':
          return 'Underline'
          break;
        default:
          return ''
      }
    },
    getValue() {
      return this.parseValue(getCurrentFieldValue(this.data.fieldConfig))
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
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)

      if (this.fromReset) {
        this.value = this.getValue()
        sendCssToFrame(this.value, this.data.fieldConfig)
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    },
    prepareToSave() {
      const isInheriting = this.checkIfIsInheriting(this.value)
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: isInheriting ? this.value : Array.isArray(this.value) && this.value.length ? this.value.join(' ') : this.subType === 'decoration' ? 'none' : 'normal'
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