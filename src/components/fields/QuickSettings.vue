<template>
  <div class="quick-settings-holder clearfix">
    <div class="col-xs-12 control-label quick-settings-title">
      <label>{{ componentConfig.name }}</label>
    </div>

    <template v-for="(variable, index) in variables">
      <div class="col-xs-12 control-label">
        <label>{{ variable.description }}</label>
      </div>
      <div class="col-xs-12">
        <input type="text" class="form-control" v-model="variable.value" v-on:keyup="setNewValue(variable)">
      </div>
    </template>
  </div>
</template>

<script>
import bus from '../../libs/bus'

export default {
  data() {
    return {
      variableToBeSaved: {},
      saveDebounced: _.debounce(this.saveData, 500)
    }
  },
  props: {
    componentConfig: Object,
    componentIndex: Number,
    themeInstance: Object
  },
  computed: {
    variables() {
      const variables = []
      this.componentConfig.variables.forEach((variable) => {
        const newObj = {
          name: variable.name,
          description: variable.description,
          value: this.themeInstance.settings
            && this.themeInstance.settings.values
            && this.themeInstance.settings.values[variable.name]
            ? this.themeInstance.settings.values[variable.name] : variable.default
        }

        variables.push(newObj)
      })

      return variables
    }
  },
  methods: {
    setNewValue(variable) {
      this.variableToBeSaved.name = variable.name
      this.variableToBeSaved.value = variable.value
      this.saveDebounced()
    },
    saveData() {
      const newData = {
        name: this.variableToBeSaved.name,
        value: this.variableToBeSaved.value
      }

      bus.$emit('field-saved', newData)
    }
  },
  mounted() {
    bus.$on('save-settings', this.saveDebounced)
  },
  destroyed() {
    bus.$off('save-settings', this.saveDebounced)
  }
}
</script>