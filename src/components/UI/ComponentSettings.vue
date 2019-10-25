<template>
  <transition :name="transition">
    <div v-if="state.appearanceGroupOverlay && state.appearanceGroupOverlay.isOpen" id="component-settings-overlay" ref="componentoverlay">
      <header>
        <p>{{ state.appearanceGroupOverlay.name }}</p>
        <span class="close-component-settings" @click.prevent="closeGroup"><i class="fa fa-times-thin fa-2x"></i></span>
      </header>
      <!-- Nav tabs -->
      <ul class="nav nav-tabs breakpoint-tabs">
        <li v-for="(tab, index) in tabs" :id="tab.type" :class="{ active: state.activeTab == index }" :ref="index">
          <a :href="'#tab-' + tab.type" data-toggle="tab" @click="handleContextSwitch(tab)"><i :class="tab.icon"></i></a>
        </li>
      </ul>
      <div v-if="variables && variables.length" class="settings-fields">
        <div v-for="(variable, index) in variables" v-if="showVariable(variable)" :key="index">
          <div class="form-group clearfix">
            <div class="col-xs-12 control-label">
              <label>{{ variable.description }}</label>
            </div>
            <template v-if="notMobile && !ignoreInheritance(variable)">
              <div class="inherit-settings col-xs-12">
                <div v-if="showNotInheritingInfo[index]" class="label-holder"><span class="inheritance-warn"></span> Specific {{ currentContext }} styles set (not inherited)</div>
                <template v-else>
                  <span class="label-holder">Inheriting from {{ getInheritFromValue(index) }}</span> <a href="#" @click.prevent="goToDeviceTab(getInheritFromValue(index))">View</a>
                </template>
              </div>
            </template>
            <div class="col-xs-12" :class="{ 'multi-field': variable.fields.length > 1 }">
              <template v-for="(field, idx) in groupFontStyleFields(variable.fields)">
                <template v-if="Array.isArray(field)">
                  <div class="field-group">
                    <component v-for="(groupedField, i) in field" :key="groupedComponentKey" v-if="showField(groupedField)" :is="fieldType(groupedField.type)" :data="fieldData(groupedField)"></component>
                  </div>
                </template>
                <template v-else>
                  <component :key="componentKey" v-if="showField(field)" :is="fieldType(field.type)" :data="fieldData(field)"></component>
                </template>
              </template>
            </div>
          </div>
        </div>
        <div v-if="state.widgetMode && isChanged" class="buttons-holder">
          <div class="btn btn-primary" @click.prevent="applySettings">Apply styles to theme</div>
          <div class="btn btn-default" @click.prevent="resetSettings">Reset to theme styles</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { state, closeAppearanceGroupSettings,
  getInheritance, getSavedValue, setComponentContext, setActiveTab } from '../../store'
