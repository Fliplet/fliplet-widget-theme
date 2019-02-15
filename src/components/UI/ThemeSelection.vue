<template>
  <div class="form-holder">
    <div class="form-group clearfix">
      <div class="col-xs-12 control-label">
        <label for="select-theme">Selected theme</label>
      </div>
      <div class="col-xs-12">
        <select v-model="selectedTheme" name="select-theme" class="form-control">
          <option value="none">-- Select a theme</option>
          <option v-for="(theme, index) in themes" :key="index" :value="theme.id">{{ theme.name }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
// @TODO: Handle errors
import bus from '../../libs/bus'

export default {
  data() {
    return {
      selectedTheme: this.activeTheme ? this.activeTheme.id : 'none'
    }
  },
  props: {
    themes: Array,
    activeTheme: Object,
    themeInstance: Object
  },
  watch: {
    selectedTheme(newVal) {
      if (newVal === "none") {
        return this.removeInstance()
          .then(() => {
            bus.$emit('initialize-widget')
          })
          .then(() => {
            // @TODO: Confirm we need this
            bus.$emit('reload-page')
          })
          .catch((err) => {
            const error = Fliplet.parseError(err)
            console.error(error)
          })
      }

      if (newVal !== this.activeTheme.id) {
        this.removeInstance()
          .then(() => {
            return this.createInstance(newVal)
          })
          .then(() => {
            return bus.$emit('initialize-widget')
          })
          .then(() => {
            // @TODO: Confirm we need this
            return bus.$emit('reload-page')
          })
          .catch((err) => {
            const error = Fliplet.parseError(err)
            console.error(error)
          })
      }
    }
  },
  methods: {
    removeInstance() {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        method: 'DELETE',
        url: 'v1/widget-instances/' + this.themeInstance.id
      })
    },
    createInstance(themeId) {
      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
        method: 'POST',
        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
        data: {
          widgetId: themeId === 'none' ? undefined : themeId,
          reuse: true
        }
      })
    }
  }
}
</script>