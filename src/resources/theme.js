import { state } from '../store'

export default {
  create(themeId, toReuse) {
    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      method: 'POST',
      url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
      data: {
        widgetId: themeId,
        reuse: toReuse
      }
    })
  },
  update(data) {
    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      url: 'v1/widget-instances/' + state.themeInstance.id,
      method: 'PUT',
      data: {
        package: state.activeTheme.package,
        values: data.values || {},
        widgetInstances: data.widgetInstances || []
      }
    })
  },
  delete() {
    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      method: 'DELETE',
      url: 'v1/widget-instances/' + state.themeInstance.id
    })
  }
}