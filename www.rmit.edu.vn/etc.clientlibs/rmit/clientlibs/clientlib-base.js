/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function() {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert = function(el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.3.7'

    Alert.TRANSITION_DURATION = 150

    Alert.prototype.close = function(e) {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector === '#' ? [] : selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
            .one('bsTransitionEnd', removeElement)
            .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.alert

    $.fn.alert = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function() {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }

    Button.VERSION = '3.3.7'

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function(state) {
        var d = 'disabled'
        var $el = this.$element
        var val = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state += 'Text'

        if (data.resetText == null) $el.data('resetText', $el[val]())

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function() {
            $el[val](data[state] == null ? this.options[state] : data[state])

            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d).prop(d, true)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d).prop(d, false)
            }
        }, this), 0)
    }

    Button.prototype.toggle = function() {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked')) changed = false
                $parent.find('.active').removeClass('active')
                this.$element.addClass('active')
            } else if ($input.prop('type') == 'checkbox') {
                if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
                this.$element.toggleClass('active')
            }
            $input.prop('checked', this.$element.hasClass('active'))
            if (changed) $input.trigger('change')
        } else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
            this.$element.toggleClass('active')
        }
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    var old = $.fn.button

    $.fn.button = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function() {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document)
        .on('click.bs.button.data-api', '[data-toggle^="button"]', function(e) {
            var $btn = $(e.target).closest('.btn')
            Plugin.call($btn, 'toggle')
            if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
                // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
                e.preventDefault()
                // The target component still receive the focus
                if ($btn.is('input,button')) $btn.trigger('focus')
                else $btn.find('input:visible,button:visible').first().trigger('focus')
            }
        })
        .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function(e) {
            $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
        })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function(element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = null
        this.sliding = null
        this.interval = null
        this.$active = null
        this.$items = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION = '3.3.7'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37:
                this.prev();
                break
            case 39:
                this.next();
                break
            default:
                return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval &&
            !this.paused &&
            (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function(direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0) ||
            (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function(pos) {
        var that = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding) return this.$element.one('slid.bs.carousel', function() {
            that.to(pos)
        }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function(e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function() {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function() {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that = this

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function() {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function() {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    var old = $.fn.carousel

    $.fn.carousel = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    var clickHandler = function(e) {
        var href
        var $this = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

    $(window).on('load', function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+
function($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION = '3.3.7'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function() {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function() {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element[dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function() {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function(i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target') ||
            (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
        var $this = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle="dropdown"]'
    var Dropdown = function(element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.7'

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function() {
            var $this = $(this)
            var $parent = getParent($this)
            var relatedTarget = {
                relatedTarget: this
            }

            if (!$parent.hasClass('open')) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
        })
    }

    Dropdown.prototype.toggle = function(e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = {
                relatedTarget: this
            }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.dropdown', relatedTarget))
        }

        return false
    }

    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0) index-- // up
            if (e.which == 40 && index < $items.length - 1) index++ // down
                if (!~index) index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
            e.stopPropagation()
        })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function(element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$backdrop = null
        this.isShown = null
        this.originalBodyPad = null
        this.scrollbarWidth = 0
        this.ignoreBackdropClick = false

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function() {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION = '3.3.7'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', {
            relatedTarget: _relatedTarget
        })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.setScrollbar()
        this.$body.addClass('modal-open')

        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.$dialog.on('mousedown.dismiss.bs.modal', function() {
            that.$element.one('mouseup.dismiss.bs.modal', function(e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
            })
        })

        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            that.adjustDialog()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element.addClass('in')

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', {
                relatedTarget: _relatedTarget
            })

            transition ?
                that.$dialog // wait for modal to slide in
                .one('bsTransitionEnd', function() {
                    that.$element.trigger('focus').trigger(e)
                })
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()
        this.resize()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal')

        this.$dialog.off('mousedown.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
            .one('bsTransitionEnd', $.proxy(this.hideModal, this))
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function() {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function(e) {
                if (document !== e.target &&
                    this.$element[0] !== e.target &&
                    !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.resize = function() {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }

    Modal.prototype.hideModal = function() {
        var that = this
        this.$element.hide()
        this.backdrop(function() {
            that.$body.removeClass('modal-open')
            that.resetAdjustments()
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function(callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $(document.createElement('div'))
                .addClass('modal-backdrop ' + animate)
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.modal', $.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false
                    return
                }
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ?
                    this.$element[0].focus() :
                    this.hide()
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                .one('bsTransitionEnd', callback)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function() {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                .one('bsTransitionEnd', callbackRemove)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    // these following methods are used to handle overflowing modals

    Modal.prototype.handleUpdate = function() {
        this.adjustDialog()
    }

    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    }

    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    }

    Modal.prototype.checkScrollbar = function() {
        var fullWindowWidth = window.innerWidth
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect()
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        this.originalBodyPad = document.body.style.paddingRight || ''
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function() {
        this.$body.css('padding-right', this.originalBodyPad)
    }

    Modal.prototype.measureScrollbar = function() { // thx walsh
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function() {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function() {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function(element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null
        this.inState = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION = '3.3.7'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState = {
            click: false,
            hover: false,
            focus: false
        }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, {
                trigger: 'manual',
                selector: ''
            })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function() {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in'
            return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.isInStateTrue = function() {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    }

    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function() {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({
                    top: 0,
                    left: 0,
                    display: 'block'
                })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            this.$element.trigger('inserted.bs.' + this.type)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var viewportDim = this.getPosition(this.$viewport)

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                    placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                    placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                    placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function() {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function(delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function(callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element
                    .removeAttr('aria-describedby')
                    .trigger('hidden.bs.' + that.type)
            }
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function() {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            })
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : (isSvg ? null : $element.offset())
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'top' ? {
                top: pos.top - actualHeight,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'left' ? {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
            } :
            /* placement == 'right' */
            {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
            }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function() {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title') ||
            (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function() {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    }

    Tooltip.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function() {
        this.enabled = true
    }

    Tooltip.prototype.disable = function() {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function(e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click
            if (self.isInStateTrue()) self.enter(self)
            else self.leave(self)
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
    }

    Tooltip.prototype.destroy = function() {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function() {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null
            that.$arrow = null
            that.$viewport = null
            that.$element = null
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function(element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.VERSION = '3.3.7'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function() {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content') ||
            (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }

    Popover.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function() {
        $.fn.popover = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0

        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
    }

    ScrollSpy.VERSION = '3.3.7'

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function() {
        var that = this
        var offsetMethod = 'offset'
        var offsetBase = 0

        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()

        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
        }

        this.$body
            .find(this.selector)
            .map(function() {
                var $el = $(this)
                var href = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href &&
                    $href.length &&
                    $href.is(':visible') &&
                    [
                        [$href[offsetMethod]().top + offsetBase, href]
                    ]) || null
            })
            .sort(function(a, b) {
                return a[0] - b[0]
            })
            .each(function() {
                that.offsets.push(this[0])
                that.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i] &&
                scrollTop >= offsets[i] &&
                (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) &&
                this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function() {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function(element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element)
        // jscs:enable requireDollarBeforejQueryAssignment
    }

    Tab.VERSION = '3.3.7'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function() {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback &&
            $.support.transition &&
            ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
            .one('bsTransitionEnd', next)
            .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab

    $.fn.tab = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function() {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function(e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.VERSION = '3.3.7'

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }

    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && scrollTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
    }

    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(':visible')) return

        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')

            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')

            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.affix

    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function() {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null) data.offset.top = data.offsetTop

            Plugin.call($spy, data)
        })
    })

}(jQuery);

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function(key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function(key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };

}));

/*utilty functions */

function getDomesticOrInternationalCookie() {
    return domOrIntCookie;
}


var domOrIntCookie = $.cookie('domesticOrInternational');

function isCookieEnabled() {
    var cookieEnabled = navigator.cookieEnabled;

    if (cookieEnabled === false) {
        return false;
    }

    if (document.cookie == '') {
        document.cookie = 'testcookie=1';

        if (document.cookie == '') {
            $.removeCookie('testcookie'); // clean up
            return false;
        }
    }

    $.removeCookie('testcookie'); // clean up
    return true;
}

function setDomesticOrInternationalCookie(value) {
    if (isCookieEnabled) {
        $.cookie('domesticOrInternational', value, {
            path: '/',
            expires: 90
        });
    }
    domOrIntCookie = value;
    $(window).trigger("domesticOrInternationalChanged");
}

function getDomesticOrInternationalCookie() {
    return domOrIntCookie;
}

function removeRedundantDomIntClasses() {
    $('.b-domestic.b-international').removeClass('b-domestic b-international');
}

function displayDomesticOrInternational() {
    var audience = domOrIntCookie;

    if (audience === "international") {
        $("body").removeClass("b-domestic").addClass("b-international");


    } else {
        $("body").removeClass("b-international").addClass("b-domestic");

    }
}
/*utilty functions ends */
/*

     _ _      _       _

___| (_) ___| | __  (_)___

/ __| | |/ __| |/ /  | / __|

\__ \ | | (__|   < _ | \__ \

|___/_|_|\___|_|\_(_)/ |___/

                   |__/

 

Version: 1.8.0

  Author: Ken Wheeler

Website: http://kenwheeler.github.io

    Docs: http://kenwheeler.github.io/slick

    Repo: http://github.com/kenwheeler/slick

  Issues: http://github.com/kenwheeler/slick/issues

 

*/

/* global window, document, define, jQuery, setInterval, clearInterval */

;
(function(factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {

        define(['jquery'], factory);

    } else if (typeof exports !== 'undefined') {

        module.exports = factory(require('jquery'));

    } else {

        factory(jQuery);

    }


}(function($) {

    'use strict';

    var Slick = window.Slick || {};


    Slick = (function() {


        var instanceUid = 0;


        function Slick(element, settings) {


            var _ = this,
                dataSettings;


            _.defaults = {

                accessibility: true,

                adaptiveHeight: false,

                appendArrows: $(element),

                appendDots: $(element),

                arrows: true,

                asNavFor: null,

                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',

                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',

                autoplay: false,

                autoplaySpeed: 3000,

                centerMode: false,

                centerPadding: '50px',

                cssEase: 'ease',

                customPaging: function(slider, i) {

                    return $('<button type="button" />').text(i + 1);

                },

                dots: false,

                dotsClass: 'slick-dots',

                draggable: true,

                easing: 'linear',

                edgeFriction: 0.35,

                fade: false,

                focusOnSelect: false,

                focusOnChange: false,

                infinite: true,

                initialSlide: 0,

                lazyLoad: 'ondemand',

                mobileFirst: false,

                pauseOnHover: true,

                pauseOnFocus: true,

                pauseOnDotsHover: false,

                respondTo: 'window',

                responsive: null,

                rows: 1,

                rtl: false,

                slide: '',

                slidesPerRow: 1,

                slidesToShow: 1,

                slidesToScroll: 1,

                speed: 500,

                swipe: true,

                swipeToSlide: false,

                touchMove: true,

                touchThreshold: 5,

                useCSS: true,

                useTransform: true,

                variableWidth: false,

                vertical: false,

                verticalSwiping: false,

                waitForAnimate: true,

                zIndex: 1000

            };


            _.initials = {

                animating: false,

                dragging: false,

                autoPlayTimer: null,

                currentDirection: 0,

                currentLeft: null,

                currentSlide: 0,

                direction: 1,

                $dots: null,

                listWidth: null,

                listHeight: null,

                loadIndex: 0,

                $nextArrow: null,

                $prevArrow: null,

                scrolling: false,

                slideCount: null,

                slideWidth: null,

                $slideTrack: null,

                $slides: null,

                sliding: false,

                slideOffset: 0,

                swipeLeft: null,

                swiping: false,

                $list: null,

                touchObject: {},

                transformsEnabled: false,

                unslicked: false

            };


            $.extend(_, _.initials);


            _.activeBreakpoint = null;

            _.animType = null;

            _.animProp = null;

            _.breakpoints = [];

            _.breakpointSettings = [];

            _.cssTransitions = false;

            _.focussed = false;

            _.interrupted = false;

            _.hidden = 'hidden';

            _.paused = true;

            _.positionProp = null;

            _.respondTo = null;

            _.rowCount = 1;

            _.shouldClick = true;

            _.$slider = $(element);

            _.$slidesCache = null;

            _.transformType = null;

            _.transitionType = null;

            _.visibilityChange = 'visibilitychange';

            _.windowWidth = 0;

            _.windowTimer = null;


            dataSettings = $(element).data('slick') || {};


            _.options = $.extend({}, _.defaults, settings, dataSettings);


            _.currentSlide = _.options.initialSlide;


            _.originalSettings = _.options;


            if (typeof document.mozHidden !== 'undefined') {

                _.hidden = 'mozHidden';

                _.visibilityChange = 'mozvisibilitychange';

            } else if (typeof document.webkitHidden !== 'undefined') {

                _.hidden = 'webkitHidden';

                _.visibilityChange = 'webkitvisibilitychange';

            }


            _.autoPlay = $.proxy(_.autoPlay, _);

            _.autoPlayClear = $.proxy(_.autoPlayClear, _);

            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);

            _.changeSlide = $.proxy(_.changeSlide, _);

            _.clickHandler = $.proxy(_.clickHandler, _);

            _.selectHandler = $.proxy(_.selectHandler, _);

            _.setPosition = $.proxy(_.setPosition, _);

            _.swipeHandler = $.proxy(_.swipeHandler, _);

            _.dragHandler = $.proxy(_.dragHandler, _);

            _.keyHandler = $.proxy(_.keyHandler, _);


            _.instanceUid = instanceUid++;


            // A simple way to check for HTML strings

            // Strict HTML recognition (must start with <)

            // Extracted from jQuery v1.11 source

            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();

            _.init(true);


        }


        return Slick;


    }());


    Slick.prototype.activateADA = function() {

        var _ = this;


        _.$slideTrack.find('.slick-active').attr({

            'aria-hidden': 'false'

        }).find('a, input, button, select').attr({

            'tabindex': '0'

        });


    };


    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {


        var _ = this;


        if (typeof(index) === 'boolean') {

            addBefore = index;

            index = null;

        } else if (index < 0 || (index >= _.slideCount)) {

            return false;

        }


        _.unload();


        if (typeof(index) === 'number') {

            if (index === 0 && _.$slides.length === 0) {

                $(markup).appendTo(_.$slideTrack);

            } else if (addBefore) {

                $(markup).insertBefore(_.$slides.eq(index));

            } else {

                $(markup).insertAfter(_.$slides.eq(index));

            }

        } else {

            if (addBefore === true) {

                $(markup).prependTo(_.$slideTrack);

            } else {

                $(markup).appendTo(_.$slideTrack);

            }

        }


        _.$slides = _.$slideTrack.children(this.options.slide);


        _.$slideTrack.children(this.options.slide).detach();


        _.$slideTrack.append(_.$slides);


        _.$slides.each(function(index, element) {

            $(element).attr('data-slick-index', index);

        });


        _.$slidesCache = _.$slides;


        _.reinit();


    };


    Slick.prototype.animateHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {

            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

            _.$list.animate({

                height: targetHeight

            }, _.options.speed);

        }

    };


    Slick.prototype.animateSlide = function(targetLeft, callback) {


        var animProps = {},

            _ = this;


        _.animateHeight();


        if (_.options.rtl === true && _.options.vertical === false) {

            targetLeft = -targetLeft;

        }

        if (_.transformsEnabled === false) {

            if (_.options.vertical === false) {

                _.$slideTrack.animate({

                    left: targetLeft

                }, _.options.speed, _.options.easing, callback);

            } else {

                _.$slideTrack.animate({

                    top: targetLeft

                }, _.options.speed, _.options.easing, callback);

            }


        } else {


            if (_.cssTransitions === false) {

                if (_.options.rtl === true) {

                    _.currentLeft = -(_.currentLeft);

                }

                $({

                    animStart: _.currentLeft

                }).animate({

                    animStart: targetLeft

                }, {

                    duration: _.options.speed,

                    easing: _.options.easing,

                    step: function(now) {

                        now = Math.ceil(now);

                        if (_.options.vertical === false) {

                            animProps[_.animType] = 'translate(' +

                                now + 'px, 0px)';

                            _.$slideTrack.css(animProps);

                        } else {

                            animProps[_.animType] = 'translate(0px,' +

                                now + 'px)';

                            _.$slideTrack.css(animProps);

                        }

                    },

                    complete: function() {

                        if (callback) {

                            callback.call();

                        }

                    }

                });


            } else {


                _.applyTransition();

                targetLeft = Math.ceil(targetLeft);


                if (_.options.vertical === false) {

                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';

                } else {

                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';

                }

                _.$slideTrack.css(animProps);


                if (callback) {

                    setTimeout(function() {


                        _.disableTransition();


                        callback.call();

                    }, _.options.speed);

                }


            }


        }


    };


    Slick.prototype.getNavTarget = function() {


        var _ = this,

            asNavFor = _.options.asNavFor;


        if (asNavFor && asNavFor != null) {

            asNavFor = $(asNavFor).not(_.$slider);

        }


        return asNavFor;


    };


    Slick.prototype.asNavFor = function(index) {


        var _ = this,

            asNavFor = _.getNavTarget();


        if (asNavFor !== null && typeof asNavFor === 'object') {

            asNavFor.each(function() {

                var target = $(this).slick('getSlick');

                if (!target.unslicked) {

                    target.slideHandler(index, true);

                }

            });

        }


    };


    Slick.prototype.applyTransition = function(slide) {


        var _ = this,

            transition = {};


        if (_.options.fade === false) {

            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;

        } else {

            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;

        }


        if (_.options.fade === false) {

            _.$slideTrack.css(transition);

        } else {

            _.$slides.eq(slide).css(transition);

        }


    };


    Slick.prototype.autoPlay = function() {


        var _ = this;


        _.autoPlayClear();


        if (_.slideCount > _.options.slidesToShow) {

            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);

        }


    };


    Slick.prototype.autoPlayClear = function() {


        var _ = this;


        if (_.autoPlayTimer) {

            clearInterval(_.autoPlayTimer);

        }


    };


    Slick.prototype.autoPlayIterator = function() {


        var _ = this,

            slideTo = _.currentSlide + _.options.slidesToScroll;


        if (!_.paused && !_.interrupted && !_.focussed) {


            if (_.options.infinite === false) {


                if (_.direction === 1 && (_.currentSlide + 1) === (_.slideCount - 1)) {

                    _.direction = 0;

                } else if (_.direction === 0) {


                    slideTo = _.currentSlide - _.options.slidesToScroll;


                    if (_.currentSlide - 1 === 0) {

                        _.direction = 1;

                    }


                }


            }


            _.slideHandler(slideTo);


        }


    };


    Slick.prototype.buildArrows = function() {


        var _ = this;


        if (_.options.arrows === true) {


            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');

            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');


            if (_.slideCount > _.options.slidesToShow) {


                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');


                if (_.htmlExpr.test(_.options.prevArrow)) {

                    _.$prevArrow.prependTo(_.options.appendArrows);

                }


                if (_.htmlExpr.test(_.options.nextArrow)) {

                    _.$nextArrow.appendTo(_.options.appendArrows);

                }


                if (_.options.infinite !== true) {

                    _.$prevArrow

                        .addClass('slick-disabled')

                        .attr('aria-disabled', 'true');

                }


            } else {


                _.$prevArrow.add(_.$nextArrow)


                    .addClass('slick-hidden')

                    .attr({

                        'aria-disabled': 'true',

                        'tabindex': '-1'

                    });


            }


        }


    };


    Slick.prototype.buildDots = function() {


        var _ = this,

            i, dot;


        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {


            _.$slider.addClass('slick-dotted');


            dot = $('<ul />').addClass(_.options.dotsClass);


            for (i = 0; i <= _.getDotCount(); i += 1) {

                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));

            }


            _.$dots = dot.appendTo(_.options.appendDots);


            _.$dots.find('li').first().addClass('slick-active');


        }


    };


    Slick.prototype.buildOut = function() {


        var _ = this;


        _.$slides =

            _.$slider

            .children(_.options.slide + ':not(.slick-cloned)')

            .addClass('slick-slide');


        _.slideCount = _.$slides.length;


        _.$slides.each(function(index, element) {

            $(element)

                .attr('data-slick-index', index)

                .data('originalStyling', $(element).attr('style') || '');

        });


        _.$slider.addClass('slick-slider');


        _.$slideTrack = (_.slideCount === 0) ?

            $('<div class="slick-track"/>').appendTo(_.$slider) :

            _.$slides.wrapAll('<div class="slick-track"/>').parent();


        _.$list = _.$slideTrack.wrap(

            '<div class="slick-list"/>').parent();

        _.$slideTrack.css('opacity', 0);


        if (_.options.centerMode === true || _.options.swipeToSlide === true) {

            _.options.slidesToScroll = 1;

        }


        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');


        _.setupInfinite();


        _.buildArrows();


        _.buildDots();


        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);


        if (_.options.draggable === true) {

            _.$list.addClass('draggable');

        }


    };


    Slick.prototype.buildRows = function() {


        var _ = this,
            a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection;


        newSlides = document.createDocumentFragment();

        originalSlides = _.$slider.children();


        if (_.options.rows > 0) {


            slidesPerSection = _.options.slidesPerRow * _.options.rows;

            numOfSlides = Math.ceil(

                originalSlides.length / slidesPerSection

            );


            for (a = 0; a < numOfSlides; a++) {

                var slide = document.createElement('div');

                for (b = 0; b < _.options.rows; b++) {

                    var row = document.createElement('div');

                    for (c = 0; c < _.options.slidesPerRow; c++) {

                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));

                        if (originalSlides.get(target)) {

                            row.appendChild(originalSlides.get(target));

                        }

                    }

                    slide.appendChild(row);

                }

                newSlides.appendChild(slide);

            }


            _.$slider.empty().append(newSlides);

            _.$slider.children().children().children()

                .css({

                    'width': (100 / _.options.slidesPerRow) + '%',

                    'display': 'inline-block'

                });


        }


    };


    Slick.prototype.checkResponsive = function(initial, forceUpdate) {


        var _ = this,

            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;

        var sliderWidth = _.$slider.width();

        var windowWidth = window.innerWidth || $(window).width();


        if (_.respondTo === 'window') {

            respondToWidth = windowWidth;

        } else if (_.respondTo === 'slider') {

            respondToWidth = sliderWidth;

        } else if (_.respondTo === 'min') {

            respondToWidth = Math.min(windowWidth, sliderWidth);

        }


        if (_.options.responsive &&

            _.options.responsive.length &&

            _.options.responsive !== null) {


            targetBreakpoint = null;


            for (breakpoint in _.breakpoints) {

                if (_.breakpoints.hasOwnProperty(breakpoint)) {

                    if (_.originalSettings.mobileFirst === false) {

                        if (respondToWidth < _.breakpoints[breakpoint]) {

                            targetBreakpoint = _.breakpoints[breakpoint];

                        }

                    } else {

                        if (respondToWidth > _.breakpoints[breakpoint]) {

                            targetBreakpoint = _.breakpoints[breakpoint];

                        }

                    }

                }

            }


            if (targetBreakpoint !== null) {

                if (_.activeBreakpoint !== null) {

                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {

                        _.activeBreakpoint =

                            targetBreakpoint;

                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {

                            _.unslick(targetBreakpoint);

                        } else {

                            _.options = $.extend({}, _.originalSettings,

                                _.breakpointSettings[

                                    targetBreakpoint]);

                            if (initial === true) {

                                _.currentSlide = _.options.initialSlide;

                            }

                            _.refresh(initial);

                        }

                        triggerBreakpoint = targetBreakpoint;

                    }

                } else {

                    _.activeBreakpoint = targetBreakpoint;

                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {

                        _.unslick(targetBreakpoint);

                    } else {

                        _.options = $.extend({}, _.originalSettings,

                            _.breakpointSettings[

                                targetBreakpoint]);

                        if (initial === true) {

                            _.currentSlide = _.options.initialSlide;

                        }

                        _.refresh(initial);

                    }

                    triggerBreakpoint = targetBreakpoint;

                }

            } else {

                if (_.activeBreakpoint !== null) {

                    _.activeBreakpoint = null;

                    _.options = _.originalSettings;

                    if (initial === true) {

                        _.currentSlide = _.options.initialSlide;

                    }

                    _.refresh(initial);

                    triggerBreakpoint = targetBreakpoint;

                }

            }


            // only trigger breakpoints during an actual break. not on initialize.

            if (!initial && triggerBreakpoint !== false) {

                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);

            }

        }


    };


    Slick.prototype.changeSlide = function(event, dontAnimate) {


        var _ = this,

            $target = $(event.currentTarget),

            indexOffset, slideOffset, unevenOffset;


        // If target is a link, prevent default action.

        if ($target.is('a')) {

            event.preventDefault();

        }


        // If target is not the <li> element (ie: a child), find the <li>.

        if (!$target.is('li')) {

            $target = $target.closest('li');

        }


        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);

        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;


        switch (event.data.message) {


            case 'previous':

                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

                if (_.slideCount > _.options.slidesToShow) {

                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);

                }

                break;


            case 'next':

                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

                if (_.slideCount > _.options.slidesToShow) {

                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);

                }

                break;


            case 'index':

                var index = event.data.index === 0 ? 0 :

                    event.data.index || $target.index() * _.options.slidesToScroll;


                _.slideHandler(_.checkNavigable(index), false, dontAnimate);

                $target.children().trigger('focus');

                break;


            default:

                return;

        }


    };


    Slick.prototype.checkNavigable = function(index) {


        var _ = this,

            navigables, prevNavigable;


        navigables = _.getNavigableIndexes();

        prevNavigable = 0;

        if (index > navigables[navigables.length - 1]) {

            index = navigables[navigables.length - 1];

        } else {

            for (var n in navigables) {

                if (index < navigables[n]) {

                    index = prevNavigable;

                    break;

                }

                prevNavigable = navigables[n];

            }

        }


        return index;

    };


    Slick.prototype.cleanUpEvents = function() {


        var _ = this;


        if (_.options.dots && _.$dots !== null) {


            $('li', _.$dots)

                .off('click.slick', _.changeSlide)

                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))

                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));


            if (_.options.accessibility === true) {

                _.$dots.off('keydown.slick', _.keyHandler);

            }

        }


        _.$slider.off('focus.slick blur.slick');


        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);

            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);


            if (_.options.accessibility === true) {

                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);

                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);

            }

        }


        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);


        _.$list.off('click.slick', _.clickHandler);


        $(document).off(_.visibilityChange, _.visibility);


        _.cleanUpSlideEvents();


        if (_.options.accessibility === true) {

            _.$list.off('keydown.slick', _.keyHandler);

        }


        if (_.options.focusOnSelect === true) {

            $(_.$slideTrack).children().off('click.slick', _.selectHandler);

        }


        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);


        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);


        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);


        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);


    };


    Slick.prototype.cleanUpSlideEvents = function() {


        var _ = this;


        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));


    };


    Slick.prototype.cleanUpRows = function() {


        var _ = this,
            originalSlides;


        if (_.options.rows > 0) {

            originalSlides = _.$slides.children().children();

            originalSlides.removeAttr('style');

            _.$slider.empty().append(originalSlides);

        }


    };


    Slick.prototype.clickHandler = function(event) {


        var _ = this;


        if (_.shouldClick === false) {

            event.stopImmediatePropagation();

            event.stopPropagation();

            event.preventDefault();

        }


    };


    Slick.prototype.destroy = function(refresh) {


        var _ = this;


        _.autoPlayClear();


        _.touchObject = {};


        _.cleanUpEvents();


        $('.slick-cloned', _.$slider).detach();


        if (_.$dots) {

            _.$dots.remove();

        }


        if (_.$prevArrow && _.$prevArrow.length) {


            _.$prevArrow

                .removeClass('slick-disabled slick-arrow slick-hidden')

                .removeAttr('aria-hidden aria-disabled tabindex')

                .css('display', '');


            if (_.htmlExpr.test(_.options.prevArrow)) {

                _.$prevArrow.remove();

            }

        }


        if (_.$nextArrow && _.$nextArrow.length) {


            _.$nextArrow

                .removeClass('slick-disabled slick-arrow slick-hidden')

                .removeAttr('aria-hidden aria-disabled tabindex')

                .css('display', '');


            if (_.htmlExpr.test(_.options.nextArrow)) {

                _.$nextArrow.remove();

            }

        }


        if (_.$slides) {


            _.$slides

                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')

                .removeAttr('aria-hidden')

                .removeAttr('data-slick-index')

                .each(function() {

                    $(this).attr('style', $(this).data('originalStyling'));

                });


            _.$slideTrack.children(this.options.slide).detach();


            _.$slideTrack.detach();


            _.$list.detach();


            _.$slider.append(_.$slides);

        }


        _.cleanUpRows();


        _.$slider.removeClass('slick-slider');

        _.$slider.removeClass('slick-initialized');

        _.$slider.removeClass('slick-dotted');


        _.unslicked = true;


        if (!refresh) {

            _.$slider.trigger('destroy', [_]);

        }


    };


    Slick.prototype.disableTransition = function(slide) {


        var _ = this,

            transition = {};


        transition[_.transitionType] = '';


        if (_.options.fade === false) {

            _.$slideTrack.css(transition);

        } else {

            _.$slides.eq(slide).css(transition);

        }


    };


    Slick.prototype.fadeSlide = function(slideIndex, callback) {


        var _ = this;


        if (_.cssTransitions === false) {


            _.$slides.eq(slideIndex).css({

                zIndex: _.options.zIndex

            });


            _.$slides.eq(slideIndex).animate({

                opacity: 1

            }, _.options.speed, _.options.easing, callback);


        } else {


            _.applyTransition(slideIndex);


            _.$slides.eq(slideIndex).css({

                opacity: 1,

                zIndex: _.options.zIndex

            });


            if (callback) {

                setTimeout(function() {


                    _.disableTransition(slideIndex);


                    callback.call();

                }, _.options.speed);

            }


        }


    };


    Slick.prototype.fadeSlideOut = function(slideIndex) {


        var _ = this;


        if (_.cssTransitions === false) {


            _.$slides.eq(slideIndex).animate({

                opacity: 0,

                zIndex: _.options.zIndex - 2

            }, _.options.speed, _.options.easing);


        } else {


            _.applyTransition(slideIndex);


            _.$slides.eq(slideIndex).css({

                opacity: 0,

                zIndex: _.options.zIndex - 2

            });


        }


    };


    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {


        var _ = this;


        if (filter !== null) {


            _.$slidesCache = _.$slides;


            _.unload();


            _.$slideTrack.children(this.options.slide).detach();


            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);


            _.reinit();


        }


    };


    Slick.prototype.focusHandler = function() {


        var _ = this;


        _.$slider

            .off('focus.slick blur.slick')

            .on('focus.slick blur.slick', '*', function(event) {


                event.stopImmediatePropagation();

                var $sf = $(this);


                setTimeout(function() {


                    if (_.options.pauseOnFocus) {

                        _.focussed = $sf.is(':focus');

                        _.autoPlay();

                    }


                }, 0);


            });

    };


    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {


        var _ = this;

        return _.currentSlide;


    };


    Slick.prototype.getDotCount = function() {


        var _ = this;


        var breakPoint = 0;

        var counter = 0;

        var pagerQty = 0;


        if (_.options.infinite === true) {

            if (_.slideCount <= _.options.slidesToShow) {

                ++pagerQty;

            } else {

                while (breakPoint < _.slideCount) {

                    ++pagerQty;

                    breakPoint = counter + _.options.slidesToScroll;

                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;

                }

            }

        } else if (_.options.centerMode === true) {

            pagerQty = _.slideCount;

        } else if (!_.options.asNavFor) {

            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);

        } else {

            while (breakPoint < _.slideCount) {

                ++pagerQty;

                breakPoint = counter + _.options.slidesToScroll;

                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;

            }

        }


        return pagerQty - 1;


    };


    Slick.prototype.getLeft = function(slideIndex) {


        var _ = this,

            targetLeft,

            verticalHeight,

            verticalOffset = 0,

            targetSlide,

            coef;


        _.slideOffset = 0;

        verticalHeight = _.$slides.first().outerHeight(true);


        if (_.options.infinite === true) {

            if (_.slideCount > _.options.slidesToShow) {

                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;

                coef = -1


                if (_.options.vertical === true && _.options.centerMode === true) {

                    if (_.options.slidesToShow === 2) {

                        coef = -1.5;

                    } else if (_.options.slidesToShow === 1) {

                        coef = -2

                    }

                }

                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;

            }

            if (_.slideCount % _.options.slidesToScroll !== 0) {

                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {

                    if (slideIndex > _.slideCount) {

                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;

                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;

                    } else {

                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;

                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;

                    }

                }

            }

        } else {

            if (slideIndex + _.options.slidesToShow > _.slideCount) {

                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;

                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;

            }

        }


        if (_.slideCount <= _.options.slidesToShow) {

            _.slideOffset = 0;

            verticalOffset = 0;

        }


        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {

            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);

        } else if (_.options.centerMode === true && _.options.infinite === true) {

            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;

        } else if (_.options.centerMode === true) {

            _.slideOffset = 0;

            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);

        }


        if (_.options.vertical === false) {

            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;

        } else {

            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;

        }


        if (_.options.variableWidth === true) {


            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {

                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);

            } else {

                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);

            }


            if (_.options.rtl === true) {

                if (targetSlide[0]) {

                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;

                } else {

                    targetLeft = 0;

                }

            } else {

                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;

            }


            if (_.options.centerMode === true) {

                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {

                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);

                } else {

                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);

                }


                if (_.options.rtl === true) {

                    if (targetSlide[0]) {

                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;

                    } else {

                        targetLeft = 0;

                    }

                } else {

                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;

                }


                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;

            }

        }


        return targetLeft;


    };


    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {


        var _ = this;


        return _.options[option];


    };


    Slick.prototype.getNavigableIndexes = function() {


        var _ = this,

            breakPoint = 0,

            counter = 0,

            indexes = [],

            max;


        if (_.options.infinite === false) {

            max = _.slideCount;

        } else {

            breakPoint = _.options.slidesToScroll * -1;

            counter = _.options.slidesToScroll * -1;

            max = _.slideCount * 2;

        }


        while (breakPoint < max) {

            indexes.push(breakPoint);

            breakPoint = counter + _.options.slidesToScroll;

            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;

        }


        return indexes;


    };


    Slick.prototype.getSlick = function() {


        return this;


    };


    Slick.prototype.getSlideCount = function() {


        var _ = this,

            slidesTraversed, swipedSlide, centerOffset;


        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;


        if (_.options.swipeToSlide === true) {

            _.$slideTrack.find('.slick-slide').each(function(index, slide) {

                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {

                    swipedSlide = slide;

                    return false;

                }

            });


            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;


            return slidesTraversed;


        } else {

            return _.options.slidesToScroll;

        }


    };


    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {


        var _ = this;


        _.changeSlide({

            data: {

                message: 'index',

                index: parseInt(slide)

            }

        }, dontAnimate);


    };


    Slick.prototype.init = function(creation) {


        var _ = this;


        if (!$(_.$slider).hasClass('slick-initialized')) {


            $(_.$slider).addClass('slick-initialized');


            _.buildRows();

            _.buildOut();

            _.setProps();

            _.startLoad();

            _.loadSlider();

            _.initializeEvents();

            _.updateArrows();

            _.updateDots();

            _.checkResponsive(true);

            _.focusHandler();


        }


        if (creation) {

            _.$slider.trigger('init', [_]);

        }


        if (_.options.accessibility === true) {

            _.initADA();

        }


        if (_.options.autoplay) {


            _.paused = false;

            _.autoPlay();


        }


    };


    Slick.prototype.initADA = function() {

        var _ = this,

            numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),

            tabControlIndexes = _.getNavigableIndexes().filter(function(val) {

                return (val >= 0) && (val < _.slideCount);

            });


        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({

            'aria-hidden': 'true',

            'tabindex': '-1'

        }).find('a, input, button, select').attr({

            'tabindex': '-1'

        });


        if (_.$dots !== null) {

            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {

                var slideControlIndex = tabControlIndexes.indexOf(i);


                $(this).attr({

                    'role': 'tabpanel',

                    'id': 'slick-slide' + _.instanceUid + i,

                    'tabindex': -1

                });


                if (slideControlIndex !== -1) {

                    var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex

                    if ($('#' + ariaButtonControl).length) {

                        $(this).attr({

                            'aria-describedby': ariaButtonControl

                        });

                    }

                }

            });


            _.$dots.attr('role', 'tablist').find('li').each(function(i) {

                var mappedSlideIndex = tabControlIndexes[i];


                $(this).attr({

                    'role': 'presentation'

                });


                $(this).find('button').first().attr({

                    'role': 'tab',

                    'id': 'slick-slide-control' + _.instanceUid + i,

                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,

                    'aria-label': (i + 1) + ' of ' + numDotGroups,

                    'aria-selected': null,

                    'tabindex': '-1'

                });


            }).eq(_.currentSlide).find('button').attr({

                'aria-selected': 'true',

                'tabindex': '0'

            }).end();

        }


        for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {

            if (_.options.focusOnChange) {

                _.$slides.eq(i).attr({
                    'tabindex': '0'
                });

            } else {

                _.$slides.eq(i).removeAttr('tabindex');

            }

        }


        _.activateADA();


    };


    Slick.prototype.initArrowEvents = function() {


        var _ = this;


        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow

                .off('click.slick')

                .on('click.slick', {

                    message: 'previous'

                }, _.changeSlide);

            _.$nextArrow

                .off('click.slick')

                .on('click.slick', {

                    message: 'next'

                }, _.changeSlide);


            if (_.options.accessibility === true) {

                _.$prevArrow.on('keydown.slick', _.keyHandler);

                _.$nextArrow.on('keydown.slick', _.keyHandler);

            }

        }


    };


    Slick.prototype.initDotEvents = function() {


        var _ = this;


        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots).on('click.slick', {

                message: 'index'

            }, _.changeSlide);


            if (_.options.accessibility === true) {

                _.$dots.on('keydown.slick', _.keyHandler);

            }

        }


        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {


            $('li', _.$dots)

                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))

                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));


        }


    };


    Slick.prototype.initSlideEvents = function() {


        var _ = this;


        if (_.options.pauseOnHover) {


            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));


        }


    };


    Slick.prototype.initializeEvents = function() {


        var _ = this;


        _.initArrowEvents();


        _.initDotEvents();

        _.initSlideEvents();


        _.$list.on('touchstart.slick mousedown.slick', {

            action: 'start'

        }, _.swipeHandler);

        _.$list.on('touchmove.slick mousemove.slick', {

            action: 'move'

        }, _.swipeHandler);

        _.$list.on('touchend.slick mouseup.slick', {

            action: 'end'

        }, _.swipeHandler);

        _.$list.on('touchcancel.slick mouseleave.slick', {

            action: 'end'

        }, _.swipeHandler);


        _.$list.on('click.slick', _.clickHandler);


        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));


        if (_.options.accessibility === true) {

            _.$list.on('keydown.slick', _.keyHandler);

        }


        if (_.options.focusOnSelect === true) {

            $(_.$slideTrack).children().on('click.slick', _.selectHandler);

        }


        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));


        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));


        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);


        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);

        $(_.setPosition);


    };


    Slick.prototype.initUI = function() {


        var _ = this;


        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {


            _.$prevArrow.show();

            _.$nextArrow.show();


        }


        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {


            _.$dots.show();


        }


    };


    Slick.prototype.keyHandler = function(event) {


        var _ = this;

        //Dont slide if the cursor is inside the form fields and arrow keys are pressed

        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {

            if (event.keyCode === 37 && _.options.accessibility === true) {

                _.changeSlide({

                    data: {

                        message: _.options.rtl === true ? 'next' : 'previous'

                    }

                });

            } else if (event.keyCode === 39 && _.options.accessibility === true) {

                _.changeSlide({

                    data: {

                        message: _.options.rtl === true ? 'previous' : 'next'

                    }

                });

            }

        }


    };


    Slick.prototype.lazyLoad = function() {


        var _ = this,

            loadRange, cloneRange, rangeStart, rangeEnd;


        function loadImages(imagesScope) {


            $('img[data-lazy]', imagesScope).each(function() {


                var image = $(this),

                    imageSource = $(this).attr('data-lazy'),

                    imageSrcSet = $(this).attr('data-srcset'),

                    imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),

                    imageToLoad = document.createElement('img');


                imageToLoad.onload = function() {


                    image

                        .animate({
                            opacity: 0
                        }, 100, function() {


                            if (imageSrcSet) {

                                image

                                    .attr('srcset', imageSrcSet);


                                if (imageSizes) {

                                    image

                                        .attr('sizes', imageSizes);

                                }

                            }


                            image

                                .attr('src', imageSource)

                                .animate({
                                    opacity: 1
                                }, 200, function() {

                                    image

                                        .removeAttr('data-lazy data-srcset data-sizes')

                                        .removeClass('slick-loading');

                                });

                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

                        });


                };


                imageToLoad.onerror = function() {


                    image

                        .removeAttr('data-lazy')

                        .removeClass('slick-loading')

                        .addClass('slick-lazyload-error');


                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);


                };


                imageToLoad.src = imageSource;


            });


        }


        if (_.options.centerMode === true) {

            if (_.options.infinite === true) {

                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);

                rangeEnd = rangeStart + _.options.slidesToShow + 2;

            } else {

                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));

                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;

            }

        } else {

            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;

            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

            if (_.options.fade === true) {

                if (rangeStart > 0) rangeStart--;

                if (rangeEnd <= _.slideCount) rangeEnd++;

            }

        }


        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);


        if (_.options.lazyLoad === 'anticipated') {

            var prevSlide = rangeStart - 1,

                nextSlide = rangeEnd,

                $slides = _.$slider.find('.slick-slide');


            for (var i = 0; i < _.options.slidesToScroll; i++) {

                if (prevSlide < 0) prevSlide = _.slideCount - 1;

                loadRange = loadRange.add($slides.eq(prevSlide));

                loadRange = loadRange.add($slides.eq(nextSlide));

                prevSlide--;

                nextSlide++;

            }

        }


        loadImages(loadRange);


        if (_.slideCount <= _.options.slidesToShow) {

            cloneRange = _.$slider.find('.slick-slide');

            loadImages(cloneRange);

        } else

        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {

            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);

            loadImages(cloneRange);

        } else if (_.currentSlide === 0) {

            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);

            loadImages(cloneRange);

        }


    };


    Slick.prototype.loadSlider = function() {


        var _ = this;


        _.setPosition();


        _.$slideTrack.css({

            opacity: 1

        });


        _.$slider.removeClass('slick-loading');


        _.initUI();


        if (_.options.lazyLoad === 'progressive') {

            _.progressiveLazyLoad();

        }


    };


    Slick.prototype.next = Slick.prototype.slickNext = function() {


        var _ = this;


        _.changeSlide({

            data: {

                message: 'next'

            }

        });


    };


    Slick.prototype.orientationChange = function() {


        var _ = this;


        _.checkResponsive();

        _.setPosition();


    };


    Slick.prototype.pause = Slick.prototype.slickPause = function() {


        var _ = this;


        _.autoPlayClear();

        _.paused = true;


    };


    Slick.prototype.play = Slick.prototype.slickPlay = function() {


        var _ = this;


        _.autoPlay();

        _.options.autoplay = true;

        _.paused = false;

        _.focussed = false;

        _.interrupted = false;


    };


    Slick.prototype.postSlide = function(index) {


        var _ = this;


        if (!_.unslicked) {


            _.$slider.trigger('afterChange', [_, index]);


            _.animating = false;


            if (_.slideCount > _.options.slidesToShow) {

                _.setPosition();

            }


            _.swipeLeft = null;


            if (_.options.autoplay) {

                _.autoPlay();

            }


            if (_.options.accessibility === true) {

                _.initADA();


                if (_.options.focusOnChange) {

                    var $currentSlide = $(_.$slides.get(_.currentSlide));

                    $currentSlide.attr('tabindex', 0).focus();

                }

            }


        }


    };


    Slick.prototype.prev = Slick.prototype.slickPrev = function() {


        var _ = this;


        _.changeSlide({

            data: {

                message: 'previous'

            }

        });


    };


    Slick.prototype.preventDefault = function(event) {


        event.preventDefault();


    };


    Slick.prototype.progressiveLazyLoad = function(tryCount) {


        tryCount = tryCount || 1;


        var _ = this,

            $imgsToLoad = $('img[data-lazy]', _.$slider),

            image,

            imageSource,

            imageSrcSet,

            imageSizes,

            imageToLoad;


        if ($imgsToLoad.length) {


            image = $imgsToLoad.first();

            imageSource = image.attr('data-lazy');

            imageSrcSet = image.attr('data-srcset');

            imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');

            imageToLoad = document.createElement('img');


            imageToLoad.onload = function() {


                if (imageSrcSet) {

                    image

                        .attr('srcset', imageSrcSet);


                    if (imageSizes) {

                        image

                            .attr('sizes', imageSizes);

                    }

                }


                image

                    .attr('src', imageSource)

                    .removeAttr('data-lazy data-srcset data-sizes')

                    .removeClass('slick-loading');


                if (_.options.adaptiveHeight === true) {

                    _.setPosition();

                }


                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

                _.progressiveLazyLoad();


            };


            imageToLoad.onerror = function() {


                if (tryCount < 3) {


                    /**

                     * try to load the image 3 times,

                     * leave a slight delay so we don't get

                     * servers blocking the request.

                     */

                    setTimeout(function() {

                        _.progressiveLazyLoad(tryCount + 1);

                    }, 500);


                } else {


                    image

                        .removeAttr('data-lazy')

                        .removeClass('slick-loading')

                        .addClass('slick-lazyload-error');


                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);


                    _.progressiveLazyLoad();


                }


            };


            imageToLoad.src = imageSource;


        } else {


            _.$slider.trigger('allImagesLoaded', [_]);


        }


    };


    Slick.prototype.refresh = function(initializing) {


        var _ = this,
            currentSlide, lastVisibleIndex;


        lastVisibleIndex = _.slideCount - _.options.slidesToShow;


        // in non-infinite sliders, we don't want to go past the

        // last visible index.

        if (!_.options.infinite && (_.currentSlide > lastVisibleIndex)) {

            _.currentSlide = lastVisibleIndex;

        }


        // if less slides than to show, go to start.

        if (_.slideCount <= _.options.slidesToShow) {

            _.currentSlide = 0;


        }


        currentSlide = _.currentSlide;


        _.destroy(true);


        $.extend(_, _.initials, {
            currentSlide: currentSlide
        });


        _.init();


        if (!initializing) {


            _.changeSlide({

                data: {

                    message: 'index',

                    index: currentSlide

                }

            }, false);


        }


    };


    Slick.prototype.registerBreakpoints = function() {


        var _ = this,
            breakpoint, currentBreakpoint, l,

            responsiveSettings = _.options.responsive || [];


        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {


            _.respondTo = _.options.respondTo || 'window';


            for (breakpoint in responsiveSettings) {


                l = _.breakpoints.length - 1;


                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;


                    // loop through the breakpoints and cut out any existing

                    // ones with the same breakpoint number, we don't want dupes.

                    while (l >= 0) {

                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {

                            _.breakpoints.splice(l, 1);

                        }

                        l--;

                    }


                    _.breakpoints.push(currentBreakpoint);

                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;


                }


            }


            _.breakpoints.sort(function(a, b) {

                return (_.options.mobileFirst) ? a - b : b - a;

            });


        }


    };


    Slick.prototype.reinit = function() {


        var _ = this;


        _.$slides =

            _.$slideTrack

            .children(_.options.slide)

            .addClass('slick-slide');


        _.slideCount = _.$slides.length;


        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {

            _.currentSlide = _.currentSlide - _.options.slidesToScroll;

        }


        if (_.slideCount <= _.options.slidesToShow) {

            _.currentSlide = 0;

        }


        _.registerBreakpoints();


        _.setProps();

        _.setupInfinite();

        _.buildArrows();

        _.updateArrows();

        _.initArrowEvents();

        _.buildDots();

        _.updateDots();

        _.initDotEvents();

        _.cleanUpSlideEvents();

        _.initSlideEvents();


        _.checkResponsive(false, true);


        if (_.options.focusOnSelect === true) {

            $(_.$slideTrack).children().on('click.slick', _.selectHandler);

        }


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);


        _.setPosition();

        _.focusHandler();


        _.paused = !_.options.autoplay;

        _.autoPlay();


        _.$slider.trigger('reInit', [_]);


    };


    Slick.prototype.resize = function() {


        var _ = this;


        if ($(window).width() !== _.windowWidth) {

            clearTimeout(_.windowDelay);

            _.windowDelay = window.setTimeout(function() {

                _.windowWidth = $(window).width();

                _.checkResponsive();

                if (!_.unslicked) {
                    _.setPosition();
                }

            }, 50);

        }

    };


    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {


        var _ = this;


        if (typeof(index) === 'boolean') {

            removeBefore = index;

            index = removeBefore === true ? 0 : _.slideCount - 1;

        } else {

            index = removeBefore === true ? --index : index;

        }


        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {

            return false;

        }


        _.unload();


        if (removeAll === true) {

            _.$slideTrack.children().remove();

        } else {

            _.$slideTrack.children(this.options.slide).eq(index).remove();

        }


        _.$slides = _.$slideTrack.children(this.options.slide);


        _.$slideTrack.children(this.options.slide).detach();


        _.$slideTrack.append(_.$slides);


        _.$slidesCache = _.$slides;


        _.reinit();


    };


    Slick.prototype.setCSS = function(position) {


        var _ = this,

            positionProps = {},

            x, y;


        if (_.options.rtl === true) {

            position = -position;

        }

        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';

        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';


        positionProps[_.positionProp] = position;


        if (_.transformsEnabled === false) {

            _.$slideTrack.css(positionProps);

        } else {

            positionProps = {};

            if (_.cssTransitions === false) {

                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

                _.$slideTrack.css(positionProps);

            } else {

                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

                _.$slideTrack.css(positionProps);

            }

        }


    };


    Slick.prototype.setDimensions = function() {


        var _ = this;


        if (_.options.vertical === false) {

            if (_.options.centerMode === true) {

                _.$list.css({

                    padding: ('0px ' + _.options.centerPadding)

                });

            }

        } else {

            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

            if (_.options.centerMode === true) {

                _.$list.css({

                    padding: (_.options.centerPadding + ' 0px')

                });

            }

        }


        _.listWidth = _.$list.width();

        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {

            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));


        } else if (_.options.variableWidth === true) {

            _.$slideTrack.width(5000 * _.slideCount);

        } else {

            _.slideWidth = Math.ceil(_.listWidth);

            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));

        }


        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);


    };


    Slick.prototype.setFade = function() {


        var _ = this,

            targetLeft;


        _.$slides.each(function(index, element) {

            targetLeft = (_.slideWidth * index) * -1;

            if (_.options.rtl === true) {

                $(element).css({

                    position: 'relative',

                    right: targetLeft,

                    top: 0,

                    zIndex: _.options.zIndex - 2,

                    opacity: 0

                });

            } else {

                $(element).css({

                    position: 'relative',

                    left: targetLeft,

                    top: 0,

                    zIndex: _.options.zIndex - 2,

                    opacity: 0

                });

            }

        });


        _.$slides.eq(_.currentSlide).css({

            zIndex: _.options.zIndex - 1,

            opacity: 1

        });


    };


    Slick.prototype.setHeight = function() {


        var _ = this;


        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {

            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

            _.$list.css('height', targetHeight);

        }


    };


    Slick.prototype.setOption =

        Slick.prototype.slickSetOption = function() {


            /**

             * accepts arguments in format of:

             *

             *  - for changing a single option's value:

             *     .slick("setOption", option, value, refresh )

             *

             *  - for changing a set of responsive options:

             *     .slick("setOption", 'responsive', [{}, ...], refresh )

             *

             *  - for updating multiple values at once (not responsive)

             *     .slick("setOption", { 'option': value, ... }, refresh )

             */


            var _ = this,
                l, item, option, value, refresh = false,
                type;


            if ($.type(arguments[0]) === 'object') {


                option = arguments[0];

                refresh = arguments[1];

                type = 'multiple';


            } else if ($.type(arguments[0]) === 'string') {


                option = arguments[0];

                value = arguments[1];

                refresh = arguments[2];


                if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {


                    type = 'responsive';


                } else if (typeof arguments[1] !== 'undefined') {


                    type = 'single';


                }


            }


            if (type === 'single') {


                _.options[option] = value;


            } else if (type === 'multiple') {


                $.each(option, function(opt, val) {


                    _.options[opt] = val;


                });


            } else if (type === 'responsive') {


                for (item in value) {


                    if ($.type(_.options.responsive) !== 'array') {


                        _.options.responsive = [value[item]];


                    } else {


                        l = _.options.responsive.length - 1;


                        // loop through the responsive object and splice out duplicates.

                        while (l >= 0) {


                            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {


                                _.options.responsive.splice(l, 1);


                            }


                            l--;


                        }


                        _.options.responsive.push(value[item]);


                    }


                }


            }


            if (refresh) {


                _.unload();

                _.reinit();


            }


        };


    Slick.prototype.setPosition = function() {


        var _ = this;


        _.setDimensions();


        _.setHeight();


        if (_.options.fade === false) {

            _.setCSS(_.getLeft(_.currentSlide));

        } else {

            _.setFade();

        }


        _.$slider.trigger('setPosition', [_]);


    };


    Slick.prototype.setProps = function() {


        var _ = this,

            bodyStyle = document.body.style;


        _.positionProp = _.options.vertical === true ? 'top' : 'left';


        if (_.positionProp === 'top') {

            _.$slider.addClass('slick-vertical');

        } else {

            _.$slider.removeClass('slick-vertical');

        }


        if (bodyStyle.WebkitTransition !== undefined ||

            bodyStyle.MozTransition !== undefined ||

            bodyStyle.msTransition !== undefined) {

            if (_.options.useCSS === true) {

                _.cssTransitions = true;

            }

        }


        if (_.options.fade) {

            if (typeof _.options.zIndex === 'number') {

                if (_.options.zIndex < 3) {

                    _.options.zIndex = 3;

                }

            } else {

                _.options.zIndex = _.defaults.zIndex;

            }

        }


        if (bodyStyle.OTransform !== undefined) {

            _.animType = 'OTransform';

            _.transformType = '-o-transform';

            _.transitionType = 'OTransition';

            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;

        }

        if (bodyStyle.MozTransform !== undefined) {

            _.animType = 'MozTransform';

            _.transformType = '-moz-transform';

            _.transitionType = 'MozTransition';

            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;

        }

        if (bodyStyle.webkitTransform !== undefined) {

            _.animType = 'webkitTransform';

            _.transformType = '-webkit-transform';

            _.transitionType = 'webkitTransition';

            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;

        }

        if (bodyStyle.msTransform !== undefined) {

            _.animType = 'msTransform';

            _.transformType = '-ms-transform';

            _.transitionType = 'msTransition';

            if (bodyStyle.msTransform === undefined) _.animType = false;

        }

        if (bodyStyle.transform !== undefined && _.animType !== false) {

            _.animType = 'transform';

            _.transformType = 'transform';

            _.transitionType = 'transition';

        }

        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);

    };


    Slick.prototype.setSlideClasses = function(index) {


        var _ = this,

            centerOffset, allSlides, indexOffset, remainder;


        allSlides = _.$slider

            .find('.slick-slide')

            .removeClass('slick-active slick-center slick-current')

            .attr('aria-hidden', 'true');


        _.$slides

            .eq(index)

            .addClass('slick-current');


        if (_.options.centerMode === true) {


            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;


            centerOffset = Math.floor(_.options.slidesToShow / 2);


            if (_.options.infinite === true) {


                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides

                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)

                        .addClass('slick-active')

                        .attr('aria-hidden', 'false');


                } else {


                    indexOffset = _.options.slidesToShow + index;

                    allSlides

                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)

                        .addClass('slick-active')

                        .attr('aria-hidden', 'false');


                }


                if (index === 0) {


                    allSlides

                        .eq(allSlides.length - 1 - _.options.slidesToShow)

                        .addClass('slick-center');


                } else if (index === _.slideCount - 1) {


                    allSlides

                        .eq(_.options.slidesToShow)

                        .addClass('slick-center');


                }


            }


            _.$slides

                .eq(index)

                .addClass('slick-center');


        } else {


            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {


                _.$slides

                    .slice(index, index + _.options.slidesToShow)

                    .addClass('slick-active')

                    .attr('aria-hidden', 'false');


            } else if (allSlides.length <= _.options.slidesToShow) {


                allSlides

                    .addClass('slick-active')

                    .attr('aria-hidden', 'false');


            } else {


                remainder = _.slideCount % _.options.slidesToShow;

                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;


                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {


                    allSlides

                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)

                        .addClass('slick-active')

                        .attr('aria-hidden', 'false');


                } else {


                    allSlides

                        .slice(indexOffset, indexOffset + _.options.slidesToShow)

                        .addClass('slick-active')

                        .attr('aria-hidden', 'false');


                }


            }


        }


        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {

            _.lazyLoad();

        }

    };


    Slick.prototype.setupInfinite = function() {


        var _ = this,

            i, slideIndex, infiniteCount;


        if (_.options.fade === true) {

            _.options.centerMode = false;

        }


        if (_.options.infinite === true && _.options.fade === false) {


            slideIndex = null;


            if (_.slideCount > _.options.slidesToShow) {


                if (_.options.centerMode === true) {

                    infiniteCount = _.options.slidesToShow + 1;

                } else {

                    infiniteCount = _.options.slidesToShow;

                }


                for (i = _.slideCount; i > (_.slideCount -

                        infiniteCount); i -= 1) {

                    slideIndex = i - 1;

                    $(_.$slides[slideIndex]).clone(true).attr('id', '')

                        .attr('data-slick-index', slideIndex - _.slideCount)

                        .prependTo(_.$slideTrack).addClass('slick-cloned');

                }

                for (i = 0; i < infiniteCount + _.slideCount; i += 1) {

                    slideIndex = i;

                    $(_.$slides[slideIndex]).clone(true).attr('id', '')

                        .attr('data-slick-index', slideIndex + _.slideCount)

                        .appendTo(_.$slideTrack).addClass('slick-cloned');

                }

                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {

                    $(this).attr('id', '');

                });


            }


        }


    };


    Slick.prototype.interrupt = function(toggle) {


        var _ = this;


        if (!toggle) {

            _.autoPlay();

        }

        _.interrupted = toggle;


    };


    Slick.prototype.selectHandler = function(event) {


        var _ = this;


        var targetElement =

            $(event.target).is('.slick-slide') ?

            $(event.target) :

            $(event.target).parents('.slick-slide');


        var index = parseInt(targetElement.attr('data-slick-index'));


        if (!index) index = 0;


        if (_.slideCount <= _.options.slidesToShow) {


            _.slideHandler(index, false, true);

            return;


        }


        _.slideHandler(index);


    };


    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {


        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,

            _ = this,
            navTarget;


        sync = sync || false;


        if (_.animating === true && _.options.waitForAnimate === true) {

            return;

        }


        if (_.options.fade === true && _.currentSlide === index) {

            return;

        }


        if (sync === false) {

            _.asNavFor(index);

        }


        targetSlide = index;

        targetLeft = _.getLeft(targetSlide);

        slideLeft = _.getLeft(_.currentSlide);


        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;


        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {

            if (_.options.fade === false) {

                targetSlide = _.currentSlide;

                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {

                    _.animateSlide(slideLeft, function() {

                        _.postSlide(targetSlide);

                    });

                } else {

                    _.postSlide(targetSlide);

                }

            }

            return;

        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {

            if (_.options.fade === false) {

                targetSlide = _.currentSlide;

                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {

                    _.animateSlide(slideLeft, function() {

                        _.postSlide(targetSlide);

                    });

                } else {

                    _.postSlide(targetSlide);

                }

            }

            return;

        }


        if (_.options.autoplay) {

            clearInterval(_.autoPlayTimer);

        }


        if (targetSlide < 0) {

            if (_.slideCount % _.options.slidesToScroll !== 0) {

                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);

            } else {

                animSlide = _.slideCount + targetSlide;

            }

        } else if (targetSlide >= _.slideCount) {

            if (_.slideCount % _.options.slidesToScroll !== 0) {

                animSlide = 0;

            } else {

                animSlide = targetSlide - _.slideCount;

            }

        } else {

            animSlide = targetSlide;

        }


        _.animating = true;


        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);


        oldSlide = _.currentSlide;

        _.currentSlide = animSlide;


        _.setSlideClasses(_.currentSlide);


        if (_.options.asNavFor) {


            navTarget = _.getNavTarget();

            navTarget = navTarget.slick('getSlick');


            if (navTarget.slideCount <= navTarget.options.slidesToShow) {

                navTarget.setSlideClasses(_.currentSlide);

            }


        }


        _.updateDots();

        _.updateArrows();


        if (_.options.fade === true) {

            if (dontAnimate !== true) {


                _.fadeSlideOut(oldSlide);


                _.fadeSlide(animSlide, function() {

                    _.postSlide(animSlide);

                });


            } else {

                _.postSlide(animSlide);

            }

            _.animateHeight();

            return;

        }


        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {

            _.animateSlide(targetLeft, function() {

                _.postSlide(animSlide);

            });

        } else {

            _.postSlide(animSlide);

        }


    };


    Slick.prototype.startLoad = function() {


        var _ = this;


        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {


            _.$prevArrow.hide();

            _.$nextArrow.hide();


        }


        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {


            _.$dots.hide();


        }


        _.$slider.addClass('slick-loading');


    };


    Slick.prototype.swipeDirection = function() {


        var xDist, yDist, r, swipeAngle, _ = this;


        xDist = _.touchObject.startX - _.touchObject.curX;

        yDist = _.touchObject.startY - _.touchObject.curY;

        r = Math.atan2(yDist, xDist);


        swipeAngle = Math.round(r * 180 / Math.PI);

        if (swipeAngle < 0) {

            swipeAngle = 360 - Math.abs(swipeAngle);

        }


        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {

            return (_.options.rtl === false ? 'left' : 'right');

        }

        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {

            return (_.options.rtl === false ? 'left' : 'right');

        }

        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {

            return (_.options.rtl === false ? 'right' : 'left');

        }

        if (_.options.verticalSwiping === true) {

            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {

                return 'down';

            } else {

                return 'up';

            }

        }


        return 'vertical';


    };


    Slick.prototype.swipeEnd = function(event) {


        var _ = this,

            slideCount,

            direction;


        _.dragging = false;

        _.swiping = false;


        if (_.scrolling) {

            _.scrolling = false;

            return false;

        }


        _.interrupted = false;

        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;


        if (_.touchObject.curX === undefined) {

            return false;

        }


        if (_.touchObject.edgeHit === true) {

            _.$slider.trigger('edge', [_, _.swipeDirection()]);

        }


        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {


            direction = _.swipeDirection();


            switch (direction) {


                case 'left':

                case 'down':


                    slideCount =

                        _.options.swipeToSlide ?

                        _.checkNavigable(_.currentSlide + _.getSlideCount()) :

                        _.currentSlide + _.getSlideCount();


                    _.currentDirection = 0;


                    break;


                case 'right':

                case 'up':


                    slideCount =

                        _.options.swipeToSlide ?

                        _.checkNavigable(_.currentSlide - _.getSlideCount()) :

                        _.currentSlide - _.getSlideCount();


                    _.currentDirection = 1;


                    break;


                default:


            }


            if (direction != 'vertical') {


                _.slideHandler(slideCount);

                _.touchObject = {};

                _.$slider.trigger('swipe', [_, direction]);


            }


        } else {


            if (_.touchObject.startX !== _.touchObject.curX) {


                _.slideHandler(_.currentSlide);

                _.touchObject = {};


            }


        }


    };


    Slick.prototype.swipeHandler = function(event) {


        var _ = this;


        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {

            return;

        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {

            return;

        }


        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?

            event.originalEvent.touches.length : 1;


        _.touchObject.minSwipe = _.listWidth / _.options

            .touchThreshold;


        if (_.options.verticalSwiping === true) {

            _.touchObject.minSwipe = _.listHeight / _.options

                .touchThreshold;

        }


        switch (event.data.action) {


            case 'start':

                _.swipeStart(event);

                break;


            case 'move':

                _.swipeMove(event);

                break;


            case 'end':

                _.swipeEnd(event);

                break;


        }


    };


    Slick.prototype.swipeMove = function(event) {


        var _ = this,

            edgeWasHit = false,

            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;


        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;


        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {

            return false;

        }


        curLeft = _.getLeft(_.currentSlide);


        _.touchObject.curX = (touches !== undefined && touches !== null) ? touches[0].pageX : event.clientX;

        _.touchObject.curY = (touches !== undefined && touches !== null) ? touches[0].pageY : event.clientY;


        _.touchObject.swipeLength = Math.round(Math.sqrt(

            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));


        verticalSwipeLength = Math.round(Math.sqrt(

            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));


        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {

            _.scrolling = true;

            return false;

        }


        if (_.options.verticalSwiping === true) {

            _.touchObject.swipeLength = verticalSwipeLength;

        }


        swipeDirection = _.swipeDirection();


        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {

            _.swiping = true;

            event.preventDefault();

        }


        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

        if (_.options.verticalSwiping === true) {

            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;

        }


        swipeLength = _.touchObject.swipeLength;


        _.touchObject.edgeHit = false;


        if (_.options.infinite === false) {

            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {

                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;

                _.touchObject.edgeHit = true;

            }

        }


        if (_.options.vertical === false) {

            _.swipeLeft = curLeft + swipeLength * positionOffset;

        } else {

            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;

        }

        if (_.options.verticalSwiping === true) {

            _.swipeLeft = curLeft + swipeLength * positionOffset;

        }


        if (_.options.fade === true || _.options.touchMove === false) {

            return false;

        }


        if (_.animating === true) {

            _.swipeLeft = null;

            return false;

        }


        _.setCSS(_.swipeLeft);


    };


    Slick.prototype.swipeStart = function(event) {


        var _ = this,

            touches;


        _.interrupted = true;


        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {

            _.touchObject = {};

            return false;

        }


        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {

            touches = event.originalEvent.touches[0];

        }


        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;

        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;


        _.dragging = true;


    };


    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {


        var _ = this;


        if (_.$slidesCache !== null) {


            _.unload();


            _.$slideTrack.children(this.options.slide).detach();


            _.$slidesCache.appendTo(_.$slideTrack);


            _.reinit();


        }


    };


    Slick.prototype.unload = function() {


        var _ = this;


        $('.slick-cloned', _.$slider).remove();


        if (_.$dots) {

            _.$dots.remove();

        }


        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {

            _.$prevArrow.remove();

        }


        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {

            _.$nextArrow.remove();

        }


        _.$slides

            .removeClass('slick-slide slick-active slick-visible slick-current')

            .attr('aria-hidden', 'true')

            .css('width', '');


    };


    Slick.prototype.unslick = function(fromBreakpoint) {


        var _ = this;

        _.$slider.trigger('unslick', [_, fromBreakpoint]);

        _.destroy();


    };


    Slick.prototype.updateArrows = function() {


        var _ = this,

            centerOffset;


        centerOffset = Math.floor(_.options.slidesToShow / 2);


        if (_.options.arrows === true &&

            _.slideCount > _.options.slidesToShow &&

            !_.options.infinite) {


            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');


            if (_.currentSlide === 0) {


                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');


            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {


                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');


            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {


                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');


            }


        }


    };


    Slick.prototype.updateDots = function() {


        var _ = this;


        if (_.$dots !== null) {


            _.$dots

                .find('li')

                .removeClass('slick-active')

                .end();


            _.$dots

                .find('li')

                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))

                .addClass('slick-active');


        }


    };


    Slick.prototype.visibility = function() {


        var _ = this;


        if (_.options.autoplay) {


            if (document[_.hidden]) {


                _.interrupted = true;


            } else {


                _.interrupted = false;


            }


        }


    };


    $.fn.slick = function() {

        var _ = this,

            opt = arguments[0],

            args = Array.prototype.slice.call(arguments, 1),

            l = _.length,

            i,

            ret;

        for (i = 0; i < l; i++) {

            if (typeof opt == 'object' || typeof opt == 'undefined')

                _[i].slick = new Slick(_[i], opt);

            else

                ret = _[i].slick[opt].apply(_[i].slick, args);

            if (typeof ret != 'undefined') return ret;

        }

        return _;

    };


}));
/*
       (accessible)
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.1@accessible360.1
  Author: Jason Webb (Accessible360)
 Website: https://accessible360.com
    Docs: https://accessible360.github.io/accessible-slick
    Repo: https://github.com/Accessible360/accessible-slick
  Issues: https://github.com/Accessible360/accessible-slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var SlickAccessibility = window.SlickAccessibility || {};

    SlickAccessibility = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                arrowsPlacement: null,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" type="button">' +
                    '<span class="slick-prev-icon" aria-hidden="true"></span>' +
                    '<span class="slick-sr-only">Previous</span>' +
                    '</button>',
                nextArrow: '<button class="slick-next" type="button">' +
                    '<span class="slick-next-icon" aria-hidden="true"></span>' +
                    '<span class="slick-sr-only">Next</span>' +
                    '</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button">' +
                        '<span class="slick-dot-icon" aria-hidden="true"></span>' +
                        '<span class="slick-sr-only">Go to slide ' + (i + 1) + '</span>' +
                        '</button>');
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                infinite: true,
                initialSlide: 0,
                instructionsText: null,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                playIcon: '<span class="slick-play-icon" aria-hidden="true"></span>',
                pauseIcon: '<span class="slick-pause-icon" aria-hidden="true"></span>',
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                regionLabel: 'carousel',
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useAutoplayToggleButton: true,
                useCSS: true,
                useGroupRole: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                $instructionsText: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $pauseButton: null,
                $pauseIcon: null,
                $playIcon: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.autoPlayToggleHandler = $.proxy(_.autoPlayToggleHandler, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    SlickAccessibility.prototype.addSlide = SlickAccessibility.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
            $(element).attr('role', 'group');
            $(element).attr('aria-label', 'slide ' + index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    SlickAccessibility.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    SlickAccessibility.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    SlickAccessibility.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    SlickAccessibility.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if (asNavFor !== null && typeof asNavFor === 'object') {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    SlickAccessibility.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    SlickAccessibility.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
        }

    };

    SlickAccessibility.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    SlickAccessibility.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {

            if (_.options.infinite === false) {

                if (_.direction === 1 && (_.currentSlide + 1) === (_.slideCount - 1)) {
                    _.direction = 0;
                } else if (_.direction === 0) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler(slideTo);

        }

    };

    SlickAccessibility.prototype.autoPlayToggleHandler = function() {
        var _ = this;

        if (_.paused) {
            _.$playIcon.css('display', 'none');
            _.$pauseIcon.css('display', 'inline');

            _.$pauseButton.find('.slick-play-text').attr('style', 'display: none');
            _.$pauseButton.find('.slick-pause-text').removeAttr('style');

            _.slickPlay();
        } else {
            _.$playIcon.css('display', 'inline');
            _.$pauseIcon.css('display', 'none');

            _.$pauseButton.find('.slick-play-text').removeAttr('style');
            _.$pauseButton.find('.slick-pause-text').attr('style', 'display: none');

            _.slickPause();
        }
    };

    SlickAccessibility.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    if (_.options.arrowsPlacement != null) {
                        switch (_.options.arrowsPlacement) {
                            case 'beforeSlides':
                            case 'split':
                                console.log('test');
                                _.$prevArrow.prependTo(_.options.appendArrows);
                                break;

                            case 'afterSlides':
                                _.$prevArrow.appendTo(_.options.appendArrows);
                                break;
                        }

                    } else {
                        _.$prevArrow.prependTo(_.options.appendArrows);
                    }
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    if (_.options.arrowsPlacement != null) {
                        switch (_.options.arrowsPlacement) {
                            case 'beforeSlides':
                                console.log('test2');
                                _.$prevArrow.after(_.$nextArrow);
                                break;

                            case 'afterSlides':
                            case 'split':
                                _.$nextArrow.appendTo(_.options.appendArrows);
                        }
                    } else {
                        _.$nextArrow.appendTo(_.options.appendArrows);
                    }
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .prop('disabled', true);
                }

            } else {

                _.$prevArrow.add(_.$nextArrow)

                    .addClass('slick-hidden')
                    .prop('disabled', true);
            }

        }

    };

    SlickAccessibility.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    SlickAccessibility.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
            .children(_.options.slide + ':not(.slick-cloned)')
            .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');

            if (_.options.useGroupRole) {
                $(element)
                    .attr('role', 'group')
                    .attr('aria-label', 'slide ' + (index + 1));
            }
        });

        _.$slider.addClass('slick-slider');

        _.$slider.attr('role', 'region');
        _.$slider.attr('aria-label', _.options.regionLabel);

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

        if (_.options.autoplay && _.options.useAutoplayToggleButton) {
            _.$pauseIcon = $(_.options.pauseIcon).attr('aria-hidden', true);
            _.$playIcon = $(_.options.playIcon).attr('aria-hidden', true);

            _.$pauseButton = $('<button type="button" class="slick-autoplay-toggle-button">');
            _.$pauseButton.append(_.$pauseIcon);
            _.$pauseButton.append(_.$playIcon.css('display', 'none'));
            _.$pauseButton.append($('<span class="slick-pause-text slick-sr-only">Pause</span>'));
            _.$pauseButton.append($('<span class="slick-play-text slick-sr-only" style="display: none">Play</span>'));

            _.$pauseButton.prependTo(_.$slider);
        }

        if ((_.options.instructionsText != null && _.options.instructionsText != '')) {
            _.$instructionsText = $('<p class="slick-instructions slick-sr-only">' + _.options.instructionsText + '</p>');
            _.$instructionsText.prependTo(_.$slider);
        }

    };

    SlickAccessibility.prototype.buildRows = function() {

        var _ = this,
            a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 0) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width': (100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    SlickAccessibility.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    SlickAccessibility.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    SlickAccessibility.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    SlickAccessibility.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.autoplay && _.options.useAutoplayToggleButton) {
            _.$pauseButton.off('click.slick', _.autoPlayToggleHandler);
        }

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        $(window).off('orientationchange.SlickAccessibility.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.SlickAccessibility.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.SlickAccessibility.slick-' + _.instanceUid, _.setPosition);

    };

    SlickAccessibility.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    SlickAccessibility.prototype.cleanUpRows = function() {

        var _ = this,
            originalSlides;

        if (_.options.rows > 0) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    SlickAccessibility.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    SlickAccessibility.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.options.autoplay && _.options.useAutoplayToggleButton) {
            _.$pauseButton.remove();
        }

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.$prevArrow.length) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .prop('disabled', false)
                .css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .prop('disabled', false)
                .css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function() {
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    SlickAccessibility.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    SlickAccessibility.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    SlickAccessibility.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    SlickAccessibility.prototype.filterSlides = SlickAccessibility.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    SlickAccessibility.prototype.focusHandler = function() {

        var _ = this;

        // If any child element receives focus within the slider we need to pause the autoplay
        _.$slider
            .off('focus.slick blur.slick')
            .on(
                'focus.slick',
                '*',
                function(event) {
                    var $sf = $(this);

                    setTimeout(function() {
                        if (_.options.pauseOnFocus) {
                            if ($sf.is(':focus')) {
                                _.focussed = true;
                                _.autoPlay();
                            }
                        }
                    }, 0);
                }
            ).on(
                'blur.slick',
                '*',
                function(event) {
                    var $sf = $(this);

                    // When a blur occurs on any elements within the slider we become unfocused
                    if (_.options.pauseOnFocus) {
                        _.focussed = false;
                        _.autoPlay();
                    }
                }
            );
    };

    SlickAccessibility.prototype.getCurrent = SlickAccessibility.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    SlickAccessibility.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    SlickAccessibility.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    SlickAccessibility.prototype.getOption = SlickAccessibility.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    SlickAccessibility.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    SlickAccessibility.prototype.getSlick = function() {

        return this;

    };

    SlickAccessibility.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, swipeTarget, centerOffset;

        centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
        swipeTarget = (_.swipeLeft * -1) + centerOffset;

        if (_.options.swipeToSlide === true) {

            _.$slideTrack.find('.slick-slide').each(function(index, slide) {

                var slideOuterWidth, slideOffset, slideRightBoundary;
                slideOuterWidth = $(slide).outerWidth();
                slideOffset = slide.offsetLeft;
                if (_.options.centerMode !== true) {
                    slideOffset += (slideOuterWidth / 2);
                }

                slideRightBoundary = slideOffset + (slideOuterWidth);

                if (swipeTarget < slideRightBoundary) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    SlickAccessibility.prototype.goTo = SlickAccessibility.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    SlickAccessibility.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.autoplay) {

            _.paused = false;
            _.autoPlay();

        }

        _.updateSlideVisibility();

        if (_.options.accessibility != undefined) {
            console.warn('accessibility setting is no longer supported.')
        }

        if (_.options.focusOnChange != undefined) {
            console.warn('focusOnChange is no longer supported.');
        }

        if (_.options.focusOnSelect != undefined) {
            console.warn('focusOnSelect is no longer supported.');
        }

    };

    SlickAccessibility.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
                .off('click.slick')
                .on('click.slick', {
                    message: 'previous'
                }, _.changeSlide);
            _.$nextArrow
                .off('click.slick')
                .on('click.slick', {
                    message: 'next'
                }, _.changeSlide);
        }

    };

    SlickAccessibility.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    SlickAccessibility.prototype.initSlideEvents = function() {

        var _ = this;

        if (_.options.pauseOnHover) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    SlickAccessibility.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        if (_.options.autoplay && _.options.useAutoplayToggleButton) {
            _.$pauseButton.on('click.slick', _.autoPlayToggleHandler);
        }

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        $(window).on('orientationchange.SlickAccessibility.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.SlickAccessibility.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.SlickAccessibility.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    SlickAccessibility.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    SlickAccessibility.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({
                            opacity: 0
                        }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet);

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes);
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({
                                    opacity: 1
                                }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr('data-lazy')
                        .removeClass('slick-loading')
                        .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    SlickAccessibility.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    SlickAccessibility.prototype.next = SlickAccessibility.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    SlickAccessibility.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    SlickAccessibility.prototype.pause = SlickAccessibility.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    SlickAccessibility.prototype.play = SlickAccessibility.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    SlickAccessibility.prototype.postSlide = function(index) {

        var _ = this;

        if (!_.unslicked) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            _.updateSlideVisibility();

        }

    };

    SlickAccessibility.prototype.prev = SlickAccessibility.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    SlickAccessibility.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    SlickAccessibility.prototype.progressiveLazyLoad = function(tryCount) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $('img[data-lazy]', _.$slider),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ($imgsToLoad.length) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet);

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes);
                    }
                }

                image
                    .attr('src', imageSource)
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if (tryCount < 3) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function() {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);

                } else {

                    image
                        .removeAttr('data-lazy')
                        .removeClass('slick-loading')
                        .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [_]);

        }

    };

    SlickAccessibility.prototype.refresh = function(initializing) {

        var _ = this,
            currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && (_.currentSlide > lastVisibleIndex)) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, {
            currentSlide: currentSlide
        });

        _.init();

        if (!initializing) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    SlickAccessibility.prototype.registerBreakpoints = function() {

        var _ = this,
            breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {

                l = _.breakpoints.length - 1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return (_.options.mobileFirst) ? a - b : b - a;
            });

        }

    };

    SlickAccessibility.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
            .children(_.options.slide)
            .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    SlickAccessibility.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    SlickAccessibility.prototype.removeSlide = SlickAccessibility.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    SlickAccessibility.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    SlickAccessibility.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    SlickAccessibility.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    SlickAccessibility.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    SlickAccessibility.prototype.setOption =
        SlickAccessibility.prototype.slickSetOption = function() {

            /**
             * accepts arguments in format of:
             *
             *  - for changing a single option's value:
             *     .slick("setOption", option, value, refresh )
             *
             *  - for changing a set of responsive options:
             *     .slick("setOption", 'responsive', [{}, ...], refresh )
             *
             *  - for updating multiple values at once (not responsive)
             *     .slick("setOption", { 'option': value, ... }, refresh )
             */

            var _ = this,
                l, item, option, value, refresh = false,
                type;

            if ($.type(arguments[0]) === 'object') {

                option = arguments[0];
                refresh = arguments[1];
                type = 'multiple';

            } else if ($.type(arguments[0]) === 'string') {

                option = arguments[0];
                value = arguments[1];
                refresh = arguments[2];

                if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {

                    type = 'responsive';

                } else if (typeof arguments[1] !== 'undefined') {

                    type = 'single';

                }

            }

            if (type === 'single') {

                _.options[option] = value;


            } else if (type === 'multiple') {

                $.each(option, function(opt, val) {

                    _.options[opt] = val;

                });


            } else if (type === 'responsive') {

                for (item in value) {

                    if ($.type(_.options.responsive) !== 'array') {

                        _.options.responsive = [value[item]];

                    } else {

                        l = _.options.responsive.length - 1;

                        // loop through the responsive object and splice out duplicates.
                        while (l >= 0) {

                            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {

                                _.options.responsive.splice(l, 1);

                            }

                            l--;

                        }

                        _.options.responsive.push(value[item]);

                    }

                }

            }

            if (refresh) {

                _.unload();
                _.reinit();

            }

        };

    SlickAccessibility.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    SlickAccessibility.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    SlickAccessibility.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true')
            .attr('aria-label', function() {
                return $(this).attr('aria-label').replace(' (centered)', '');
            });

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .removeAttr('aria-hidden');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .removeAttr('aria-hidden');

                }

                if (index === 0) {

                    allSlides
                        .eq(_.options.slidesToShow + _.slideCount + 1)
                        .addClass('slick-center')
                        .attr('aria-label', function() {
                            return $(this).attr('aria-label') + ' (centered)';
                        });

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center')
                        .attr('aria-label', function() {
                            return $(this).attr('aria-label') + ' (centered)';
                        });

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center')
                .attr('aria-label', function() {
                    return $(this).attr('aria-label') + ' (centered)';
                });

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .removeAttr('aria-hidden');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .removeAttr('aria-hidden');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .removeAttr('aria-hidden');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .removeAttr('aria-hidden');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    SlickAccessibility.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    SlickAccessibility.prototype.interrupt = function(toggle) {

        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    SlickAccessibility.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
            $(event.target) :
            $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    SlickAccessibility.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this,
            navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    SlickAccessibility.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    SlickAccessibility.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    SlickAccessibility.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            direction = _.swipeDirection();

            switch (direction) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                        _.checkNavigable(_.currentSlide + _.getSlideCount()) :
                        _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                        _.checkNavigable(_.currentSlide - _.getSlideCount()) :
                        _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if (direction != 'vertical') {

                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);

            }

        } else {

            if (_.touchObject.startX !== _.touchObject.curX) {

                _.slideHandler(_.currentSlide);
                _.touchObject = {};

            }

        }

    };

    SlickAccessibility.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    SlickAccessibility.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    SlickAccessibility.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    SlickAccessibility.prototype.unfilterSlides = SlickAccessibility.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    SlickAccessibility.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    SlickAccessibility.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    SlickAccessibility.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite) {

            _.$prevArrow.removeClass('slick-disabled').prop('disabled', false);
            _.$nextArrow.removeClass('slick-disabled').prop('disabled', false);

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').prop('disabled', true);
                _.$nextArrow.removeClass('slick-disabled').prop('disabled', false);

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').prop('disabled', true);
                _.$prevArrow.removeClass('slick-disabled').prop('disabled', false);

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').prop('disabled', true);
                _.$prevArrow.removeClass('slick-disabled').prop('disabled', false);

            }

        }

    };

    SlickAccessibility.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .find('button')
                .removeAttr('aria-current')
                .end()
                .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .find('button')
                .attr('aria-current', true)
                .end()
                .end();

        }

    };

    SlickAccessibility.prototype.updateSlideVisibility = function() {
        var _ = this;

        _.$slideTrack
            .find('.slick-slide')
            .attr('aria-hidden', 'true')
            .find('a, input, button, select')
            .attr('tabindex', '-1');

        _.$slideTrack
            .find('.slick-active')
            .removeAttr('aria-hidden')
            .find('a, input, button, select')
            .removeAttr('tabindex');
    }

    SlickAccessibility.prototype.visibility = function() {

        var _ = this;

        if (_.options.autoplay) {

            if (document[_.hidden]) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.AccessibileSlick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new SlickAccessibility(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

;
(function($) {
    var settings = {
        speed: 300,
        offset: 0,
        currentClass: 'active',
        updateHash: false,
        classToParent: false
    }

    var RMITanchorNavPoints = {
        init: function(options, navbar) {
            settings = $.extend(settings, options);
            this.$navbar = $(navbar);
            this.$items = this.$navbar.find('a:not(.externals)');
            this.$window = $(window);
            this.hashNow = undefined;

            this.$items.on('click', this.clicked);
            this.$window.on('scroll', $.proxy(this.scrollPage, this));
            this.$window.on('resize', $.proxy(this.scrollPage, this));
        },
        clicked: function(e) {
            e.preventDefault();
            var hash = $(this).attr('href');
            var position = $(hash).offset().top - settings.offset;

            $('html, body').animate({
                scrollTop: position
            }, settings.speed);
        },
        scrollPage: function() {
            var self = this,
                sections = [],
                result = undefined;

            self.$items.each(function() {
                var hash = $(this).attr('href');
                var section = $(hash);

                if (section) sections.push(section);
            });

            for (var i = 0; i < sections.length; i++) {
                var section = sections[i],
                    sectionHeight = section.height(),
                    sectionTop = section.offset().top,
                    windowTop = self.$window.scrollTop(),
                    windoHeight = self.$window.height();

                if (windowTop <= sectionTop && (sectionHeight + sectionTop) < (windowTop + windoHeight)) {
                    result = sections[i].attr('id');
                    break;
                }
            }

            if (result) {
                if (settings.updateHash) {
                    var hash = '#' + result;
                    if (self.hashNow != hash) {
                        self.hashNow = hash;
                        history.pushState({}, '', hash);
                    }
                }

                if (settings.classToParent) {
                    self.$items.parent().removeClass(settings.currentClass);
                    $('a[href="#' + result + '"]').parent().addClass(settings.currentClass);
                } else {
                    self.$items.removeClass(settings.currentClass);
                    $('a[href="#' + result + '"]').addClass(settings.currentClass);
                }
            }
        }
    }

    $.fn.anchorNavPoints = function(options) {
        this.each(function() {
            var anchorNavPoints = Object.create(RMITanchorNavPoints);
            anchorNavPoints.init(options, this);
        });
    }
})(jQuery);
/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
 */

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("bloodhound", ["jquery"], function(a0) {
            return root["Bloodhound"] = factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        root["Bloodhound"] = factory(jQuery);
    }
})(this, function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            isElement: function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isJQuery: function(obj) {
                return obj instanceof $;
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);

                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            identity: function(x) {
                return x;
            },
            clone: function(obj) {
                return $.extend(true, {}, obj);
            },
            getIdGenerator: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            },
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;

                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this,
                        args = arguments,
                        later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(),
                        remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            stringify: function(val) {
                return _.isString(val) ? val : JSON.stringify(val);
            },
            noop: function() {}
        };
    }();
    var VERSION = "0.11.1";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };

        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }

        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }

        function getObjTokenizer(tokenizer) {
            return function setKey(keys) {
                keys = _.isArray(keys) ? keys : [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(keys, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";

        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail,
                    node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                    this.size--;
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
            }
        });

        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });

        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        "use strict";
        var LOCAL_STORAGE;
        try {
            LOCAL_STORAGE = window.localStorage;
            LOCAL_STORAGE.setItem("~~~", "!");
            LOCAL_STORAGE.removeItem("~~~");
        } catch (err) {
            LOCAL_STORAGE = null;
        }

        function PersistentStorage(namespace, override) {
            this.prefix = ["__", namespace, "__"].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
            this.ls = override || LOCAL_STORAGE;
            !this.ls && this._noop();
        }
        _.mixin(PersistentStorage.prototype, {
            _prefix: function(key) {
                return this.prefix + key;
            },
            _ttlKey: function(key) {
                return this._prefix(key) + this.ttlKey;
            },
            _noop: function() {
                this.get = this.set = this.remove = this.clear = this.isExpired = _.noop;
            },
            _safeSet: function(key, val) {
                try {
                    this.ls.setItem(key, val);
                } catch (err) {
                    if (err.name === "QuotaExceededError") {
                        this.clear();
                        this._noop();
                    }
                }
            },
            get: function(key) {
                if (this.isExpired(key)) {
                    this.remove(key);
                }
                return decode(this.ls.getItem(this._prefix(key)));
            },
            set: function(key, val, ttl) {
                if (_.isNumber(ttl)) {
                    this._safeSet(this._ttlKey(key), encode(now() + ttl));
                } else {
                    this.ls.removeItem(this._ttlKey(key));
                }
                return this._safeSet(this._prefix(key), encode(val));
            },
            remove: function(key) {
                this.ls.removeItem(this._ttlKey(key));
                this.ls.removeItem(this._prefix(key));
                return this;
            },
            clear: function() {
                var i, keys = gatherMatchingKeys(this.keyMatcher);
                for (i = keys.length; i--;) {
                    this.remove(keys[i]);
                }
                return this;
            },
            isExpired: function(key) {
                var ttl = decode(this.ls.getItem(this._ttlKey(key)));
                return _.isNumber(ttl) && now() > ttl ? true : false;
            }
        });
        return PersistentStorage;

        function now() {
            return new Date().getTime();
        }

        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }

        function decode(val) {
            return $.parseJSON(val);
        }

        function gatherMatchingKeys(keyMatcher) {
            var i, key, keys = [],
                len = LOCAL_STORAGE.length;
            for (i = 0; i < len; i++) {
                if ((key = LOCAL_STORAGE.key(i)).match(keyMatcher)) {
                    keys.push(key.replace(keyMatcher, ""));
                }
            }
            return keys;
        }
    }();
    var Transport = function() {
        "use strict";
        var pendingRequestsCount = 0,
            pendingRequests = {},
            maxPendingRequests = 6,
            sharedCache = new LruCache(10);

        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastReq = null;
            this._send = o.transport;
            this._get = o.limiter ? o.limiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _fingerprint: function fingerprint(o) {
                o = o || {};
                return o.url + o.type + $.param(o.data || {});
            },
            _get: function(o, cb) {
                var that = this,
                    fingerprint, jqXhr;
                fingerprint = this._fingerprint(o);
                if (this.cancelled || fingerprint !== this.lastReq) {
                    return;
                }
                if (jqXhr = pendingRequests[fingerprint]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[fingerprint] = this._send(o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }

                function done(resp) {
                    cb(null, resp);
                    that._cache.set(fingerprint, resp);
                }

                function fail() {
                    cb(true);
                }

                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[fingerprint];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(o, cb) {
                var resp, fingerprint;
                cb = cb || $.noop;
                o = _.isString(o) ? {
                    url: o
                } : o || {};
                fingerprint = this._fingerprint(o);
                this.cancelled = false;
                this.lastReq = fingerprint;
                if (resp = this._cache.get(fingerprint)) {
                    cb(null, resp);
                } else {
                    this._get(o, cb);
                }
            },
            cancel: function() {
                this.cancelled = true;
            }
        });
        return Transport;
    }();
    var SearchIndex = window.SearchIndex = function() {
        "use strict";
        var CHILDREN = "c",
            IDS = "i";

        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.identify = o.identify || _.stringify;
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [data];
                _.each(data, function(datum) {
                    var id, tokens;
                    that.datums[id = that.identify(datum)] = datum;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node[CHILDREN][ch] || (node[CHILDREN][ch] = newNode());
                            node[IDS].push(id);
                        }
                    });
                });
            },
            get: function get(ids) {
                var that = this;
                return _.map(ids, function(id) {
                    return that.datums[id];
                });
            },
            search: function search(query) {
                var that = this,
                    tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node[CHILDREN][ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node[IDS].slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            all: function all() {
                var values = [];
                for (var key in this.datums) {
                    values.push(this.datums[key]);
                }
                return values;
            },
            reset: function reset() {
                this.datums = {};
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;

        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }

        function newNode() {
            var node = {};
            node[IDS] = [];
            node[CHILDREN] = {};
            return node;
        }

        function unique(array) {
            var seen = {},
                uniques = [];
            for (var i = 0, len = array.length; i < len; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }

        function getIntersection(arrayA, arrayB) {
            var ai = 0,
                bi = 0,
                intersection = [];
            arrayA = arrayA.sort();
            arrayB = arrayB.sort();
            var lenArrayA = arrayA.length,
                lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
        }
    }();
    var Prefetch = function() {
        "use strict";
        var keys;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };

        function Prefetch(o) {
            this.url = o.url;
            this.ttl = o.ttl;
            this.cache = o.cache;
            this.prepare = o.prepare;
            this.transform = o.transform;
            this.transport = o.transport;
            this.thumbprint = o.thumbprint;
            this.storage = new PersistentStorage(o.cacheKey);
        }
        _.mixin(Prefetch.prototype, {
            _settings: function settings() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                };
            },
            store: function store(data) {
                if (!this.cache) {
                    return;
                }
                this.storage.set(keys.data, data, this.ttl);
                this.storage.set(keys.protocol, location.protocol, this.ttl);
                this.storage.set(keys.thumbprint, this.thumbprint, this.ttl);
            },
            fromCache: function fromCache() {
                var stored = {},
                    isExpired;
                if (!this.cache) {
                    return null;
                }
                stored.data = this.storage.get(keys.data);
                stored.protocol = this.storage.get(keys.protocol);
                stored.thumbprint = this.storage.get(keys.thumbprint);
                isExpired = stored.thumbprint !== this.thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            fromNetwork: function(cb) {
                var that = this,
                    settings;
                if (!cb) {
                    return;
                }
                settings = this.prepare(this._settings());
                this.transport(settings).fail(onError).done(onResponse);

                function onError() {
                    cb(true);
                }

                function onResponse(resp) {
                    cb(null, that.transform(resp));
                }
            },
            clear: function clear() {
                this.storage.clear();
                return this;
            }
        });
        return Prefetch;
    }();
    var Remote = function() {
        "use strict";

        function Remote(o) {
            this.url = o.url;
            this.prepare = o.prepare;
            this.transform = o.transform;
            this.transport = new Transport({
                cache: o.cache,
                limiter: o.limiter,
                transport: o.transport
            });
        }
        _.mixin(Remote.prototype, {
            _settings: function settings() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                };
            },
            get: function get(query, cb) {
                var that = this,
                    settings;
                if (!cb) {
                    return;
                }
                query = query || "";
                settings = this.prepare(query, this._settings());
                return this.transport.get(settings, onResponse);

                function onResponse(err, resp) {
                    err ? cb([]) : cb(that.transform(resp));
                }
            },
            cancelLastRequest: function cancelLastRequest() {
                this.transport.cancel();
            }
        });
        return Remote;
    }();
    var oParser = function() {
        "use strict";
        return function parse(o) {
            var defaults, sorter;
            defaults = {
                initialize: true,
                identify: _.stringify,
                datumTokenizer: null,
                queryTokenizer: null,
                sufficient: 5,
                sorter: null,
                local: [],
                prefetch: null,
                remote: null
            };
            o = _.mixin(defaults, o || {});
            !o.datumTokenizer && $.error("datumTokenizer is required");
            !o.queryTokenizer && $.error("queryTokenizer is required");
            sorter = o.sorter;
            o.sorter = sorter ? function(x) {
                return x.sort(sorter);
            } : _.identity;
            o.local = _.isFunction(o.local) ? o.local() : o.local;
            o.prefetch = parsePrefetch(o.prefetch);
            o.remote = parseRemote(o.remote);
            return o;
        };

        function parsePrefetch(o) {
            var defaults;
            if (!o) {
                return null;
            }
            defaults = {
                url: null,
                ttl: 24 * 60 * 60 * 1e3,
                cache: true,
                cacheKey: null,
                thumbprint: "",
                prepare: _.identity,
                transform: _.identity,
                transport: null
            };
            o = _.isString(o) ? {
                url: o
            } : o;
            o = _.mixin(defaults, o);
            !o.url && $.error("prefetch requires url to be set");
            o.transform = o.filter || o.transform;
            o.cacheKey = o.cacheKey || o.url;
            o.thumbprint = VERSION + o.thumbprint;
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            return o;
        }

        function parseRemote(o) {
            var defaults;
            if (!o) {
                return;
            }
            defaults = {
                url: null,
                cache: true,
                prepare: null,
                replace: null,
                wildcard: null,
                limiter: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                transform: _.identity,
                transport: null
            };
            o = _.isString(o) ? {
                url: o
            } : o;
            o = _.mixin(defaults, o);
            !o.url && $.error("remote requires url to be set");
            o.transform = o.filter || o.transform;
            o.prepare = toRemotePrepare(o);
            o.limiter = toLimiter(o);
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            delete o.replace;
            delete o.wildcard;
            delete o.rateLimitBy;
            delete o.rateLimitWait;
            return o;
        }

        function toRemotePrepare(o) {
            var prepare, replace, wildcard;
            prepare = o.prepare;
            replace = o.replace;
            wildcard = o.wildcard;
            if (prepare) {
                return prepare;
            }
            if (replace) {
                prepare = prepareByReplace;
            } else if (o.wildcard) {
                prepare = prepareByWildcard;
            } else {
                prepare = idenityPrepare;
            }
            return prepare;

            function prepareByReplace(query, settings) {
                settings.url = replace(settings.url, query);
                return settings;
            }

            function prepareByWildcard(query, settings) {
                settings.url = settings.url.replace(wildcard, encodeURIComponent(query));
                return settings;
            }

            function idenityPrepare(query, settings) {
                return settings;
            }
        }

        function toLimiter(o) {
            var limiter, method, wait;
            limiter = o.limiter;
            method = o.rateLimitBy;
            wait = o.rateLimitWait;
            if (!limiter) {
                limiter = /^throttle$/i.test(method) ? throttle(wait) : debounce(wait);
            }
            return limiter;

            function debounce(wait) {
                return function debounce(fn) {
                    return _.debounce(fn, wait);
                };
            }

            function throttle(wait) {
                return function throttle(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }

        function callbackToDeferred(fn) {
            return function wrapper(o) {
                var deferred = $.Deferred();
                fn(o, onSuccess, onError);
                return deferred;

                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }

                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var Bloodhound = function() {
        "use strict";
        var old;
        old = window && window.Bloodhound;

        function Bloodhound(o) {
            o = oParser(o);
            this.sorter = o.sorter;
            this.identify = o.identify;
            this.sufficient = o.sufficient;
            this.local = o.local;
            this.remote = o.remote ? new Remote(o.remote) : null;
            this.prefetch = o.prefetch ? new Prefetch(o.prefetch) : null;
            this.index = new SearchIndex({
                identify: this.identify,
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            o.initialize !== false && this.initialize();
        }
        Bloodhound.noConflict = function noConflict() {
            window && (window.Bloodhound = old);
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            __ttAdapter: function ttAdapter() {
                var that = this;
                return this.remote ? withAsync : withoutAsync;

                function withAsync(query, sync, async) {
                    return that.search(query, sync, async);
                }

                function withoutAsync(query, sync) {
                    return that.search(query, sync);
                }
            },
            _loadPrefetch: function loadPrefetch() {
                var that = this,
                    deferred, serialized;
                deferred = $.Deferred();
                if (!this.prefetch) {
                    deferred.resolve();
                } else if (serialized = this.prefetch.fromCache()) {
                    this.index.bootstrap(serialized);
                    deferred.resolve();
                } else {
                    this.prefetch.fromNetwork(done);
                }
                return deferred.promise();

                function done(err, data) {
                    if (err) {
                        return deferred.reject();
                    }
                    that.add(data);
                    that.prefetch.store(that.index.serialize());
                    deferred.resolve();
                }
            },
            _initialize: function initialize() {
                var that = this,
                    deferred;
                this.clear();
                (this.initPromise = this._loadPrefetch()).done(addLocalToIndex);
                return this.initPromise;

                function addLocalToIndex() {
                    that.add(that.local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
                return this;
            },
            get: function get(ids) {
                ids = _.isArray(ids) ? ids : [].slice.call(arguments);
                return this.index.get(ids);
            },
            search: function search(query, sync, async) {
                var that = this,
                    local;
                local = this.sorter(this.index.search(query));
                sync(this.remote ? local.slice() : local);
                if (this.remote && local.length < this.sufficient) {
                    this.remote.get(query, processRemote);
                } else if (this.remote) {
                    this.remote.cancelLastRequest();
                }
                return this;

                function processRemote(remote) {
                    var nonDuplicates = [];
                    _.each(remote, function(r) {
                        !_.some(local, function(l) {
                            return that.identify(r) === that.identify(l);
                        }) && nonDuplicates.push(r);
                    });
                    async && async (nonDuplicates);
                }
            },
            all: function all() {
                return this.index.all();
            },
            clear: function clear() {
                this.index.reset();
                return this;
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.prefetch && this.prefetch.clear();
                return this;
            },
            clearRemoteCache: function clearRemoteCache() {
                Transport.resetCache();
                return this;
            },
            ttAdapter: function ttAdapter() {
                return this.__ttAdapter();
            }
        });
        return Bloodhound;
    }();
    return Bloodhound;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("typeahead.js", ["jquery"], function(a0) {
            return factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(this, function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            isElement: function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isJQuery: function(obj) {
                return obj instanceof $;
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);

                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            identity: function(x) {
                return x;
            },
            clone: function(obj) {
                return $.extend(true, {}, obj);
            },
            getIdGenerator: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            },
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;

                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this,
                        args = arguments,
                        later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(),
                        remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            stringify: function(val) {
                return _.isString(val) ? val : JSON.stringify(val);
            },
            noop: function() {}
        };
    }();
    var WWW = function() {
        "use strict";
        var defaultClassNames = {
            wrapper: "twitter-typeahead",
            input: "tt-input",
            hint: "tt-hint",
            menu: "tt-menu",
            dataset: "tt-dataset",
            suggestion: "tt-suggestion",
            selectable: "tt-selectable",
            empty: "tt-empty",
            open: "tt-open",
            cursor: "tt-cursor",
            highlight: "tt-highlight"
        };
        return build;

        function build(o) {
            var www, classes;
            classes = _.mixin({}, defaultClassNames, o);
            www = {
                css: buildCss(),
                classes: classes,
                html: buildHtml(classes),
                selectors: buildSelectors(classes)
            };
            return {
                css: www.css,
                html: www.html,
                classes: www.classes,
                selectors: www.selectors,
                mixin: function(o) {
                    _.mixin(o, www);
                }
            };
        }

        function buildHtml(c) {
            return {
                wrapper: '<span class="' + c.wrapper + '"></span>',
                menu: '<div class="' + c.menu + '"></div>'
            };
        }

        function buildSelectors(classes) {
            var selectors = {};
            _.each(classes, function(v, k) {
                selectors[k] = "." + v;
            });
            return selectors;
        }

        function buildCss() {
            var css = {
                wrapper: {
                    position: "relative",
                    display: "inline-block"
                },
                hint: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    borderColor: "transparent",
                    boxShadow: "none",
                    opacity: "1"
                },
                input: {
                    position: "relative",
                    verticalAlign: "top",
                    backgroundColor: "transparent"
                },
                inputWithNoHint: {
                    position: "relative",
                    verticalAlign: "top"
                },
                menu: {
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    zIndex: "100",
                    display: "none"
                },
                ltr: {
                    left: "0",
                    right: "auto"
                },
                rtl: {
                    left: "auto",
                    right: " 0"
                }
            };
            if (_.isMsie()) {
                _.mixin(css.input, {
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                });
            }
            return css;
        }
    }();
    var EventBus = function() {
        "use strict";
        var namespace, deprecationMap;
        namespace = "typeahead:";
        deprecationMap = {
            render: "rendered",
            cursorchange: "cursorchanged",
            select: "selected",
            autocomplete: "autocompleted"
        };

        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            _trigger: function(type, args) {
                var $e;
                $e = $.Event(namespace + type);
                (args = args || []).unshift($e);
                this.$el.trigger.apply(this.$el, args);
                return $e;
            },
            before: function(type) {
                var args, $e;
                args = [].slice.call(arguments, 1);
                $e = this._trigger("before" + type, args);
                return $e.isDefaultPrevented();
            },
            trigger: function(type) {
                var deprecatedType;
                this._trigger(type, [].slice.call(arguments, 1));
                if (deprecatedType = deprecationMap[type]) {
                    this._trigger(deprecatedType, [].slice.call(arguments, 1));
                }
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        "use strict";
        var splitter = /\s+/,
            nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };

        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }

        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }

        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }

        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }

        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }

        function getFlush(callbacks, context, args) {
            return flush;

            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }

        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }

        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [o.pattern];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);

            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }

            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };

        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [],
                regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };

        function Input(o, www) {
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            www.mixin(this);
            this.$hint = $(o.hint);
            this.$input = $(o.input);
            this.query = this.$input.val();
            this.queryWhenFocused = this.hasFocus() ? this.query : null;
            this.$overflowHelper = buildOverflowHelper(this.$input);
            this._checkLanguageDirection();
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
        }
        Input.normalizeQuery = function(str) {
            return _.toStr(str).replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.queryWhenFocused = this.query;
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._setQuery(this.getInputValue());
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault;
                switch (keyName) {
                    case "up":
                    case "down":
                        preventDefault = !withModifier($e);
                        break;

                    default:
                        preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                    case "tab":
                        trigger = !withModifier($e);
                        break;

                    default:
                        trigger = true;
                }
                return trigger;
            },
            _checkLanguageDirection: function checkLanguageDirection() {
                var dir = (this.$input.css("direction") || "ltr").toLowerCase();
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.$hint.attr("dir", dir);
                    this.trigger("langDirChanged", dir);
                }
            },
            _setQuery: function setQuery(val, silent) {
                var areEquivalent, hasDifferentWhitespace;
                areEquivalent = areQueriesEquivalent(val, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== val.length : false;
                this.query = val;
                if (!silent && !areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (!silent && hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            bind: function() {
                var that = this,
                    onBlur, onFocus, onKeydown, onInput;
                onBlur = _.bind(this._onBlur, this);
                onFocus = _.bind(this._onFocus, this);
                onKeydown = _.bind(this._onKeydown, this);
                onInput = _.bind(this._onInput, this);
                this.$input.on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
                if (!_.isMsie() || _.isMsie() > 9) {
                    this.$input.on("input.tt", onInput);
                } else {
                    this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                        if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                            return;
                        }
                        _.defer(_.bind(that._onInput, that, $e));
                    });
                }
                return this;
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getLangDir: function getLangDir() {
                return this.dir;
            },
            getQuery: function getQuery() {
                return this.query || "";
            },
            setQuery: function setQuery(val, silent) {
                this.setInputValue(val);
                this._setQuery(val, silent);
            },
            hasQueryChangedSinceLastFocus: function hasQueryChangedSinceLastFocus() {
                return this.query !== this.queryWhenFocused;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value) {
                this.$input.val(value);
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            hasFocus: function hasFocus() {
                return this.$input.is(":focus");
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$overflowHelper.remove();
                this.$hint = this.$input = this.$overflowHelper = $("<div>");
            }
        });
        return Input;

        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }

        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }

        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        "use strict";
        var keys, nameGenerator;
        keys = {
            val: "tt-selectable-display",
            obj: "tt-selectable-object"
        };
        nameGenerator = _.getIdGenerator();

        function Dataset(o, www) {
            o = o || {};
            o.templates = o.templates || {};
            o.templates.notFound = o.templates.notFound || o.templates.empty;
            if (!o.source) {
                $.error("missing source");
            }
            if (!o.node) {
                $.error("missing node");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            www.mixin(this);
            this.highlight = !!o.highlight;
            this.name = o.name || nameGenerator();
            this.limit = o.limit || 5;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.source = o.source.__ttAdapter ? o.source.__ttAdapter() : o.source;
            this.async = _.isUndefined(o.async) ? this.source.length > 2 : !!o.async;
            this._resetLastSuggestion();
            this.$el = $(o.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name);
        }
        Dataset.extractData = function extractData(el) {
            var $el = $(el);
            if ($el.data(keys.obj)) {
                return {
                    val: $el.data(keys.val) || "",
                    obj: $el.data(keys.obj) || null
                };
            }
            return null;
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _overwrite: function overwrite(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (this.async && this.templates.pending) {
                    this._renderPending(query);
                } else if (!this.async && this.templates.notFound) {
                    this._renderNotFound(query);
                } else {
                    this._empty();
                }
                this.trigger("rendered", this.name, suggestions, false);
            },
            _append: function append(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length && this.$lastSuggestion.length) {
                    this._appendSuggestions(query, suggestions);
                } else if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (!this.$lastSuggestion.length && this.templates.notFound) {
                    this._renderNotFound(query);
                }
                this.trigger("rendered", this.name, suggestions, true);
            },
            _renderSuggestions: function renderSuggestions(query, suggestions) {
                var $fragment;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                this.$lastSuggestion = $fragment.children().last();
                this.$el.html($fragment).prepend(this._getHeader(query, suggestions)).append(this._getFooter(query, suggestions));
            },
            _appendSuggestions: function appendSuggestions(query, suggestions) {
                var $fragment, $lastSuggestion;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                $lastSuggestion = $fragment.children().last();
                this.$lastSuggestion.after($fragment);
                this.$lastSuggestion = $lastSuggestion;
            },
            _renderPending: function renderPending(query) {
                var template = this.templates.pending;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _renderNotFound: function renderNotFound(query) {
                var template = this.templates.notFound;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _empty: function empty() {
                this.$el.empty();
                this._resetLastSuggestion();
            },
            _getSuggestionsFragment: function getSuggestionsFragment(query, suggestions) {
                var that = this,
                    fragment;
                fragment = document.createDocumentFragment();
                _.each(suggestions, function getSuggestionNode(suggestion) {
                    var $el, context;
                    context = that._injectQuery(query, suggestion);
                    $el = $(that.templates.suggestion(context)).data(keys.obj, suggestion).data(keys.val, that.displayFn(suggestion)).addClass(that.classes.suggestion + " " + that.classes.selectable);
                    fragment.appendChild($el[0]);
                });
                this.highlight && highlight({
                    className: this.classes.highlight,
                    node: fragment,
                    pattern: query
                });
                return $(fragment);
            },
            _getFooter: function getFooter(query, suggestions) {
                return this.templates.footer ? this.templates.footer({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _getHeader: function getHeader(query, suggestions) {
                return this.templates.header ? this.templates.header({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _resetLastSuggestion: function resetLastSuggestion() {
                this.$lastSuggestion = $();
            },
            _injectQuery: function injectQuery(query, obj) {
                return _.isObject(obj) ? _.mixin({
                    _query: query
                }, obj) : obj;
            },
            update: function update(query) {
                var that = this,
                    canceled = false,
                    syncCalled = false,
                    rendered = 0;
                this.cancel();
                this.cancel = function cancel() {
                    canceled = true;
                    that.cancel = $.noop;
                    that.async && that.trigger("asyncCanceled", query);
                };
                this.source(query, sync, async);
                !syncCalled && sync([]);

                function sync(suggestions) {
                    if (syncCalled) {
                        return;
                    }
                    syncCalled = true;
                    suggestions = (suggestions || []).slice(0, that.limit);
                    rendered = suggestions.length;
                    that._overwrite(query, suggestions);
                    if (rendered < that.limit && that.async) {
                        that.trigger("asyncRequested", query);
                    }
                }

                function async (suggestions) {
                    suggestions = suggestions || [];
                    if (!canceled && rendered < that.limit) {
                        that.cancel = $.noop;
                        rendered += suggestions.length;
                        that._append(query, suggestions.slice(0, that.limit - rendered));
                        that.async && that.trigger("asyncReceived", query);
                    }
                }
            },
            cancel: $.noop,
            clear: function clear() {
                this._empty();
                this.cancel();
                this.trigger("cleared");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = $("<div>");
            }
        });
        return Dataset;

        function getDisplayFn(display) {
            display = display || _.stringify;
            return _.isFunction(display) ? display : displayFn;

            function displayFn(obj) {
                return obj[display];
            }
        }

        function getTemplates(templates, displayFn) {
            return {
                notFound: templates.notFound && _.templatify(templates.notFound),
                pending: templates.pending && _.templatify(templates.pending),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };

            function suggestionTemplate(context) {
                return $("<div>").text(displayFn(context));
            }
        }

        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Menu = function() {
        "use strict";

        function Menu(o, www) {
            var that = this;
            o = o || {};
            if (!o.node) {
                $.error("node is required");
            }
            www.mixin(this);
            this.$node = $(o.node);
            this.query = null;
            this.datasets = _.map(o.datasets, initializeDataset);

            function initializeDataset(oDataset) {
                var node = that.$node.find(oDataset.node).first();
                oDataset.node = node.length ? node : $("<div>").appendTo(that.$node);
                return new Dataset(oDataset, www);
            }
        }
        _.mixin(Menu.prototype, EventEmitter, {
            _onSelectableClick: function onSelectableClick($e) {
                this.trigger("selectableClicked", $($e.currentTarget));
            },
            _onRendered: function onRendered(type, dataset, suggestions, async) {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetRendered", dataset, suggestions, async);
            },
            _onCleared: function onCleared() {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetCleared");
            },
            _propagate: function propagate() {
                this.trigger.apply(this, arguments);
            },
            _allDatasetsEmpty: function allDatasetsEmpty() {
                return _.every(this.datasets, isDatasetEmpty);

                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _getSelectables: function getSelectables() {
                return this.$node.find(this.selectors.selectable);
            },
            _removeCursor: function _removeCursor() {
                var $selectable = this.getActiveSelectable();
                $selectable && $selectable.removeClass(this.classes.cursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, nodeScrollTop, nodeHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                nodeScrollTop = this.$node.scrollTop();
                nodeHeight = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$node.scrollTop(nodeScrollTop + elTop);
                } else if (nodeHeight < elBottom) {
                    this.$node.scrollTop(nodeScrollTop + (elBottom - nodeHeight));
                }
            },
            bind: function() {
                var that = this,
                    onSelectableClick;
                onSelectableClick = _.bind(this._onSelectableClick, this);
                this.$node.on("click.tt", this.selectors.selectable, onSelectableClick);
                _.each(this.datasets, function(dataset) {
                    dataset.onSync("asyncRequested", that._propagate, that).onSync("asyncCanceled", that._propagate, that).onSync("asyncReceived", that._propagate, that).onSync("rendered", that._onRendered, that).onSync("cleared", that._onCleared, that);
                });
                return this;
            },
            isOpen: function isOpen() {
                return this.$node.hasClass(this.classes.open);
            },
            open: function open() {
                this.$node.addClass(this.classes.open);
            },
            close: function close() {
                this.$node.removeClass(this.classes.open);
                this._removeCursor();
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.attr("dir", dir);
            },
            selectableRelativeToCursor: function selectableRelativeToCursor(delta) {
                var $selectables, $oldCursor, oldIndex, newIndex;
                $oldCursor = this.getActiveSelectable();
                $selectables = this._getSelectables();
                oldIndex = $oldCursor ? $selectables.index($oldCursor) : -1;
                newIndex = oldIndex + delta;
                newIndex = (newIndex + 1) % ($selectables.length + 1) - 1;
                newIndex = newIndex < -1 ? $selectables.length - 1 : newIndex;
                return newIndex === -1 ? null : $selectables.eq(newIndex);
            },
            setCursor: function setCursor($selectable) {
                this._removeCursor();
                if ($selectable = $selectable && $selectable.first()) {
                    $selectable.addClass(this.classes.cursor);
                    this._ensureVisible($selectable);
                }
            },
            getSelectableData: function getSelectableData($el) {
                return $el && $el.length ? Dataset.extractData($el) : null;
            },
            getActiveSelectable: function getActiveSelectable() {
                var $selectable = this._getSelectables().filter(this.selectors.cursor).first();
                return $selectable.length ? $selectable : null;
            },
            getTopSelectable: function getTopSelectable() {
                var $selectable = this._getSelectables().first();
                return $selectable.length ? $selectable : null;
            },
            update: function update(query) {
                var isValidUpdate = query !== this.query;
                if (isValidUpdate) {
                    this.query = query;
                    _.each(this.datasets, updateDataset);
                }
                return isValidUpdate;

                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.query = null;
                this.$node.addClass(this.classes.empty);

                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            destroy: function destroy() {
                this.$node.off(".tt");
                this.$node = $("<div>");
                _.each(this.datasets, destroyDataset);

                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Menu;
    }();
    var DefaultMenu = function() {
        "use strict";
        var s = Menu.prototype;

        function DefaultMenu() {
            Menu.apply(this, [].slice.call(arguments, 0));
        }
        _.mixin(DefaultMenu.prototype, Menu.prototype, {
            open: function open() {
                !this._allDatasetsEmpty() && this._show();
                return s.open.apply(this, [].slice.call(arguments, 0));
            },
            close: function close() {
                this._hide();
                return s.close.apply(this, [].slice.call(arguments, 0));
            },
            _onRendered: function onRendered() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onRendered.apply(this, [].slice.call(arguments, 0));
            },
            _onCleared: function onCleared() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onCleared.apply(this, [].slice.call(arguments, 0));
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
                return s.setLanguageDirection.apply(this, [].slice.call(arguments, 0));
            },
            _hide: function hide() {
                this.$node.hide();
            },
            _show: function show() {
                this.$node.css("display", "block");
            }
        });
        return DefaultMenu;
    }();
    var Typeahead = function() {
        "use strict";

        function Typeahead(o, www) {
            var onFocused, onBlurred, onEnterKeyed, onTabKeyed, onEscKeyed, onUpKeyed, onDownKeyed, onLeftKeyed, onRightKeyed, onQueryChanged, onWhitespaceChanged;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            if (!o.menu) {
                $.error("missing menu");
            }
            if (!o.eventBus) {
                $.error("missing event bus");
            }
            www.mixin(this);
            this.eventBus = o.eventBus;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.input = o.input;
            this.menu = o.menu;
            this.enabled = true;
            this.active = false;
            this.input.hasFocus() && this.activate();
            this.dir = this.input.getLangDir();
            this._hacks();
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this);
            onFocused = c(this, "activate", "open", "_onFocused");
            onBlurred = c(this, "deactivate", "_onBlurred");
            onEnterKeyed = c(this, "isActive", "isOpen", "_onEnterKeyed");
            onTabKeyed = c(this, "isActive", "isOpen", "_onTabKeyed");
            onEscKeyed = c(this, "isActive", "_onEscKeyed");
            onUpKeyed = c(this, "isActive", "open", "_onUpKeyed");
            onDownKeyed = c(this, "isActive", "open", "_onDownKeyed");
            onLeftKeyed = c(this, "isActive", "isOpen", "_onLeftKeyed");
            onRightKeyed = c(this, "isActive", "isOpen", "_onRightKeyed");
            onQueryChanged = c(this, "_openIfActive", "_onQueryChanged");
            onWhitespaceChanged = c(this, "_openIfActive", "_onWhitespaceChanged");
            this.input.bind().onSync("focused", onFocused, this).onSync("blurred", onBlurred, this).onSync("enterKeyed", onEnterKeyed, this).onSync("tabKeyed", onTabKeyed, this).onSync("escKeyed", onEscKeyed, this).onSync("upKeyed", onUpKeyed, this).onSync("downKeyed", onDownKeyed, this).onSync("leftKeyed", onLeftKeyed, this).onSync("rightKeyed", onRightKeyed, this).onSync("queryChanged", onQueryChanged, this).onSync("whitespaceChanged", onWhitespaceChanged, this).onSync("langDirChanged", this._onLangDirChanged, this);
        }
        _.mixin(Typeahead.prototype, {
            _hacks: function hacks() {
                var $input, $menu;
                $input = this.input.$input || $("<div>");
                $menu = this.menu.$node || $("<div>");
                $input.on("blur.tt", function($e) {
                    var active, isActive, hasActive;
                    active = document.activeElement;
                    isActive = $menu.is(active);
                    hasActive = $menu.has(active).length > 0;
                    if (_.isMsie() && (isActive || hasActive)) {
                        $e.preventDefault();
                        $e.stopImmediatePropagation();
                        _.defer(function() {
                            $input.focus();
                        });
                    }
                });
                $menu.on("mousedown.tt", function($e) {
                    $e.preventDefault();
                });
            },
            _onSelectableClicked: function onSelectableClicked(type, $el) {
                this.select($el);
            },
            _onDatasetCleared: function onDatasetCleared() {
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered(type, dataset, suggestions, async) {
                this._updateHint();
                this.eventBus.trigger("render", suggestions, async, dataset);
            },
            _onAsyncRequested: function onAsyncRequested(type, dataset, query) {
                this.eventBus.trigger("asyncrequest", query, dataset);
            },
            _onAsyncCanceled: function onAsyncCanceled(type, dataset, query) {
                this.eventBus.trigger("asynccancel", query, dataset);
            },
            _onAsyncReceived: function onAsyncReceived(type, dataset, query) {
                this.eventBus.trigger("asyncreceive", query, dataset);
            },
            _onFocused: function onFocused() {
                this._minLengthMet() && this.menu.update(this.input.getQuery());
            },
            _onBlurred: function onBlurred() {
                if (this.input.hasQueryChangedSinceLastFocus()) {
                    this.eventBus.trigger("change", this.input.getQuery());
                }
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                } else if ($selectable = this.menu.getTopSelectable()) {
                    this.autocomplete($selectable) && $e.preventDefault();
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.close();
            },
            _onUpKeyed: function onUpKeyed() {
                this.moveCursor(-1);
            },
            _onDownKeyed: function onDownKeyed() {
                this.moveCursor(+1);
            },
            _onLeftKeyed: function onLeftKeyed() {
                if (this.dir === "rtl" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onRightKeyed: function onRightKeyed() {
                if (this.dir === "ltr" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this._minLengthMet(query) ? this.menu.update(query) : this.menu.empty();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
            },
            _onLangDirChanged: function onLangDirChanged(e, dir) {
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.menu.setLanguageDirection(dir);
                }
            },
            _openIfActive: function openIfActive() {
                this.isActive() && this.open();
            },
            _minLengthMet: function minLengthMet(query) {
                query = _.isString(query) ? query : this.input.getQuery() || "";
                return query.length >= this.minLength;
            },
            _updateHint: function updateHint() {
                var $selectable, data, val, query, escapedQuery, frontMatchRegEx, match;
                $selectable = this.menu.getTopSelectable();
                data = this.menu.getSelectableData($selectable);
                val = this.input.getInputValue();
                if (data && !_.isBlankString(val) && !this.input.hasOverflow()) {
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(data.val);
                    match && this.input.setHint(val + match[1]);
                } else {
                    this.input.clearHint();
                }
            },
            isEnabled: function isEnabled() {
                return this.enabled;
            },
            enable: function enable() {
                this.enabled = true;
            },
            disable: function disable() {
                this.enabled = false;
            },
            isActive: function isActive() {
                return this.active;
            },
            activate: function activate() {
                if (this.isActive()) {
                    return true;
                } else if (!this.isEnabled() || this.eventBus.before("active")) {
                    return false;
                } else {
                    this.active = true;
                    this.eventBus.trigger("active");
                    return true;
                }
            },
            deactivate: function deactivate() {
                if (!this.isActive()) {
                    return true;
                } else if (this.eventBus.before("idle")) {
                    return false;
                } else {
                    this.active = false;
                    this.close();
                    this.eventBus.trigger("idle");
                    return true;
                }
            },
            isOpen: function isOpen() {
                return this.menu.isOpen();
            },
            open: function open() {
                if (!this.isOpen() && !this.eventBus.before("open")) {
                    this.menu.open();
                    this._updateHint();
                    this.eventBus.trigger("open");
                }
                return this.isOpen();
            },
            close: function close() {
                if (this.isOpen() && !this.eventBus.before("close")) {
                    this.menu.close();
                    this.input.clearHint();
                    this.input.resetInputValue();
                    this.eventBus.trigger("close");
                }
                return !this.isOpen();
            },
            setVal: function setVal(val) {
                this.input.setQuery(_.toStr(val));
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            select: function select($selectable) {
                var data = this.menu.getSelectableData($selectable);
                if (data && !this.eventBus.before("select", data.obj)) {
                    this.input.setQuery(data.val, true);
                    this.eventBus.trigger("select", data.obj);
                    this.close();
                    return true;
                }
                return false;
            },
            autocomplete: function autocomplete($selectable) {
                var query, data, isValid;
                query = this.input.getQuery();
                data = this.menu.getSelectableData($selectable);
                isValid = data && query !== data.val;
                if (isValid && !this.eventBus.before("autocomplete", data.obj)) {
                    this.input.setQuery(data.val);
                    this.eventBus.trigger("autocomplete", data.obj);
                    return true;
                }
                return false;
            },
            moveCursor: function moveCursor(delta) {
                var query, $candidate, data, payload, cancelMove;
                query = this.input.getQuery();
                $candidate = this.menu.selectableRelativeToCursor(delta);
                data = this.menu.getSelectableData($candidate);
                payload = data ? data.obj : null;
                cancelMove = this._minLengthMet() && this.menu.update(query);
                if (!cancelMove && !this.eventBus.before("cursorchange", payload)) {
                    this.menu.setCursor($candidate);
                    if (data) {
                        this.input.setInputValue(data.val);
                    } else {
                        this.input.resetInputValue();
                        this._updateHint();
                    }
                    this.eventBus.trigger("cursorchange", payload);
                    return true;
                }
                return false;
            },
            destroy: function destroy() {
                this.input.destroy();
                this.menu.destroy();
            }
        });
        return Typeahead;

        function c(ctx) {
            var methods = [].slice.call(arguments, 1);
            return function() {
                var args = [].slice.call(arguments);
                _.each(methods, function(method) {
                    return ctx[method].apply(ctx, args);
                });
            };
        }
    }();
    (function() {
        "use strict";
        var old, keys, methods;
        old = $.fn.typeahead;
        keys = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        };
        methods = {
            initialize: function initialize(o, datasets) {
                var www;
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                www = WWW(o.classNames);
                return this.each(attach);

                function attach() {
                    var $input, $wrapper, $hint, $menu, defaultHint, defaultMenu, eventBus, input, menu, typeahead, MenuConstructor;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    $input = $(this);
                    $wrapper = $(www.html.wrapper);
                    $hint = $elOrNull(o.hint);
                    $menu = $elOrNull(o.menu);
                    defaultHint = o.hint !== false && !$hint;
                    defaultMenu = o.menu !== false && !$menu;
                    defaultHint && ($hint = buildHintFromInput($input, www));
                    defaultMenu && ($menu = $(www.html.menu).css(www.css.menu));
                    $hint && $hint.val("");
                    $input = prepInput($input, www);
                    if (defaultHint || defaultMenu) {
                        $wrapper.css(www.css.wrapper);
                        $input.css(defaultHint ? www.css.input : www.css.inputWithNoHint);
                        $input.wrap($wrapper).parent().prepend(defaultHint ? $hint : null).append(defaultMenu ? $menu : null);
                    }
                    MenuConstructor = defaultMenu ? DefaultMenu : Menu;
                    eventBus = new EventBus({
                        el: $input
                    });
                    input = new Input({
                        hint: $hint,
                        input: $input
                    }, www);
                    menu = new MenuConstructor({
                        node: $menu,
                        datasets: datasets
                    }, www);
                    typeahead = new Typeahead({
                        input: input,
                        menu: menu,
                        eventBus: eventBus,
                        minLength: o.minLength
                    }, www);
                    $input.data(keys.www, www);
                    $input.data(keys.typeahead, typeahead);
                }
            },
            isEnabled: function isEnabled() {
                var enabled;
                ttEach(this.first(), function(t) {
                    enabled = t.isEnabled();
                });
                return enabled;
            },
            enable: function enable() {
                ttEach(this, function(t) {
                    t.enable();
                });
                return this;
            },
            disable: function disable() {
                ttEach(this, function(t) {
                    t.disable();
                });
                return this;
            },
            isActive: function isActive() {
                var active;
                ttEach(this.first(), function(t) {
                    active = t.isActive();
                });
                return active;
            },
            activate: function activate() {
                ttEach(this, function(t) {
                    t.activate();
                });
                return this;
            },
            deactivate: function deactivate() {
                ttEach(this, function(t) {
                    t.deactivate();
                });
                return this;
            },
            isOpen: function isOpen() {
                var open;
                ttEach(this.first(), function(t) {
                    open = t.isOpen();
                });
                return open;
            },
            open: function open() {
                ttEach(this, function(t) {
                    t.open();
                });
                return this;
            },
            close: function close() {
                ttEach(this, function(t) {
                    t.close();
                });
                return this;
            },
            select: function select(el) {
                var success = false,
                    $el = $(el);
                ttEach(this.first(), function(t) {
                    success = t.select($el);
                });
                return success;
            },
            autocomplete: function autocomplete(el) {
                var success = false,
                    $el = $(el);
                ttEach(this.first(), function(t) {
                    success = t.autocomplete($el);
                });
                return success;
            },
            moveCursor: function moveCursoe(delta) {
                var success = false;
                ttEach(this.first(), function(t) {
                    success = t.moveCursor(delta);
                });
                return success;
            },
            val: function val(newVal) {
                var query;
                if (!arguments.length) {
                    ttEach(this.first(), function(t) {
                        query = t.getVal();
                    });
                    return query;
                } else {
                    ttEach(this, function(t) {
                        t.setVal(newVal);
                    });
                    return this;
                }
            },
            destroy: function destroy() {
                ttEach(this, function(typeahead, $input) {
                    revert($input);
                    typeahead.destroy();
                });
                return this;
            }
        };
        $.fn.typeahead = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };

        function ttEach($els, fn) {
            $els.each(function() {
                var $input = $(this),
                    typeahead;
                (typeahead = $input.data(keys.typeahead)) && fn(typeahead, $input);
            });
        }

        function buildHintFromInput($input, www) {
            return $input.clone().addClass(www.classes.hint).removeData().css(www.css.hint).css(getBackgroundStyles($input)).prop("readonly", true).removeAttr("id name placeholder required").attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
        }

        function prepInput($input, www) {
            $input.data(keys.attrs, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass(www.classes.input).attr({
                autocomplete: "off",
                spellcheck: false
            });
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input;
        }

        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }

        function revert($input) {
            var www, $wrapper;
            www = $input.data(keys.www);
            $wrapper = $input.parent().filter(www.selectors.wrapper);
            _.each($input.data(keys.attrs), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.removeData(keys.typeahead).removeData(keys.www).removeData(keys.attr).removeClass(www.classes.input);
            if ($wrapper.length) {
                $input.detach().insertAfter($wrapper);
                $wrapper.remove();
            }
        }

        function $elOrNull(obj) {
            var isValid, $el;
            isValid = _.isJQuery(obj) || _.isElement(obj);
            $el = isValid ? $(obj).first() : [];
            return $el.length ? $el : null;
        }
    })();
});

function s7jsonResponse(data, id) {

    var compID = id.split("|");
    var width = compID[1];
    var height = compID[2];

    if (!width) width = "1440";
    if (!height) height = "450";

    var s7DomainSelector = compID[0].replace("smartCropScript_", "#");
    var selector = compID[0].replace("smartCropScript_", "#") + " img";

    var $s7DomainSelector = $(s7DomainSelector);
    var $imgSelector = $(selector);

    var resultsData = data;
    var scene7Domain = $s7DomainSelector.data("scene7Domain");
    //  var scene7Url = "https://s7ap1.scene7.com";
    var isImage = "is/image/";
    var s7AssetPath = scene7Domain + isImage + data.set.n; //https://s7ap1.scene7.com/is/image/rmitstage/news_JeddaCosta_awards
    var smartCrops = resultsData.set.relation;
    var imgClass = $imgSelector.attr('class');

    if (smartCrops != null) {

        for (var i = 0; i < smartCrops.length; i++) {



            if (smartCrops[i].userdata.SmartCropType == "Banner" && smartCrops[i].userdata.SmartCropDef == "Large") {

                var largeCroppedImage = s7AssetPath + ':Large';

                var newLargeImageHtml = '<source class="largeImage" media="(min-width: 769px)" srcset="' + largeCroppedImage + '">';


                $imgSelector.before(newLargeImageHtml);

            }

            if (smartCrops[i].userdata.SmartCropType == "Banner" && smartCrops[i].userdata.SmartCropDef == "Small") {

                var smallCroppedImage = s7AssetPath + ':Small';

                var newSmallImageHtml = '<source class="smallImage" media="(min-width: 320px)" srcset="' + smallCroppedImage + '">';


                $imgSelector.before(newSmallImageHtml);


            }

        }
    } else {
        s7AssetPath = s7AssetPath + '?wid=' + width + '&hei=' + height + '&scl=1';
        imgClass = imgClass + " scene7Image";
        $imgSelector.attr({
            src: s7AssetPath,
            class: imgClass
        });
    }

}


function getSmartCropData(url, ele) {


    var element = ele;

    var id = "smartCropScript_" + element;


    var imageDataUrl = url + '?req=set,json&id=' + id + '&callback=?';
    $.ajax({
        type: 'GET',
        url: imageDataUrl,

        dataType: "jsonp"


    });


}

// to recognizing the keyboard click event
function isKeyPress(e) {
    return e.screenX == 0 && e.screenY == 0
}


//Use this function to persist the input value for all search input components
function getUrlParameterValue(sParam) {
    var sPageURL = window.location.search.substring(1);
    var specialCharacters = /[.*&?^${}()+|[\]\\]/g;
    var sURLVariables;
    if (sPageURL.indexOf(';', 0) > 0 || sPageURL.indexOf('&', 0) > 0) {

        if (sPageURL.indexOf(';', 0) > 0) {
            sURLVariables = sPageURL.split(';');
        } else {
            sURLVariables = sPageURL.split('&');
        }

        var sParameterName;

        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1].replace(specialCharacters, " ").replace(/\s\s+/g, " "));
            }
        }

    } else if (sPageURL.indexOf('=', 0) > 0 && sPageURL.indexOf('q=', 0) == 0) {
        sURLVariables = sPageURL.split('=');
        return decodeURIComponent(sURLVariables[1].replace(specialCharacters, " ").replace(/\s\s+/g, " "));
    } else {
        sURLVariables = '';
        return sURLVariables;
    }
}

function updateSaveAndCompareDigitalData() {
    var savedCourse = localStorage.getItem("savedcourses");
    if (savedCourse) {
        var courseLen = JSON.parse(savedCourse);
        let digiData = window.digitalData;
        if (courseLen.length > 0 && (digiData && digiData.page && digiData.page.pageInfo)) {
            var courseArray = [];
            var onlineCourseArray = [];
            for (var i = 0; i < courseLen.length; i++) {
                if (courseLen[i].coursePath && courseLen[i].coursePath.includes('/online')) {
                    onlineCourseArray.push(courseLen[i].courseName);
                    digiData.page.pageInfo.attributes.savedonlinecoursetitle = onlineCourseArray.join("|");
                } else {
                    courseArray.push(courseLen[i].courseId);
                    digiData.page.pageInfo.attributes.savedcoursecode = courseArray.join("|");
                }
            }
            digiData.page.pageInfo.attributes.savedcoursecount = courseLen.length;
        } else if (digiData && digiData.page && digiData.page.pageInfo) {
            digiData.page.pageInfo.attributes.savedcoursecode = "";
            digiData.page.pageInfo.attributes.savedcoursecount = "";
        }
    }
}

updateSaveAndCompareDigitalData();


// Accessibility keyboard tabbing foucs fix
function trackFocus(wraper, firstEl) {
    var TABBING_CLASS = 'keyboard-tab';
    var MOUSE_CLASS = 'mouse-click';
    var WraperEl = typeof wraper == 'string' ? document.querySelector(wraper) : wraper;
    var BODY = document.body;
    if (firstEl) {
        $(firstEl).keyup(function(e) {
            setTabbingClass(e);
        });
    }

    if (WraperEl) {
        WraperEl.addEventListener('keydown', function(e) {
            setTabbingClass(e);
        });

        WraperEl.addEventListener('mousedown', function() {
            BODY.classList.remove(TABBING_CLASS);
            BODY.classList.add(MOUSE_CLASS);
        });
    }
}

function setTabbingClass(e) {
    var BODY = document.body;
    var TABBING_CLASS = 'keyboard-tab';
    var MOUSE_CLASS = 'mouse-click';
    var TAB_KEY = 9;
    if (e.which === TAB_KEY) {
        BODY.classList.add(TABBING_CLASS);
        BODY.classList.remove(MOUSE_CLASS);
    }
}

// tweaking the focus on mouse click for the icon feature component
if ($('.icon-feature-wrapper').length > 0) {
    Array.prototype.forEach.call($('.icon-feature-wrapper'), child => {
        trackFocus(child, child.querySelector('a'))
    });
}

if ($('.columnfeaturecontent').length > 0) {
    Array.prototype.forEach.call($('.columnfeaturecontent'), child => {
        trackFocus(child, child.querySelector('a'))
    });
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2017 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global jQuery */
(function($) {
    "use strict";

    window.CQ = window.CQ || {};
    window.CQ.CoreComponents = window.CQ.CoreComponents || {};
    window.CQ.CoreComponents.CheckboxTextfieldTuple = window.CQ.CoreComponents.CheckboxTextfieldTuple || {};

    /**
     * Creates a tuple consisting of a checkbox and a text field located in the same dialog.
     *
     * @param {HTMLElement} dialog The dialog where the two elements are found.
     * @param {String} checkboxSelector The selector for the checkbox.
     * @param {String} textfieldSelector The selector for the text field.
     * @param {Boolean} isRichText Defines whether the text field is a rich text editor.
     * @constructor
     */
    var CheckboxTextfieldTuple = window.CQ.CoreComponents.CheckboxTextfieldTuple.v1 = function(dialog, checkboxSelector, textfieldSelector, isRichText) {
        var self = this;
        self.ATTR_PREVIOUS_VALUE = "data-previous-value";
        self.ATTR_SEEDED_VALUE = "data-seeded-value";
        self._dialog = dialog;
        self._checkbox = dialog.querySelector(checkboxSelector);
        self._checkboxSelector = checkboxSelector;
        self._checkboxFoundation = $(self._checkbox).adaptTo("foundation-field");
        self._textfield = dialog.querySelector(textfieldSelector);
        self._textfieldSelector = textfieldSelector;
        self._textfieldFoundation = $(self._textfield).adaptTo("foundation-field");
        self._isRichText = isRichText;
        if (self._isRichText) {
            self._richTextInstance = $(self._textfield).data("rteinstance");
        }
        if (self._checkbox && self._checkboxFoundation) {
            self._checkbox.setAttribute(self.ATTR_PREVIOUS_VALUE, self._checkboxFoundation.getValue());
            self._checkbox.addEventListener("change", function() {
                self.update();
            });
            $(window).adaptTo("foundation-registry").register("foundation.adapters", {
                type: "foundation-toggleable",
                selector: self._checkboxSelector,
                adapter: function() {
                    return {
                        isOpen: function() {
                            return !self._checkboxFoundation.isDisabled();
                        },
                        show: function() {
                            self._checkboxFoundation.setDisabled(false);
                            $(self._checkbox).parent().show();
                            self.update();
                        },
                        hide: function() {
                            self._checkboxFoundation.setDisabled(true);
                            $(self._checkbox).parent().hide();
                            var previousValue = self._textfield.getAttribute(self.ATTR_PREVIOUS_VALUE);
                            if (previousValue !== undefined && previousValue !== null) {
                                self._setTextfieldValue(previousValue);
                            }
                        }
                    };
                }
            });
        }
        if (self._textfield) {
            if (self._isRichText) {
                self._richTextInstance.$element.on("editing-start", function() {
                    self._textfield.setAttribute(self.ATTR_PREVIOUS_VALUE, self._getTextfieldValue());
                });
                self._richTextInstance.$element.on("change", function() {
                    self._textfield.setAttribute(self.ATTR_PREVIOUS_VALUE, self._getTextfieldValue());
                });
            } else {
                self._textfield.setAttribute(self.ATTR_PREVIOUS_VALUE, self._getTextfieldValue());
                self._textfield.addEventListener("change", function() {
                    self._textfield.setAttribute(self.ATTR_PREVIOUS_VALUE, self._getTextfieldValue());
                });
            }
            $(window).adaptTo("foundation-registry").register("foundation.adapters", {
                type: "foundation-toggleable",
                selector: self._textfieldSelector,
                adapter: function() {
                    return {
                        isOpen: function() {
                            return !self._textfieldFoundation.isDisabled();
                        },
                        show: function() {
                            self._disableTextfield(false);
                            $(self._textfield).parent().show();
                        },
                        hide: function() {
                            self._disableTextfield(true);
                            $(self._textfield).parent().hide();
                        }
                    };
                }
            });
        }
    };

    /**
     * Updates the tuple using the following logic:
     *
     * 1. if the checkbox is checked, the value of the text field will be replaced with the value of the
     *     {@link #ATTR_SEEDED_VALUE} data attribute from the text field;
     * 2. if the checkbox is unchecked, the value of the text field will be changed to the value of the {@link #ATTR_PREVIOUS_VALUE} data
     *     attribute on the text field, if this exists
     *
     * The text field will be disabled when the checkbox is checked, or enabled if the checkbox is not checked.
     */
    CheckboxTextfieldTuple.prototype.update = function() {
        if (this._checkboxFoundation && (this._textfieldFoundation || this._isRichText) && this._textfield) {
            if (this._checkboxFoundation.getValue() === "true") {
                var seededValue = this._textfield.getAttribute(this.ATTR_SEEDED_VALUE);
                if (seededValue !== undefined && seededValue !== null && seededValue.trim() !== "") {
                    this._setTextfieldValue(seededValue);
                } else {
                    this._setTextfieldValue("");
                }
                this._disableTextfield(true);
            } else {
                var previousValue = this._textfield.getAttribute(this.ATTR_PREVIOUS_VALUE);
                if (previousValue !== undefined && previousValue !== null && previousValue.trim() !== "") {
                    this._setTextfieldValue(previousValue);
                }
                this._disableTextfield(false);
            }
        }
    };

    /**
     * Seeds a value in the {@link #ATTR_SEEDED_VALUE} data attribute of the textfield. If the value is empty then the data attribute is
     * removed.
     *
     * @param {String} [value] The value to seed.
     */
    CheckboxTextfieldTuple.prototype.seedTextValue = function(value) {
        if (this._textfield) {
            if (value !== undefined && value !== null) {
                this._textfield.setAttribute(this.ATTR_SEEDED_VALUE, value);
            } else {
                this._textfield.removeAttribute(this.ATTR_SEEDED_VALUE);
            }
        }
    };

    /**
     * Resets the tuple: it un-checks the checkbox, removes the seeded value and sets the text field value to the previously known value.
     *
     * @see {@link CheckboxTextfieldTuple#update}
     * @see {@link CheckboxTextfieldTuple#seedTextValue}
     */
    CheckboxTextfieldTuple.prototype.reset = function() {
        if (this._checkboxFoundation && this._textfield && this._textfieldFoundation) {
            this._checkboxFoundation.setValue(false);
            this._textfield.removeAttribute(this.ATTR_SEEDED_VALUE);
            var previousValue = this._textfield.getAttribute(this.ATTR_PREVIOUS_VALUE);
            if (previousValue !== undefined && previousValue !== null) {
                this._setTextfieldValue(previousValue);
            }
            this._disableTextfield(false);
        }
    };

    /**
     * Sets the checkbox to its initial checked state.
     */
    CheckboxTextfieldTuple.prototype.reinitCheckbox = function() {
        if (this._checkbox && this._checkboxFoundation) {
            var previousValue = this._checkbox.getAttribute(this.ATTR_PREVIOUS_VALUE);
            if (previousValue !== undefined && previousValue !== null) {
                this._checkboxFoundation.setValue(previousValue);
                this.update();
            }
        }
    };

    /**
     * Hides the checkbox field, depending on the <code>hide</code> value.
     *
     * @param {Boolean} [hide] When set to <code>true</code> the checkbox will be hidden.
     */
    CheckboxTextfieldTuple.prototype.hideCheckbox = function(hide) {
        var checkbox = $(this._checkboxSelector).adaptTo("foundation-toggleable");
        if (checkbox) {
            if (hide) {
                checkbox.hide();
            } else {
                checkbox.show();
            }
        }
    };

    /**
     * Hides the text field, depending on the <code>hide</code> value.
     *
     * @param {Boolean} [hide] When set to <code>true</code> the text will be hidden.
     */
    CheckboxTextfieldTuple.prototype.hideTextfield = function(hide) {
        var textfield = $(this._textfieldSelector).adaptTo("foundation-toggleable");
        if (textfield) {
            if (hide) {
                textfield.hide();
            } else {
                textfield.show();
            }
        }
    };

    /**
     * Gets the value of the text field, accounting for it being a rich-text
     *
     * @returns {String} The text field value
     * @private
     */
    CheckboxTextfieldTuple.prototype._getTextfieldValue = function() {
        if (this._isRichText) {
            return this._richTextInstance.getContent();
        } else {
            return this._textfield.value;
        }
    };

    /**
     * Sets the value of the text field, accounting for it being a rich-text
     *
     * @param {String} value The value to set
     * @private
     */
    CheckboxTextfieldTuple.prototype._setTextfieldValue = function(value) {
        if (this._isRichText) {
            this._richTextInstance.setContent(value);
        } else {
            this._textfieldFoundation.setValue(value);
        }
    };

    /**
     * Disables the text field, accounting for it being a rich-text
     *
     * @param {Boolean} disabled {@code true} to disable, {@code false} to enable the field
     * @private
     */
    CheckboxTextfieldTuple.prototype._disableTextfield = function(disabled) {
        if (this._isRichText) {
            $(this._textfield).attr("contenteditable", !disabled);
        } else {
            this._textfieldFoundation.setDisabled(disabled);
        }
    };

})(jQuery);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2017 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global jQuery, Coral */
(function($) {
    "use strict";

    var dialogContentSelector = ".cmp-image__editor";
    var CheckboxTextfieldTuple = window.CQ.CoreComponents.CheckboxTextfieldTuple.v1;
    var isDecorative;
    var altTuple;
    var captionTuple;
    var $altGroup;
    var $linkURLGroup;
    var $linkURLField;
    var $cqFileUpload;
    var $cqFileUploadEdit;
    var fileReference;

    $(document).on("dialog-loaded", function(e) {
        var $dialog = e.dialog;
        var $dialogContent = $dialog.find(dialogContentSelector);
        var dialogContent = $dialogContent.length > 0 ? $dialogContent[0] : undefined;
        if (dialogContent) {
            isDecorative = dialogContent.querySelector('coral-checkbox[name="./isDecorative"]');
            altTuple =
                new CheckboxTextfieldTuple(dialogContent, 'coral-checkbox[name="./altValueFromDAM"]', 'input[name="./alt"]');
            $altGroup = $dialogContent.find(".cmp-image__editor-alt");
            $linkURLGroup = $dialogContent.find(".cmp-image__editor-link");
            $linkURLField = $linkURLGroup.find('foundation-autocomplete[name="./linkURL"]');
            captionTuple =
                new CheckboxTextfieldTuple(dialogContent, 'coral-checkbox[name="./titleValueFromDAM"]', 'input[name="./jcr:title"]');
            $cqFileUpload = $dialog.find(".cq-FileUpload");
            $cqFileUploadEdit = $dialog.find(".cq-FileUpload-edit");
            if ($cqFileUpload) {
                $cqFileUpload.on("assetselected", function(f) {
                    fileReference = f.path;
                    retrieveDAMInfo(fileReference).then(
                        function() {
                            if (isDecorative) {
                                altTuple.hideCheckbox(isDecorative.checked);
                            }
                            captionTuple.hideCheckbox(false);
                            altTuple.reinitCheckbox();
                            captionTuple.reinitCheckbox();
                            toggleAlternativeFieldsAndLink(isDecorative);
                        }
                    );
                });
                $cqFileUpload.on("click", "[coral-fileupload-clear]", function() {
                    altTuple.reset();
                    captionTuple.reset();
                });
                $cqFileUpload.on("coral-fileupload:fileadded", function() {
                    if (isDecorative) {
                        altTuple.hideTextfield(isDecorative.checked);
                    }
                    altTuple.hideCheckbox(true);
                    captionTuple.hideTextfield(false);
                    captionTuple.hideCheckbox(true);
                    fileReference = undefined;
                });
            }
            if ($cqFileUploadEdit) {
                fileReference = $cqFileUploadEdit.data("cqFileuploadFilereference");
                if (fileReference === "") {
                    fileReference = undefined;
                }
                if (fileReference) {
                    retrieveDAMInfo(fileReference);
                } else {
                    altTuple.hideCheckbox(true);
                    captionTuple.hideCheckbox(true);
                }
            }
            toggleAlternativeFieldsAndLink(isDecorative);
        }
    });

    $(window).on("focus", function() {
        if (fileReference) {
            retrieveDAMInfo(fileReference);
        }
    });

    $(document).on("dialog-beforeclose", function() {
        $(window).off("focus");
    });

    $(document).on("change", dialogContentSelector + ' coral-checkbox[name="./isDecorative"]', function(e) {
        toggleAlternativeFieldsAndLink(e.target);
    });

    function toggleAlternativeFieldsAndLink(checkbox) {
        if (checkbox) {
            if (checkbox.checked) {
                $linkURLGroup.hide();
                $altGroup.hide();
            } else {
                $altGroup.show();
                $linkURLGroup.show();
            }
            $linkURLField.adaptTo("foundation-field").setDisabled(checkbox.checked);
            altTuple.hideTextfield(checkbox.checked);
            if (fileReference) {
                altTuple.hideCheckbox(checkbox.checked);
            }
        }
    }

    function retrieveDAMInfo(assetPath) {
        return $.ajax({
            url: assetPath + "/_jcr_content/metadata.json"
        }).done(function(data) {
            if (data) {
                if (altTuple) {
                    var altText = data["dc:alttag"];
                    if (altText === undefined || altText.trim() === "") {
                        altText = "Alt Text is not present for this image, Taking dc:title '" + data["dc:title"] + "'";
                    }
                    altTuple.seedTextValue(altText);
                    altTuple.update();
                    toggleAlternativeFieldsAndLink(isDecorative);
                }
                if (captionTuple) {
                    var caption = data["dc:description"];
                    if (caption === undefined || caption.trim() === "") {
                        caption = "Description is not present for this image, Taking dc:title '" + data["dc:title"] + "'";
                    }
                    captionTuple.seedTextValue(caption);
                    captionTuple.update();
                }
            }
        });
    }

})(jQuery);


var url = $('#article-header').data("assetUrl");
var ele = $('#article-header').attr("id");

if (url) {
    getSmartCropData(url, ele);

}
$(window).load(function() {

    $('#article-header').css('height', 'auto');

});

function share_init() {
    $('[data-share-network]').on('click', function(e) {
        e.preventDefault();

        var shareNetwork = this.dataset.shareNetwork,
            shareObject = {
                ptitle: this.dataset.shareTitle,
                psummary: this.dataset.shareSummary,
                purl: this.dataset.shareUrl,
                pimg: this.dataset.shareImage,
                psource: this.dataset.shareSource
            };

        helpFunctions.share[shareNetwork](shareObject);

    });
}



var helpFunctions = (function() {

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift()
        } else {
            return "undefined";
        }
    }

    var share = {
        facebook: function(info) {
            url = 'https://www.facebook.com/sharer/sharer.php?';
            url += info.ptitle ? '&title=' + encodeURIComponent(info.ptitle) : '';
            url += info.psummary ? '&description=' + encodeURIComponent(info.psummary) : '';
            url += info.purl ? '&u=' + encodeURIComponent(info.purl) : '&u=' + location.href;
            url += info.pimg ? '&picture=' + encodeURIComponent(info.pimg) : '';
            share.popup(url);
        },
        twitter: function(info) {
            url = 'http://twitter.com/share?';
            url += info.ptitle ? 'text=' + encodeURIComponent(info.ptitle) : '';
            url += info.purl ? '&url=' + encodeURIComponent(info.purl) : '&url=' + location.href;
            url += info.purl ? '&counturl=' + encodeURIComponent(info.purl) : '&counturl=' + location.href;
            share.popup(url);
        },
        linkedin: function(info) {
            url = 'https://www.linkedin.com/shareArticle?mini=true';
            url += info.purl ? '&url=' + encodeURIComponent(info.purl) : '&url=' + location.href;
            url += info.ptitle ? '&title=' + encodeURIComponent(info.ptitle) : '';
            url += info.psummary ? '&summary=' + encodeURIComponent(info.psummary) : '';
            url += info.psource ? '&source=' + encodeURIComponent(info.psource) : '';
            share.popup(url);
        },
        popup: function(url) {
            window.open(url, 'Hello', 'toolbar=0,status=0,width=626,height=436');
        }
    };

    return {
        getCookie: getCookie,
        share: share
    }

})();

document.addEventListener("DOMContentLoaded", share_init);

$(document).ready(function() {

    var url = "";

    function loadMore(id) {

        var limitFrom = parseInt($("#" + id).attr('data-limit'));
        if ($("#" + id + " .grid-list-wrapper").attr("data-path") != "") {
            url = $("#" + id + " .grid-list-wrapper").attr("data-path") + ".model.json?limit=" + limitFrom;

        }

        $.ajax({

            type: "GET",

            dataType: 'json',

            async: true,

            url: url,

            success: function(data) {

                if (data !== undefined) {
                    var findnoimg = '';

                    if ($('#' + id).closest('.generic-gridlist').hasClass('no-img')) {
                        findnoimg = 'noimg';
                    }

                    renderTiles(data, id, findnoimg);

                    var curlimit = $('#' + id).attr('data-limit');
                    curlimit = parseInt(curlimit) + 1;
                    $('#' + id).attr('data-limit', curlimit);

                }
            },

            error: function(textStatus, errorThrown) {
                console.error('ERROR FROM FILE');
            }

        });



    }

    $(".load-more").on("click", function() {
        var id = $(this).closest('.component').attr("id");
        loadMore(id);

    });

    $(".load-more").keydown(function(e) {
        if (e.keyCode == 13) {
            var parseid = $(this).closest('.component').attr("id");
            loadMore(parseid);
        }
    });

    function renderTiles(data, id, findnoimg) {

        var resultsData = data.gridList;

        var tilesCount = resultsData.length;
        var columnClass;
        if ($("#" + id + " .cmp-list__item").hasClass("col-md-3")) {

            columnClass = "col-sm-6 col-md-3";
        } else if ($("#" + id + " .cmp-list__item").hasClass("col-md-4")) {

            columnClass = "col-sm-4 col-md-4";
        } else {
            columnClass = "col-sm-6 col-md-6 two-coloumn";
        }



        for (var i = 0; i < tilesCount; i++) {
            var desc = "";
            desc = '<div class="cmp-list__item col-xs-12 ' + columnClass + '">';

            if (resultsData[i].image != "" && resultsData[i].image != null) {

                desc += '<div class="cmp-list__item-img">';

                desc += '<a href="' + resultsData[i].path + '" data-analytics-type="gridlist" data-analytics-value="' + resultsData[i].title + '" class="h-bar">'

                desc += '<figure class="rollover">';

                desc += '<div class="box-photo">';

                if (resultsData[i].isRemoteAsset === true) {
                    desc += '<picture>';
                    desc += '<source media="(max-width: 381px)" srcset="' + resultsData[i].image + '?wid=380">';
                    desc += '<source media="(max-width: 415px)" srcset="' + resultsData[i].image + '?wid=750">';
                    desc += '<source media="(max-width: 768px)" srcset="' + resultsData[i].image + '?wid=480">';
                    desc += '<source media="(max-width: 1024px)" srcset="' + resultsData[i].image + '?wid=800">';
                    desc += '<img alt="' + resultsData[i].imageAltText + '" src="' + resultsData[i].image + '">';
                    desc += '</picture>';
                } else {
                    desc += '<img alt="' + resultsData[i].imageAltText + '" src="' + resultsData[i].image + '">';
                }

                desc += '</div>';

                desc += '</figure>';

                desc += '</a>';

                desc += '</div>';
            }

            desc += '<div class="cmp-list__item-content btn_Wrap_CTALink">';

            desc += '<a data-analytics-type="gridlist" data-analytics-value="' + resultsData[i].title + '"  href="' + resultsData[i].path + '" class="h-bar cmp-list__item-link btn_Wrap_CTALink"> <h3>' + resultsData[i].title + '</h3>';

            if (url.includes("generic_gridlist") && (resultsData[i].image == "" || resultsData[i].image === null || findnoimg == "noimg")) {
                desc += '<span class="fa fa-angle-right generic-chevron" aria-hidden="true"></span>';
            }

            desc += '</a>';

            if (!url.includes("generic_gridlist")) {
                desc += '<div class="tag-links">' + ((resultsData[i].categoryTagUrl !== null && resultsData[i].categoryTagUrl != "") ? '<a  data-analytics-type="gridlist" data-analytics-value="' + resultsData[i].categoryTag + ':' + resultsData[i].title + '"  href="' + resultsData[i].categoryTagUrl + '">' + resultsData[i].categoryTag + '</a>' : '');
            }

            if (resultsData[i].articleDate != "" && !url.includes("generic_gridlist")) {

                desc += '<div class="news-calendar"> <span class="news-calendaricon"><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-151.000000, -171.000000)" fill="#a9a9a9" fill-rule="nonzero"><g transform="translate(1.000000, -1.000000)"><g><g transform="translate(150.000000, 172.000000)"><path d="M10,10 L10,12 L8,12 L8,10 L6,10 L6,8 L8,8 L10,8 L10,10 Z M2,4 L2,14 L14,14 L14,4 L14,6 L2,6 L2,4 Z M14,2 L16,2 L16,16 L0,16 L0,2 L2,2 L2,0 L4,0 L4,2 L12,2 L12,0 L14,0 L14,2 Z" id="Combined-Shape"></path></g></g></g></g></g></svg></span><span class="date">' + resultsData[i].articleDate + '</span></div>';
                desc += '</div>';

            }


            if (resultsData[i].shortDescription !== null) {
                if ($("#" + id + " p.short-desc-gen").length > 0) {
                    desc += '<p>' + resultsData[i].shortDescription + '</p>';

                }
            }

            desc += '</div>';

            desc += '</div>';

            if (data.hideLoadMore === true) {
                $("#" + id + " .load-more").hide();
            }

            var position = $(window).scrollTop();
            $("#" + id + " .cmp-list").append(desc);
            $(document).scrollTop(position);
        }


        $("#" + id + " .offset-col").remove();
        if (url.includes("generic_gridlist")) {

            if ($("#" + id).closest('.generic-gridlist').hasClass('horizontal')) {
                offsetCell(id);

            }
        }

    }


    function offsetCell(componentId) {
        var threColumn = '<div class="col-xs-12 col-sm-4 col-md-4 cmp-list__item offset-col"></div>';
        var fourColumn = '<div class="col-xs-12 col-sm-3 col-md-3 cmp-list__item offset-col"></div>';
        var fourcolumnOffset = '<div class="col-xs-12 col-sm-3 col-md-3 col-md-offset-3 cmp-list__item offset-col"></div>';
        var item = $("#" + componentId + " .cmp-list__item");
        var threeCoumnlength = $("#" + componentId + '.cmp-list__item.col-md-4').length;
        var fourColumnLength = $("#" + componentId + " .cmp-list__item.col-md-3").length;
        var componentContainer = $("#" + componentId + " .cmp-list");
        var offseColumn = $("#" + componentId + " .offset-col");

        if (item.hasClass("col-md-4")) {
            if ((threeCoumnlength) % 3 == 2) {
                componentContainer.append(threColumn);
            } else if ((threeCoumnlength) % 3 == 0) {
                componentContainer.append(threColumn);
            } else {
                offseColumn.remove();
            }

        }
        if (item.hasClass("col-md-3")) {
            if ((fourColumnLength) % 4 == 2) {
                componentContainer.append(fourcolumnOffset);
            } else if ((fourColumnLength) % 4 == 3) {
                componentContainer.append(fourColumn);
            } else {
                offseColumn.remove();
            }
        }


    }

    if ($('.generic-gridlist ').length > 0) {
        $(".generic-gridlist.horizontal .gridlist__root").each(function() {
            var cId = $(this).attr('id');
            offsetCell(cId);
        });

        $('.generic-gridlist').each(function() {
            if ($(this).hasClass('no-img')) {
                $(this).find('.generic-chevron').css('display', 'block');
            } else {
                $(this).not('.no-img').addClass('no-chevron');
                $(this).find('.generic-chevron').css('display', 'none');
            }
        });
    }

});
$(document).ready(function() {

    //To add class selected for mobile    
    var checkIOSCategoryLinks = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    $(".categoryLinksCollapse").css("display", "none");
    if (checkIOSCategoryLinks) {
        $(".categoryLinksCollapse ul > li").on('touchstart', function() {
            $(this).toggleClass('selected').siblings().removeClass('selected');
        });

        //To toggle icon and show/hide blue border for mobile
        $(".categoryLinksHeader").on('touchstart', function(e) {

            //to stop scrolling to top
            e.preventDefault();

            //to show/hide links
            $(this).parent().next().toggle();

            //to remove selected class
            $(".categoryLinksCollapse ul > li").removeClass('selected');

            if ($(this).parent().find("i").hasClass("fa-angle-up")) {
                // $(this).parent().find("i").removeClass("fa-angle-down categoryIcon").addClass("fa-angle-up categoryIcon");
                $(this).parent().find("i").toggleClass("rotate categoryIcon");

            }

        });
    } else {
        $(".categoryLinksCollapse ul > li").on('click', function() {
            $(this).toggleClass('selected').siblings().removeClass('selected');
        });

        //To toggle icon and show/hide blue border for mobile
        $(".categoryLinksHeader").on('click', function(e) {

            //to stop scrolling to top
            e.preventDefault();

            //to show/hide links
            $(this).parent().next().slideToggle('slow');

            //to remove selected class
            $(".categoryLinksCollapse ul > li").removeClass('selected');

            if ($(this).parent().find("i").hasClass("fa-angle-up")) {
                // $(this).parent().find("i").removeClass("fa-angle-down categoryIcon").addClass("fa-angle-up categoryIcon");
                $(this).parent().find("i").toggleClass("rotate categoryIcon");

            }

        });
    }



});
$(document).ready(function() {

    /*** Skip to content starts ***/
    if ($('#topnav_skipcontent').length == 0 && $('.aem-Grid').find('.primarynav').length > 0) {
        $('.primarynav').append('<div id="topnav_skipcontent"></div>');
    } else if ($('#topnav_skipcontent').length == 0 && $('.aem-Grid').find('.top-nav')) {
        $('.top-nav').append('<div id="topnav_skipcontent"></div>');
    }
    /*** Skip to content ends ***/

    /*** Desktop Starts **/

    //To add class active
    $('.topnav-links ul li').mouseover(function() {
        $(this).addClass('open');
        $(this).find('button').attr('aria-expanded', 'true');
    });



    $('.topnav-searchbox-text').focus(
        function() {
            $('.topnav-searchbox-section').addClass('highlight');
        }).blur(
        function() {
            $('.topnav-searchbox-section').removeClass('highlight');
        });

    //To remove class active
    $('.topnav-links').mouseout(function() {
        $(this).find('li').removeClass('open');
        $(this).find('button').attr('aria-expanded', 'false');
    });

    $('.has-submenu-items *').on("focusout", function() {
        var that = this;
        setTimeout(function() {
            if ($(that).closest('.open').find(":focus").length === 0)
                $(that).closest('.open').removeClass("open")
        }, 10);
    });


    //To show search section
    $('.topnav-search-main').on('click keyup', function(e) {
        var keyCode_search = e.keyCode ? e.keyCode : e.which;

        if (keyCode_search == 1 || keyCode_search == 13 || keyCode_search == 32) {
            e.preventDefault();
            $('.top-nav__search').show();
            $('#topnav-search-close-btn').show();
            $('.topnav-search-main').hide();

            //To read search input values
            setTimeout(function() {
                $('#topnav-search-value').val('').focus();
            }, 100);
        } else if (keyCode_search == 16) {
            e.preventDefault();
            hideSearchSection();
        }
    });

    //To hide search section
    $('.topnav-search-close a').on('click', function(e) {
        e.preventDefault();
        hideSearchSection();
    });

    function hideSearchSection() {
        $('.top-nav__search').hide();
        $('.topnav-search-main').show();
        $('#topnav-search-close-btn').hide();
        $('#topnav-search-value').val('');
        window.scrollTo(0, 0);
    }

    //To navigate to search page
    var topnav_url = "";
    var topnav_query = "";
    var topnav_search_url = "";

    $('.topnav-searchbox-icon').on('click', function(e) {
        e.preventDefault();
        topnav_url = $(this).attr("href");
        topnav_query = $('#topnav-search-value').val();
        $(this).attr('data-analytics-value', topnav_query);
        searchNavigation(topnav_url, topnav_query);
    });

    movefocusOnTab('.topnav-searchbox-icon', ".topnav-search-close-link");

    $('#topnav-search-value').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            topnav_url = $('.topnav-searchbox-icon').attr("href");
            topnav_query = $('#topnav-search-value').val();

            searchNavigation(topnav_url, topnav_query);
        }
    });

    movefocusOnShiftTab('.topnav-search-close-link', ".topnav-searchbox-icon");

    /*** Desktop Ends **/

    /*** Mobile Starts **/

    //To show mobile search section

    $('.topnav-mobi-searchicon').on('click', function() {
        $('.topnav-mobi-subsearch').show();
        $('.topnav-mobi-accordion').hide();
        $('.topnav-mobi-lang').removeClass('active');
        $('.top-nav__accordion').addClass('disable-transparency');

        $('.topnav-mobi-search').hide();
        $('.topnav-mobi-close').show();
        $('.topnav-mobi-bars').show();

        //to empty search text
        $('#topnav-mobi-searchvalue').val('');
        $('html').removeClass('top-nav__overlay mob-nav-enabled');
        showBgContent();
        arrowupdown();
        $('.topnav-mobi-searchtext').focus();
        movefocusOnTab(".topnav-mobi-closeicon", "#topnav-mobi-searchvalue", true, ".topnav-mobi-selectsearchicon");
        movefocusOnShiftTab("#topnav-mobi-searchvalue", "#topnav-mobile-subnav-close-icon");
        movefocusOnTab(".topnav-mobi-selectsearchicon", "#topnav-mobile-subnav-close-icon");
        $("#topnav-mobile-subnav-close-icon").attr("aria-label", "Close RMIT General Search");
    });

    //To hide mobile search section
    $('.topnav-mobi-closeicon').on('click', function() {
        if ($('.topnav-mobi-subsearch:visible').length) {
            $('.topnav-mobi-close').hide();
        }
        $('.topnav-mobi-subsearch').hide();
        $('.topnav-mobi-accordion').removeClass("show-mob-nav").addClass("hide-mob-nav");
        $('.top-nav__accordion').removeClass('disable-transparency');
        showBgContent();
        //removing super parent custom class name after completion of animation
        setTimeout(function() {
            $("html").removeClass("mob-nav-enabled");
            $('.topnav-mobi-accordion').hide();
            $('.topnav-mobi-close').hide();
            $('.topnav-mobi-bars').show();
        }, 500);
        $('.topnav-mobi-search').show();

        //To remove overlay
        $('html').removeClass('top-nav__overlay');
    });

    //To show mobile accordion section
    $('.topnav-mobi-barsicon').on('click', function(e) {
        $('.topnav-mobi-subsearch').hide();
        $('.topnav-mobi-accordion').show().addClass("show-mob-nav").removeClass("hide-mob-nav");
        topNavHideBgContent();
        $("html").addClass("mob-nav-enabled");
        $('.topnav-mobi-sublinkssection').hide();
        $(".topnav-mobi-acclinks").parent().removeClass("active");
        $('.topnav-mobi-lang').removeClass('active');
        $('.top-nav__accordion').removeClass('disable-transparency');

        $('.topnav-mobi-search').show();
        $('.topnav-mobi-bars').hide();
        $('.topnav-mobi-close').show();



        // setting timeout to complete the animation before focus
        setTimeout(function() {
            if (isKeyPress(e))
                $(".topnav-mobi-accordion.show-mob-nav a").first().focus();
        }, 500);

        $(window).scrollTop(0);

        movefocusOnTab(".topnav-mobi-closeicon", ".topnav-mobi-accordion.show-mob-nav a:first", true, ".top-nav__accordion.full-width a:last");
        movefocusOnTab(".top-nav__accordion.full-width a:last", "#topnav-mobile-subnav-close-icon");
        $("#topnav-mobile-subnav-close-icon").attr("aria-label", "close RMIT Main Menu");
    });


    $('.topnav-mobi-lang .mob-default-lang').on('click', function(e) {

        $('.topnav-mobi-subsearch').hide();
        $('.topnav-mobi-accordion').hide();
        $('.topnav-mobi-search').show();
        $('.topnav-mobi-close').hide();
        $('.topnav-mobi-bars').show();

        showBgContent();
        $('html').removeClass('mob-nav-enabled');
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass('active');
            $(".top-nav__accordion").removeClass("disable-transparency");
            $(this).attr("aria-expanded", "false");
        } else {
            $(this).parent().addClass('active');
            $(".top-nav__accordion").addClass("disable-transparency");
            $(this).attr("aria-expanded", "true");
            if (isKeyPress(e))
                $(this).next().find("a:first").focus();
        }
    });

    //To show/hide mobile accordion
    $('.topnav-mobi-acclinks').on('click', function(e) {
        e.preventDefault();

        //To remove active and fa-angle-up class

        //To hide sublinks and toggle
        if ($(this).parent().hasClass("active")) {
            $('.topnav-mobi-sublinkssection').hide();
            $(this).parent().removeClass('active');
            $(".topnav-mobi-sublinkssection").attr("aria-hidden", "true").hide();
            var nextLink = $(this).parent().find("~ .topnav-mobi-acclinkssection").first().find('a');
            $(this).attr("aria-expanded", "false");
            if (isKeyPress(e) && nextLink.length > 0)
                nextLink.focus();
        } else {
            $(".topnav-mobi-acclinks").parent().removeClass("active");
            $(this).parent().addClass('active');
            $(".topnav-mobi-sublinkssection").attr("aria-hidden", "true").hide();
            $(this).parent().next().attr("aria-hidden", "false").show();
            $(this).attr("aria-expanded", "true");
            if (isKeyPress(e))
                $(this).parent().next().find('a').first().focus();
        }
    });

    // Load mobile nav if new grids

    if ($('body').hasClass("mtGridroot")) {
        /* mobinav content */
        var mobiNavContent = $("#mobinav-accsection").clone(true);
        $('.topnav-mobi-accsection').first().before(mobiNavContent);
    } else {
        var primaryNavContent = $("#primary-mobile").clone(true);
        $('.topnav-mobi-accsection').first().before(primaryNavContent);
    }

    //To navigate to search page
    $('.topnav-mobi-selectsearchicon').on('click', function(e) {
        e.preventDefault();
        topnav_url = $(this).attr("href");
        topnav_query = $('#topnav-mobi-searchvalue').val();

        searchNavigation(topnav_url, topnav_query);
    });

    $('#topnav-mobi-searchvalue').on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            topnav_url = $('.topnav-mobi-selectsearchicon').attr("href");
            topnav_query = $('#topnav-mobi-searchvalue').val();

            searchNavigation(topnav_url, topnav_query);
        }
    });

    function arrowupdown() {
        if ($('.topnav-mobi-lang').find("span").hasClass("fa-angle-up")) {
            $('.topnav-mobi-lang').find("span.fa-angle-up").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
    }


    /*** Mobile Ends **/

    /*** Search Navigation Starts ***/
    function searchNavigation(parseURL, parseQuery) {
        topnav_search_url = window.location.protocol + '//' + window.location.hostname + parseURL + '?q=' + topnav_query;
        window.location.href = topnav_search_url;
    }
    /*** Search Navigation Ends ***/
});


