<template>
  <div id="theme-application">
    <header>
      <p><a href="#" class="closeSideView"><i class="fa fa-times-thin fa-lg fa-2x"></i></a> Appearance</p>
      <a class="betaAlert" href="#">Need help?</a>
    </header>
    <div class="form-horizontal">
      <div class="form-group clearfix">
        <div class="col-sm-4 control-label">
          <label for="select-theme">Selected theme</label>
        </div>
        <div class="col-sm-8">
          <label for="select_email" class="select-proxy-display">
            <select v-model="selectedTheme" name="select-theme" class="hidden-select form-control">
              <option value="none">-- Select a theme</option>
              <option v-for="theme in themes" v-bind:value="theme.id">{{ theme.name }}</option>
            </select>
            <span class="icon fa fa-chevron-down"></span>
          </label>
          <p id="reset_settings">Reset to default settings - <a href="#" class="text-danger" data-reset-settings="">Reset settings</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTheme: 'none',
      themes: undefined,
      fonts: undefined,
      themesLoadingPromise: null
    }
  },
  methods: {
    getThemes() {
      if (this.themes) {
        return Promise.resolve(this.themes)
      }

      if (!this.themesLoadingPromise) {
        this.themesLoadingPromise = Fliplet.Themes.get().then((response) => {
          // @TODO: Remove
          console.log(response)
          this.themesLoadingPromise = null
          this.themes = response
          return this.themes
        });
      }

      return this.themesLoadingPromise
    }
  },
  created() {
    // only get app fonts once
    const getAppFonts = this.fonts ? Promise.resolve() : Fliplet.App.Fonts.get().then((appFonts) => {
      this.fonts = appFonts
    });

    return getAppFonts.then(() => {
      return this.getThemes()
    }).then(() => {
      
    })
  }
}
</script>