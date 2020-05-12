class FormDataValidater {
    constructor() {
        this.validator = {
            emailValidater: {
                emailPattern: /(^[a-zA-Z][a-zA-Z0-9]+)(@)([a-zA-Z]+)\.([a-zA-Z]+)(\.[a-zA-Z]+)?/,
                emailInput: null,
                emailInputWarningMsg: null,
                isStartValidate: false,
                callback: null,

                init: function (emailInputSelector, emailInputWarningMsg) {
                    this.emailInput = document.querySelector(emailInputSelector);
                    this.emailInputWarningMsg = emailInputWarningMsg;
                },

                initEvent: function () {
                    this.emailInput.addEventListener("change", this.emailDataChangeListener.bind(this));
                    this.emailInputWarningMsg.addEventListener("click", this.warningMsgClickListener.bind(this));
                },

                warningMsgClickListener: function () {
                    this.hideWarningMsg();
                },

                emailDataChangeListener: function () {
                    this.validate();
                    if (this.callback !== null) {
                        this.callback();
                    }
                },

                validate: function () {
                    if (this.emailInput != null) {
                        var emailValue = this.emailInput.value;
                        var isValid = this.emailPattern.test(emailValue);

                        if (!isValid) {
                            this.showWarningMsg();
                            this.emailInputWarningMsg.dataset.valid = "false";
                        } else {
                            this.emailInputWarningMsg.dataset.valid = "true";
                        }
                    }
                },
                startValidate: function (callback) {
                    this.initEvent();
                    this.isStartValidate = true;
                    this.callback = callback;
                },

                showWarningMsg: function () {
                    this.emailInputWarningMsg.style.visibility = "visible";
                },

                hideWarningMsg: function () {
                    this.emailInputWarningMsg.style.visibility = 'hidden';
                },
            },
            telValidater: {
                telPattern: /^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}/,
                telInput: null,
                telInputWarningMsg: null,
                isStartValidate: false,
                callback: null,

                init: function (telInputSelector, telInputWarningMsg) {
                    this.telInput = document.querySelector(telInputSelector, telInputWarningMsg);
                    this.telInputWarningMsg = telInputWarningMsg;
                },

                initEvent: function () {
                    this.telInput.addEventListener("change", this.telDataChangeListener.bind(this));
                    this.telInputWarningMsg.addEventListener("click", this.warningMsgClickListener.bind(this));
                },

                warningMsgClickListener: function () {
                    this.hideWarningMsg();
                },

                telDataChangeListener: function () {
                    this.validate();
                    if (this.callback !== null) {
                        this.callback();
                    }
                },

                validate: function () {
                    if (this.telInput != null) {
                        var telValue = this.telInput.value;
                        var isValid = this.telPattern.test(telValue);

                        if (!isValid) {
                            this.showWarningMsg();
                            this.telInputWarningMsg.dataset.valid = "false";
                        } else {
                            this.telInputWarningMsg.dataset.valid = "true";
                        }
                    }
                },
                startValidate: function (callback) {
                    this.initEvent();
                    this.isStartValidate = true;
                    this.callback = callback;
                },

                showWarningMsg: function () {
                    this.telInputWarningMsg.style.visibility = "visible";
                },

                hideWarningMsg: function () {
                    this.telInputWarningMsg.style.visibility = 'hidden';
                },
            },
            nameValidater: {
                namePattern: /^\D(?:\D+)?\D$/,
                nameInput: null,
                nameInputWarningMsg: null,
                isStartValidate: false,
                callback: null,

                init: function (nameInputSelector, nameInputWarningMsg) {
                    this.nameInput = document.querySelector(nameInputSelector);
                    this.nameInputWarningMsg = nameInputWarningMsg;
                },

                initEvent: function () {
                    this.nameInput.addEventListener("change", this.nameDataChangeListener.bind(this));
                    this.nameInputWarningMsg.addEventListener("click", this.warningMsgClickListener.bind(this));
                },

                warningMsgClickListener: function () {
                    this.hideWarningMsg();
                },

                nameDataChangeListener: function () {
                    this.validate();
                    if (this.callback !== null) {
                        this.callback();
                    }
                },
                validate: function () {
                    if (this.nameInput != null) {
                        var nameValue = this.nameInput.value;
                        var isValid = this.namePattern.test(nameValue);

                        if (!isValid) {
                            this.showWarningMsg();
                            this.nameInputWarningMsg.dataset.valid = "false";
                        } else {
                            this.nameInputWarningMsg.dataset.valid = "true";
                        }
                    }
                },
                startValidate: function (callback) {
                    this.initEvent();
                    this.isStartValidate = true;
                    this.callback = callback;
                },

                showWarningMsg: function () {
                    this.nameInputWarningMsg.style.visibility = "visible";
                },

                hideWarningMsg: function () {
                    this.nameInputWarningMsg.style.visibility = 'hidden';
                },
            },
        };
        this.form = null;
        this.submitBtn = null;
        this.submitBtnClickCallback = null;
    }

    setForm(formSelector) {
        this.form = document.querySelector(formSelector);
    };

    setSubmitBtn(submitBtnSelector) {
        this.submitBtn = document.querySelector(submitBtnSelector);
        this.initEvent();
    };

    setSubmitBtnCallback(callback) {
        this.submitBtnClickCallback = callback;
    };

    initEvent() {
        this.submitBtn.addEventListener("click", this.submitBtnClickListener.bind(this));
    };

    submitBtnClickListener(e) {
        e.preventDefault();

        if (this.submitBtnClickCallback != null) {
            this.submitBtnClickCallback();
        }
    };

    setEmailInput(emailInputSelector, warningMsg) {
        this.validator.emailValidater.init(emailInputSelector, warningMsg);
    };

    startEmailValidate(callback = null, objToBind = null) {
        if (objToBind !== null) {
            this.validator.emailValidater.startValidate(callback.bind(objToBind));
        } else {
            this.validator.emailValidater.startValidate(callback);
        }

    };

    setTelInput(telInputSelector, warningMsg) {
        this.validator.telValidater.init(telInputSelector, warningMsg);
    };

    startTelValidate(callback = null, objToBind = null) {
        if (objToBind !== null) {
            this.validator.telValidater.startValidate(callback.bind(objToBind));
        } else {
            this.validator.telValidater.startValidate(callback);
        }

    };

    setNameInput(nameInputSelector, warningMsg) {
        this.validator.nameValidater.init(nameInputSelector, warningMsg);
    };

    startNameValidate(callback = null, objToBind = null) {
        if (objToBind !== null) {
            this.validator.nameValidater.startValidate(callback.bind(objToBind));
        } else {
            this.validator.nameValidater.startValidate(callback);
        }
    };
};

