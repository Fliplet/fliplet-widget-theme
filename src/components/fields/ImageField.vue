<template>
  <div v-if="showField" :class="'image-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper" data-toggle="tooltip" data-placement="bottom" :title="!hasImage ? 'Add image' : 'Change image'">
      <template v-if="!hasImage">
        <div class="btn btn-default" @click.prevent="openFilePicker">
          <i class="fa fa-plus"></i>
        </div>
      </template>
      <template v-else>
        <div class="btn btn-default has-image" :style="'background-image: url(' + valueToShow + ')'" @click.prevent="openFilePicker"></div>
      </template>
      <inherit-dot v-if="!isInheriting" @update-all="updateAll" @update-previous-context="updatePreviousContext" @trigger-inherit="inheritValue" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName, getFieldNameByContext,
  saveFieldData, checkLogic, checkIsFieldChanged, sendCssToFrame } from '../../store'
import { tooltips } from '../../libs/tooltips'
import InheritDot from '../UI/InheritDot'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      valueToShow: undefined,
      properties: this.data.fieldConfig.properties,
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
        checkLogic(this.data.fieldConfig, newVal)
        sendCssToFrame(`url('${newVal.url}')`, this.data.fieldConfig)

        this.$nextTick(() => {
          this.prepareToSave()
        })
      }
    }
  },
  computed: {
    hasImage() {
      if (this.valueToShow && this.valueToShow !== 'none') {
        return true
      }

      return false
    },
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    setValues() {
      this.valueToShow = typeof this.value === 'object'
        ? this.value.url
        : this.value
    },
    getValueToShow() {
      return getCurrentFieldValue(this.data.fieldConfig)
    },
    prepareToSave(data) {
      data = data || {
        name: getFieldName(this.data.fieldConfig),
        value: this.value
      }

      saveFieldData(data)
    },
    openFilePicker() {
      if (Fliplet.Env.get('development')) {
        return
      }

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

        const media = _.pick(result.data[0], ['id', 'url', 'path'])
        this.valueToShow = media.url
        this.value = media

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
    },
    updateAll() {
      const mobileFieldName = this.data.fieldConfig.name
      const currentFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: state.componentContext.toLowerCase()
      })

      // This function can only be run when the user is either
      // in the tablet or desktop context, so it is safe to assume
      // that if it's not one is the other
      const remainingFieldContext = state.componentContext.toLowerCase() === 'tablet'
        ? 'desktop'
        : 'tablet'
      const remainingFieldInheritance = remainingFieldContext === 'desktop'
        ? 'tablet'
        : 'mobile'
      const remainingFieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: remainingFieldContext
      })

      const dataToSave = [
        {
          name: mobileFieldName,
          value: this.value
        },
        {
          name: currentFieldName,
          value: 'inherit-' + this.inheritingFrom
        },
        {
          name: remainingFieldName,
          value: 'inherit-' + remainingFieldInheritance
        }
      ]

      this.prepareToSave(dataToSave)
    },
    updatePreviousContext() {
      const fieldName = getFieldNameByContext({
        field: this.data.fieldConfig,
        context: this.inheritingFrom
      })
      const dataToSave = [
        {
          name: fieldName,
          value: this.value
        },
        {
          name: getFieldName(this.data.fieldConfig),
          value: 'inherit-' + this.inheritingFrom
        }
      ]

      this.prepareToSave(dataToSave)
    },
    inheritValue(value) {
      this.value = value
    }
  },
  created() {
    this.setValues()
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    checkLogic(this.data.fieldConfig, this.value)
    // Start Bootstrap tooltips
    tooltips()
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>