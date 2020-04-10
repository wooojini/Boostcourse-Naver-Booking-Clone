//Slider
const Slider = function (slideItemContainer, isAutoSlide) {
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
};

Slider.prototype.getTimeNow = function () {
    return new Date().getTime();
};

Slider.prototype.autoSlideImg = function () {
    if (this.isSlidingTime()) {
        this.slideImg();
        this.totalTime -= this.timeOfAutoSliding;
    }

    requestAnimationFrame(this.autoSlideImg.bind(this));
};

Slider.prototype.isSlidingTime = function () {
    let slideTiming = false;

    this.nowTime = this.getTimeNow();
    this.totalTime += Math.min(1, (this.nowTime - this.lastTime) / 1000.0);
    this.lastTime = this.nowTime;

    if (this.totalTime > this.timeOfAutoSliding) {
        slideTiming = true;
    }

    return slideTiming;
};

Slider.prototype.slideImg = function () {
    Object.keys(this.slideItems).forEach((index) =>
        (this.slideItems[index].style.transform = `translateX(${-100 * this.slideIndex}%)`)
    );

    this.slideIndex = (this.slideIndex + 1) % this.slideItems.length;
};

Slider.prototype.addCloneImg = function () {
    let firstImg = this.slideItemContainer.firstElementChild;
    let lastImg = this.slideItemContainer.lastElementChild;

    this.slideItemContainer.appendChild(this.getCloneImg(firstImg));
    this.slideItemContainer.insertBefore(this.getCloneImg(lastImg), this.slideItemContainer.firstElementChild);
    this.slideItems = this.slideItemContainer.children;
};

Slider.prototype.getCloneImg = function (imgNode) {
    let clone = imgNode.cloneNode(true);
    return clone;
};

Slider.prototype.slideImgLeft = function () {
    this.slideImgByWidth(-100);
    this.slideIndex++;

    if (this.slideIndex === (this.slideItems.length - 1)) {
        setTimeout(function () {
            this.initPosition(1, -100);
        }.bind(this), this.timeOfSlideAnimation * 1000);
    }
};

Slider.prototype.slideImgRight = function () {
    this.slideImgByWidth(100);
    this.slideIndex--;

    if (this.slideIndex === 0) {
        setTimeout(function () {
            this.initPosition(2, -200);
        }.bind(this), this.timeOfSlideAnimation * 1000);
    }
};

Slider.prototype.slideImgByWidth = function (width) {
    Object.keys(this.slideItems).forEach((index) => {
        let transform = this.slideItems[index].style.transform;
        let offset = Number(transform.match(/[0-9-]{4}/));

        offset += width;
        this.slideItems[index].style.transition = `transform ${this.timeOfSlideAnimation}s`;
        this.slideItems[index].style.transform = `translateX(${offset}%)`;
    });
};

Slider.prototype.initPosition = function (slideIndex, width) {
    Object.keys(this.slideItems).forEach(function (index) {
        this.slideItems[index].style.transition = 'none';
        this.slideItems[index].style.transform = `translateX(${width}%)`;
    }.bind(this));

    this.slideIndex = slideIndex;
};

//SliderBuilder
const SliderBuilder = function () {
    this.slideItemContainer = null;
    this.isAutoSlide = false;
};

SliderBuilder.prototype.validateProperty = function () {
    if (this.slideItemContainer === null) {
        new Error("SlideItemContainer is required.");
    }
};

SliderBuilder.prototype.setSlideItemContainer = function (slideItemContainer) {
    this.slideItemContainer = slideItemContainer;
    return this;
};

SliderBuilder.prototype.setIsAutoSlide = function (isAutoSlide) {
    this.isAutoSlide = isAutoSlide;
    return this;
};

SliderBuilder.prototype.build = function () {
    this.validateProperty();
    return new Slider(this.slideItemContainer, this.isAutoSlide)
};


//Accodion
const Accordion = function (containerSelector, openBtnSelector, closeBtnSelector, contentSelector) {
    this.$container = $(containerSelector);
    this.$openBtn = $(openBtnSelector);
    this.$closeBtn = $(closeBtnSelector);
    this.$content = $(contentSelector);
    this.openBtnSelector = openBtnSelector;

    this.initEvent();
};

Accordion.prototype.initEvent = function () {
    this.$container.on('click', 'a', this.btnClickListener.bind(this));
};

