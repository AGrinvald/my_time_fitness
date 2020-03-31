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

    if(!name) {
        name = 'Выберите ваш клуб'
    } 

    $('#club-name').html(name);
}

$(function () {

    setClubName();
    
    if ($(window).width() < 992) {

        (function () {
            var moretext = "Развернуть описание";
            var lesstext = "Свернуть описание";
            var lineHeight = 18*1.75;
            var lines = 4;

            $('.truncate-text').each(function () {
                var content = $(this).html();

                if ($(this).height() > lineHeight * lines) {

                    if ($(this).attr('title')) {
                        $(this).text($(this).attr('title'));
                    }

                    var text = $(this).text();

                    $(this).attr('title', $(this).text().trim());
                    $(this).text("");

                    var str = "";
                    var prevstr = "";
                    var words = text.split(" ");

                    for (var i = 0; i < words.length; i++) {
                        if ($(this).height() > lineHeight * lines) {
                            var hiddenText = words.slice(i-1).join(' ');

                            var visibleText = prevstr.trim() + 
                            '<span class="morecontent"><span class="hidden-text">' + hiddenText + 
                            '</span>&nbsp;&nbsp;<a href="" class="morelink more"><span>' + moretext + 
                            '</span></a></span>';

                            $(this).html(visibleText);

                            break;
                        }

                        prevstr = str;
                        str += words[i] + " ";
                        $(this).html(str.trim());
                    }
                }
            });

            $(".morelink").click(function () {
                if ($(this).hasClass("more")) {
                    $(this).removeClass("more");
                    $(this).html("<span>" + lesstext + "</span>");
                } else {
                    $(this).addClass("more");
                    $(this).html("<span>" + moretext + "</span>");
                }

                $(this).parent().prev().slideToggle("fast");
                $(this).prev().slideToggle("fast");

                return false;
            });

        })();
    }

    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", bossModalNextClick);
        $("#bossContactPhone").mask("+7(999) 999-99-99");
    });

    $('.level-slides').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: true,
        navText: ["", ""],
        dots: false
    });

    $('.level-img-slides-1').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: false,
        navText: ["", ""],
        dots: true
    });

    $('.level-img-slides-2').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: false,
        navText: ["", ""],
        dots: true
    });

    $('.weight-slides').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: true,
        navText: ["", ""],
        dots: false
    });

    $('.weight-img-slides-1').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: false,
        navText: ["", ""],
        dots: true
    });

    $('.weight-img-slides-2').owlCarousel({
        items: 1,
        mouseDrag: false,
        nav: false,
        navText: ["", ""],
        dots: true
    });


    $('.stack-slides').owlCarousel({
        items: 1,
        loop: true,
        mouseDrag: false,
        nav: true,
        navText: ["", ""],
        dots: false
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