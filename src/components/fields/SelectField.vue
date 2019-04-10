<template>
  <div v-if="showField" class="select-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow }">
    <div class="wrapper">
      <div class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ valueToShow }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop.value == value }">
            <a href="#" @click.prevent="onValueChange(prop.value)">{{ prop.name }}</a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, checkLogic, getInheritance } from '../../store'
import InheritDot from '../UI/InheritDot'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      properties: this.parseProperties(this.data.fieldConfig.properties),
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      isInheriting: this.checkInheritance(),
      inheritingFrom: getInheritance(),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  components: {
    InheritDot
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
    setValues() {
      this.valueToShow = this.value
    },
    computeValueToShow() {
      return this.parseValueToShow(getDefaultFieldValue(this.data.fieldConfig))
    },
    inheritValue(value) {
      this.value = value
    },
    parseValueToShow(value) {
      const properties = this.data.fieldConfig.properties
      // Checks if it is an object
      if (properties instanceof Object && properties.constructor === Object) {
        return properties[value]
      }

      // Checks if it is an Array
      if (Array.isArray(properties)) {
        const propIndex = _.findIndex(properties, (prop) => {
          return prop == value
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
    onValueChange(value) {
      this.valueToShow = this.parseValueToShow(value)
      this.value = value
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.valueToShow = this.computeValueToShow()
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