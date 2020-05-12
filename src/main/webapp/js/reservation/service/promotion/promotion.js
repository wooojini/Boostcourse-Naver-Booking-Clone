import { SliderBuilder } from "../../ui/slider.js";
import { Ajax, AjaxBuilder } from "../../util/ajax.js";

//Promotion
class Promotion{
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

//PromotionBuilder
class PromotionBuilder{
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

export {
	  PromotionBuilder
}
