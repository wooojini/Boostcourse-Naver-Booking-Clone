import * as ui from "./reservation_ui.js";
import * as util from "./reservation_util.js";

//Package
var kr = {};
kr.connect = {};
kr.connect.reservation = {};

//Util pacakage
kr.connect.reservation.util = util;
const Ajax = kr.connect.reservation.util.Ajax;
const AjaxBuilder = kr.connect.reservation.util.AjaxBuilder;
const FormDataValidaterBuilder =
  kr.connect.reservation.util.FormDataValidaterBuilder;
const DomUtil = kr.connect.reservation.util.DomUtil;
const StrUtil = kr.connect.reservation.util.StrUtil;

//UI Package
kr.connect.reservation.ui = ui;
const SliderBuilder = kr.connect.reservation.ui.SliderBuilder;
const AccodionBuilder = kr.connect.reservation.ui.AccodionBuilder;
const TabMenuBuilder = kr.connect.reservation.ui.TabMenuBuilder;
const RatingBuilder = kr.connect.reservation.ui.RatingBuilder;

//Service Package
kr.connect.reservation.service = {};

//Promotion
kr.connect.reservation.service.Promotion = class {
  constructor(imgContainerSelector,
    itemTemplateSelector,
    itemSelector) {
    this.promotionImgContainer = document.querySelector(imgContainerSelector);
    this.promotionItemHtml = document.querySelector(
      itemTemplateSelector
    ).innerHTML;
    this.promotionItemSelector = itemSelector;
    this.promotionItems = null;
  }

  startPromotion() {
    this.getPromotions();
  };

  getPromotions() {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_PROMOTIONS)
      .setCallback(this.promotionApiHandler)
      .setObjectToBind(this)
      .build();

    ajax.requestApi();
  };

  promotionApiHandler(promotion) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let items = json["items"];

      promotion.addPromotionImgs(items);

      let slider = new SliderBuilder()
        .setSlideItemContainer(promotion.promotionImgContainer)
        .setIsAutoSlide(true)
        .build();
      slider.autoSlideImg();

      promotion.downloadPromotionImgs(items);
    } else {
      new Error(`PromotionApiRequestError : Http status code ${this.status}`);
    }
  };

  addPromotionImgs(items) {
    let bindTemplate = Handlebars.compile(this.promotionItemHtml);
    let resultHtml = items.reduce((acc, item) => acc + bindTemplate(item), "");

    this.promotionImgContainer.innerHTML = resultHtml;
    this.promotionItems = document.querySelectorAll(this.promotionItemSelector);
  };

  downloadPromotionImgs(items) {
    items.forEach((item) => {
      let bindObj = {
        promotion: this,
        promotionId: item.id,
      };
      let ajax = new AjaxBuilder()
        .setHttpMethod(Ajax.HTTP_METHOD.GET)
        .setUrl(Ajax.URL.API.GET_PROMOTION_IMAGE)
        .setCallback(this.promotionImgApiHandler)
        .setObjectToBind(bindObj)
        .build();

      ajax.setResponseType("blob");
      ajax.setPathVariable(item.productImageId);
      ajax.requestApi();
    });
  };

  promotionImgApiHandler(bindObj) {
    if (this.status === 200) {
      let blob = this.response;
      let url = URL.createObjectURL(blob);
      bindObj.promotion.showPromotionImg(bindObj.promotionId, url);
    } else {
      new Error(`PromotionImgApiRequestError : Http status code ${this.status}`);
    }
  };

  showPromotionImg(promotionId, url) {
    let item = Object.values(this.promotionItems).filter((item) => {
      if (Number(item.dataset.id) === Number(promotionId)) {
        return item;
      }
    })[0];

    if (item != undefined) {
      item.style.backgroundImage = `url(${url})`;
    }
  };
};

const Promotion = kr.connect.reservation.service.Promotion;

//PromotionBuilder
kr.connect.reservation.service.PromotionBuilder = class{
  constructor() {
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.imgContainerSelector = "";
    this.itemTemplateSelector = "";
    this.itemSelector = "";
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error(`Selector is not matched : ${selector}`);
    }
  };

  validateProperty() {
    if (this.imgContainerSelector === "") {
      new Error("ImgContainerSelector is required.");
    } else if (this.itemTemplateSelector === "") {
      new Error("itemTemplateSelector is required.");
    } else if (this.itemSelector === "") {
      new Error("itemSelector is required.");
    }

    this.validateSelector(this.imgContainerSelector);
    this.validateSelector(this.itemTemplateSelector);
    this.validateSelector(this.itemSelector);
  };

  setPromotionImgContainer(
    imgContainerSelector
  ) {
    this.imgContainerSelector = imgContainerSelector;
    return this;
  };

  setPromotionItemHtml(
    itemTemplateSelector
  ) {
    this.itemTemplateSelector = itemTemplateSelector;
    return this;
  };

  setPromotionItemSelector(itemSelector) {
    this.itemSelector = itemSelector;
    return this;
  };

  build() {
    this.validateProperty();

    return new Promotion(
      this.imgContainerSelector,
      this.itemTemplateSelector,
      this.itemSelector
    );
  };
};

const PromotionBuilder = kr.connect.reservation.service.PromotionBuilder;

//Category
kr.connect.reservation.service.Category = class {
  constructor(
    tabMenu,
    categoryTabItemTemplateSelector,
    categoryCountSelector,
    categoryItemContainerSelector,
    categoryItemTemplateSelector,
    moreBtnSelector
  ) {
    this.tabMenu = tabMenu;
    this.tabMenu.setObjectToBind(this);
    this.tabMenu.setCallback(this.categoryTabClickEventCallback);

    this.categoryTabHtml = document.querySelector(
      categoryTabItemTemplateSelector
    ).innerHTML;
    this.categoryCount = document.querySelector(categoryCountSelector);
    this.categoryItemContainers = document.querySelectorAll(
      categoryItemContainerSelector
    );
    this.categoryItemHtml = document.querySelector(
      categoryItemTemplateSelector
    ).innerHTML;
    this.moreBtn = document.querySelector(moreBtnSelector);
    this.categoryTabContainer = null;

    this.NUM_OF_DISPLAY_ITEM = 4;
    this.start = 0;
    this.categoryId = 0;
    this.totalItemCount = 0;

    this.initEvent();
  }

  initEvent() {
    this.moreBtn.addEventListener(
      "click",
      this.moreBtnClickEventListener.bind(this)
    );
  };

  moreBtnClickEventListener() {
    if (this.isMoreCategoryItems()) {
      this.getCategoryItems();
    }
  };

  isMoreCategoryItems() {
    let result = false;

    if (this.totalItemCount - this.start > 0) {
      result = true;
    }
    return result;
  };

  categoryTabClickEventCallback(category, aTag) {
    let liTag = aTag.parentNode;
    let categoryId = liTag.dataset.category;

    category.setCategoryId(categoryId);
    category.clearItemContainer();
    category.initStart();
    category.getCategoryItems();
    category.showMoreBtn();
  };

  showCategoryItems() {
    this.getCategoryItems();
  };

  setCategoryId(categoryId) {
    this.categoryId = categoryId;
  };

  initStart() {
    this.start = 0;
  };

  changeActiveClass(targetTag) {
    document.querySelector(".anchor.active").classList.remove("active");
    targetTag.classList.add("active");
  };

  clearItemContainer() {
    this.categoryItemContainers.forEach(function (container) {
      container.innerHTML = "";
    });
  };

  getCategoryItems() {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_PRODUCTS)
      .setCallback(this.categoryItemApiHandler)
      .setObjectToBind(this)
      .build();

    ajax.setRequestParams({
      categoryId: this.categoryId,
      start: this.start,
    });

    ajax.requestApi();
  };

  categoryItemApiHandler(category) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let totalCount = json["totalCount"];
      let items = json["items"];

      category.setTotalItemCount(totalCount);
      category.showTotalItemCount();
      category.addCategoryItems(items);
      category.downloadProductImgs(items);
    } else {
      new Error(`CategoryItemApiRequestError : Http status code ${this.status}`);
    }
  };

  setTotalItemCount(totalCount) {
    this.totalItemCount = totalCount;
  };

  showTotalItemCount() {
    this.categoryCount.textContent = `${this.totalItemCount}개`;
  };

  addCategoryItems(items) {
    if (items.length > 1) {
      items = this.partitionCategoryItems(
        items,
        this.categoryItemContainers.length
      );

      this.categoryItemContainers.forEach((container, index) => {
        container.innerHTML += this.getItemsHtml(items[index]);
      });
    } else {
      this.categoryItemContainers[0].innerHTML += this.getItemsHtml(items);
    }

    this.start += this.NUM_OF_DISPLAY_ITEM;
    if (this.isMoreCategoryItems() === false) {
      this.removeMoreBtn();
    }
  };

  partitionCategoryItems(items, n) {
    let length = items.length;
    let result = [];
    let end;

    if (n > length) {
      return items;
    }

    while (n > 1) {
      end = Math.ceil(length / n);
      result.push(items.slice(0, end));

      items = items.slice(end, length);
      length = items.length;
      n--;
    }
    result.push(items);

    return result;
  };

  getItemsHtml(items) {
    let bindTemplate = Handlebars.compile(this.categoryItemHtml);
    let resultHtml = items.reduce((acc, item) => acc + bindTemplate(item), "");

    return resultHtml;
  };

  showMoreBtn() {
    this.moreBtn.classList.remove("hide");
  };

  removeMoreBtn() {
    this.moreBtn.classList.add("hide");
  };

  showCategories() {
    this.getCategories();
  };

  downloadProductImgs(items) {
    items.forEach((item) => {
      let bindObj = {
        category: this,
        displayInfoId: item.displayInfoId,
      };

      let ajax = new AjaxBuilder()
        .setHttpMethod(Ajax.HTTP_METHOD.GET)
        .setUrl(Ajax.URL.API.GET_PRODUCT_IMAGE)
        .setCallback(this.productImgApiHandler)
        .setObjectToBind(bindObj)
        .build();

      ajax.setResponseType("blob");
      ajax.setPathVariable(item.productImageId);
      ajax.requestApi();
    });
  };

  productImgApiHandler(bindObj) {
    if (this.status === 200) {
      let blob = this.response;
      let url = URL.createObjectURL(blob);
      bindObj.category.showProductItemImg(bindObj.displayInfoId, url);
    } else {
      new Error(
        `ProductImgItemApiHRequestError : Http status code ${this.status}`
      );
    }
  };

  showProductItemImg(displayInfoId, url) {
    let leftContainer = this.categoryItemContainers[0];
    let rightContainer = this.categoryItemContainers[1];

    let item = this.findItemToAddImg(leftContainer, displayInfoId);
    if (item == undefined) {
      item = this.findItemToAddImg(rightContainer, displayInfoId);
    }

    if (item != undefined) {
      let aTag = item.firstElementChild;
      let divTag = aTag.firstElementChild;
      let imgTag = divTag.firstElementChild;
      imgTag.src = url;
    }
  };

  findItemToAddImg(container, displayInfoId) {
    let item = Object.values(container.children).filter((item) => {
      if (Number(item.dataset.id) === Number(displayInfoId)) {
        return item;
      }
    })[0];

    return item;
  };

  getCategories() {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_CATEGORIES)
      .setCallback(this.categoryApiHandler)
      .setObjectToBind(this)
      .build();

    ajax.requestApi();
  };

  categoryApiHandler(category) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let items = json["items"];

      category.addCategories(items);
    } else {
      new Error(`CategoryApiRequestError : Http status code ${this.status}`);
    }
  };

  addCategories(items) {
    let bindTemplate = Handlebars.compile(this.categoryTabHtml);
    let resultHtml = items.reduce((acc, item) => acc + bindTemplate(item), "");

    let categoryTabContainer = this.tabMenu.getTabMenuContainer();
    categoryTabContainer.innerHTML += resultHtml;
  };
};

