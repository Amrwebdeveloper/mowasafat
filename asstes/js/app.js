const _click_ = 'touchend' in window ? 'touchend' : 'click';
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

let FILTER = {
    type: "mobile",
    price: [],
    brand: [],
};


$("#root-categories").on(_click_, () => {
    $("header .roots").toggleClass("hide");
    isMobile.any() ? $("body").toggleClass("no-scroll") : null;
});


$("header .roots .close-btn").on(_click_, () => {
    $("header .roots").toggleClass("hide");
    isMobile.any() ? $("body").toggleClass("no-scroll") : null;
});

$("header nav section .close-btn").on(_click_, () => {
    $("header nav section").addClass("hide");
    $("header nav section").removeClass("flex");
    isMobile.any() ? $("body").toggleClass("no-scroll") : null;
});

$("header #header .right-side .menu-icon").on(_click_, () => {
    $("header nav section").addClass("flex");
    $("header nav section").removeClass("hide");
    isMobile.any() ? $("body").toggleClass("no-scroll") : null;
});

$(".labels").on(_click_, ".label", function () {
    if ($(this).parent(".labels").hasClass("multi")) {
        $(this).toggleClass("active");
    } else if ($(this).parent(".labels").hasClass("check")) {
        $(this).parent(".labels").children(".label").removeClass("active");
        $(this).addClass("active");
    } else {
        //
    }


    this.hasAttribute("data-value") ? rangeSlider.setValue(JSON.parse(this.getAttribute("data-value"))) : null;
    this.hasAttribute("data-brand") ? fillFliter("brand", this.getAttribute("data-brand")) : null;
});



const rangeSlider = new RangeSlider(document.getElementById("price-range-slider"));
rangeSlider.onChange = function (e) {
    $(".from-to-inputs .input-from").val(e.min);
    $(".from-to-inputs .input-to").val(e.max);

    fillFliter("price", [e.min, e.max]);
};

document.getElementById("select_device").addEventListener("change", function () {
    fillFliter("type", this.value)
})



function fillFliter(filter, data) {
    switch (filter) {
        case 'type':
            FILTER.type = data;
            break;
        case 'price':
            FILTER.price = data;
            break;
        case 'brand':
            !FILTER.brand.includes(data) ? FILTER.brand.push(data) : FILTER.brand.remove(data);
            break;
        default:
            break;
    }
}



if ($('.gallery').length > 0) {
    lightGallery($('.gallery'), {
        thumbnail: true
    });
}

const element = document.getElementsByTagName("header")[0];
document.addEventListener("scroll", () => { element.classList.toggle("sticky", element.offsetTop <= window.scrollY + 20); });




$("body").on(_click_, ".filter-btn", function () {
    console.log(FILTER);
});


if ($(".categories-slider").length > 0) {
    var swiper = new Swiper(".categories-slider", {
        slidesPerView: 3.5,
        spaceBetween: 10,
        loop: false,
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true,
        // },
        breakpoints: {
            768: {
                slidesPerView: 4.5,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 50,
            },
        },
    });
}
if ($(".swiper-slider").length > 0) {
    var swiper = new Swiper(".swiper-slider", {
        slidesPerView: 3.5,
        spaceBetween: 10,
        loop: false,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 4.5,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 5.5,
                spaceBetween: 50,
            },
        },
    });
}