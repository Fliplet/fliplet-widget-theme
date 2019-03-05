<template>
  <div class="border-style-field-holder">
    <div class="btn-group select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <template v-if="value == 'none'">
          None
        </template>
        <span v-else class="border-style" :style="'border-style: ' + value"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === value }">
          <a href="#" @click.prevent="onValueChange(prop)">
            <template v-if="prop == 'none'">
              None
            </template>
            <span v-else class="border-style" :style="'border-style: ' + prop"></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData } from '../../store'

export default {
  data() {
    return {
      state,
      value: this.savedValue || this.getDefaultValue(),
      properties: this.data.fieldConfig.properties
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
    getDefaultValue() {
      const defaultValue = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.default
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].default

      return defaultValue
    },
    getFieldName() {
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.name
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].name

      return fieldName
    },
    onValueChange(value) {
      this.value = value
    },
    prepareToSave() {
      const data = {
        name: this.getFieldName(),
        value: this.value
      }

      saveFieldData(data)
    }
  }
}
</script>