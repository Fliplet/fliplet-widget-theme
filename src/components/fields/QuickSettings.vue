<template>
  <div class="quick-settings-holder clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ componentConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-if="notMobile">
        <div class="inherit-settings-holder" :class="{ 'active': inheritSettings }">
          <label class="switch">
            <input type="checkbox" v-model="inheritSettings" @click="checkSetting(componentConfig)">
            <span class="slider round"></span>
          </label>
          <span class="label-holder">Inherit styles from mobile - <template v-if="inheritSettings">On</template><template v-else>Off</template></span>
        </div>
      </template>
      <template v-if="!inheritSettings || !notMobile" v-for="(variable, idx) in variables"> 
        <div class="settings-field-holder">
          <component v-for="(field, index) in variable.fields" :key="index" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(idx, index)"></component>
          <div class="label-holder">{{ variable.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, saveInheritanceData,
  setNewSavedValues, removeSavedValues } from '../../store'
import bus from '../../libs/bus'
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
    checkSetting(config) {
      const obj = {
        name: config.id + state.componentContext,
        value: !this.inheritSettings
      }

      if (obj.value) {
        this.deleteAllVariables()
      } else {
        this.saveAllVariables()
      }

      saveInheritanceData(obj)
    },
    saveAllVariables() {
      const listOfVariables = []
      this.variables.forEach((variable, index) => {
        const fields = Array.isArray(variable.fields) ? variable.fields : [variable];
        fields.forEach((field, idx) => {
          const name = state.componentContext === 'Mobile'
            ? field.name
            : field.breakpoints[state.componentContext.toLowerCase()].name
          const obj = {
            name: name,
            value: field.default
          }

          listOfVariables.push(obj)
        })
      })
      setNewSavedValues(listOfVariables)
    },
    deleteAllVariables() {
      const listOfVariableNames = []
      this.variables.forEach((variable, index) => {
        const fields = Array.isArray(variable.fields) ? variable.fields : [variable];
        fields.forEach((field, idx) => {
          const name = state.componentContext === 'Mobile'
            ? field.name
            : field.breakpoints[state.componentContext.toLowerCase()].name
          const defaultValue = state.componentContext === 'Mobile'
            ? field.default
            : field.breakpoints[state.componentContext.toLowerCase()].default

          // Reset the field value
          field.value = defaultValue
          listOfVariableNames.push(name)
        })
      })
      removeSavedValues(listOfVariableNames)
    },
    getInheritance() {
      const savedValue = state.themeInstance.settings.inheritance && state.themeInstance.settings.inheritance[this.componentConfig.id + state.componentContext]
      return typeof savedValue !== 'undefined' ? savedValue : this.componentConfig.inheritFromMobile
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
    savedValue(variableIndex, fieldIndex) {
      return this.variables[variableIndex].fields[fieldIndex].value
    },
    computeVars() {
      const vars = []
      const newObj = {}
      this.componentConfig.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const fieldName = state.componentContext === 'Mobile'
            ? field.name
            : field.breakpoints[state.componentContext.toLowerCase()].name
          const defaultValue = state.componentContext === 'Mobile'
            ? field.default
            : field.breakpoints[state.componentContext.toLowerCase()].default

          newObj.value = state.themeInstance.settings
            && state.themeInstance.settings.values
            && state.themeInstance.settings.values[fieldName]
            ? state.themeInstance.settings.values[fieldName] : defaultValue

          _.extend(this.componentConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.componentConfig.variables
    }
  }
}
</script>