var topNavObj = topNav();

function topNav() {
    topNavObj = {};
    topNavObj.nav_height = 0;
    topNavObj.screen_height = 0;
    return topNavObj;
}


function movefocusOnTab(elem, nextElem, checkShiftkey, prevElem) {
    $(elem).on("keydown", function(event) {
        if (checkShiftkey && event.keyCode == 9 && event.shiftKey) {
            event.preventDefault();
            $(prevElem).focus();
        } else if (event.keyCode == 9 && !event.shiftKey) {
            event.preventDefault();
            $(nextElem).focus();
        }
    });
}

function movefocusOnShiftTab(elem, prevElem) {
    $(elem).on("keydown", function(event) {
        if (event.keyCode == 9 && event.shiftKey) {
            event.preventDefault();
            $(prevElem).focus();
        }
    });

}

function topNavHideBgContent() {
    $('.top-nav').parentsUntil("body").addClass("top-nav--parent-wpr");
    $('.top-nav, .top-nav--parent-wpr').siblings().addClass('top-nav--bg-conent');
}

function showBgContent() {
    $(".top-nav--bg-conent").removeClass('top-nav--bg-conent');
}


// this is method to read user details and display name of staff in topnav

if ($(".top-nav").length > 0) {
    callUserService();
    updateCoursesCount();
}


