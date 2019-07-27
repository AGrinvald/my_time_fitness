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
    center: [60.1677166120527, 30.394098962890602], zoom: 9,
    imgUrls: ["img/1small.png", "img/2small.png", 'img/3small.png'], imgSize: [44, 58]
  }
};

var mapSettings = null;
var currentSize = null;

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
          element = this.getParentElement().getElementsByClassName('club')[0];
        element.appendChild(img);
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
}

$(".club-block").click(function (event) {
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
    });
  } else {
    var idStr = self.data("id");
    var area = self.data("area");
    var hall = self.data("hall");
    var programs = self.data("programs");

    var id = parseInt(idStr);
    var selected = geoObjects.search("properties.id = " + id).setOptions('visible', true);
    result = geoObjects.remove(selected).setOptions('visible', false);

    result.then(function () {
      $(".club-block").removeClass("active");
      self.addClass("active");
      $(".club-info-block").remove();
      $('<div class="club-info-block"> \
        <div class="inner-div align-self-end d-flex">\
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
      </div>').appendTo(".map-area .clubs-block .container");

    });
  }
});

$(function () {
  $('.banner-slides').owlCarousel({
    items: 1,
    loop: true,
    mouseDrag: false,
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

  $('.features').owlCarousel({
    mouseDrag: false,
    responsive: {
      1100: {
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

});