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

DomUtil.hasClass = function (node, className) {
    let hasClassName = false;
    Object.values(node.classList).forEach(classValue => {
        if (classValue === className) {
            hasClassName = true;
        }
    });

    return hasClassName;
}

export {
	DomUtil   
}