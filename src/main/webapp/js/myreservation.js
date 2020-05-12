import { MyReservationBuilder } from "./reservation/service/reservation/myreservation.js"; 

const TEMPLATE_CONFIRM_ITEM_SELECTOR = "#confirmItem";
const TEMPLATE_CANCEL_ITEM_SELECTOR = "#cancelItem";
const TEMPLATE_USED_ITEM_SELECTOR = "#usedItem";

const RESERVATION_EMAIL_SELECTOR = "#reservation_email";
const RESERVATION_CONTAINER_SELECTOR = ".wrap_mylist";
const EMPTY_RESERVATION_SELECTOR = ".err";
const CONFIRM_ITEM_CONTAINER_SELECTOR = ".confirmed";
const CANCEL_ITEM_CONTAINER_SELECTOR = ".cancel";
const USED_ITEM_CONTAINER_SELECTOR = ".used";
const SUMMARY_ITEM_SELECTOR = ".summary_board .figure";
const CANCEL_POPUP_CONTAINER_SELECTOR = ".popup_booking_wrapper";
const CANCEL_POPUP_INFO_SELECTOR = ".popup_booking .pop_tit";
const CANCEL_POPUP_BTN_CONTAINER_SELECTOR = ".pop_bottom_btnarea";
const CANCEL_POPUP_CLOSE_BTN_SELECTOR = ".popup_btn_close";


var myReservation;
document.addEventListener("DOMContentLoaded", function () {
    try {
        init();
        showReservations();
    } catch (error) {
        console.error(error.message);
    }
});

function init() {
    let reservationEmail = document.querySelector(RESERVATION_EMAIL_SELECTOR).value;

    let reservationInfoSelectors = {
        reservationContainer: RESERVATION_CONTAINER_SELECTOR,
        emptyReservation: EMPTY_RESERVATION_SELECTOR,
        confirmItemHtml: TEMPLATE_CONFIRM_ITEM_SELECTOR,
        cancelItemHtml: TEMPLATE_CANCEL_ITEM_SELECTOR,
        confirmItemContainer: CONFIRM_ITEM_CONTAINER_SELECTOR,
        cancelItemContainer: CANCEL_ITEM_CONTAINER_SELECTOR,
        usedItemHtml: TEMPLATE_USED_ITEM_SELECTOR,
        usedItemContainer: USED_ITEM_CONTAINER_SELECTOR,
    };

    let cancelPopupSelectors = {
        cancelPopupContainer: CANCEL_POPUP_CONTAINER_SELECTOR,
        closeBtn: CANCEL_POPUP_CLOSE_BTN_SELECTOR,
        cancelInfo: CANCEL_POPUP_INFO_SELECTOR,
        popupBtnContainer: CANCEL_POPUP_BTN_CONTAINER_SELECTOR,
    };

    myReservation = new MyReservationBuilder()
        .setReservationEmail(reservationEmail)
        .setReservationSummaryBoard(SUMMARY_ITEM_SELECTOR)
        .setReservationInfo(reservationInfoSelectors, cancelPopupSelectors)
        .build();
}

function showReservations() {
    myReservation.showReservations();
}