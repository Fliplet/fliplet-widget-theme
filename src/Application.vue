<template>
  <div id="theme-application">
    <div v-if="isLoading" class="spinner-holder animated">
      <div class="spinner-overlay">Loading...</div>
      <p>Loading your settings...</p>
    </div>
    <template v-else>
      <WidgetHeader></WidgetHeader>
      <ThemeSelection :themes="themes"></ThemeSelection>
    </template>
  </div>
</template>

<script>
import WidgetHeader from './components/WidgetHeader'
import ThemeSelection from './components/ThemeSelection'

export default {
  data() {
    return {
      isLoading: true,
      themes: undefined,
      fonts: undefined
    }
  },
  components: {
    WidgetHeader,
    ThemeSelection
  },
  methods: {
    getThemes() {
      return Fliplet.Themes.get()
    },
    getFonts() {
      return Fliplet.App.Fonts.get()
    }
  },
  created() {
    // Get themes and fonts simultaneously
    Promise.all([this.getThemes(), this.getFonts()])
      .then((response) => {
        this.themes = response[0]
        this.fonts = response[1]
        this.isLoading = false
      })
  }
}
</script>