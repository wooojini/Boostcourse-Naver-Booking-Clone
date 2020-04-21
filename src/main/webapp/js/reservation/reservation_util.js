//Ajax
const Ajax = function (httpMethod, url, callback, objectToBind) {
    this.httpMethod = httpMethod;
    this.url = url;
    this.callback = callback;
    this.objectToBind = objectToBind;
    this.xhr = new XMLHttpRequest();
    this.queryStr = "";
    this.pathVar = null;
    this.requestBody = null;
    this.requestFormData = null;
    this.responseType = null;
};

Ajax.prototype.setRequestParams = function (params) {
    if (typeof params != typeof {}) {
        throw new Error("Request parameters are required to be Object type.");
    }

    let searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
        searchParams.append(key, params[key]);
    });
    this.queryStr = `?${searchParams}`;
};

Ajax.prototype.setPathVariable = function (pathVar) {
    this.pathVar = pathVar;
};

Ajax.prototype.hasQueryStr = function () {
    return this.queryStr.length > 0
};

Ajax.prototype.hasPathVar = function () {
    return this.pathVar != null
};

Ajax.prototype.setRequestBodyData = function (requestBody) {
    if (typeof requestBody != typeof {}) {
        new Error("requestBody is required type of Object");
    }
    this.requestBody = requestBody;
};

Ajax.prototype.setRequestFormData = function (requestFormData) {
    if (requestFormData !== null) {
        new Error("requestFormData is required type of FormData");
    }
    this.requestFormData = requestFormData;
};

Ajax.prototype.setResponseType = function (responseType) {
    this.responseType = responseType;
};

Ajax.prototype.requestApi = function () {
    this.xhr.addEventListener(
        "load",
        this.callback.bind(this.xhr, this.objectToBind)
    );

    let resultUrl = this.url;
    if (this.hasPathVar()) {
        resultUrl += this.pathVar;
    }

    if (this.hasQueryStr()) {
        resultUrl += this.queryStr;
    }

    this.xhr.open(this.httpMethod, resultUrl);
    if (this.responseType != null) {
        this.xhr.responseType = this.responseType;
    }

    if (this.requestBody != null) {
        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.send(JSON.stringify(this.requestBody));
    } else if (this.requestFormData != null) {
        this.xhr.send(this.requestFormData);
    } else {
        this.xhr.send();
    }
};


Ajax.HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

//API URL
Ajax.URL = {};

Ajax.URL.SERVER_URL = {
    DEVELOPE: "http://localhost:8080/reservation"
};

Ajax.URL.API = {
    GET_PROMOTIONS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/promotions",
    GET_CATEGORIES: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/categories",
    GET_PRODUCTS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/products",
    GET_PRODUCTS_DETAIL: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/products/",
    GET_RESERVATIONS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/reservations",
    POST_RESERVATIONS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/reservations",
    PUT_RESERVATIONS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/reservations/",
    POST_COMMENTS: Ajax.URL.SERVER_URL.DEVELOPE +
        "/api/reservations/{id}/comments",

    GET_PROMOTION_IMAGE: Ajax.URL.SERVER_URL.DEVELOPE +
        "/download/promotions/",
    GET_PRODUCT_IMAGE: Ajax.URL.SERVER_URL.DEVELOPE +
        "/download/products/",
    GET_DISPLAY_IMAGE: Ajax.URL.SERVER_URL.DEVELOPE +
        "/download/displays/",
    GET_COMMENTS_IMG: Ajax.URL.SERVER_URL.DEVELOPE +
        "/download/comments/",
};

//AjaxBulder
const AjaxBuilder = function () {
    this.httpMethod = "";
    this.url = "";
    this.callback = null;
    this.objectToBind = null;
};

AjaxBuilder.prototype.validateCallback = function () {
    if (typeof this.callback != typeof (() => {})) {
        throw new Error("Callback is not a function");
    }
};

AjaxBuilder.prototype.validateProperty = function () {
    if (this.httpMethod === "") {
        throw new Error("httpMethod is required");
    } else if (this.url === "") {
        throw new Error("url is required");
    } else if (this.callback === null) {
        throw new Error("callback function is required");
    }
    this.validateCallback();
};

AjaxBuilder.prototype.setHttpMethod = function (httpMethod) {
    this.httpMethod = httpMethod;
    return this;
};

AjaxBuilder.prototype.setUrl = function (url) {
    this.url = url;
    return this;
};

AjaxBuilder.prototype.setCallback = function (callback) {
    this.callback = callback;
    return this;
};

AjaxBuilder.prototype.setObjectToBind = function (objectToBind) {
    this.objectToBind = objectToBind;
    return this;
};

