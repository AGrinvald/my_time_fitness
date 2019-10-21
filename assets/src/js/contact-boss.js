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
    $('#promo-modal').on('shown.bs.modal', function (e) {
        $("#promo-modal .promo-btn").bind("click", modalNextClick);
    });
});