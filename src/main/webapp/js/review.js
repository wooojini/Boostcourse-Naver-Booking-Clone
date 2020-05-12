import { ProductBuilder } from "./reservation/service/product/product.js";

const DISPLAY_INFO_ID_SELECTOR = "#displayInfoId";
const RATING_GRAPH_SELECTOR = '.graph_value';
const RATING_SCORE_SELECTOR = '.text_value span';
const TOTAL_REVIEW_COUNT_SELECTOR = ".join_count em";
const SHORT_REVIEW_CONTAINER_SELECTOR = ".list_short_review";
const TEMPLATE_REVIEW_SELECTOR = "#reviewItem";

var product;
document.addEventListener("DOMContentLoaded", function () {
    try {
        init();
        showReviews();
    } catch (error) {
        console.error(error.message);
    }
});

function init() {
    let displayInfoId = document.querySelector(DISPLAY_INFO_ID_SELECTOR).value;
    let reviewSelectors = {
        ratingGraph: RATING_GRAPH_SELECTOR,
        ratingScore: RATING_SCORE_SELECTOR,
        totalReviewCount: TOTAL_REVIEW_COUNT_SELECTOR,
        shortReviewContainer: SHORT_REVIEW_CONTAINER_SELECTOR,
        reviewHtml: TEMPLATE_REVIEW_SELECTOR
    };

    product = new ProductBuilder()
        .setDisplayInfoId(displayInfoId)
        .setReview(reviewSelectors)
        .build();
}

function showReviews() {
    product.showReviewsAll();
}