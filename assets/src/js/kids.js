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
    var email = document.getElementById("clientEmail"); 

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
            $("#kids-request-modal .modal-body").html(html);
        });
    }
}

$(function () {
    
    $('#kids-request-modal').on('shown.bs.modal', function (e) {
        $("#clientPhone").mask("+7(999) 999-99-99");
        $("#kids-request-modal .promo-btn").bind("click", modalNextClick);

        $(".kids-dropdown a.dropdown-item").click(function (event) {
            event.preventDefault();

            $(".kids-dropdown").find('.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
            $(".kids-dropdown").find('input:hidden').val($(this).data('value'));
        });
    });

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#bossContactPhone").mask("+7(999) 999-99-99");
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
    });
});