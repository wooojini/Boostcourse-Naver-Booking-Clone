//Slider
class Slider {
    constructor(slideItemContainer, isAutoSlide) {
        this.slideItemContainer = slideItemContainer;
        this.slideItems = this.slideItemContainer.children;
        this.timeOfAutoSliding = 2;
        this.timeOfSlideAnimation = 0.3;
        this.slideIndex = 1;
        this.totalTime = 0;
        this.nowTime = null;
        this.lastTime = this.getTimeNow();

        if (isAutoSlide === false) {
            this.addCloneImg();
            this.initPosition(1, -100);
        }
    }

    getTimeNow() {
        return new Date().getTime();
    }

    autoSlideImg() {
        if (this.isSlidingTime()) {
            this.slideImg();
            this.totalTime -= this.timeOfAutoSliding;
        }

        requestAnimationFrame(this.autoSlideImg.bind(this));
    };

    isSlidingTime() {
        let slideTiming = false;

        this.nowTime = this.getTimeNow();
        this.totalTime += Math.min(1, (this.nowTime - this.lastTime) / 1000.0);
        this.lastTime = this.nowTime;

        if (this.totalTime > this.timeOfAutoSliding) {
            slideTiming = true;
        }

        return slideTiming;
    };

    slideImg() {
        Object.keys(this.slideItems).forEach((index) =>
            (this.slideItems[index].style.transform = `translateX(${-100 * this.slideIndex}%)`)
        );

        this.slideIndex = (this.slideIndex + 1) % this.slideItems.length;
    };

    addCloneImg() {
        let firstImg = this.slideItemContainer.firstElementChild;
        let lastImg = this.slideItemContainer.lastElementChild;

        this.slideItemContainer.appendChild(this.getCloneImg(firstImg));
        this.slideItemContainer.insertBefore(this.getCloneImg(lastImg), this.slideItemContainer.firstElementChild);
        this.slideItems = this.slideItemContainer.children;
    };

    getCloneImg(imgNode) {
        let clone = imgNode.cloneNode(true);
        return clone;
    };

    slideImgLeft() {
        this.slideImgByWidth(-100);
        this.slideIndex++;

        if (this.slideIndex === (this.slideItems.length - 1)) {
            setTimeout(function () {
                this.initPosition(1, -100);
            }.bind(this), this.timeOfSlideAnimation * 1000);
        }
    };

    slideImgRight() {
        this.slideImgByWidth(100);
        this.slideIndex--;

        if (this.slideIndex === 0) {
            setTimeout(function () {
                this.initPosition(2, -200);
            }.bind(this), this.timeOfSlideAnimation * 1000);
        }
    };

    slideImgByWidth(width) {
        Object.keys(this.slideItems).forEach((index) => {
            let transform = this.slideItems[index].style.transform;
            let offset = Number(transform.match(/[0-9-]{4}/));

            offset += width;
            this.slideItems[index].style.transition = `transform ${this.timeOfSlideAnimation}s`;
            this.slideItems[index].style.transform = `translateX(${offset}%)`;
        });
    };

    initPosition(slideIndex, width) {
        Object.keys(this.slideItems).forEach(function (index) {
            this.slideItems[index].style.transition = 'none';
            this.slideItems[index].style.transform = `translateX(${width}%)`;
        }.bind(this));

        this.slideIndex = slideIndex;
    };
}

//SliderBuilder
class SliderBuilder {
    constructor() {
        this.slideItemContainer = null;
        this.isAutoSlide = false;
    }

    validateProperty() {
        if (this.slideItemContainer === null) {
            new Error("SlideItemContainer is required.");
        }
    };

    setSlideItemContainer(slideItemContainer) {
        this.slideItemContainer = slideItemContainer;
        return this;
    };

    setIsAutoSlide(isAutoSlide) {
        this.isAutoSlide = isAutoSlide;
        return this;
    };

    build() {
        this.validateProperty();
        return new Slider(this.slideItemContainer, this.isAutoSlide)
    };
}

//Accordion
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

//TabMenu
class TabMenu {
    constructor(tabMenuContainerSelector) {
        this.tabMenuContainer = document.querySelector(tabMenuContainerSelector);
        this.tabMenuItems = this.tabMenuContainer.children;
        this.callback = null;
        this.objectToBind = null;
    }

    initEvent() {
        this.tabMenuContainer.addEventListener('click', this.tabMenuClickListener.bind(this));
    };

