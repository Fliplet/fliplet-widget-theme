<template>
  <div v-if="showField" class="select-field-holder" :class="{ 'full-width': isFullRow }">
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
    <span v-if="!isInheriting" class="inheritance-warn"></span>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName, checkLogic } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      valueToShow: this.parseValueToShow(this.savedValue || getDefaultFieldValue(this.data.fieldConfig)),
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      label: this.data.fieldConfig.label,
      properties: this.parseProperties(this.data.fieldConfig.properties),
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
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)

    checkLogic(this.data.fieldConfig, this.value)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>