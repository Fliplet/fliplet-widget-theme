<template>
  <div class="font-field-holder">
    <div v-if="!showInputField" class="btn-group select-box">
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
        <li :class="{ active: value === 'Custom' }">
          <a href="#" @click.prevent="onValueChange('Custom')">Custom...</a>
        </li>
        <li class="divider"></li>
        <li>
          <a href="#" @click.prevent="openFontUploader"><span class="text-primary">Upload a new font</span></a>
        </li>
      </ul>
    </div>
    <div v-else>
      <input class="form-control custom-font" type="text" v-model="customValue" placeholder="Helvetica, sans-serif">
      <small><a href="#" @click.prevent="showListOfFonts">See full list of fonts</a></small>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
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
        this.prepareToSave()
      }

      this.showInputField = newVal === 'Custom'
    },
    customValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareToSave()
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
    getDefaultValue() {
      const defaultValue = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.default
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].default

      return defaultValue
    },
    getFieldName() {
      const fieldName = state.componentContext === 'Mobile'
        ? this.data.fieldConfig.name
        : this.data.fieldConfig.breakpoints[state.componentContext.toLowerCase()].name

      return fieldName
    },
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
        value = 'Custom'
        this.showInputField = true
      } else if (!this.savedValue) {
        value = this.getDefaultValue()
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
    },
    showListOfFonts() {
      this.value = this.webFonts[0].name
      this.showInputField = false
    },
    openFontUploader() {
      if (Fliplet.Env.get('development')) {
        return
      }

      const filePickerData = {
        selectAvailable: false,
        type: 'font'
      }

      window.filePickerProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
        data: filePickerData,
        onEvent: (e, data) => {
          switch (e) {
            case 'widget-set-info':
              Fliplet.Studio.emit('widget-save-label-reset')
              Fliplet.Studio.emit('widget-save-label-update', {
                text: 'Close'
              })
              break
          }
        }
      })

      window.filePickerProvider.then((result) => {
        Fliplet.Studio.emit('widget-save-label-update', {
          text: 'Apply changes'
        })
        bus.$emit('reload-custom-fonts')

        window.filePickerProvider = null
        return Promise.resolve()
      })
    },
    prepareToSave() {
      const data = {
        name: this.getFieldName(),
        value: this.value === 'Custom' && this.showInputField ? this.customValue : this.value
      }

      saveFieldData(data)
    }
  }
}
</script>