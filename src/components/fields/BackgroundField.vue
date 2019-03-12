<template>
  <div v-if="showField" class="background-field-holder" :class="{ 'full-width': isFullRow }">
    <div class="radio-holder inline-circle" v-for="(prop, idx) in properties" :key="idx">
      <input type="radio" :id="'radio-background-' + prop.toLowerCase()" :name="'radio-background-' + data.fieldConfig.name" :value="prop" v-model="value">
      <label :for="'radio-background-' + prop.toLowerCase()">
        <span class="check-icon"></span> {{ prop }}
      </label>
    </div>
    <span v-if="!isInheriting" class="inheritance-warn"></span>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getFieldName, saveFieldData, checkLogic } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      properties: this.data.fieldConfig.properties,
      isFullRow: this.data.fieldConfig.isFullRow,
      isInheriting: this.checkInheritance(),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        checkLogic(this.data.fieldConfig, newVal)
        this.prepareToSave()
      }
    }
  },
  methods: {
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