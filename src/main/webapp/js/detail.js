import * as reservation from "./reservation/reservation.js";

const DISPLAY_INFO_ID_SELECTOR = "#displayInfoId";

const TEMPLATE_PRODUCT_IMG_SELECTOR = "#productImg";
const TEMPLATE_REVIEW_SELECTOR = "#reviewItem";

const ACCODION_CONTAINER_SELECTOR = '.section_store_details';
const ACCODION_OPEN_BTN_SELECTOR = '._open';
const ACCODION_CLOSE_BTN_SELECTOR = '._close';
const ACCODION_CONTENT_SELECTOR = '.store_details';

const TAB_MENU_CONTAINER_SELECTOR = '.info_tab_lst';
const TAB_MENU_CONTENT_CONTAINERS_SELECTOR = '.section_info_tab > div';

const PRODUCT_DESCRIPTION_SELECTOR = '.store_details .dsc';
const PRODUCT_IMG_CONTAINER_SELECTOR = ".visual_img.detail_swipe";
const PRODUCT_IMG_PAGINATION_SELECTOR = '.figure_pagination';
const PREV_BTN_CONTAINER_SELECTOR = '.prev';
const NEXT_BTN_CONTAINER_SELECTOR = '.nxt';
const SLIDE_BTN_CONTAINER_SELECTOR = '.group_visual';
const PRODUCT_IMGS_SELECTOR = ".visual_img.detail_swipe .item";
const RATING_GRAPH_SELECTOR = '.graph_value';
const RATING_SCORE_SELECTOR = '.text_value span';
const TOTAL_REVIEW_COUNT_SELECTOR = ".join_count em";
const SHORT_REVIEW_CONTAINER_SELECTOR = '.list_short_review';

const INTRODUCTION_SELECTOR = '.detail_info_lst p';
const STORE_MAP_IMG_SELECTOR = '.store_map';
const STORE_NAME_SELECTOR = '.store_name';
const STORE_STREET_ADDRESS_SELECTOR = '.store_addr';
const STORE_OLD_ADDRESS_SELECTOR = '.addr_old_detail';
const STORE_PLACE_NAME_SELECTOR = '.store_addr.addr_detail';
const STORE_TEL_SELECTOR = '.store_tel';

var product;
var accodion;
var tabMenu;
document.addEventListener("DOMContentLoaded", function () {
    try {
        init();
        initEvent();
        showProductDetail();
    } catch (error) {
        console.error(error.message);
    }
});

function init() {
    accodion = new reservation.AccodionBuilder()
        .setContainer(ACCODION_CONTAINER_SELECTOR)
        .setContent(ACCODION_CONTENT_SELECTOR)
        .setOpenBtn(ACCODION_OPEN_BTN_SELECTOR)
        .setCloseBtn(ACCODION_CLOSE_BTN_SELECTOR)
        .build();

    tabMenu = new reservation.TabMenuBuilder()
        .setTabMenuContainer(TAB_MENU_CONTAINER_SELECTOR)
        .build();

    let displayInfoId = document.querySelector(DISPLAY_INFO_ID_SELECTOR).value;
    let infoDetailSelectors = {
        productIntro: INTRODUCTION_SELECTOR,
        storeName: STORE_NAME_SELECTOR,
        storeStreetAddr: STORE_STREET_ADDRESS_SELECTOR,
        storeOldAddr: STORE_OLD_ADDRESS_SELECTOR,
        storePlaceName: STORE_PLACE_NAME_SELECTOR,
        storeTel: STORE_TEL_SELECTOR,
        storeMap: STORE_MAP_IMG_SELECTOR
    }
    let reviewSelectors = {
        ratingGraph: RATING_GRAPH_SELECTOR,
        ratingScore: RATING_SCORE_SELECTOR,
        totalReviewCount: TOTAL_REVIEW_COUNT_SELECTOR,
        shortReviewContainer: SHORT_REVIEW_CONTAINER_SELECTOR,
        reviewHtml: TEMPLATE_REVIEW_SELECTOR
    };
    let productImgSelectors = {
        productImgHtml: TEMPLATE_PRODUCT_IMG_SELECTOR,
        productImgContainer: PRODUCT_IMG_CONTAINER_SELECTOR,
        productImgPagination: PRODUCT_IMG_PAGINATION_SELECTOR,
        prevBtnContainer: PREV_BTN_CONTAINER_SELECTOR,
        nextBtnContainer: NEXT_BTN_CONTAINER_SELECTOR,
        slideBtnContainer: SLIDE_BTN_CONTAINER_SELECTOR,
        productImgsSelector: PRODUCT_IMGS_SELECTOR,
    };

    product = new reservation.ProductBuilder()
        .setDisplayInfoId(displayInfoId)
        .setInfoDetail(infoDetailSelectors)
        .setReview(reviewSelectors)
        .setProductImg(productImgSelectors)
        .setProductDetail(PRODUCT_DESCRIPTION_SELECTOR)
        .setInfoTabMenu(tabMenu, TAB_MENU_CONTENT_CONTAINERS_SELECTOR)
        .build();
}

//Init UI Event
function initEvent() {
    accodion.initEvent();
    tabMenu.initEvent();
}

//show Detailed Product Information.
function showProductDetail() {
    product.setMaxNumOfReviews(3);
    product.showProductDetail();
}