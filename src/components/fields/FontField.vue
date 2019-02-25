<template>
  <div>
    <div class="btn-group select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ value }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <template v-if="customFonts && customFonts.length">
          <li v-for="(customFont, index) in customFonts" :key="index" :class="{ active: customFont.name === value }">
            <a href="#" @click.prevent="onValueChange(customFont.name)">{{ customFont.name }}</a>
          </li>
          <li class="divider"></li>
        </template>
        <li v-for="(webFont, index) in webFonts" :key="index" :class="{ active: webFont.name === value }">
          <a href="#" @click.prevent="onValueChange(webFont.name)">{{ webFont.name }}</a>
        </li>
        <li class="divider"></li>
        <li>
          <a href="#" :class="{ active: value === 'custom' }" @click.prevent="onValueChange('custom')">Custom...</a>
        </li>
      </ul>
    </div>
    <input v-if="showInputField" class="form-control" type="text" v-model="customValue" placeholder="Helvetica, sans-serif">
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
    },
    onValueChange(value) {
      this.value = value
    }
  }
}
</script>