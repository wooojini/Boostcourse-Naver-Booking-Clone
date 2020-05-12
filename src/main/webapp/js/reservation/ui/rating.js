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
	RatingBuilder
};
