class Accordion {
    constructor(containerSelector, openBtnSelector, closeBtnSelector, contentSelector) {
        this.$container = $(containerSelector);
        this.$openBtn = $(openBtnSelector);
        this.$closeBtn = $(closeBtnSelector);
        this.$content = $(contentSelector);
        this.openBtnSelector = openBtnSelector;

        this.initEvent();
    }

    initEvent() {
        this.$container.on('click', 'a', this.btnClickListener.bind(this));
    };

    btnClickListener(e) {
        let $aTag;

        switch (e.target.tagName.toLowerCase()) {
            case 'i':
            case 'span':
                $aTag = $(e.target).parents("a");
                break;
            case 'a':
                $aTag = $(e.target);
                break;
        }

        if (this.isOpenBtn($aTag)) {
            this.showBtn(this.$closeBtn);
            this.hideBtn(this.$openBtn);
            this.openContent();
        } else {
            this.showBtn(this.$openBtn);
            this.hideBtn(this.$closeBtn);
            this.closeContent();
        }
    };

    isOpenBtn($btn) {
        return $btn.hasClass('_open')
    };

    showBtn($btn) {
        $btn.removeClass('hide');
    };

    hideBtn($btn) {
        $btn.addClass('hide');
    };

    openContent() {
        this.$content.removeClass('close3');
    };

    closeContent() {
        this.$content.addClass('close3');
    };
}

//AccodionBuilder
class AccodionBuilder {
    constructor() {
        this.selectorPattern = /[.#][a-zA-Z]+/;
        this.containerSelector = "";
        this.openBtnSelector = "";
        this.closeBtnSelector = "";
        this.contentSelector = "";
    }

    validateSelector(selector) {
        if (selector.match(this.selectorPattern) === null) {
            new Error(`Selector is not matched : ${selector}`);
        }
    };

    validateProperty() {
        if (this.containerSelector === "") {
            throw new Error('containerSelector is required');
        } else if (this.openBtnSelector === "") {
            throw new Error('openBtnSelector is required');
        } else if (this.closeBtnSelector === "") {
            throw new Error('closeBtnSelector is required');
        } else if (this.contentSelector === "") {
            throw new Error('contentSelector is required');
        }

        this.validateSelector(this.containerSelector);
        this.validateSelector(this.openBtnSelector);
        this.validateSelector(this.closeBtnSelector);
        this.validateSelector(this.contentSelector);
    };

    setContainer(containerSelector) {
        this.containerSelector = containerSelector;
        return this;
    };

    setOpenBtn(openBtnSelector) {
        this.openBtnSelector = openBtnSelector;
        return this;
    };

    setCloseBtn(closeBtnSelector) {
        this.closeBtnSelector = closeBtnSelector;
        return this;
    };

    setContent(contentSelector) {
        this.contentSelector = contentSelector;
        return this;
    };

    build() {
        this.validateProperty();
        return new Accordion(this.containerSelector, this.openBtnSelector, this.closeBtnSelector, this.contentSelector);
    };
}

export {
	AccodionBuilder
};