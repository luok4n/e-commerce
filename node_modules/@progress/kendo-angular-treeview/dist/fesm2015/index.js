import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, Injectable, Input, NgModule, NgZone, Optional, Output, Renderer2, TemplateRef } from '@angular/core';
import { Keys, guid, hasObservers, isChanged, isDocumentAvailable } from '@progress/kendo-angular-common';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { BehaviorSubject, EMPTY, Subject, Subscription, merge, of } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { catchError, delay, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

/**
 * @hidden
 */
class DataChangeNotificationService {
    constructor() {
        this.changes = new EventEmitter();
    }
    notify() {
        this.changes.emit();
    }
}

/**
 * @hidden
 */
const hasChildren = () => false;
/**
 * @hidden
 */
const isChecked = () => 'none';
/**
 * @hidden
 */
const isDisabled = () => false;
/**
 * @hidden
 */
const isExpanded = () => true;
/**
 * @hidden
 */
const isSelected = () => false;

/**
 * @hidden
 */
class ExpandStateService {
    constructor() {
        this.changes = new Subject();
    }
    expand(index, dataItem) {
        this.changes.next({ dataItem, index, expand: true });
    }
    collapse(index, dataItem) {
        this.changes.next({ dataItem, index, expand: false });
    }
}
ExpandStateService.decorators = [
    { type: Injectable },
];

/**
 * @hidden
 */
class IndexBuilderService {
    constructor() {
        this.INDEX_SEPARATOR = '_';
    }
    nodeIndex(index = '', parentIndex = '') {
        return `${parentIndex}${parentIndex ? this.INDEX_SEPARATOR : ''}${index}`;
    }
    indexForLevel(index, level) {
        return index.split(this.INDEX_SEPARATOR).slice(0, level).join(this.INDEX_SEPARATOR);
    }
    lastLevelIndex(index = '') {
        const parts = index.split(this.INDEX_SEPARATOR);
        if (!parts.length) {
            return NaN;
        }
        return parseInt(parts[parts.length - 1], 10);
    }
    level(index) {
        return index.split(this.INDEX_SEPARATOR).length;
    }
}
IndexBuilderService.decorators = [
    { type: Injectable },
];

/**
 * @hidden
 */
class LoadingNotificationService {
    constructor() {
        this.changes = new Subject();
    }
    notifyLoaded(index) {
        this.changes.next(index);
    }
}
LoadingNotificationService.decorators = [
    { type: Injectable },
];

const focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
/**
 * @hidden
 */
const match = (element, selector) => {
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
/**
 * @hidden
 */
const noop = () => { };
/**
 * @hidden
 */
const isPresent = (value) => value !== null && value !== undefined;
/**
 * @hidden
 */
const isBlank = (value) => value === null || value === undefined;
/**
 * @hidden
 */
const isArray = (value) => Array.isArray(value);
/**
 * @hidden
 */
const isNullOrEmptyString = (value) => isBlank(value) || value.trim().length === 0;
/**
 * @hidden
 */
const closestNode = (element) => {
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
const isFocusable = (element) => {
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
const isContent = (element) => {
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
const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
/**
 * @hidden
 */
const hasParent = (element, container) => {
    return Boolean(closest(element, (node) => node === container));
};
/**
 * @hidden
 */
const focusableNode = (element) => element.nativeElement.querySelector('li[tabindex="0"]');
/**
 * @hidden
 */

/**
 * @hidden
 */
const nodeId = (node) => node ? node.getAttribute('data-treeindex') : '';
/**
 * @hidden
 */
const nodeIndex = (item) => (item || {}).index;

const last = (list) => list[list.length - 1];
const safe = node => (node || {});
const safeChildren = node => (safe(node).children || []);
const findLast = node => {
    let lastNode = node;
    let children = [].concat(safeChildren(node));
    while (children.length) {
        children = children.concat(safeChildren(last(children)));
        lastNode = children.shift();
    }
    return lastNode;
};
/**
 * @hidden
 */
class NavigationModel {
    constructor() {
        this.ib = new IndexBuilderService();
        this.nodes = [];
    }
    firstNode() {
        return this.nodes[0] || null;
    }
    lastNode() {
        const node = this.nodes[this.nodes.length - 1];
        if (!node) {
            return null;
        }
        return findLast(last(this.container(node))) || node;
    }
    closestNode(index) {
        const { prev } = safe(this.findNode(index));
        const sibling = prev || this.firstNode();
        return safe(sibling).index === index ? this.sibling(sibling, 1) : sibling;
    }
    findNode(index) {
        return this.find(index, this.nodes);
    }
    findParent(index) {
        const parentLevel = this.ib.level(index) - 1;
        return this.findNode(this.ib.indexForLevel(index, parentLevel));
    }
    findChild(index) {
        return safeChildren(this.findNode(index))[0] || null;
    }
    findPrev(item) {
        const index = item.index;
        const parent = this.findParent(index);
        const levelIndex = this.ib.lastLevelIndex(index);
        if (levelIndex === 0) {
            return parent;
        }
        const currentNode = this.findNode(index);
        let prev = this.sibling(currentNode, -1);
        if (prev) {
            let children = this.container(prev);
            while (children.length > 0) {
                prev = last(children);
                children = this.container(prev);
            }
        }
        return prev;
    }
    findNext(item) {
        const children = this.container(item);
        if (children.length === 0) {
            return this.sibling(item, 1);
        }
        return children[0];
    }
    registerItem(id, index, disabled) {
        const children = [];
        const level = this.ib.level(index);
        const parent = this.findParent(index);
        if (parent || level === 1) {
            const node = { id, children, index, parent, disabled };
            this.insert(node, parent);
        }
    }
    unregisterItem(id, index) {
        const node = this.find(index, this.nodes);
        if (!node || node.id !== id) {
            return;
        }
        const children = this.container(node.parent);
        children.splice(children.indexOf(node), 1);
    }
    childLevel(nodes) {
        const children = nodes.filter(node => isPresent(node));
        if (!children || !children.length) {
            return 1;
        }
        return this.ib.level(children[0].index);
    }
    container(node) {
        return node ? node.children : this.nodes;
    }
    find(index, nodes) {
        const childLevel = this.childLevel(nodes);
        const indexToMatch = this.ib.indexForLevel(index, childLevel);
        const isLeaf = childLevel === this.ib.level(index);
        const node = nodes.find(n => n && n.index === indexToMatch);
        if (!node) {
            return null;
        }
        return isLeaf ? node : this.find(index, node.children);
    }
    insert(node, parent) {
        const nodes = this.container(parent);
        nodes.splice(this.ib.lastLevelIndex(node.index), 0, node);
    }
    sibling(node, offset) {
        if (!node) {
            return null;
        }
        const parent = this.findParent(node.index);
        const container = this.container(parent);
        return container[container.indexOf(node) + offset] || this.sibling(parent, offset) || null;
    }
}

/**
 * @hidden
 */
class NavigationService {
    constructor(localization) {
        this.localization = localization;
        this.expands = new Subject();
        this.moves = new Subject();
        this.checks = new Subject();
        this.selects = new Subject();
        this.navigable = true;
        this.actions = {
            [Keys.ArrowUp]: () => this.activate(this.model.findPrev(this.focusableItem)),
            [Keys.ArrowDown]: () => this.activate(this.model.findNext(this.focusableItem)),
            [Keys.ArrowLeft]: () => (this.expand({
                expand: this.localization.rtl,
                intercept: this.localization.rtl ? this.moveToChild : this.moveToParent
            })),
            [Keys.ArrowRight]: () => (this.expand({
                expand: !this.localization.rtl,
                intercept: this.localization.rtl ? this.moveToParent : this.moveToChild
            })),
            [Keys.Home]: () => this.activate(this.model.firstNode()),
            [Keys.End]: () => this.activate(this.model.lastNode()),
            [Keys.Enter]: () => this.navigable && this.selectIndex(nodeIndex(this.activeItem)),
            [Keys.Space]: () => this.navigable && this.checkIndex(nodeIndex(this.activeItem))
        };
        this.isFocused = false;
        this._model = new NavigationModel();
        this.moveToChild = this.moveToChild.bind(this);
        this.moveToParent = this.moveToParent.bind(this);
    }
    get model() {
        return this._model;
    }
    set model(model) {
        this._model = model;
    }
    get activeIndex() {
        return nodeIndex(this.activeItem) || null;
    }
    get focusableItem() {
        return this.activeItem || this.model.firstNode();
    }
    get isActiveExpanded() {
        return this.activeItem && this.activeItem.children.length > 0;
    }
    activate(item) {
        if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
            return;
        }
        this.isFocused = true;
        this.activeItem = item || this.activeItem;
        this.notifyMove();
    }
    activateParent(index) {
        this.activate(this.model.findParent(index));
    }
    activateIndex(index) {
        if (!index) {
            return;
        }
        this.activate(this.model.findNode(index));
    }
    activateClosest(index) {
        if (!index || nodeIndex(this.focusableItem) !== index) {
            return;
        }
        this.activeItem = this.model.closestNode(index);
        this.notifyMove();
    }
    activateFocusable() {
        if (this.activeItem) {
            return;
        }
        this.activeItem = this.model.firstNode();
        this.notifyMove();
    }
    deactivate() {
        if (!this.navigable || !this.isFocused) {
            return;
        }
        this.isFocused = false;
        this.notifyMove();
    }
    checkIndex(index) {
        if (!this.isDisabled(index)) {
            this.checks.next(index);
        }
    }
    selectIndex(index) {
        if (!this.isDisabled(index)) {
            this.selects.next(index);
        }
    }
    isActive(index) {
        if (!index) {
            return false;
        }
        return this.isFocused && this.activeIndex === index;
    }
    isFocusable(index) {
        return nodeIndex(this.focusableItem) === index;
    }
    isDisabled(index) {
        return this.model.findNode(index).disabled;
    }
    registerItem(id, index, disabled) {
        this.model.registerItem(id, index, disabled);
    }
    unregisterItem(id, index) {
        if (this.isActive(index)) {
            this.activateParent(index);
        }
        this.model.unregisterItem(id, index);
    }
    move(e) {
        if (!this.navigable) {
            return;
        }
        const moveAction = this.actions[e.keyCode];
        if (!moveAction) {
            return;
        }
        moveAction();
        e.preventDefault();
    }
    expand({ expand, intercept }) {
        const index = nodeIndex(this.activeItem);
        if (!index || intercept(index)) {
            return;
        }
        this.notifyExpand(expand);
    }
    moveToParent() {
        if (this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findParent(nodeIndex(this.activeItem)));
        return true;
    }
    moveToChild() {
        if (!this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findChild(nodeIndex(this.activeItem)));
        return true;
    }
    notifyExpand(expand) {
        this.expands.next(this.navigationState(expand));
    }
    notifyMove() {
        this.moves.next(this.navigationState());
    }
    navigationState(expand = false) {
        return ({ expand, index: nodeIndex(this.activeItem), isFocused: this.isFocused });
    }
}
NavigationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NavigationService.ctorParameters = () => [
    { type: LocalizationService }
];

/**
 * @hidden
 */
class NodeChildrenService {
    constructor() {
        this.changes = new Subject();
    }
    childrenLoaded(item, children) {
        this.changes.next({ item, children });
    }
}
NodeChildrenService.decorators = [
    { type: Injectable },
];

/**
 * Represents the template for the TreeView nodes ([more information and example]({% slug nodetemplate_treeview %})).
 * The template helps to customize the content of the nodes. To define the node template, nest an `<ng-template>`
 * tag with the `kendoTreeViewNodeTemplate` directive inside a `<kendo-treeview>` tag. The template context is set
 * to the data item of the current node.
 *
 * @example
 * ```ts
 *
 *  import { Component } from '@angular/core';
 *  @Component({
 *      selector: 'my-app',
 *      template: `
 *      <kendo-treeview
 *          [nodes]="data"
 *          kendoTreeViewExpandable
 *
 *          kendoTreeViewHierarchyBinding
 *          childrenField="items">
 *        <ng-template kendoTreeViewNodeTemplate let-dataItem>
 *          <span [style.fontWeight]="dataItem.items ? 'bolder': 'normal' ">{{dataItem.text}}</span>
 *        </ng-template>
 *      </kendo-treeview>
 *    `
 *  })
 *  export class AppComponent {
 *      public data: any[] = [
 *          {
 *              text: "Inbox",
 *              items: [{ text: "Read Mail" }]
 *          },
 *          {
 *              text: "Drafts"
 *          },
 *          {
 *              text: "Search Folders",
 *              items: [
 *                  { text: "Categorized Mail" },
 *                  { text: "Large Mail" },
 *                  { text: "Unread Mail"}
 *              ]
 *          },
 *          { text: "Settings" }
 *      ];
 *  }
 *
 * ```
 */
class NodeTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NodeTemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoTreeViewNodeTemplate]'
            },] },
];
/** @nocollapse */
NodeTemplateDirective.ctorParameters = () => [
    { type: TemplateRef, decorators: [{ type: Optional }] }
];