import SizeField from '../fields/SizeField'
import FontStyleField from '../fields/FontStyleField'
import BorderStyleField from '../fields/BorderStyleField'
import SelectField from '../fields/SelectField'
import ColorField from '../fields/ColorField'
import FontField from '../fields/FontField'
import BackgroundField from '../fields/BackgroundField'
import ImageField from '../fields/ImageField'
import AlignField from '../fields/AlignField'
import MarginAlignField from '../fields/MarginAlignField'
import PositionField from '../fields/PositionField'
import DisplayField from '../fields/DisplayField'
import DisplayExtendedField from '../fields/DisplayExtendedField'
import FlexDirectionField from '../fields/FlexDirectionField'
import FlexJustifyField from '../fields/FlexJustifyField'
import FlexAlignField from '../fields/FlexAlignField'
import ToggleField from '../fields/ToggleField'
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
      componentKey: 0,
      groupedComponentKey: 0,
      isChanged: false
    }
  },
  components: {
    SizeField,
    FontStyleField,
    BorderStyleField,
    SelectField,
    ColorField,
    FontField,
    BackgroundField,
    ImageField,
    AlignField,
    MarginAlignField,
    PositionField,
    DisplayField,
    DisplayExtendedField,
    FlexDirectionField,
    FlexJustifyField,
    FlexAlignField,
    ToggleField
  },
  computed: {
    transition() {
      return !state.widgetMode ? 'slide-in' : ''
    }
  },
  methods: {
    closeGroup() {
      if (state.widgetMode) {
        bus.$emit('close-appearance')
        return
      }
      bus.$emit('context-changed')
      closeAppearanceGroupSettings()
    },
    forceRerender() {
      // Change components :key to force them to render again
      this.groupedComponentKey += 1
      this.componentKey += 1
    },
    updateActiveTab(tab) {
      // Sets the active device tab
      tab = tab || this.tabs[0]
      setActiveTab(_.findIndex(this.tabs, { type: tab.type }))
    },
    handleContextSwitch(tab) {
      this.updateActiveTab(tab)
      setComponentContext(tab.name)
      Fliplet.Studio.emit('select-device-tab', tab.type === 'desktop' ? 'web' : tab.type)
      this.onContextSwitch()
    },
    onContextSwitch(){
      this.forceRerender()
      this.reSetVariables()
    },
    groupFontStyleFields(fields) {
      // This function makes all the font style fields (Bold, Italic, Underline, etc) together
      // This makes it look like it's just one field of multiple options
      const clonedFields = _.cloneDeep(fields)
      // Get the index of the first 'font-style' field
      const firsIndex = _.findIndex(clonedFields, { type: 'font-style' })
      // Get the array with all the 'font-style' fields
      const fontTypeArray = _.filter(clonedFields, { type: 'font-style' })

      // If there is an index
      if (firsIndex > -1) {
        // Remove the fields from the 'fields' array
        _.remove(clonedFields, { type: 'font-style' })
        // Add them as an array field back in in the index saved above
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
      const show = _.find(variable.fields, (field) => {
        return !!field.showField || typeof field.showField === 'undefined'
      })

      if (!show) {
        return false
      }

      // Function to hide the entire field's group if they aren't supposed to be shown on any of the device types
      const toHide = variable.hide
      const context = state.componentContext.toLowerCase()

      if (toHide && Array.isArray(toHide)) {
        return toHide.indexOf(context) < 0
      }

      return true
    },
    showField(field) {
      // Function to hide fields if they aren't supposed to be shown on any of the device types
      const toHide = field.hide
      const context = state.componentContext.toLowerCase()

      if (toHide && Array.isArray(toHide)) {
        return toHide.indexOf(context) < 0
      }

      return true
    },
    goToDeviceTab(inheritingFrom) {
      const tab = _.find(deviceTypes, { type: inheritingFrom })
      this.handleContextSwitch(tab)
    },
    reSetVariables(toRecompute) {
      if (this.variables) {
        this.forceRerender()
      }
      this.notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false
      this.variables = this.computeVariables(toRecompute)
      this.context = state.appearanceGroupOverlay.context == 'Mobile' ? '' : state.appearanceGroupOverlay.context
      this.showNotInheritingInfo = this.areNotInheriting()
      this.currentContext = state.componentContext.toLowerCase()
      this.inheritingFrom = getInheritance(this.variables)
    },
    computeVariables(toRecompute) {
      // Variables processing
      if (!state.appearanceGroupOverlay.data) {
        return []
      }

      const isMobile = state.componentContext === 'Mobile'
      const variables = _.cloneDeep(toRecompute && this.variables ? this.variables : state.appearanceGroupOverlay.data.appearanceGroup.variables)

      variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const values = getSavedValue(field, true)

          // To check if the field is inheriting
          const isDefaultInheriting = this.isInheriting(values.defaultValue)
          const isSavedValueInheriting = this.isInheriting(values.generalSavedValue)
          const isLocalSavedValueInheriting = this.isInheriting(values.generalLocalSavedValue)
          const isWidgetSavedValueInheriting = this.isInheriting(values.widgetSavedValue)
          const isLocalWidgetSavedValueInheriting = this.isInheriting(values.widgetLocalSavedValue)

          const isInheritingFrom = this.isInheritingFrom(values.fieldValue, field)

          const newObj = {
            value: values.fieldValue,
            inheritingFrom: isInheritingFrom ? isInheritingFrom : getInheritance(),
            inheriting: state.widgetMode
              ? !!(
                  (isLocalWidgetSavedValueInheriting
                    || (!values.widgetLocalSavedValue && isWidgetSavedValueInheriting)
                    || (!values.widgetLocalSavedValue && !values.widgetSavedValue && isLocalSavedValueInheriting)
                    || (!values.widgetLocalSavedValue && !values.widgetSavedValue && !values.generalLocalSavedValue && isSavedValueInheriting)
                    || (!values.widgetLocalSavedValue && !values.widgetSavedValue && !values.generalLocalSavedValue && !values.generalSavedValue && isDefaultInheriting)
                  )
                  || (this.ignoreInheritance(variable) || this.ignoreInheritance(field))
                )
              : !!(
                  (isLocalSavedValueInheriting
                    || (!values.generalLocalSavedValue && isSavedValueInheriting)
                    || (!values.generalLocalSavedValue && !values.generalSavedValue && isDefaultInheriting)
                  )
                  || (this.ignoreInheritance(variable) || this.ignoreInheritance(field))
                )
          }

          _.extend(variables[index].fields[idx], newObj)
        })
      })

      return variables
    },
    reComputeVariables(toRecompute) {
      this.reSetVariables(toRecompute)
      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    },
    getInheritFromValue(index) {
      if (Array.isArray(this.inheritingFrom)) {
        return this.inheritingFrom[index]
      }

      return this.inheritingFrom
    },
    areNotInheriting() {
      // Return an array of booleans to flag
      // which fields should show the 'not inheriting' copy
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
    isInheritingFrom(value, field) {
      // Gets from where the value is iheriting from
      // E.g. If a Desktop value is inheriting from Tablet, but Tablet is inheriting from Mobile
      // This function will return 'mobile' for the Desktop value
      if (!value) {
        return false
      }

      // Checks if the value matches the 'inherit-' reserved key
      const matchInherit = typeof value === 'string' ? value.match(/^inherit-([a-z]+)$/) : undefined

      if (!matchInherit || !matchInherit.length) {
        return false
      }

      const checkedValue = getSavedValue(field, false, matchInherit[1])
      const result = this.isInheritingFrom(checkedValue, field)

      if (!result) {
        return matchInherit[1]
      }

      return result
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
    runFieldLogic(fieldConfig, logic) {
      // Some fields have some logic to show and hide other fields based on the value selected
      this.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          if (logic.hide && logic.hide.indexOf(field.name) >= 0) {
            field.showField = false
            Vue.set(variable.fields, idx, field)
            Vue.set(this.variables, index, variable)
          }
          if (logic.show && logic.show.indexOf(field.name) >= 0) {
            field.showField = true
            Vue.set(variable.fields, idx, field)
            Vue.set(this.variables, index, variable)
          }
        })
      })

      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    },
    runMarginFieldLogic(fields, value) {
      // Some margin fields have some logic to disable and enable other fields based on the value selected
      this.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          if (fields.indexOf(field.name) > -1) {
            const field = variable.fields[idx]
            field.isAligned = value == 'custom' ? false : true
            Vue.set(variable.fields, idx, field)
            Vue.set(this.variables, index, variable)
          }
        })
      })

      this.$nextTick(() => {
        bus.$emit('variables-computed')
      })
    },
    fieldsSaved() {
      this.reComputeVariables(true)
      this.isChanged = true
    },
    applySettings() {
      bus.$emit('apply-to-theme')
    },
    resetSettings() {
      bus.$emit('reset-to-theme')
    },
    hideApplyReset() {
      this.isChanged = false
    },
    flexDirectionFlag(value) {
      this.$refs.componentoverlay.classList[value ? 'add' : 'remove']('flex-column')
    }
  },
  mounted() {
    bus.$on('group-overlay-opened', this.reSetVariables)
    bus.$on('saved-fields-set', this.fieldsSaved)
    bus.$on('check-field-visibility', this.runFieldLogic)
    bus.$on('check-margin-field', this.runMarginFieldLogic)
    bus.$on('group-settings-changed', this.hideApplyReset)
    bus.$on('component-context-changed', this.onContextSwitch)
    bus.$on('flex-direction-changed', this.flexDirectionFlag)

    const instanceWidgetSettings = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
    const savedWidgetSettings = _.find(state.savedFields.widgetInstances, { id: state.widgetId })

    if (instanceWidgetSettings || savedWidgetSettings) {
      this.isChanged = true
    }
  },
  destroyed() {
    bus.$off('group-overlay-opened', this.reSetVariables)
    bus.$off('saved-fields-set', this.fieldsSaved)
    bus.$off('check-field-visibility', this.runFieldLogic)
    bus.$off('check-margin-field', this.runMarginFieldLogic)
    bus.$off('group-settings-changed', this.hideApplyReset)
    bus.$off('component-context-changed', this.onContextSwitch)
    bus.$off('flex-direction-changed', this.flexDirectionFlag)
  } 
}
</script>