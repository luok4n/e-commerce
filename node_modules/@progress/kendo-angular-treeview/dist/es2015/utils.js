import { isDocumentAvailable } from '@progress/kendo-angular-common';
const focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
/**
 * @hidden
 */
export const match = (element, selector) => {
    const matcher = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    if (!matcher) {
        return false;
    }
    return matcher.call(element, selector);
};
const closestWithMatch = (element, selector) => {
    if (!document.documentElement.contains(element)) {
        return null;
    }
    let parent = element;
    while (parent !== null && parent.nodeType === 1) {
        if (match(parent, selector)) {
            return parent;
        }
        parent = parent.parentElement || parent.parentNode;
    }
    return null;
};
const ɵ0 = closestWithMatch;
/**
 * @hidden
 */
export const noop = () => { };
/**
 * @hidden
 */
export const isPresent = (value) => value !== null && value !== undefined;
/**
 * @hidden
 */
export const isBlank = (value) => value === null || value === undefined;
/**
 * @hidden
 */
export const isArray = (value) => Array.isArray(value);
/**
 * @hidden
 */
export const isNullOrEmptyString = (value) => isBlank(value) || value.trim().length === 0;
/**
 * @hidden
 */
export const closestNode = (element) => {
    const selector = 'li.k-treeview-item';
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
export const isFocusable = (element) => {
    if (element.tagName) {
        const tagName = element.tagName.toLowerCase();
        const tabIndex = element.getAttribute('tabIndex');
        const skipTab = tabIndex === '-1';
        let focusable = tabIndex !== null && !skipTab;
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
export const isContent = (element) => {
    const scopeSelector = '.k-in,.k-treeview-item,.k-treeview';
    if (!isDocumentAvailable()) {
        return null;
    }
    let node = element;
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
export const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
/**
 * @hidden
 */
export const hasParent = (element, container) => {
    return Boolean(closest(element, (node) => node === container));
};
/**
 * @hidden
 */
export const focusableNode = (element) => element.nativeElement.querySelector('li[tabindex="0"]');
/**
 * @hidden
 */
export const hasActiveNode = (target, node) => {
    const closestItem = node || closestNode(target);
    return closestItem && (closestItem === target || target.tabIndex < 0);
};
/**
 * @hidden
 */
export const nodeId = (node) => node ? node.getAttribute('data-treeindex') : '';
/**
 * @hidden
 */
export const nodeIndex = (item) => (item || {}).index;
export { ɵ0 };
