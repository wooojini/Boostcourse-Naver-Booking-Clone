import { Ajax, AjaxBuilder } from "../../util/ajax.js";
import { SliderBuilder } from "../../ui/slider.js";

//Product
class Product{
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

//ProductBuilder
class ProductBuilder{
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

export {
	ProductBuilder,
};