function callUserService() {
    $.ajax({
        url: '/bin/rmit/users/getUserDetails.json',
        dataType: 'json',
        data: {
            time: Date.now()
        },
        success: function(data) {
            // populate local storage with data from request
            //localStorage.student_info = JSON.stringify(data);
            localStorage.setItem("userData", JSON.stringify(data));
            populateUserInformation(data);
            populateDataLayer(data);
            // Debug:
            // console.log('Success');
        },
        error: function() {
            // Debug:
            // console.log('Error');
        }
    });
}


function populateUserInformation(data) {
    var firstName = data.firstName;
    if (firstName && $(".profile-name").length > 0) {
        $('.profile-name').text('Hi ' + firstName);
        $('.profile-name-mob').text('Hi ' + firstName);
    }
}



function populateDataLayer(data) {
    var authStatus,
        knownStatus,
        userId = data.uniId,
        registration = "loggedout",
        userType = "unknown";

    if (data.uniId == undefined) {
        authStatus = 'unauthenticated';
        knownStatus = 'unknown user';
    } else {
        if (data.uniId == 'anonymous') {
            authStatus = 'unauthenticated';
            knownStatus = 'known user';
        } else {
            authStatus = 'authenticated';
            knownStatus = 'known user';
            userType = checkUserType(data.uniId);
            registration = 'loggedin';
        }
    }
    if (typeof digitalData !== "undefined") {
        digitalData.user = {
            userInfo: {
                registration: registration,
                userId: userId,
                userType: userType,
                userAuthStatus: authStatus,
                userKnownStatus: knownStatus
            }
        };
    }
}

