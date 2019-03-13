<template>
  <div v-if="showField" class="border-style-field-holder" :class="{ 'full-width': isFullRow }">
    <div class="dropdown select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <template v-if="value == 'none'">
          None
        </template>
        <span v-else class="border-style" :style="'border-style: ' + value"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === value }">
          <a href="#" @click.prevent="onValueChange(prop)">
            <template v-if="prop == 'none'">
              None
            </template>
            <span v-else class="border-style" :style="'border-style: ' + prop"></span>
          </a>
        </li>
      </ul>
    </div>
    <span v-if="!isInheriting" class="inheritance-warn"></span>
  </div>
</template>

<script>
import { state, saveFieldData, getDefaultFieldValue, getFieldName } from '../../store'
import bus from '../../libs/bus'

export default {
  data() {
    return {
      state,
      value: this.savedValue || getDefaultFieldValue(this.data.fieldConfig),
      properties: this.data.fieldConfig.properties,
      isFullRow: this.data.fieldConfig.isFullRow,
      isInheriting: this.checkInheritance(),
      showField: typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
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
    }
  },
  methods: {
    onValueChange(value) {
      this.value = value
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
      this.showField = typeof this.data.fieldConfig.showField !== 'undefined'
        ? this.data.fieldConfig.showField
        : true
    }
  },
  mounted() {
    bus.$on('variables-computed', this.reCheckProps)
  },
  destroyed() {
    bus.$off('variables-computed', this.reCheckProps)
  }
}
</script>