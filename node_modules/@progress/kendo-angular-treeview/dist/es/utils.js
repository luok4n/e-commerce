import { isDocumentAvailable } from '@progress/kendo-angular-common';
var focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
/**
 * @hidden
 */
export var match = function (element, selector) {
    var matcher = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    if (!matcher) {
        return false;
    }
    return matcher.call(element, selector);
};
var closestWithMatch = function (element, selector) {
    if (!document.documentElement.contains(element)) {
        return null;
    }
    var parent = element;
    while (parent !== null && parent.nodeType === 1) {
        if (match(parent, selector)) {
            return parent;
        }
        parent = parent.parentElement || parent.parentNode;
    }
    return null;
};
var ɵ0 = closestWithMatch;
/**
 * @hidden
 */
export var noop = function () { };
/**
 * @hidden
 */
export var isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
export var isBlank = function (value) { return value === null || value === undefined; };
/**
 * @hidden
 */
export var isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
export var isNullOrEmptyString = function (value) { return isBlank(value) || value.trim().length === 0; };
/**
 * @hidden
 */
export var closestNode = function (element) {
    var selector = 'li.k-treeview-item';
    if (!isDocumentAvailable()) {
        return null;
    }
    if (element.closest) {
        return element.closest(selector);
    }
    else {
        return closestWithMatch(element, selector);
    }
};
/**
 * @hidden
 */
export var isFocusable = function (element) {
    if (element.tagName) {
        var tagName = element.tagName.toLowerCase();
        var tabIndex = element.getAttribute('tabIndex');
        var skipTab = tabIndex === '-1';
        var focusable = tabIndex !== null && !skipTab;
        if (focusableRegex.test(tagName)) {
            focusable = !element.disabled && !skipTab;
        }
        return focusable;
    }
    return false;
};
/**
 * @hidden
 */
export var isContent = function (element) {
    var scopeSelector = '.k-in,.k-treeview-item,.k-treeview';
    if (!isDocumentAvailable()) {
        return null;
    }
    var node = element;
    while (node && !match(node, scopeSelector)) {
        node = node.parentNode;
    }
    if (node) {
        return match(node, '.k-in');
    }
};
/**
 * @hidden
 */
export var closest = function (node, predicate) {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
/**
 * @hidden
 */
export var hasParent = function (element, container) {
    return Boolean(closest(element, function (node) { return node === container; }));
};
/**
 * @hidden
 */
export var focusableNode = function (element) { return element.nativeElement.querySelector('li[tabindex="0"]'); };
/**
 * @hidden
 */
export var hasActiveNode = function (target, node) {
    var closestItem = node || closestNode(target);
    return closestItem && (closestItem === target || target.tabIndex < 0);
};
/**
 * @hidden
 */
export var nodeId = function (node) { return node ? node.getAttribute('data-treeindex') : ''; };
/**
 * @hidden
 */
export var nodeIndex = function (item) { return (item || {}).index; };
export { ɵ0 };