function checkUserType(uniId) {
    var Uid = uniId.toLowerCase();
    var Utype;
    if (Uid.charAt(0) == 'e') {
        Utype = 'Staff';
    }
    if (Uid.charAt(0) == 'v') {
        Utype = 'Staff';
    }
    if (Uid.charAt(0) == 's') {
        Utype = 'Students';
    }
    return Utype;
}


var menuItems = document.querySelectorAll('li.has-submenu-items .toggle-dropdown');
Array.prototype.forEach.call(menuItems, function(el, i) {

    el.addEventListener("click", function(event) {
        event.preventDefault();
        if (this.parentElement.parentNode.classList.contains("open")) {
            this.parentElement.parentNode.classList.remove("open");
            this.setAttribute('aria-expanded', "false");
        } else {
            this.parentElement.parentNode.classList.add("open");
            this.setAttribute('aria-expanded', "true");
        }
    });
});


function updateCoursesCount() {
    var coursesStored = localStorage.savedcourses;
    if ($('.compare-link').length > 0) {
        var compareLink = $('.compare-link').attr("data-compare-path");
        var suggestionLink = $('.save-sug-link').attr("suggestion-link");
        if (coursesStored && JSON.parse(coursesStored).length > 0) {
            $('.compare-link .compare-link__count').text(JSON.parse(coursesStored).length).parent().addClass('active').attr('data-analytics-value', JSON.parse(coursesStored).length).attr('href', compareLink);
        } else {
            $('.compare-link .compare-link__count').text("").parent().removeClass('active').attr('data-analytics-value', 0).attr('href', suggestionLink);
        }
    }
}
$(document).ready(function() {
    $('.dropdown-menu-primary').mouseleave(function() {
        $(this).removeClass("active");
        $('.dropdown-inside').hide();
    });
    $('.dropdown-menu-primary').mouseover(function() {

        $(this).children().show();
        $(this).addClass("active");



        var cnt = $(".dropdown-links li:visible").length;
        for (var i = 1; i <= cnt; i++) {
            if (i % 4 == 0) {
                $(".dropdown-links li:visible").eq(i - 1).addClass("rows");

            }

        }

        $(".rows").each(function(e) {
            var prev2 = $(this).prev().outerHeight() || 0;
            var prev1 = $(this).prev().prev().outerHeight() || 0;
            var current = $(this).outerHeight() || 0;
            var rows = [prev1, prev2, current];
            var max = Math.max.apply(Math, rows);
            $(this).height(max);
            $(this).prev().prev().height(max);
            $(this).prev().height(max);


        });


    });
    $('.dropdown-menu-primary > a').on("keydown", function(e) {
        $(this).parent().addClass("active");
    });

    // To hide sub nav on focus out from primary nav
    $('.dropdown-menu-primary').on("focusout", function(e) {
        if ($(this).find(e.relatedTarget).length == 0)
            $('.dropdown-menu-primary').removeClass("active");
    });
});

