import Application from './Application.vue'

const mainApp = new Vue({
  el: '#theme-widget-holder',
  render: (createElement) => {
    return createElement(Application)
  }
})