/**
 * @hidden
 */
class SelectionService {
    constructor() {
        this.changes = new Subject();
    }
    isFirstSelected(index) {
        return this.firstIndex === index;
    }
    setFirstSelected(index, selected) {
        if (this.firstIndex === index && selected === false) {
            this.firstIndex = null;
        }
        else if (!this.firstIndex && selected) {
            this.firstIndex = index;
        }
    }
    select(index, dataItem) {
        this.changes.next({ dataItem, index });
    }
}
SelectionService.decorators = [
    { type: Injectable },
];

const INDEX_REGEX = /\d+$/;
/**
 * @hidden
 */
class TreeViewLookupService {
    constructor() {
        this.map = new Map();
    }
    registerItem(item, parent) {
        const currentLookup = {
            children: [],
            item,
            parent: this.item(nodeIndex(parent))
        };
        this.map.set(item.index, currentLookup);
    }
    registerChildren(index, children) {
        const item = this.item(index);
        if (!item) {
            return;
        }
        item.children = children;
    }
    unregisterItem(index, dataItem) {
        const current = this.item(index);
        if (current && current.item.dataItem === dataItem) {
            this.map.delete(index);
            if (current.parent && current.parent.children) {
                current.parent.children = current.parent.children.filter(item => item.dataItem !== dataItem);
            }
        }
    }
    replaceItem(index, item, parent) {
        if (!item) {
            return;
        }
        this.unregisterItem(index, item.dataItem);
        this.registerItem(item, parent);
        this.addToParent(item, parent);
    }
    itemLookup(index) {
        const item = this.item(index);
        if (!item) {
            return null;
        }
        return {
            children: this.mapChildren(item.children),
            item: item.item,
            parent: item.parent
        };
    }
    hasItem(index) {
        return this.map.has(index);
    }
    item(index) {
        return this.map.get(index) || null;
    }
    addToParent(item, parent) {
        if (parent) {
            const parentItem = this.item(parent.index);
            const index = parseInt(INDEX_REGEX.exec(item.index)[0], 10);
            parentItem.children = parentItem.children || [];
            parentItem.children.splice(index, 0, item);
        }
    }
    mapChildren(children = []) {
        return children.map(c => {
            const { item, parent, children } = this.item(c.index);
            return {
                children: this.mapChildren(children),
                item,
                parent
            };
        });
    }
}
TreeViewLookupService.decorators = [
    { type: Injectable },
];