$(document).ready(function() {
    $(".feature-content__wrapper .lazy,.feature-content__container .lazy").slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        lazyLoad: 'ondemand', // ondemand progressive anticipated
        infinite: true,
        prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style="">Previous<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 51" height="30"><defs><style>.svg-chevron {fill: #d0021b;fill-rule: evenodd; }</style></defs><path id="iconmonstr-angel-left-thin" class="svg-chevron" d="M38,1.6,7.455,25.5,38,49.34,36.685,51,4,25.5,36.706,0Z" transform="translate(-4)"/></i></button>',
        nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">Next<i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 51" height="30"><defs><style>.cls-1 {fill: #d0021b;fill-rule: evenodd;}</style></defs><path id="iconmonstr-angel-right-thin" class="cls-1" d="M4,1.6,34.545,25.5,4,49.34,5.315,51,38,25.5,5.294,0Z" transform="translate(-4)"/></svg></i></button>'
    });

    var msieFeatureContent = false;
    var uaFeatureContent = window.navigator.userAgent;
    var oldieFeatureContent = uaFeatureContent.indexOf('MSIE ');
    var newieFeatureContent = uaFeatureContent.indexOf('Trident/');

    if ((oldieFeatureContent > -1) || (newieFeatureContent > -1)) {
        msieFeatureContent = true;
    }

    if (msieFeatureContent) {
        //IE specific code
        $('.feature-content__wrapper .slick-prev').css('left', '-140px');
        $('.feature-content__wrapper .slick-next').css('right', '-140px');
    }
});
var urlpg = $('#page-header').data("assetUrl");
var elepg = $('#page-header').attr("id");

