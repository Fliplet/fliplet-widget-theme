import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Application from './Application.vue'
import InheritDot from './components/UI/InheritDot.vue'

const mainApp = new Vue({
  el: '#theme-widget-holder',
  render: (createElement) => {
    return createElement(Application)
  }
})

