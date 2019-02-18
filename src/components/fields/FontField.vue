<template>
  <div class="form-group clearfix">
    <div class="col-xs-12 control-label">
      <label for="select-theme">{{ data.fieldConfig.description }}</label>
    </div>
    <div class="col-xs-12">
      <select v-model="value" class="form-control">
        <template v-if="customFonts && customFonts.length">
          <option v-for="(customFont, index) in customFonts" :key="index" :value="customFont.name">{{ customFont.name }}</option>
          <optgroup label="---"></optgroup>
        </template>
        <option v-for="(webFont, index) in webFonts" :key="index" :value="webFont.name">{{ webFont.name }}</option>
        <optgroup label="---"></optgroup>
        <option value="custom">Custom...</option>
      </select>
      <input v-if="showInputField" class="form-control" type="text" v-model="customValue" placeholder="Helvetica, sans-serif">
    </div>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {
      value: this.getFontValue(),
      customValue: this.getCustomValue(),
      showInputField: false
    }
  },
  props: {
    data: Object,
    savedValue: String
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        const data = {
          name: this.data.fieldConfig.name,
          value: newVal === 'custom' ? this.customValue : newVal
        }
        saveFieldData(data)
      }

      this.showInputField = newVal === 'custom'
    },
    customValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        const data = {
          name: this.data.fieldConfig.name,
          value: newVal
        }
        saveFieldData(data)
      }
    }
  },
  computed: {
    customFonts() {
      return this.data.customFonts
    },
    webFonts() {
      return this.data.webFonts
    }
  },
  methods: {
    getFontValue() {
      let value = ''
      let webFont = undefined
      let customFont = undefined

      webFont = _.find(this.data.webFonts, { name: this.savedValue })
      if (!webFont) {
        customFont = _.find(this.data.customFonts, { name: this.savedValue })
      }

      if (this.savedValue && (webFont || customFont)) {
        value = this.savedValue
      } else if (this.savedValue && !webFont && !customFont) {
        value = 'custom'
        this.showInputField = true
      } else if (!this.savedValue) {
        value = this.data.fieldConfig.default
      }

      return value
    },
    getCustomValue() {
      let value = ''
      let webFont = undefined
      let customFont = undefined

      webFont = _.find(this.data.webFonts, { name: this.savedValue })
      if (!webFont) {
        customFont = _.find(this.data.customFonts, { name: this.savedValue })
      }

      if (this.savedValue && !webFont && !customFont) {
        value = this.savedValue
      } else {
        value = ''
      }

      return value
    }
  }
}
</script>