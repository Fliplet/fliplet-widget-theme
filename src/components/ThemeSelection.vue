<template>
  <div class="form-horizontal">
    <div class="form-group clearfix">
      <div class="col-sm-4 control-label">
        <label for="select-theme">Selected theme</label>
      </div>
      <div class="col-sm-8">
        <label for="select_email" class="select-proxy-display">
          <select v-model="selectedTheme" name="select-theme" class="hidden-select form-control">
            <option value="none">-- Select a theme</option>
            <option v-for="theme in themes" :value="theme.id">{{ theme.name }}</option>
          </select>
          <span class="icon fa fa-chevron-down"></span>
        </label>
        <p id="reset_settings">Reset to default settings - <a href="#" class="text-danger">Reset settings</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTheme: this.activeTheme ? this.activeTheme.id : 'none'
    }
  },
  props: {
    themes: Array,
    activeTheme: Object
  }
}
</script>