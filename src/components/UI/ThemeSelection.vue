<template>
  <div class="form-holder">
    <div class="form-group clearfix">
      <div class="col-xs-12 control-label">
        <label for="select-theme">Selected theme</label>
      </div>
      <div class="col-xs-12">
        <div class="btn-group select-box">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ selectedTheme.name }}
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-left">
            <li v-for="(theme, index) in themes" :key="index" :class="{ active: theme.id === selectedTheme.id }">
              <a href="#" @click.prevent="onValueChange(theme.id)">{{ theme.name }}</a>
            </li>
          </ul>
        </div>
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
      selectedTheme: this.activeTheme ? this.activeTheme : { name: 'Select a theme' }
    }
  },
  props: {
    themes: Array,
    activeTheme: Object,
    themeInstance: Object
  },
  methods: {
    onValueChange(id) {
      if (id !== this.activeTheme.id) {
        this.removeInstance()
          .then(() => {
            return this.createInstance(id)
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
    },
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