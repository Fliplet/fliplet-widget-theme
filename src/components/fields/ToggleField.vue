<template>
  <div v-if="showField" :class="'toggle-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <label class="switch">
        <input type="checkbox" v-model="valueToShow">
        <span class="slider round"></span>
      </label>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div class="field-label"><span v-if="label" >{{ label }} - </span>{{ compValue }}</div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName,
  saveFieldData, checkIsFieldChanged, checkLogic, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import toggleProperties from '../../libs/toggle-properties'
import { tooltips } from '../../libs/tooltips'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      properties: this.parseProperties(toggleProperties[this.data.fieldConfig.subtype]),
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
    valueToShow(newValue) {
      const valueProperty  = _.find(this.properties, { valueToShow: newValue })
      this.value = valueProperty.value
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal && !this.fromReset) {
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
    },
    compValue() {
      const valueProperty = _.find(this.properties, { valueToShow: this.valueToShow })
      return valueProperty.label
    }
  },
  methods: {
    parseProperties(properties) {
      const propsArr = []

      if (Array.isArray(properties)) {
        // Checks if it is an Array
        properties.forEach((prop) => {
          for (var key in prop) {
            var newObj = {
              label: prop[key].label,
              valueToShow: prop[key].value,
              value: key
            }
            propsArr.push(newObj)
          }
        })
      }

      return propsArr
    },
    setValues() {
      const valueProperty = _.find(this.properties, { value: this.value })
      this.valueToShow = valueProperty ? valueProperty.valueToShow : true
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
  created() {
    this.setValues()
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