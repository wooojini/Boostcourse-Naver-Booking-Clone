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

export {
	TabMenuBuilder
};