/* calculate rem*/
~function () {
    let caculateRem = function () {
        let W = document.documentElement.clientWidth || document.body.clientWidth;
        if (W > 640) {
            $('#resume').css({
                width: 640,
                margin: '0 auto'
            });
            return;//=>当这样的情况下，后面的fontSize就不需要重新计算了，但是不要忘了在样式中给给一个默认的fontSize
        }
        document.documentElement.style.fontSize = W * 100 / 640 + 'px';
        window.ht = W * 100 / 640;
    };
    caculateRem();
    window.addEventListener('resize', caculateRem, false);
}();


/*get the parameters of the url*/
(function (pro) {
    function analysisUrl() {
        return eval("({" + this.split('?')[1].replace(/&/g, "',").replace(/=/g, ":'") + "'})")
    }

    pro.analysisUrl = analysisUrl;
})(String.prototype);


/*control music play or pause*/
let music = $('#music')[0],
    $musicBtn = $('.musicBtn'),
    $arrow = $('#arrow'),
    $back = $('#back');
let pageIndex = 0;
let wh = document.documentElement.clientHeight || document.body.clientHeight;

/*loadingRender*/
let loadingRender = (function ($) {
    let ary = ["head.png", "logo.png", "personalResume.png", "bq1.png", "bq2.png"];
    let $loading = $('#loading'),
        $bg = $('.bg'),
        step = 0,
        total = ary.length;
    pageIndex = 1;

    /*control music play or pause*/
    let musicPlay = function () {
        music.play();
        $musicBtn.tap(function () {
            if (music.paused) {
                music.play();
                $musicBtn.css({animationPlayState: 'running'});
                return;
            }
            music.pause();
            $musicBtn.css({animationPlayState: 'paused'});
        });
    };
    /*control picture load speed*/
    let computed = function () {
        $.each(ary, (index, item) => {
            let img = new Image();
            img.src = `img/${item}`;
            img.onload = function () {
                img = null;
                step++;
                runFn();
            }
        });
    };
    /*caculate scrollline load length*/

    let runFn = function () {
        $bg.css({width: step / total * 100 + '%'});
        if (step === total) {
            $musicBtn.css({display: 'block'});
            musicPlay();
            if (page === '0') return;
            window.setTimeout(() => {
                // $loading.css({display: 'none'});
                $loading.remove();
                homeRender.init();
            }, 1500);
        }
    };

    return {
        init() {
            $loading.css({display: 'block'});
            computed();
        }
    }
})(Zepto);

/*caculate main height match much */
function getMainHeight($header, $main, $footer) {
    return wh - $header[0].offsetHeight - $footer[0].offsetHeight;
}

/*homeRender*/
let homeRender = (function ($) {
    let $home = $('#home'),
        $home_main = $home.children('.home_main'),
        $home_header = $home.children('.home_header'),
        $home_footer = $home.children('.home_footer');

    return {
        init() {
            pageIndex = 2;
            $arrow.css({display: 'block'});
            $home.css({display: 'block'});
            $home_main.css({height: getMainHeight($home_header, $home_main, $home_footer)});
            if (page === '1') return;
            if (pageIndex === 2) {
                $arrow.singleTap(function (e) {
                    // $home.css({display: 'none'});
                    $home.remove();
                    e.preventDefault();
                    basicInfoRender.init();
                });
            }
        }
    }
})(Zepto);
/*basicInfoRender*/
let basicInfoRender = (function ($) {
    let $basicInfo = $('#basicInfo'),
        $basicInfo_header = $basicInfo.children('.basicInfo_header'),
        $basicInfo_main = $basicInfo.children('.basicInfo_main'),
        $basicInfo_footer = $basicInfo.children('.basicInfo_footer');
    return {
        init() {
            pageIndex = 3;
            $basicInfo.css({display: 'block'});
            $basicInfo_main.css({height: getMainHeight($basicInfo_header, $basicInfo_main, $basicInfo_footer) - 1.12 * ht});
            //=>.31+.31+.25+.25=1.12
            if (page === '2') return;
            if (pageIndex === 3) {
                $arrow.singleTap(function (e) {
                    // $basicInfo.css({display: 'none'});
                    $basicInfo.remove();
                    e.preventDefault();
                    mainContentRender.init();
                });
            }
        }
    }
})(Zepto);
/*mainContentRender*/
let mainContentRender = (function ($) {
    let $main_content = $('#main_content'),
        $p = $main_content.find('.content_item').children('p');

    return {
        init() {
            pageIndex = 4;
            $back.css({display: 'none'});
            $arrow.css({display: 'block'});
            $main_content.css({display: 'block'});
            $p.tap(function (e) {
                $main_content.css({display: 'none'});
                // $main_content.remove();
                infoSwiperRender.init($(this).index());
            });
            if (pageIndex === 4) {
                $arrow.singleTap(function (e) {
                    e.preventDefault();
                    $main_content.css({display: 'none'});
                    // $main_content.remove();
                    endRender.init();
                });
            }
            if (page === '3') return;
        }
    }
})(Zepto);
/*infoSwiperRender*/
let infoSwiperRender = (function ($) {
    let $infoSwiper = $('#infoSwiper'),
        $return = $infoSwiper.find('#return'),
        $slide = $infoSwiper.find('.swiper-slide'),
        swiperExample = null;

    function change(example) {
        $slide.each((index, item) => {
            if (index === example.activeIndex) {
                item.id = 'page' + (index + 1);
            } else {
                item.id = null;
            }
        });
    }

    return {
        init(index = 0) {
            $arrow.css({display: 'none'});
            $infoSwiper.css({display: 'block'});
            if (!swiperExample) {
                swiperExample = new Swiper('.swiper-container', {
                    effect: 'coverflow',
                    onInit: change,
                    onTransitionEnd: change,
                    prevButton: '.swiper-button-prev',
                    nextButton: '.swiper-button-next',
                    pagination: '.swiper-pagination',
                });
                $return.tap(function (e) {
                    e.preventDefault();
                    $infoSwiper.css({display: 'none'});
                    // $('#main_content').css({display: 'block'});
                    mainContentRender.init();
                });

            }
            index = index > 4 ? 4 : index;
            swiperExample.slideTo(index, 0);

            if (page === '4') return;
        }
    }
})(Zepto);
/*endRender*/
let endRender = (function ($) {
    let $endPage = $('#endPage'),
        $text = $endPage.find('.text2');
    let messageTimer = null;

    function textMove() {
        $text.html('');
        let textStr = '谢谢观看!',
            n = -1;
        let timer = setInterval(() => {
            n++;
            $text.html($text.html() + textStr[n]);
            if (n === textStr.length - 1) {
                clearInterval(timer);
            }
        }, 500);
        clearTimeout(messageTimer);
    }

    return {
        init() {
            $arrow.css({display: 'none'});
            $back.css({display: 'block'});
            $endPage.css({display: 'block'});
            messageTimer = setTimeout(() => {
                textMove();
            }, 4100);
            $back.singleTap(function (e) {
                $endPage.css({display: 'none'});
                $text.html('');
                // $endPage.remove();
                e.preventDefault();
                // $('#main_content').css({display: 'block'});
                mainContentRender.init();
            });
            if (page === '5') return;
        }
    }
})(Zepto);

let page = window.location.href.analysisUrl()['page'];
page === '0' || isNaN(page) ? loadingRender.init() : null;
page === '1' ? homeRender.init() : null;
page === '2' ? basicInfoRender.init() : null;
page === '3' ? mainContentRender.init() : null;
page === '4' ? infoSwiperRender.init() : null;
page === '5' ? endRender.init() : null;