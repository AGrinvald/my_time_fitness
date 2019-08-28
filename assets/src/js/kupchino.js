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
        center: [59.78987504525991, 30.123560632812463], zoom: 10,
        imgUrls: ["img/1.png", "img/2.png", 'img/3.png'], imgSize: [55, 76]
    },
    Medium: {
        center: [60.11397765479358, 30.438044275390556], zoom: 9,
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
        [59.82853206432565, 30.39268299999999], {
            id: 2,
            hintContent: 'Санкт-Петербург м.Купчино, ул. Олеко Дундича 10/2, 1 этаж'
        }, {
            iconLayout: createLayout(2)
        }
    );

    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');
    map.behaviors.disable(['scrollZoom']);
    map.controls.remove('zoomControl');
    map.controls.add('zoomControl', { position: { right: '10px', bottom: '20px'}, size: 'small'});
    
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

        //console.log(map.getCenter());
    });

    ymaps.geoQuery(akademicheskaya).addToMap(map);
}

function moveToSelected(element) {
    var gallery = $("div.gallery-carousel");

    if (element == "next") {
        var selected = $("div.gallery-carousel .selected").next();
    } else if (element == "prev") {
        var selected = $("div.gallery-carousel .selected").prev();
    } else {
        var selected = element;
    }
   
    var amount = $("div.gallery-carousel div").length;
    var selectedIndex = $(".gallery-carousel div.slide").index($(selected));
    console.log(selectedIndex);

    if (element == "next" && amount <= selectedIndex + 2) {
        var firstSlide = gallery.find("div.slide:first-child");
        firstSlide.clone().appendTo(gallery);
        firstSlide.remove();
    } else if (element == "prev" && selectedIndex < 2) {
        var lastSlide = gallery.find("div.slide:last-child");
        lastSlide.clone().prependTo(gallery);
        lastSlide.remove();
    } 

    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();

    $(selected).removeClass().addClass("slide").addClass("selected");
    $(prev).removeClass().addClass("slide").addClass("prev");
    $(next).removeClass().addClass("slide").addClass("next");

    $(nextSecond).removeClass().addClass("slide").addClass("nextRight");
    $(prevSecond).removeClass().addClass("slide").addClass("prevLeft");

    $(nextSecond).nextAll().removeClass().addClass("slide").addClass('hideRight');
    $(prevSecond).prevAll().removeClass().addClass("slide").addClass('hideLeft');
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