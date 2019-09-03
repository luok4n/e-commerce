"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kendo_angular_common_1 = require("@progress/kendo-angular-common");
var focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
/**
 * @hidden
 */
exports.match = function (element, selector) {
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
        if (exports.match(parent, selector)) {
            return parent;
        }
        parent = parent.parentElement || parent.parentNode;
    }
    return null;
};
var ɵ0 = closestWithMatch;
exports.ɵ0 = ɵ0;
/**
 * @hidden
 */
exports.noop = function () { };
/**
 * @hidden
 */
exports.isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
exports.isBlank = function (value) { return value === null || value === undefined; };
/**
 * @hidden
 */
exports.isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
exports.isNullOrEmptyString = function (value) { return exports.isBlank(value) || value.trim().length === 0; };
/**
 * @hidden
 */
exports.closestNode = function (element) {
    var selector = 'li.k-treeview-item';
    if (!kendo_angular_common_1.isDocumentAvailable()) {
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
exports.isFocusable = function (element) {
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
exports.isContent = function (element) {
    var scopeSelector = '.k-in,.k-treeview-item,.k-treeview';
    if (!kendo_angular_common_1.isDocumentAvailable()) {
        return null;
    }
    var node = element;
    while (node && !exports.match(node, scopeSelector)) {
        node = node.parentNode;
    }
    if (node) {
        return exports.match(node, '.k-in');
    }
};
/**
 * @hidden
 */
exports.closest = function (node, predicate) {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
/**
 * @hidden
 */
exports.hasParent = function (element, container) {
    return Boolean(exports.closest(element, function (node) { return node === container; }));
};
/**
 * @hidden
 */
exports.focusableNode = function (element) { return element.nativeElement.querySelector('li[tabindex="0"]'); };
/**
 * @hidden
 */
exports.hasActiveNode = function (target, node) {
    var closestItem = node || exports.closestNode(target);
    return closestItem && (closestItem === target || target.tabIndex < 0);
};
/**
 * @hidden
 */
exports.nodeId = function (node) { return node ? node.getAttribute('data-treeindex') : ''; };
/**
 * @hidden
 */
exports.nodeIndex = function (item) { return (item || {}).index; };
