Handlebars.registerHelper('setValue', function(node) {
  var values = node.data._parent._parent.root.instance.settings.values || {};
  return values[this.name] || this.default;
});

Handlebars.registerHelper('isValueSelected', function(font, variable, node) {
  var values = node.data.root.instance.settings.values || {};
  return (values[variable.name] || variable.default) === font.name ? node.fn(this) : node.inverse(this);
});

Handlebars.registerHelper('customFontValue', function(fonts, variable, opts) {
  var values = opts.data.root.instance.settings.values || {};
  var legacyValue = values[variable.name];

  if (!legacyValue) {
    return opts.inverse(this);
  }

  return fonts.some(function (font) { return font.name === legacyValue; }) ? opts.inverse(this) : opts.fn(this);
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
  if (a == b)
    return opts.fn(this);
  else
    return opts.inverse(this);
});

// Flag to be used to determine if it is an initial load
// This is to prevent theme instances from being created on first load
var initialLoad = true;

Fliplet.Widget.register('com.fliplet.theme', function() {
  var saveRequests = [];
  var $main = $('main');

  if (!Fliplet.Env.get('appId')) {
    throw new Error('appId is required');
  }

  $themeInstances = $('[data-theme-instances]');
  $instances = $('[data-instances]');
  $instanceEmpty = $('.instance-empty');
  var emptyState;
  var fonts;
  var themes;
  var themesLoadingPromise;

  function tpl(name) {
    return Fliplet.Widget.Templates['templates.' + name];
  }

  function reloadPage() {
    Fliplet.Studio.emit('reload-page-preview');
  }

  function getThemes() {
    if (themes) {
      return Promise.resolve(themes);
    }

    if (!themesLoadingPromise) {
      themesLoadingPromise = Fliplet.API.request({
        url: [
          'v1/widgets?include_instances=true&tags=type:theme',
          '&include_all_versions=true',
          '&appId=' + Fliplet.Env.get('appId'),
          '&organizationId=' + Fliplet.Env.get('organizationId')
        ].join('')
      }).then(function (response) {
        // Only get themes that use the first version of the engine
        var themeWidgets = response.widgets;
        themeWidgets = _.values(_.groupBy(themeWidgets, 'package')).map((packageWidgets) => {
          return _.find(packageWidgets, (widget) => {
            return widget.tags.indexOf('engineVersion:2') === -1;
          });
        });

        themesLoadingPromise = null;
        themes = themeWidgets;
        return themeWidgets;
      });
    }

    return themesLoadingPromise;
  }

  function init() {
    $instanceEmpty.addClass('hidden');
    $instances.html('');

    // only get app fonts once
    var getAppFonts = fonts ? Promise.resolve() : Fliplet.App.Fonts.get().then(function (appFonts) {
      fonts = appFonts;
    });

    return getAppFonts.then(function () {
      return getThemes();
    }).then(function() {
      $instances.html('');
      emptyState = true;
      var openPanelIndex = Cookies.get('open-panel-index');

      themes.forEach(function(theme) {
        if (theme.instances.length) {
          emptyState = false;
        }
        theme.instances.forEach(function(instance) {
          $instances.append(tpl('instance')({
            instance: instance,
            theme: theme,
            fonts: fonts,
            webFonts: _.reject(fonts, function (font) { return font.url; }),
            customFonts: _.filter(fonts, function (font) { return font.url; })
          }));
          // Load open panel
          var panels = $('.panel-default');
          var i;
          for (i = 0; i < panels.length; i++) {
            if (i == openPanelIndex) {
              // Open panel
              $(panels[i]).find('.collapse').collapse('show');
              // Remove loading
              $instances.prev('.instance-loading').removeClass('load');
              // Scroll to open panel
              $('body').animate({
                scrollTop: $(panels[i]).offset().top - $('body').offset().top
              }, 1000);
            }
          }

          // Trigger a change to update all selects
          $instances.find('select').trigger('change');
        });
      });

      // Adds/Removes empty state
      if (emptyState) {
        $instanceEmpty.removeClass('hidden');
      } else {
        $instanceEmpty.addClass('hidden');
      }
      // Remove loading
      $instances.prev('.instance-loading').removeClass('load');

      // bind plugins on inputs
      $instances.find('[colorpicker-component]').colorpicker({
        container: true,
        customClass: 'colorpicker-2x',
        sliders: {
          saturation: {
            maxLeft: 235,
            maxTop: 235
          },
          hue: {
            maxTop: 235
          },
          alpha: {
            maxTop: 235
          }
        }
      });

      $instances.find('[colorpicker-component] input').on('click', function() {
        $(this).prev('.input-group-addon').find('i').trigger('click');
      });

      $instances.find('.input-group-addon i').on('click', function() {
        $(this).parents('.input-group-addon').next('input').trigger('focus');
      });
    });
  }

  getThemes().then(function(themes) {
    var themeId = '';
    $themeInstances.find('option').text('-- Select a theme');
    themes.forEach(function(theme) {
      $themeInstances.append(tpl('create')(theme));
      if (theme.instances.length) {
        themeId = theme.id;
      }
    });

    if (themeId !== '') {
      $themeInstances.val(themeId);
    } else {
      $themeInstances.val('none');
    }

    // The initialLoad flag was created because this gets triggered on first load to change the label name
    $themeInstances.trigger('change');
    $themeInstances.prop('disabled', '');
  });

  $(document).on('change', '.hidden-select', function() {
    var selectedValue = $(this).val();
    var selectedText = $(this).find("option:selected").text();
    $(this).parents('.select-proxy-display').find('.select-value-proxy').text(selectedText);
  });

  $(document).on('change', 'select[data-type="font"]', function () {
    $(this).closest('div').find('[data-custom-font]').toggleClass('hidden', !!$(this).val());
  });

  $(document).on('change', '[data-theme-instances]', function(event) {
    var widgetId = $(this).val();
    $instanceEmpty.addClass('hidden');
    $instances.prev('.instance-loading').addClass('load');
    // Removes all widget instances if NONE is selected
    if (widgetId === "none" && $('[data-instances] [data-widget-id]').length) {
      $('[data-instances] [data-widget-id]').each(function(i, el) {
        Fliplet.API.request({
          method: 'DELETE',
          url: 'v1/widget-instances/' + $(el).data('instance-id')
        });
      });
      init().then(reloadPage);
      return;
    }

    // Check if it is the same theme you selected
    if (!initialLoad && $('[data-widget-id="' + widgetId + '"]').length === 0) {
      // If it isn't then
      // First removes all instances
      $('[data-widget-id]').each(function(i, el) {
        Fliplet.API.request({
          method: 'DELETE',
          url: 'v1/widget-instances/' + $(el).data('instance-id')
        });
      });

      Cookies.remove('open-panel-index');

      // Then Adds the new one
      Fliplet.API.request({
        method: 'POST',
        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
        data: {
          widgetId: widgetId === 'none' ? undefined : widgetId,
          reuse: true
        }
      }).then(init).then(reloadPage);
    } else {
      init();
      // Turns flag to false
      // Next theme selections will create the theme instances correctly
      initialLoad = false;
    }
  });

  $(document).on('show.bs.collapse', '.panel-collapse', function() {
      $(this).siblings('.panel-heading').find('.fa-chevron-down').removeClass('fa-chevron-down').addClass('fa-chevron-up');
      var panelIndex = $(this).data('index');
      Cookies.set('open-panel-index', panelIndex);
    })
    .on('hide.bs.collapse', '.panel-collapse', function() {
      $(this).siblings('.panel-heading').find('.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });

  $instances.on('submit', '[data-instance-id] form', function(event, eventData) {
    event.preventDefault();

    var $form = $(this);

    var instanceId = $form.closest('[data-instance-id]').data('instance-id');

    var data = $form.serializeArray().reduce(function(obj, item) {
      var fieldType = $form.find('[name="' + item.name + '"]').data('type');

      if (fieldType === 'font' && !item.value) {
        item.value = $form.find('input[data-custom-font="' + item.name + '"]').val() || item.value;
      }

      obj[item.name] = item.value;
      return obj;
    }, {});

    saveRequests.push(Fliplet.API.request({
      url: 'v1/widget-instances/' + instanceId,
      method: 'PUT',
      data: {
        package: $form.closest('[data-instance-id]').data('package-name'),
        values: (eventData && eventData.reset) ? null : data || {}
      }
    }));
  });

  $('#reset_settings').on('click', function() {
    var alert = confirm("Reset theme settings.\nAre you sure you want to reset the theme settings?");
    if (alert) {
      save(true);
    }
  });

  $('header .betaAlert').on('click', function() {
    alert('During beta, please use live chat and let us know what you need help with.');
  });

  $('header .closeSideView').on('click', function() {
    Fliplet.Studio.emit('navigate', { name: 'appEdit' });
  });

  function save(reset) {
    saveRequests = [];
    $instances.find('[data-instance-id] form').trigger('submit', {
      reset: reset
    });

    $main.addClass('saving');

    Promise.all(saveRequests).then(function() {
      $main.removeClass('saving');

      Fliplet.Widget.complete();
      reloadPage();
      if (reset) {
        init();
      }
    }, function(err) {
      $main.removeClass('saving');

      var message = err.responseJSON.error && err.responseJSON.error.formatted;
      console.warn(err.responseJSON.error);
      alert(message);
    });
  }

  Fliplet.Widget.onSaveRequest(save);

  return {};
});
