<template>
  <header>
    <p><a href="#" class="closeSideView" @click.prevent="closeSideView"><i class="fa fa-times-thin fa-lg fa-2x"></i></a> Appearance</p>
    <a class="betaAlert" href="#">Need help?</a>
  </header>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    closeSideView() {
      Fliplet.Studio.emit('navigate', { name: 'appEdit' });
    }
  }
}
</script>