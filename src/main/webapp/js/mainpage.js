import * as reservation from "./reservation/reservation.js";

const TEMPLATE_PROMOTION_ITEM_SELECTOR = "#promotionItem";
const TEMPLATE_CATEGORY_TAB_SELECTOR = "#eventTabItem";
const TEMPLATE_CATEGORY_ITEM_SELECTOR = "#itemList"

const PROMOTION_IMG_CONTAINER_SELECTOR = ".visual_img";
const PROMOTION_ITEM_SELECTOR = ".visual_img .item";

const CATEGORY_TAB_CONTAINER_SELECTOR = ".event_tab_lst";
const CATEGORY_COUNT_SELECTOR = ".event_lst_txt span";
const CATEGORY_ITEM_CONTAINER_SELECTOR = ".lst_event_box";
const MORE_BOTTON_SELECTOR = ".more .btn";


var promotion;
var category;
var tabMenu;
document.addEventListener("DOMContentLoaded", function () {
  try {
    init();
    initEvent();
    startPromotion();
    showCategories();
    showCategoryItems();
  } catch (error) {
    console.error(error.message);
  }
});

function init() {
  tabMenu = new reservation.TabMenuBuilder()
    .setTabMenuContainer(CATEGORY_TAB_CONTAINER_SELECTOR)
    .build();

  promotion = new reservation.PromotionBuilder()
    .setPromotionImgContainer(PROMOTION_IMG_CONTAINER_SELECTOR)
    .setPromotionItemHtml(TEMPLATE_PROMOTION_ITEM_SELECTOR)
    .setPromotionItemSelector(PROMOTION_ITEM_SELECTOR)
    .build();

  category = new reservation.CategoryBuilder()
    .setCategoryTabMenu(tabMenu)
    .setCategoryTabHtml(TEMPLATE_CATEGORY_TAB_SELECTOR)
    .setCategoryCount(CATEGORY_COUNT_SELECTOR)
    .setCategoryItemContainers(CATEGORY_ITEM_CONTAINER_SELECTOR)
    .setCategoryItemHtml(TEMPLATE_CATEGORY_ITEM_SELECTOR)
    .setMoreBtn(MORE_BOTTON_SELECTOR)
    .build();
}

function initEvent() {
  tabMenu.initEvent();
}

//Start promotion image slide.
function startPromotion() {
  promotion.startPromotion();
}

//Show category event tab.
function showCategories() {
  category.showCategories();
}

//Show items
function showCategoryItems() {
  category.showCategoryItems();
}