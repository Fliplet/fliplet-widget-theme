Handlebars.registerHelper('setValue', function(node) {
  var settings = node.data._parent._parent.root.instance.settings;
  return settings[this.name] || this.default;
});

Fliplet.Widget.register('com.fliplet.theme', function () {
  var appId = Fliplet.Env.get('appId');
  var saveRequests = [];

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

      // bind plugins on inputs
      $instances.find('[data-type="color"]').each(function () {
        var picker = new jscolor(this);
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

  $instances.on('submit', '[data-instance-id] form', function (event) {
    event.preventDefault();

    var $form = $(this);

    var instanceId = $form.closest('[data-instance-id]').data('instance-id');

    var data = $form.serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

    saveRequests.push(Fliplet.API.request({
      url: 'v1/widget-instances/' + instanceId,
      method: 'PUT',
      data: data
    }));
  });

  Fliplet.Widget.onSaveRequest(function () {
    saveRequests = [];
    $instances.find('[data-instance-id] form').submit();

    Promise.all(saveRequests).then(function () {
      Fliplet.Widget.complete();
    });
  });

  init();

  return {};
});