<template>
  <div class="quick-settings-holder clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ componentConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-if="notMobile">
        <div class="inherit-settings-holder">
          <div v-if="showNotInheritingInfo" class="label-holder"><span class="inheritance-warn"></span> Specific {{ currentContext }} styels set (not inherited)</div>
          <template v-else>
            <span class="label-holder">Inheriting styles from {{ inheritingFrom }}</span> <a href="#" @click.prevent="goToDeviceTab">View</a>
          </template>
        </div>
      </template>
      <template v-for="(variable, idx) in variables">
        <div class="settings-field-holder">
          <template v-for="(field, index) in variable.fields">
            <component :is="componentType(field.type)" :data="fieldData(field)" :saved-value="getSavedValue(idx, index)"></component>
            <div class="label-holder">{{ variable.description }}</div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getInheritance } from '../../store'
import deviceTypes from '../../libs/device-types'
import bus from '../../libs/bus'
import ColorField from './ColorField'
import FontField from './FontField'

export default {
  data() {
    return {
      state,
      notMobile: state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false,
      inheritingFrom: getInheritance(),
      currentContext: state.componentContext.toLowerCase(),
      variables: this.computeVariables(),
      showNotInheritingInfo: this.checkFieldsNotInheriting()
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
    goToDeviceTab() {
      const tab = _.find(deviceTypes, { type: this.inheritingFrom })
      bus.$emit('set-active-tab', tab)
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
    getSavedValue(variableIndex, fieldIndex) {
      const field = this.variables[variableIndex].fields[fieldIndex]
      const isMobile = state.componentContext === 'Mobile'
      const localSavedValue = _.find(state.savedFields.values, { name: (isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name) })

      return localSavedValue ? localSavedValue.value : field.value
    },
    checkFieldsNotInheriting() {
      return this.componentConfig.variables.some((variable) => {
        const fields = _.filter(variable.fields, { inheriting: false })
        if (fields.length) {
          return true
        }

        return
      })
    },
    checkIfIsInheriting(value) {
      // Checks if the value matches a variable name
      const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined
      // If the value matches to a variable get the name of the variable
      const variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined
      // Checks if the value matches the 'inherit-x' reserved key
      const matchInherit = typeof value === 'string' ? value.match(/^inherit-([a-z]+)$/) : undefined
      // If the value matches the 'inherit-x' reserved key get the inheritance key
      const inherit = matchInherit && matchInherit.length ? matchInherit[1] : undefined

      return inherit || variableName ? true : false
    },
    computeVariables() {  
      // Processing variables    
      this.componentConfig.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const fieldName = state.componentContext === 'Mobile'
            ? field.name
            : field.breakpoints[state.componentContext.toLowerCase()].name
          const savedValue = state.themeInstance.settings
            && state.themeInstance.settings.values
            && state.themeInstance.settings.values[fieldName]
          const savedLocalValue = _.find(state.savedFields.values, { name: fieldName })

          let savedWidgetValue
          let savedLocalWidgetValue
          if (state.componentMode && state.themeInstance.settings) {
            const widgetFound = _.find(state.themeInstance.settings.widgetInstances, { id: state.componentId })
            const localWidgetFound = _.find(state.savedFields.widgetInstances, { id: state.componentId })
            savedWidgetValue = widgetFound ? widgetFound.values[fieldName] : undefined
            savedLocalWidgetValue = localWidgetFound ? localWidgetFound.values[fieldName] : undefined
          }

          const defaultValue = state.componentContext === 'Mobile'
            ? field.default
            : field.breakpoints[state.componentContext.toLowerCase()].default

          // To check if the field is inheriting
          const isDefaultInheriting = this.checkIfIsInheriting(defaultValue)
          const isSavedValueInheriting = this.checkIfIsInheriting(savedValue)
          const isLocalSavedValueInheriting = savedLocalValue ? this.checkIfIsInheriting(savedLocalValue.value) : undefined
          const isWidgetSavedValueInheriting = savedWidgetValue ? this.checkIfIsInheriting(savedWidgetValue) : undefined
          const isLocalWidgetSavedValueInheriting = savedLocalWidgetValue ? this.checkIfIsInheriting(savedLocalWidgetValue) : undefined

          const newObj = {
            value: state.componentMode
              ? savedLocalWidgetValue
                ? savedLocalWidgetValue
                : savedWidgetValue
                  ? savedWidgetValue
                  : savedLocalValue
                    ? savedLocalValue.value
                    : savedValue|| getDefaultFieldValue(field)
              : savedLocalValue ? savedLocalValue.value : savedValue || getDefaultFieldValue(field),
            inheriting: state.componentMode
              ? !!(isLocalWidgetSavedValueInheriting
                  || (!savedLocalWidgetValue && isWidgetSavedValueInheriting)
                  || (!savedLocalWidgetValue && !savedWidgetValue && isLocalSavedValueInheriting)
                  || (!savedLocalWidgetValue && !savedWidgetValue && !savedLocalValue && isSavedValueInheriting)
                  || (!savedLocalWidgetValue && !savedWidgetValue && !savedLocalValue && !savedValue && isDefaultInheriting)
                )
              : !!(isLocalSavedValueInheriting || (!savedLocalValue && isSavedValueInheriting) || (!savedLocalValue && !savedValue && isDefaultInheriting))
          }

          _.extend(this.componentConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.componentConfig.variables
    },
    reComputeVariables() {
      this.variables = this.computeVariables()
      this.showNotInheritingInfo = this.checkFieldsNotInheriting()
      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    }
  },
  mounted() {
    bus.$on('saved-fields-set', this.reComputeVariables)
  },
  destroyed() {
    bus.$off('saved-fields-set', this.reComputeVariables)
  }
}
</script>