<template>
  <transition name="slide-in">
    <div v-if="state.componentOverlay && state.componentOverlay.isOpen" id="component-settings-overlay">
      <header>
        <p>{{ state.componentOverlay.name }}</p>
        <span class="close-component-settings" @click.prevent="closeComponentSettings"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
      </header>
      <div v-if="state.componentOverlay.data && state.componentOverlay.data.component" class="settings-fields-holder">
        <div v-for="(variable, index) in state.componentOverlay.data.component.variables" :key="index">
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
              <component v-for="(field, idx) in variable.fields" :key="idx" :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(field)" :component-context="componentContext"></component>
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
      notMobile: this.componentContext == 'Tablet' || this.componentContext == 'Desktop' ? true : false
    }
  },
  props: {
    webFonts: Array,
    customFonts: Array,
    themeInstance: Object,
    componentContext: String
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
    computeVariable() {
      if (!this.themeInstance || (!state.componentOverlay.data && !state.componentOverlay.data.component.variables)) {
        return
      }

      const context = this.componentContext == 'Mobile' ? '' : this.componentContext
      state.componentOverlay.data.component.variables.forEach((variable, i) => {
        let savedValue

        for (var prop in this.themeInstance.settings.inheritance) {
          if (prop === variable.id + context) {
            savedValue = this.themeInstance.settings.inheritance[prop]
          }
        }

        variable.inheritFromMobile = typeof savedValue !== 'undefined' ? savedValue : variable.inheritFromMobile
      })
    },
    checkSetting(variable) {
      console.log(variable)
      const context = this.componentContext == 'Mobile' ? '' : this.componentContext
      const obj = {
        name: variable.id + context,
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
        data.webFonts = this.webFonts
        data.customFonts = this.customFonts
      }

      return data
    },
    savedValue(field) {
      let value = undefined
      if (state.componentOverlay.data && state.componentOverlay.data.instance.settings.values) {
        const savedValues = state.componentOverlay.data.instance.settings.values
        const context = this.componentContext[0].toUpperCase() + this.componentContext.slice(1)

        value = this.componentContext !== 'mobile' ? savedValues[field.name + context] || savedValues[field.name] : savedValues[field.name]
      }
      return value
    }
  },
  mounted() {
    bus.$on('component-overlay-opened', this.computeVariable)
  }
}
</script>