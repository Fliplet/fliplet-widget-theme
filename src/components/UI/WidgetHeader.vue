<template>
  <header>
    <p>Theme appearance</p>
    <a href="#" class="closeSideView" @click.prevent="closeSideView"><i class="fa fa-times-thin fa-2x"></i></a>
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