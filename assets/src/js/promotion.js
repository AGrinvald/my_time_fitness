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

function modalNextClick() {

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
    var name = sessionStorage.getItem('club-name');

    if (!name) {
        name = 'Выберите ваш клуб'
    }

    $('#club-name').html('Ваш клуб <span class="n-bottom-club">' + name + '</span>');
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

$(function () {

    setClubName();

    $('body')
        .on('mouseenter mouseleave', '.navbar .dropdown', toggleDropdown)
        .on('click', '.navbar a.nav-club-link', toggleDropdown);

    $('.navbar a.dropdown-item').click(storeHash);

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
    $("#promoPhone").mask("+7(999) 999-99-99");

    $('#promo-modal').on('show.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", modalNextClick);
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