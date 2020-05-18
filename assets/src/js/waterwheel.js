(function ($) {

    var $gallery = null;
    
    var methods = {
        init: function () {
            return this.each(function () {

                var $this = $(this);
                var data = $this.data('waterwheel');

                if (!data) {
                    $this.children(".slide").addClass("hideRight");
                    $this.children(".slide").eq(0).removeClass("hideRight").addClass("prevSecond");
                    $this.children(".slide").eq(1).removeClass("hideRight").addClass("prev");
                    $this.children(".slide").eq(2).removeClass("hideRight").addClass("selected");
                    $this.children(".slide").eq(3).removeClass("hideRight").addClass("next");
                    $this.children(".slide").eq(4).removeClass("hideRight").addClass("nextSecond");

                    var $buttons = $('<div class="buttons">\
                    <button class= "prev-btn" ></ >\
                    <button class="next-btn"></button>\
                    </div >');

                    $this.after($buttons);
                    $buttons.find(".next-btn").on('click', methods.nextClick);
                    $buttons.find(".prev-btn").on('click', methods.prevClick);

                    $this.data('waterwheel', {
                        target: $this,
                        prevSecond: $this.children(".slide").eq(0),
                        prev: $this.children(".slide").eq(1),
                        selected: $this.children(".slide").eq(2),
                        next: $this.children(".slide").eq(3),
                        nextSecond: $this.children(".slide").eq(4),
                        buttons: $buttons
                    });
                    $gallery = $this;
                    methods.calcPositions();
                }
            });
        },
        nextClick: function () {
            methods.moveTo('next');
        },
        prevClick: function () {
            methods.moveTo('prev');
        },
        moveTo: function (direction) {

            var data = $gallery.data('waterwheel');
            var $selected = null;

            if (direction == "next") {
                $selected = data.next;
            } else if (direction == "prev") {
                $selected = data.prev;
            }

            var $next = $selected.next();
            var $prev = $selected.prev();

            if($prev.prev().length === 0 ) {
                var lastSlide = $gallery.find("div.slide:last-child");
                lastSlide.clone().prependTo($gallery);
                lastSlide.remove();
            }

            if($next.next().length === 0) {
                var firstSlide = $gallery.find("div.slide:first-child");
                firstSlide.clone().appendTo($gallery);
                firstSlide.remove();
            }

            var $prevSecond = $prev.prev();
            var $nextSecond = $next.next();

            $selected.removeClass().addClass("slide").addClass("selected");
            $prev.removeClass().addClass("slide").addClass("prev");
            $next.removeClass().addClass("slide").addClass("next");

            $nextSecond.removeClass().addClass("slide").addClass("nextSecond");
            $prevSecond.removeClass().addClass("slide").addClass("prevSecond");

            $nextSecond.nextAll().removeClass().addClass("slide").addClass('hideRight').css({"width": "auto", "left": "", "top": ""});
            $prevSecond.prevAll().removeClass().addClass("slide").addClass('hideLeft').css({"width": "auto", "left": "", "top": ""});

            var newData = Object.assign({}, data, {
                prevSecond: $prevSecond,
                prev: $prev,
                selected: $selected,
                next: $next,
                nextSecond: $nextSecond,
            });
            $gallery.data('waterwheel', newData);
            methods.calcPositions();
        },
        calcPositions: function() {
            var data = $gallery.data('waterwheel');

            var $selected = data.selected;
            var $next = data.next;
            var $prev = data.prev;
            var $prevSecond = data.prevSecond;
            var $nextSecond = data.nextSecond;
    
            var containerWidth = data.target.width();
            $selected.css({ top: 0 });
    
            var selectedWidth = containerWidth * 57.3 / 100;
            var secondWidth = containerWidth * 39 / 100;
            var thirdWidth = containerWidth * 29.9 / 100;
    
            $selected.width(selectedWidth);
            $next.width(secondWidth);
            $prev.width(secondWidth);
            $nextSecond.width(thirdWidth);
            $prevSecond.width(thirdWidth);
    
            var selectedLeft = (containerWidth - selectedWidth) / 2;
            $selected.css({ left: selectedLeft });
            
            var secondX = (containerWidth - selectedWidth - 2 * (secondWidth / 3)) / 2;
            $next.css({ left: containerWidth - secondX - secondWidth });
            $prev.css({ left: secondX });
    
            var thirdX = (containerWidth - selectedWidth - 2 * (secondWidth / 3) - 2 * (thirdWidth / 3)) / 2;
            $nextSecond.css({ left: containerWidth - thirdX - thirdWidth });
            $prevSecond.css({ left: thirdX });
    
            var secondY = (selectedWidth * 0.66878981 - secondWidth * 0.66878981) / 2;
            $next.css({ top: secondY });
            $prev.css({ top: secondY });
    
            var thirdY = (selectedWidth * 0.66878981 - thirdWidth * 0.66878981) / 2;
            $nextSecond.css({ top: thirdY });
            $prevSecond.css({ top: thirdY });

            $gallery.children('.hideRight').css({ top: thirdY});
            $gallery.children('.hideLeft').css({ top: thirdY});
        },
        destroy: function () {
            return this.each(function () {

                var $this = $(this);
                var data = $this.data('waterwheel');

                if (data) {
                    $this.children().removeClass("hideRight");
                    $this.children().removeClass("prevSecond");
                    $this.children().removeClass("prev");
                    $this.children().removeClass("selected");
                    $this.children().removeClass("next");
                    $this.children().removeClass("nextSecond");
                    $this.children().css({"width": "auto", "left": "", "top": ""});

                    var $buttons = data.buttons;
                    $buttons.find(".next-btn").on('click', methods.nextClick);
                    $buttons.find(".prev-btn").on('click', methods.prevClick);
                    $buttons.remove();
                    
                    $this.removeData('waterwheel');
                    $gallery = null;
                }
            });
        }
    };

    $.fn.waterwheel = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.waterwheel');
        }

    };
})(jQuery);