AjaxBuilder.prototype.build = function () {
    try {
        this.validateProperty();
        return new Ajax(this.httpMethod, this.url, this.callback, this.objectToBind);
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

//FormDataValidater
const FormDataValidater = function () {
    this.validator = {
        emailValidater: {
            emailPattern: /(^[a-zA-Z][a-zA-Z0-9]+)(@)([a-zA-Z]+)\.([a-zA-Z]+)(\.[a-zA-Z]+)?/,
            emailInput: null,
            emailInputWarningMsg: null,
            isStartValidate: false,

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
            startValidate: function () {
                this.initEvent();
                this.isStartValidate = true;
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
            startValidate: function () {
                this.initEvent();
                this.isStartValidate = true;
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
            startValidate: function () {
                this.initEvent();
                this.isStartValidate = true;
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
};
FormDataValidater.prototype.setForm = function (formSelector) {
    this.form = document.querySelector(formSelector);
};
FormDataValidater.prototype.setSubmitBtn = function (submitBtnSelector) {
    this.submitBtn = document.querySelector(submitBtnSelector);
    this.initEvent();
};
FormDataValidater.prototype.setSubmitBtnCallback = function (callback) {
    this.submitBtnClickCallback = callback;
};
FormDataValidater.prototype.initEvent = function () {
    this.submitBtn.addEventListener("click", this.submitBtnClickListener.bind(this));
};
FormDataValidater.prototype.submitBtnClickListener = function (e) {
    e.preventDefault();

    if (this.submitBtnClickCallback != null) {
        this.submitBtnClickCallback();
    }
};
FormDataValidater.prototype.setEmailInput = function (emailInputSelector, warningMsg) {
    this.validator.emailValidater.init(emailInputSelector, warningMsg);
};
FormDataValidater.prototype.startEmailValidate = function () {
    this.validator.emailValidater.startValidate();
};
FormDataValidater.prototype.setTelInput = function (telInputSelector, warningMsg) {
    this.validator.telValidater.init(telInputSelector, warningMsg);
};
FormDataValidater.prototype.startTelValidate = function () {
    this.validator.telValidater.startValidate();
};
FormDataValidater.prototype.setNameInput = function (nameInputSelector, warningMsg) {
    this.validator.nameValidater.init(nameInputSelector, warningMsg);
};
FormDataValidater.prototype.startNameValidate = function () {
    this.validator.nameValidater.startValidate();
};

//FormDataValidaterBuilder
const FormDataValidaterBuilder = function () {
    this.formDataValidater = new FormDataValidater();
}
FormDataValidaterBuilder.prototype.validateSelector = function (selector) {
    if (selector.match(this.selectorPattern) === null) {
        new Error(`Selector is not matched : ${selector}`);
    }
};
FormDataValidaterBuilder.prototype.setForm = function (formSelector) {
    this.validateSelector(formSelector);
    this.formDataValidater.setForm(formSelector);
    return this;
};
FormDataValidaterBuilder.prototype.setSubmitBtn = function (submitBtnSelector) {
    this.validateSelector(submitBtnSelector);
    this.formDataValidater.setSubmitBtn(submitBtnSelector);
    return this;
};
FormDataValidaterBuilder.prototype.setSubmitBtnCallback = function (callback) {
    this.formDataValidater.setSubmitBtnCallback(callback);
    return this;
};
FormDataValidaterBuilder.prototype.setEmailInput = function (emailInputSelector, emailInputContainer) {
    this.validateSelector(emailInputSelector);
    this.formDataValidater.setEmailInput(emailInputSelector, emailInputContainer);
    return this;
};
FormDataValidaterBuilder.prototype.setTelInput = function (telInputSelector, telInputContainer) {
    this.validateSelector(telInputSelector);
    this.formDataValidater.setTelInput(telInputSelector, telInputContainer);
    return this;
};
FormDataValidaterBuilder.prototype.setNameInput = function (nameInputSelector, nameInputContainer) {
    this.validateSelector(nameInputSelector);
    this.formDataValidater.setNameInput(nameInputSelector, nameInputContainer);
    return this;
};
FormDataValidaterBuilder.prototype.build = function () {
    return this.formDataValidater;
};

//DomUtil
const DomUtil = function () {};

DomUtil.findChildNodeByClassName = function (parentNode, classSelector) {
    return Object.values(parentNode.children).filter(child => {
        let classList = child.classList;
        let titleName = Object.values(classList).filter(className => {
            if (className === classSelector) {
                return className;
            }
        });
        if (titleName.length > 0) {
            return child;
        }
    })[0];
};

DomUtil.hasClass = function (node, className) {
    let hasClassName = false;
    Object.values(node.classList).forEach(classValue => {
        if (classValue === className) {
            hasClassName = true;
        }
    });

    return hasClassName;
}

//StrUtil
const StrUtil = function () {};

StrUtil.reverseStr = function (str) {
    let reverseStr = str.split("").reverse().join("");
    return reverseStr;
};

export {
    Ajax,
    AjaxBuilder,
    FormDataValidaterBuilder,
    DomUtil,
    StrUtil,
};