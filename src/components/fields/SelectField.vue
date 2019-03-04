<template>
  <div class="select-field-holder">
    <div class="btn-group select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ value }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop.name == value }">
          <a href="#" @click.prevent="onValueChange(prop.value)">{{ prop.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {
      value: this.parseValue(this.savedValue || this.data.fieldConfig.default),
      properties: this.parseProperties(this.data.fieldConfig.properties)
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareToSave()
      }
    }
  },
  methods: {
    parseValue(value) {
      const properties = this.data.fieldConfig.properties
      // Checks if it is an object
      if (properties instanceof Object && properties.constructor === Object) {
        return properties[value]
      }

      // Checks if it is an Array
      if (Array.isArray(properties)) {
        return properties
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
      this.value = this.parseValue(value)
    },
    prepareToSave() {
      const data = {
        name: this.data.fieldConfig.name,
        value: this.value
      }

      saveFieldData(data)
    }
  }
}
</script>