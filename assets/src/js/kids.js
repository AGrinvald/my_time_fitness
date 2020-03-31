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

    if(!name) {
        name = 'Выберите ваш клуб'
    } 

    $('#club-name').html(name);
}

$(function () {
    
    setClubName();

    $('#kids-request-modal').on('shown.bs.modal', function (e) {
        $("#clientPhone").mask("+7(999) 999-99-99");
        $("#kids-request-modal .promo-btn").bind("click", modalNextClick);

        $(".kids-dropdown a.dropdown-item").click(function (event) {
            event.preventDefault();

            $(".kids-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
            $(".kids-dropdown").find('input:hidden').val($(this).data('value'));
        });
    });

    $('#kids-season-modal').on('shown.bs.modal', function (e) {

        var button = $(e.relatedTarget) // Button that triggered the modal
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

        modal.find(".kids-season-dropdown a.dropdown-item").click(function (event) {
            event.preventDefault();

            $(".kids-season-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
            $(".kids-season-dropdown").find('input:hidden').val($(this).data('value'));
        });
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