const Category = kr.connect.reservation.service.Category;

//CategoryBuilder
kr.connect.reservation.service.CategoryBuilder = class {
  constructor() {
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.itemTemplateSelector = "";
    this.categoryCountSelector = "";
    this.categoryItemContainerSelector = "";
    this.categoryItemTemplateSelector = "";
    this.moreBtnSelector = "";
    this.tabMenu = null;
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error(`Selector is not matched : ${selector}`);
    }
  };

  validateTabMenu() {
    if (typeof this.tabMenu != typeof {}) {
      new Error("tabMenu is required type of Object");
    }
  };

  validateProperty() {
    if (this.itemTemplateSelector === "") {
      new Error("itemTemplateSelector is required.");
    } else if (this.categoryCountSelector === "") {
      new Error("categoryCountSelector is required.");
    } else if (this.categoryItemContainerSelector === "") {
      new Error("categoryItemContainerSelector is required.");
    } else if (this.categoryItemTemplateSelector === "") {
      new Error("categoryItemTemplateSelector is required.");
    } else if (this.moreBtnSelector === "") {
      new Error("moreBtnSelector is required.");
    } else if (this.tabMenu === null) {
      new Error("tabMenu is required.");
    }

    this.validateSelector(this.itemTemplateSelector);
    this.validateSelector(this.categoryCountSelector);
    this.validateSelector(this.categoryItemContainerSelector);
    this.validateSelector(this.categoryItemTemplateSelector);
    this.validateSelector(this.moreBtnSelector);
    this.validateTabMenu();
  };

  setCategoryTabMenu(tabMenu) {
    this.tabMenu = tabMenu;
    return this;
  };

  setCategoryTabHtml(itemTemplateSelector) {
    this.itemTemplateSelector = itemTemplateSelector;
    return this;
  };

  setCategoryCount(categoryCountSelector) {
    this.categoryCountSelector = categoryCountSelector;
    return this;
  };

  setCategoryItemContainers(
    categoryItemContainerSelector
  ) {
    this.categoryItemContainerSelector = categoryItemContainerSelector;
    return this;
  };

  setCategoryItemHtml(
    categoryItemTemplateSelector
  ) {
    this.categoryItemTemplateSelector = categoryItemTemplateSelector;
    return this;
  };

  setMoreBtn(moreBtnSelector) {
    this.moreBtnSelector = moreBtnSelector;
    return this;
  };

  build() {
    try {
      this.validateProperty();

      return new Category(
        this.tabMenu,
        this.itemTemplateSelector,
        this.categoryCountSelector,
        this.categoryItemContainerSelector,
        this.categoryItemTemplateSelector,
        this.moreBtnSelector
      );
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };
};

const CategoryBuilder = kr.connect.reservation.service.CategoryBuilder;

