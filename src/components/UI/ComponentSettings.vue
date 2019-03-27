<template>
  <transition :name="transition">
    <div v-if="state.componentOverlay && state.componentOverlay.isOpen" id="component-settings-overlay">
      <header>
        <span v-if="state.componentMode" class="close-component-settings" @click.prevent="closeComponent"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
        <p>{{ state.componentOverlay.name }}</p>
        <span v-if="!state.componentMode" class="close-component-settings" @click.prevent="closeComponent"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
      </header>
      <!-- Nav tabs -->
      <ul class="nav nav-tabs breakpoint-tabs">
        <li v-for="(tab, index) in tabs" :id="tab.type" :class="{ active: activeTab == index }" :ref="index">
          <a :href="'#tab-' + tab.type" data-toggle="tab" @click="setActiveTab(tab)"><i :class="tab.icon"></i></a>
        </li>
      </ul>
      <div v-if="variables && variables.length" class="settings-fields-holder">
        <div v-for="(variable, index) in variables" v-if="showVariable(variable)" :key="index">
          <div class="form-group clearfix">
            <div class="col-xs-12 control-label">
              <label>{{ variable.description }}</label>
            </div>
            <template v-if="notMobile && !ignoreInheritance(variable)">
              <div class="inherit-settings-holder col-xs-12">
                <div v-if="showNotInheritingInfo[index]" class="label-holder"><span class="inheritance-warn"></span> Specific {{ currentContext }} styels set (not inherited)</div>
                <template v-else>
                  <span class="label-holder">Inheriting styles from {{ inheritingFrom }}</span> <a href="#" @click.prevent="goToDeviceTab(inheritingFrom)">View</a>
                </template>
              </div>
            </template>
            <div class="col-xs-12" :class="{ 'multi-field': variable.fields.length > 1 }">
              <template v-for="(field, idx) in checkForFontStyle(variable.fields)">
                <template v-if="Array.isArray(field)">
                  <div class="field-group-wrapper">
                    <component v-for="(groupedField, i) in field" :key="groupedComponentKey" v-if="showField(groupedField)" :is="componentType(groupedField.type)" :data="fieldData(groupedField)" :saved-value="checkSavedValue(groupedField)"></component>
                  </div>
                </template>
                <template v-else>
                  <component :key="componentKey" v-if="showField(field)" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="checkSavedValue(field)"></component>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { state, closeComponentSettings, saveInheritanceData,
  getInheritance, checkSavedValue, setComponentContext } from '../../store'
