import { FormDataValidaterBuilder } from "./reservation/util/validater.js"; 

const FORM_SELECTOR = "#form1";
const INPUT_EMAIL_SELECTOR = "#resrv_id";
const SUBMIT_BTN_SELECTOR = "#form1 button";
const WARNING_MSG_SELECTOR = ".tel_wrap .warning_msg";

var formValidater;
document.addEventListener("DOMContentLoaded", function () {
    try {
        init();
        startValidate();
    } catch (error) {
        console.error(error.message);
    }
});

function init() {
    let warningMsg = document.querySelector(WARNING_MSG_SELECTOR);
    let form = document.querySelector(FORM_SELECTOR);

    formValidater = new FormDataValidaterBuilder()
        .setForm(FORM_SELECTOR)
        .setSubmitBtn(SUBMIT_BTN_SELECTOR)
        .setSubmitBtnCallback(confirmBtnClickListener.bind(null, form, warningMsg))
        .setEmailInput(INPUT_EMAIL_SELECTOR, warningMsg)
        .build();
}

function startValidate() {
    formValidater.startEmailValidate();
}

function confirmBtnClickListener(form, warningMsg) {
    if (warningMsg.dataset.valid === "true") {
        form.submit();
    }
}