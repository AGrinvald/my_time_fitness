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

function bossModalNextClick() {

    var name = document.getElementById("bossContactName");
    var phone = document.getElementById("bossContactPhone");

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
            $("#contact-boss-modal .modal-body").html(html);
        });
    }
}

function modalNextClick() {
    var name = document.getElementById("clientName");
    var phone = document.getElementById("clientPhone");

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
            $("#kids-request-modal .modal-body").html(html);
        });
    }
}

function seasonNextClick() {
    var name = document.getElementById("clientSeasonName");
    var phone = document.getElementById("clientSeasonPhone");

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
            $("#kids-season-modal .modal-body").html(html);
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
            currentURL = currentURL.substring(0, currentURL.indexOf('/'));
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
    $('.nav-small-club').click(kidPromoLinkClick);

    $(".club-link").on("click", function (e) {
        var name = $(this).data('name');
        var link = $(this).data('link');

        sessionStorage.setItem('club-link', link);
        sessionStorage.setItem('club-name', name);

        setClubName();
        $('#clubs-modal').modal('hide');

        return true;
    });

    var club = sessionStorage.getItem('club-name');

    if (!club) {
        $('#clubs-modal').modal('show');
    }

    $('#kids-request-modal').on('show.bs.modal', function (e) {
        $("#clientPhone").mask("+7(999) 999-99-99");
        $("#kids-request-modal .promo-btn").bind("click", modalNextClick);

        $("#kids-request-modal").find("#clientName").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        $("#kids-request-modal").find("#clientPhone").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        var name = sessionStorage.getItem('club-name');
        $("#kids-request-modal").find('#selectedClub').val(name);
    });

    $('#kids-season-modal').on('show.bs.modal', function (e) {

        var button = $(e.relatedTarget) 
        var name = button.data('name')
        var price = button.data('price');
        var style = button.data('style');

        var modal = $(this)
        modal.find('.season-name').text(name);
        modal.find('.season-price').text(price);
        modal.find('.season-block').removeAttr('class')
            .attr('class', 'season-block d-flex').addClass(style);
        modal.find('#season-name').val(name);

        modal.find("#clientSeasonPhone").mask("+7(999) 999-99-99");
        modal.find(".promo-btn").bind("click", seasonNextClick);

        $("#kids-season-modal").find("#clientSeasonName").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        $("#kids-season-modal").find("#clientSeasonPhone").change(function (e) {
            $(e.target).parent().css("background-color", "#FFFFFF");
        });

        var name = sessionStorage.getItem('club-name');
        $("#kids-season-modal").find('#selectedClub').val(name);
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#bossContactPhone").mask("+7(999) 999-99-99");
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