import SizeField from '../fields/SizeField'
import FontStyleField from '../fields/FontStyleField'
import BorderStyleField from '../fields/BorderStyleField'
import SelectField from '../fields/SelectField'
import TextField from '../fields/TextField'
import ColorField from '../fields/ColorField'
import FontField from '../fields/FontField'
import BackgroundField from '../fields/BackgroundField'
import ImageField from '../fields/ImageField'
import AlignField from '../fields/AlignField'
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
      inheritingFrom: undefined,
      inheritMap: {
        'tablet': 'mobile',
        'desktop': 'tablet'
      },
      currentContext: undefined,
      tabs: deviceTypes,
      activeTab: this.getActiveTab(),
      componentKey: 0,
      groupedComponentKey: 0
    }
  },
  components: {
    SizeField,
    FontStyleField,
    BorderStyleField,
    SelectField,
    TextField,
    ColorField,
    FontField,
    BackgroundField,
    ImageField,
    AlignField
  },
  computed: {
    transition() {
      return !state.componentMode ? 'slide-in' : ''
    }
  },
  methods: {
    checkSavedValue,
    closeComponent() {
      if (state.componentMode) {
        bus.$emit('close-appearance')
        return
      }
      bus.$emit('context-changed')
      closeComponentSettings()
    },
    forceRerender() {
      this.groupedComponentKey += 1
      this.componentKey += 1
      this.setVariables()
    },
    setActiveTab(tab) {
      tab = tab || this.tabs[0]
      const tabIndex = _.findIndex(this.tabs, { type: tab.type })
      this.activeTab = tabIndex
      setComponentContext(tab.name, true)
      this.forceRerender()
    },
    getActiveTab() {
      return _.findIndex(deviceTypes, { name: state.componentContext })
    },
    checkForFontStyle(fields) {
      const clonedFields = _.cloneDeep(fields)
      // Get the index of the first 'font-style' field
      const firsIndex = _.findIndex(clonedFields, { type: 'font-style' })
      // Get the array with all the 'font-style' fields
      const fontTypeArray = _.filter(clonedFields, { type: 'font-style' })

      // If there is an index
      if (firsIndex > -1) {
        // Remove the fields from the 'fields' array
        _.remove(clonedFields, { type: 'font-style' })
        // The add them as an array field back in in the index saved above
        clonedFields.splice(firsIndex, 0, fontTypeArray)
      }

      return clonedFields
    },
    ignoreInheritance(object) {
      const toHide = object.hide
      const context = state.componentContext.toLowerCase()

      if (toHide && Array.isArray(toHide)) {
        return toHide.indexOf(this.inheritMap[context]) > -1
      }

      return false
    },
    showVariable(variable) {
      const toHide = variable.hide
      const context = state.componentContext.toLowerCase()

      if (toHide && Array.isArray(toHide)) {
        return toHide.indexOf(context) < 0
      }

      return true
    },
    showField(field) {
      const toHide = field.hide
      const context = state.componentContext.toLowerCase()

      if (toHide && Array.isArray(toHide)) {
        return toHide.indexOf(context) < 0
      }

      return true
    },
    goToDeviceTab(inheritingFrom) {
      const tab = _.find(deviceTypes, { type: inheritingFrom })
      this.setActiveTab(tab)
    },
    setVariables() {
      this.notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false
      this.variables = this.computeVariables()
      this.context = state.componentOverlay.context == 'Mobile' ? '' : state.componentOverlay.context
      this.showNotInheritingInfo = this.checkFieldsNotInheriting()
      this.currentContext = state.componentContext.toLowerCase()
      this.inheritingFrom = getInheritance()
    },
    computeVariables(toRecompute) {
      if (!state.componentOverlay.data) {
        return []
      }

      const isMobile = state.componentContext === 'Mobile'
      const variables = _.cloneDeep(toRecompute && this.variables ? this.variables : state.componentOverlay.data.component.variables)
      variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const savedValue = checkSavedValue(field)
          const savedLocalValue = _.find(state.savedFields.values, { name: (isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name) })

          // To check if the field is inheriting
          const defaultValue = isMobile
            ? field.default
            : field.breakpoints[state.componentContext.toLowerCase()].default
          const isDefaultInheriting = this.checkIfIsInheriting(defaultValue)
          const isSavedValueInheriting = this.checkIfIsInheriting(savedValue)
          const isLocalSavedValueInheriting = savedLocalValue ? this.checkIfIsInheriting(savedLocalValue.value) : undefined

          field.inheriting = !!((isLocalSavedValueInheriting || (!isLocalSavedValueInheriting && isSavedValueInheriting) || (!savedLocalValue && !savedValue && isDefaultInheriting)) || (this.ignoreInheritance(variable) || this.ignoreInheritance(field)))
        })
      })

      return variables
    },
    reComputeVariables(toRecompute) {
      this.variables = this.computeVariables(toRecompute)
      this.showNotInheritingInfo = this.checkFieldsNotInheriting()
      this.notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false
      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    },
    checkFieldsNotInheriting() {
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
    runFieldLogic(fieldConfig, logic) {
      this.variables.forEach((variable, index) => {
        const field = _.find(variable.fields, { name: fieldConfig.name })

        if (field) {
          variable.fields.forEach((field, index) => {
            if (logic.hide) {
              if (logic.hide.indexOf(field.name) >= 0){
                field.showField = false
              }
            }
            if (logic.show) {
              if (logic.show.indexOf(field.name) >= 0){
                field.showField = true
              }
            }
          })
        }
      })

      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    }
  },
  mounted() {
    bus.$on('component-overlay-opened', this.setVariables)
    bus.$on('saved-fields-set', () => {
      this.reComputeVariables(true)
    })
    bus.$on('check-field-visibility', this.runFieldLogic)
  },
  destroyed() {
    bus.$off('component-overlay-opened', this.setVariables)
    bus.$off('saved-fields-set', () => {
      this.reComputeVariables(true)
    })
    bus.$off('check-field-visibility', this.runFieldLogic)
  } 
}
</script>