//Product
kr.connect.reservation.service.Product = class {
  constructor() {
    this.displayInfoId = 0;

    this.productImgType = {
      THUMNAIL: "th",
      MAIN: "ma",
      ETC: "et",
    };

    this.productImg = {
      numOfProductImgs: 0,
      pageNumOfImg: 1,
      productImgHtml: null,
      productImgContainer: null,
      prevBtnContainer: null,
      nextBtnContainer: null,
      productImgPagination: null,
      productImgsSelector: null,
      productImgItems: null,
      totalPageNum: null,
      pageNum: null,
      slideBtnContainer: null,
      slider: null,

      imgType: {
        THUMNAIL: "th",
        MAIN: "ma",
        ETC: "et",
      },

      init: function (productImgSelectors) {
        this.productImgHtml = document.querySelector(
          productImgSelectors.productImgHtml
        ).innerHTML;
        this.productImgContainer = document.querySelector(
          productImgSelectors.productImgContainer
        );
        this.prevBtnContainer = document.querySelector(
          productImgSelectors.prevBtnContainer
        );
        this.nextBtnContainer = document.querySelector(
          productImgSelectors.nextBtnContainer
        );
        this.productImgPagination = document.querySelector(
          productImgSelectors.productImgPagination
        );
        this.totalPageNum = this.productImgPagination.children[1].firstElementChild;
        this.pageNum = this.productImgPagination.children[0];
        this.slideBtnContainer = document.querySelector(
          productImgSelectors.slideBtnContainer
        );
        this.productImgsSelector = productImgSelectors.productImgsSelector;

        this.initEvent();
      },

      setProductImgItems: function () {
        if (this.productImgsSelector != null) {
          this.productImgItems = document.querySelectorAll(
            this.productImgsSelector
          );

          this.slider = new SliderBuilder()
            .setSlideItemContainer(this.productImgContainer)
            .setIsAutoSlide(false)
            .build();
        }
      },

      initEvent: function () {
        this.slideBtnContainer.addEventListener(
          "click",
          this.slideBtnClickListener.bind(this)
        );
      },

      slideBtnClickListener: function (e) {
        let isEventTargetTag = false;
        let iTag;

        switch (e.target.tagName.toLowerCase()) {
          case "i":
            isEventTargetTag = true;
            iTag = e.target;
            break;
          case "a":
            isEventTargetTag = true;
            iTag = e.target.children[0];
            break;
        }

        if (isEventTargetTag) {
          if (this.isPrevSlideBtn(iTag)) {
            this.slider.slideImgRight();
          } else {
            this.slider.slideImgLeft();
          }

          this.pageNumOfImg =
            (this.pageNumOfImg % this.productImgItems.length) + 1;
          this.showPageNumOfImg(this.pageNumOfImg);
        }
      },

      isPrevSlideBtn: function (btn) {
        return btn.parentElement.classList.contains("btn_prev");
      },

      downloadImg: function (imgData) {
        let bindObj = {
          productImg: this,
          productImageId: imgData.productImageId,
        };

        let ajax = new AjaxBuilder()
          .setHttpMethod(Ajax.HTTP_METHOD.GET)
          .setUrl(Ajax.URL.API.GET_PRODUCT_IMAGE)
          .setCallback(this.productDetailImgApiHandler)
          .setObjectToBind(bindObj)
          .build();

        ajax.setResponseType("blob");
        ajax.setPathVariable(imgData.productImageId);
        ajax.requestApi();
      },

      productDetailImgApiHandler: function (bindObj) {
        if (this.status === 200) {
          let blob = this.response;
          let url = URL.createObjectURL(blob);
          bindObj.productImg.loadDownloadImg(bindObj.productImageId, url);
        } else {
          new Error(
            `ProductDetailImgApiRequestError : Http status code ${this.status}`
          );
        }
      },

      loadDownloadImg: function (productImageId, url) {
        Object.values(this.productImgContainer.children).forEach((liTag) => {
          if (Number(liTag.dataset.id) === Number(productImageId)) {
            let imgTag = liTag.firstElementChild;
            imgTag.src = url;
            imgTag.onload = (e) => {
              URL.revokeObjectURL(e.target.src);
            };
          }
        });
      },

      showThumnailImg: function (data) {
        let imgData = this.getThumnailImgData(data);

        if (imgData != null) {
          this.showSlideImg(imgData);
          this.numOfProductImgs++;
          this.downloadImg(imgData);
        }
      },

      getThumnailImgData: function (data) {
        let thumnailImgs = data.filter(
          (img) => img.type == this.imgType.THUMNAIL
        );
        let thumnailImg;

        if (thumnailImgs.length === 0) {
          thumnailImg = null;
        } else {
          thumnailImg = thumnailImgs[0];
        }

        return thumnailImg;
      },

      showEtcImg: function (data) {
        let imgData = this.getEtcImgData(data);

        if (imgData != null) {
          this.showSlideImg(imgData);
          this.showPagenationBtns();
          this.numOfProductImgs++;
          this.downloadImg(imgData);
        } else {
          this.hidePagenationBtns();
        }
      },

      getEtcImgData: function (data) {
        let etcImgs = data.filter((img) => img.type == this.imgType.ETC);
        let etcImg;

        if (etcImgs.length === 0) {
          etcImg = null;
        } else {
          etcImg = etcImgs[0];
        }

        return etcImg;
      },

      showSlideImg: function (imgData) {
        let bindTemplate = Handlebars.compile(this.productImgHtml);
        let resultHtml = bindTemplate(imgData);
        this.productImgContainer.innerHTML += resultHtml;
      },

      showPagenationBtns: function () {
        this.prevBtnContainer.classList.remove("hide");
        this.nextBtnContainer.classList.remove("hide");
      },

      hidePagenationBtns: function () {
        this.prevBtnContainer.classList.add("hide");
        this.nextBtnContainer.classList.add("hide");
      },

      showNumOfImgs: function () {
        this.totalPageNum.textContent = this.numOfProductImgs;
      },

      showPageNumOfImg: function (pageNumOfImg) {
        this.pageNum.textContent = pageNumOfImg;
      },
    };

    this.review = {
      maxNumOfReviews: 0,
      ratingGraph: null,
      ratingScore: null,
      totalReviewCount: null,
      shortReviewContainer: null,
      reviewHtml: null,

      init: function (reviewSeletors) {
        this.ratingGraph = document.querySelector(reviewSeletors.ratingGraph);
        this.ratingScore = document.querySelector(reviewSeletors.ratingScore);
        this.totalReviewCount = document.querySelector(
          reviewSeletors.totalReviewCount
        );
        this.shortReviewContainer = document.querySelector(
          reviewSeletors.shortReviewContainer
        );
        this.reviewHtml = document.querySelector(
          reviewSeletors.reviewHtml
        ).innerHTML;
      },

      showRatingGraph: function (percentage) {
        this.ratingGraph.style.width = `${percentage}%`;
      },

      showRatingScore: function (score) {
        this.ratingScore.textContent = score;
      },

      showTotalReviewCount: function (count) {
        this.totalReviewCount.textContent = `${count}건`;
      },

      showReviews: function (reviews) {
        if (this.maxNumOfReviews === 0) {
          this.setMaxNumOfReviews(reviews.length);
        }

        let bindTemplate = Handlebars.compile(this.reviewHtml);
        let resultHtml = "";
        resultHtml = reviews.reduce((acc, cur, idx) => {
          if (idx < this.maxNumOfReviews) {
            if (cur.commentImages.length != 0) {
              cur.saveFileName = cur.commentImages[0].saveFileName;
            }
            cur.reservationDate = this.changeDateFormmat(cur.reservationDate);

            return acc + bindTemplate(cur);
          } else {
            return acc + "";
          }
        }, resultHtml);

        this.shortReviewContainer.innerHTML += resultHtml;
        this.downloadImg(reviews);
      },

      downloadImg: function (reviews) {
        Object.values(reviews).forEach((review) => {
          if (review.commentImages.length > 0) {
            let bindObj = {
              review: this,
              commentId: review.commentId,
            };

            let ajax = new AjaxBuilder()
              .setHttpMethod(Ajax.HTTP_METHOD.GET)
              .setUrl(Ajax.URL.API.GET_COMMENTS_IMG)
              .setCallback(this.reviewImgApiHandler)
              .setObjectToBind(bindObj)
              .build();

            ajax.setResponseType("blob");
            ajax.setPathVariable(review.commentImages[0].imageId);
            ajax.requestApi();
          }
        });
      },

      reviewImgApiHandler: function (bindObj) {
        if (this.status === 200) {
          let blob = this.response;
          let url = URL.createObjectURL(blob);
          bindObj.review.loadDownloadImg(bindObj.commentId, url);
        } else {
          new Error(`ReviewImgApiRequestError : Http status code ${this.status}`);
        }
      },

      loadDownloadImg: function (commentId, url) {
        Object.values(this.shortReviewContainer.children).forEach((liTag) => {
          if (Number(liTag.dataset.id) === Number(commentId)) {
            let reviewArea = liTag.firstElementChild.firstElementChild;
            let thumbnailArea = reviewArea.firstElementChild;
            let aTag = thumbnailArea.firstElementChild;
            let imgTag = aTag.firstElementChild;

            imgTag.src = url;
            imgTag.onload = (e) => {
              URL.revokeObjectURL(e.target.src);
            };
          }
        });
      },

      setMaxNumOfReviews: function (maxNum) {
        this.maxNumOfReviews = maxNum;
      },

      changeDateFormmat: function (dateStr) {
        let date = dateStr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)[0];
        date = date.replace(/[-]/, ".").replace(/[-]/, ".");

        return date;
      },
    };

    this.infoTabMenu = {
      tabMenu: null,
      tabMenuContentContainers: null,

      init: function (tabMenu, tabMenuContentContainersSelector) {
        this.tabMenu = tabMenu;
        this.tabMenu.setObjectToBind(this);
        this.tabMenu.setCallback(this.infoTabClickEventCallback);
        this.tabMenuContentContainers = document.querySelectorAll(
          tabMenuContentContainersSelector
        );
      },

      infoTabClickEventCallback: function (infoTabMenu, aTag) {
        let clickedTab = aTag.parentElement;
        let clickedTabIndex = infoTabMenu.getClickedMenuIndex(clickedTab);

        infoTabMenu.changeHideArea(clickedTabIndex);
      },

      getClickedMenuIndex: function (clickedTab) {
        let clickedTabIndex;
        let tabMenuItems = this.tabMenu.getTabMenuItems();

        Object.keys(tabMenuItems).forEach((index) => {
          if (tabMenuItems[index] === clickedTab) {
            clickedTabIndex = index;
          }
        });

        return clickedTabIndex;
      },

      changeHideArea: function (index) {
        Object.keys(this.tabMenuContentContainers).forEach((index) => {
          if (
            this.tabMenuContentContainers[index].classList.contains("hide") ===
            false
          ) {
            this.tabMenuContentContainers[index].classList.add("hide");
          }
        });
        this.tabMenuContentContainers[index].classList.remove("hide");
      },
    };

    this.infoDetail = {
      productIntro: null,
      storeName: null,
      storeStreetAddr: null,
      storeOldAddr: null,
      storePlaceName: null,
      storeTel: null,
      storeMap: null,

      init: function (infoDetailSelectors) {
        this.productIntro = document.querySelector(
          infoDetailSelectors.productIntro
        );
        this.storeName = document.querySelector(infoDetailSelectors.storeName);
        this.storeStreetAddr = document.querySelector(
          infoDetailSelectors.storeStreetAddr
        );
        this.storeOldAddr = document.querySelector(
          infoDetailSelectors.storeOldAddr
        );
        this.storePlaceName = document.querySelector(
          infoDetailSelectors.storePlaceName
        );
        this.storeTel = document.querySelector(infoDetailSelectors.storeTel);
        this.storeMap = document.querySelector(infoDetailSelectors.storeMap);
      },

      showProductIntro: function (introduction) {
        this.productIntro.textContent = introduction;
      },

      showStoreName: function (storeName) {
        this.storeName.textContent = storeName;
      },

      showStoreStreetAddr: function (storeStreetAddr) {
        this.storeStreetAddr.textContent = storeStreetAddr;
      },

      showStoreOldAddr: function (storeOldAddr) {
        this.storeOldAddr.textContent = storeOldAddr;
      },

      showStorePlaceName: function (storePlaceName) {
        this.storePlaceName.textContent = storePlaceName;
      },

      showStoreTel: function (storeTel) {
        this.storeTel.textContent = storeTel;
        this.storeTel.setAttribute("href", `tel:${storeTel}`);
      },

      showStoreMap: function (displayInfoImageId) {
        this.downloadImg(displayInfoImageId);
      },

      downloadImg: function (displayInfoImageId) {
        let bindObj = {
          infoDetail: this,
        };

        let ajax = new AjaxBuilder()
          .setHttpMethod(Ajax.HTTP_METHOD.GET)
          .setUrl(Ajax.URL.API.GET_DISPLAY_IMAGE)
          .setCallback(this.storeMapImgApiHandler)
          .setObjectToBind(bindObj)
          .build();

        ajax.setResponseType("blob");
        ajax.setPathVariable(displayInfoImageId);
        ajax.requestApi();
      },

      storeMapImgApiHandler: function (bindObj) {
        if (this.status === 200) {
          let blob = this.response;
          let url = URL.createObjectURL(blob);
          bindObj.infoDetail.loadDownloadImg(url);
        } else {
          new Error(
            `StoreMapImgApiRequestError : Http status code ${this.status}`
          );
        }
      },

      loadDownloadImg: function (url) {
        this.storeMap.src = url;
        this.storeMap.onload = (e) => {
          URL.revokeObjectURL(e.target.src);
        };
      },
    };
    this.productDetail = {
      productDetailDescription: null,

      init: function (productDescriptionSelector) {
        this.productDetailDescription = document.querySelector(
          productDescriptionSelector
        );
      },

      showDetailDescription(description) {
        this.productDetailDescription.textContent = description;
      },
    };
  }

  //Setters
  setDisplayInfoId(displayInfoId) {
    this.displayInfoId = displayInfoId;
  };

  setProductImg(productImgSelectors) {
    this.productImg.init(productImgSelectors);
  };

  setReview(reviewSelectors) {
    this.review.init(reviewSelectors);
  };

  setInfoDetail(infoDetailSelectors) {
    this.infoDetail.init(infoDetailSelectors);
  };

  setProductDetail(productDescriptionSelector) {
    this.productDetail.init(productDescriptionSelector);
  };

  setInfoTabMenu(
    tabMenu,
    tabMenuContentContainersSelector
  ) {
    this.infoTabMenu.init(tabMenu, tabMenuContentContainersSelector);
  };

  //API Data Handling
  showProductDetail() {
    this.getProductDetail(this.productApiHandler);
  };

  showReviewsAll() {
    this.getProductDetail(this.reviewApiHandler);
  };

  getProductDetail(callback) {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_PRODUCTS_DETAIL)
      .setCallback(callback)
      .setObjectToBind(this)
      .build();

    ajax.setPathVariable(this.displayInfoId);
    ajax.requestApi();
  };

  productApiHandler(product) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let productImgs = json.productImages;
      let displayInfo = json.displayInfo;
      let displayInfoImg = json.displayInfoImage;
      let reviews = json.comments;
      let averScore = Math.floor(json.averageScore * 10) / 10;

      product.showProductImgs(productImgs, displayInfo);
      product.showProductDetailDescription(displayInfo.productContent);
      product.showReviews(reviews, averScore, displayInfo);
      product.showInfoDetailData(displayInfo, displayInfoImg);
    } else {
      new Error(`ProductApiRequestError : Http status code ${this.status}`);
    }
  };

  reviewApiHandler(product) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let displayInfo = json.displayInfo;
      let reviews = json.comments;
      let averScore = Math.floor(json.averageScore * 10) / 10;

      product.showReviews(reviews, averScore, displayInfo);
    } else {
      new Error(`ReviewApiRequestError : Http status code ${this.status}`);
    }
  };

  showProductImgs(productImgs, displayInfo) {
    let data = this.getProductImgData(productImgs, displayInfo);

    this.productImg.showThumnailImg(data);
    this.productImg.showEtcImg(data);
    this.productImg.showNumOfImgs();
    this.productImg.setProductImgItems();
  };

  getProductImgData(productImgs, displayInfo) {
    return productImgs.map((productImg) => {
      productImg.productDescription = displayInfo.productDescription;
      productImg.displayInfoId = displayInfo.displayInfoId;
      return productImg;
    });
  };

  showProductDetailDescription(description) {
    this.productDetail.showDetailDescription(description);
  };

  showReviews(reviews, averScore, displayInfo) {
    let percentage = averScore / (5 / 100);
    let reviewData = this.getReviewsData(reviews, displayInfo);

    this.review.showRatingGraph(percentage);
    this.review.showRatingScore(averScore);
    this.review.showTotalReviewCount(reviews.length);
    this.review.showReviews(reviewData);
  };

  setMaxNumOfReviews(maxNum) {
    this.review.setMaxNumOfReviews(maxNum);
  };

  getReviewsData(reviews, displayInfo) {
    return reviews.map((review) => {
      review.productDescription = displayInfo.productDescription;
      review.displayInfoId = displayInfo.displayInfoId;
      return review;
    });
  };

  showInfoDetailData(displayInfo, displayInfoImg) {
    this.infoDetail.showProductIntro(displayInfo.productContent);
    this.infoDetail.showStoreName(displayInfo.productDescription);
    this.infoDetail.showStoreStreetAddr(displayInfo.placeStreet);
    this.infoDetail.showStoreOldAddr(displayInfo.placeLot);
    this.infoDetail.showStorePlaceName(displayInfo.placeName);
    this.infoDetail.showStoreTel(displayInfo.telephone);
    this.infoDetail.showStoreMap(displayInfoImg.displayInfoImageId);
  };

};

const Product = kr.connect.reservation.service.Product;

