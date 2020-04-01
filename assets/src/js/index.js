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

// импортируем jQuery Masked Input
//= ../../../node_modules/jquery.maskedinput/src/jquery.maskedinput.js

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
        center: [60.20874891762144, 30.372126306640563], zoom: 13,
        imgUrls: ["img/1small.png", "img/2small.png", 'img/3small.png'], imgSize: [44, 58]
    }
};

var centerPoints = [
    [60.0066198557117, 30.229417072509765],
    [60.0085957593716, 30.38656056396479],
    [59.82606894374578, 30.377313508422816]
];

var mapSettings = null;
var currentSize = windowsSize.Large;

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
                element.style.top = -1 * mapSettings.imgSize[1] + 'px';

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

    console.log(mapSettings.zoom);

    map = new ymaps.Map("map", {
        center: mapSettings.center,
        zoom: mapSettings.zoom,
    });

    var kupchino = new ymaps.Placemark(
        [59.82853206432565, 30.39268299999999], {
        id: 2,
        hintContent: 'Санкт-Петербург м.Купчино, ул. Олеко Дундича 10/2, 1 этаж'
    }, {
        iconLayout: createLayout(2)
    }
    );

    var komendanskiy = new ymaps.Placemark(
        [60.00816706410207, 30.2457365], {
        id: 0,
        hintContent: 'Санкт-Петербург м.Комендантский, ул. Бутлерова 42 а, 3 этаж, ТК Призма'
    }, {
        iconLayout: createLayout(0)
    }
    );

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

    ymaps.geoQuery(komendanskiy).addToMap(map);
    ymaps.geoQuery(akademicheskaya).addToMap(map);
    ymaps.geoQuery(kupchino).addToMap(map);

    if (width < 977) {
        //map.behaviors.disable(['drag']);
        $(".club-block-nav:first-child").click();
    }
}

function signupNextClick() {
    var next = $(this).data("next");

    $.ajax({
        url: next,
        dataType: 'html'
    }).done(function (html) {
        $(".signup-container").html(html);

        if ($("#signupPhone").length > 0) {
            $("#signupPhone").mask("+7(999) 999-99-99");
        }

        $(".signup-btn").bind("click", signupNextClick);

        if ($(".signup-dropdown a.dropdown-item")) {

            $(".signup-dropdown a.dropdown-item").click(function (event) {
                event.preventDefault();

                $(".signup-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
                $(".signup-dropdown").find('input:hidden').val($(this).data('value'));
            });
        }
    });
}

function signupModalNextClick() {

    var name = document.getElementById("signupName");
    var phone = document.getElementById("signupPhone");

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
            $("#signup-modal .modal-body").html(html);
            $("#signup-modal .signup-btn").bind("click", signupModalNextClick);
        });
    }

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

function bossModalNextClick() {

    var name = document.getElementById("bossContactName");
    var phone = document.getElementById("bossContactPhone");
    var email = document.getElementById("bossContactEmail");

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
    var name = sessionStorage.getItem('club-name');

    if (!name) {
        name = 'Выберите ваш клуб'
    }

    $('#club-name').html(name);
}

