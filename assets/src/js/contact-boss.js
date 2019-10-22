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
            $("#promo-modal .modal-body").html(html);
        });
    }
}

$(function () {
    $('#contact-boss-modal').on('shown.bs.modal', function (e) {
        $("#contact-boss-modal .promo-btn").bind("click", modalNextClick);
    });
});