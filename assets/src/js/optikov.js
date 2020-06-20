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

// импортируем jQuery Masked Input
//= ../../../node_modules/jquery.maskedinput/src/jquery.maskedinput.js

// Импортируем Owl
//= ../../../node_modules/owl.carousel/dist/owl.carousel.js
//=./waterwheel.js

var map;
var windowsSize = {
    Medium: 2,
    Large: 3,
};

var mapSettingsCollection = {
    Large: {
        center: [59.99950430055228, 30.20306198749192], zoom: 14,
        imgUrls: ["img/1.png", "img/2.png", 'img/3.png', 'img/4.png'], imgSize: [55, 76]
    },
    Medium: {
        center: [60.00685152257632, 30.219946304289866], zoom: 14,
        imgUrls: ["img/1small.png", "img/2small.png", 'img/3small.png', 'img/4small.png'], imgSize: [44, 58]
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
                    circleShape = {
                        type: 'Rectangle', coordinates: [
                            [-mapSettings.imgSize[0] / 2, -mapSettings.imgSize[1] / 2],
                            [mapSettings.imgSize[0] / 2, mapSettings.imgSize[1] / 2]]
                    };
                element.appendChild(img);

                element.style.width = mapSettings.imgSize[0];
                element.style.height = mapSettings.imgSize[1];

                element.style.marginLeft = -mapSettings.imgSize[0] / 2 + 'px';
                element.style.marginTop = -mapSettings.imgSize[1] / 2 + 'px';
                element.style.left = -mapSettings.imgSize[0] / 2 + 'px';
                element.style.top = -mapSettings.imgSize[1] / 2 + 'px';

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
        [59.99910206407877, 30.220116499999992], {
        id: 0,
        hintContent: 'Санкт-Петербург м.Беговая, ул. Оптиков 30'
    }, {
        iconLayout: createLayout(3)
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
    map.controls.add('zoomControl', { position: { right: '10px', bottom: '20px' }, size: 'small' });

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

function promoNextClick() {
    var next = $(this).data("next");

    var name = document.getElementById("promoName");
    var phone = document.getElementById("promoPhone");

    if (!name.checkValidity()) {
        name.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!phone.checkValidity()) {
        phone.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (name.checkValidity() && phone.checkValidity()) {
        var next = $(this).data("next");

        $.ajax({
            url: next,
            dataType: 'html'
        }).done(function (html) {
            $("#promo-modal .modal-body").html(html);
        });
    }
}

var md = 992;
var lg = 1400;

function announceNextClick() {
    var name = document.getElementById("announceName");
    var phone = document.getElementById("announcePhone");

    if (!name.checkValidity()) {
        name.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!phone.checkValidity()) {
        phone.parentElement.setAttribute("style", "background-color: #FFDBDC");
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

function couponNextClick() {
    var phone = document.getElementById("couponPhone");

    if (!phone.checkValidity()) {
        phone.setAttribute("style", "background-color: #FFDBDC");
    }

    if (phone.checkValidity()) {
        var next = $(this).data("next");

        $.ajax({
            url: next,
            dataType: 'html'
        }).done(function (html) {
            $(".banner-area .promo-block .inner").html(html);
        });
    }
}

function bossModalNextClick() {

    var name = document.getElementById("bossContactName");
    var phone = document.getElementById("bossContactPhone");
    var email = document.getElementById("bossContactEmail");
    var message = document.getElementById("bossContactMessage");

    if (!name.checkValidity()) {
        name.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!phone.checkValidity()) {
        phone.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!email.checkValidity()) {
        email.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (name.checkValidity() && phone.checkValidity() && email.checkValidity()) {
        var next = $(this).data("next");

        $.ajax({
            url: next,
            dataType: 'html'
        }).done(function (html) {
            $("#contact-boss-modal .modal-body").html(html);
        });
    }
}

function setClubName() {
    sessionStorage.setItem('club-link', 'optikov.html');
    sessionStorage.setItem('club-name', 'Оптиков');

    $('#club-name').html('Ваш клуб <span class="n-bottom-club">Оптиков</span>');
    $('#header-club-name').html('Оптиков');
}

function scrollToSection() {
    var hash = sessionStorage.getItem('club-hash');

    if (hash) {
        setTimeout(function () {
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 'slow', function () {
                sessionStorage.removeItem('club-hash')
            });

        }, 1000);
    }
}

function pageNavClick(event) {
    event.preventDefault();

    if (this.hash !== "") {
        var hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 'slow');
    }
}

$(function () {

    setClubName();
    scrollToSection();

    $('.navbar a.nav-link').click(pageNavClick);
    $("a.page-nav-item").click(pageNavClick);

    $('#signupFormBtn').bind("click", announceNextClick);
    $('#couponFormBtn').bind("click", couponNextClick);

    $("#couponPhone").mask("+7(999) 999-99-99");
    $("#bossContactPhone").mask("+7(999) 999-99-99");
    $("#announcePhone").mask("+7(999) 999-99-99");

    $('#promo-modal').on('show.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", promoNextClick);
        $("#promoPhone").mask("+7(999) 999-99-99");

        $('#selectedPromoClub').val('Оптиков');
    });

    $('.gallery-area button.prev-btn').click(function () {
        moveToSelected('prev');
    });

    $('.gallery-area button.next-btn').click(function () {
        moveToSelected('next');
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
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
            dots: false,
            items: 1,
            onTranslated: function (property) {
                $(".number-animation").removeClass("number-scale");

                var current = property.item.index;
                var item = $(property.target).find(".owl-item").eq(current).find(".slide").data('number');

                $('.' + item).addClass('number-scale');
            }
        };

    if ($(window).width() < md) {
        owl.owlCarousel(owlOptions);
    } else {
        owl.addClass('off');
    }

    if ($(window).width() < lg) {
        galleryOwl.addClass('owl-carousel');
        galleryOwl.owlCarousel(galleryOwlOptions);
    } else {
        $(".gallery-carousel").waterwheel();
        galleryOwl.addClass('off');
    }

    $(window).resize(function () {

        if ($(window).width() < md) {
            if ($('.scheme-slides').hasClass('off')) {
                owl.owlCarousel(owlOptions);
                owl.removeClass('off');
            }
        } else {
            if (!$('.scheme-slides').hasClass('off')) {
                owl.addClass('off').trigger('destroy.owl.carousel');
                owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
            }
        }

        if ($(window).width() < lg) {
            $(".gallery-carousel").waterwheel('destroy');
            if ($('.gallery-carousel').hasClass('off')) {
                galleryOwl.addClass('owl-carousel');
                galleryOwl.owlCarousel(galleryOwlOptions);
                galleryOwl.removeClass('off');
            }
        } else {
            galleryOwl.removeClass('owl-carousel');

            if (!$('.gallery-carousel').hasClass('off')) {
                galleryOwl.addClass('off').trigger('destroy.owl.carousel');
                galleryOwl.find('.owl-stage-outer').children(':eq(0)').unwrap();
            }

            $(".gallery-carousel").waterwheel();
        }
        
    });

    $("#scroll-control").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#scroll-control').fadeIn();
        } else {
            $('#scroll-control').fadeOut();
        }
    });

});