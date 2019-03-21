<template>
  <div v-if="showField" class="background-field-holder" :class="{ 'full-width': isFullRow }">
    <div class="wrapper">
      <div class="radio-holder inline-circle" v-for="(prop, idx) in properties" :key="idx">
        <input type="radio" :id="'radio-background-' + prop.toLowerCase()" :name="'radio-background-' + data.fieldConfig.name" :value="prop" v-model="value">
        <label :for="'radio-background-' + prop.toLowerCase()">
          <span class="check-icon"></span> {{ prop }}
        </label>
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
      value: getDefaultFieldValue(this.data.fieldConfig),
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
      if (newVal !== oldVal && !this.fromReset) {
        checkLogic(this.data.fieldConfig, newVal)
        this.prepareToSave()
        return
      }

      this.fromReset = false
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