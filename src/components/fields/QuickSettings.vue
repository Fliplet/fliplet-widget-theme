<template>
  <div class="quick-settings clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ groupConfig.name }}</label>
    </div>

    <div class="col-xs-12">
      <template v-for="(variable, idx) in variables">
        <div class="quick-settings-field">
          <template v-for="(field, index) in variable.fields">
            <component :is="fieldType(field.type)" :data="fieldData(field)"></component>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, checkSavedValue } from '../../store'
import deviceTypes from '../../libs/device-types'
import bus from '../../libs/bus'
import ColorField from './ColorField'
import FontField from './FontField'

export default {
  data() {
    return {
      state,
      variables: this.computeVariables()
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
    computeVariables() {  
      // Processing variables    
      this.groupConfig.variables.forEach((variable, index) => {
        variable.fields.forEach((field, idx) => {
          const values = checkSavedValue(field, true)

          const newObj = {
            value: values.fieldValue,
            inheriting: true
          }

          _.extend(this.groupConfig.variables[index].fields[idx], newObj)
        })
      })

      return this.groupConfig.variables
    },
    reSetVariables() {
      this.variables = this.computeVariables()
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