    tabMenuClickListener(e) {
        let isEventTargetTag = false;
        let aTag;

        switch (e.target.tagName.toLowerCase()) {
            case 'span':
                isEventTargetTag = true;
                aTag = e.target.parentElement;
                break;
            case 'a':
                isEventTargetTag = true;
                aTag = e.target;
                break;
        }

        if (isEventTargetTag) {
            this.changeActiveInfoTab(aTag);

            if (this.callback != null) {
                this.callback(this.objectToBind, aTag);
            }
        }
    };

    changeActiveInfoTab(tabMenu) {
        document.querySelector(".anchor.active").classList.remove("active");
        tabMenu.classList.add('active');
    };

    setCallback(callback) {
        this.callback = callback;
    };

    setObjectToBind(objectToBind) {
        this.objectToBind = objectToBind;
    };

    getTabMenuItems() {
        return this.tabMenuItems;
    };

    getTabMenuContainer() {
        return this.tabMenuContainer;
    };
}

//TabMenuBuilder
class TabMenuBuilder {
    constructor() {
        this.tabMenuContainerSelector = null;
    }

    validateSelector(selector) {
        if (selector.match(this.selectorPattern) === null) {
            new Error(`Selector is not matched : ${selector}`);
        }
    };

    validateProperty() {
        if (this.tabMenuContainerSelector === "") {
            throw new Error('tabMenuContainerSelector is required');
        }
        this.validateSelector(this.tabMenuContainerSelector);
    };

    setTabMenuContainer(tabMenuContainerSelector) {
        this.tabMenuContainerSelector = tabMenuContainerSelector;
        return this;
    };

    build() {
        this.validateProperty();
        return new TabMenu(this.tabMenuContainerSelector)
    };
};

//Rating
class Rating {
    constructor(ratingContainerSelector, ratingScoreSelector) {
        this.ratingContainer = document.querySelector(ratingContainerSelector);
        this.ratingScore = document.querySelector(ratingScoreSelector);
    }

    initEvent() {
        this.ratingContainer.addEventListener('click', this.ratingClickListener.bind(this));
    }

    ratingClickListener(e) {
        e.preventDefault();
        let isEventTargetTag = false;
        let inputTag;

        switch (e.target.tagName.toLowerCase()) {
            case "input":
                isEventTargetTag = true;
                inputTag = e.target;
                e.stopImmediatePropagation();
                break;
        }

        if (isEventTargetTag) {
            this.rate(inputTag);
        }
    }

    rate(inputTag) {
        let parent = inputTag.parentElement;
        let children = parent.children;
        let childrenValues = Object.values(children);
        let eventTargetIdx = childrenValues.indexOf(inputTag);

        childrenValues.forEach((child, idx) => {
            switch (child.tagName.toLowerCase()) {
                case "input":
                    if (idx <= eventTargetIdx) {
                        this.checkRating(child);
                    } else {
                        this.uncheckRating(child);
                    }

                    break;
            }
        });

        this.setRatingScore(inputTag.value);
    }

    checkRating(inputTag) {
        inputTag.classList.add('checked');
    }

    uncheckRating(inputTag) {
        inputTag.classList.remove('checked');
    }

    setRatingScore(score) {
        this.ratingScore.textContent = score;

        if (score > 0) {
            this.ratingScore.classList.remove('gray_star');
        } else {
            this.ratingScore.classList.add('gray_star');
        }
    }

    getRatingScoreValue() {
        return this.ratingScore.textContent;
    }
}

//RatingBuilder
class RatingBuilder {
    constructor() {
        this.selectorPattern = /[.#][a-zA-Z]+/;
        this.ratingContainerSelector = "";
        this.ratingScoreSelector = "";
    }

    validateSelector(selector) {
        if (selector.match(this.selectorPattern) === null) {
            new Error(`Selector is not matched : ${selector}`);
        }
    };

    validateProperty() {
        if (this.ratingContainerSelector === "") {
            throw new Error('ratingContainerSelector is required');
        } else if (this.ratingScoreSelector === "") {
            throw new Error('ratingScoreSelector is required');
        }
    };

    setRatingContainer(ratingContainerSelector) {
        this.validateSelector(ratingContainerSelector);
        this.ratingContainerSelector = ratingContainerSelector;

        return this;
    }

    setRatingScore(ratingScoreSelector) {
        this.validateSelector(ratingScoreSelector);
        this.ratingScoreSelector = ratingScoreSelector;

        return this;
    }

    build() {
        this.validateProperty();

        return new Rating(this.ratingContainerSelector, this.ratingScoreSelector);
    }
};

export {
    Slider,
    SliderBuilder,
    AccodionBuilder,
    TabMenuBuilder,
    RatingBuilder,
};