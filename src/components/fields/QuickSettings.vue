<template>
  <div class="quick-settings-holder clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ componentConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-if="notMobile">
        <div class="inherit-settings-holder" :class="{ 'active': inheritSettings }">
          <label class="switch">
            <input type="checkbox" v-model="inheritSettings">
            <span class="slider round"></span>
          </label>
          <span class="label-holder">Inherit styles from mobile - <template v-if="inheritSettings">On</template><template v-else>Off</template></span>
        </div>
      </template>
      <template v-if="!inheritSettings || !notMobile" v-for="(variable, idx) in variables"> 
        <div class="settings-field-holder">
          <component v-for="(field, index) in variable.fields" :key="index" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(index)"></component>
          <div class="label-holder">{{ variable.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state } from '../../store'
import ColorField from './ColorField'
import FontField from './FontField'

export default {
  data() {
    return {
      state,
      notMobile: state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false,
      inheritSettings: this.getInheritance(),
      variables: this.computeVars()
    }
  },
  props: {
    componentConfig: Object
  },
  components: {
    ColorField,
    FontField
  },
  methods: {
    getInheritance() {
      const context = state.componentContext == 'Mobile' ? '' : state.componentContext
      const savedValue = state.themeInstance.settings.inheritance['sampleQuickSettings' + context]
      return typeof savedValue !== 'undefined' ? savedValue : this.componentConfig.inheritSettings
    },
    componentType(fieldType) {
      return `${fieldType}-field`
    },
    fieldData(field) {
      const data = {
        fieldConfig: field
      }

      if (field.type === 'font') {
        data.webFonts = state.fonts.web
        data.customFonts = state.fonts.custom
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
          newObj.value = state.themeInstance.settings
            && state.themeInstance.settings.values
            && state.themeInstance.settings.values[field.name]
            ? state.themeInstance.settings.values[field.name] : field.default

          _.extend(this.componentConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.componentConfig.variables
    }
  }
}
</script>