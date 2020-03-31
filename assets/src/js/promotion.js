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
    var email = document.getElementById("promoEmail");

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

    $('#club-name').html(name);
}

$(function () {

    setClubName();

    $("#bossContactPhone").mask("+7(999) 999-99-99");
    $("#promoPhone").mask("+7(999) 999-99-99");

    $('#promo-modal').on('shown.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", modalNextClick);
        $("#promoPhone").mask("+7(999) 999-99-99");
        // if ($(".promo-dropdown a.dropdown-item")) {

        //     $(".promo-dropdown a.dropdown-item").click(function (event) {
        //         event.preventDefault();

        //         $(".promo-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
        //         $(".promo-dropdown").find('input:hidden').val($(this).data('value'));
        //     });
        // }
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
    });

    $('.open-modal-link').click(function (event) {
        event.preventDefault();
        var self = $(this);

        var toSelect = self.data('select');
        var hash = self.data('hash');
        var club = sessionStorage.getItem('club-link');

        if (toSelect || !club) {
            $('.club-link').each(function () {
                var link = $(this).data('link');
                $(this).attr("href", `/${link}${hash ? hash : ''}`)
            });

            $(".club-link").on("click", function (e) {
                var name = $(this).data('name');
                var link = $(this).data('link');

                sessionStorage.setItem('club-link', link);
                sessionStorage.setItem('club-name', name);

                setClubName();
                $('#clubs-modal').modal('hide');

                if (toSelect) {
                    return false;
                }
            });

            $('#clubs-modal').modal('show');
        } else {
            window.location.href = `/${club}${hash ? hash : ''}`;
        }
    });
});