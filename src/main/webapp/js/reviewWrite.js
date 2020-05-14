'use strict';

import { RatingBuilder } from "./reservation/ui/rating.js"
import { ReviewWriteBuilder } from "./reservation/service/review/reviewWrite.js"; 

const RATING_CONTAINER_SELECTOR = ".rating";
const RATING_SCORE_SELECTOR = ".star_rank";
const REVIEW_WRITE_INFO_SELECTOR = ".review_write_info";
const REVIEW_TEXTAREA_SELECTOR = ".review_textarea";
const REVIEW_TEXT_NUM_SELETOR = ".guide_review span";
const REVIEW_IMAGE_INPUT_SELECTOR = "#reviewImageFileOpenInput";
const REVIEW_THUMB_IMAGE_SELECTOR = ".item_thumb";
const REVIEW_THUMB_IMAGE_CONTAINER_SELECTOR = ".lst_thumb .item";
const ADD_REVIEW_BTN_SELECTOR = ".bk_btn";
const RESERVATION_ID_SELECTOR = "#reservationInfoId";
const PRODUCT_ID_SELECTOR = "#productId";

var reviewWrite;
var rating;
document.addEventListener("DOMContentLoaded", function () {
  try {
    init();
    initUiEvent();
  } catch (error) {
    console.error(error.message);
  }
});

function init() {
  rating = new RatingBuilder()
    .setRatingContainer(RATING_CONTAINER_SELECTOR)
    .setRatingScore(RATING_SCORE_SELECTOR)
    .build();

  let reservationInfoId = document.querySelector(RESERVATION_ID_SELECTOR).value;
  let productId = document.querySelector(PRODUCT_ID_SELECTOR).value;
  let reviewSelectors = {
    reviewWriteInfo: REVIEW_WRITE_INFO_SELECTOR,
    reviewTextArea: REVIEW_TEXTAREA_SELECTOR,
    reviewTextNum: REVIEW_TEXT_NUM_SELETOR,
  };
  let reviewImgSelectors = {
    imgFileInput: REVIEW_IMAGE_INPUT_SELECTOR,
    thumbNailImg: REVIEW_THUMB_IMAGE_SELECTOR,
    thumbNailImgContainer: REVIEW_THUMB_IMAGE_CONTAINER_SELECTOR,
  };

  reviewWrite = new ReviewWriteBuilder()
    .setReservationInfoId(reservationInfoId)
    .setProductId(productId)
    .setAddReviewBtn(ADD_REVIEW_BTN_SELECTOR)
    .setRating(rating)
    .setReview(reviewSelectors)
    .setReviewImg(reviewImgSelectors)
    .build();
}

function initUiEvent() {
  rating.initEvent();
  reviewWrite.initEvent();
}
