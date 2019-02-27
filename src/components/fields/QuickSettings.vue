<template>
  <div class="quick-settings-holder clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ componentConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-for="(variable, idx) in variables"> 
        <div class="settings-field-holder">
          <component v-for="(field, index) in variable.fields" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(index)"></component>
          <div class="label-holder">{{ variable.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'
import ColorField from './ColorField'
import FontField from './FontField'

export default {
  data() {
    return {
      variables: this.computeVars()
    }
  },
  props: {
    componentConfig: Object,
    componentIndex: Number,
    themeInstance: Object,
    webFonts: Array,
    customFonts: Array
  },
  components: {
    ColorField,
    FontField
  },
  methods: {
    componentType(fieldType) {
      return `${fieldType}-field`
    },
    fieldData(field) {
      const data = {
        fieldConfig: field
      }

      if (field.type === 'font') {
        data.webFonts = this.webFonts
        data.customFonts = this.customFonts
      }

      return data
    },
    savedValue(index) {
      return this.variables[index].value
    },
    computeVars() {
      const vars = []
      const newObj = {}

      this.componentConfig.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          newObj.value = this.themeInstance.settings
            && this.themeInstance.settings.values
            && this.themeInstance.settings.values[field.name]
            ? this.themeInstance.settings.values[field.name] : field.default

          _.extend(this.componentConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.componentConfig.variables
    }
  }
}
</script>