//ProductBuilder
kr.connect.reservation.service.ProductBuilder = class {
  constructor() {
    this.product = new Product();
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.infoDetailSelectors = {
      productIntro: "",
      storeName: "",
      storeStreetAddr: "",
      storeOldAddr: "",
      storePlaceName: "",
      storeTel: "",
      storeMap: "",
    };
    this.reviewSelectors = {
      ratingGraph: "",
      ratingScore: "",
      totalReviewCount: "",
      shortReviewContainer: "",
      reviewHtml: "",
    };
    this.productImgSelectors = {
      productImgHtml: "",
      productImgContainer: "",
      productImgPagination: "",
      prevBtnContainer: "",
      nextBtnContainer: "",
      slideBtnContainer: "",
      productImgsSelector: "",
    };
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error("Selector is not matched");
    }
  };

  validateSelectors(selectors) {
    if (typeof selectors != typeof {}) {
      new Error("Selectors is required type of Object that consists of selector");
    }

    Object.keys(selectors).forEach((selector) => {
      this.validateSelector(selector);
    });
  };

  validateProperty(
    selectors,
    targetSelectors
  ) {
    Object.keys(selectors).forEach((property) => {
      if (targetSelectors[property] === undefined) {
        new Error(`${property} is undefined`);
      }
      selectors[property] = targetSelectors[property];
    });
  };

  setDisplayInfoId(displayInfo) {
    if (typeof displayInfo != typeof 0) {
      new Error("DisplayInfoId is required type of Number");
    }
    this.product.setDisplayInfoId(displayInfo);

    return this;
  };

  setProductDetailDescription(
    detailDescriptionSelector
  ) {
    this.validateSelector(detailDescriptionSelector);
    this.product.setProductDetailDescription(detailDescriptionSelector);

    return this;
  };

  setProductDetail(
    productDescriptionSelector
  ) {
    this.validateSelector(productDescriptionSelector);
    this.product.setProductDetail(productDescriptionSelector);
    return this;
  };

  setReview(reviewSelectors) {
    this.validateSelectors(reviewSelectors);
    this.validateProperty(this.reviewSelectors, reviewSelectors);
    this.product.setReview(reviewSelectors);
    return this;
  };

  setInfoDetail(infoDetailSelectors) {
    this.validateSelectors(infoDetailSelectors);
    this.validateProperty(this.infoDetailSelectors, infoDetailSelectors);
    this.product.setInfoDetail(this.infoDetailSelectors);

    return this;
  };

  setProductImg(productImgSelectors) {
    this.validateSelectors(productImgSelectors);
    this.validateProperty(this.productImgSelectors, productImgSelectors);
    this.product.setProductImg(productImgSelectors);
    return this;
  };

  setInfoTabMenu(
    tabMenu,
    tabMenuContentContainersSelector
  ) {
    if (typeof tabMenu != typeof {}) {
      new Error("TabMenu is required type of Object");
    }
    this.validateSelector(tabMenuContentContainersSelector);
    this.product.setInfoTabMenu(tabMenu, tabMenuContentContainersSelector);

    return this;
  };

  build() {
    return this.product;
  };
};

const ProductBuilder = kr.connect.reservation.service.ProductBuilder;

//MyReservation
kr.connect.reservation.service.MyReservation = class {
  constructor() {
    this.reservaionEmail = null;
    this.reservationSummaryBoard = {
      summaryBoard: null,
      totalCnt: null,
      confirmCnt: null,
      usedCnt: null,
      cancelCnt: null,

      init: function (summaryItemSelector) {
        this.summaryBoard = document.querySelectorAll(summaryItemSelector);
        this.totalCnt = this.summaryBoard[0];
        this.confirmCnt = this.summaryBoard[1];
        this.usedCnt = this.summaryBoard[2];
        this.cancelCnt = this.summaryBoard[3];
      },

      setTotalCnt: function (totalCnt) {
        this.totalCnt.textContent = totalCnt;
      },

      setConfirmCnt: function (confirmCnt) {
        this.confirmCnt.textContent = confirmCnt;
      },

      setUsedCnt: function (usedCnt) {
        this.usedCnt.textContent = usedCnt;
      },

      setCancelCnt: function (cancelCnt) {
        this.cancelCnt.textContent = cancelCnt;
      },
    };

    this.reservationInfo = {
      reservationContainer: null,
      emptyReservation: null,
      confirmItemHtml: "",
      cancelItemHtml: "",
      confirmItemContainer: null,
      cancelItemContainer: null,
      cancelPopupSelectors: null,
      usedItemHtml: null,
      usedItemContainer: null,

      cancelPopup: {
        reservationEmail: "",
        cancelPopupContainer: null,
        closeBtn: null,
        title: null,
        date: null,
        popupBtnContainer: null,
        reservationIdToCancel: 0,
        confirmItemContainer: null,

        init: function (cancelPopupSelectors, confirmItemContainer) {
          this.cancelPopupContainer = document.querySelector(
            cancelPopupSelectors.cancelPopupContainer
          );
          this.closeBtn = document.querySelector(cancelPopupSelectors.closeBtn);
          var cancelInfo = document.querySelector(
            cancelPopupSelectors.cancelInfo
          );
          this.title = cancelInfo.children[0];
          this.date = cancelInfo.children[1];
          this.popupBtnContainer = document.querySelector(
            cancelPopupSelectors.popupBtnContainer
          );
          this.confirmItemContainer = confirmItemContainer;

          this.initEvent();
        },

        setConfirmItemContainer: function (confirmItemContainer) {
          this.confirmItemContainer = confirmItemContainer;
        },

        initEvent: function () {
          this.confirmItemContainer.addEventListener(
            "click",
            this.cancelBtnListener.bind(this)
          );
          this.closeBtn.addEventListener(
            "click",
            this.closeBtnClickListener.bind(this)
          );
          this.popupBtnContainer.addEventListener(
            "click",
            this.popupBtnClickEventListener.bind(this)
          );
        },

        cancelBtnListener: function (e) {
          e.preventDefault();

          let isEventTargetTag = false;
          let buttonTag;
          switch (e.target.tagName.toLowerCase()) {
            case "button":
              isEventTargetTag = true;
              buttonTag = e.target;
              break;
            case "span":
              isEventTargetTag = true;
              buttonTag = e.target.parentElement;
              break;
          }

          if (isEventTargetTag) {
            let infoContainerNode = buttonTag.parentNode.parentNode;
            let title = this.getTitleText(infoContainerNode);
            let date = this.getDateText(infoContainerNode);
            this.reservationIdToCancel = this.getReservationId(infoContainerNode);

            this.showPopup();
            this.showTitle(title);
            this.showDate(date);
          }
        },

        closeBtnClickListener: function (e) {
          e.preventDefault();
          this.closePopup();
        },

        showPopup: function () {
          this.cancelPopupContainer.classList.remove("hide");
        },

        closePopup: function () {
          this.cancelPopupContainer.classList.add("hide");
        },

        showTitle: function (title) {
          this.title.textContent = title;
        },

        showDate: function (date) {
          this.date.textContent = date;
        },

        getTitleText: function (infoContainerNode) {
          let hTag = DomUtil.findChildNodeByClassName(infoContainerNode, "tit");
          return hTag.textContent;
        },

        getDateText: function (infoContainerNode) {
          let ulTag = DomUtil.findChildNodeByClassName(
            infoContainerNode,
            "detail"
          );
          let liTag = ulTag.firstElementChild;
          let emTag = liTag.children[1];

          return emTag.textContent;
        },

        getReservationId: function (infoContainerNode) {
          let emTag = DomUtil.findChildNodeByClassName(
            infoContainerNode,
            "booking_number"
          );
          let idPattern = /\d+/;
          let id = emTag.textContent.match(idPattern)[0];

          if (id.length > 0) {
            return id;
          } else {
            new Error("No Such ReservationId Error");
          }
        },

        popupBtnClickEventListener: function (e) {
          e.preventDefault();

          let isEventTargetTag = false;
          let aTag;
          switch (e.target.tagName.toLowerCase()) {
            case "a":
              aTag = e.target;
              isEventTargetTag = true;
              break;
            case "span":
              aTag = e.target.parentNode;
              isEventTargetTag = true;
              break;
          }

          if (isEventTargetTag) {
            switch (this.getPopupBtnClassName(aTag)) {
              case "yes_btn":
                this.cancelReservation();
                break;
              case "no_btn":
                this.closePopup();
                break;
            }
          }
        },

        getPopupBtnClassName(btn) {
          let classList = btn.classList;
          let className = Object.values(classList).filter((name) => {
            if (name === "yes_btn" || name === "no_btn") {
              return name;
            }
          })[0];

          return className;
        },

        cancelReservation: function () {
          let ajax = new AjaxBuilder()
            .setHttpMethod(Ajax.HTTP_METHOD.PUT)
            .setUrl(Ajax.URL.API.PUT_RESERVATIONS)
            .setCallback(this.cancelReservationRequestHandler)
            .setObjectToBind(this)
            .build();

          ajax.setPathVariable(this.reservationIdToCancel);
          ajax.requestApi();
        },

        cancelReservationRequestHandler: function (myReservation) {
          if (this.status === 200) {
            alert("예약이 취소되었습니다.");
            window.location.reload();
          } else {
            new Error(`ProductApiRequestError : Http status code ${this.status}`);
          }
        },

        setReservationEmail: function (reservationEmail) {
          this.reservationEmail = reservationEmail;
        },
      },

      init: function (reservationInfoSelectors, cancelPopupSelectors) {
        this.cancelPopupSelectors = cancelPopupSelectors;
        this.reservationContainer = document.querySelector(
          reservationInfoSelectors.reservationContainer
        );
        this.emptyReservation = document.querySelector(
          reservationInfoSelectors.emptyReservation
        );
        this.confirmItemHtml = document.querySelector(
          reservationInfoSelectors.confirmItemHtml
        ).innerHTML;
        this.cancelItemHtml = document.querySelector(
          reservationInfoSelectors.cancelItemHtml
        ).innerHTML;
        this.usedItemHtml = document.querySelector(
          reservationInfoSelectors.usedItemHtml
        ).innerHTML;
        this.confirmItemContainer = document.querySelector(
          reservationInfoSelectors.confirmItemContainer
        );
        this.cancelItemContainer = document.querySelector(
          reservationInfoSelectors.cancelItemContainer
        );
        this.usedItemContainer = document.querySelector(
          reservationInfoSelectors.usedItemContainer
        );
      },

      showReservationList: function (
        confirmReservations,
        cancelReservations,
        usedReservations
      ) {
        this.showReservationContainer();
        this.hideEmptyReservation();

        let lengthOfConfirm = confirmReservations.length;
        let lengthOfCancel = cancelReservations.length;
        let lengthOfUsed = usedReservations.length;

        if (lengthOfConfirm > 0) {
          this.showConfirmReservations(confirmReservations);
          this.cancelPopup.init(
            this.cancelPopupSelectors,
            this.confirmItemContainer
          );
        }

        if (lengthOfCancel > 0) {
          this.showCancelReservations(cancelReservations);
        }

        if (lengthOfUsed > 0) {
          this.showUsedReservations(usedReservations);
        }
      },

      showReservationContainer: function () {
        this.reservationContainer.classList.remove("hide");
      },

      hideEmptyReservation: function () {
        this.emptyReservation.classList.add("hide");
      },

      showConfirmReservations: function (confirmReservations) {
        Handlebars.registerHelper(
          "changeCurrencyPattern",
          this.changeCurrencyPattern.bind(this)
        );
        Handlebars.registerHelper(
          "changeDatePattern",
          this.changeDatePattern.bind(this)
        );

        let bindTemplate = Handlebars.compile(this.confirmItemHtml);
        let resultHtml = confirmReservations.reduce((acc, item) => {
          item.placeName = item.displayInfo.placeName;
          item.productDescription = item.displayInfo.productDescription;
          return acc + bindTemplate(item);
        }, "");

        this.confirmItemContainer.innerHTML += resultHtml;
      },

      showCancelReservations: function (cancelReservations) {
        Handlebars.registerHelper(
          "changeCurrencyPattern",
          this.changeCurrencyPattern.bind(this)
        );
        Handlebars.registerHelper(
          "changeDatePattern",
          this.changeDatePattern.bind(this)
        );

        let bindTemplate = Handlebars.compile(this.cancelItemHtml);
        let resultHtml = cancelReservations.reduce((acc, item) => {
          item.placeName = item.displayInfo.placeName;
          item.productDescription = item.displayInfo.productDescription;
          return acc + bindTemplate(item);
        }, "");

        this.cancelItemContainer.innerHTML += resultHtml;
      },

      showUsedReservations: function (cancelReservations) {
        Handlebars.registerHelper(
          "changeCurrencyPattern",
          this.changeCurrencyPattern.bind(this)
        );
        Handlebars.registerHelper(
          "changeDatePattern",
          this.changeDatePattern.bind(this)
        );

        let bindTemplate = Handlebars.compile(this.usedItemHtml);
        let resultHtml = cancelReservations.reduce((acc, item) => {
          item.placeName = item.displayInfo.placeName;
          item.productDescription = item.displayInfo.productDescription;
          item.productId = item.displayInfo.productId;
          return acc + bindTemplate(item);
        }, "");

        this.usedItemContainer.innerHTML += resultHtml;
      },

      changeCurrencyPattern: function (price) {
        let reversePrice = StrUtil.reverseStr(price.toString());
        let countOfdot = Math.floor(reversePrice.length / 4);
        while (countOfdot > 0) {
          reversePrice = reversePrice.replace(/([0-9]{3})([0-9])/, "$1,$2");
          countOfdot--;
        }
        price = StrUtil.reverseStr(reversePrice);

        return price;
      },

      changeDatePattern: function (date) {
        let datePattern = /(\d{4})-(\d{2})-(\d{2})\s[\:0-9]+/;
        let replaceExp = "$1.$2.$3";
        date = date.replace(datePattern, replaceExp);

        let day = new Date(date).getDay();
        switch (day) {
          case 0:
            day = "(일)";
            break;
          case 1:
            day = "(월)";
            break;
          case 2:
            day = "(화)";
            break;
          case 3:
            day = "(수)";
            break;
          case 4:
            day = "(목)";
            break;
          case 5:
            day = "(금)";
            break;
          case 6:
            day = "(토)";
            break;
        }

        return `${date}${day} ${date}${day}`;
      },
    };
  }

  //setters
  setReservationEmail(reservaionEmail) {
    this.reservationEmail = reservaionEmail;
    this.reservationInfo.cancelPopup.setReservationEmail(reservaionEmail);
  };

  setReservationSummaryBoard(
    summaryItemSelector
  ) {
    this.reservationSummaryBoard.init(summaryItemSelector);
  };

  setReservationInfo(
    reservationInfoSelectors,
    cancelPopupSelectors
  ) {
    this.reservationInfo.init(reservationInfoSelectors, cancelPopupSelectors);
  };

  //API Data Handler
  showReservations(callback) {
    this.getReservations();
  };

  getReservations() {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_RESERVATIONS)
      .setCallback(this.reservationApiHandler)
      .setObjectToBind(this)
      .build();

    ajax.setRequestParams({
      reservationEmail: this.reservationEmail,
    });
    ajax.requestApi();
  };

  reservationApiHandler(myReservation) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let reservations = json.reservations;
      let confirmReservations = myReservation.getConfirmReservations(
        reservations
      );
      let cancelReservations = myReservation.getCancelReservations(reservations);
      let usedReservations = myReservation.getUsedReservations(reservations);

      myReservation.showReservationInfo(
        confirmReservations,
        cancelReservations,
        usedReservations
      );
      myReservation.showSummaryBoard(
        confirmReservations.length,
        usedReservations.length,
        cancelReservations.length
      );
    } else {
      new Error(`ProductApiRequestError : Http status code ${this.status}`);
    }
  };

  getConfirmReservations(reservations) {
    let yearMonthDayPattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

    return reservations.filter((reservation) => {
      if (reservation.cancelYn === false) {
        var reserveDate = reservation.reservationDate;
        reserveDate = reserveDate.match(yearMonthDayPattern)[0];

        if (!this.hasDatePassed(reserveDate)) {
          return reservation;
        }
      }
    });
  };

  getCancelReservations(reservations) {
    return reservations.filter((reservation) => {
      if (reservation.cancelYn === true) {
        return reservation;
      }
    });
  };

  getUsedReservations(reservations) {
    let yearMonthDayPattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

    return reservations.filter((reservation) => {
      if (reservation.cancelYn === false) {
        let reserveDate = reservation.reservationDate;
        reserveDate = reserveDate.match(yearMonthDayPattern)[0];

        if (this.hasDatePassed(reserveDate)) {
          return reservation;
        }
      }
    });
  };

  hasDatePassed(dateStr) {
    let hasPassed = false;
    let dateTime = new Date(dateStr);
    let nowDateTime = new Date();

    if (dateTime < nowDateTime) {
      if (dateTime.getDate() != nowDateTime.getDate()) {
        hasPassed = true;
      }
    }

    return hasPassed;
  };

  showReservationInfo(
    confirmReservations,
    cancelReservations,
    usedReservations
  ) {
    this.reservationInfo.showReservationList(
      confirmReservations,
      cancelReservations,
      usedReservations
    );
  };

  showSummaryBoard(
    confirmCnt,
    usedCnt,
    cancelCnt
  ) {
    let totalCnt = confirmCnt + usedCnt + cancelCnt;

    this.reservationSummaryBoard.setTotalCnt(totalCnt);
    this.reservationSummaryBoard.setConfirmCnt(confirmCnt);
    this.reservationSummaryBoard.setUsedCnt(usedCnt);
    this.reservationSummaryBoard.setCancelCnt(cancelCnt);
  };
};

