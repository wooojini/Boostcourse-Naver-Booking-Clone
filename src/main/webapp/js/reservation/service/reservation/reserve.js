import { Ajax, AjaxBuilder } from "../../util/ajax.js";
import { FormDataValidaterBuilder } from "../../util/validater.js"
import { StrUtil } from "../../util/str.js"
import { DomUtil } from "../../util/dom.js"

//Reserve
class Reserve{
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
class ReserveBuilder{
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

export {
	ReserveBuilder,
};