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
          <component v-for="(field, index) in variable.fields" :key="index" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(index)" :component-context="componentContext"></component>
          <div class="label-holder">{{ variable.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ColorField from './ColorField'
import FontField from './FontField'

export default {
  data() {
    return {
      notMobile: this.componentContext == 'Tablet' || this.componentContext == 'Desktop' ? true : false,
      inheritSettings: this.getInheritance(),
      variables: this.computeVars()
    }
  },
  props: {
    componentConfig: Object,
    themeInstance: Object,
    webFonts: Array,
    customFonts: Array,
    componentContext: String
  },
  components: {
    ColorField,
    FontField
  },
  methods: {
    getInheritance() {
      const context = this.componentContext == 'Mobile' ? '' : this.componentContext
      const savedValue = this.themeInstance.settings.inheritance['sampleQuickSettings' + context]
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