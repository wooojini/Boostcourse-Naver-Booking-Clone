import { Ajax, AjaxBuilder } from "../../util/ajax.js";

//ReviewWrite
class ReviewWrite{
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

      reviewTextAreaFocusoutListener: function (e) {
    	let textAreaNode = e.target;
    	let reviewText = textAreaNode.value;
    		
    	if(reviewText.length === 0){
    	  this.showReviewWriteInfo();	
    	}
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

//ReviewWriteBuilder
class ReviewWriteBuilder{
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

export{
	ReviewWriteBuilder
};