const providers = [
    ExpandStateService,
    IndexBuilderService,
    TreeViewLookupService,
    LoadingNotificationService,
    NodeChildrenService,
    NavigationService,
    SelectionService,
    DataChangeNotificationService,
    LocalizationService,
    {
        provide: L10N_PREFIX,
        useValue: 'kendo.treeview'
    }
];
/* tslint:disable:member-ordering */
/**
 * Represents the [Kendo UI TreeView component for Angular]({% slug overview_treeview %}).
 *
 * @example
 * {% meta height:350 %}
 * ```ts-preview
 * import { Component } from '@angular/core';
 *
 *  _@Component({
 *      selector: 'my-app',
 *      template: `
 *      <kendo-treeview
 *          [nodes]="data"
 *          textField="text"
 *          kendoTreeViewCheckable
 *          kendoTreeViewExpandable
 *          kendoTreeViewSelectable
 *
 *          kendoTreeViewHierarchyBinding
 *          childrenField="items">
 *      </kendo-treeview>
 *  `
 *  })
 *  export class AppComponent {
 *      public data: any[] = [
 *          {
 *              text: "Furniture", items: [
 *                  { text: "Tables & Chairs" },
 *                  { text: "Sofas" },
 *                  { text: "Occasional Furniture" }
 *              ]
 *          },
 *          {
 *              text: "Decor", items: [
 *                  { text: "Bed Linen" },
 *                  { text: "Curtains & Blinds" },
 *                  { text: "Carpets" }
 *              ]
 *          }
 *      ];
 *  }
 * ```
 * {% endmeta %}
 */
class TreeViewComponent {
    constructor(expandService, navigationService, nodeChildrenService, selectionService, treeViewLookupService, ngZone, renderer, element, dataChangeNotification, localization) {
        this.expandService = expandService;
        this.navigationService = navigationService;
        this.nodeChildrenService = nodeChildrenService;
        this.selectionService = selectionService;
        this.treeViewLookupService = treeViewLookupService;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.element = element;
        this.dataChangeNotification = dataChangeNotification;
        this.localization = localization;
        this.classNames = true;
        /** @hidden */
        this.fetchNodes = () => this.data;
        /**
         * Fires when the children of the expanded node are loaded.
         */
        this.childrenLoaded = new EventEmitter();
        /**
         * Fires when the user blurs the component.
         */
        this.onBlur = new EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires when the user focuses the component.
         */
        this.onFocus = new EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires when the user expands a TreeView node.
         */
        this.expand = new EventEmitter();
        /**
         * Fires when the user collapses a TreeView node.
         */
        this.collapse = new EventEmitter();
        /**
         * Fires when the user selects a TreeView node checkbox
         * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
         */
        this.checkedChange = new EventEmitter();
        /**
         * Fires when the user selects a TreeView node
         * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
         */
        this.selectionChange = new EventEmitter();
        /**
         * Fires when the user clicks a TreeView node.
         */
        this.nodeClick = new EventEmitter();
        /**
         * Fires when the user double clicks a TreeView node.
         */
        this.nodeDblClick = new EventEmitter();
        /**
         * A function which determines if a specific node is disabled.
         */
        this.isDisabled = isDisabled;
        /**
         * Determines whether the TreeView keyboard navigable is enabled.
         */
        this.navigable = true;
        /**
         * A function which provides the child nodes for a given parent node
         * ([see example]({% slug databinding_treeview %})).
         */
        this.children = () => of([]);
        this.checkboxes = false;
        this.expandIcons = false;
        this.isActive = false;
        this.data = new BehaviorSubject([]);
        this._animate = true;
        this.subscriptions = new Subscription(() => { });
        this.domSubscriptions = [];
    }
    get role() { return 'tree'; }
    /** @hidden */
    get direction() {
        return this.localization.rtl ? 'rtl' : 'ltr';
    }
    /**
     * Determines whether the content animation is enabled.
     */
    set animate(value) {
        this._animate = value;
    }
    get animate() {
        return !this._animate;
    }
    /**
     * The nodes which will be displayed by the TreeView
     * ([see example]({% slug databinding_treeview %})).
     */
    set nodes(value) {
        this.dataChangeNotification.notify();
        this.data.next(value);
    }
    /**
     * A function which determines if a specific node has child nodes
     * ([see example]({% slug databinding_treeview %})).
     */
    get hasChildren() {
        return this._hasChildren || hasChildren;
    }
    set hasChildren(callback) {
        this._hasChildren = callback;
        this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
    }
    /**
     * A function which determines if a specific node is selected
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    get isChecked() {
        return this._isChecked || isChecked;
    }
    set isChecked(callback) {
        this._isChecked = callback;
        this.checkboxes = Boolean(this._isChecked);
    }
    /**
     * A function which determines if a specific node is expanded.
     */
    get isExpanded() {
        return this._isExpanded || isExpanded;
    }
    set isExpanded(callback) {
        this._isExpanded = callback;
        this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
    }
    /**
     * A function which determines if a specific node is selected
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    get isSelected() {
        return this._isSelected || isSelected;
    }
    set isSelected(callback) {
        this._isSelected = callback;
    }
    ngOnChanges(_) {
        this.navigationService.navigable = Boolean(this.navigable);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.domSubscriptions.forEach(subscription => subscription());
    }
    ngOnInit() {
        this.subscriptions.add(this.nodeChildrenService
            .changes
            .subscribe((x) => this.childrenLoaded.emit(x)));
        this.subscriptions.add(this.expandService.changes
            .subscribe(({ index, dataItem, expand }) => expand
            ? this.expand.emit({ index, dataItem })
            : this.collapse.emit({ index, dataItem })));
        this.subscriptions.add(this.navigationService.checks
            .subscribe((x) => this.checkedChange.emit(this.treeViewLookupService.itemLookup(x))));
        this.subscriptions.add(this.selectionService.changes
            .subscribe((x) => {
            if (hasObservers(this.selectionChange)) {
                this.ngZone.run(() => {
                    this.selectionChange.emit(x);
                });
            }
        }));
        if (this.element) {
            this.ngZone.runOutsideAngular(() => {
                this.attachDomHandlers();
            });
        }
    }
    /**
     * Blurs the focused TreeView item.
     */
    blur() {
        if (!isDocumentAvailable()) {
            return;
        }
        const target = focusableNode(this.element);
        if (document.activeElement === target) {
            target.blur();
        }
    }
    /**
     * Focuses the first focusable item in the TreeView component if no hierarchical index is provided.
     *
     * @example
     * ```ts
     * import { Component } from '@angular/core';
     *
     *  @Component({
     *      selector: 'my-app',
     *      template: `
     *      <button (click)="treeview.focus('1')">Focuses the second node</button>
     *      <kendo-treeview
     *          #treeview
     *          [nodes]="data"
     *          textField="text"
     *      >
     *      </kendo-treeview>
     *  `
     *  })
     *  export class AppComponent {
     *      public data: any[] = [
     *          { text: "Furniture" },
     *          { text: "Decor" }
     *      ];
     *  }
     * ```
     */
    focus(index) {
        this.navigationService.activateIndex(index);
        const target = focusableNode(this.element);
        if (target) {
            target.focus();
        }
    }
    /**
     * Based on the specified index, returns the TreeItemLookup node.
     *
     * @param index - The index of the node.
     * @returns {TreeItemLookup} - The item that was searched (looked up).
     */
    itemLookup(index) {
        return this.treeViewLookupService.itemLookup(index);
    }
    /**
     * @hidden
     */
    isDisabledNode(node) {
        return this.navigationService.isDisabled(node.item.index);
    }
    attachDomHandlers() {
        const element = this.element.nativeElement;
        this.clickHandler = this.clickHandler.bind(this);
        this.domSubscriptions.push(this.renderer.listen(element, 'contextmenu', this.clickHandler), this.renderer.listen(element, 'click', this.clickHandler), this.renderer.listen(element, 'dblclick', this.clickHandler), this.renderer.listen(element, 'focusin', this.focusHandler.bind(this)), this.renderer.listen(element, 'focusout', this.blurHandler.bind(this)), this.renderer.listen(element, 'keydown', this.keydownHandler.bind(this)));
    }
    focusHandler(e) {
        let focusItem;
        if (match(e.target, '.k-treeview-item')) {
            focusItem = e.target;
        }
        else if (!isFocusable(e.target)) { // with compliments to IE
            focusItem = closestNode(e.target);
        }
        if (focusItem) {
            this.navigationService.activateIndex(nodeId(e.target));
            if (!this.isActive && hasObservers(this.onFocus)) {
                this.ngZone.run(() => {
                    this.onFocus.emit();
                });
            }
            this.isActive = true;
        }
    }
    blurHandler(e) {
        if (this.isActive && match(e.target, '.k-treeview-item') &&
            (!e.relatedTarget || !match(e.relatedTarget, '.k-treeview-item') || !hasParent(e.relatedTarget, this.element.nativeElement))) {
            this.navigationService.deactivate();
            this.isActive = false;
            if (hasObservers(this.onBlur)) {
                this.ngZone.run(() => {
                    this.onBlur.emit();
                });
            }
        }
    }
    clickHandler(e) {
        const target = e.target;
        if ((e.type === 'contextmenu' && !hasObservers(this.nodeClick)) ||
            (e.type === 'click' && !hasObservers(this.nodeClick) && !hasObservers(this.selectionChange)) ||
            (e.type === 'dblclick' && !hasObservers(this.nodeDblClick)) || isFocusable(target) ||
            !isContent(target) || !hasParent(target, this.element.nativeElement)) {
            return;
        }
        const index = nodeId(closestNode(target));
        // the disabled check is probably not needed due to the k-state-disabled styles
        if (!index || this.navigationService.isDisabled(index)) {
            return;
        }
        this.ngZone.run(() => {
            const lookup = this.treeViewLookupService.itemLookup(index);
            if (e.type === 'click') {
                this.navigationService.selectIndex(index);
            }
            const emitter = e.type === 'dblclick' ? this.nodeDblClick : this.nodeClick;
            emitter.emit({
                item: lookup.item,
                originalEvent: e,
                type: e.type
            });
        });
    }
    keydownHandler(e) {
        if (this.isActive && this.navigable) {
            this.ngZone.run(() => {
                this.navigationService.move(e);
            });
        }
    }
}
TreeViewComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.Default,
                exportAs: 'kendoTreeView',
                providers: providers,
                selector: 'kendo-treeview',
                template: `
    <ul class="k-treeview-lines"
      kendoTreeViewGroup
      role="group"
      [checkboxes]="checkboxes"
      [expandIcons]="expandIcons"
      [children]="children"
      [hasChildren]="hasChildren"
      [isChecked]="isChecked"
      [isDisabled]="isDisabled"
      [isExpanded]="isExpanded"
      [isSelected]="isSelected"
      [nodeTemplateRef]="nodeTemplate?.templateRef"
      [textField]="textField"
      [nodes]="fetchNodes"
      >
    </ul>
  `
            },] },
];
/** @nocollapse */
TreeViewComponent.ctorParameters = () => [
    { type: ExpandStateService },
    { type: NavigationService },
    { type: NodeChildrenService },
    { type: SelectionService },
    { type: TreeViewLookupService },
    { type: NgZone },
    { type: Renderer2 },
    { type: ElementRef },
    { type: DataChangeNotificationService },
    { type: LocalizationService }
];
TreeViewComponent.propDecorators = {
    classNames: [{ type: HostBinding, args: ["class.k-widget",] }, { type: HostBinding, args: ["class.k-treeview",] }],
    role: [{ type: HostBinding, args: ["attr.role",] }],
    direction: [{ type: HostBinding, args: ["attr.dir",] }],
    animate: [{ type: Input }, { type: HostBinding, args: ['@.disabled',] }],
    childrenLoaded: [{ type: Output }],
    onBlur: [{ type: Output, args: ['blur',] }],
    onFocus: [{ type: Output, args: ['focus',] }],
    expand: [{ type: Output }],
    collapse: [{ type: Output }],
    checkedChange: [{ type: Output }],
    selectionChange: [{ type: Output }],
    nodeClick: [{ type: Output }],
    nodeDblClick: [{ type: Output }],
    nodeTemplate: [{ type: ContentChild, args: [NodeTemplateDirective,] }],
    nodes: [{ type: Input }],
    textField: [{ type: Input }],
    hasChildren: [{ type: Input }],
    isChecked: [{ type: Input }],
    isDisabled: [{ type: Input }],
    isExpanded: [{ type: Input }],
    isSelected: [{ type: Input }],
    navigable: [{ type: Input }],
    children: [{ type: Input }]
};

const FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
const getterCache = {};
// tslint:disable-next-line:no-string-literal
getterCache['undefined'] = obj => obj;
/**
 * @hidden
 */
const getter = (field, safe) => {
    const key = field + safe;
    if (getterCache[key]) {
        return getterCache[key];
    }
    const fields = [];
    field.replace(FIELD_REGEX, (_, index, indexAccessor, field) => {
        fields.push(isPresent(index) ? index : (indexAccessor || field));
        return undefined;
    });
    getterCache[key] = obj => {
        let result = obj;
        for (let idx = 0; idx < fields.length; idx++) {
            result = result[fields[idx]];
            if (!isPresent(result) && safe) {
                return result;
            }
        }
        return result;
    };
    return getterCache[key];
};

/**
 * @hidden
 */
class TreeViewGroupComponent {
    constructor(expandService, loadingService, indexBuilder, treeViewLookupService, navigationService, nodeChildrenService, dataChangeNotification) {
        this.expandService = expandService;
        this.loadingService = loadingService;
        this.indexBuilder = indexBuilder;
        this.treeViewLookupService = treeViewLookupService;
        this.navigationService = navigationService;
        this.nodeChildrenService = nodeChildrenService;
        this.dataChangeNotification = dataChangeNotification;
        this.kGroupClass = true;
        this.textField = "";
        this._data = [];
        this.isChecked = () => 'none';
        this.isDisabled = () => false;
        this.isExpanded = () => false;
        this.isSelected = () => false;
        this.children = () => of([]);
        this.hasChildren = () => false;
    }
    get role() { return 'group'; }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
        const mappedChildren = this.mapToTreeItem(data);
        this.setNodeChildren(mappedChildren);
        this.emitChildrenLoaded(mappedChildren);
    }
    get hasTemplate() {
        return isPresent(this.nodeTemplateRef);
    }
    expandNode(index, dataItem, expand) {
        if (expand) {
            this.expandService.expand(index, dataItem);
        }
        else {
            this.expandService.collapse(index, dataItem);
        }
    }
    checkNode(index) {
        this.navigationService.checkIndex(index);
        this.navigationService.activateIndex(index);
    }
    nodeIndex(index) {
        return this.indexBuilder.nodeIndex(index.toString(), this.parentIndex);
    }
    nodeText(dataItem) {
        const textField = isArray(this.textField) ? this.textField[0] : this.textField;
        return getter(textField, true)(dataItem);
    }
    ngOnDestroy() {
        if (this.nodesSubscription) {
            this.nodesSubscription.unsubscribe();
        }
        if (this.dataChangeSubscription) {
            this.dataChangeSubscription.unsubscribe();
        }
    }
    ngOnInit() {
        this.subscribeToNodesChange();
        this.dataChangeSubscription = this.dataChangeNotification
            .changes
            .subscribe(this.subscribeToNodesChange.bind(this));
    }
    ngOnChanges(changes) {
        if (changes.parentIndex) {
            this.setNodeChildren(this.mapToTreeItem(this.data));
        }
    }
    fetchChildren(node, index) {
        return this.children(node)
            .pipe(catchError(() => {
            this.loadingService.notifyLoaded(index);
            return EMPTY;
        }), tap(() => this.loadingService.notifyLoaded(index)));
    }
    get nextFields() {
        if (isArray(this.textField)) {
            return this.textField.length > 1 ? this.textField.slice(1) : this.textField;
        }
        return [this.textField];
    }
    setNodeChildren(children) {
        this.treeViewLookupService.registerChildren(this.parentIndex, children);
    }
    mapToTreeItem(data) {
        if (!this.parentIndex) {
            return [];
        }
        return data.map((dataItem, idx) => ({ dataItem, index: this.nodeIndex(idx) }));
    }
    emitChildrenLoaded(children) {
        if (!this.parentIndex) {
            return;
        }
        this.nodeChildrenService.childrenLoaded({ dataItem: this.parentDataItem, index: this.parentIndex }, children);
    }
    subscribeToNodesChange() {
        if (this.nodesSubscription) {
            this.nodesSubscription.unsubscribe();
        }
        this.nodesSubscription = this.nodes(this.parentDataItem, this.parentIndex).subscribe(x => { this.data = x; });
    }
}
TreeViewGroupComponent.decorators = [
    { type: Component, args: [{
                animations: [
                    trigger('toggle', [
                        transition('void => *', [
                            style({ height: 0 }),
                            animate('0.1s ease-in', style({ height: "*" }))
                        ]),
                        transition('* => void', [
                            style({ height: "*" }),
                            animate('0.1s ease-in', style({ height: 0 }))
                        ])
                    ])
                ],
                selector: '[kendoTreeViewGroup]',
                template: `
        <li
            *ngFor="let node of data; let index = index" class="k-item k-treeview-item"
            kendoTreeViewItem
            [dataItem]="node"
            [index]="nodeIndex(index)"
            [parentDataItem]="parentDataItem"
            [parentIndex]="parentIndex"
            [isChecked]="isChecked(node, nodeIndex(index))"
            [isDisabled]="disabled || isDisabled(node, nodeIndex(index))"
            [isExpanded]="isExpanded(node, nodeIndex(index))"
            [isSelected]="isSelected(node, nodeIndex(index))"
            [attr.data-treeindex]="nodeIndex(index)"
        >
            <div class="k-mid">
                <span
                    class="k-icon"
                    [class.k-i-collapse]="isExpanded(node, nodeIndex(index))"
                    [class.k-i-expand]="!isExpanded(node, nodeIndex(index))"
                    [kendoTreeViewLoading]="nodeIndex(index)"
                    (click)="expandNode(nodeIndex(index), node, !isExpanded(node, nodeIndex(index)))"
                    *ngIf="expandIcons && hasChildren(node)"
                    >
                </span>
                <kendo-checkbox
                    *ngIf="checkboxes"
                    [node]="node"
                    [index]="nodeIndex(index)"
                    [isChecked]="isChecked"
                    (checkStateChange)="checkNode(nodeIndex(index))"
                    tabindex="-1"
                ></kendo-checkbox>
                <span kendoTreeViewItemContent
                    [attr.data-treeindex]="nodeIndex(index)"
                    [dataItem]="node"
                    [index]="nodeIndex(index)"
                    [initialSelection]="isSelected(node, nodeIndex(index))"
                    [isSelected]="isSelected"
                    class="k-in"
                >
                    <ng-container [ngSwitch]="hasTemplate">
                        <ng-container *ngSwitchCase="true">
                            <ng-template
                                [ngTemplateOutlet]="nodeTemplateRef" [ngTemplateOutletContext]="{$implicit: node, index: nodeIndex(index)}"
                                >
                            </ng-template>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{nodeText(node)}}
                        </ng-container>
                    </ng-container>
                </span>
            </div>
            <ul
                *ngIf="isExpanded(node, nodeIndex(index)) && hasChildren(node)"
                kendoTreeViewGroup
                role="group"
                [nodes]="fetchChildren"
                [checkboxes]="checkboxes"
                [expandIcons]="expandIcons"
                [children]="children"
                [hasChildren]="hasChildren"
                [isChecked]="isChecked"
                [isDisabled]="isDisabled"
                [disabled]="disabled || isDisabled(node, nodeIndex(index))"
                [isExpanded]="isExpanded"
                [isSelected]="isSelected"
                [nodeTemplateRef]="nodeTemplateRef"
                [parentIndex]="nodeIndex(index)"
                [parentDataItem]="node"
                [textField]="nextFields"
                [@toggle]="true"
                >
            </ul>
        </li>
    `
            },] },
];
/** @nocollapse */
TreeViewGroupComponent.ctorParameters = () => [
    { type: ExpandStateService },
    { type: LoadingNotificationService },
    { type: IndexBuilderService },
    { type: TreeViewLookupService },
    { type: NavigationService },
    { type: NodeChildrenService },
    { type: DataChangeNotificationService }
];
TreeViewGroupComponent.propDecorators = {
    kGroupClass: [{ type: HostBinding, args: ["class.k-group",] }],
    role: [{ type: HostBinding, args: ["attr.role",] }],
    checkboxes: [{ type: Input }],
    expandIcons: [{ type: Input }],
    disabled: [{ type: Input }],
    nodes: [{ type: Input }],
    textField: [{ type: Input }],
    parentDataItem: [{ type: Input }],
    parentIndex: [{ type: Input }],
    nodeTemplateRef: [{ type: Input }],
    isChecked: [{ type: Input }],
    isDisabled: [{ type: Input }],
    isExpanded: [{ type: Input }],
    isSelected: [{ type: Input }],
    children: [{ type: Input }],
    hasChildren: [{ type: Input }]
};

