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

export {
    Ajax,
    AjaxBuilder   
}