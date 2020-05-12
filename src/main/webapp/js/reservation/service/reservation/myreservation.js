import { Ajax, AjaxBuilder } from "../../util/ajax.js";
import { StrUtil } from "../../util/str.js"
import { DomUtil } from "../../util/dom.js"

//MyReservation
class MyReservation{
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

//MyReservationBuilder
class MyReservationBuilder{
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

export {
	MyReservationBuilder
};