const indexChecked = (keys, index) => keys.filter(k => k === index).length > 0;
const matchKey = index => k => {
    if (index === k) {
        return true;
    }
    if (!k.split) {
        return false;
    }
    return k.split('_').reduce(({ key, result }, part) => {
        key += part;
        if (index === key || result) {
            return { result: true };
        }
        key += "_";
        return { key, result: false };
    }, { key: "", result: false }).result;
};
/**
 * A directive which manages the in-memory checked state of the TreeView node
 * ([see example]({% slug checkboxes_treeview %})).
 */
class CheckDirective {
    constructor(treeView, zone) {
        this.treeView = treeView;
        this.zone = zone;
        /**
         * Fires when the `checkedKeys` collection was updated.
         */
        this.checkedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(() => { });
        this.checkActions = {
            'multiple': (e) => this.checkMultiple(e),
            'single': (e) => this.checkSingle(e)
        };
        this._checkedKeys = [];
        this.subscriptions.add(this.treeView.checkedChange
            .subscribe((e) => this.check(e)));
        this.subscriptions.add(this.treeView.childrenLoaded
            .pipe(filter(() => this.options.checkChildren), switchMap(e => this.zone.onStable.pipe(take(1), map(() => e))))
            .subscribe((e) => this.addChildrenKeys(e)));
        this.treeView.isChecked = this.isItemChecked.bind(this);
    }
    /**
     * @hidden
     */
    set isChecked(value) {
        this.treeView.isChecked = value;
    }
    /**
     * Defines the collection that will store the checked keys
     * ([see example]({% slug checkboxes_treeview %})).
     */
    get checkedKeys() {
        return this._checkedKeys;
    }
    set checkedKeys(keys) {
        this._checkedKeys = keys;
    }
    get options() {
        const defaultOptions = {
            checkChildren: true,
            checkParents: true,
            enabled: true,
            mode: "multiple"
        };
        if (!isPresent(this.checkable)) {
            return defaultOptions;
        }
        const isBoolean = typeof this.checkable === 'boolean';
        const checkSettings = isBoolean
            ? { enabled: this.checkable }
            : this.checkable;
        return Object.assign(defaultOptions, checkSettings);
    }
    ngOnChanges(changes) {
        if (changes.checkable) {
            this.treeView.checkboxes = this.options.enabled;
            this.toggleCheckOnClick();
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.unsubscribeClick();
    }
    isItemChecked(dataItem, index) {
        if (!this.checkKey) {
            return this.isIndexChecked(index);
        }
        const keyIndex = this.checkedKeys.indexOf(this.itemKey({ dataItem, index }));
        return keyIndex > -1 ? 'checked' : 'none';
    }
    isIndexChecked(index) {
        const checkedKeys = this.checkedKeys.filter(matchKey(index));
        if (indexChecked(checkedKeys, index)) {
            return 'checked';
        }
        const { mode, checkParents } = this.options;
        if (mode === 'multiple' && checkParents && checkedKeys.length) {
            return 'indeterminate';
        }
        return 'none';
    }
    itemKey(e) {
        if (!this.checkKey) {
            return e.index;
        }
        if (typeof this.checkKey === "string") {
            return e.dataItem[this.checkKey];
        }
        if (typeof this.checkKey === "function") {
            return this.checkKey(e);
        }
    }
    check(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.checkActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    checkSingle(node) {
        const key = this.itemKey(node.item);
        this.checkedKeys = this.checkedKeys[0] !== key ? [key] : [];
        this.notify();
    }
    checkMultiple(node) {
        this.checkNode(node);
        if (this.options.checkParents) {
            this.checkParents(node.parent);
        }
        this.notify();
    }
    toggleCheckOnClick() {
        this.unsubscribeClick();
        if (this.options.checkOnClick) {
            this.clickSubscription = this.treeView.nodeClick.subscribe(args => {
                if (args.type === 'click') {
                    const lookup = this.treeView.itemLookup(args.item.index);
                    this.check(lookup);
                }
            });
        }
    }
    unsubscribeClick() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
    }
    checkNode(node, check) {
        const key = this.itemKey(node.item);
        const idx = this.checkedKeys.indexOf(key);
        const isChecked = idx > -1;
        const shouldCheck = check === undefined ? !isChecked : check;
        if (!isPresent(key) || (isChecked && check) || this.treeView.isDisabledNode(node)) {
            return;
        }
        if (isChecked) {
            this.checkedKeys.splice(idx, 1);
        }
        else {
            this.checkedKeys.push(key);
        }
        if (this.options.checkChildren) {
            node.children.map(n => this.checkNode(n, shouldCheck));
        }
    }
    checkParents(parent) {
        let currentParent = parent;
        while (currentParent) {
            const parentKey = this.itemKey(currentParent.item);
            const parentIndex = this.checkedKeys.indexOf(parentKey);
            if (this.allChildrenSelected(currentParent.children)) {
                if (parentIndex === -1) {
                    this.checkedKeys.push(parentKey);
                }
            }
            else if (parentIndex > -1) {
                this.checkedKeys.splice(parentIndex, 1);
            }
            currentParent = currentParent.parent;
        }
    }
    allChildrenSelected(children) {
        const isCheckedReducer = (acc, item) => (acc && this.isItemChecked(item.dataItem, item.index) === 'checked');
        return children.reduce(isCheckedReducer, true);
    }
    notify() {
        this.checkedKeysChange.emit(this.checkedKeys.slice());
    }
    addChildrenKeys(args) {
        if (this.checkedKeys.indexOf(this.itemKey(args.item)) === -1) {
            return;
        }
        const keys = args.children.reduce((acc, item) => {
            const itemKey = this.itemKey(item);
            const existingKey = this.checkedKeys.find(key => itemKey === key);
            if (!existingKey) {
                acc.push(itemKey);
            }
            return acc;
        }, []);
        if (keys.length) {
            this.checkedKeys = this.checkedKeys.concat(keys);
            this.zone.run(() => {
                this.notify();
            });
        }
    }
}
CheckDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewCheckable]' },] },
];
/** @nocollapse */
CheckDirective.ctorParameters = () => [
    { type: TreeViewComponent },
    { type: NgZone }
];
CheckDirective.propDecorators = {
    isChecked: [{ type: Input }],
    checkKey: [{ type: Input, args: ["checkBy",] }],
    checkedKeys: [{ type: Input }],
    checkable: [{ type: Input, args: ['kendoTreeViewCheckable',] }],
    checkedKeysChange: [{ type: Output }]
};

