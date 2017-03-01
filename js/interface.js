Handlebars.registerHelper('setValue', function(node) {
    var values = node.data._parent._parent.root.instance.settings.values || {};
    return values[this.name] || this.default;
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

    function tpl(name) {
        return Fliplet.Widget.Templates['templates.' + name];
    }

    function reloadPage() {
        Fliplet.Studio.emit('reload-page-preview');
    }

    function init() {
        $instanceEmpty.addClass('hidden');
        $instances.html('');
        $instances.prev('.instance-loading').addClass('load');
        return Fliplet.Themes.get().then(function(themes) {
            $instances.html('');
            emptyState = true;
            var openPanelIndex = Cookies.get('panelIndex');

            themes.forEach(function(theme) {
                if (theme.instances.length) {
                    emptyState = false;
                }
                theme.instances.forEach(function(instance) {
                    $instances.append(tpl('instance')({
                        instance: instance,
                        theme: theme
                    }));
                    // Load open panel
                    var panels = $('.panel-default');
                    var i;
                    for (i = 0; i < panels.length; i++) {
                        if ( i == openPanelIndex ) {
                            // Open panel
                    		    $(panels[i]).find('.collapse').collapse('show');
                            // Remove loading
                            $instances.prev('.instance-loading').removeClass('load');
                            // Scroll to open panel
                            $('body').animate({
                                scrollTop: $(panels[i]).offset().top - $('body').offset().top
                            }, 1000 );
                        }
                    }
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
                container: true
            });

            $instances.find('[colorpicker-component] input').on('focus', function() {
                $(this).prev('.input-group-addon').find('i').trigger('click');
            });
        });
    }

    Fliplet.Themes.get().then(function(themes) {
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

    $(document).on('change', '[data-theme-instances]', function(event) {
        var widgetId = $(this).val();
        // Removes all widget instances if NONE is selected
        if (widgetId === "none" && $('[data-instances] [data-widget-id]').length) {
            $('[data-instances] [data-widget-id]').each(function(i, el) {
                Fliplet.API.request({
                    method: 'DELETE',
                    url: 'v1/widget-instances/' + $(el).data('instance-id')});
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
                    url: 'v1/widget-instances/' + $(el).data('instance-id'),
                    data: {
                        destroy: true
                    }
                });
            });

            Cookies.remove('panelIndex');

            // Then Adds the new one
            Fliplet.API.request({
                method: 'POST',
                url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
                data: {
                  widgetId: widgetId,
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
      Cookies.set('panelIndex', panelIndex);
    })
    .on('hide.bs.collapse', '.panel-collapse', function() {
      $(this).siblings('.panel-heading').find('.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });

    $instances.on('submit', '[data-instance-id] form', function(event, eventData) {
        event.preventDefault();

        var $form = $(this);

        var instanceId = $form.closest('[data-instance-id]').data('instance-id');


        var data = (eventData && eventData.reset) ? {} : $form.serializeArray().reduce(function(obj, item) {
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

    $('#reset_settings').on('click', function() {
      var alert = confirm("Reset theme settings.\nAre you sure you want to reset the theme settings?");
      if (alert) {
        $instances.find('[data-instance-id] form').trigger('submit', { reset: true });
      }
    });

    Fliplet.Widget.onSaveRequest(function() {
        saveRequests = [];
        $instances.find('[data-instance-id] form').submit();

        $main.addClass('saving');

        Promise.all(saveRequests).then(function() {
            $main.removeClass('saving');

            Fliplet.Widget.complete();
            reloadPage();
        }, function(err) {
            $main.removeClass('saving');

            var message = err.responseJSON.error && err.responseJSON.error.formatted;
            console.warn(err.responseJSON.error);
            alert(message);
        });
    });

    return {};
});
