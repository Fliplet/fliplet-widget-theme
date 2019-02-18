<template>
  <transition name="slide-in">
    <div v-if="state.componentOverlay && state.componentOverlay.isOpen" id="component-settings-overlay">
      <header>
        <p>{{ state.componentOverlay.name }}</p>
        <span class="close-component-settings" @click.prevent="closeComponentSettings"><i class="fa fa-times-thin fa-lg fa-2x"></i></span>
      </header>
      <div v-if="state.componentOverlay.data && state.componentOverlay.data.component" class="settings-fields-holder">
        <div v-for="(field, index) in state.componentOverlay.data.component.variables" :key="index">
          <component :is="componentType(field.type)" :data="fieldData(field)" :saved-value="savedValue(field)"></component>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { state, closeComponentSettings } from '../../store'
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