/**
 * A directive which manages the disabled in-memory state of the TreeView node
 * ([see example]({% slug disabledstate_treeview %})).
 */
class DisableDirective {
    constructor(treeView, cdr) {
        this.treeView = treeView;
        this.cdr = cdr;
        /**
         * Defines the collection that will store the disabled keys.
         */
        this.disabledKeys = [];
        this.treeView.isDisabled = (dataItem, index) => (this.disabledKeys.indexOf(this.itemKey({ dataItem, index })) > -1);
    }
    /**
     * @hidden
     */
    set isDisabled(value) {
        this.treeView.isDisabled = value;
    }
    ngOnChanges(changes = {}) {
        const { disabledKeys } = changes;
        if (disabledKeys && !disabledKeys.firstChange) {
            this.cdr.markForCheck();
        }
    }
    itemKey(e) {
        if (!this.disableKey) {
            return e.index;
        }
        if (typeof this.disableKey === "string") {
            return e.dataItem[this.disableKey];
        }
        if (typeof this.disableKey === "function") {
            return this.disableKey(e);
        }
    }
}
DisableDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewDisable]' },] },
];
/** @nocollapse */
DisableDirective.ctorParameters = () => [
    { type: TreeViewComponent },
    { type: ChangeDetectorRef }
];
DisableDirective.propDecorators = {
    isDisabled: [{ type: Input }],
    disableKey: [{ type: Input, args: ["kendoTreeViewDisable",] }],
    disabledKeys: [{ type: Input }]
};

/**
 * A directive which manages the expanded state of the TreeView
 * ([see example]({% slug expandedstate_treeview %})).
 */
class ExpandDirective {
    constructor(treeView) {
        this.treeView = treeView;
        /**
         * Fires when the `expandedKeys` collection was updated.
         */
        this.expandedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(() => { });
        this._expandedKeys = [];
        this.subscriptions.add(merge(this.treeView.expand.pipe(map(e => (Object.assign({ expand: true }, e)))), this.treeView.collapse.pipe(map(e => (Object.assign({ expand: false }, e))))).subscribe(this.toggleExpand.bind(this)));
        this.treeView.isExpanded = (dataItem, index) => this.expandedKeys.indexOf(this.itemKey({ dataItem, index })) > -1;
    }
    /**
     * @hidden
     */
    set isExpanded(value) {
        this.treeView.isExpanded = value;
    }
    /**
     * Defines the collection that will store the expanded keys.
     */
    get expandedKeys() {
        return this._expandedKeys;
    }
    set expandedKeys(keys) {
        this._expandedKeys = keys;
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    itemKey(e) {
        if (this.expandKey) {
            if (typeof this.expandKey === "string") {
                return e.dataItem[this.expandKey];
            }
            if (typeof this.expandKey === "function") {
                return this.expandKey(e);
            }
        }
        return e.index;
    }
    toggleExpand({ index, dataItem, expand }) {
        const item = this.itemKey({ index, dataItem });
        const idx = this.expandedKeys.indexOf(item);
        let notify = false;
        if (idx > -1 && !expand) {
            this.expandedKeys.splice(idx, 1);
            notify = true;
        }
        else if (idx === -1 && expand) {
            this.expandedKeys.push(item);
            notify = true;
        }
        if (notify) {
            this.expandedKeysChange.emit(this.expandedKeys);
        }
    }
}
ExpandDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewExpandable]' },] },
];
/** @nocollapse */
ExpandDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
ExpandDirective.propDecorators = {
    isExpanded: [{ type: Input }],
    expandKey: [{ type: Input, args: ["expandBy",] }],
    expandedKeysChange: [{ type: Output }],
    expandedKeys: [{ type: Input }]
};

/**
 * A directive which manages the in-memory selection state of the TreeView node
 * ([see example]({% slug selection_treeview %})).
 */
