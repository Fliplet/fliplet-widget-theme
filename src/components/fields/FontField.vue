<template>
  <div v-if="showField" class="font-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="wrapper">
      <div class="dropdown select-box">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ valueToShow }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-left">
          <template v-if="customFonts && customFonts.length">
            <li v-for="(customFont, index) in customFonts" :key="index" :class="{ active: customFont.name === valueToShow }">
              <a href="#" @click.prevent="onValueChange(customFont.name)">{{ customFont.name }}</a>
            </li>
            <li class="divider"></li>
          </template>
          <li v-for="(webFont, index) in webFonts" :key="index" :class="{ active: webFont.name === valueToShow }">
            <a href="#" @click.prevent="onValueChange(webFont.name)">{{ webFont.name }}</a>
          </li>
          <li class="divider"></li>
          <li>
            <a href="#" @click.prevent="openFontUploader"><span class="text-primary">Upload a new font</span></a>
          </li>
        </ul>
      </div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue,
  getFieldName, getInheritance, checkIsFieldChanged } from '../../store'
import InheritDot from '../UI/InheritDot'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      isFullRow: this.data.fieldConfig.isFullRow,
      isHalfRow: this.data.fieldConfig.isHalfRow,
      isInheriting: this.checkInheritance(),
      inheritingFrom: getInheritance(),
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
    setValues() {
      this.valueToShow = this.value
    },
    getValueToShow() {
      return getDefaultFieldValue(this.data.fieldConfig)
    },
    inheritValue(value) {
      this.value = value
    },
    onValueChange(value) {
      this.valueToShow = value
      this.value = value
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