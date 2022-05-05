<template>
  <div class="inheritance-holder" :class="{ 'inheritance-holder-left': position === 'left' }">
    <div class="inheritance-warn" ref="dot" :class="{ 'closer': moveLeft }" @click.prevent="toggleDropdown" data-toggle="tooltip" data-placement="bottom" title="Inherit"></div>
    <div v-show="showDropdown" ref="dropdown" class="inheritance-dropdown" v-click-outside="closeDropDown">
      <div>Style not inherited. Align styles across device sizes?</div>
      <div class="inherit-action" @click="$emit('update-all')">Update all devices to match</div>
      <div class="inherit-action" @click="$emit('update-previous-context')">Update {{ inheritingFrom }} to match</div>
      <div class="inherit-action" @click="$emit('trigger-inherit', value)">Inherit from {{ inheritingFrom }}</div>
    </div>
  </div>
</template>

<script>
import { tooltips } from '../../libs/tooltips';

export default {
  data() {
    return {
      showDropdown: false,
      preventClose: false
    };
  },
  props: {
    inheritingFrom: String,
    position: String,
    moveLeft: Boolean
  },
  computed: {
    value() {
      return 'inherit-' + this.inheritingFrom;
    }
  },
  directives: {
    'click-outside': {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
          const compName = vNode.context.name;
          let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;

          if (compName) { warn += `Found in component '${compName}'`; }

          console.warn(warn);
        }

        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble;
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };

        el.__vueClickOutside__ = handler;

        // add Event Listeners
        document.addEventListener('click', handler);
      },

      unbind: function(el) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  },
  methods: {
    calculatePosition() {
      // Calculates the position to determine where the popup should be placed
      const $dropdown = $(this.$refs.dropdown);
      const $dot = $(this.$refs.dot);
      const dropdownOffset = $dropdown.offset();
      const dotOffset = $dot.offset();

      const fromLeft = dotOffset.left;
      const dropdownWidth = $dropdown.outerWidth();
      const totalWidthWithDropdown = fromLeft + dropdownWidth;

      const spaceUp = (dropdownOffset.top - $dropdown.height()) - $(window).scrollTop();
      const spaceDown = $(window).scrollTop() + $(window).height() - (dropdownOffset.top + $dropdown.height());

      $dropdown[spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown) ? 'addClass' : 'removeClass']('to-top');
      $dropdown[totalWidthWithDropdown > $(window).width() ? 'addClass' : 'removeClass']('to-right');

      if ($dropdown.hasClass('to-right')) {
        const rightIndent = fromLeft - dropdownWidth;

        $dropdown.css('right', rightIndent > 0 ? 0 : rightIndent);
      } else {
        const leftIndent = dotOffset.right - dropdownWidth;

        $dropdown.css('left', leftIndent > 0 ? 0 : leftIndent);
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      this.preventClose = true;

      if (this.showDropdown) {
        this.$nextTick(() => {
          this.calculatePosition();
        });
      }
    },
    closeDropDown() {
      this.showDropdown = this.preventClose ? true : false;

      this.$nextTick(() => {
        this.preventClose = false;
      });
    }
  },
  mounted() {
    // Start Bootstrap tooltips
    tooltips();
  }
};
</script>
