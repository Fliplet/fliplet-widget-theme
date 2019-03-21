<template>
  <div v-if="showField" class="align-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow }">
    <div class="wrapper">
      <div class="align-field-container">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + orientationSufix" :name="'align-' + orientation" :value="prop" v-model="value">
          <label :for="'radio-' + prop + orientationSufix">
            <span :class="'check-icon check-align-' + prop + orientationSufix"></span>
          </label>
        </div>
      </div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getFieldName,
  saveFieldData, checkLogic, getInheritance } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      property: undefined,
      value: getDefaultFieldValue(this.data.fieldConfig),
      properties: this.data.fieldConfig.properties,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      orientation: this.data.fieldConfig.orientation,
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
    computeValueToShow() {
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

      if (this.fromReset) {
        this.value = this.computeValueToShow()
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
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>