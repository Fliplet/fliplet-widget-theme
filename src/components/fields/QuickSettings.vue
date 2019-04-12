<template>
  <div class="quick-settings clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ groupConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-if="notMobile">
        <div class="inherit-settings">
          <div v-if="showNotInheritingInfo" class="label-holder"><span class="inheritance-warn"></span> Specific {{ currentContext }} styels set (not inherited)</div>
          <template v-else>
            <span class="label-holder">Inheriting styles from {{ inheritingFrom }}</span> <a href="#" @click.prevent="goToDeviceTab">View</a>
          </template>
        </div>
      </template>
      <template v-for="(variable, idx) in variables">
        <div class="quick-settings-field">
          <template v-for="(field, index) in variable.fields">
            <component :is="fieldType(field.type)" :data="fieldData(field)"></component>
            <div class="label-holder">{{ variable.description }}</div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getInheritance, checkSavedValue } from '../../store'
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
      showNotInheritingInfo: this.areNotInheriting()
    }
  },
  props: {
    groupConfig: Object
  },
  components: {
    ColorField,
    FontField
  },
  methods: {
    goToDeviceTab() {
      const tab = _.find(deviceTypes, { type: this.inheritingFrom })
      bus.$emit('context-switch', tab)
    },
    fieldType(fieldType) {
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
    areNotInheriting() {
      return this.groupConfig.variables.some((variable) => {
        const fields = _.filter(variable.fields, { inheriting: false })
        if (fields.length) {
          return true
        }

        return
      })
    },
    isInheriting(value) {
      if (!value) {
        return false
      }
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
      this.groupConfig.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const values = checkSavedValue(field, true)

          // To check if the field is inheriting
          const isDefaultInheriting = this.isInheriting(values.defaultValue)
          const isSavedValueInheriting = this.isInheriting(values.generalSavedValue)
          const isLocalSavedValueInheriting = this.isInheriting(values.generalLocalSavedValue)

          const newObj = {
            value: values.fieldValue,
            inheriting: !!(
              isLocalSavedValueInheriting
              || (!values.generalLocalSavedValue && isSavedValueInheriting)
              || (!values.generalLocalSavedValue && !values.generalSavedValue && isDefaultInheriting)
            )
          }

          _.extend(this.groupConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.groupConfig.variables
    },
    reSetVariables() {
      this.variables = this.computeVariables()
      this.showNotInheritingInfo = this.areNotInheriting()
      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    }
  },
  mounted() {
    bus.$on('saved-fields-set', this.reSetVariables)
  },
  destroyed() {
    bus.$off('saved-fields-set', this.reSetVariables)
  }
}
</script>