$(function () {

    setClubName();

    var md = 992;

    $("#bossContactPhone").mask("+7(999) 999-99-99");
    $('#signupFormBtn').bind("click", signupNextClick);

    $('#signup-modal').on('shown.bs.modal', function (e) {
        $("#signup-modal .signup-btn").bind("click", signupModalNextClick);
        $("#signupPhone").mask("+7(999) 999-99-99");

        if ($(".signup-dropdown a.dropdown-item")) {

            $(".signup-dropdown a.dropdown-item").click(function (event) {
                event.preventDefault();

                $(".signup-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
                $(".signup-dropdown").find('input:hidden').val($(this).data('value'));
            });
        }
    });

    $('#promo-modal').on('shown.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", promoNextClick);
        $("#promoPhone").mask("+7(999) 999-99-99");
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
    });

    var owl = $('.banner-slides').owlCarousel({
        items: 1,
        loop: true,
        mouseDrag: false,
        // autoplay: true,
        // autoplaySpeed: 1000,
        // autoplayTimeout: 3000,
        // autoplayHoverPause: true,
        responsive: {
            992: {
                dots: false,
                nav: true
            },
            0: {
                dots: true,
                nav: false
            }
        },
        navText: ["", ""]
    });

    //owl.trigger('play.owl.autoplay', [3000])

    $('.features').owlCarousel({
        mouseDrag: false,
        responsive: {
            1195: {
                items: 3,
                nav: false
            },
            0: {
                items: 1,
                nav: true,
                center: true
            }
        },
        navText: ["", ""]
    });

    $('.signup-slides').owlCarousel({
        items: 1,
        loop: true,
        mouseDrag: false,
        nav: true,
        navText: ["", ""]
    });

    var scheduleOwl = $('.schedule-slides'),
        owlOptions = {
            loop: true,
            mouseDrag: false,
            nav: true,
            navText: ["", ""],
            onTranslated: function (event) {
                var clubBlock = $(event.target).find('.owl-item.active > .club-schedule-block')[0];
                var newUrl = $(clubBlock).data("link");

                $('.schedule-btn').attr("href", newUrl);
            },
            items: 1
        };

    if ($(window).width() < md) {
        scheduleOwl.owlCarousel(owlOptions);
    } else {
        scheduleOwl.addClass('off');
    }

    $(window).resize(function () {
        if ($(window).width() < md) {
            if ($('.schedule-slides').hasClass('off')) {
                scheduleOwl.owlCarousel(owlOptions);
                scheduleOwl.removeClass('off');
            }

        } else {
            if (!$('.schedule-slides').hasClass('off')) {
                scheduleOwl.addClass('off').trigger('destroy.owl.carousel');
                scheduleOwl.find('.owl-stage-outer').children(':eq(0)').unwrap();
            }
        }
    });

    $(".club-block-nav").click(function (event) {
        var self = $(this);

        var geoObjects = ymaps.geoQuery(map.geoObjects);
        var idStr = self.data("id");

        var id = parseInt(idStr);
        var selected = geoObjects.search("properties.id = " + id);
        var result = geoObjects.setOptions('visible', false);

        result.then(function () {

            var placemark = selected.get(0);
            var markCoords = placemark.geometry.getCoordinates();

            var coords = [markCoords[0], markCoords[1]];

            coords[0] = coords[0] + 0.005;
            zoom = 13;

            var moving = new ymaps.map.action.Single({
                center: coords,
                zoom: zoom,
                timingFunction: 'ease-in',
                checkZoomRange: true,
                duration: 1500,
                callback: function (err) {
                    selected.setOptions('visible', true);
                }
            });

            map.action.execute(moving);
        });

    });

    $(".club-block-lg").click(function (event) {
        event.preventDefault();
        var self = $(this);

        var hasClass = self.hasClass("active");
        var geoObjects = ymaps.geoQuery(map.geoObjects);

        var result;

        if (hasClass) {
            result = geoObjects.setOptions('visible', true);

            result.then(function () {
                self.removeClass("active");
                $(".club-info-block").remove();

                var moving = new ymaps.map.action.Single({
                    center: mapSettings.center,
                    zoom: mapSettings.zoom,
                    timingFunction: 'ease-in',
                    checkZoomRange: true,
                    duration: 1500
                });

                map.action.execute(moving);
            });
        } else {
            var idStr = self.data("id");
            var area = self.data("area");
            var hall = self.data("hall");
            var link = self.data("link");

            var programs = self.data("programs");

            var id = parseInt(idStr);
            var selected = geoObjects.search("properties.id = " + id);
            result = geoObjects.setOptions('visible', false);

            result.then(function () {

                var placemark = selected.get(0);
                var markCoords = placemark.geometry.getCoordinates();

                var coords = [markCoords[0], markCoords[1]];
                var coords = centerPoints[id];
                var zoom = 14;

                var moving = new ymaps.map.action.Single({
                    center: coords,
                    zoom: zoom,
                    timingFunction: 'linear',
                    checkZoomRange: true,
                    duration: 10,
                    callback: function (err) {
                        selected.setOptions('visible', true);

                        $(".club-block").removeClass("active");
                        self.addClass("active");

                        $(".club-info-block").remove();

                        $('<div class="club-info-block"> \
                        <div class="d-flex align-self-end align-items-center"> \
                    <div class="inner-div d-flex">\
                      <div>\
                        <div class="info-top">\
                          Площадь клуба\
                        </div>\
                        <div class="info-bottom">' +
                            area
                            + '</div>\
                      </div>\
                      <div>\
                          <div class="info-top">\
                              Тренажерный зал\
                          </div>\
                          <div class="info-bottom">' +
                            hall
                            + '</div>\
                        </div>\
                        <div>\
                            <div class="info-top">\
                                Зал групповых программ\
                            </div>\
                            <div class="info-bottom">' +
                            programs
                            + '</div>\
                          </div>\
                    </div>\
                    <a href="' + link + '"class="btn btn-rounded btn-primary club-info-btn">О клубе</a>\
                    </div>\
                  </div>').appendTo(".map-area .clubs-block .container");
                    }
                });

                map.action.execute(moving);
            });
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

    $('.open-modal-link').click(function (event) {
        event.preventDefault();
        var self = $(this);

        var toSelect = self.data('select');
        var hash = self.data('hash');
        var club = sessionStorage.getItem('club-link');

        var currentURL = window.location.href;
        currentURL = currentURL.substring(0, currentURL.lastIndexOf('/'));

        if (toSelect || !club) {
            $('.club-link').each(function () {
                var link = $(this).data('link');
                $(this).attr("href", currentURL.concat('/', link, hash ? hash : '')); 
            });

            $(".club-link").on("click", function (e) {
                var name = $(this).data('name');
                var link = $(this).data('link');

                sessionStorage.setItem('club-link', link);
                sessionStorage.setItem('club-name', name);

                setClubName();
                $('#clubs-modal').modal('hide');

                return false;

            });

            $('#clubs-modal').modal('show');
        } else {
            window.location.href = currentURL.concat('/', club, hash ? hash : '');
        }
    });

});