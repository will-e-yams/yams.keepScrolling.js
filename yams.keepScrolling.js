/* ========================================================================
* yams.keepScrolling.js
* version:	1.0
* author:	Brad Williams <brad.lee.williams@gmail.com>
*           thanks Bootstrap for the plugin template
* ======================================================================== */

+function ($) {
    'use strict';

    // keepScrolling PUBLIC CLASS DEFINITION
    // ===============================

    var KeepScrolling = function (element, options) {
        this.options =
		this.element = null

        this.init('keepScrolling', element, options)
    }

    KeepScrolling.DEFAULTS = {
        pagenumber: 1,
        pagesize: 10,
        auto: true,
        threshold: 50, //scroll threshold in px
        loadMoreTemplate: '<div class="clearfix keepScrolling more">Load More</div>',
    }

    KeepScrolling.prototype.init = function (type, element, options) {
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)

        if (!this.options.url)
            alert('keepScrolling.url is undefined');

        // load initial data
        this.loadMore(this.options.pagenumber);

        // load more button
        this.$element.on('click.yams.keepScrolling', '.keepScrolling.more', $.proxy(function () {
            this.loadMore(parseInt(this.lastpageloaded) + 1);
        }, this));

        // monitor scroll event
        if (this.options.auto)
            this.$element.on('scroll.yams.keepScrolling', $.proxy(function () {
                var distanceToBottom = (this.$element[0].scrollHeight - this.$element.scrollTop() - this.$element.innerHeight());
                if (distanceToBottom < this.options.threshold)
                    this.loadMore(parseInt(this.lastpageloaded) + 1);
            }, this));
    }

    KeepScrolling.prototype.getDefaults = function () {
        return KeepScrolling.DEFAULTS
    }

    KeepScrolling.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)
        return options
    }

    KeepScrolling.prototype.scroll = function () {
        console.log('scroll');
    }

    KeepScrolling.prototype.loadMore = function (pagenumber) {
        var qsChar = '?';
        if (this.options.url.indexOf('?') >= 0)
            qsChar = '&';

        this.lastpageloaded = pagenumber;
        this.nextpage = $('<div class="keepScrolling" data-keepScrolling-page="' + pagenumber + '"></div>');
        this.nextpage.load(this.options.url + qsChar + 'pagesize=' + this.options.pagesize + '&pagenumber=' + pagenumber,
               $.proxy(function (e) {
                   this.$element.find('.keepScrolling.more').remove();
                   this.$element.append(this.nextpage);
                   // add button
                   if (!this.options.auto)
                       this.$element.append(this.options.loadMoreTemplate);
                   this.$element.trigger('loaded.yams.keepScrolling');
               }, this)
        );
    }

    // keepScrolling PLUGIN DEFINITION
    // =========================

    var old = $.fn.keepScrolling

    $.fn.keepScrolling = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('yams.keepScrolling')
            var options = typeof option == 'object' && option

            if (!data) $this.data('yams.keepScrolling', (data = new KeepScrolling(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.keepScrolling.Constructor = KeepScrolling


    // keepScrolling NO CONFLICT
    // ===================

    $.fn.keepScrolling.noConflict = function () {
        $.fn.keepScrolling = old
        return this
    }

}(jQuery);

