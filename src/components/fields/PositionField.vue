<template>
  <div v-if="showField" class="position-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="wrapper">
      <div class="position-field-container">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + uuid" :name="'position-field-' + uuid" :value="prop" v-model="value">
          <label :for="'radio-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span :class="'check-icon check-position-' + prop"></span>
          </label>
        </div>        
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName,
  saveFieldData, checkLogic, checkIsFieldChanged, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import positionProperties from '../../libs/position-properties'
import { tooltips } from '../../libs/tooltips'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: positionProperties,
      label: this.data.fieldConfig.label,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
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
  methods: {
    getTooltip(prop) {
      switch(prop) {
        case 'relative':
          return 'Block stack'
          break;
        case 'absolute':
          return 'Relative to container'
          break;
        case 'fixed':
          return 'Relative to screen'
          break;
        default:
          return 'Block stack'
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