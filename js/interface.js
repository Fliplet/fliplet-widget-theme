Handlebars.registerHelper('setValue', function(node) {
  var values = node.data._parent._parent.root.instance.settings.values || {};
  return values[this.name] || this.default;
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Fliplet.Widget.register('com.fliplet.theme', function () {
  var saveRequests = [];
  var $main = $('main');

  if (!Fliplet.Env.get('appId')) {
    throw new Error('appId is required');
  }

  $themeInstances = $('[data-theme-instances]');
  $instances = $('[data-instances]');
  $instanceEmpty = $('.instance-empty');

  function tpl(name) {
    return Fliplet.Widget.Templates['templates.' + name];
  }

  function reloadPage() {
    Fliplet.Studio.emit('reload-page-preview');
  }

  function init() {
    return Fliplet.Themes.get().then(function (themes) {
      $instances.html('');

      themes.forEach(function (theme) {
        if (theme.instances.length) {
          $instanceEmpty.addClass('hidden');
        } else {
          $instanceEmpty.removeClass('hidden');
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
        var picker = new CP(this);

        $(this).on('keyup change paste blur', function() {
          picker.set(this.value.toLowerCase());
          picker.trigger("change", [this.value.substring(1)], 'main-change');
        });

        picker.on("change", function(color) {
          this.target.value = '#' + color;
          $($(this.target).siblings('div')[0]).css('background-color', '#'+color);
        }, 'main-change');

        var colors = ['1d3f68', '00abd2', '036b95', 'ffd21d', 'ed9119', 'e03629', '831811', '5e0f0f', '23a437', '076c31'], box;

        for (var i = 0, len = colors.length; i < len; ++i) {
          box = document.createElement('span');
          box.className = 'color-picker-box';
          box.title = '#' + colors[i];
          box.style.backgroundColor = '#' + colors[i];
          box.addEventListener("click", function(e) {
            picker.set(this.title);
            picker.trigger("change", [this.title.slice(1)], 'main-change');
            e.stopPropagation();
          }, false);
          picker.picker.firstChild.appendChild(box);
        }
      });

    });
  }

  Fliplet.Themes.get().then(function (themes) {
    themes.forEach(function (theme) {
      $themeInstances.append(tpl('create')(theme));
      if (theme.instances.length) {
        $('[data-create-instance="' + theme.id + '"]').prop('checked', true);
      }
    });
  });

  $themeInstances.on('click', '[data-create-instance]', function (event) {

    var widgetInstanceId = $(this).data('create-instance');

    if ( $(this).is(':checked') ) {
      Fliplet.API.request({
        method: 'POST',
        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
        data: {
          widgetId: $(this).data('create-instance')
        }
      }).then(init);
    } else {
      Fliplet.API.request({
        method: 'DELETE',
        url: 'v1/widget-instances/' + $('[data-instances] [data-widget-id="' + widgetInstanceId + '"]').data('instance-id'),
        data: {
          destroy: true
        }
      }).then(init).then(reloadPage);
    }


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
      data: {
        package: $form.closest('[data-instance-id]').data('package-name'),
        values: data || {}
      }
    }));
  });

  Fliplet.Widget.onSaveRequest(function () {
    saveRequests = [];
    $instances.find('[data-instance-id] form').submit();

    $main.addClass('saving');

    Promise.all(saveRequests).then(function () {
      $main.removeClass('saving');

      Fliplet.Widget.complete();
      reloadPage();
    }, function (err) {
      $main.removeClass('saving');

      var message = err.responseJSON.error && err.responseJSON.error.formatted;
      console.warn(err.responseJSON.error);
      alert(message);
    });
  });

  init();

  return {};
});
