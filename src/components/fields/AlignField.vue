<template>
  <div v-if="showField" class="align-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="wrapper">
      <div class="align-field-container">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + orientationSufix + uuid" :name="'align-' + orientation" :value="prop" v-model="value">
          <label :for="'radio-' + prop + orientationSufix + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span :class="'check-icon check-align-' + prop + orientationSufix"></span>
          </label>
        </div>
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getFieldName,
  saveFieldData, checkLogic, checkIsFieldChanged } from '../../store'
import InheritDot from '../UI/InheritDot'
import alignProperties from '../../libs/align-properties'
import { tooltips } from '../../libs/tooltips'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      properties: alignProperties[this.data.fieldConfig.properties],
      label: this.data.fieldConfig.label,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      orientation: this.data.fieldConfig.orientation,
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
      if (newVal !== oldVal && !this.fromReset) {
        checkLogic(this.data.fieldConfig, newVal)
        this.prepareToSave()
        return
      }

      this.fromReset = false
    }
  },
  computed: {
    orientationSufix() {
      let sufix = ''
      if (this.orientation === 'horizontal') {
        sufix = '-h'
        return sufix
      }
      if (this.orientation === 'vertical') {
        sufix = '-v'
        return sufix
      }
      return sufix
    }
  },
  methods: {
    getTooltip(prop) {
      switch(prop) {
        case 'left':
          return 'Left'
          break;
        case 'right':
          return 'Right'
          break;
        case 'top':
          return 'Top'
          break;
        case 'bottom':
          return 'Bottom'
          break;
        case 'center':
          return 'Center'
          break;
        default:
          return 'Center'
      }
    },
    getValue() {
      return getDefaultFieldValue(this.data.fieldConfig)
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