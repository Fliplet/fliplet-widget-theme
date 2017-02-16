window.ENV.appId = 11;

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
        return Fliplet.Themes.get().then(function(themes) {
            $instances.html('');
            emptyState = true;

            themes.forEach(function(theme) {
                if (theme.instances.length) {
                    emptyState = false;
                }
                theme.instances.forEach(function(instance) {
                    $instances.append(tpl('instance')({
                        instance: instance,
                        theme: theme
                    }));
                });
            });

            // Adds/Removes empty state
            if (emptyState) {
                $instanceEmpty.removeClass('hidden');
            } else {
                $instanceEmpty.addClass('hidden');
            }

            // bind plugins on inputs
            $instances.find('[colorpicker-component]').each(function() {
                $(this).colorpicker({
                    container: true
                });
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
        var widgetInstanceId = $(this).val();
        // Removes all widget instances if NONE is selected
        if (widgetInstanceId === "none" && $('[data-instances] [data-widget-id]').length) {
            $('[data-instances] [data-widget-id]').each(function(i, el) {
                Fliplet.API.request({
                    method: 'DELETE',
                    url: 'v1/widget-instances/' + $(el).data('instance-id'),
                    data: {
                        destroy: true
                    }
                });
            });
            init().then(reloadPage);
            return;
        }

        // Check if it is the same theme you selected
        if (!initialLoad && $('[data-widget-id="' + widgetInstanceId + '"]').length === 0) {
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

            // Then Adds the new one
            Fliplet.API.request({
                method: 'POST',
                url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),
                data: {
                    widgetId: widgetInstanceId
                }
            }).then(init).then(reloadPage);
        } else {
            init().then(reloadPage);
            // Turns flag to false
            // Next theme selections will create the theme instances correctly
            initialLoad = false;
        }
    });

    $instances.on('submit', '[data-instance-id] form', function(event) {
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

    init();

    return {};
});
