app.register({
    core: {
        events: {
            init: function () {
                $(document)

                    // -------------------------------------------------------------
                    // NAV BUTTONS
                    // -------------------------------------------------------------

                    .on('click', '*[data-go]', function (e) {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();

                        $(document).trigger('ctrl.beforego');

                        var action = $(this).attr('data-go');

                        var callableAction = app.ctrl[action];

                        callableAction();
                    })

                    // -------------------------------------------------------------
                    // FORM CUSTOM SUBMIT
                    // -------------------------------------------------------------

                    .on('submit', 'form[data-ws], form[data-ctrl]', function (e) {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();

                        var callableAction = null;

                        if ($(this).attr('data-ws')) {
                            callableAction = app.ws[$(this).attr('data-ws')];
                        } else if ($(this).attr('data-ctrl')) {
                            callableAction = app.ctrl[$(this).attr('data-ctrl')];
                        } else {
                            app.core.ui.toast("Mauvais callable de traitement de formulaire", "error");
                            return;
                        }

                        callableAction($(this));
                    })

                    // -------------------------------------------------------------
                    // AJAX SPINNER
                    // -------------------------------------------------------------

                    .ajaxStart(function () {
                        app.core.ui.displayContentLoading();
                    })

                    .ajaxStop(function () {
                        app.core.ui.displayContentLoading(false);
                    })

                    // -------------------------------------------------------------
                    // GLOBAL BEHAVIORS
                    // -------------------------------------------------------------

                    .on('click', '[href="#"]', function (e) {
                        e.preventDefault();
                        return false;
                    })

                    // -------------------------------------------------------------
                    // TEMPLATING ENGINE
                    // -------------------------------------------------------------

                    .on('template.applyed', function () {
                        app.core.ui.displayContentLoading(false);
                        app.core.ui.plugins.init();
                    })

                    .on('template.registered', function (e, template) {
                        if (template.id === "infos") {
                            app.core.ui.applyTemplate(template.id, template.data);
                        }
                    })

                    ;

                app.core.events.registerComponentEvents(app);
            },

            // ---------------------------------------------------------------------
            // INITIALIZE COMPONENTS EVENTS
            // ---------------------------------------------------------------------

            registerComponentEvents: function (component, deep) {
                if (!isDefined(deep))
                    deep = 0;

                if (deep > 4) // LIMIT INIT SEARCH RECURSION TO 4 LEVEL
                    return;

                // RECURSION OVER APPLICATION COMPONENTS
                Object.keys(component).forEach(function (key) {
                    var c = component[key];
                    if (c.hasOwnProperty('initEvents')) {
                        c.initEvents();
                    } else if (typeof c === "object") {
                        app.core.events.registerComponentEvents(c, ++deep);
                    }
                });
            }
        }
    }
});
