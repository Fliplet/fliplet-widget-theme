<template>
  <div v-if="showField" class="font-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="wrapper">
      <div class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" ref="dropdowntoggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="font-name" :style="'font-family:' + getFontFamily(valueToShow) + ';'">{{ valueToShow }}</span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <template v-if="customFonts && customFonts.length">
            <li v-for="(customFont, index) in customFonts" :key="index" :class="{ active: customFont.name === valueToShow }" :style="'font-family:' + customFont.name + ',sans-serif;'">
              <a href="#" @click.prevent="onValueChange(customFont)">{{ customFont.name }}</a>
            </li>
            <li class="divider"></li>
          </template>
          <li v-for="(webFont, index) in webFonts" :key="index" :class="{ active: webFont.name === valueToShow }" :style="'font-family:' + getFontFamily(webFont.name) + ';'">
            <a href="#" @click.prevent="onValueChange(webFont.name)">{{ webFont.name }}</a>
          </li>
          <li class="divider"></li>
          <li>
            <a href="#" @click.prevent="openFontUploader"><span class="text-primary">Upload a new font</span></a>
          </li>
        </ul>
      </div>
      <div v-if="label" class="field-label" @click.prevent="toggleDropdown">{{ label }}</div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, checkIsFieldChanged, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import fontMapping from '../../libs/font-mapping'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      label: this.data.fieldConfig.label,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  components: {
    InheritDot
  },
  props: {
    data: Object
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        sendCssToFrame(newVal, this.data.fieldConfig)

        this.$nextTick(() => {
          this.prepareToSave()
        })
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
    getFontFamily(fontName) {
      const webFont = fontMapping[fontName]

      if (!webFont) {
        return `${fontName},sans-serif`
      }

      return webFont
    },
    searchFontMapping(value) {
      let result
      for (const key in fontMapping) {
        if (fontMapping[key] === value) {
          result = key
          continue
        }
      }

      if (!result) {
        result = value.split(',')[0].trim()
      }

      return result
    },
    setValues() {
      this.valueToShow = this.searchFontMapping(this.value)

      if (this.valueToShow) {
        return
      }

      this.valueToShow = this.value
    },
    getValueToShow() {
      const defaultValue = getDefaultFieldValue(this.data.fieldConfig)
      return this.searchFontMapping(defaultValue)
    },
    inheritValue(value) {
      this.value = value
    },
    toggleDropdown(event) {
      event.preventDefault()
      event.stopPropagation()
      $(this.$refs.dropdowntoggle).dropdown('toggle')
    },
    onValueChange(value) {
      if (typeof value === 'string') {
        this.valueToShow = value
        this.value = this.getFontFamily(value)
        return
      }
      
      this.valueToShow = value.name
      this.value = `${value.name},sans-serif`
    },
    openFontUploader() {
      if (Fliplet.Env.get('development')) {
        return
      }

      Fliplet.Studio.emit('overlay', {
        name: 'app-settings',
        options: {
          size: 'large',
          title: 'App Settings',
          section: 'appCustomFonts',
          appId: Fliplet.Env.get('appId')
        }
      })
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)
      this.valueToShow = this.getValueToShow()
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      }

      saveFieldData(data)
    }
  },
  created() {
    this.setValues()
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>