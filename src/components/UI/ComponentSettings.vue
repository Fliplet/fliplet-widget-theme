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
import { state, closeComponentSettings } from '../../store'
import SizeField from '../fields/SizeField'
import FontStyleField from '../fields/FontStyleField'
import BorderField from '../fields/BorderField'
import BorderStyleField from '../fields/BorderStyleField'
import SelectField from '../fields/SelectField'
import TextField from '../fields/TextField'
import ColorField from '../fields/ColorField'
import FontField from '../fields/FontField'

export default {
  data() {
    return {
      state
    }
  },
  props: {
    webFonts: Array,
    customFonts: Array
  },
  components: {
    SizeField,
    FontStyleField,
    BorderField,
    BorderStyleField,
    SelectField,
    TextField,
    ColorField,
    FontField
  },
  methods: {
    closeComponentSettings,
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
        value = state.componentOverlay.data.instance.settings.values[field.name]
      }
      return value
    }
  }
}
</script>