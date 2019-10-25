<template>
  <div v-if="showField" :class="'flex-align-field-holder ' + columnClass + ' ' + (isChanged ? 'field-changed' : '')">
    <div class="wrapper">
      <div class="flex-field-container">
        <div class="radio-holder inline-boxed" v-for="(prop, idx) in properties" :key="idx">
          <input type="radio" :id="'radio-' + prop + uuid" :name="'flex-field-' + uuid" :value="prop" v-model="value">
          <label :for="'radio-' + prop + uuid" data-toggle="tooltip" data-placement="bottom" :title="getTooltip(prop)">
            <span :class="'check-icon check-flex-align-' + prop"></span>
          </label>
        </div>        
      </div>
      <inherit-dot v-if="!isInheriting" @trigger-inherit="inheritValue" :move-left="true" :inheriting-from="inheritingFrom"></inherit-dot>
    </div>
    <div v-if="label" class="field-label">{{ label }}</div>
  </div>
</template>

<script>
import { state, getCurrentFieldValue, getFieldName,
  saveFieldData, checkIsFieldChanged, checkLogic, sendCssToFrame } from '../../store'
import InheritDot from '../UI/InheritDot'
import displayProperties from '../../libs/display-properties'
import { tooltips } from '../../libs/tooltips'
import createClass from '../../libs/column-class'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: getCurrentFieldValue(this.data.fieldConfig),
      properties: displayProperties.flexAlign,
      label: 'Vertical',
      isInheriting: this.checkInheritance(),
      inheritingFrom: this.data.fieldConfig.inheritingFrom,
      isChanged: checkIsFieldChanged(this.data.fieldConfig),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true,
      fromReset: false,
      uuid: Fliplet.guid()
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
      if (newVal != oldVal && !this.fromReset) {
        checkLogic(this.data.fieldConfig, newVal)
        sendCssToFrame(newVal, this.data.fieldConfig)

        this.$nextTick(() => {
          this.prepareToSave()
        })
        return
      }

      this.fromReset = false
    }
  },
  computed: {
    columnClass() {
      return createClass(this.data.fieldConfig.columns)
    }
  },
  methods: {
    getTooltip(prop) {
      switch(prop) {
        case 'stretch':
          return 'Stretch to fit'
          break;
        case 'flex-start':
          return 'At the beginning'
          break;
        case 'center':
          return 'Center'
          break;
        case 'flex-end':
          return 'At the end'
          break;
        case 'baseline':
          return 'At the baseline'
          break;
        default:
          return 'Stretch to fit'
      }
    },
    getValue() {
      return getCurrentFieldValue(this.data.fieldConfig)
    },
    inheritValue(value) {
      this.value = value
      this.$nextTick(() => {
        this.fromReset = true
      })
    },
    prepareToSave() {
      const data = {
        name: getFieldName(this.data.fieldConfig),
        value: this.value 
      }

      saveFieldData(data)
    },
    checkInheritance() {
      return state.componentContext === 'Mobile' ? true : this.data.fieldConfig.inheriting
    },
    reCheckProps() {
      this.isInheriting = this.checkInheritance()
      this.isChanged = checkIsFieldChanged(this.data.fieldConfig)

      if (this.fromReset) {
        this.value = this.getValue()
        checkLogic(this.data.fieldConfig, this.value)
        sendCssToFrame(this.value, this.data.fieldConfig)
      }

      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    },
    flexDirectionChanged(value) {
      this.label = !!value ? 'Horizontal' : 'Vertical'
    }
  },
  created() {
    var isFlexColumn = !!document.querySelector('#component-settings-overlay.flex-column')
    this.flexDirectionChanged(isFlexColumn)
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
    bus.$on('flex-direction-changed', this.flexDirectionChanged)
    checkLogic(this.data.fieldConfig, this.value)
    // Start Bootstrap tooltips
    tooltips()
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
    bus.$off('flex-direction-changed', this.flexDirectionChanged)
  }
}
</script>