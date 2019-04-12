<template>
  <div v-if="showField" class="image-field-holder" :class="{ 'full-width': isFullRow, 'half-width': isHalfRow, 'field-changed': isChanged }">
    <div class="wrapper">
      <template v-if="!hasImage">
        <div class="btn btn-default" @click.prevent="openFilePicker">
          <i class="fa fa-plus"></i>
        </div>
      </template>
      <template v-else>
        <div class="btn btn-default has-image" :style="'background-image: url(' + valueToShow.url + ')'" @click.prevent="openFilePicker"></div>
      </template>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getDefaultFieldValue, getFieldName,
  saveFieldData, checkLogic, getInheritance, checkIsFieldChanged } from '../../store'
import InheritDot from '../UI/InheritDot'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getDefaultFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      properties: this.data.fieldConfig.properties,
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
        checkLogic(this.data.fieldConfig, newVal)
        this.prepareToSave()
      }
    }
  },
  computed: {
    hasImage() {
      if (typeof this.valueToShow === 'object' && this.valueToShow.url) {
        return true
      }

      return false
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
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      }

      saveFieldData(data)
    },
    openFilePicker() {
      const filePickerData = {
        selectFiles: typeof this.value === 'object' ? [this.value] : [],
        selectMultiple: false,
        type: 'image',
        fileExtension: ['JPG', 'JPEG', 'PNG', 'GIF', 'TIFF', 'SVG'],
        autoSelectOnUpload: true,
        cdn: false
      }

      window.filePickerProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
        data: filePickerData,
        onEvent: (e, data) => {
          switch (e) {
            case 'widget-set-info':
              Fliplet.Studio.emit('widget-save-toggle', true)
              Fliplet.Studio.emit('widget-save-label-reset')
              Fliplet.Studio.emit('widget-save-label-update', {
                text: 'Select'
              })
              Fliplet.Widget.toggleSaveButton(!!data.length)
              break
          }
        }
      })

      window.filePickerProvider.then((result) => {
        let imageUrl = result.data[0].url
        const pattern = /[?&]size=/

        if (!pattern.test(imageUrl)) {
          const params = imageUrl.substring(1).split('?');
          imageUrl += (params.length > 1 ? '&' : '?') + 'size=large'
        }

        result.data[0].url = imageUrl
        this.valueToShow = result.data[0]
        this.value = result.data[0]

        window.filePickerProvider = null

        Fliplet.Studio.emit('widget-save-label-reset')
        Fliplet.Studio.emit('widget-save-toggle', false)
        return Promise.resolve()
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
    }
  },
  created() {
    this.setValues()
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    checkLogic(this.data.fieldConfig, this.value)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>