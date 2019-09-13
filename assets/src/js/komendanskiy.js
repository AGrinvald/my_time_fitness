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
        center: [59.799564175206164, 30.090601648437463], zoom: 10,
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
                    element = this.getParentElement().getElementsByClassName('club')[0],
                    circleShape = {type: 'Rectangle', coordinates: [
                        [-mapSettings.imgSize[0] / 2, -mapSettings.imgSize[1] / 2], 
                        [mapSettings.imgSize[0] / 2, mapSettings.imgSize[1] / 2]]};
                element.appendChild(img);

                element.style.width = mapSettings.imgSize[0];
                element.style.height = mapSettings.imgSize[1];

                element.style.marginLeft = -mapSettings.imgSize[0] / 2 + 'px';
                element.style.marginTop = -mapSettings.imgSize[1] / 2 + 'px';
                element.style.left =  -mapSettings.imgSize[0] / 2 + 'px';
                element.style.top =  -mapSettings.imgSize[1] / 2 + 'px';

                options.set('shape', circleShape);
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
            id: 0,
            hintContent: 'ул. Ильюшина, 14, ТК Долгоозерный, 3 этаж'
        }, {
            iconLayout: createLayout(0)
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

    calcPositions();
}

function calcWidth(percent) {
    var containerWidth = $("div.gallery-carousel").width();
    var elWidth = containerWidth * percent / 100;

    return elWidth;
}


var md = 992;
var lg = 1400;

function calcPositions() {

    var selected = $("div.gallery-carousel .selected");
    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();
    
    var containerWidth = $("div.gallery-carousel").width();
    selected.css({top: 0});

    var selectedWidth = calcWidth(57.3);
    var secondWidth = calcWidth(39);
    var thirdWidth = calcWidth(29.9);

    selected.width(selectedWidth);
    next.width(secondWidth);
    prev.width(secondWidth);
    nextSecond.width(thirdWidth);
    prevSecond.width(thirdWidth);

    var selectedLeft = (containerWidth - selectedWidth) / 2;
    selected.css({left: selectedLeft});

    var secondX = (containerWidth - selectedWidth - 2*(secondWidth/3))/2;
    next.css({left: containerWidth - secondX - secondWidth});
    prev.css({left: secondX});

    var thirdX = (containerWidth - selectedWidth - 2*(secondWidth/3) - 2*(thirdWidth/3))/2;
    nextSecond.css({left: containerWidth - thirdX - thirdWidth});
    prevSecond.css({left: thirdX});

    var secondY = (selectedWidth*0.66878981 - secondWidth*0.66878981) / 2;
    next.css({top: secondY});
    prev.css({top: secondY});

    var thirdY = (selectedWidth*0.66878981 - thirdWidth*0.66878981) / 2;
    nextSecond.css({top: thirdY});
    prevSecond.css({top: thirdY});
}

function galleryReset() {
    var selected = $("div.gallery-carousel .selected");
    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();
    selected.css('width', 'auto');
    next.css('width', 'auto');
    prev.css('width', 'auto');
    prevSecond.css('width', 'auto');
    nextSecond.css('width', 'auto');
    selected.css('left', '');
    next.css('left', '');
    prev.css('left', '');
    prevSecond.css('left', '');
    nextSecond.css('left', '');
    selected.css('top', '');
    next.css('top', '');
    prev.css('top', '');
    prevSecond.css('top', '');
    nextSecond.css('top', '');
}

function announceNextClick() {
    let name = document.getElementById("announceName"); 
    let phone = document.getElementById("announcePhone"); 

    if (!name.checkValidity()) {
        name.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!phone.checkValidity()) {
        phone.setAttribute("style", "background-color: #FFDBDC");
    }

    if (name.checkValidity() && phone.checkValidity()) {
        var next = $(this).data("next");

        $.ajax({
            url: next,
            dataType: 'html'
        }).done(function (html) {
            $(".announce-block").html(html);
        });
    }
}

$(function () {

    $('#signupFormBtn').bind("click", announceNextClick);

    $('.gallery-area button.prev-btn').click(function () {
        moveToSelected('prev');
    });

    $('.gallery-area button.next-btn').click(function () {
        moveToSelected('next');
    });

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
        calcPositions();
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
            galleryReset();
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

            calcPositions();
        }
    });
});