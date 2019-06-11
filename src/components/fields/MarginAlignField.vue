<template>
  <div v-if="showField" :class="'align-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="align-field-container">
        <template v-for="(prop, idx) in properties">
          <div v-if="prop != 'custom'" class="radio-holder inline-boxed">
            <input type="radio" :id="'radio-' + prop + uuid" :name="'margin-align-' + uuid" :value="prop" v-model="value">
            <label :for="'radio-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
              <span :class="'check-icon check-align-' + prop"></span>
            </label>
          </div>
          <div v-else class="radio-holder-custom">
            <input type="radio" :id="'radio-' + prop + uuid" name="margin-align" :value="prop" v-model="value">
            <label :for="'radio-' + prop + uuid">
              <span class="check-icon">Custom</span>
            </label>
          </div>
        </template>
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName, sendCssToFrame,
  checkMarginLogic, saveFieldData, checkIsFieldChanged } from '../../store'
import InheritDot from '../UI/InheritDot'
import marginAlignProperties from '../../libs/margin-align-properties'
import { tooltips } from '../../libs/tooltips'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: marginAlignProperties,
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
        checkMarginLogic(this.data.fieldConfig, newVal)
        sendCssToFrame(newVal, this.data.fieldConfig)
        this.prepareToSave()
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
        case 'left':
          return 'Left'
          break;
        case 'center':
          return 'Center'
          break;
        case 'right':
          return 'Right'
          break;
        default:
          return 'Left'
      }
    },
    getValueToShow() {
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
        this.value = this.getValueToShow()
        checkMarginLogic(this.data.fieldConfig, this.value)
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    checkMarginLogic(this.data.fieldConfig, this.value, true)
    // Start Bootstrap tooltips
    tooltips()
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>