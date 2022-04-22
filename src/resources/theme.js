import { state } from '../store';

export default {
  create(data = {}) {
    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      method: 'POST',
      url: `v1/widget-instances?appId=${Fliplet.Env.get('appId')}`,
      data: {
        widgetId: data.themeId,
        reuse: data.toReuse
      }
    });
  },
  getAllVersions() {
    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      url: [
        'v1/widgets?include_instances=true&tags=type:theme&package=com.fliplet.theme.default',
        '&include_all_versions=true',
        '&appId=' + Fliplet.Env.get('appId'),
        '&organizationId=' + Fliplet.Env.get('organizationId')
      ].join('')
    });
  },
  update(data) {
    const params = data.async ? '?async' : '';

    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      url: `v1/widget-instances/${state.themeInstance.id}${params}`,
      method: 'PUT',
      data: {
        package: state.activeTheme.package,
        values: data.values || {},
        widgetInstances: data.widgetInstances || []
      }
    });
  },
  delete(id) {
    const themeId = id || state.themeInstance.id;

    return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
      method: 'DELETE',
      url: `v1/widget-instances/${themeId}`
    });
  }
};
