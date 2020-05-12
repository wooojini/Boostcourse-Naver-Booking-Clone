//Ajax
class Ajax {
    constructor(httpMethod, url, callback, objectToBind) {
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
    }

    setRequestParams(params) {
        if (typeof params != typeof {}) {
            throw new Error("Request parameters are required to be Object type.");
        }

        let searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            searchParams.append(key, params[key]);
        });
        this.queryStr = `?${searchParams}`;
    };

    setPathVariable(pathVar) {
        this.pathVar = pathVar;
    };

    hasQueryStr() {
        return this.queryStr.length > 0
    };

    hasPathVar() {
        return this.pathVar != null
    };

    setRequestBodyData(requestBody) {
        if (typeof requestBody != typeof {}) {
            new Error("requestBody is required type of Object");
        }
        this.requestBody = requestBody;
    };

    setRequestFormData(requestFormData) {
        if (requestFormData !== null) {
            new Error("requestFormData is required type of FormData");
        }
        this.requestFormData = requestFormData;
    };

    setResponseType(responseType) {
        this.responseType = responseType;
    };

    requestApi() {
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
class AjaxBuilder {
    constructor() {
        this.httpMethod = "";
        this.url = "";
        this.callback = null;
        this.objectToBind = null;
    }

    validateCallback() {
        if (typeof this.callback != typeof (() => {})) {
            throw new Error("Callback is not a function");
        }
    };

    validateProperty() {
        if (this.httpMethod === "") {
            throw new Error("httpMethod is required");
        } else if (this.url === "") {
            throw new Error("url is required");
        } else if (this.callback === null) {
            throw new Error("callback function is required");
        }
        this.validateCallback();
    };

    setHttpMethod(httpMethod) {
        this.httpMethod = httpMethod;
        return this;
    };

    setUrl(url) {
        this.url = url;
        return this;
    };

    setCallback(callback) {
        this.callback = callback;
        return this;
    };

    setObjectToBind(objectToBind) {
        this.objectToBind = objectToBind;
        return this;
    };

    build() {
        try {
            this.validateProperty();
            return new Ajax(this.httpMethod, this.url, this.callback, this.objectToBind);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    };
};

//FormDataValidater
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

//DomUtil
class DomUtil {};

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

//DomUtil
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
class StrUtil {};

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