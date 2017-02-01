Fliplet.Widget.register('com.fliplet.theme', function () {
  var appId = Fliplet.Env.get('appId');

  if (!appId) {
    throw new Error('appId is required');
  }

  $instances = $('[data-instances]');

  function tpl(name) {
    return Fliplet.Widget.Templates['templates.' + name];
  }

  function init() {
    return Fliplet.API.request({
      url: 'v1/widgets?include_instances=true&tags=type:theme&appId=' + appId
    }).then(function (response) {
      $instances.html('');

      response.widgets.forEach(function (theme) {
        if (!theme.instances.length) {
          $instances.append(tpl('create')(theme));
          return;
        }

        theme.instances.forEach(function (instance) {
          $instances.append(tpl('instance')({
            instance: instance,
            theme: theme
          }));
        });
      });
    });
  }

  $instances.on('click', '[data-create-instance]', function (event) {
    event.preventDefault();

    Fliplet.API.request({
      method: 'POST',
      url: 'v1/widget-instances?appId=' + appId,
      data: {
        widgetId: $(this).data('create-instance')
      }
    }).then(init);
  });

  $instances.on('click', '[data-delete-instance]', function (event) {
    event.preventDefault();

    Fliplet.API.request({
      method: 'DELETE',
      url: 'v1/widget-instances/' + $(this).closest('[data-instance-id]').data('instance-id')
    }).then(init);
  });

  init();

  return {};
});