Accordion.prototype.btnClickListener = function (e) {
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

Accordion.prototype.isOpenBtn = function ($btn) {
    return $btn.hasClass('_open')
};

Accordion.prototype.showBtn = function ($btn) {
    $btn.removeClass('hide');
};

Accordion.prototype.hideBtn = function ($btn) {
    $btn.addClass('hide');
};

Accordion.prototype.openContent = function () {
    this.$content.removeClass('close3');
};

Accordion.prototype.closeContent = function () {
    this.$content.addClass('close3');
};


//AccodionBuilder
const AccodionBuilder = function () {
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.containerSelector = "";
    this.openBtnSelector = "";
    this.closeBtnSelector = "";
    this.contentSelector = "";
};

AccodionBuilder.prototype.validateSelector = function (selector) {
    if (selector.match(this.selectorPattern) === null) {
        new Error(`Selector is not matched : ${selector}`);
    }
};

AccodionBuilder.prototype.validateProperty = function () {
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

AccodionBuilder.prototype.setContainer = function (containerSelector) {
    this.containerSelector = containerSelector;
    return this;
};

AccodionBuilder.prototype.setOpenBtn = function (openBtnSelector) {
    this.openBtnSelector = openBtnSelector;
    return this;
};

AccodionBuilder.prototype.setCloseBtn = function (closeBtnSelector) {
    this.closeBtnSelector = closeBtnSelector;
    return this;
};

AccodionBuilder.prototype.setContent = function (contentSelector) {
    this.contentSelector = contentSelector;
    return this;
};

AccodionBuilder.prototype.build = function () {
    this.validateProperty();
    return new Accordion(this.containerSelector, this.openBtnSelector, this.closeBtnSelector, this.contentSelector);
};


//TabMenu
const TabMenu = function (tabMenuContainerSelector) {
    this.tabMenuContainer = document.querySelector(tabMenuContainerSelector);
    this.tabMenuItems = this.tabMenuContainer.children;
    this.callback = null;
    this.objectToBind = null;
};

TabMenu.prototype.initEvent = function () {
    this.tabMenuContainer.addEventListener('click', this.tabMenuClickListener.bind(this));
};

TabMenu.prototype.tabMenuClickListener = function (e) {
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

TabMenu.prototype.changeActiveInfoTab = function (tabMenu) {
    document.querySelector(".anchor.active").classList.remove("active");
    tabMenu.classList.add('active');
};

TabMenu.prototype.setCallback = function (callback) {
    this.callback = callback;
};

TabMenu.prototype.setObjectToBind = function (objectToBind) {
    this.objectToBind = objectToBind;
};

TabMenu.prototype.getTabMenuItems = function () {
    return this.tabMenuItems;
};

TabMenu.prototype.getTabMenuContainer = function () {
    return this.tabMenuContainer;
};


//TabMenuBuilder
const TabMenuBuilder = function () {
    this.tabMenuContainerSelector = null;
};

TabMenuBuilder.prototype.validateSelector = function (selector) {
    if (selector.match(this.selectorPattern) === null) {
        new Error(`Selector is not matched : ${selector}`);
    }
};

TabMenuBuilder.prototype.validateProperty = function () {
    if (this.tabMenuContainerSelector === "") {
        throw new Error('tabMenuContainerSelector is required');
    }
    this.validateSelector(this.tabMenuContainerSelector);
};

TabMenuBuilder.prototype.setTabMenuContainer = function (tabMenuContainerSelector) {
    this.tabMenuContainerSelector = tabMenuContainerSelector;
    return this;
};

TabMenuBuilder.prototype.build = function () {
    this.validateProperty();
    return new TabMenu(this.tabMenuContainerSelector)
};


//Rating
const Rating = function (ratingContainerSelector, ratingScoreSelector) {
    this.ratingContainer = document.querySelector(ratingContainerSelector);
    this.ratingScore = document.querySelector(ratingScoreSelector);
};

Rating.prototype.initEvent = function () {
    this.ratingContainer.addEventListener('click', this.ratingClickListener.bind(this));
}

Rating.prototype.ratingClickListener = function (e) {
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

Rating.prototype.rate = function (inputTag) {
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

Rating.prototype.checkRating = function (inputTag) {
    inputTag.classList.add('checked');
}

Rating.prototype.uncheckRating = function (inputTag) {
    inputTag.classList.remove('checked');
}

Rating.prototype.setRatingScore = function (score) {
    this.ratingScore.textContent = score;

    if (score > 0) {
        this.ratingScore.classList.remove('gray_star');
    } else {
        this.ratingScore.classList.add('gray_star');
    }
}

Rating.prototype.getRatingScoreValue = function () {
    return this.ratingScore.textContent;
}


//RatingBuilder
const RatingBuilder = function () {
    this.selectorPattern = /[.#][a-zA-Z]+/;
    this.ratingContainerSelector = "";
    this.ratingScoreSelector = "";
};

RatingBuilder.prototype.validateSelector = function (selector) {
    if (selector.match(this.selectorPattern) === null) {
        new Error(`Selector is not matched : ${selector}`);
    }
};

RatingBuilder.prototype.validateProperty = function () {
    if (this.ratingContainerSelector === "") {
        throw new Error('ratingContainerSelector is required');
    } else if (this.ratingScoreSelector === "") {
        throw new Error('ratingScoreSelector is required');
    }
};

RatingBuilder.prototype.setRatingContainer = function (ratingContainerSelector) {
    this.validateSelector(ratingContainerSelector);
    this.ratingContainerSelector = ratingContainerSelector;

    return this;
}

RatingBuilder.prototype.setRatingScore = function (ratingScoreSelector) {
    this.validateSelector(ratingScoreSelector);
    this.ratingScoreSelector = ratingScoreSelector;

    return this;
}

RatingBuilder.prototype.build = function () {
    this.validateProperty();

    return new Rating(this.ratingContainerSelector, this.ratingScoreSelector);
}

export {
    Slider,
    SliderBuilder,
    AccodionBuilder,
    TabMenuBuilder,
    RatingBuilder,
};