if (urlpg) {
    getSmartCropData(urlpg, elepg);

}
$(window).load(function() {
    $('#page-header').css('height', 'auto');

});
var urlpgm = $('#page-header-mob').data("assetUrl");
var elepgm = $('#page-header-mob').attr("id");

if (urlpgm) {
    getSmartCropData(urlpgm, elepgm);

}
$(window).load(function() {
    $('#page-header-mob').css('height', 'auto');

});
$(document).ready(function() {

    var featureCarousel = $('.featurecomponentwrapper .featurecomponent')
    featureCarousel.each(function() {
        var columns = $(this).data().columns;
        var slideCount = 2;
        if (columns === "threeCardView") {
            slideCount = 3;
        }
        $(this).AccessibileSlick({
            dots: true,
            infinite: false,
            slidesToShow: slideCount,
            slidesToScroll: slideCount,
            arrows: true,
            prevArrow: '<button class="slick-prev" type="button" aria-lable="Previous slide">' +
                '<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<path d="M8.28904 16L9.70404 14.585L8.28904 13.171L8.01504 12.898L3.11804 8L9.70404 1.414L8.28904 0L0.290039 7.999L0.290039 8.001L8.28904 16Z" fill="#5B5B7F"/>' +
                '</svg>' +
                '<span class="slick-sr-only">Previous</span>' +
                '</button>',
            nextArrow: '<button class="slick-next" type="button" aria-lable="Next slide">' +
                '<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<path d="M1.7148 0L0.299805 1.415L1.7148 2.829L1.9888 3.102L6.8858 8L1.7148 13.172L0.299805 14.586L1.7148 16L9.7138 8.001V7.999L1.7148 0Z" fill="#5B5B7F"/>' +
                '</svg>' +
                '<span class="slick-sr-only">Next</span>' +
                '</button>',
            responsive: [{
                breakpoint: 961,
                settings: {
                    slidesToShow: 1.2,
                    slidesToScroll: 1,
                    arrows: false,
                }
            }, ],
            settings: "unslick"
        });

    });

    function setHeightToPanelBody(id, additionalHeight) {
        var imgMaxHeight = [];
        $("#" + id + " .panel-body").each(function(i) {
            imgMaxHeight.push($(this).outerHeight());
        });

        $("#" + id + " .panel-body").height(Math.max.apply(null, imgMaxHeight) + additionalHeight);
    }

    $(".cardstyle .featurecomponentwrapper .featurecomponent").each(function() {
        setHeightToPanelBody($(this).attr("id"), 40);
    });

    $(".gridstyle .featurecomponentwrapper .featurecomponent").each(function() {
        setHeightToPanelBody($(this).attr("id"), 8);
    });

});
$(document).ready(function() {

    if ($(".columnlinklist__wrapper").hasClass("columnlinklist__twocolumn")) {
        var cnt_second = $(".columnlinklist__content--linkslist li:visible").length;

        for (var a = 1; a <= cnt_second; a++) {
            if (a % 2 == 0) {
                $(".columnlinklist__content--linkslist li:visible").eq(a - 1).addClass("columnlinklist__secondlink");
            }
        }

        $(".columnlinklist__secondlink").each(function(e) {
            var prev1_second, current_second = 0;
            var rows_second = [];
            var max_second = '';

            prev1_second = $(this).prev().innerHeight() - 8 || 0;
            current_second = $(this).innerHeight() - 8 || 0;
            rows_second = [prev1_second, current_second];
            max_second = Math.max.apply(Math, rows_second);
            $(this).height(max_second);
            $(this).prev().height(max_second);
        });
    }

    if ($(".columnlinklist__wrapper").hasClass("columnlinklist__threecolumn")) {
        var cnt_three = $(".columnlinklist__content--linkslist li:visible").length;
        for (var b = 1; b <= cnt_three; b++) {
            if (b % 3 == 0) {
                $(".columnlinklist__content--linkslist li:visible").eq(b - 1).addClass("columnlinklist__thirdlink");
            }
        }

        $(".columnlinklist__thirdlink").each(function(e) {
            var prev1_three, prev2_three, current_three = 0;
            var rows_three = [];
            var max_three = '';

            prev1_three = $(this).prev().prev().innerHeight() - 8 || 0;
            prev2_three = $(this).prev().innerHeight() - 8 || 0;
            current_three = $(this).innerHeight() - 8 || 0;
            rows_three = [prev1_three, prev2_three, current_three];
            max_three = Math.max.apply(Math, rows_three);
            $(this).height(max_three);
            $(this).prev().height(max_three);
            $(this).prev().prev().height(max_three);
        });
    }


});

$(document).ready(function() {
    $(".hero-home__wrapper .lazy").slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        lazyLoad: 'ondemand', // ondemand progressive anticipated
        infinite: true,
        prevArrow: '<button class="hero-hm slick-prev slick-arrow" aria-label="Previous" type="button">Previous<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 51" height="30"><defs><style>.hero-hm-prev {fill: #ffffff;fill-rule: evenodd; }</style></defs><path id="iconmonstr-angel-left-thin" class="hero-hm-prev" d="M38,1.6,7.455,25.5,38,49.34,36.685,51,4,25.5,36.706,0Z" transform="translate(-4)"/></span></button>',
        nextArrow: '<button class="hero-hm slick-next slick-arrow" aria-label="Next" type="button">Next<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 51" height="30"><defs><style>.hero-hm-next {fill: #ffffff;fill-rule: evenodd;}</style></defs><path id="iconmonstr-angel-right-thin" class="hero-hm-next" d="M4,1.6,34.545,25.5,4,49.34,5.315,51,38,25.5,5.294,0Z" transform="translate(-4)"/></svg></span></button>'
    });

    var msIEHero = false;
    var uaHero = window.navigator.userAgent;
    var oldIEHero = uaHero.indexOf('MSIE ');
    var newHero = uaHero.indexOf('Trident/');

    if ((oldIEHero > -1) || (newHero > -1)) {
        msIEHero = true;
    }

    if (msIEHero) {
        $('.hero-home__desk .slick-prev').css({
            'left': '15px',
            'width': 'auto'
        });
        $('.hero-home__desk .slick-prev span').css({
            'width': '90px'
        });
        $('.hero-home__desk .slick-next').css({
            'right': '0',
            'width': '107px'
        });
        $('.hero-home__desk .slick-next span').css({
            'width': '100px'
        });
    }

    $('.hero-home-desk-slider').css({
        'width': '100%',
        'display': 'block'
    });


    var crops = $('.hero__crops');
    $(crops).each(function(i) {
        if ($(this).data("assetUrl") && $(this).attr("id")) {
            var eleID = $(this).attr("id");
            getSmartCropData($(this).data("assetUrl"), eleID);
        }

    });

});

$(document).ready(function() {

    $(".left-nav-wrapper .has-child span.arrow-wraper").on("click", function(evant) {
        $('.left-nav-wrapper .has-child .arrow-wraper a').attr("aria-label", "Expand sub navigation");
        $(this).closest('li').toggleClass('active');
        $('.left-nav-wrapper .has-child').not($(this).closest('li'), $(this)).removeClass("active");
        $('.left-nav-wrapper .has-child.active .arrow-wraper a').attr("aria-label", "Collapse sub navigation");
    });
    /** Mobile Nav Starts **/
    $(".mobinav__content .mobinav-haschild .mobinav__content--acclink").on("click", function(e) {
        $('.mobinav__content .mobinav-haschild').removeClass("selected");
        $('.mobinav__content .mobinav-haschild').not($(this).closest('li')).removeClass("active");
        $(this).closest('li').toggleClass('active');
        if ($(this).closest('li').hasClass('active')) {
            $(this).parent().next().attr("aria-hidden", "false");
            if (isKeyPress(e))
                $(this).parent().next().find('a').first().focus();
            $(this).attr("aria-expanded", "true");
        } else {
            $(this).parent().next().attr("aria-hidden", "true");
            $(this).attr("aria-expanded", "false");
        }
    });

    $(".mobinav__content .mobinav-link").on("click", function() {
        $('.mobinav__content .mobinav-haschild').removeClass("selected");
    });

    $(".mobinav__content .mobinav-haschild .main-link").on("click", function() {
        if ($(this).parent().parent().hasClass("active")) {
            $(this).closest('li').removeClass('selected');
        } else {
            $(this).closest('li').addClass('selected');
        }
    });
    /** Mobile Nav Ends **/

});
$(document).ready(function() {
    var mv_tags = $(".mv-tag__list__link");
    mv_tags.each(function() {
        if ($(this).height() > 30) {
            $(this).addClass("wrp-ln");
        }
    });

});

var urleh = $('#event-header').data("assetUrl");
var eleeh = $('#event-header').attr("id");

if (urleh) {
    getSmartCropData(urleh, eleeh);

}
$(window).load(function() {
    $('#event-header').css('height', 'auto');

});

var urlehm = $('#event-header-mob').data("assetUrl");
var eleehm = $('#event-header-mob').attr("id");

if (urlehm) {
    getSmartCropData(urlehm, eleehm);

}
$(window).load(function() {
    $('#event-header-mob').css('height', 'auto');

});
$(document).ready(function() {

    var events_url = "";

    function eventsLoadMore(id) {
        var eventsLimitFrom = parseInt($("#" + id).attr('data-limit'));

        if ($("#" + id + " .events-gridlist__wrapper").attr("data-path") != "") {
            events_url = $("#" + id + " .events-gridlist__wrapper").attr("data-path") + ".model.json?eventlimit=" + eventsLimitFrom;
        }

        $.ajax({
            type: "GET",
            dataType: 'json',
            async: true,
            url: events_url,
            success: function(data) {
                if (data !== undefined) {
                    console.log(data);
                    eventsRenderTiles(data, id);
                    var eventsCurlimit = $('#' + id).attr('data-limit');
                    eventsCurlimit = parseInt(eventsCurlimit) + 1;
                    $('#' + id).attr('data-limit', eventsCurlimit);
                }
            },
            error: function(textStatus, errorThrown) {
                console.error('File Error');
            }
        });
    }

    $(".events-loadmore").on("click", function() {
        var events_id = $(this).closest('.events-gridlist__container').attr("id");
        eventsLoadMore(events_id);

    });

    $(".events-loadmore").keydown(function(e) {
        if (e.keyCode == 13) {
            var events_parseid = $(this).closest('.events-gridlist__container').attr("id");
            eventsLoadMore(events_parseid);
        }
    });

    function eventsRenderTiles(data, id) {

        var eventsResultsData = data.eventGridList;
        var eventsTilesCount = eventsResultsData.length;
        var eventsColumn;

        if ($("#" + id + " .events-gridcmp__item").hasClass("col-md-3")) {
            eventsColumn = 4;
        } else if ($("#" + id + " .events-gridcmp__item").hasClass("col-md-4")) {
            eventsColumn = 3;
        } else {
            eventsColumn = 2;
        }

        for (var i = 0; i < eventsTilesCount; i++) {
            var eventsDesc = "";

            if (eventsColumn == 4) {
                eventsDesc = '<div class="col-xs-12 col-sm-6 col-md-3 four-coloumn events-gridcmp__item">';
            } else if (eventsColumn == 3) {
                eventsDesc = '<div class="col-xs-12 col-sm-6 col-md-4 three-coloumn events-gridcmp__item">';
            } else {
                eventsDesc = '<div class="col-xs-12 col-sm-6 col-md-6 two-coloumn events-gridcmp__item">';
            }

            eventsDesc += '<div class="events-gridcmp__item-img">';

            eventsDesc += '<a href="' + eventsResultsData[i].eventPath + '">';

            eventsDesc += '<figure class="events-photo rollover">';

            eventsDesc += '<img alt="' + eventsResultsData[i].eventImageAltText + '" src="' + eventsResultsData[i].eventImage + '">';

            eventsDesc += '</figure>';

            eventsDesc += '</a>';

            eventsDesc += '</div>';

            eventsDesc += '<div class="events-gridcmp__item-content">';

            eventsDesc += '<a href="' + eventsResultsData[i].eventPath + '" class="events-title"><h4>' + eventsResultsData[i].eventTitle + '</h4></a>';

            eventsDesc += '<div class="events-tagcloud">' + ((data.isHideEventTag === false && eventsResultsData[i].eventTag !== null && eventsResultsData[i].eventTag != "") ? '<span class="events-tags">' + eventsResultsData[i].eventTag + '</span>' : '') + '</div>';

            if (eventsResultsData[i].date != "") {
                eventsDesc += '<div class="events-calendar">';

                eventsDesc += '<span class="events-calendaricon"><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --><title>Icon / Small / Calendar</title><desc>Created with Sketch.</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-151.000000, -171.000000)" fill="#a9a9a9" fill-rule="nonzero"><g transform="translate(1.000000, -1.000000)"><g><g transform="translate(150.000000, 172.000000)"><path d="M10,10 L10,12 L8,12 L8,10 L6,10 L6,8 L8,8 L10,8 L10,10 Z M2,4 L2,14 L14,14 L14,4 L14,6 L2,6 L2,4 Z M14,2 L16,2 L16,16 L0,16 L0,2 L2,2 L2,0 L4,0 L4,2 L12,2 L12,0 L14,0 L14,2 Z" id="Combined-Shape"></path></g></g></g></g></g></svg></span>';

                eventsDesc += '<span class="events-calendardate">' + eventsResultsData[i].date + '</span></div>';
            }

            if (eventsResultsData[i].locationTag != "") {

                eventsDesc += '<div class="events-location">';

                eventsDesc += '<span data-sly-test="${item.locationTag}" class="events-locationicon"><svg width="12px" height="16px" viewBox="0 0 12 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --><title>Icon / Small / Location</title><desc>Created with Sketch.</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-153.000000, -255.000000)" fill="#a9a9a9" fill-rule="nonzero"><g transform="translate(1.000000, -1.000000)"><g><g id="Icon-/-Small-/-Location" transform="translate(150.000000, 256.000000)"><path d="M7.605,3.55271368e-14 C10.701,3.55271368e-14 13.21,2.509 13.21,5.605 C13.21,8.701 10.701,11.21 7.605,11.21 C4.51,11.21 2,8.701 2,5.605 C2,2.509 4.51,3.55271368e-14 7.605,3.55271368e-14 Z M7.605,2 C5.617,2 4,3.617 4,5.605 C4,7.593 5.617,9.21 7.605,9.21 C9.593,9.21 11.21,7.593 11.21,5.605 C11.21,3.617 9.593,2 7.605,2 Z M7.605,12.6929 L10.855,15.9429 L4.355,15.9429 L7.605,12.6929 Z" id="Combined-Shape"></path></g></g></g></g></g></svg></span>';

                eventsDesc += '<span class="events-locationplace">' + eventsResultsData[i].locationTag + '</span></div>';
            }

            if (data.isShortDescription === false && eventsResultsData[i].eventShortDescription != "") {
                eventsDesc += '<p class="events-desc">' + eventsResultsData[i].eventShortDescription + '</p>';
            }

            eventsDesc += '</div>';

            eventsDesc += '</div>';

            if (data.eventHideLoadMore === true) {
                $("#" + id + " .events-loadmore").hide();
            }

            $("#" + id + " .events-gridcmp").append(eventsDesc);

        }

    }

});
if ($(".chatBtn").length > 0) {

    $('.chatBtn').click(function(e) {
        e.preventDefault();

        var userData = JSON.parse(localStorage.getItem("userData"));
        var firstName = '';
        var lastName = '';
        var uniId = '';

        if (userData !== null) {
            firstName = userData.firstName ? userData.firstName : '';
            lastName = userData.lastName ? userData.lastName : '';
            uniId = userData.uniId ? userData.uniId : '';
        }


        CXBus.command('WebChat.open', {
            formJSON: {
                inputs: [
                    // Default fields
                    {
                        id: 'cx_webchat_form_firstname',
                        name: 'firstname',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'First Name',
                        value: firstName
                    },
                    {
                        id: 'cx_webchat_form_lastname',
                        name: 'lastname',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'Last Name',
                        value: lastName
                    },
                    {
                        id: 'cx_webchat_form_employee_no',
                        name: 'employeeno',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'Employee No',
                        value: uniId
                    },
                    {
                        id: 'cx_webchat_form_email',
                        name: 'email',
                        wrapper: '<div><br>{label}<br>{input}<br></div>',
                        maxlength: '100',
                        placeholder: 'Optional',
                        label: 'Email'
                    }
                ]
            }
        });

    });
}
$(document).ready(function() {

    accordianExpandCollapse();
    expandCollapseAll();

})

function expandCollapseAll() {
    $('.accordion-main-header .expand-collapse').click(function(e) {
        var self = $(this);
        if (self.hasClass('active')) {
            self.removeClass('active');
            self.find('.tags').text('Expand all sections');
            self.closest('.accordion-wrapper-cp').find('.accordion-default').each(function(index, element) {
                $(this).find('a[data-toggle="collapse"]').removeClass('active');
                $(this).find('.accordion-collapse').collapse('hide');

            });
        } else {
            self.addClass('active');
            self.find('.tags').text('Collapse all sections');
            self.closest('.accordion-wrapper-cp').find('.accordion-default').each(function(index, element) {
                $(this).find('a[data-toggle="collapse"]').addClass('active');
                $(this).find('.accordion-collapse').collapse('show');

            });

        }
    });

}

function accordianExpandCollapse() {
    $('.accordion a[data-toggle="collapse"]').click(function(e) {
        var panelBody = $(this).parent().next();
        if ($(this).hasClass('active')) {
            $(this).attr("aria-expanded", "false");
            $(this).removeClass('active');
            panelBody.collapse('hide');

        } else {
            $(this).attr("aria-expanded", "true");
            $(this).addClass('active');
            panelBody.collapse('show');
        }

    });
}

/*** Fullwidth Banner Starts ***/
var urlfw = $('#fullwidth-banner').data("assetUrl");
var elefw = $('#fullwidth-banner').attr("id");