const MyReservation = kr.connect.reservation.service.MyReservation;

//MyReservationBuilder
kr.connect.reservation.service.MyReservationBuilder = class {
  constructor() {
    this.myReservation = new MyReservation();
    this.reservationInfoSelectors = {
      reservationContainer: "",
      emptyReservation: "",
      confirmItemHtml: "",
      cancelItemHtml: "",
      confirmItemContainer: "",
      cancelItemContainer: "",
      usedItemHtml: "",
      usedItemContainer: "",
    };
    this.cancelPopupSelectors = {
      cancelPopupContainer: "",
      closeBtn: "",
      cancelInfo: "",
      popupBtnContainer: "",
    };
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error(`Selector is not matched : ${selector}`);
    }
  };

  validateSelectors(selectors) {
    if (typeof selectors != typeof {}) {
      new Error("Selectors is required type of Object that consists of selector");
    }

    Object.keys(selectors).forEach((selector) => {
      this.validateSelector(selector);
    });
  };

  validateProperty(
    selectors,
    targetSelectors
  ) {
    Object.keys(selectors).forEach((property) => {
      if (targetSelectors[property] === undefined) {
        new Error(`${property} is undefined`);
      }
      selectors[property] = targetSelectors[property];
    });
  };

  setReservationEmail(
    reservationEmail
  ) {
    this.myReservation.setReservationEmail(reservationEmail);
    return this;
  };

  setReservationSummaryBoard(
    summaryItemSelector
  ) {
    this.validateSelector(summaryItemSelector);
    this.myReservation.setReservationSummaryBoard(summaryItemSelector);
    return this;
  };

  setReservationInfo(
    reservationInfoSelectors,
    cancelPopupSelectors
  ) {
    this.validateSelectors(reservationInfoSelectors);
    this.validateSelectors(cancelPopupSelectors);
    this.validateProperty(
      this.reservationInfoSelectors,
      reservationInfoSelectors
    );
    this.validateProperty(this.cancelPopupSelectors, cancelPopupSelectors);

    this.myReservation.setReservationInfo(
      reservationInfoSelectors,
      cancelPopupSelectors
    );
    return this;
  };

  build() {
    return this.myReservation;
  };
};

const MyReservationBuilder =
  kr.connect.reservation.service.MyReservationBuilder;

