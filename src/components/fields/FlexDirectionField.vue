<template>
  <div v-if="showField" :class="'flex-direction-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="flex-field-container">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + uuid" :name="'flex-field-' + uuid" :value="prop" v-model="value">
          <label :for="'radio-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span :class="'check-icon check-flex-' + prop"></span>
          </label>
        </div>        
      </div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div v-if="label" class="field-label">{{ label }}</div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName,
  saveFieldData, checkIsFieldChanged, checkLogic, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import displayProperties from '../../libs/display-properties'
import { tooltips } from '../../libs/tooltips'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: displayProperties.flexDirection,
      label: this.data.fieldConfig.label,
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
      if (newVal != oldVal && !this.fromReset) {
        if (newVal === 'column' || newVal === 'column-reverse') {
          bus.$emit('flex-direction-changed', true)
        } else {
          bus.$emit('flex-direction-changed', false)
        }
        checkLogic(this.data.fieldConfig, newVal)
        sendCssToFrame(newVal, this.data.fieldConfig)

        this.$nextTick(() => {
          this.prepareToSave()
        })
        return
      }

      this.fromReset = false
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
        case 'row':
          return 'Left to right'
          break;
        case 'row-reverse':
          return 'Right to left'
          break;
        case 'column':
          return 'Top to bottom'
          break;
        case 'column-reverse':
          return 'Bottom to top'
          break;
        default:
          return 'Left to right'
      }
    },
    getValue() {
      return getCurrentFieldValue(this.data.fieldConfig)
    },
    inheritValue(value) {
      this.value = value
      this.$nextTick(() => {
        this.fromReset = true
      })
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value 
      }

      saveFieldData(data)
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      if (this.value === 'column' || this.value === 'column-reverse') {
        bus.$emit('flex-direction-changed', true)
      } else {
        bus.$emit('flex-direction-changed', false)
      }

      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)

      if (this.fromReset) {
        this.value = this.getValue()
        checkLogic(this.data.fieldConfig, this.value)
        sendCssToFrame(this.value, this.data.fieldConfig)
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    checkLogic(this.data.fieldConfig, this.value)
    // Start Bootstrap tooltips
    tooltips()
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>