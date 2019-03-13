import Application from './Application.vue'
import InheritDot from './components/UI/InheritDot.vue'

Vue.component('inherit-dot', InheritDot)

const mainApp = new Vue({
  el: '#theme-widget-holder',
  render: (createElement) => {
    return createElement(Application)
  }
})