//FormDataValidaterBuilder
class FormDataValidaterBuilder {
    constructor() {
        this.formDataValidater = new FormDataValidater();
    }

    validateSelector(selector) {
        if (selector.match(this.selectorPattern) === null) {
            new Error(`Selector is not matched : ${selector}`);
        }
    };

    setForm(formSelector) {
        this.validateSelector(formSelector);
        this.formDataValidater.setForm(formSelector);
        return this;
    };

    setSubmitBtn(submitBtnSelector) {
        this.validateSelector(submitBtnSelector);
        this.formDataValidater.setSubmitBtn(submitBtnSelector);
        return this;
    };

    setSubmitBtnCallback(callback) {
        this.formDataValidater.setSubmitBtnCallback(callback);
        return this;
    };

    setEmailInput(emailInputSelector, emailInputContainer) {
        this.validateSelector(emailInputSelector);
        this.formDataValidater.setEmailInput(emailInputSelector, emailInputContainer);
        return this;
    };

    setTelInput(telInputSelector, telInputContainer) {
        this.validateSelector(telInputSelector);
        this.formDataValidater.setTelInput(telInputSelector, telInputContainer);
        return this;
    };

    setNameInput(nameInputSelector, nameInputContainer) {
        this.validateSelector(nameInputSelector);
        this.formDataValidater.setNameInput(nameInputSelector, nameInputContainer);
        return this;
    };

    build() {
        return this.formDataValidater;
    };
}

export {
	FormDataValidaterBuilder   
}