<template>
  <div class="select-field-holder">
    <div class="btn-group select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ valueToShow }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop.name == value }">
          <a href="#" @click.prevent="onValueChange(prop.value)">{{ prop.name }}</a>
        </li>
      </ul>
    </div>
    <span v-if="!isInheriting" class="inheritance-warn"></span>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      valueToShow: this.parseValueToShow(this.savedValue || getDefaultFieldValue(this.data.fieldConfig)),
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      properties: this.parseProperties(this.data.fieldConfig.properties),
      isInheriting: this.checkInheritance(),
      fieldsToHide: this.data.fieldConfig.hasOwnProperty('fieldsToHide') ? this.data.fieldConfig.fieldsToHide : []
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.checkLogic()
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
    reCheckInheritance() {
      this.isInheriting = this.checkInheritance()
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      }

      saveFieldData(data)
    },
    checkLogic() {
      if (this.data.fieldConfig.hasOwnProperty('logic')) {
        for (const prop in this.data.fieldConfig.logic) {
          // skip loop if the property is from prototype
          if (prop === this.value) {
            bus.$emit('check-field-visibility', this.data.fieldConfig, this.data.fieldConfig.logic[prop])
            continue
          }
        }
      }
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckInheritance)

    this.checkLogic()
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckInheritance)
  }
}
</script>