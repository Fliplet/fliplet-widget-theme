<template>
  <div class="border-style-field-holder">
    <div class="btn-group select-box">
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
  </div>
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {
      value: this.savedValue || this.data.fieldConfig.default,
      properties: this.data.fieldConfig.properties
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
        name: this.data.fieldConfig.name,
        value: this.value
      }

      saveFieldData(data)
    }
  }
}
</script>