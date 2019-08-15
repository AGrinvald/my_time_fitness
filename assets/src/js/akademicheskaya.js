// импортируем jQuery
//= ../../../node_modules/jquery/dist/jquery.js

// импортируем Popper
//= ../../../node_modules/popper.js/dist/umd/popper.js

// импортируем необходимые js-файлы Bootstrap 4
//= ../../../node_modules/bootstrap/js/dist/util.js
//= ../../../node_modules/bootstrap/js/dist/alert.js
//= ../../../node_modules/bootstrap/js/dist/button.js
//= ../../../node_modules/bootstrap/js/dist/carousel.js
//= ../../../node_modules/bootstrap/js/dist/collapse.js
//= ../../../node_modules/bootstrap/js/dist/dropdown.js
//= ../../../node_modules/bootstrap/js/dist/modal.js
//= ../../../node_modules/bootstrap/js/dist/tooltip.js
//= ../../../node_modules/bootstrap/js/dist/popover.js
//= ../../../node_modules/bootstrap/js/dist/scrollspy.js
//= ../../../node_modules/bootstrap/js/dist/tab.js
//= ../../../node_modules/bootstrap/js/dist/toast.js

// Импортируем Owl
//= ../../../node_modules/owl.carousel/dist/owl.carousel.js

var map;
var windowsSize = {
    Medium: 2,
    Large: 3,
};

var mapSettingsCollection = {
    Large: {
        center: [59.91630318065146, 30.07137557421872], zoom: 10,
        imgUrls: ["img/1.png", "img/2.png", 'img/3.png'], imgSize: [55, 76]
    },
    Medium: {
        center: [60.257601202906805, 30.394098962890602], zoom: 9,
        imgUrls: ["img/1small.png", "img/2small.png", 'img/3small.png'], imgSize: [44, 58]
    }
};

var createLayout = function (id) {
    var Layout = ymaps.templateLayoutFactory.createClass(
        '<div class="club"></div>',
        {
            build: function () {
                Layout.superclass.build.call(this);
                var placemarkMap = this.getData().geoObject.getMap();

                if (!this.inited) {
                    this.inited = true;

                    placemarkMap.events.add('sizechange', function () {
                        this.rebuild();
                    }, this);
                }

                var img = document.createElement("img");
                img.src = mapSettings.imgUrls[id];
                img.width = mapSettings.imgSize[0];
                img.height = mapSettings.imgSize[1];

                var options = this.getData().options,
                    element = this.getParentElement().getElementsByClassName('club')[0];
                element.appendChild(img);
            }
        }
    );

    return Layout;
};

function init() {

    var width = document.documentElement.clientWidth;

    if (width >= 977) {
        currentSize = windowsSize.Large;
        mapSettings = mapSettingsCollection.Large;
    } else {
        currentSize = windowsSize.Medium;
        mapSettings = mapSettingsCollection.Medium;
    }

    map = new ymaps.Map("map", {
        center: mapSettings.center,
        zoom: mapSettings.zoom,
    });

    var akademicheskaya = new ymaps.Placemark(
        [60.01065856407727, 30.403732499999954], {
            id: 1,
            hintContent: 'Санкт-Петербург м.Академическая, пр. Ильюшина, 14  ТК «Долгоозерный», 3 этаж'
        }, {
            iconLayout: createLayout(1)
        }
    );

    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');
    map.behaviors.disable(['scrollZoom']);

    map.events.add('sizechange', function (event) {
        var size = map.container.getSize();
        var width = size[0];
        var toChange = false;

        if (toChange = (width >= 975 && currentSize != windowsSize.Large)) {
            currentSize = windowsSize.Large;
            mapSettings = mapSettingsCollection.Large;

        } else if (toChange = (width < 975 && currentSize != windowsSize.Medium)) {
            currentSize = windowsSize.Medium;
            mapSettings = mapSettingsCollection.Medium;
        }

        if (toChange) {
            map.setCenter(mapSettings.center, mapSettings.zoom);
        }
    });

    ymaps.geoQuery(akademicheskaya).addToMap(map);
}

function moveToSelected(element) {

    if (element == "next") {
        var selected = $(".gallery-area .selected").next();
    } else if (element == "prev") {
        var selected = $(".gallery-area .selected").prev();
    } else {
        var selected = element;
    }

    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();

    $(selected).removeClass().addClass("selected");

    $(prev).removeClass().addClass("prev");
    $(next).removeClass().addClass("next");

    $(nextSecond).removeClass().addClass("nextRightSecond");
    $(prevSecond).removeClass().addClass("prevLeftSecond");

    $(nextSecond).nextAll().removeClass().addClass('hideRight');
    $(prevSecond).prevAll().removeClass().addClass('hideLeft');
}

$(function () {

    $('.gallery-area button.prev-btn').click(function () {
        moveToSelected('prev');
    });

    $('.gallery-area button.next-btn').click(function () {
        moveToSelected('next');
    });

    var md = 992;
    var lg = 1195;

    var galleryOwl = $('.gallery-carousel'),
        galleryOwlOptions = {
            loop: true,
            mouseDrag: false,
            navText: ["", ""],
            responsive: {
                0: {
                    items: 1,
                    nav: true
                }
            }
        };

    var owl = $('.scheme-slides'),
        owlOptions = {
            loop: true,
            mouseDrag: false,
            navText: ["", ""],
            responsive: {
                0: {
                    items: 1
                }
            }
        };

    if ($(window).width() < md) {
        var owlActive = owl.owlCarousel(owlOptions);
    } else {
        owl.addClass('off');
    }

    if ($(window).width() < lg) {
        galleryOwl.addClass('owl-carousel');
        var galleryActive = galleryOwl.owlCarousel(galleryOwlOptions);
    } else {
        galleryOwl.addClass('off');
    }

    $(window).resize(function () {

        if ($(window).width() < md) {
            if ($('.scheme-slides').hasClass('off')) {
                var owlActive = owl.owlCarousel(owlOptions);
                owl.removeClass('off');
            }

        } else {
            if (!$('.scheme-slides').hasClass('off')) {
                owl.addClass('off').trigger('destroy.owl.carousel');
                owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
            }
        }

        if ($(window).width() < lg) {
            if ($('.gallery-carousel').hasClass('off')) {
                galleryOwl.addClass('owl-carousel');
                var galleryActive = galleryOwl.owlCarousel(galleryOwlOptions);
                galleryOwl.removeClass('off');
            }
        } else {
            galleryOwl.removeClass('owl-carousel');

            if (!$('.gallery-carousel').hasClass('off')) {
                galleryOwl.addClass('off').trigger('destroy.owl.carousel');
                galleryOwl.find('.owl-stage-outer').children(':eq(0)').unwrap();
            }
        }
    });
});