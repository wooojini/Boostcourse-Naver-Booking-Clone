import { Ajax, AjaxBuilder } from "../../util/ajax.js";

//Category
class Category{
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

//CategoryBuilder
class CategoryBuilder{
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

export {
  CategoryBuilder,
}