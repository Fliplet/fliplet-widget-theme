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
        <input type="text" class="form-control" v-model="variable.value" v-on:input="setNewValue(variable)">
      </div>
    </template>
  </div>
</template>

<script>
import { saveFieldData } from '../../store'

export default {
  data() {
    return {}
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
      saveFieldData(variable)
    }
  }
}
</script>