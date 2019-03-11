<template>
  <transition name="slide-in">
    <div v-if="state.componentOverlay && state.componentOverlay.isOpen" id="component-settings-overlay">
      <header>
        <p>{{ state.componentOverlay.name }} - ({{ state.componentContext }})</p>
        <span class="close-component-settings" @click.prevent="closeComponentSettings"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
      </header>
      <div v-if="variables && variables.length" class="settings-fields-holder">
        <div v-for="(variable, index) in variables" :key="index">
          <div class="form-group clearfix">
            <div class="col-xs-12 control-label">
              <label>{{ variable.description }}</label>
            </div>
            <template v-if="notMobile">
              <div class="inherit-settings-holder col-xs-12">
                <span class="label-holder">Inheriting styles from {{ inheritingFrom }}</span> <a href="#" @click.prevent="goToDeviceTab(inheritingFrom)">View</a>
          <div v-if="showNotInheritingInfo[index]" class="label-holder"><span class="inheritance-warn"></span> Specific {{ currentContext }} styels set (not inherited)</div>
              </div>
            </template>
            <div class="col-xs-12" :class="{ 'multi-field': variable.fields.length > 1, 'two-rows': variable.fields.length == 4 }">
              <component v-for="(field, idx) in variable.fields" :key="idx" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(field)"></component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { state, closeComponentSettings, saveInheritanceData } from '../../store'
import SizeField from '../fields/SizeField'
import FontStyleField from '../fields/FontStyleField'
import BorderStyleField from '../fields/BorderStyleField'
import SelectField from '../fields/SelectField'
import TextField from '../fields/TextField'
import ColorField from '../fields/ColorField'
import FontField from '../fields/FontField'
import deviceTypes from '../../libs/device-types'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      notMobile: undefined,
      variables: undefined,
      context: undefined,
      showNotInheritingInfo: [],
      inheritingFrom: this.getInheritance(),
      currentContext: state.componentContext.toLowerCase()
    }
  },
  components: {
    SizeField,
    FontStyleField,
    BorderStyleField,
    SelectField,
    TextField,
    ColorField,
    FontField
  },
  methods: {
    closeComponentSettings,
    getInheritance() {
      switch(state.componentContext) {
        case 'Desktop':
          return 'tablet'
          break;
        case 'Tablet':
          return 'mobile'
          break;
        default:
          ''
      }
    },
    goToDeviceTab(inheritingFrom) {
      const tab = _.find(deviceTypes, { type: inheritingFrom })
      bus.$emit('set-active-tab', tab, state.componentOverlay.data.component)
      closeComponentSettings()
    },
    setVariables() {
      this.notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false
      this.variables = this.computeVariables()
      this.context = state.componentOverlay.context == 'Mobile' ? '' : state.componentOverlay.context
      this.showNotInheritingInfo = this.existsFieldsNotInheriting()
    },
    computeVariables() {
      if (!state.componentOverlay.data) {
        return []
      }

      const isMobile = state.componentContext === 'Mobile'
      const variables = _.cloneDeep(state.componentOverlay.data.component.variables)
      variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const savedValue = this.savedValue(field)
          const savedLocalValue = _.find(state.savedFields.values, { name: (isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name) })

          // To check if the field is inheriting
          const defaultValue = isMobile
            ? field.default
            : field.breakpoints[state.componentContext.toLowerCase()].default
          const isInheriting = this.checkIfIsInheriting(defaultValue)

          field.inheriting = (!savedLocalValue && !savedValue && isInheriting)
        })
      })

      return variables
    },
    reComputeVariables() {
      this.variables = this.computeVariables()
      this.showNotInheritingInfo = this.existsFieldsNotInheriting()
      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    },
    existsFieldsNotInheriting() {
      const newArr = []
      this.variables.forEach((variable) => {
        const fields = _.filter(variable.fields, { inheriting: false })
        if (fields.length) {
          newArr.push(true)
          return
        }

        newArr.push(false)
      })

      return newArr
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
    savedValue(field) {
      const isMobile = state.componentContext === 'Mobile'
      let foundField = _.find(state.savedFields.values, { name: (isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name) })

      if (!foundField && state.componentOverlay.data && state.componentOverlay.data.instance.settings.values) {
        const savedValues = state.componentOverlay.data.instance.settings.values
        return state.componentContext !== 'Mobile' ? savedValues[field.name + state.componentContext] : savedValues[field.name]
      }

      return foundField.value
    }
  },
  mounted() {
    bus.$on('component-overlay-opened', this.setVariables)
    bus.$on('saved-fields-set', this.reComputeVariables)
  },
  destroyed() {
    bus.$off('component-overlay-opened', this.setVariables)
    bus.$off('saved-fields-set', this.reComputeVariables)
  } 
}
</script>