class SelectDirective {
    constructor(treeView) {
        this.treeView = treeView;
        /**
         * Fires when the `selectedKeys` collection was updated.
         */
        this.selectedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(() => { });
        this.selectActions = {
            'multiple': (e) => this.selectMultiple(e),
            'single': (e) => this.selectSingle(e)
        };
        this._selectedKeys = [];
        this.subscriptions.add(this.treeView.selectionChange.subscribe(this.select.bind(this)));
        this.treeView.isSelected = (dataItem, index) => (this.selectedKeys.indexOf(this.itemKey({ dataItem, index })) > -1);
    }
    /**
     * @hidden
     */
    set isSelected(value) {
        this.treeView.isSelected = value;
    }
    /**
     * Defines the collection that will store the selected keys
     * ([see example]({% slug selection_treeview %}#toc-selection-modes)).
     */
    get selectedKeys() {
        return this._selectedKeys;
    }
    set selectedKeys(keys) {
        this._selectedKeys = keys;
    }
    get getAriaMultiselectable() {
        return this.options.mode === 'multiple';
    }
    get options() {
        const defaultOptions = {
            enabled: true,
            mode: 'single'
        };
        if (!isPresent(this.selection)) {
            return defaultOptions;
        }
        const isBoolean = typeof this.selection === 'boolean';
        const selectionSettings = isBoolean ? { enabled: this.selection } : this.selection;
        return Object.assign(defaultOptions, selectionSettings);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    itemKey(e) {
        if (!this.selectKey) {
            return e.index;
        }
        if (typeof this.selectKey === 'string') {
            return e.dataItem[this.selectKey];
        }
        if (typeof this.selectKey === 'function') {
            return this.selectKey(e);
        }
    }
    select(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.selectActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    selectSingle(node) {
        const key = this.itemKey(node);
        if (this.selectedKeys[0] === key) {
            return;
        }
        this.selectedKeys = [key];
        this.notify();
    }
    selectMultiple(node) {
        const key = this.itemKey(node);
        const idx = this.selectedKeys.indexOf(key);
        const isSelected = idx > -1;
        if (!isPresent(key)) {
            return;
        }
        if (isSelected) {
            this.selectedKeys.splice(idx, 1);
        }
        else {
            this.selectedKeys.push(key);
        }
        this.notify();
    }
    notify() {
        this.selectedKeysChange.emit(this.selectedKeys.slice());
    }
}
SelectDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewSelectable]' },] },
];
/** @nocollapse */
SelectDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
SelectDirective.propDecorators = {
    isSelected: [{ type: Input }],
    selectKey: [{ type: Input, args: ['selectBy',] }],
    selection: [{ type: Input, args: ['kendoTreeViewSelectable',] }],
    selectedKeys: [{ type: Input }],
    selectedKeysChange: [{ type: Output }],
    getAriaMultiselectable: [{ type: HostBinding, args: ['attr.aria-multiselectable',] }]
};

/**
 * A directive which encapsulates the retrieval of child nodes.
 */
class HierarchyBindingDirective {
    constructor(treeView) {
        this.treeView = treeView;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    set childrenField(value) {
        if (!value) {
            throw new Error("'childrenField' cannot be empty");
        }
        this._childrenField = value;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    get childrenField() {
        return this._childrenField;
    }
    ngOnInit() {
        if (isPresent(this.childrenField)) {
            this.treeView.children = item => of(getter(this.childrenField, true)(item));
            this.treeView.hasChildren = item => {
                const children = getter(this.childrenField, true)(item);
                return Boolean(children && children.length);
            };
        }
    }
}
HierarchyBindingDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewHierarchyBinding]' },] },
];
/** @nocollapse */
HierarchyBindingDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
HierarchyBindingDirective.propDecorators = {
    childrenField: [{ type: Input }]
};

/**
 * @hidden
 */
class LoadingIndicatorDirective {
    constructor(expandService, loadingService, cd) {
        this.expandService = expandService;
        this.loadingService = loadingService;
        this.cd = cd;
        this._loading = false;
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = value;
        this.cd.markForCheck();
    }
    ngOnInit() {
        const loadingNotifications = this.loadingService
            .changes
            .pipe(filter(index => index === this.index));
        this.subscription = this.expandService
            .changes
            .pipe(filter(({ index }) => index === this.index), tap(({ expand }) => {
            if (!expand && this.loading) {
                this.loading = false;
            }
        }), filter(({ expand }) => expand), switchMap(x => of(x).pipe(delay(100), takeUntil(loadingNotifications))))
            .subscribe(() => this.loading = true);
        this.subscription.add(loadingNotifications.subscribe(() => this.loading = false));
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
LoadingIndicatorDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewLoading]' },] },
];
/** @nocollapse */
LoadingIndicatorDirective.ctorParameters = () => [
    { type: ExpandStateService },
    { type: LoadingNotificationService },
    { type: ChangeDetectorRef }
];
LoadingIndicatorDirective.propDecorators = {
    loading: [{ type: HostBinding, args: ["class.k-i-loading",] }],
    index: [{ type: Input, args: ["kendoTreeViewLoading",] }]
};

/**
 * @hidden
 * Performs the right-to-left function composition. Functions must have a unary.
 */
const compose = (...args) => (data) => args.reduceRight((acc, curr) => curr(acc), data);

const findChildren = (prop, nodes, value) => nodes.filter(x => prop(x) === value);
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
class FlatDataBindingDirective {
    constructor(treeView) {
        this.treeView = treeView;
        this.originalData = [];
    }
    /**
     * The nodes which will be displayed by the TreeView.
     */
    set nodes(values) {
        this.originalData = values || [];
        if (!isNullOrEmptyString(this.parentIdField)) {
            const prop = getter(this.parentIdField, true);
            this.treeView.nodes = (this.originalData).filter(compose(isBlank, prop));
        }
        else {
            this.treeView.nodes = this.originalData.slice(0);
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (isPresent(this.parentIdField) && isPresent(this.idField)) {
            const fetchChildren = node => findChildren(getter(this.parentIdField, true), this.originalData || [], getter(this.idField, true)(node));
            this.treeView.hasChildren = node => fetchChildren(node).length > 0;
            this.treeView.children = node => of(fetchChildren(node));
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        if (isChanged("parentIdField", changes, false)) {
            this.nodes = this.originalData;
        }
    }
}
FlatDataBindingDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewFlatDataBinding]' },] },
];
/** @nocollapse */
FlatDataBindingDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
FlatDataBindingDirective.propDecorators = {
    nodes: [{ type: Input }],
    parentIdField: [{ type: Input }],
    idField: [{ type: Input }]
};

const buildItem = (index, dataItem) => ({ dataItem, index });
let id = 0;
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
class TreeViewItemDirective {
    constructor(element, expandService, navigationService, selectionService, lookupService, renderer, ib) {
        this.element = element;
        this.expandService = expandService;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.lookupService = lookupService;
        this.renderer = renderer;
        this.ib = ib;
        this.isDisabled = false;
        this.ariaChecked = 'false';
        this.id = id++;
        this.isInitialized = false;
        this.subscriptions = [];
        this.subscribe();
    }
    set isChecked(checked) {
        if (checked === 'checked') {
            this.ariaChecked = 'true';
        }
        else if (checked === 'indeterminate') {
            this.ariaChecked = 'mixed';
        }
        else {
            this.ariaChecked = 'false';
        }
    }
    get isExpanded() {
        return this._isExpanded || false;
    }
    set isExpanded(isExpanded) {
        this._isExpanded = isExpanded;
    }
    get isSelected() {
        return this._isSelected || false;
    }
    set isSelected(isSelected) {
        this._isSelected = isSelected;
    }
    get treeItem() {
        return buildItem(this.index, this.dataItem);
    }
    get parentTreeItem() {
        return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
    }
    ngOnInit() {
        this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
        this.registerNavigationItem();
        this.isInitialized = true;
        this.setAttribute('role', 'treeitem');
        this.setAriaAttributes();
        this.setDisabledClass();
        this.updateTabIndex();
    }
    ngOnChanges(changes) {
        const { index, isDisabled } = changes;
        if (index || changes.isChecked || changes.isExpanded || changes.isSelected) {
            this.setAriaAttributes();
        }
        if (isDisabled) {
            this.setDisabledClass();
        }
        this.moveLookupItem(changes);
        this.moveNavigationItem(index);
        this.disableNavigationItem(isDisabled);
    }
    ngOnDestroy() {
        this.navigationService.unregisterItem(this.id, this.index);
        this.lookupService.unregisterItem(this.index, this.dataItem);
        this.subscriptions = this.subscriptions.reduce((list, callback) => (callback.unsubscribe(), list), []);
    }
    subscribe() {
        this.subscriptions = [
            this.navigationService.moves
                .subscribe(() => {
                this.updateTabIndex();
                this.focusItem();
            }),
            this.navigationService.expands
                .pipe(filter(({ index }) => index === this.index && !this.isDisabled))
                .subscribe(({ expand }) => this.expand(expand))
        ];
    }
    registerNavigationItem() {
        this.navigationService.registerItem(this.id, this.index, this.isDisabled);
        this.activateItem();
    }
    activateItem() {
        if (this.isDisabled) {
            return;
        }
        const navigationService = this.navigationService;
        const selectionService = this.selectionService;
        const index = this.index;
        selectionService.setFirstSelected(index, this.isSelected);
        if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
            navigationService.activateIndex(index);
        }
    }
    expand(shouldExpand) {
        this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
    }
    isFocusable() {
        return !this.isDisabled && this.navigationService.isFocusable(this.index);
    }
    focusItem() {
        if (this.isInitialized && this.navigationService.isActive(this.index)) {
            this.element.nativeElement.focus();
        }
    }
    moveLookupItem(changes = {}) {
        const { dataItem, index, parentDataItem, parentIndex } = changes;
        if ((index && index.firstChange) || //skip first change
            (!dataItem && !index && !parentDataItem && !parentIndex)) {
            return;
        }
        const oldIndex = (index || {}).previousValue || this.index;
        this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
    }
    moveNavigationItem(indexChange = {}) {
        const { currentValue, firstChange, previousValue } = indexChange;
        if (!firstChange && isPresent(currentValue) && isPresent(previousValue)) {
            this.navigationService.unregisterItem(this.id, previousValue);
            this.navigationService.registerItem(this.id, currentValue, this.isDisabled);
        }
    }
    disableNavigationItem(disableChange) {
        if (!disableChange || disableChange.firstChange) {
            return;
        }
        const service = this.navigationService;
        if (this.isDisabled) {
            service.activateClosest(this.index); //activate before unregister the item
        }
        else {
            service.activateFocusable();
        }
        service.unregisterItem(this.id, this.index);
        service.registerItem(this.id, this.index, this.isDisabled);
    }
    setAriaAttributes() {
        this.setAttribute('aria-level', this.ib.level(this.index).toString());
        this.setAttribute('aria-expanded', this.isExpanded.toString());
        this.setAttribute('aria-selected', this.isSelected.toString());
        this.setAttribute('aria-checked', this.ariaChecked);
    }
    setDisabledClass() {
        this.setClass('k-state-disabled', this.isDisabled);
    }
    setClass(className, toggle) {
        const action = toggle ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
    updateTabIndex() {
        this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
    }
    setAttribute(attr, value) {
        this.renderer.setAttribute(this.element.nativeElement, attr, value);
    }
}
TreeViewItemDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewItem]' },] },
];
/** @nocollapse */
TreeViewItemDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ExpandStateService },
    { type: NavigationService },
    { type: SelectionService },
    { type: TreeViewLookupService },
    { type: Renderer2 },
    { type: IndexBuilderService }
];
TreeViewItemDirective.propDecorators = {
    dataItem: [{ type: Input }],
    index: [{ type: Input }],
    parentDataItem: [{ type: Input }],
    parentIndex: [{ type: Input }],
    isChecked: [{ type: Input }],
    isDisabled: [{ type: Input }],
    isExpanded: [{ type: Input }],
    isSelected: [{ type: Input }]
};

