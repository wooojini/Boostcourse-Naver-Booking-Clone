'use strict';

import { ReserveBuilder } from "./reservation/service/reservation/reserve.js"; 

const DISPLAY_INFO_ID_SELECTOR = "#displayInfoId";

const TEMPLATE_THUMNAIL_IMG_SELECTOR = "#thumnailItem";
const TEMPLATE_PRODUCT_DETAIL_SELECTOR = "#productDetail";
const TEMPLATE_TICKET_SELECTOR = "#ticketQty";

const THUMNAIL_IMG_CONTAINER_SELECTOR = ".visual_img";
const PRODUCT_DETAIL_CONTAINER_SELECTOR = ".store_details";
const TICKET_CONTAINER_SELECTOR = ".ticket_body";
const TOTAL_COUNT_SELECTOR = "#totalCount";
const AGREEMENT_CONTAINER_SELECTOR = ".section_booking_agreement";
const AGREE_ALL_BTN_SELECTOR = ".chk_txt_label";
const RESERVE_BTN_CONTAINER_SELECTOR = ".bk_btn_wrap";
const RESERVE_BTN_SELECTOR = ".bk_btn_wrap .bk_btn";
const RESERVE_FORM_SELECTOR = ".form_horizontal";
const NAME_INPUT_SELECTOR = "#name";
const EMAIL_INPUT_SELECTOR = "#email";
const TEL_INPUT_SELECTOR = "#tel";
const RESERVE_DATE_SELECTOR = ".inline_txt";
const HEADER_TITLE_SELECTOR = ".title";

var reserve;
document.addEventListener("DOMContentLoaded", function () {
    try {
        init();
        showProductInfo();
    } catch (error) {
        console.error(error.message);
    }
});

function init() {
    let displayInfoId = document.querySelector(DISPLAY_INFO_ID_SELECTOR).value;
    let productInfoSelectors = {
        thumnailContainer: THUMNAIL_IMG_CONTAINER_SELECTOR,
        productDetailContainer: PRODUCT_DETAIL_CONTAINER_SELECTOR,
        thumnailImgHtml: TEMPLATE_THUMNAIL_IMG_SELECTOR,
        productDetailHtml: TEMPLATE_PRODUCT_DETAIL_SELECTOR,
    };
    let productTicketSelectors = {
        ticketContainer: TICKET_CONTAINER_SELECTOR,
        ticketQtyHtml: TEMPLATE_TICKET_SELECTOR,
        totalCount: TOTAL_COUNT_SELECTOR,
    };
    let reservationFormSelectors = {
        agreementContainer: AGREEMENT_CONTAINER_SELECTOR,
        agreeAllBtn: AGREE_ALL_BTN_SELECTOR,
        reserveBtnContainer: RESERVE_BTN_CONTAINER_SELECTOR,
        reserveBtn: RESERVE_BTN_SELECTOR,
        reserveForm: RESERVE_FORM_SELECTOR,
        nameInput: NAME_INPUT_SELECTOR,
        emailInput: EMAIL_INPUT_SELECTOR,
        telInput: TEL_INPUT_SELECTOR,
        reserveDate: RESERVE_DATE_SELECTOR,
    }
    let reserveBtnHandlerSelectors = {
    	reserveBtnContainer : RESERVE_BTN_CONTAINER_SELECTOR,
        agreeAllBtn : AGREE_ALL_BTN_SELECTOR,
        nameInput: NAME_INPUT_SELECTOR,
        emailInput: EMAIL_INPUT_SELECTOR,
        telInput: TEL_INPUT_SELECTOR,	
    };

    reserve = new ReserveBuilder()
        .setDisplayInfoId(displayInfoId)
        .setHeaderTitle(HEADER_TITLE_SELECTOR)
        .setProductInfo(productInfoSelectors)
        .setReserveBtnHandler(reserveBtnHandlerSelectors)
        .setProductTicket(productTicketSelectors)
        .setReservationForm(reservationFormSelectors)
        .build();
};

function showProductInfo() {
    reserve.showProductInfo();
};