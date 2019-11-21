<template>
  <div v-if="showField" :class="'select-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" ref="dropdownToggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ valueToShow }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop.value === value }">
            <a href="#" @click.prevent="onValueChange(prop.value)">{{ prop.name }}</a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label" @click.prevent="toggleDropdown">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getCurrentFieldValue,
  getFieldName, checkLogic, checkIsFieldChanged, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import selectProperties from '../../libs/select-properties'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      properties: this.parseProperties(this.data.fieldConfig.subtype
        ? selectProperties[this.data.fieldConfig.subtype]
        : this.data.fieldConfig.properties),
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
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
      if (newVal !== oldVal) {
        checkLogic(this.data.fieldConfig, newVal)
        sendCssToFrame(newVal, this.data.fieldConfig)

        this.$nextTick(() => {
          this.prepareToSave()
        })
      }
    }
  },
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    setValues() {
      this.valueToShow = this.value
    },
    getValueToShow() {
      return this.parseValueToShow(getCurrentFieldValue(this.data.fieldConfig))
    },
    inheritValue(value) {
      this.value = value
    },
    parseValueToShow(value) {
      const properties = this.data.fieldConfig.subtype
        ? selectProperties[this.data.fieldConfig.subtype]
        : this.data.fieldConfig.properties
      // Checks if it is an object
      if (properties instanceof Object && properties.constructor === Object) {
        return properties[value]
      }

      // Checks if it is an Array
      if (Array.isArray(properties)) {
        const propIndex = _.findIndex(properties, (prop) => {
          return prop === value
        });
        return properties[propIndex]
      }
    },
    parseProperties(properties) {
      const propsArr = []

      // Checks if it is an object
      if (properties instanceof Object && properties.constructor === Object) {
        for (var prop in properties) {
          var newObj = {
            name: properties[prop],
            value: prop
          }
          propsArr.push(newObj)
        }
      } else if (Array.isArray(properties)) {
        // Checks if it is an Array
        properties.forEach((prop) => {
          var newObj = {
            name: prop,
            value: prop
          }
          propsArr.push(newObj)
        })
      }

      return propsArr
    },
    toggleDropdown(event) {
      event.preventDefault()
      event.stopPropagation()
      $(this.$refs.dropdownToggle).dropdown('toggle')
    },
    onValueChange(value) {
      this.valueToShow = this.parseValueToShow(value)
      this.value = value
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)
      this.valueToShow = this.getValueToShow()
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      }

      saveFieldData(data)
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