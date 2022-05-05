<template>
  <div v-if="!groupConfig.hide" class="components-buttons" @click.prevent="appearanceGroupSettings">
    {{ groupConfig.name }} <i class="fa fa-angle-right"></i>
  </div>
</template>

<script>
import { state, openAppearanceGroupSettings } from '../../store';

export default {
  data() {
    return {
      state
    };
  },
  props: {
    groupConfig: Object
  },
  methods: {
    appearanceGroupSettings() {
      openAppearanceGroupSettings(this.groupConfig.name, {
        appearanceGroup: this.groupConfig,
        instance: state.themeInstance
      });

      Fliplet.Studio.emit('track-event', {
        category: 'theme_manager_v2',
        action: 'open_section',
        label: this.groupConfig.name
      });
    }
  }
};
</script>
