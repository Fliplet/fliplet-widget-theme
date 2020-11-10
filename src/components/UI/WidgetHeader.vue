<template>
  <header>
    <p>
      Theme appearance
      <a href="https://help.fliplet.com/appearance-settings/" class="help-icon" @click.prevent="closeSideView" target="_blank">
        <i class="fa fa-question-circle-o"></i>
      </a>
    </p>
  </header>
</template>

<script>
import bus from '../../libs/bus'

export default {
  data() {
    return {}
  },
  methods: {
    closeSideView() {
      Fliplet.Studio.emit('navigate', { name: 'appEdit' });
    }
  },
  mounted() {
    bus.$on('close-appearance', this.closeSideView)
  },
  destroyed() {
    bus.$off('close-appearance', this.closeSideView)
  }
}
</script>