//Reserve
kr.connect.reservation.service.Reserve = class {
  constructor() {
    this.displayInfoId = 0;
    this.headerTitle = null;

    this.imgType = {
      THUMNAIL: "th",
      MAIN: "ma",
      ETC: "et",
    };

    this.productInfo = {
      thumnailContainer: null,
      productDetailContainer: null,
      thumnailImgHtml: null,
      productDetailHtml: null,

      init: function (productInfoSelectors) {
        this.thumnailContainer = document.querySelector(
          productInfoSelectors.thumnailContainer
        );
        this.productDetailContainer = document.querySelector(
          productInfoSelectors.productDetailContainer
        );
        this.thumnailImgHtml = document.querySelector(
          productInfoSelectors.thumnailImgHtml
        ).innerHTML;
        this.productDetailHtml = document.querySelector(
          productInfoSelectors.productDetailHtml
        ).innerHTML;
      },

      showThumnailImg: function (data) {
        let bindTemplate = Handlebars.compile(this.thumnailImgHtml);
        let resultHtml = bindTemplate(data);

        this.thumnailContainer.innerHTML = resultHtml;
        this.downloadThumbnailImg(data);
      },

      downloadThumbnailImg: function (data) {
        let bindObj = {
          reserve: this,
        };

        let ajax = new AjaxBuilder()
          .setHttpMethod(Ajax.HTTP_METHOD.GET)
          .setUrl(Ajax.URL.API.GET_PRODUCT_IMAGE)
          .setCallback(this.thumbnailImgApiHandler)
          .setObjectToBind(bindObj)
          .build();

        ajax.setResponseType("blob");
        ajax.setPathVariable(data.productImageId);
        ajax.requestApi();
      },

      thumbnailImgApiHandler: function (bindObj) {
        if (this.status === 200) {
          let blob = this.response;
          let url = window.URL.createObjectURL(blob);
          bindObj.reserve.showThumbnailBlobImg(url);
        } else {
          new Error(`PromotionImgApiRequestError : Http status code ${this.status}`);
        }
      },

      showThumbnailBlobImg: function (url) {
        let liTag = this.thumnailContainer.firstElementChild;
        let imgTag = liTag.firstElementChild;
        imgTag.src = url;
      },

      showProductDetail: function (data) {
        Handlebars.registerHelper("showPriceInfo", this.showPriceInfo.bind(this));

        let bindTemplate = Handlebars.compile(this.productDetailHtml);
        let resultHtml = bindTemplate(data);

        this.productDetailContainer.innerHTML = resultHtml;
      },

      showPriceInfo: function (price, priceType) {
        let resultInfo = "";
        resultInfo = priceType.reduce((acc, cur, idx) => {
          switch (cur) {
            case Reserve.productPriceType.ADULT:
              acc += `성인(만 19~64세) ${price[idx]}원`;
              break;
            case Reserve.productPriceType.YOUTH:
              acc += `청소년(만 13~18세) ${price[idx]}원`;
              break;
            case Reserve.productPriceType.SET:
              acc += `세트 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.DISABLED:
              acc += `장애인 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.EARLY_BIRD:
              acc += `얼리버드 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.VIP:
              acc += `VIP ${price[idx]}원`;
              break;
            case Reserve.productPriceType.R_SEAT:
              acc += `R석 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.B_SEAT:
              acc += `B석 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.S_SEAT:
              acc += `S석 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.DAY:
              acc += `평일 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.BABY:
              acc += `유아 ${price[idx]}원`;
              break;
            case Reserve.productPriceType.CITIZEN:
              acc += `지역주민 ${price[idx]}원`;
              break;
          }

          if (idx != priceType.length - 1) {
            acc += " / ";
          }

          return acc;
        }, resultInfo);

        return resultInfo;
      },
    };

    this.productTicket = {
      ticketContainer: null,
      ticketQtyHtml: "",
      totalCount: null,
      reserveBtnHandler: null,

      init: function (productTicketSelectors) {
        this.ticketContainer = document.querySelector(
          productTicketSelectors.ticketContainer
        );
        this.ticketQtyHtml = document.querySelector(
          productTicketSelectors.ticketQtyHtml
        ).innerHTML;
        this.totalCount = document.querySelector(
          productTicketSelectors.totalCount
        );

        this.initEvent();
      },

      setReserveBtnHandler: function (reserveBtnHandler) {
        this.reserveBtnHandler = reserveBtnHandler;
      },

      initEvent: function () {
        this.ticketContainer.addEventListener(
          "click",
          this.ticketCntBtnClickListener.bind(this)
        );
      },

      ticketCntBtnClickListener: function (e) {
        e.preventDefault();

        let isEventTargetTag = false;
        let aTag = null;

        switch (e.target.tagName.toLowerCase()) {
          case "a":
            isEventTargetTag = true;
            aTag = e.target;
            e.stopImmediatePropagation();
            break;
        }

        if (isEventTargetTag) {
          let parentNode = aTag.parentNode;
          let cntControlInputNode = parentNode.children[1];
          let cntControlNode = parentNode.parentNode;
          let totalPriceContainerNode = cntControlNode.children[1];
          let totalPriceNode = totalPriceContainerNode.firstElementChild;

          let ticketCnt = Number(cntControlInputNode.value);
          let ticketPrice = Number(
            cntControlNode.nextElementSibling.children[1].dataset.price
          );
          switch (aTag.title) {
            case "더하기":
              ticketCnt++;
              this.totalCount.textContent =
                Number(this.totalCount.textContent) + 1;
              if (ticketCnt > 0) {
                var minusBtn = aTag.previousElementSibling.previousElementSibling;
                this.activeTicketCount(
                  cntControlInputNode,
                  minusBtn,
                  totalPriceContainerNode
                );
              }
              break;
            case "빼기":
              if (ticketCnt > 0) {
                ticketCnt--;
                this.totalCount.textContent =
                  Number(this.totalCount.textContent) - 1;
              }

              if (ticketCnt === 0) {
                this.inactiveTicketCount(
                  cntControlInputNode,
                  aTag,
                  totalPriceContainerNode
                );
              }
              break;
          }
          cntControlInputNode.value = ticketCnt;
          totalPriceNode.textContent = this.changeCurrencyPattern(
            ticketPrice * ticketCnt
          );
          this.reserveBtnHandler.checkReserveBtn();
        }
      },

      activeTicketCount: function (ticketCntNode, minusBtn, totalPriceNode) {
        ticketCntNode.classList.remove("disabled");
        minusBtn.classList.remove("disabled");
        totalPriceNode.classList.add("on_color");
      },

      inactiveTicketCount: function (ticketCntNode, minusBtn, totalPriceNode) {
        ticketCntNode.classList.add("disabled");
        minusBtn.classList.add("disabled");
        totalPriceNode.classList.remove("on_color");
      },

      setTicketCntContainer: function () {
        this.ticketCntContainer = document.querySelector(
          this.ticketCntContainerSelector
        );
      },

      showProductTicketQty: function (productPrices) {
        Handlebars.registerHelper(
          "changeCurrencyPattern",
          this.changeCurrencyPattern.bind(this)
        );
        Handlebars.registerHelper(
          "changePriceTypeToKorean",
          this.changePriceTypeToKorean.bind(this)
        );

        let bindTemplate = Handlebars.compile(this.ticketQtyHtml);
        let resultHtml = productPrices.reduce((acc, item) => {
          return acc + bindTemplate(item);
        }, "");

        this.ticketContainer.innerHTML += resultHtml;
        this.setTicketCntContainer();
        this.initEvent();
      },

      changeCurrencyPattern: function (price) {
        let reversePrice = StrUtil.reverseStr(price.toString());
        let countOfdot = Math.floor(reversePrice.length / 4);
        while (countOfdot > 0) {
          reversePrice = reversePrice.replace(/([0-9]{3})([0-9])/, "$1,$2");
          countOfdot--;
        }
        price = StrUtil.reverseStr(reversePrice);

        return price;
      },

      changePriceTypeToKorean: function (priceType) {
        let priceTypeName = "";

        switch (priceType) {
          case Reserve.productPriceType.ADULT:
            priceTypeName = "성인";
            break;
          case Reserve.productPriceType.YOUTH:
            priceTypeName = "청소년";
            break;
          case Reserve.productPriceType.SET:
            priceTypeName = "세트";
            break;
          case Reserve.productPriceType.DISABLED:
            priceTypeName = "장애인";
            break;
          case Reserve.productPriceType.EARLY_BIRD:
            priceTypeName = "얼리버드";
            break;
          case Reserve.productPriceType.VIP:
            priceTypeName = "VIP";
            break;
          case Reserve.productPriceType.R_SEAT:
            priceTypeName = "R석";
            break;
          case Reserve.productPriceType.B_SEAT:
            priceTypeName = "B석";
            break;
          case Reserve.productPriceType.S_SEAT:
            priceTypeName = "S석";
            break;
          case Reserve.productPriceType.DAY:
            priceTypeName = "평일";
            break;
          case Reserve.productPriceType.BABY:
            priceTypeName = "유아";
            break;
          case Reserve.productPriceType.CITIZEN:
            priceTypeName = "지역주민";
            break;
        }
        return priceTypeName;
      },
    };

    this.reservationForm = {
      agreementContainer: null,
      agreeAllBtn: null,
      reserveBtnContainer: null,
      reserveBtn: null,
      reserveForm: null,
      formValidater: null,
      reserveDate: null,
      nameInput: null,
      emailInput: null,
      telInput: null,
      nameInputWarningMsg: null,
      emailInputWarningMsg: null,
      telInputWarningMsg: null,
      reserveBtnHandler: null,

      postReservationData: {
        displayInfoId: 0,
        productId: 0,
        reservationEmail: "",
        reservationName: "",
        reservationTelephone: "",
        reservationYearMonthDay: "",
        prices: [],
      },
      init: function (reservationFormSelectors) {
        this.agreementContainer = document.querySelector(
          reservationFormSelectors.agreementContainer
        );
        this.agreeAllBtn = document.querySelector(
          reservationFormSelectors.agreeAllBtn
        );
        this.reserveBtnContainer = document.querySelector(
          reservationFormSelectors.reserveBtnContainer
        );
        this.reserveBtn = document.querySelector(
          reservationFormSelectors.reserveBtn
        );
        this.reserveForm = document.querySelector(
          reservationFormSelectors.reserveForm
        );
        this.reserveDate = document.querySelector(
          reservationFormSelectors.reserveDate
        );
        this.nameInput = document.querySelector(
          reservationFormSelectors.nameInput
        );
        this.emailInput = document.querySelector(
          reservationFormSelectors.emailInput
        );
        this.telInput = document.querySelector(reservationFormSelectors.telInput);
        this.nameInputWarningMsg = this.nameInput.nextElementSibling;
        this.emailInputWarningMsg = this.emailInput.nextElementSibling;
        this.telInputWarningMsg = this.telInput.nextElementSibling;

        this.formValidater = new FormDataValidaterBuilder()
          .setForm(reservationFormSelectors.reserveForm)
          .setEmailInput(
            reservationFormSelectors.emailInput,
            this.emailInputWarningMsg
          )
          .setTelInput(reservationFormSelectors.telInput, this.telInputWarningMsg)
          .setNameInput(
            reservationFormSelectors.nameInput,
            this.nameInputWarningMsg
          )
          .setSubmitBtn(reservationFormSelectors.reserveBtn)
          .setSubmitBtnCallback(this.reserveBtnClickListener.bind(this))
          .build();

        this.initEvent();
        this.startFormValidation();
      },

      showReserveDate: function (reserveDateStr) {
        this.reserveDate.childNodes[0].textContent = `${reserveDateStr} 총 `;
      },

      setDisplayInfoId: function (displayInfoId) {
        this.postReservationData.displayInfoId = displayInfoId;
      },

      setProductId: function (productId) {
        this.postReservationData.productId = productId;
      },

      setReserveBtnHandler: function (reserveBtnHandler) {
        this.reserveBtnHandler = reserveBtnHandler;
      },

      startFormValidation: function () {
        this.formValidater.startEmailValidate(this.reserveBtnHandler.checkReserveBtn, this.reserveBtnHandler);
        this.formValidater.startTelValidate(this.reserveBtnHandler.checkReserveBtn, this.reserveBtnHandler);
        this.formValidater.startNameValidate(this.reserveBtnHandler.checkReserveBtn, this.reserveBtnHandler);
      },

      initEvent: function () {
        this.agreementContainer.addEventListener(
          "click",
          this.agreementBtnClickListener.bind(this)
        );
        this.agreeAllBtn.addEventListener(
          "click",
          this.agreeAllBtnClickListener.bind(this)
        );
      },

      agreementBtnClickListener: function (e) {
        let isEventTargetTag = false;
        let aTag = null;
        let spanTag = null;
        let iTag = null;
        switch (e.target.tagName.toLowerCase()) {
          case "a":
            isEventTargetTag = true;
            aTag = e.target;
            spanTag = aTag.firstElementChild;
            iTag = aTag.lastElementChild;

            e.preventDefault();
            e.stopImmediatePropagation();
            break;
          case "span":
            if (DomUtil.hasClass(e.target, "btn_text")) {
              isEventTargetTag = true;
              aTag = e.target.parentNode;
              spanTag = e.target;
              iTag = spanTag.nextElementSibling;

              e.preventDefault();
              e.stopImmediatePropagation();
            }
            break;
          case "i":
            if (
              DomUtil.hasClass(e.target, "fn-down2") ||
              DomUtil.hasClass(e.target, "fn-up2")
            ) {
              isEventTargetTag = true;
              aTag = e.target.parentNode;
              iTag = e.target;
              spanTag = iTag.previousElementSibling;

              e.preventDefault();
              e.stopImmediatePropagation();
            }
            break;
        }

        if (isEventTargetTag) {
          let agreementNode = aTag.parentNode;
          if (DomUtil.hasClass(agreementNode, "open")) {
            this.closeAgreement(agreementNode, spanTag, iTag);
          } else {
            this.openAgreement(agreementNode, spanTag, iTag);
          }
        }
      },

      openAgreement: function (agreementNode, spanTag, iTag) {
        agreementNode.classList.add("open");
        spanTag.textContent = "접기";
        iTag.classList.remove("fn-down2");
        iTag.classList.add("fn-up2");
      },

      closeAgreement: function (agreementNode, spanTag, iTag) {
        agreementNode.classList.remove("open");
        spanTag.textContent = "보기";
        iTag.classList.remove("fn-up2");
        iTag.classList.add("fn-down2");
      },

      agreeAllBtnClickListener: function (e) {
        if (this.agreeAllBtn.dataset.check === "true") {
          this.agreeAllBtn.dataset.check = "false";
        } else {
          this.agreeAllBtn.dataset.check = "true";
        }
        this.reserveBtnHandler.checkReserveBtn();
      },

      getResevationDate: function () {
        let yearMonthDayPattern = /\d+.\d{1,2}.\d{1,2}/;
        let yearMonthDayStr = this.reserveDate.childNodes[0].textContent;
        yearMonthDayStr = yearMonthDayStr.match(yearMonthDayPattern)[0];

        let reserveDate = new Date(yearMonthDayStr);
        let month = (reserveDate.getUTCMonth() + 1).toString();
        let date = reserveDate.getDate().toString();

        let reserveYearMonthDayStr = this
          .addZero `${reserveDate.getUTCFullYear()}${month}${date}`;
        let timePattern = /\d{2}:\d{2}:\d{2}/;
        let nowDate = new Date();
        let reserveTimeStr = nowDate.toTimeString().match(timePattern)[0];

        return `${reserveYearMonthDayStr} ${reserveTimeStr}`;
      },

      addZero: function (strings, year, month, date) {
        if (month.length < 2) {
          month = `0${month}`;
        }

        if (date.length < 2) {
          date = `0${date}`;
        }

        return `${year}-${month}-${date}`;
      },

      reserveBtnClickListener: function (e) {
        if (!DomUtil.hasClass(this.reserveBtnContainer, "disable")) {
          if (this.reserveBtnHandler.isValidReserveData()) {
            this.postReservationData.reservationName = this.nameInput.value;
            this.postReservationData.reservationEmail = this.emailInput.value;
            this.postReservationData.reservationTelephone = this.telInput.value;
            this.postReservationData.prices = this.reserveBtnHandler.getPricesData();
            this.postReservationData.reservationYearMonthDay = this.getResevationDate();

            var ajax = new AjaxBuilder()
              .setHttpMethod(Ajax.HTTP_METHOD.POST)
              .setUrl(Ajax.URL.API.POST_RESERVATIONS)
              .setCallback(this.postReservationApiHandler)
              .setObjectToBind(this)
              .build();

            ajax.setRequestBodyData(this.postReservationData);
            ajax.requestApi();
          } else {
            alert("예매 티켓, 예매자 정보 입력 및 약관 동의를 체크해야합니다.");
          }
        }
      },

      postReservationApiHandler: function (reserveForm) {
        if (this.status === 200) {
          alert("예약이 완료되었습니다.");
          window.location.reload();
        } else {
          alert("예약과정에 문제가 생겼습니다. 다시 시도해주세요.");
          new Error(
            `postReservationApiRequestError : Http status code ${this.status}`
          );
        }
      },
    };

    this.reserveBtnHandler = {
      reserveBtnContainer: null,
      agreeAllBtn: null,
      nameInput: null,
      emailInput: null,
      telInput: null,
      nameInputWarningMsg: null,
      emailInputWarningMsg: null,
      telInputWarningMsg: null,

      init: function (reserveBtnHandlerSelectors) {
        this.reserveBtnContainer = document.querySelector(
          reserveBtnHandlerSelectors.reserveBtnContainer
        );
        this.agreeAllBtn = document.querySelector(
          reserveBtnHandlerSelectors.agreeAllBtn
        );
        this.nameInput = document.querySelector(
          reserveBtnHandlerSelectors.nameInput
        );
        this.emailInput = document.querySelector(
          reserveBtnHandlerSelectors.emailInput
        );
        this.telInput = document.querySelector(
          reserveBtnHandlerSelectors.telInput
        );
        this.nameInputWarningMsg = this.nameInput.nextElementSibling;
        this.emailInputWarningMsg = this.emailInput.nextElementSibling;
        this.telInputWarningMsg = this.telInput.nextElementSibling;
      },

      checkReserveBtn: function () {
        if (this.isValidReserveData()) {
          this.activeReserveBtn();
        } else {
          this.inactiveReserveBtn();
        }
      },

      isValidReserveData: function () {
        return (this.isFormDataValid() && this.isTicketDataValid() && this.isAgreeCheckValid());
      },

      isFormDataValid: function () {
        return (
          this.emailInputWarningMsg.dataset.valid === "true" &&
          this.nameInputWarningMsg.dataset.valid === "true" &&
          this.telInputWarningMsg.dataset.valid === "true"
        );
      },

      isTicketDataValid: function () {
        return this.getPricesData().length > 0;
      },

      isAgreeCheckValid: function () {
        return this.agreeAllBtn.dataset.check === "true";
      },

      getPricesData: function () {
        let productPriceIds = document.querySelectorAll(".productPriceId");
        let counts = document.querySelectorAll(".count_control_input");
        let prices = Object.values(counts)
          .reduce((acc, cur, idx) => {
            return [
              ...acc,
              {
                count: cur.value,
                productPriceId: productPriceIds[idx].value
              }
            ];
          }, [])
          .filter(price => {
            if (price.count > 0) {
              return price;
            }
          });

        return prices;
      },

      activeReserveBtn: function () {
        this.reserveBtnContainer.classList.remove("disable");
      },

      inactiveReserveBtn: function () {
        this.reserveBtnContainer.classList.add("disable");
      },
    };
  }

  setDisplayInfoId(displayInfoId) {
    this.displayInfoId = displayInfoId;
  };

  setHeaderTitle(headerTitleSelector) {
    this.headerTitle = document.querySelector(headerTitleSelector);
  };

  setProductInfo(productInfoSelectors) {
    this.productInfo.init(productInfoSelectors);
  };

  setProductTicket(productTicketSelectors) {
    this.productTicket.init(productTicketSelectors);
  };

  setReservationForm(reservationFormSelectors) {
    this.reservationForm.init(reservationFormSelectors);
  };

  setReserveBtnHandler(reserveBtnHandlerSelectors) {
    this.reserveBtnHandler.init(reserveBtnHandlerSelectors);
    this.reservationForm.setReserveBtnHandler(this.reserveBtnHandler);
    this.productTicket.setReserveBtnHandler(this.reserveBtnHandler);
  };

  showProductInfo() {
    this.getProductInfo();
  };

  getProductInfo() {
    let ajax = new AjaxBuilder()
      .setHttpMethod(Ajax.HTTP_METHOD.GET)
      .setUrl(Ajax.URL.API.GET_PRODUCTS_DETAIL)
      .setCallback(this.productApiHandler)
      .setObjectToBind(this)
      .build();

    ajax.setPathVariable(this.displayInfoId);
    ajax.requestApi();
  };

  productApiHandler(reserve) {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let productImages = json.productImages;
      let displayInfo = json.displayInfo;
      let productPrices = json.productPrices;
      let reservationDate = json.reservationDate;

      reserve.showProductData(productImages, displayInfo, productPrices);
      reserve.showProductTiket(productPrices);
      reserve.reservationForm.setDisplayInfoId(displayInfo.displayInfoId);
      reserve.reservationForm.setProductId(displayInfo.productId);
      reserve.reservationForm.showReserveDate(reservationDate);
      reserve.showHeaderTitle(displayInfo.productDescription);
    } else {
      new Error(`ProductApiRequestError : Http status code ${this.status}`);
    }
  };

  showHeaderTitle(title) {
    this.headerTitle.textContent = title;
  };

  showProductData(
    productImages,
    displayInfo,
    productPrices
  ) {
    let thumnailImg = this.getThumnailImgData(productImages);
    thumnailImg.productDescription = displayInfo.productDescription;
    thumnailImg.displayInfoId = displayInfo.displayInfoId;

    let prices = this.getPriceData(productPrices);
    let priceTypes = this.getPriceTypeData(productPrices);
    displayInfo.price = prices;
    displayInfo.priceTypeName = priceTypes;

    this.productInfo.showThumnailImg(thumnailImg);
    this.productInfo.showProductDetail(displayInfo);
  };

  getThumnailImgData(data) {
    let thumnailImgs = data.filter((img) => img.type == this.imgType.THUMNAIL);
    let thumnailImg;

    if (thumnailImgs.length === 0) {
      thumnailImg = null;
    } else {
      thumnailImg = thumnailImgs[0];
    }

    return thumnailImg;
  };

  getPriceData(data) {
    return Object.keys(data).reduce((acc, cur) => [...acc, data[cur].price], []);
  };

  getPriceTypeData(data) {
    return Object.keys(data).reduce(
      (acc, cur) => [...acc, data[cur].priceTypeName],
      []
    );
  };

  showProductTiket(productPrices) {
    this.productTicket.showProductTicketQty(productPrices);
  };
};

const Reserve = kr.connect.reservation.service.Reserve;

Reserve.productPriceType = {
  ADULT: "A",
  YOUTH: "Y",
  SET: "S",
  DISABLED: "D",
  EARLY_BIRD: "E",
  VIP: "V",
  R_SEAT: "R",
  B_SEAT: "B",
  S_SEAT: "S",
  DAY: "D",
  BABY: "B",
  CITIZEN: "C",
};

//ReserveBuilder
kr.connect.reservation.service.ReserveBuilder = class {
  constructor() {
    this.reserve = new Reserve();
    this.productInfoSelectors = {
      thumnailContainer: null,
      productDetailContainer: null,
    };
    this.productTicketSelectors = {
      ticketContainer: null,
      ticketQtyHtml: null,
      totalCount: 0,
    };
    this.reservationFormSelectors = {
      agreementContainer: null,
      agreeAllBtn: null,
      reserveBtnContainer: null,
      reserveBtn: null,
      reserveForm: null,
      nameInput: null,
      emailInput: null,
      telInput: null,
      reserveDate: null,
    };
    this.reserveBtnHandlerSelectors = {
      reserveBtnContainer: null,
      agreeAllBtn: null,
      nameInput: null,
      emailInput: null,
      telInput: null,
    };
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error(`Selector is not matched : ${selector}`);
    }
  };

  validateSelectors(selectors) {
    if (typeof selectors != typeof {}) {
      new Error("Selectors is required type of Object that consists of selector");
    }

    Object.keys(selectors).forEach((selector) => {
      this.validateSelector(selector);
    });
  };

  validateProperty(
    selectors,
    targetSelectors
  ) {
    Object.keys(selectors).forEach((property) => {
      if (targetSelectors[property] === undefined) {
        new Error(`${property} is undefined`);
      }
      selectors[property] = targetSelectors[property];
    });
  };

  setDisplayInfoId(displayInfoId) {
    this.reserve.setDisplayInfoId(displayInfoId);
    return this;
  };

  setHeaderTitle(headerTitleSelector) {
    this.validateSelectors(headerTitleSelector);
    this.reserve.setHeaderTitle(headerTitleSelector);
    return this;
  };

  setProductInfo(productInfoSelectors) {
    this.validateSelectors(productInfoSelectors);
    this.validateProperty(this.productInfoSelectors, productInfoSelectors);

    this.reserve.setProductInfo(productInfoSelectors);
    return this;
  };

  setProductTicket(productTicketSelectors) {
    this.validateSelectors(productTicketSelectors);
    this.validateProperty(this.productTicketSelectors, productTicketSelectors);

    this.reserve.setProductTicket(productTicketSelectors);
    return this;
  };

  setReservationForm(
    reservationFormSelectors
  ) {
    this.validateSelectors(reservationFormSelectors);
    this.validateProperty(
      this.reservationFormSelectors,
      reservationFormSelectors
    );

    this.reserve.setReservationForm(reservationFormSelectors);
    return this;
  };

  setReserveBtnHandler(
    reserveBtnHandlerSelectors
  ) {

    this.validateSelectors(reserveBtnHandlerSelectors);
    this.validateProperty(
      this.reserveBtnHandlerSelectors,
      reserveBtnHandlerSelectors
    );

    this.reserve.setReserveBtnHandler(reserveBtnHandlerSelectors);
    return this;
  };

  build() {
    return this.reserve;
  };
};

const ReserveBuilder = kr.connect.reservation.service.ReserveBuilder;

//ReviewWrite
kr.connect.reservation.service.ReviewWrite = class {
  constructor() {
    this.reservationInfoId = null;
    this.productId = null;
    this.addReviewBtn = null;
    this.rating = null;
    this.review = {
      MAX_TEXT_NUM: 400,
      reviewWriteInfo: null,
      reviewTextArea: null,
      reviewTextNum: null,

      init: function (reviewSelectors) {
        this.reviewWriteInfo = document.querySelector(
          reviewSelectors.reviewWriteInfo
        );
        this.reviewTextArea = document.querySelector(
          reviewSelectors.reviewTextArea
        );
        this.reviewTextNum = document.querySelector(
          reviewSelectors.reviewTextNum
        );

        this.initEvent();
      },

      initEvent: function () {
        this.reviewWriteInfo.addEventListener(
          "click",
          this.reviewWriteInfoClickListener.bind(this)
        );
        this.reviewTextArea.addEventListener(
          "focusout",
          this.reviewTextAreaFocusoutListener.bind(this)
        );
        this.reviewTextArea.addEventListener(
          "keyup",
          this.reviewTextAreakeyupListener.bind(this)
        );
      },

      reviewWriteInfoClickListener: function (e) {
        this.hideReviewWriteInfo();
        this.focusTextArea();
      },

      reviewTextAreaFocusoutListener: function () {
        this.showReviewWriteInfo();
      },

      reviewTextAreakeyupListener: function (e) {
        let reviewText = e.target.value;

        if (reviewText.length > this.MAX_TEXT_NUM) {
          reviewText = reviewText.substring(0, this.MAX_TEXT_NUM);
          this.reviewTextArea.value = reviewText;

          this.showTextNum(this.MAX_TEXT_NUM);
        } else {
          this.showTextNum(reviewText.length);
        }
      },

      hideReviewWriteInfo: function () {
        this.reviewWriteInfo.classList.add("hide");
      },

      showReviewWriteInfo: function () {
        this.reviewWriteInfo.classList.remove("hide");
      },

      focusTextArea: function () {
        this.reviewTextArea.focus();
      },

      showTextNum: function (num) {
        this.reviewTextNum.textContent = num;
      },

      getReviewTextValue: function () {
        return this.reviewTextArea.value;
      },

      getTextNumValue: function () {
        return this.reviewTextNum.textContent;
      },
    };

    this.reviewImg = {
      imgFileInput: null,
      thumbNailImg: null,
      thumbNailImgContainer: null,

      imgTypePattern: /^(?:image\/)((?:png)|(?:jpg))/,

      init: function (reviewImgSelectors) {
        this.imgFileInput = document.querySelector(
          reviewImgSelectors.imgFileInput
        );
        this.thumbNailImg = document.querySelector(
          reviewImgSelectors.thumbNailImg
        );
        this.thumbNailImgContainer = document.querySelector(
          reviewImgSelectors.thumbNailImgContainer
        );

        this.initEvent();
      },

      initEvent: function () {
        this.imgFileInput.addEventListener(
          "change",
          this.imgFileInputChangeListener.bind(this)
        );
        this.thumbNailImgContainer.addEventListener(
          "click",
          this.thumbNailImgDeleteBtnClickListener.bind(this)
        );
      },

      imgFileInputChangeListener: function (e) {
        let imgs = e.target.files;

        if (!this.validimageType(imgs)) {
          alert("이미지 파일은 png, jpg파일만 등록가능합니다.");
          return;
        }

        this.showThumbImg(imgs[0]);
      },

      thumbNailImgDeleteBtnClickListener: function (e) {
        let isEventTargetTag = false;

        switch (e.target.tagName.toLowerCase()) {
          case "a":
          case "span":
            e.preventDefault();
            isEventTargetTag = true;
            break;
        }

        if (isEventTargetTag) {
          this.hideThumbImg();
        }
      },

      validimageType: function (imgs) {
        let isValidType = true;

        Object.values(imgs).forEach((img) => {
          if (!this.imgTypePattern.test(img.type)) {
            isValidType = false;
          }
        });

        return isValidType;
      },

      showThumbImg: function (img) {
        this.thumbNailImg.src = window.URL.createObjectURL(img);
        this.thumbNailImg.onload = (e) => {
          window.URL.revokeObjectURL(e.target.src);
        };
        this.thumbNailImgContainer.classList.remove("hide");
      },

      hideThumbImg: function () {
        this.thumbNailImgContainer.classList.add("hide");
        this.imgFileInput.value = "";
      },

      getThumbImgFile: function () {
        return this.imgFileInput.files[0];
      },
    };
  }

  setAddReviewBtn(addReviewBtnSelector) {
    this.addReviewBtn = document.querySelector(addReviewBtnSelector);
  };

  setRating(rating) {
    this.rating = rating;
  };

  setReview(reviewSelectors) {
    this.review.init(reviewSelectors);
  };

  setReservationInfoId(reservationInfoId) {
    this.reservationInfoId = reservationInfoId;
  };

  setProductId(productId) {
    this.productId = productId;
  };

  setReviewImg(reviewImgSelectors) {
    this.reviewImg.init(reviewImgSelectors);
  };

  initEvent() {
    if (this.addReviewBtn !== null) {
      this.addReviewBtn.addEventListener(
        "click",
        this.addReviewBtnClickListener.bind(this)
      );
    }
  };

  validReview() {
    if (this.review.getReviewTextValue().length < 5) {
      alert("리뷰는 최소 5자에서 최대 400자까지 입력해야합니다.");
      return false;
    }

    if (Number(this.rating.getRatingScoreValue()) < 1) {
      alert("별점은 1~5점 사이에서 선택해야합니다.");
      return false;
    }

    return true;
  };

  addReviewBtnClickListener(e) {
    if (this.validReview()) {
      let ajax = new AjaxBuilder()
        .setHttpMethod(Ajax.HTTP_METHOD.POST)
        .setUrl(
          Ajax.URL.API.POST_COMMENTS.replace("{id}", this.reservationInfoId)
        )
        .setCallback(this.commentApiHandler)
        .setObjectToBind(this)
        .build();

      let formData = new FormData();
      formData.append("reservationInfoId ", this.reservationInfoId);
      formData.append("productId ", this.productId);
      formData.append("comment ", this.review.getReviewTextValue());
      formData.append("score", Number(this.rating.getRatingScoreValue()));
      if (this.reviewImg.getThumbImgFile() !== undefined) {
        formData.append("attachedImage", this.reviewImg.getThumbImgFile());
      }

      ajax.setRequestFormData(formData);
      ajax.requestApi();
    }
  };

  commentApiHandler(reviewWrite) {
    if (this.status === 200) {
      alert("리뷰가 등록되었습니다.");
      window.location.href = "/reservation/myreservation";
    } else {
      alert("리뷰등록 중에 문제가 발생했습니다. 잠시후 다시 시도해주세요,");
      new Error(`CommentApiRequestError : Http status code ${this.status}`);
    }
  };
};

const ReviewWrite = kr.connect.reservation.service.ReviewWrite;

//ReviewWriteBuilder
kr.connect.reservation.service.ReviewWriteBuilder = class {
  constructor() {
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.reviewWrite = new ReviewWrite();
  }

  validateSelector(selector) {
    if (selector.match(this.selectorPattern) === null) {
      new Error(`Selector is not matched : ${selector}`);
    }
  };

  validateSelectors(selectors) {
    if (typeof selectors != typeof {}) {
      new Error("Selectors is required type of Object that consists of selector");
    }

    Object.keys(selectors).forEach((selector) => {
      this.validateSelector(selector);
    });
  };

  setReservationInfoId(
    reservationInfoId
  ) {
    this.reviewWrite.setReservationInfoId(reservationInfoId);
    return this;
  };

  setProductId(productId) {
    this.reviewWrite.setProductId(productId);
    return this;
  };

  setAddReviewBtn(addReviewBtnSelector) {
    this.validateSelector(addReviewBtnSelector);
    this.reviewWrite.setAddReviewBtn(addReviewBtnSelector);
    return this;
  };

  setRating(rating) {
    this.reviewWrite.setRating(rating);
    return this;
  };

  setReview(reviewSelectors) {
    this.validateSelectors(reviewSelectors);
    this.reviewWrite.setReview(reviewSelectors);
    return this;
  };

  setReviewImg(reviewImgSelectors) {
    this.validateSelectors(reviewImgSelectors);
    this.reviewWrite.setReviewImg(reviewImgSelectors);
    return this;
  };

  build() {
    return this.reviewWrite;
  };
};

const ReviewWriteBuilder = kr.connect.reservation.service.ReviewWriteBuilder;

export {
  PromotionBuilder,
  CategoryBuilder,
  ProductBuilder,
  AccodionBuilder,
  MyReservationBuilder,
  ReserveBuilder,
  ReviewWriteBuilder,
  TabMenuBuilder,
  FormDataValidaterBuilder,
  RatingBuilder,
};