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
        imgUrls: ["img/1.png", "img/2.png", 'img/3.png', 'img/4.png'], imgSize: [55, 76]
    },
    Medium: {
        center: [60.13485370575094, 30.372126306640563], zoom: 9,
        imgUrls: ["img/1small.png", "img/2small.png", 'img/3small.png', 'img/4small.png'], imgSize: [44, 58]
    }
};

var centerPoints = [
    [60.0066198557117, 30.229417072509765],
    [60.0085957593716, 30.38656056396479],
    [59.82606894374578, 30.377313508422816],
    [59.99793695032447, 30.200749622558583]
];

var coordinates = [
    [60.00816706410207, 30.2457365],
    [60.01065856407727, 30.403732499999954],
    [59.82853206432565, 30.39268299999999],
    [59.99910206407877, 30.220116499999992]
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

                    placemarkMap.events.add('boundschange', function () {
                        this.rebuild();
                    }, this);
                }

                var img = document.createElement("img");
                img.src = mapSettings.imgUrls[id];
                img.width = mapSettings.imgSize[0];
                img.height = mapSettings.imgSize[1];
                img.id = 'map-pointer-' + id;

                var options = this.getData().options,
                    element = this.getParentElement().getElementsByClassName('club')[0];

                var shape = {
                    type: 'Rectangle', coordinates: [
                        [-mapSettings.imgSize[0] / 2, -mapSettings.imgSize[1] / 2],
                        [mapSettings.imgSize[0] / 2, mapSettings.imgSize[1] / 2]]
                };

                element.appendChild(img);

                element.style.width = mapSettings.imgSize[0];
                element.style.height = mapSettings.imgSize[1];

                element.id = 'map-pointer-' + id;
                element.style.marginLeft = -mapSettings.imgSize[0] / 2 + 'px';
                element.style.marginTop = -mapSettings.imgSize[1] / 2 + 'px';
                element.style.left = -mapSettings.imgSize[0] / 2 + 'px';
                element.style.top = -1 * mapSettings.imgSize[1] + 'px';


                $('#map-pointer-' + id).bind('click', function () {
                    this.onClubClick(id);
                });

                if (id === 3) {
                    var geometry = this.getData().geometry;
                    var zoom = placemarkMap.getZoom();

                    var optikovCoords = [];
                    optikovCoords[0] = coordinates[3][0];

                    if (zoom <= 10) {
                        optikovCoords[1] = coordinates[3][1] - 0.04;
                    } else {
                        optikovCoords[1] = coordinates[3][1];
                    }

                    geometry.setCoordinates(optikovCoords);
                }

                options.set('shape', shape);
                options.set('iconOffset', [-mapSettings.imgSize[0], -mapSettings.imgSize[1]]);
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

    var komendanskiy = new ymaps.Placemark(
        coordinates[0], {
        id: 0,
        hintContent: 'Санкт-Петербург м.Комендантский, ул. Бутлерова 42 а, 3 этаж, ТК Призма'
    }, {
        iconLayout: createLayout(0)
    }
    );

    var akademicheskaya = new ymaps.Placemark(
        coordinates[1], {
        id: 1,
        hintContent: 'Санкт-Петербург м.Академическая, пр. Ильюшина, 14  ТК «Долгоозерный», 3 этаж'
    }, {
        iconLayout: createLayout(1)
    }
    );

    var kupchino = new ymaps.Placemark(
        coordinates[2], {
        id: 2,
        hintContent: 'Санкт-Петербург м.Купчино, ул. Олеко Дундича 10/2, 1 этаж'
    }, {
        iconLayout: createLayout(2)
    }
    );

    var optikov = new ymaps.Placemark(
        [coordinates[3][0], coordinates[3][1]], {
        id: 3,
        hintContent: 'Санкт-Петербург м.Беговая, ул. Оптиков, 30'
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

    kupchino.events.add(['click'], function (e) {
        if (width >= 977) {
            $('#kupchino').click();
        } else {
            $('#kupAccord').click();
        }
    });

    akademicheskaya.events.add(['click'], function (e) {
        if (width >= 977) {
            $('#akademicheskaya').click();
        } else {
            $('#akadAccord').click();
        }
    });

    komendanskiy.events.add(['click'], function (e) {
        if (width >= 977) {
            $('#komendanskiy').click();
        } else {
            $('#komAccord').click();
        }
    });

    optikov.events.add(['click'], function (e) {
        if (width >= 977) {
            $('#optikov').click();
        } else {
            $('#optAccord').click();
        }
    });

    map.events.add('sizechange', function (event) {
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
    ymaps.geoQuery(optikov).addToMap(map);
}

function getElementInsideContainer(containerID, childID) {
    var elm = {};
    var elms = document.getElementById(containerID).getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
        if (elms[i].id === childID) {
            elm = elms[i];
            break;
        }
    }
    return elm;
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

        if ($(".signup-btn").length > 0) {

            $(".signup-btn").bind("click", function () {

                var name = getElementInsideContainer("signup-container", "signupName");
                var phone = getElementInsideContainer("signup-container", "signupPhone");

                if (!name.checkValidity()) {
                    name.parentElement.setAttribute("style", "background-color: #FFDBDC");
                }

                if (!phone.checkValidity()) {
                    phone.parentElement.setAttribute("style", "background-color: #FFDBDC");
                }

                var promoClub = $(".signup-dropdown").find('input:hidden').val();

                if (!promoClub) {
                    $(".signup-dropdown").parent().css("background-color", "#FFDBDC");
                }

                if (name.checkValidity() && phone.checkValidity() && promoClub) {
                    var next = $(this).data("next");

                    $.ajax({
                        url: next,
                        dataType: 'html'
                    }).done(function (html) {
                        $(".signup-container").html(html);
                    });
                }
            });
        }

        if ($(".signup-dropdown a.dropdown-item")) {

            var selectedClub = sessionStorage.getItem('club-name');

            if (selectedClub) {
                $(".signup-dropdown").find('.dropdown-toggle').html(selectedClub + ' <span class="caret"></span>');
                $(".signup-dropdown").find('input:hidden').val(selectedClub);
            }

            $(".signup-dropdown a.dropdown-item").click(function (event) {
                event.preventDefault();

                $(".signup-dropdown").find('.dropdown-toggle').html($(event.target).text() + ' <span class="caret"></span>');
                $(".signup-dropdown").find('input:hidden').val($(event.target).text());
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

    var promoClub = $(".signup-dropdown").find('input:hidden').val();

    if (!promoClub) {
        $(".signup-dropdown").parent().css("background-color", "#FFDBDC");
    }

    if (name.checkValidity() && phone.checkValidity() && promoClub) {
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

    var promoClub = $(".promo-dropdown").find('input:hidden').val();

    if (!promoClub) {
        $(".promo-dropdown").parent().css("background-color", "#FFDBDC");
    }

    if (!name.checkValidity()) {
        name.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (!phone.checkValidity()) {
        phone.parentElement.setAttribute("style", "background-color: #FFDBDC");
    }

    if (name.checkValidity() && phone.checkValidity() && promoClub) {
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
        $('#club-name').html(name);
    } else {
        $('#club-name').html('Ваш клуб <span class="n-bottom-club">' + name + '</span>');
    }

    $('#header-club-name').html(name);
}

function toggleDropdown(e) {
    var _d = $(e.target).closest('.dropdown'),
        _m = $('.dropdown-menu', _d);
    var club = sessionStorage.getItem('club-name');
    var link = sessionStorage.getItem('club-link');

    setTimeout(function () {

        if (e.type == 'click' && club) {

            var hash = $(e.target).data('hash');

            if (!hash) {
                hash = '';
            }

            sessionStorage.setItem('club-hash', hash);

            var currentURL = window.location.href;
            currentURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
            window.location.href = currentURL.concat('/', link);
        }

        var shouldOpen = e.type !== 'click' && _d.is(':hover') && !club;

        if (e.type !== 'click') {
            _m.toggleClass('show', shouldOpen);
            _d.toggleClass('show', shouldOpen);
        }

    }, e.type === 'mouseleave' ? 100 : 0);

    if (club) {
        return false;
    }
}


function storeHash(e) {
    var hash = $(e.target).data('hash');

    if (!hash) {
        hash = '';
    }

    sessionStorage.setItem('club-hash', hash);
}

function kidPromoLinkClick(event) {
    event.preventDefault();
    var clubLink = sessionStorage.getItem('club-link');
    var url = $(event.target).attr("href");

    function redirectToPage() {
        var link = $(this).data('link');
        window.location.href = url.concat('/', link);
    }

    $(".club-link").on("click", redirectToPage);

    if (!clubLink) {
        $('#clubs-modal').on('hidden.bs.modal', function () {
            $(".club-link").off("click", redirectToPage);
        });
        $('#clubs-modal').modal('show');
    } else {
        window.location.href = url.concat('/', clubLink);
    }
}

$(function () {
    setClubName();

    $('body')
        .on('mouseenter mouseleave', '.navbar .dropdown', toggleDropdown)
        .on('click', '.navbar a.nav-club-link', toggleDropdown);

    $('.navbar a.dropdown-item').click(storeHash);
    $('.promo-area .schedule-link a').click(storeHash);
    $('.promo-area a.accordion-body-btn').click(storeHash);
    $('.nav-small-club').click(kidPromoLinkClick);

    $(".club-link").on("click", function (e) {
        var name = $(this).data('name');
        var link = $(this).data('link');

        sessionStorage.setItem('club-link', link);
        sessionStorage.setItem('club-name', name);

        setClubName();
        $('#clubs-modal').modal('hide');
        return false;
    });

    var club = sessionStorage.getItem('club-name');

    if (!club) {
        $('#clubs-modal').modal('show');
    }

    $("#bossContactPhone").mask("+7(999) 999-99-99");
    $('#signupFormBtn').bind("click", signupNextClick);

    $('#accordionMap').on('shown.bs.collapse', function (e) {
        var clicked = $('#accordionMap').find('.accordion-btn').not(".collapsed").first();
        var scroll = parseInt(clicked.data('scroll'));

        $('#accordionMap').animate({
            scrollTop: scroll
        }, 300);

    });

    $('#signup-modal').on('shown.bs.modal', function (e) {
        $("#signup-modal .signup-btn").bind("click", signupModalNextClick);
        $("#signupPhone").mask("+7(999) 999-99-99");

        var selectedClub = sessionStorage.getItem('club-name');

        if (selectedClub) {
            $(".signup-dropdown").find('.dropdown-toggle').html(selectedClub + ' <span class="caret"></span>');
            $(".signup-dropdown").find('input:hidden').val(selectedClub);
        }

        $("#signup-modal").find("#promoName").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        $("#signup-modal").find("#promoPhone").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        if ($(".signup-dropdown a.dropdown-item")) {

            $(".signup-dropdown a.dropdown-item").click(function (event) {
                event.preventDefault();

                $(".signup-dropdown").parent().css("background-color", "#FFFFFF");
                $(".signup-dropdown").find('.dropdown-toggle').html($(event.target).text() + ' <span class="caret"></span>');
                $(".signup-dropdown").find('input:hidden').val($(event.target).text());
            });
        }
    });

    $('#promo-modal').on('show.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", promoNextClick);
        $("#promoPhone").mask("+7(999) 999-99-99");

        var selectedClub = sessionStorage.getItem('club-name');

        if (selectedClub) {
            $(".promo-dropdown").find('.dropdown-toggle').html(selectedClub + ' <span class="caret"></span>');
            $(".promo-dropdown").find('input:hidden').val(selectedClub);
        }

        $("#promo-modal").find("#promoName").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        $("#promo-modal").find("#promoPhone").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        if ($(".promo-dropdown a.dropdown-item")) {

            $(".promo-dropdown a.dropdown-item").click(function (event) {
                event.preventDefault();

                $(".promo-dropdown").parent().css("background-color", "#FFFFFF");
                $(".promo-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
                $(".promo-dropdown").find('input:hidden').val($(event.target).text());
            });
        }
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
    });

    var owl = $('.banner-slides').owlCarousel({
        items: 1,
        loop: true,
        mouseDrag: false,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
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

    owl.trigger('play.owl.autoplay', [3000])

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

    $(".map-accordion-btn").click(function (event) {
        var self = $(this);

        var hasClass = self.hasClass("active");
        var geoObjects = ymaps.geoQuery(map.geoObjects);

        var result;

        if (hasClass) {
            result = geoObjects.setOptions('visible', true);

            result.then(function () {
                self.removeClass("active");
                var moving = new ymaps.map.action.Single({
                    center: mapSettings.center,
                    zoom: mapSettings.zoom,
                    timingFunction: 'ease-in',
                    checkZoomRange: true,
                    duration: 500
                });

                map.action.execute(moving);
            });
        } else {
            var idStr = self.data("id");

            var id = parseInt(idStr);
            var selected = geoObjects.search("properties.id = " + id);
            result = geoObjects.setOptions('visible', false);

            result.then(function () {

                var placemark = selected.get(0);
                var markCoords = placemark.geometry.getCoordinates();

                var coords = [markCoords[0], markCoords[1]];

                coords[0] = coords[0] + 0.01;

                var currentZoom = map.getZoom();

                if (currentZoom === 9 && id === 3) {
                    coords[1] = coords[1] + 0.04;
                }

                zoom = 13;

                var moving = new ymaps.map.action.Single({
                    center: coords,
                    zoom: zoom,
                    timingFunction: 'ease-in',
                    checkZoomRange: true,
                    duration: 500,
                    callback: function (err) {
                        $(".map-accordion-btn").removeClass("active");
                        self.addClass("active");
                        selected.setOptions('visible', true);
                    }
                });

                map.action.execute(moving);
            });
        }
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
                    duration: 500
                });

                map.action.execute(moving);
            });
        } else {
            var information = self.data("info");
            var infoStr = "";

            for (var j = 0; j < information.length; j++) {
                infoStr = infoStr.concat('<div>', '<div class="info-top">', information[j].title, '</div>',
                    '<div class="info-bottom">', information[j].value, '</div>', '</div>');
            }

            var idStr = self.data("id");
            var link = self.data("link");

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
                    duration: 500,
                    callback: function (err) {
                        selected.setOptions('visible', true);

                        $(".club-block").removeClass("active");
                        self.addClass("active");

                        $(".club-info-block").remove();

                        $('<div class="club-info-block"> \
                        <div class="d-flex align-self-end align-items-center"> \
                    <div class="inner-div d-flex">' +
                            infoStr +
                            '</div>\
                    <a data-link="'+ link + '" href="' + link + '"class="btn btn-rounded btn-primary club-info-btn">О клубе</a>\
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
});