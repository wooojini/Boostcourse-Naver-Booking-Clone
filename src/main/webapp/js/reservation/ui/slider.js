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

export {
    Slider,
    SliderBuilder
};
