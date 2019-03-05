<template>
  <transition name="slide-in">
    <div v-show="state.componentOverlay && state.componentOverlay.isOpen" id="component-settings-overlay">
      <header>
        <p>{{ state.componentOverlay.name }}</p>
        <span class="close-component-settings" @click.prevent="closeComponentSettings"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
      </header>
      <div v-if="variables && variables.length" class="settings-fields-holder">
        <div v-for="(variable, index) in variables" :key="index">
          <div class="form-group clearfix">
            <div class="col-xs-12 control-label">
              <label>{{ variable.description }}</label>
            </div>
            <template v-if="notMobile">
              <div class="inherit-settings-holder col-xs-12" :class="{ 'active': variable.inheritFromMobile }">
                <label class="switch">
                  <input type="checkbox" v-model="variable.inheritFromMobile" @click="checkSetting(variable)">
                  <span class="slider round"></span>
                </label>
                <span class="label-holder">Inherit styles from mobile - <template v-if="variable.inheritFromMobile">On</template><template v-else>Off</template></span>
              </div>
            </template>
            <div v-if="!variable.inheritFromMobile || !notMobile" class="col-xs-12" :class="{ 'multi-field': variable.fields.length > 1, 'two-rows': variable.fields.length == 4 }">
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
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      notMobile: undefined,
      variables: undefined,
      context: undefined
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
    setVariables() {
      this.notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false
      this.variables = _.cloneDeep(state.componentOverlay.data.component.variables)
      this.context = state.componentOverlay.context == 'Mobile' ? '' : state.componentOverlay.context

      // then initialize
      this.initializeOverlay()
    },
    initializeOverlay() {
      if (!state.themeInstance || (!state.componentOverlay.data && !this.variables)) {
        return
      }

      this.variables.forEach((variable, i) => {
        let savedValue
        for (var prop in state.themeInstance.settings.inheritance) {
          if (prop === variable.id + this.context) {
            savedValue = state.themeInstance.settings.inheritance[prop]
          }
        }

        variable.inheritFromMobile = typeof savedValue !== 'undefined' ? savedValue : variable.inheritFromMobile
      })
    },
    checkSetting(variable) {
      console.log(variable)
      const obj = {
        name: variable.id + this.context,
        value: variable.inheritFromMobile
      }
      saveInheritanceData(obj)

      // @TODO: If false save all field variables
      // @TODO: If true delete all fields references from the saved data
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
      let value = undefined
      if (state.componentOverlay.data && state.componentOverlay.data.instance.settings.values) {
        const savedValues = state.componentOverlay.data.instance.settings.values
        value = state.componentContext !== 'Mobile' ? savedValues[field.name + state.componentContext] || savedValues[field.name] : savedValues[field.name]
      }
      return value
    }
  },
  mounted() {
    bus.$on('component-overlay-opened', this.setVariables)
  }
}
</script>