if (urlfw) {
    getSmartCropData(urlfw, elefw);
}
$(window).load(function() {
    $('#fullwidth-banner').css('height', 'auto');
});

var urlfwm = $('#fullwidth-banner-mob').data("assetUrl");
var elefwm = $('#fullwidth-banner-mob').attr("id");

if (urlfwm) {
    getSmartCropData(urlfwm, elefwm);
}
$(window).load(function() {
    $('#fullwidth-banner-mob').css('height', 'auto');
});
/*** Fullwidth Banner Ends ***/
var an_header = document.getElementById("HeaderAnchor");
if ($("#HeaderAnchor").length > 0 && an_header != null && $("#HeaderAnchor").is(':visible')) {
    window.onscroll = function() {
        if (isMobileDevice()) {
            anchorNavXS();
        } else {
            anchorNavMD();
        }
    };
    var stickyNav = an_header.offsetTop;

    function anchorNavXS() {
        if (window.pageYOffset > stickyNav) {
            an_header.classList.add("sticky_anchornav");
        } else {
            an_header.classList.remove("sticky_anchornav");
        }
    }

    var anStickyNavTop = $(".an-AnchorNav").offset().top;

    function anchorNavMD() {
        var anScrollTop = $(window).scrollTop();
        if (anScrollTop > anStickyNavTop) {
            an_header.classList.add("sticky_anchornav");
        } else {
            an_header.classList.remove("sticky_anchornav");
        }
    }

    function isMobileDevice() {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            return true;
        }
        return false;
    }

    var sections = $(".section-title__container");
    var nav = $(".an-AnchorNav");
    var nav_height = nav.outerHeight() + 58;
    $("a.an-AnchorNav_Link:first-child")
        .addClass("active")
        .attr("aria-selected", "true")
        .addClass("nav-first");
    $(".an-AnchorNav_Contents a")
        .last()
        .addClass("nav-end");

    $(function() {
        $("#anAnchorNavContents").anchorNavPoints({
            offset: 100,
            updateHash: true
        });
    });
    var an_lastScrollTop = 0;
    $(window).on("scroll", function(e) {
        $("a.an-AnchorNav_Link").removeClass('sc');
        nav.find("a").attr("aria-selected", "false");
        var currentLink = $("a.an-AnchorNav_Link.active").attr("href");
        nav.find('a[href="' + currentLink + '"]')
            .attr("aria-selected", "true")
            .addClass("active sc");

        var srolltopPosition = $(this).scrollTop();
        if (srolltopPosition > an_lastScrollTop) {
            nav.find('a[href="' + currentLink + '"]')
                .attr("aria-selected", "true");
        }

        nav.find('a[href="' + currentLink + '"]')
            .attr("aria-selected", "true");

        an_lastScrollTop = srolltopPosition;

        if (
            nav
            .find('a[href="' + currentLink + '"]')
            .attr("aria-selected", "true")
            .hasClass("nav-first")
        ) {
            anAdvancerLeft.click();
        }
        if (
            nav
            .find('a[href="' + currentLink + '"]')
            .attr("aria-selected", "true")
            .hasClass("nav-end")
        ) {
            anAdvancerRight.click();
        }
    });

    nav.find("a").on("click", function() {
        var $el = $(this),
            id = $el.attr("href");

        $("html, body").animate({
                scrollTop: $(id).offset().top - nav_height
            },
            800
        );
    });

    var SETTINGS = {
        navBarTravelling: true,
        navBarTravelDirection: "",
        navBarTravelDistance: 100
    };

    var colours = {
        0: "transparent"
    };

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");

    var anAdvancerLeft = document.getElementById("anAdvancerLeft");
    var anAdvancerRight = document.getElementById("anAdvancerRight");

    var anIndicator = document.getElementById("anIndicator");

    var anAnchorNav = document.getElementById("anAnchorNav");
    var anAnchorNavContents = document.getElementById("anAnchorNavContents");

    anAnchorNav.setAttribute(
        "data-overflowing",
        determineOverflow(anAnchorNavContents, anAnchorNav)
    );

    moveIndicator(
        anAnchorNav.querySelector('[aria-selected="true"]'),
        colours[0]
    );

    var last_known_scroll_position = 0;
    var ticking = false;

    function doSomething(scroll_pos) {
        anAnchorNav.setAttribute(
            "data-overflowing",
            determineOverflow(anAnchorNavContents, anAnchorNav)
        );
    }

    anAnchorNav.addEventListener("scroll", function() {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                doSomething(last_known_scroll_position);
                ticking = false;
            });
        }
        ticking = true;
    });

    anAdvancerLeft.addEventListener("click", function() {
        if (SETTINGS.navBarTravelling === true) {
            return;
        }

        if (
            determineOverflow(anAnchorNavContents, anAnchorNav) === "left" ||
            determineOverflow(anAnchorNavContents, anAnchorNav) === "both"
        ) {
            var availableScrollLeft = anAnchorNav.scrollLeft;

            if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
                anAnchorNavContents.style.transform =
                    "translateX(" + availableScrollLeft + "px)";
            } else {
                anAnchorNavContents.style.transform =
                    "translateX(" + SETTINGS.navBarTravelDistance + "px)";
            }

            anAnchorNavContents.classList.remove(
                "an-AnchorNav_Contents-no-transition"
            );

            SETTINGS.navBarTravelDirection = "left";
            SETTINGS.navBarTravelling = false;
        }

        anAnchorNav.setAttribute(
            "data-overflowing",
            determineOverflow(anAnchorNavContents, anAnchorNav)
        );
    });

    anAdvancerRight.addEventListener("click", function() {
        if (SETTINGS.navBarTravelling === true) {
            return;
        }

        if (
            determineOverflow(anAnchorNavContents, anAnchorNav) === "right" ||
            determineOverflow(anAnchorNavContents, anAnchorNav) === "both"
        ) {
            var navBarRightEdge = anAnchorNavContents.getBoundingClientRect()
                .right;
            var navBarScrollerRightEdge = anAnchorNav.getBoundingClientRect()
                .right;

            var availableScrollRight = Math.floor(
                navBarRightEdge - navBarScrollerRightEdge
            );

            if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
                anAnchorNavContents.style.transform =
                    "translateX(-" + availableScrollRight + "px)";
            } else {
                anAnchorNavContents.style.transform =
                    "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
            }

            anAnchorNavContents.classList.remove(
                "an-AnchorNav_Contents-no-transition"
            );

            SETTINGS.navBarTravelDirection = "right";
            SETTINGS.navBarTravelling = true;
        }

        anAnchorNav.setAttribute(
            "data-overflowing",
            determineOverflow(anAnchorNavContents, anAnchorNav)
        );
    });

    anAnchorNavContents.addEventListener(
        "transitionend",
        function() {
            var styleOfTransform = window.getComputedStyle(
                anAnchorNavContents,
                null
            );
            var tr =
                styleOfTransform.getPropertyValue("-webkit-transform") ||
                styleOfTransform.getPropertyValue("transform");

            var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
            anAnchorNavContents.style.transform = "none";
            anAnchorNavContents.classList.add(
                "an-AnchorNav_Contents-no-transition"
            );

            if (SETTINGS.navBarTravelDirection === "left") {
                anAnchorNav.scrollLeft = anAnchorNav.scrollLeft - amount;
            } else {
                anAnchorNav.scrollLeft = anAnchorNav.scrollLeft + amount;
            }
            SETTINGS.navBarTravelling = false;
        },
        false
    );

    anAnchorNavContents.addEventListener("click", function(e) {
        var links = [].slice.call(
            document.querySelectorAll(".an-AnchorNav_Link")
        );
        links.forEach(function(item) {
            item.setAttribute("aria-selected", "false");
        });
        e.target.setAttribute("aria-selected", "true");

        moveIndicator(e.target, colours[links.indexOf(e.target)]);
    });

    function moveIndicator(item, color) {
        if (item) {
            var textPosition = item.getBoundingClientRect();
            var container = anAnchorNavContents.getBoundingClientRect().left;
            var distance = textPosition.left - container;
            var scroll = anAnchorNavContents.scrollLeft;
            if (anIndicator) {
                anIndicator.style.transform =
                    "translateX(" +
                    (distance + scroll) +
                    "px) scaleX(" +
                    textPosition.width * 0.01 +
                    ")";
            }
            if (color) {
                anIndicator.style.backgroundColor = color;
            }
        }
    }

    function determineOverflow(content, container) {
        var containerMetrics = container.getBoundingClientRect();
        var containerMetricsRight = Math.floor(containerMetrics.right);
        var containerMetricsLeft = Math.floor(containerMetrics.left);
        var contentMetrics = content.getBoundingClientRect();
        var contentMetricsRight = Math.floor(contentMetrics.right);
        var contentMetricsLeft = Math.floor(contentMetrics.left);
        if (
            containerMetricsLeft > contentMetricsLeft &&
            containerMetricsRight < contentMetricsRight
        ) {
            return "both";
        } else if (contentMetricsLeft < containerMetricsLeft) {
            return "left";
        } else if (contentMetricsRight > containerMetricsRight) {
            return "right";
        } else {
            return "none";
        }
    }
}

function addTableHoverBg() {
    $('.rmit-table__wrapper table tr:first-child').has('td').addClass('enable-hover-bg');
}

addTableHoverBg();
$(document).ready(function() {
    if ($('#campaign__stickycta').length) {
        $('body').addClass('sticky-cta-enabled');
        $(window).scroll(function() {

            var currentScrollPos = $(window).scrollTop();
            if (currentScrollPos > "50") {
                $("#campaign__stickycta").css("bottom", "0");
            } else {
                $("#campaign__stickycta").css("bottom", "-100px");
            }
        });
    }

    if ($("#campaign__stickycta-mobi").length) {

        $(window).scroll(function() {
            var currentScrollPosMobi = $(window).scrollTop();

            if (currentScrollPosMobi > "30") {
                $("#campaign__stickycta-mobi").css("bottom", "0");
            } else {
                $("#campaign__stickycta-mobi").css("bottom", "-70px");
            }
        });
    }
});



if ($(".chat-btn").length > 0) {
    $('.chat-btn').click(function(e) {

        e.preventDefault();

        var userInfo = JSON.parse(localStorage.getItem("userData"));
        var firstName = '';
        var lastName = '';
        var uniId = '';

        if (userInfo !== null) {
            firstName = userInfo.firstName ? userInfo.firstName : '';
            lastName = userInfo.lastName ? userInfo.lastName : '';
            uniId = userInfo.uniId ? userInfo.uniId : '';
        }

        CXBus.command('WebChat.open', {
            formJSON: {
                inputs: [
                    // Default fields
                    {
                        id: 'cx_webchat_form_firstname',
                        name: 'firstname',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'First Name',
                        value: firstName
                    },
                    {
                        id: 'cx_webchat_form_lastname',
                        name: 'lastname',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'Last Name',
                        value: lastName
                    },
                    {
                        id: 'cx_webchat_form_employee_no',
                        name: 'employeeno',
                        wrapper: '<div><br>{label}<br>{input}</div>',
                        maxlength: '100',
                        placeholder: 'Required',
                        label: 'Employee No',
                        value: uniId
                    },
                    {
                        id: 'cx_webchat_form_email',
                        name: 'email',
                        wrapper: '<div><br>{label}<br>{input}<br></div>',
                        maxlength: '100',
                        placeholder: 'Optional',
                        label: 'Email'
                    }
                ]
            }
        });


    });
}








$(document).ready(function() {

    //declare variables
    var playVideoCurrentID, stopVideoCurrentID, uaVideoPlayer, isIEVideoPlayer = '';

    //add youtube api for analytics
    if ($(".rmit-video__container").length > 0 && $('script').attr('src') != 'https://www.youtube.com/iframe_api') {
        $('head').append('<script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>');
    }

    //on page load
    $('.rmit-video__modal--transcriptcontainer').hide();
    $('.rmit-video__closebutton').show();

    function playYoutubeVideo() {
        playVideoCurrentID = '#' + $('.rmit-video__modal[style*="display: block"]').attr('id') + ' iframe';
        $(playVideoCurrentID).attr("src", $(playVideoCurrentID).attr("src").replace("autoplay=0", "autoplay=1"));
    }

    function stopYoutubeVideo() {
        stopVideoCurrentID = '#' + $('.rmit-video__modal[style*="display: block"]').attr('id') + ' iframe';
        $(stopVideoCurrentID).attr("src", $(stopVideoCurrentID).attr("src").replace("autoplay=1", "autoplay=0"));
    }

    function displayYoutubeVideo() {
        $('.rmit-video__modal--transcriptcontainer').hide();
        $('.rmit-video__closebutton').show();
    }

    function isIEYoutubeVideo() {
        uaVideoPlayer = navigator.userAgent;
        isIEVideoPlayer = uaVideoPlayer.indexOf("MSIE ") > -1 || uaVideoPlayer.indexOf("Trident/") > -1;

        return isIEVideoPlayer;
    }

    //play button alignment for IE browser
    if (isIEYoutubeVideo() && $(window).width() > 1023) {
        $('.rmit-video__content--playvideobutton').css({
            'top': '40%',
            'left': '46%'
        });
    }

    //mobile alignment for layout container
    if ($(window).width() < 1024) {
        $('.videoplayerfragment').css({
            'width': '100%',
            'padding-right': '0'
        });
    }


    $(".rmit-video__content--playvideobutton, .rmit_ctaVideo").on("touchstart click", function(e) {
        e.preventDefault();
        var getVideoTarget, getVideoTargetIframe = '';
        getVideoTarget = '#' + $(this).find('.rmit-video__content--playvideo').attr('data-videoid');
        $(getVideoTarget).modal("show");

        getVideoTargetIframe = getVideoTarget + ' iframe';
        $(getVideoTargetIframe).attr("src", $(getVideoTargetIframe).attr("src").replace("autoplay=0", "autoplay=1"));
        $(getVideoTargetIframe).attr("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");

        if ($(window).width() < 1024) {
            $(getVideoTarget).css('margin-top', '40px');
        }

        $(getVideoTarget).find('.rmit-video__modal--video').css('display', 'block');
        $(getVideoTarget).find('.rmit-video__modal--transcript').not('.active').addClass('active');
        displayYoutubeVideo();
    });

    $(".rmit-video__closebutton").on("touchstart click", function(e) {
        e.preventDefault();
        stopYoutubeVideo();

        $(this).parent().parent().next().find('.rmit-video__modal--transcript').addClass('active');
        $(".rmit-video__modal").modal("hide");
    });

    //click transcript link to show transcript description
    $('.rmit-video__modal--transcriptlink').on("touchstart click", function() {
        stopYoutubeVideo();

        $(this).parent().removeClass('active');
        $('.rmit-video__modal--video').slideUp();
        $('.rmit-video__modal--transcriptcontainer').show();
    });

    //click back to video link
    $('.rmit-video__modal--transcriptvideolink').on("touchstart click", function() {
        $('.rmit-video__modal--video').slideDown();
        $(this).parent().parent().parent().find('.rmit-video__modal--transcript').addClass('active');

        displayYoutubeVideo();
        playYoutubeVideo();
    });

    //outside modal click updates
    $("html").on("touchstart click", function(e) {
        if ($(".rmit-video__modal .modal-dialog").is(":visible")) {
            e.stopPropagation();
            stopYoutubeVideo();
            $(".rmit-video__modal").modal("hide");
        }
    });

    //prevent default event
    $(".rmit-video__modal .modal-dialog").on("touchstart click", function(e) {
        e.stopPropagation();
    });

});
$(document).ready(function() {

    $(".gopreviouspage").click(function() {
        goBackPreviousPage();
    });

    function goBackPreviousPage() {
        window.history.back();
    }

});


$(document).ready(function() {

    $(".feature-carousel__wrapper .lazy").slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnFocus: false,
        lazyLoad: 'ondemand',
        infinite: true,
        prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style="">Previous<svg width="18px" height="32px" viewBox="0 0 18 32" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><title>Left Arrow</title><desc>Feature Carousel Left Arrow</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g class="feature-carousel-leftarrow" transform="translate(-116.000000, -944.000000)" fill="#333333" fill-rule="nonzero"><polygon id="&lt;-copy" transform="translate(125.000000, 960.000000) scale(-1, 1) rotate(-180.000000) translate(-125.000000, -960.000000) " points="134 976 131.50495 976 116 959.847619 131.50495 944 134 944 118.376238 959.847619"></polygon></g></g></svg></button>',
        nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">Next<svg width="18px" height="32px" viewBox="0 0 18 32" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><title>Right Arrow</title><desc>Feature Carousel Right Arrow</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g class="feature-carousel-rightarrow" transform="translate(-1307.000000, -944.000000)" fill="#333333" fill-rule="nonzero"><polygon transform="translate(1316.000000, 960.000000) scale(-1, 1) translate(-1316.000000, -960.000000) " points="1325 976 1322.50495 976 1307 959.847619 1322.50495 944 1325 944 1309.37624 959.847619"></polygon></g></g></svg></button>'
    });
    $('.feature-carousel__container').slick('slickSetOption', 'autoplay', true).slick('slickPlay');

    function pauseCarousel() {
        $(".feature-carousel-pause").hide();
        $(".feature-carousel-play").show();
        $('.feature-carousel__container').slick('slickSetOption', 'autoplay', false).slick('slickPause');
    }

    function playCarousel() {
        $(".feature-carousel-pause").show();
        $(".feature-carousel-play").hide();
        $('.feature-carousel__container').slick('slickSetOption', 'autoplay', true).slick('slickPlay');
    }

    function disableCarousel(id) {
        $("#" + id + " .feature-carousel-pause").hide();
        $("#" + id + " .feature-carousel-play").show();
        $("#" + id + ".feature-carousel__container").slick('slickSetOption', 'autoplay', false).slick('slickPause');
    }

    if ($('.feature-carousel__wrapper').hasClass('feature-carousel__disableautoplay')) {
        var carouselId = $(this).attr("id");
        disableCarousel(carouselId);
    }
    $(".feature-carousel__wrapper .rmit-video__content--playvideobutton").on("touchstart click", function() {
        pauseCarousel();
    });

    $(".feature-carousel__wrapper .rmit-video__closebutton ").on("touchstart click", function() {
        playCarousel();
    });

    $(".feature-carousel-pause").on("click", function() {
        $(this).hide();
        $(this).parent().find('.feature-carousel-play').show();
        $(this).parent().parent().find('.feature-carousel__container').slick('slickSetOption', 'autoplay', false).slick('slickPause');
    });

    $(".feature-carousel-play").on("click", function() {
        $(this).parent().find('.feature-carousel-pause').show();
        $(this).hide();
        $(this).parent().parent().find('.feature-carousel__container').slick('slickSetOption', 'autoplay', true).slick('slickPlay');
    });

    $(".feature-carousel__container .slick-prev,.feature-carousel__container .slick-next,.feature-carousel__container .slick-dots").on("click", function() {
        $(this).parent().parent().find('.feature-carousel-pause').show();
        $(this).parent().parent().find('.feature-carousel-play').hide();
        $(this).parent().slick('slickSetOption', 'autoplay', true).slick('slickPlay');
    });

});

var ApplicantTypeSwitcher = function() {
    var tabKeyCode = 9;
    var enterKeyCode = 13;
    var upKeyCode = 38;
    var downKeyCode = 40;

    var switchToDomestic = function() {
        setDomesticOrInternationalCookie('domestic');
        switchCleanup();
        localResult();

    };

    var switchToInternational = function() {
        setDomesticOrInternationalCookie('international');
        switchCleanup();
        internationalRsult();

    };

    var switchCleanup = function() {
        displayDomesticOrInternational();
        $('.result-info-international').addClass('hidden');
        $('.result-info-local').addClass('hidden');

    };

    $('.m-applicant-type-radio .switcher').click(function(e) {
        e.preventDefault();
        openPopup();
        $('.m-applicant-type-radio .switcher').removeClass('referenceTrigger');
        $(this).addClass('referenceTrigger');
    });

    $('.m-applicant-type-radio .switcher').on('keydown', function(e) {
        if (e.key == 'Enter') {
            $(this).click();
        }
    })


    $('.m-applicant-type-switcher .btn-cancel').click(function(e) {
        closePopup();
        return false;
    });


    $('.m-applicant-type-switcher .btn-international').on('click', function(e) {
        switchToInternational();
        closePopup();
        checkRadioButton();
    });


    $('.m-applicant-type-switcher .btn-domestic').on('click', function(e) {
        switchToDomestic();
        closePopup();
        checkRadioButton();

    });


    var openPopup = function() {
        $('body').addClass('disable-scroll');
        $('.programlist-model').addClass('programlist-model__show');
        $('.modal-overlay').removeClass('hide');
        $('.m-applicant-type-switcher.dropdown').toggleClass('open').attr('aria-lable', $('.header-text:visible').text());
        setTimeout(function() {
            $('.programlist-model .btn-switcher:visible').focus();
        }, 100);

    }

    var closePopup = function() {
        $('body').removeClass('disable-scroll');
        $('.programlist-model').removeClass('programlist-model__show');
        $('.m-applicant-type-switcher').toggleClass('open');
        $('.modal-overlay').addClass('hide');
        $('.m-applicant-type-radio span.switcher.referenceTrigger').focus();

    }

    var checkRadioButton = function() {
        $('.checkmark').removeClass('checked');
        if (domOrIntCookie == "international") {
            $("input#international").prop("checked", true).closest('label').addClass('checked').closest('.switcher').attr('aria-checked', 'true');
            $("input#local").prop("checked", false).closest('label').removeClass('checked').closest('.switcher').attr('aria-checked', 'false');
            internationalRsult();
        }
        if (domOrIntCookie == "domestic" || typeof domOrIntCookie === "undefined") {
            if (typeof domOrIntCookie === "undefined") {
                switchToDomestic();
            }
            $("input#local").prop("checked", true).closest('label').addClass('checked').closest('.switcher').attr('aria-checked', 'true');
            $("input#international").prop("checked", false).closest('label').removeClass('checked').closest('.switcher').attr('aria-checked', 'false');
            localResult();
        }
    }


    /* Accessibility */

    $('.m-applicant-type-switcher .switcher').mousedown(function(e) {
        $(this).children('.local, .international').removeClass('span-outline');
    });

    $('.m-applicant-type-switcher .switcher').keyup(function(e) {
        if (e.which == tabKeyCode) {
            $(this).children('.local, .international').addClass('span-outline');
        }
    });

    $('.m-applicant-type-switcher .dropdown-menu .btn-cancel').keydown(function(e) {
        var code = e.keyCode || e.which;
        if (code == enterKeyCode) {
            closePopup();
        }
        setTimeout(function() {
            if (code == tabKeyCode && !e.shiftKey) {
                $(".header-text:visible").focus();
            }
        }, 10)

    });
    $(".header-text").keydown(function(e) {
        var code = e.keyCode || e.which;
        if (e.shiftKey && code == tabKeyCode) {
            $('.btn-cancel:visible').focus();
            e.preventDefault();
        }
    });


    $('.m-applicant-type-switcher .dropdown-menu a.btn').keydown(function(e) {
        var code = e.keyCode || e.which;
        // enter key
        if (code == enterKeyCode) {
            if ($(this).hasClass('btn-domestic')) {
                switchToDomestic();
            } else if ($(this).hasClass('btn-international')) {
                switchToInternational();
            }

            closePopup();
            e.stopPropagation();
            return false;
        }
    });

    $('.m-applicant-type-switcher .dropdown-menu .btn-cancel').keydown(function(e) {
        var code = e.keyCode || e.which;
        // enter key
        if (code == enterKeyCode) {
            $('.m-applicant-type-switcher .switcher').dropdown('toggle');
            $('.m-applicant-type-switcher .switcher').focus();
            e.stopPropagation();
            return false;
        }
    });

    $('.m-applicant-type-switcher .dropdown-menu').mousedown(function(e) {
        return false;
    });


    $('.m-applicant-type-switcher .switcher').keydown(function(e) {
        var code = e.keyCode || e.which;
        if (e.shiftKey && code == tabKeyCode && $('.m-applicant-type-switcher').hasClass('open')) {
            $('.m-applicant-type-switcher .btn-cancel').focus();
            e.preventDefault();
        } else if (code == downKeyCode || code == upKeyCode) {
            e.stopPropagation();
        }
    });

    var closeSwitcher = function() {
        $('.m-applicant-type-switcher').toggleClass('open');
    };

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            closePopup();
            $('.m-applicant-type-switcher').removeClass('open');
        }
    });

    checkRadioButton();
    return {
        closeSwitcher: closeSwitcher,
        switchToDomestic: switchToDomestic,
        switchToInternational: switchToInternational,
        checkRadioButton: checkRadioButton
    };
}

$(document).ready(function() {
    if ($(".m-applicant-type-radio").length > 0) {
        displayDomesticOrInternational();
        ApplicantTypeSwitcher();

    }

    $('.programlist--dropdown').click(function() {
        $('.programlist--facets').toggle();
        if ($(this).attr('aria-expanded') == "true") {
            $(this).attr('aria-expanded', "false");
        } else {
            $(this).attr('aria-expanded', "true");
        }
        if ($(this).find("span").hasClass("fa-angle-down")) {
            $(this).parent().find("span.arrowicon").toggleClass("rotate caretIcon");

        }
    });

    $('.programlist--dropdown').keydown(function(e) {
        if (e.keyCode == 13) {
            $(this).click();
        }
    })


    if ($('.rmitprogramlist').length > 0) {
        trackFocus('.rmitprogramlist', '.switcher');
    }

});

function getComponentPath(type, allData, componentRootElement) {
    var path = "";
    var d = new Date();
    if ($(componentRootElement).find("input[name=componentPath]").val() != "") {
        path += $(componentRootElement).find("input[name=componentPath]").val() + '.model.json?t=' + d.getTime() + '&data=yes';
    }
    if (typeof type !== "undefined") {
        path += "&facetFilter=" + type;
    }

    if (allData) {
        path = path + "&allData=true";
    }

    return path;
}

function getAllData(componentRootElement) {
    var type = $(componentRootElement).find("input[name=componentdefaultFacet]").val();
    if (type === "all")
        type = undefined;

    $.ajax({
        type: "GET",
        dataType: 'json',
        url: getComponentPath(type, true, componentRootElement),
        success: function(data) {
            if (data !== undefined) {
                renderTable(data.programs, data.compareToolTip, data.saveSVGIcon, data.enableSave, data.emptyArialLabel, data.statusArialLabel, componentRootElement);
                renderFacet(data.facetAndOtherData[0], componentRootElement);
                updateSwitcher(data.facetAndOtherData[0].studentTypeData);
            }


        },
        error: function(textStatus, errorThrown) {
            console.error('ERROR FROM FILE');


        }
    });
}

function filterProgram(intnl, loc) {
    var classNames = "";
    if (intnl === true) {
        classNames += "b-international intnl";
    }
    if (loc === true) {
        classNames += " b-domestic lcl";
    }
    if (loc === false && intnl === false) {
        if ($('body.b-international').length > 0 || $('body.b-domestic').length > 0) {
            classNames += " b-domestic b-international";
        } else {
            classNames += "hidden";
        }
    }
    if (loc === true && intnl === true) {
        classNames = "lcl intnl";
    }

    return 'class="' + classNames + '"';
}

function updateSwitcher(studentType) {
    if (typeof studentType !== "undefined") {
        $("#local-label").text(studentType[0].studentTypeLabel);
        $("#international-label").text(studentType[1].studentTypeLabel);
        $(".programlist--pageheading").text(studentType.programLabel);
        $(".programlist--btn #filter-xs").text(studentType.mobileFacetTitle);
        $("#local-tooltip").text(studentType[0].studentTypeToolTip);
        $('.programlist__tooltip__localtext').text(studentType[0].studentTypeToolTip);
        $("#international-tooltip").text(studentType[1].studentTypeToolTip);
        $('.programlist__tooltip__inttext').text(studentType[1].studentTypeToolTip);

    }
}

function renderFacet(facetData, componentRootElement) {
    if (typeof facetData.facets !== "undefined") {
        var facetHtml = "";
        if (facetData.enableShowAll == "true") {
            facetHtml += '<li role="presentation" ><a aria-controls role="tab" href="javascript:void(0);" id="all-programs" class="program-list-facet" tabindex="0"><div class="programlist--tooltip">' + facetData.showAllValue + '</div></a></li>';
        }

        var activeCount = 0;

        for (var i = 0; i <= facetData.facets.length - 1; i++) {
            if (facetData.facets[i].selectedFacet == "true" && facetData.facets[i].showFacet == "true") {
                activeCount = activeCount + 1;
            }
            if (facetData.facets[i].showFacet == "true") {
                var tabIndexval = facetData.facets[i].selectedFacet == "true" ? "0" : "-1";
                var ariaSelected = facetData.facets[i].selectedFacet == "true" ? "true" : "false";
                var activeClass = facetData.facets[i].selectedFacet == "true" ? "active" : "";

                facetHtml += '<li  role="presentation" class="' + activeClass + '"><a aria-controls role="tab" href="javascript:void(0);" class="program-list-facet" data_type="' + facetData.facets[i].type + '" tabindex="' + tabIndexval + '" aria-selected="' + ariaSelected + '">';
                facetHtml += '<div class="programlist--tooltip">' + facetData.facets[i].label;
                if (facetData.facets[i].tooTip !== null) {
                    facetHtml += '<span class="tooltiptext" aria-hidden="true">' + facetData.facets[i].tooTip + ' </span>';
                }

                facetHtml += '</div>';
                facetHtml += '</a></li>';
            }
        }

        $(componentRootElement).find("#programlist-facet").empty();
        $(componentRootElement).find("#programlist-facet").append(facetHtml);
        $(componentRootElement).find(".programlist--pageheading").text(facetData.programLabel);
        $(componentRootElement).find(".programlist--btn #filter-xs").text(facetData.mobileFacetTitle);
        $(componentRootElement).find(".programlist--dropdown").attr('aria-label', facetData.mobileFacetTitle);
        if (activeCount == 0) {
            $(componentRootElement).find('#all-programs').closest('li').addClass('active');
        }
        if ($(componentRootElement).find('.programlist--facets .nav-tabs li.active').length == 0) {
            $(componentRootElement).find('.programlist--facets .nav-tabs li:first').addClass('active');
            $(componentRootElement).find('.programlist--facets .nav-tabs li:first a').attr('tabindex', '0').attr('aria-selected', 'true');
        }


        $(componentRootElement).find("#programlist-facet a").on('click', function(e) {
            $(this).parent().parent().find('a').attr("tabindex", "-1").attr("aria-selected", "false");
            $(this).attr("tabindex", "0").attr("aria-selected", "true");
        });

        $(componentRootElement).find("#programlist-facet a").on('keydown', function(e) {
            if ((e.keyCode === 39 || e.keyCode === 40) && $(this).parent().next().length > 0) {
                e.preventDefault();
                $(this).parent().parent().find('a').attr("tabindex", "-1").attr("aria-selected", "false");
                $(this).parent().next().find('a').attr("tabindex", "0").attr("aria-selected", "true").focus().click();
            } else if ((e.keyCode === 37 || e.keyCode === 38) && $(this).parent().prev().length > 0) {
                e.preventDefault();
                $(this).parent().parent().find('a').attr("tabindex", "-1").attr("aria-selected", "false");
                $(this).parent().prev().find('a').attr("tabindex", "0").attr("aria-selected", "true").focus().click();
            } else if (e.keyCode === 32) {
                $(this).click();
            }
        });

    }
}

function formate(name) {
    if (name === null) {
        return "N/A";
    }

    return name;
}

function formateEntryScore(entryscore) {
    if (entryscore === null) {

        return "N/A";
    }

    return entryscore;
}

function getSaveBtn(programdata, compareToolTip, saveSVGIcon, emptyArialLabel, statusArialLabel) {
    var savewpr = '<div class="save-opt-wpr" data-course-id="' + programdata.programCode + '" data-course-name="' + programdata.programName + '" data-course-path="' + programdata.pagePath + '">';
    savewpr += '<span tabindex="0" role="checkbox" data-analytics-type="savencompare" data-analytics-value="compare" data-analytics-course="' + programdata.programName + '" class="save-btn span-outline remove-outline" aria-label="' + emptyArialLabel + ' ' + programdata.programName + '" data-save-program="' + emptyArialLabel + ' ' + programdata.programName + '" data-unsave-program="' + statusArialLabel + ' ' + programdata.programName + '" aria-checked="false">' + saveSVGIcon + '</span>';
    savewpr += '<div class="save-tooltip text-left" role="tooltip" style="display: none;">' + compareToolTip + '</div> </div>';

    return savewpr;
}

function isEnableSave(tableData, enableSave) {
    if (tableData.compareLabel == null || tableData.compareLabel == "") {
        enableSave = false;
    }
    return enableSave;
}