/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
class TreeViewItemContentDirective {
    constructor(element, navigationService, selectionService, renderer) {
        this.element = element;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.renderer = renderer;
        this.initialSelection = false;
        this.subscriptions = new Subscription(() => { });
        this.subscriptions.add(this.navigationService.moves
            .subscribe(this.updateItem.bind(this)));
        this.subscriptions.add(this.navigationService.selects
            .pipe(filter((index) => index === this.index))
            .subscribe((index) => this.selectionService.select(index, this.dataItem)));
        this.subscriptions.add(this.selectionService.changes
            .subscribe(() => {
            this.updateSelection(this.isSelected(this.dataItem, this.index));
        }));
    }
    ngOnChanges(changes) {
        if (changes.initialSelection) {
            this.updateSelection(this.initialSelection);
        }
    }
    ngOnInit() {
        this.updateSelection(this.initialSelection);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    updateItem() {
        this.render(this.navigationService.isActive(this.index), 'k-state-focused');
    }
    updateSelection(selected) {
        this.render(selected, 'k-state-selected');
    }
    render(addClass, className) {
        const action = addClass ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
}
TreeViewItemContentDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewItemContent]' },] },
];
/** @nocollapse */
TreeViewItemContentDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NavigationService },
    { type: SelectionService },
    { type: Renderer2 }
];
TreeViewItemContentDirective.propDecorators = {
    dataItem: [{ type: Input }],
    index: [{ type: Input }],
    initialSelection: [{ type: Input }],
    isSelected: [{ type: Input }]
};

/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
class CheckBoxComponent {
    constructor(element, renderer, changeDetector) {
        this.element = element;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        /**
         * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
         */
        this.id = `_${guid()}`;
        /**
         * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabindex = 0;
        /**
         * Fires when the user changes the check state of the component.
         */
        this.checkStateChange = new EventEmitter();
        this.checkState = 'none';
    }
    //XXX: implement ComponentValueAccessor
    //XXX: focus/blur methods
    get classWrapper() { return true; }
    get indeterminate() {
        return this.checkState === 'indeterminate';
    }
    get checked() {
        return this.checkState === 'checked';
    }
    ngOnInit() {
        this.renderer.removeAttribute(this.element.nativeElement, "tabindex");
    }
    ngDoCheck() {
        this.checkState = this.isChecked(this.node, this.index);
    }
    handleChange(e) {
        const state = e.target.checked ? 'checked' : 'none';
        // update the View State so that Angular updates the input if the isChecked value is the same
        this.checkState = state;
        this.changeDetector.detectChanges();
        this.checkStateChange.emit(state);
    }
}
CheckBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-checkbox',
                template: `
        <input
            class="k-checkbox"
            type="checkbox"
            [id]="id"
            [checked]="checked"
            [indeterminate]="indeterminate"
            [tabindex]="tabindex"
            (change)="handleChange($event)"
        />
        <label
            class="k-checkbox-label"
            tabindex="-1"
            [for]="id"
        >{{labelText}}</label>
    `
            },] },
];
/** @nocollapse */
CheckBoxComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
CheckBoxComponent.propDecorators = {
    classWrapper: [{ type: HostBinding, args: ['class.k-checkbox-wrapper',] }],
    id: [{ type: Input }],
    isChecked: [{ type: Input }],
    node: [{ type: Input }],
    index: [{ type: Input }],
    labelText: [{ type: Input }],
    tabindex: [{ type: Input }],
    checkStateChange: [{ type: Output }]
};

const COMPONENT_DIRECTIVES = [
    CheckBoxComponent
];
/**
 * @hidden
 *
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the CheckBox component.
 */
class CheckBoxModule {
}
CheckBoxModule.decorators = [
    { type: NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES],
                exports: [COMPONENT_DIRECTIVES]
            },] },
];

const COMPONENT_DIRECTIVES$1 = [
    TreeViewComponent,
    TreeViewGroupComponent,
    TreeViewItemDirective,
    TreeViewItemContentDirective,
    NodeTemplateDirective,
    CheckDirective,
    DisableDirective,
    ExpandDirective,
    SelectDirective,
    HierarchyBindingDirective,
    LoadingIndicatorDirective,
    FlatDataBindingDirective
];
/**
 * @hidden
 */
class SharedModule {
}
SharedModule.decorators = [
    { type: NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES$1],
                exports: [COMPONENT_DIRECTIVES$1],
                imports: [CommonModule, CheckBoxModule]
            },] },
];

const EXPORTS = [
    TreeViewComponent,
    NodeTemplateDirective,
    CheckDirective,
    DisableDirective,
    ExpandDirective,
    SelectDirective,
    HierarchyBindingDirective,
    FlatDataBindingDirective
];
/**
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the TreeView component.
 */
class TreeViewModule {
}
TreeViewModule.decorators = [
    { type: NgModule, args: [{
                exports: [EXPORTS],
                imports: [SharedModule]
            },] },
];

/**
 * Generated bundle index. Do not edit.
 */

export { CheckBoxComponent, CheckBoxModule, DataChangeNotificationService, ExpandStateService, IndexBuilderService, LoadingIndicatorDirective, LoadingNotificationService, NavigationService, NodeChildrenService, SelectionService, SharedModule, TreeViewGroupComponent, TreeViewItemContentDirective, TreeViewItemDirective, TreeViewLookupService, TreeViewComponent, TreeViewModule, NodeTemplateDirective, CheckDirective, DisableDirective, ExpandDirective, SelectDirective, HierarchyBindingDirective, FlatDataBindingDirective };
