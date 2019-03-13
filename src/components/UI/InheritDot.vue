<template>
  <div class="inheritance-warn" @click.prevent="toggleDropdown" v-click-outside="closeDropDown">
    <div v-show="showDropdown" ref="dropdown" class="inheritance-dropdown">
      <div>The value will be inherited from {{ inheritingFrom }}.</div>
      <div class="inherit-action" @click="$emit('trigger-inherit', value)">Inherit</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false
    }
  },
  props: {
    inheritingFrom: String
  },
  computed: {
    value() {
      return 'inherit-' + this.inheritingFrom
    }
  },
  directives: {
    'click-outside': {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
          const compName = vNode.context.name
          let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
          if (compName) { warn += `Found in component '${compName}'` }
          
          console.warn(warn)
        }
        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler

        // add Event Listeners
        document.addEventListener('click', handler)
      },
      
      unbind: function(el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null

      }
    }
  },
  methods: {
    calculatePosition() {
      const $dropdown = $(this.$refs.dropdown)
      const dropdownOffset = $dropdown.offset()

      const fromLeft = dropdownOffset.left
      const dropdownWidth = $dropdown.outerWidth()
      const totalWidthWithDropdown = fromLeft + dropdownWidth

      const spaceUp = (dropdownOffset.top - $dropdown.height()) - $(window).scrollTop()
      const spaceDown = $(window).scrollTop() + $(window).height() - (dropdownOffset.top + $dropdown.height());

      $dropdown[spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown) ? 'addClass' : 'removeClass']('to-top')
      $dropdown[totalWidthWithDropdown > $(window).width() ? 'addClass' : 'removeClass']('to-right')
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown

      if (this.showDropdown) {
        this.$nextTick(() => {
          this.calculatePosition()
        })
      }
    },
    closeDropDown() {
      this.showDropdown = false
    }
  }
}
</script>