import 'core-js/stable/object/assign'
import 'core-js/stable/array/from'
import 'core-js/stable/array/includes'
import 'core-js/stable/string/starts-with'
import 'regenerator-runtime/runtime'
import Application from './Application.vue'

const mainApp = new Vue({
  el: '#theme-widget-holder',
  render: (createElement) => {
    return createElement(Application)
  }
})