function appendEntryScoreSec(tbody, programTableData, entryScoreHeaderCol) {
    if (entryScoreHeaderCol) {
        if ($('body.b-domestic').length > 0 || $('body.b-international').length > 0) {
            tbody += '<td class="pl--entryscore"><span class="b-domestic">' + formateEntryScore(programTableData.entryScoreLoc) + '</span><span class="b-international">' + formateEntryScore(programTableData.entryScoreInt) + '</span></td>';
        } else {
            tbody += '<td class="pl--entryscore"><span>' + formateEntryScore(programTableData.entryScoreInt) + '</span></td>';
        }
        tbody += '</td>';
    }
    return tbody;
}

function appendMidYear(tbody, tableData, programTableData) {
    tbody += '<td ' + ((programTableData.midYear === true) ? 'class="pl-midyear--ctabtn"' : 'class="pl--ctabtn"') + '>';
    tbody += '<div ' + ((programTableData.midYear === true) ? 'class="pl--btn_Wrap_Secondary_midyear"' : 'class="pl--btn_Wrap_Secondary"') + '>';
    if (programTableData.midYear === true) {
        tbody += '<a class="pl--rmit_btnCta_midyear pl--rmit_secondaryBtn_midyear"  href="' + programTableData.programUrl + '" data-analytics-type="program list" data-analytics-prgname="' + programTableData.programName + '" data-analytics-value="' + tableData.openMidYearLabel + '" aria-label="' + tableData.openMidYearLabel + " " + programTableData.programName + '">' + tableData.openMidYearLabel + '</a>';
    } else {
        tbody += '<a class="pl--rmit_btnCta pl--rmit_secondaryBtn" href="' + programTableData.programUrl + '" data-analytics-type="program list" data-analytics-prgname="' + programTableData.programName + '" data-analytics-value="' + tableData.ctaLabel + '" aria-label="' + tableData.ctaLabel + " " + programTableData.programName + '">' + tableData.ctaLabel + '</a>';
    }

    return tbody;

}

function appendProgramName(tbody, programTableData, programNameHeaderCol) {
    if (programNameHeaderCol) {
        tbody += '<td class="pl--programname show-hidelink"><a href="' + programTableData.programUrl + '" data-analytics-type="program list" data-analytics-prgname="' + programTableData.programName + '">' + programTableData.programName + '</a></td>';
    }
    if (programNameHeaderCol) {
        tbody += '<td class="pl--programname hidelink"><a href="' + programTableData.programUrl + '" data-analytics-type="program list" data-analytics-prgname="' + programTableData.programName + '">' + programTableData.programName + '</a></td>';
    }
    return tbody;
}

function renderTable(tableData, compareToolTip, saveSVGIcon, enableSave, emptyArialLabel, statusArialLabel, componentRootElement) {
    var table = "";
    var resultInfo = "";

    enableSave = isEnableSave(tableData, enableSave);

    if (tableData.programs !== null) {
        var tbody = "";
        var thead = '<table class="programlist-tbl table table-striped" aria-describedby="programlist" id="program-table-1"><thead><tr>';
        var studytpyeCol = false;
        var programNameHeaderCol = false;
        var locationHeaderCol = false;
        var entryScoreHeaderCol = false;

        if (enableSave) {
            thead += '<th scope="col" class="compare-lbl">' + formate(tableData.compareLabel) + '</th>';
        }
        if (tableData.programNameHeader !== null && tableData.programNameHeader !== "") {
            thead += '<th scope="col">' + tableData.programNameHeader + '</th>';
            programNameHeaderCol = true;
        }

        if (tableData.studyType !== null && tableData.studyType !== "") {
            thead += '<th scope="col">' + formate(tableData.studyType) + '</th>';
            studytpyeCol = true;
        }
        if (tableData.locationHeader !== null && tableData.locationHeader !== "") {
            thead += '<th scope="col">' + tableData.locationHeader + '</th>';
            locationHeaderCol = true;
        }
        if (tableData.entryScoreHeader !== null && tableData.entryScoreHeader !== "") {
            thead += '<th scope="col">' + tableData.entryScoreHeader + '</th>';
            entryScoreHeaderCol = true;
        }
        thead += '<th scope="col">&nbsp;</th></tr></thead><tbody>';

        var args = {
            statusArialLabel,
            studytpyeCol,
            locationHeaderCol,
            programNameHeaderCol,
            entryScoreHeaderCol
        };
        tbody = programListTbodyData(tableData, tbody, enableSave, compareToolTip, saveSVGIcon, emptyArialLabel, args);



        tbody += '</tbody></table>';
        resultInfo += '<div class="result-info-local hidden">Sorry, no courses are currently available to domestic students under this study area. Please search under a different <a href="https://www.rmit.edu.au/study-with-us">study area</a> or use our <a href="https://pathways.rmit.edu.au/">pathways tool</a> to find a different course.</div>';
        resultInfo += '<div class="result-info-international hidden">Sorry, no programs are currently available for international students under this study area. Please search under a different <a href="https://www.rmit.edu.au/study-with-us">study area</a> to find a different course.</div>';
        table = thead + tbody;
        $(componentRootElement).find("#rmit-program-list").empty();
        $(componentRootElement).find("#rmit-program-list").append(table);
        $(componentRootElement).find("#rmit-program-list").append(resultInfo);


    }
    toggleProgramListBasedOnType(componentRootElement);
}

function toggleProgramListBasedOnType(componentRootElement) {
    setTimeout(function() {
        if (domOrIntCookie == "international") {
            internationalRsult();
        } else {
            localResult();
        }
        saveCourses(componentRootElement);
    }, 10);
}


function programListTbodyData(tableData, tbody, enableSave, compareToolTip, saveSVGIcon, emptyArialLabel, props) {
    var statusArialLabel = props.statusArialLabel;
    var studytpyeCol = props.studytpyeCol;
    var locationHeaderCol = props.locationHeaderCol;
    var programNameHeaderCol = props.programNameHeaderCol;
    var entryScoreHeaderCol = props.entryScoreHeaderCol;

    for (var i = 0; i <= tableData.programs.length - 1; i++) {

        tbody += '<tr ' + filterProgram(tableData.programs[i].studentTypeInternational, tableData.programs[i].studentTypeDomestic) + ' >';


        if (enableSave) {
            tbody += '<td class="saveprogram-prg-list text-center">' + getSaveBtn(tableData.programs[i], compareToolTip, saveSVGIcon, emptyArialLabel, statusArialLabel) + '</td>';
        }


        tbody = appendProgramName(tbody, tableData.programs[i], programNameHeaderCol);

        if (studytpyeCol) {
            tbody += '<td class="pl--studytype">' + formate(tableData.programs[i].studyType) + '</td>';
        }
        if (locationHeaderCol) {
            tbody += '<td class="pl--location">' + formate(tableData.programs[i].location) + '</td>';

        }

        tbody = appendEntryScoreSec(tbody, tableData.programs[i], entryScoreHeaderCol);

        tbody = appendMidYear(tbody, tableData, tableData.programs[i]);

        tbody += '</div></td></tr>';
    }

    return tbody;
}

$(document).delegate('.program-list-facet', 'click', function() {
    var componentRootElement = $(this).closest('.programlistdesktopwrap');
    $(componentRootElement).find('li').removeClass('active');
    $(this).closest('li').addClass('active');
    var type = $(this).attr('data_type');
    var path = getComponentPath(type, null, componentRootElement);
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: path,
        success: function(data) {
            if (data !== undefined) {
                renderTable(data.programs, data.compareToolTip, data.saveSVGIcon, data.enableSave, data.emptyArialLabel, data.statusArialLabel, componentRootElement);
            }

        },
        error: function(textStatus, errorThrown) {
            console.error('ERROR FROM FILE');


        }
    });

})

if ($(".programlistdesktopwrap").length > 0) {
    $(".programlistdesktopwrap").each(function(_index, eachProgramListComponent) {
        getAllData(eachProgramListComponent);
    });

}

function localResult() {

    if ($('.programlist-tbl tr.lcl').length == 0) {
        $(".programlist-tbl").hide();
        $('.result-info-local').removeClass('hidden');
        $('.result-info-international').addClass('hidden');
    } else {
        $(".programlist-tbl").show();
        $('.result-info-local').addClass('hidden');
        $('.programlist-tbl tr').removeClass('odd').removeClass('even');
        $('.programlist-tbl tr:visible:odd').addClass('odd');
        $('.programlist-tbl tr:visible:even').addClass('even');
    }
}

function internationalRsult() {
    if ($('.programlist-tbl tr.intnl').length == 0) {
        $(".programlist-tbl").hide();
        $('.result-info-international').removeClass('hidden');
        $('.result-info-local').addClass('hidden');
    } else {
        $(".programlist-tbl").show();
        $('.result-info-international').addClass('hidden');
        $('.programlist-tbl tr').removeClass('odd').removeClass('even');
        $('.programlist-tbl tr:visible:odd').addClass('odd');
        $('.programlist-tbl tr:visible:even').addClass('even');
    }
}
$(document).ready(function() {

    if ($(window).width() < 1023) {
        $('.search-filter__overlay').addClass('full-width');
    } else {
        $('.search-filter__mobiclosesection').hide();
    }

});
var campaignheader_url = $('#campaign-header').data("assetUrl");
var campaignheader_ele = $('#campaign-header').attr("id");

if (campaignheader_url) {
    getSmartCropData(campaignheader_url, campaignheader_ele);

}
$(window).load(function() {

    $('#campaign-header').css('height', 'auto');

});
$(document).ready(function() {
    var map_iframe = $('#mapandaddress_iframe');
    if (map_iframe.length > 0) {
        var qval = $('.map-address #latlng').val();
        var apiVal = $('.map-address #googleapi').val();
        map_iframe.attr('src', function(i, val) {
            var marp_url = "https://www.google.com/maps/embed/v1/place?key=" + apiVal + "&q=" + qval;
            return marp_url;
        });

    }
});
if ($('.summary-wrapper').length > 0) {
    var threeColTotal = $('.summary div.col-3').length;
    var oddThree = threeColTotal % 3;
    if (oddThree == 0) {
        $(".summary div.col-3").addClass("border");
        $(".summary div.col-3:nth-last-child(1),.summary div.col-3:nth-last-child(2),.summary div.col-3:nth-last-child(3)").removeClass("border");
    } else {
        for (var i = 0; i < (threeColTotal - oddThree); i++) {
            $(".summary div.col-3").eq(i).addClass("border");
        }
    }
    var twoColumns = $('.summary div.col-2').length;
    var oddTwo = twoColumns % 2;
    if (oddTwo == 0) {
        $(".summary div.col-2").addClass("border");
        $(".summary div.col-2:nth-last-child(1),.summary div.col-2:nth-last-child(2)").removeClass("border");
    } else {
        for (var j = 0; j < (twoColumns - oddTwo); j++) {
            $(".summary div.col-2").eq(j).addClass("border");
        }
    }
}


$(document).ready(function() {
    var homepageBannerType = "Image";

    if ($("#hero__home-video").length > 0) {
        var video = $("#hero__home-video").get(0);
        var playSelector = $(".herobanner__video--playpause");

        var playIcon = $("#play__icon");

        var pauseIcon = $("#pause__icon");

        // Pause and play the video, and change the button text

        playSelector.on('click', function() {

            if (video.paused) {
                video.play();
                playIcon.css("display", "none");
                pauseIcon.css("display", "block");
                $(this).attr("title", "Pause");
            } else {
                video.pause();
                playIcon.css("display", "block");
                pauseIcon.css("display", "none");
                $(this).attr("title", "Play");
            }
            return false;
        });



        if (window.outerWidth > 1024) {
            homepageBannerType = "Video";
            video.play();
        }
    }

    if (typeof digitalData !== "undefined") {
        digitalData.page.pageInfo.campaign["homepageBanner"] = {
            bannerInfo: {
                bannerTitle: $(".homepagebanner h2").text(),
                bannerType: homepageBannerType
            }
        };
    }

    var url = $('#homepage-banner').data("assetUrl");
    var ele = $('#homepage-banner').attr("id") + "|1440|750";
    if (url) {
        getSmartCropData(url, ele);
    }


    $(".search-box--wpr .search-form").submit(function(e) {
        $('#banner-searchbtn').attr('data-analytics-value', $(".search-box--wpr #search-textfield").val());
        submitform(e);
    });

    function submitform(e) {
        if ($(".search-box--wpr #search-textfield").val() == '') {
            e.preventDefault();
            $(".search-box--wpr").addClass('search-box--error');
            $(".search-box--wpr #search-textfield").attr("aria-invalid", "true").attr("aria-describedby", "homepage-banner--error");
            return false;
        } else {
            return true;
        }
    }


    $(".search-textfield").focus(function() {
        $(".search-box--wpr #search-textfield").removeAttr("aria-invalid").removeAttr("aria-describedby");
        $(".search-box--wpr").removeClass('search-box--error');
    });

});

$(document).ready(function() {
    $('.iconsvg__viewall--btn').click(function() {
        $(this).parent().removeClass('active');
        $(this).closest('.iconlistsvg__container').find('.iconsvg__showless--btn').parent().addClass('active');
        $(this).parent().hide();
        $(this).parent().next().show();
        $(this).parent().parent().find('.iconlistsvg__view').slideToggle(500);
    });

    $('.iconsvg__showless--btn').click(function() {
        $(this).parent().removeClass('active');
        $(this).closest('.iconlistsvg__container').find('.iconsvg__viewall--btn').parent().addClass('active');
        $(this).parent().hide();
        $(this).parent().prev().show();
        $(this).parent().parent().find('.iconlistsvg__view').slideToggle(500);
    });

});
if ($('.tabs--wpr').length > 0) {

    $(".tabs--wpr > ul").each(function(index, eachTab) {
        mapTabId(index, eachTab);
    });

    function mapTabId(index, eachTab) {
        $(eachTab).find("li > a").each(function(i, item) {
            $(item).attr("href", "#" + $(item).closest("ul").next().find('>.tab-pane')[i].id);
        });
    }

    $(".tabs--wpr .tab-pane .tab-acc--title a").click(function(e) {
        e.preventDefault();
        if ($(this).parent().parent().hasClass("acc-active")) {
            $(this).attr("aria-expanded", "false").parent().parent().removeClass("acc-active");
        } else {
            $(this).attr("aria-expanded", "true").parent().parent().addClass("acc-active");
        }
    });

    $(".acc-toggle-expand").click(function(e) {
        e.preventDefault();
        var closestTabpane = $(this).closest(".tabs--wpr").find(" > .tab-content > .tab-pane");
        var expandLbl = $(this).find('.acc-expand-lbl');
        var collapseLbl = $(this).find('.acc-collapse-lbl');
        if ($(this).attr("aria-expanded") === "true") {
            closestTabpane.removeClass("acc-active").find(' > .tab-acc--title a').attr("aria-expanded", "false");
            expandLbl.show();
            collapseLbl.hide();
            $(this).attr('aria-label', expandLbl.text()).attr('aria-expanded', 'false');
        } else {
            closestTabpane.addClass("acc-active").find(' > .tab-acc--title a').attr("aria-expanded", "true");
            expandLbl.hide();
            collapseLbl.show();
            $(this).attr('aria-label', collapseLbl.text()).attr('aria-expanded', 'true');
        }
    });

    if (urlParam('activeTab')) {
        var activetabName = urlParam('activeTab').toString();
        var actTab = $('.tabs--wpr .nav-tabs a[data-tabname="' + activetabName + '"]').first();
        var actAccordion = $('.tabs--wpr .tab-content a[data-accname="' + activetabName + '"]').first();
        actTab.tab('show');
        actTab.parent().parent().find('a').attr("tabindex", "-1");
        actTab.attr("tabindex", "0");
        actAccordion.click(); //to show active accordion
        if (actTab.length > 0) {
            if (window.innerWidth > 768) {
                scrollpage(actTab.offset().top);
            } else {
                if (actAccordion.closest(".tabs--wpr").hasClass("enable-mob-accordion")) {
                    scrollpage(actAccordion.offset().top);
                } else {
                    scrollpage(actTab.offset().top);
                }
            }
        }
    }

    // Accessibility arrow tabbing
    $(".tabs--wpr .nav-tabs a").keydown(function(e) {
        if (e.keyCode === 39 && $(this).parent().next().length > 0) {
            $(this).parent().find('a').attr("tabindex", "-1");
            $(this).parent().next().find('a').attr("tabindex", "0").focus().click();
        } else if (e.keyCode === 37 && $(this).parent().prev().length > 0) {
            $(this).parent().find('a').attr("tabindex", "-1");
            $(this).parent().prev().find('a').attr("tabindex", "0").focus().click();
        } else if (e.keyCode === 32) {
            $(this).click();
        }
    });

    function toggleTabRole() {
        if (window.innerWidth <= 768) {
            $('.tabs--wpr.enable-mob-accordion > .tab-content > .tab-pane').removeAttr("role");
        } else {
            $('.tabs--wpr.enable-mob-accordion > .tab-content > .tab-pane').attr("role", "tabpanel");
        }
    }


    toggleTabRole();

    $(window).resize(function() {
        toggleTabRole();
    });

    $(".tabs--wpr .nav-tabs a").click(function(e) {
        $(this).closest('.nav-tabs').find('a').attr('aria-selected', false).attr("tabindex", "-1");
        $(this).attr('aria-selected', true).attr("tabindex", "0");
    });
}


function scrollpage(offsetY) {
    $("html,body").animate({
        scrollTop: offsetY
    }, 100);

    $(window).on('beforeunload', function() {
        $(window).scrollTop(offsetY);
    });
}

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}

$(".tabs--wpr .nav-tabs a").click(function(e) {
    var a = $(this).parents('.tabs').find($(this).attr('href')).find('.feature-carousel__container');
    if (a.length > 0)
        setTimeout(function() {
            var wid = a.width();
            a.find('.slick-slide.slick-current.slick-active').width(wid)
        }, 200);
});

$(".tabs--wpr .tab-acc--title a").click(function(e) {
    var a = $(this).parents(".tab-pane").find(".tab-pane--content").find('.feature-carousel__container');
    if (a.length > 0)
        setTimeout(function() {
            var wid = a.width();
            a.find('.slick-slide.slick-current.slick-active').width(wid)
        }, 100);
});
/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.19
 *
 * Requires: jQuery >= 1.2.3
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register module depending on jQuery using requirejs define.
        define(['jquery'], factory);
    } else {
        // No AMD.
        factory(jQuery);
    }
}(function($) {
    $.fn.addBack = $.fn.addBack || $.fn.andSelf;

    $.fn.extend({

        actual: function(method, options) {
            // check if the jQuery method exist
            if (!this[method]) {
                throw '$.actual => The jQuery method "' + method + '" you called does not exist';
            }

            var defaults = {
                absolute: false,
                clone: false,
                includeMargin: false,
                display: 'block'
            };

            var configs = $.extend(defaults, options);

            var $target = this.eq(0);
            var fix, restore;

            if (configs.clone === true) {
                fix = function() {
                    var css = 'position: absolute !important; top: -1000 !important; ';

                    // this is useful with css3pie
                    $target = $target.
                    clone().
                    attr('style', css).
                    appendTo('body');
                };

                restore = function() {
                    // remove DOM element after getting the width
                    $target.remove();
                };
            } else {
                var tmp = [];
                var style = '';
                var $hidden;

                fix = function() {
                    // get all hidden parents
                    $hidden = $target.parents().addBack().filter(':hidden');
                    style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

                    if (configs.absolute === true) style += 'position: absolute !important; ';

                    // save the origin style props
                    // set the hidden el css to be got the actual value later
                    $hidden.each(function() {
                        // Save original style. If no style was set, attr() returns undefined
                        var $this = $(this);
                        var thisStyle = $this.attr('style');

                        tmp.push(thisStyle);
                        // Retain as much of the original style as possible, if there is one
                        $this.attr('style', thisStyle ? thisStyle + ';' + style : style);
                    });
                };

                restore = function() {
                    // restore origin style values
                    $hidden.each(function(i) {
                        var $this = $(this);
                        var _tmp = tmp[i];

                        if (_tmp === undefined) {
                            $this.removeAttr('style');
                        } else {
                            $this.attr('style', _tmp);
                        }
                    });
                };
            }

            fix();
            // get the actual value with user specific methed
            // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
            // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
            var actual = /(outer)/.test(method) ?
                $target[method](configs.includeMargin) :
                $target[method]();

            restore();
            // IMPORTANT, this plugin only return the value of the first element
            return actual;
        }
    });
}));

var status = "In Progress";
var formid = $('form').attr('id');
var errormessage = "";
var formstep = "1";
if (formid > 0) {
    updateFormDatalayer(formid);
}

function updateFormDatalayer(id) {
    var formData = localStorage.getItem("formData");
    var $formName = $('#' + id + '-T').text();
    var dataArray = {
        "id": id,
        "name": $formName,
        "formstep": formstep,
        "status": status,
        "errormessage": errormessage
    };


    /** will be called in case of Contact us form to append enquiry type to title **/
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString().includes("tfa_")) {
        var str = urlParams.toString();
        var n = str.lastIndexOf('=');
        var result = str.substring(n + 1);
        $formName = $formName + " - " + $('#' + result).text();
        dataArray.name = $formName;
    }

    var $step = "1";

    setTimeout(function() {
        if ($(".wfCurrentPage").attr("id") !== "undefined") {
            $step = $('.wfCurrentPage').attr("id").replace(/^\D+/g, '');
        }
        dataArray.formstep = $step;
    }, 500);

    $(document).on('click', '.wfPagingButtons input , .wfTab', function() {
        if ($(".wfCurrentPage").attr("id") !== "undefined") {
            $step = $('.wfCurrentPage').attr("id").replace(/^\D+/g, '');
        }
        dataArray.formstep = $step;
    });

    $('#' + id).submit(function(e) {
        var isError = false;

        if (wFORMS !== "undefined") {
            wFORMS.behaviors.validation.alert = function(A, B) {

                isError = true;

                if (B.tagName == "INPUT" || B.tagName == "SELECT" || B.tagName == "TEXTAREA") {
                    $(B).find(B.tagName).focus();
                }
                dataArray.status = "Error";
                dataArray.errormessage = A;
                if (typeof digitalData !== "undefined") {
                    digitalData["form"] = dataArray;
                }
            }

        }


        if (isError == false) {
            dataArray.status = "Success";
            dataArray.errormessage = "";
        }
        localStorage.setItem("formData", JSON.stringify(dataArray));
    });

    if (typeof digitalData !== "undefined") {
        if (formData && $('#' + id).length == 0) {
            digitalData["form"] = JSON.parse(localStorage.getItem("formData"));
        } else {
            digitalData["form"] = dataArray;
        }

    }
}



// for synchronous form assembly forms
if (document.querySelector('.trackFormAnalytics')) {
    var elem = document.querySelector('.trackFormAnalytics form')
    setAnalyticUpdate(elem.id);
}



function setAnalyticUpdate(id) {
    generateFormData(id)
    $('#' + id).find('.primaryAction').attr('data-analytics-button=\"' + id + ' form submit button\"');
    $('#' + id).find('.wfPageNextButton').attr('data-analytics-button=\"' + id + ' form next button\"');
    $('#' + id).find('.wfPagePreviousButton').attr('data-analytics-button=\"' + id + ' form previous button\"');
}

var formSubmit = false;
// update digital data generic methods
function generateFormData(id) {
    let form = document.getElementById(id);

    var formName = id + " form";
    if ($('#' + id + '-T').length > 0) {
        formName = $('#' + id + '-T').text();
    }

    var step = 'NA';

    setTimeout(function() {
        updateInProgress(form, formName, step);
    }, 500);

    $(document).on('click', '.wfPagingButtons input , .wfTab', function() {
        updateInProgress(form, formName, step);
    });


    updateDataLayer(formName, step, 'In Progress', '');
    form.addEventListener('submit', () => {
        setTimeout(() => {
            const errors = form.querySelectorAll('.errFld');
            if (errors.length > 0 || validateRecaptcha(form) === 'error') {
                updateDataLayer(formName, step, 'Error', 'Validation Error');
            } else {
                updateDataLayer(formName, step, '', '');
            }
        }, 100);
        formSubmit = true;
    });

    handleUnload(form, formName);
}

function updateInProgress(form, formName, step) {
    var stepElm = form.querySelector(".wfCurrentPage");
    if (stepElm) {
        step = stepElm.attr("id").replace(/^\D+/g, '');
        updateDataLayer(formName, step, 'In Progress', '');
    }
}



function handleUnload(form, formName) {
    $(window).on('beforeunload', function() {
        if (formSubmit) {
            const errors = form.querySelectorAll('.errFld');
            if (errors.length === 0 && validateRecaptcha(form) !== 'error') {
                updateDataLayer(formName, 'NA', 'Success', '');
            } else {
                updateDataLayer(formName, 'NA', 'Error', 'Validation Error');
            }
        }
        return true;
    });
}

function validateRecaptcha(form) {
    let captchaStatus;
    const errorcaptcha = form.querySelector('.error-capcha');
    if (window.grecaptcha.getResponse().length <= 0) {
        if (errorcaptcha) {
            errorcaptcha.style.display = 'block';
            errorcaptcha.classList.add('errFld')
        }
        captchaStatus = 'error';
    } else {
        if (errorcaptcha) {
            errorcaptcha.style.display = 'none';
            errorcaptcha.classList.remove('errFld');
        }
        captchaStatus = 'success';
    }
    return captchaStatus;
}


function updateDataLayer(formName, formStep, formStatus, errorMsg) {
    const digiData = window.digitalData;
    if (digiData && formName) {
        digiData.form = {};
        digiData.form.name = formName;
        digiData.form.formstep = formStep;
        digiData.form.status = formStatus;
        digiData.form.errormessage = errorMsg;
    }
    window.digitalData = digiData;
}

window.timebox = 5000;
var disabletootip;

function saveCourses(componentRootElement) {
    var rootElement = $("body");
    if (componentRootElement) {
        rootElement = $(componentRootElement);
    }
    if ($(rootElement).find('.save-opt-wpr').length > 0) {
        window.savelimit = getLimit();

        updateDigitalData();

        setActiveCourse(rootElement);


        $('.maxcourses').text(window.savelimit);

        onSaveBtnTrigger(rootElement);

        $(rootElement).find('.save-opt-wpr .save-btn, .close-save-tooltip').keydown(function(e) {
            if (e.keyCode == 13) {
                $(this).click();
            }
        });

        $(rootElement).find('.close-save-tooltip').click(function(e) {
            e.preventDefault()
            var rect = e.currentTarget.getBoundingClientRect();
            var wpr = $(e.currentTarget).closest('.save-tooltip');
            if (e.clientX <= rect.right && e.clientX >= rect.left && e.clientY <= rect.bottom && e.clientY >= rect.top) {
                wpr.parent().find('.save-btn').focus();
            }
            wpr.parent().removeClass('dis-tooltip');
            wpr.hide();
        });

        saveFocusfix();


    }

}

function saveFocusfix() {
    $('.save-opt-wpr').focusout(function(e) {
        var _this = this;
        var chkactele = this.matches(':focus-within:not(:focus)');
        if (!chkactele) {
            showTooltip(_this);
        } else {
            if ($(_this).find('.save-tooltip:visible').length > 0) {
                clearTimeout(disabletootip);
                $(_this).addClass("dis-tooltip").find(".save-tooltip").show();
            }
        }
    });

    $('.save-opt-wpr').focusin(function(e) {
        clearTimeout(disabletootip);
        if ($(this).hasClass('dis-tooltip'))
            $(this).addClass("dis-tooltip").find(".save-tooltip").show();
    });
}

function showTooltip(_this) {
    disabletootip = setTimeout(function() {
        $(_this).removeClass("dis-tooltip").find(".save-tooltip").fadeOut();
    }, window.timebox);
}

function setAccessibleAttr(elm, isactive) {
    if (isactive) {
        $(elm).attr('aria-label', elm.dataset.unsaveProgram);
        $(elm).attr('data-analytics-value', 'unsave');
        $(elm).attr("aria-checked", "true");
    } else {
        $(elm).attr('aria-label', elm.dataset.saveProgram);
        $(elm).attr('data-analytics-value', 'compare');
        $(elm).attr("aria-checked", "false");
    }
}


function onSaveBtnTrigger(rootElement) {
    $(rootElement).find('.save-opt-wpr .save-btn').click(function(e) {
        e.preventDefault();
        var savedcourses = [];
        if (localStorage.savedcourses) {
            savedcourses = JSON.parse(localStorage.savedcourses);
        }
        var courseid = "";
        var coursename = "";
        var coursepath = "";
        var parent = e.currentTarget.parentElement;
        courseid = parent.dataset.courseId;
        coursename = parent.dataset.courseName;
        coursepath = parent.dataset.coursePath;


        var exceedInfo = $(this).parent().find('.save-tooltip .save-limit-exceeds');
        var notexceedInfo = $(this).parent().find('.save-tooltip .save-before-exceeds');
        if (courseid) {

            $(".save-tooltip").hide().parent().removeClass("dis-tooltip");
            $(this).parent().find('.save-tooltip .currentlimit').text();

            var found = false;
            for (var eachCourse of savedcourses) {
                if (eachCourse.courseId == courseid) {
                    found = true;
                }

            }
            if (found) {
                //lets remove the program and make it inactive;
                parent.classList.remove("active");
                savedcourses = savedcourses.filter(function(obj) {
                    return obj.courseId !== courseid;
                });

                setAccessibleAttr(e.currentTarget, false);
            } else if (savedcourses.length < window.savelimit) {
                //lets add the program if it is in the limit
                parent.classList.add("active");
                var newCourse = {};
                newCourse.courseId = courseid;
                newCourse.courseName = coursename;
                newCourse.coursePath = coursepath;
                savedcourses.push(newCourse);
                localStorage.setItem('savedcourses', JSON.stringify(savedcourses));
                notexceedInfo.show().find('.show-while-unsave').hide().parent().find('.show-while-save').show().find('.currentlimit').text(window.savelimit - savedcourses.length);
                exceedInfo.hide();

                $(parent).addClass("dis-tooltip").find(".save-tooltip").show();
                setAccessibleAttr(e.currentTarget, true);

            } else if (savedcourses.length >= window.savelimit) {
                //show error saying exceeded
                exceedInfo.show();
                notexceedInfo.hide();

                $(parent).addClass("dis-tooltip").find(".save-tooltip").show();
                setAccessibleAttr(e.currentTarget, false);

            }

            localStorage.savedcourses = JSON.stringify(savedcourses);

            updateCoursesCount();
        }
        updateDigitalData();
    });


}

function setActiveCourse(rootElement) {
    var saveComps = $(rootElement).find('.save-opt-wpr');
    var storedCourses = localStorage.savedcourses;
    if (storedCourses) {
        var savedcourseslist = JSON.parse(storedCourses);
        for (var saveComp of saveComps) {
            var courseId = saveComp.dataset.courseId;
            savedcourseslist.forEach(function(x) {
                if (x.courseId == courseId) {
                    saveComp.classList.add("active");
                    setAccessibleAttr(saveComp.querySelector('.save-btn'), true);
                }
            });
        }
    }
}

function getLimit() {
    var limit = window.savelimit;
    return (!limit || limit === "") ? 10 : parseInt(limit);
}

function updateCoursesCount() {
    var coursesStored = localStorage.savedcourses;
    if ($('.compare-link').length > 0) {
        var compareLink = $('.compare-link').attr("data-compare-path");
        var suggestionLink = $('.save-sug-link.mobile').attr("suggestion-link");
        if (coursesStored && JSON.parse(coursesStored).length > 0) {
            $('.compare-link .compare-link__count').text(JSON.parse(coursesStored).length).parent().parent().addClass('active').attr('data-analytics-value', JSON.parse(coursesStored).length).attr('href', compareLink);
        } else {
            $('.compare-link .compare-link__count').text("").parent().parent().removeClass('active').attr('data-analytics-value', 0).attr('href', suggestionLink);
        }
    }
}

function updateDigitalData() {
    var savedCourse = localStorage.getItem("savedcourses");
    if (savedCourse) {
        var courseLen = JSON.parse(savedCourse);
        if (courseLen.length > 0 && (window.digitalData && digitalData.page && digitalData.page.pageInfo)) {
            var courseArray = [];
            var onlineCourseArray = [];
            digitalData.page.pageInfo.attributes.savedonlinecoursetitle = "";
            digitalData.page.pageInfo.attributes.savedcoursecode = "";
            for (var course of courseLen) {
                if (course.coursePath && course.coursePath.includes('/online')) {
                    onlineCourseArray.push(course.courseName);
                    digitalData.page.pageInfo.attributes.savedonlinecoursetitle = onlineCourseArray.join("|");
                } else {
                    courseArray.push(course.courseId);
                    digitalData.page.pageInfo.attributes.savedcoursecode = courseArray.join("|");
                }
            }
            digitalData.page.pageInfo.attributes.savedcoursecount = courseLen.length;
        } else if (window.digitalData && digitalData.page && digitalData.page.pageInfo) {
            digitalData.page.pageInfo.attributes.savedcoursecode = "";
            digitalData.page.pageInfo.attributes.savedcoursecount = "";
        }
    }
}


saveCourses();