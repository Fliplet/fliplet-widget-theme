<template>
  <div class="weight-field-holder">
    <div class="btn-group select-box">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ value }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li v-for="(prop, index) in properties" :key="index" :class="{ active: prop === value }">
          <a href="#" @click.prevent="onValueChange(prop)">{{ prop }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'
import bus from '../../libs/bus'

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
  methods: {
    onValueChange(value) {
      this.value = value
      this.prepareToSave()
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