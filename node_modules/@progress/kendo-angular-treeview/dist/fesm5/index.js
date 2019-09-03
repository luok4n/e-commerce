import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, Injectable, Input, NgModule, NgZone, Optional, Output, Renderer2, TemplateRef } from '@angular/core';
import { Keys, guid, hasObservers, isChanged, isDocumentAvailable } from '@progress/kendo-angular-common';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { BehaviorSubject, EMPTY, Subject, Subscription, merge, of } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { catchError, delay, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { __assign } from 'tslib';

/**
 * @hidden
 */
var DataChangeNotificationService = /** @class */ (function () {
    function DataChangeNotificationService() {
        this.changes = new EventEmitter();
    }
    DataChangeNotificationService.prototype.notify = function () {
        this.changes.emit();
    };
    return DataChangeNotificationService;
}());

/**
 * @hidden
 */
var hasChildren = function () { return false; };
/**
 * @hidden
 */
var isChecked = function () { return 'none'; };
/**
 * @hidden
 */
var isDisabled = function () { return false; };
/**
 * @hidden
 */
var isExpanded = function () { return true; };
/**
 * @hidden
 */
var isSelected = function () { return false; };

/**
 * @hidden
 */
var ExpandStateService = /** @class */ (function () {
    function ExpandStateService() {
        this.changes = new Subject();
    }
    ExpandStateService.prototype.expand = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index, expand: true });
    };
    ExpandStateService.prototype.collapse = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index, expand: false });
    };
    ExpandStateService.decorators = [
        { type: Injectable },
    ];
    return ExpandStateService;
}());

/**
 * @hidden
 */
var IndexBuilderService = /** @class */ (function () {
    function IndexBuilderService() {
        this.INDEX_SEPARATOR = '_';
    }
    IndexBuilderService.prototype.nodeIndex = function (index, parentIndex) {
        if (index === void 0) { index = ''; }
        if (parentIndex === void 0) { parentIndex = ''; }
        return "" + parentIndex + (parentIndex ? this.INDEX_SEPARATOR : '') + index;
    };
    IndexBuilderService.prototype.indexForLevel = function (index, level) {
        return index.split(this.INDEX_SEPARATOR).slice(0, level).join(this.INDEX_SEPARATOR);
    };
    IndexBuilderService.prototype.lastLevelIndex = function (index) {
        if (index === void 0) { index = ''; }
        var parts = index.split(this.INDEX_SEPARATOR);
        if (!parts.length) {
            return NaN;
        }
        return parseInt(parts[parts.length - 1], 10);
    };
    IndexBuilderService.prototype.level = function (index) {
        return index.split(this.INDEX_SEPARATOR).length;
    };
    IndexBuilderService.decorators = [
        { type: Injectable },
    ];
    return IndexBuilderService;
}());

/**
 * @hidden
 */
var LoadingNotificationService = /** @class */ (function () {
    function LoadingNotificationService() {
        this.changes = new Subject();
    }
    LoadingNotificationService.prototype.notifyLoaded = function (index) {
        this.changes.next(index);
    };
    LoadingNotificationService.decorators = [
        { type: Injectable },
    ];
    return LoadingNotificationService;
}());

var focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
/**
 * @hidden
 */
var match = function (element, selector) {
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
/**
 * @hidden
 */
var noop = function () { };
/**
 * @hidden
 */
var isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
var isBlank = function (value) { return value === null || value === undefined; };
/**
 * @hidden
 */
var isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
var isNullOrEmptyString = function (value) { return isBlank(value) || value.trim().length === 0; };
/**
 * @hidden
 */
var closestNode = function (element) {
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
var isFocusable = function (element) {
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
var isContent = function (element) {
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
var closest = function (node, predicate) {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }
    return node;
};
/**
 * @hidden
 */
var hasParent = function (element, container) {
    return Boolean(closest(element, function (node) { return node === container; }));
};
/**
 * @hidden
 */
var focusableNode = function (element) { return element.nativeElement.querySelector('li[tabindex="0"]'); };
/**
 * @hidden
 */

/**
 * @hidden
 */
var nodeId = function (node) { return node ? node.getAttribute('data-treeindex') : ''; };
/**
 * @hidden
 */
var nodeIndex = function (item) { return (item || {}).index; };

var last = function (list) { return list[list.length - 1]; };
var safe = function (node) { return (node || {}); };
var safeChildren = function (node) { return (safe(node).children || []); };
var findLast = function (node) {
    var lastNode = node;
    var children = [].concat(safeChildren(node));
    while (children.length) {
        children = children.concat(safeChildren(last(children)));
        lastNode = children.shift();
    }
    return lastNode;
};
/**
 * @hidden
 */
var NavigationModel = /** @class */ (function () {
    function NavigationModel() {
        this.ib = new IndexBuilderService();
        this.nodes = [];
    }
    NavigationModel.prototype.firstNode = function () {
        return this.nodes[0] || null;
    };
    NavigationModel.prototype.lastNode = function () {
        var node = this.nodes[this.nodes.length - 1];
        if (!node) {
            return null;
        }
        return findLast(last(this.container(node))) || node;
    };
    NavigationModel.prototype.closestNode = function (index) {
        var prev = safe(this.findNode(index)).prev;
        var sibling = prev || this.firstNode();
        return safe(sibling).index === index ? this.sibling(sibling, 1) : sibling;
    };
    NavigationModel.prototype.findNode = function (index) {
        return this.find(index, this.nodes);
    };
    NavigationModel.prototype.findParent = function (index) {
        var parentLevel = this.ib.level(index) - 1;
        return this.findNode(this.ib.indexForLevel(index, parentLevel));
    };
    NavigationModel.prototype.findChild = function (index) {
        return safeChildren(this.findNode(index))[0] || null;
    };
    NavigationModel.prototype.findPrev = function (item) {
        var index = item.index;
        var parent = this.findParent(index);
        var levelIndex = this.ib.lastLevelIndex(index);
        if (levelIndex === 0) {
            return parent;
        }
        var currentNode = this.findNode(index);
        var prev = this.sibling(currentNode, -1);
        if (prev) {
            var children = this.container(prev);
            while (children.length > 0) {
                prev = last(children);
                children = this.container(prev);
            }
        }
        return prev;
    };
    NavigationModel.prototype.findNext = function (item) {
        var children = this.container(item);
        if (children.length === 0) {
            return this.sibling(item, 1);
        }
        return children[0];
    };
    NavigationModel.prototype.registerItem = function (id, index, disabled) {
        var children = [];
        var level = this.ib.level(index);
        var parent = this.findParent(index);
        if (parent || level === 1) {
            var node = { id: id, children: children, index: index, parent: parent, disabled: disabled };
            this.insert(node, parent);
        }
    };
    NavigationModel.prototype.unregisterItem = function (id, index) {
        var node = this.find(index, this.nodes);
        if (!node || node.id !== id) {
            return;
        }
        var children = this.container(node.parent);
        children.splice(children.indexOf(node), 1);
    };
    NavigationModel.prototype.childLevel = function (nodes) {
        var children = nodes.filter(function (node) { return isPresent(node); });
        if (!children || !children.length) {
            return 1;
        }
        return this.ib.level(children[0].index);
    };
    NavigationModel.prototype.container = function (node) {
        return node ? node.children : this.nodes;
    };
    NavigationModel.prototype.find = function (index, nodes) {
        var childLevel = this.childLevel(nodes);
        var indexToMatch = this.ib.indexForLevel(index, childLevel);
        var isLeaf = childLevel === this.ib.level(index);
        var node = nodes.find(function (n) { return n && n.index === indexToMatch; });
        if (!node) {
            return null;
        }
        return isLeaf ? node : this.find(index, node.children);
    };
    NavigationModel.prototype.insert = function (node, parent) {
        var nodes = this.container(parent);
        nodes.splice(this.ib.lastLevelIndex(node.index), 0, node);
    };
    NavigationModel.prototype.sibling = function (node, offset) {
        if (!node) {
            return null;
        }
        var parent = this.findParent(node.index);
        var container = this.container(parent);
        return container[container.indexOf(node) + offset] || this.sibling(parent, offset) || null;
    };
    return NavigationModel;
}());

/**
 * @hidden
 */
var NavigationService = /** @class */ (function () {
    function NavigationService(localization) {
        var _a;
        var _this = this;
        this.localization = localization;
        this.expands = new Subject();
        this.moves = new Subject();
        this.checks = new Subject();
        this.selects = new Subject();
        this.navigable = true;
        this.actions = (_a = {}, _a[Keys.ArrowUp] = function () { return _this.activate(_this.model.findPrev(_this.focusableItem)); }, _a[Keys.ArrowDown] = function () { return _this.activate(_this.model.findNext(_this.focusableItem)); }, _a[Keys.ArrowLeft] = function () { return (_this.expand({
                expand: _this.localization.rtl,
                intercept: _this.localization.rtl ? _this.moveToChild : _this.moveToParent
            })); }, _a[Keys.ArrowRight] = function () { return (_this.expand({
                expand: !_this.localization.rtl,
                intercept: _this.localization.rtl ? _this.moveToParent : _this.moveToChild
            })); }, _a[Keys.Home] = function () { return _this.activate(_this.model.firstNode()); }, _a[Keys.End] = function () { return _this.activate(_this.model.lastNode()); }, _a[Keys.Enter] = function () { return _this.navigable && _this.selectIndex(nodeIndex(_this.activeItem)); }, _a[Keys.Space] = function () { return _this.navigable && _this.checkIndex(nodeIndex(_this.activeItem)); }, _a);
        this.isFocused = false;
        this._model = new NavigationModel();
        this.moveToChild = this.moveToChild.bind(this);
        this.moveToParent = this.moveToParent.bind(this);
    }
    Object.defineProperty(NavigationService.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            this._model = model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "activeIndex", {
        get: function () {
            return nodeIndex(this.activeItem) || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "focusableItem", {
        get: function () {
            return this.activeItem || this.model.firstNode();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "isActiveExpanded", {
        get: function () {
            return this.activeItem && this.activeItem.children.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    NavigationService.prototype.activate = function (item) {
        if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
            return;
        }
        this.isFocused = true;
        this.activeItem = item || this.activeItem;
        this.notifyMove();
    };
    NavigationService.prototype.activateParent = function (index) {
        this.activate(this.model.findParent(index));
    };
    NavigationService.prototype.activateIndex = function (index) {
        if (!index) {
            return;
        }
        this.activate(this.model.findNode(index));
    };
    NavigationService.prototype.activateClosest = function (index) {
        if (!index || nodeIndex(this.focusableItem) !== index) {
            return;
        }
        this.activeItem = this.model.closestNode(index);
        this.notifyMove();
    };
    NavigationService.prototype.activateFocusable = function () {
        if (this.activeItem) {
            return;
        }
        this.activeItem = this.model.firstNode();
        this.notifyMove();
    };
    NavigationService.prototype.deactivate = function () {
        if (!this.navigable || !this.isFocused) {
            return;
        }
        this.isFocused = false;
        this.notifyMove();
    };
    NavigationService.prototype.checkIndex = function (index) {
        if (!this.isDisabled(index)) {
            this.checks.next(index);
        }
    };
    NavigationService.prototype.selectIndex = function (index) {
        if (!this.isDisabled(index)) {
            this.selects.next(index);
        }
    };
    NavigationService.prototype.isActive = function (index) {
        if (!index) {
            return false;
        }
        return this.isFocused && this.activeIndex === index;
    };
    NavigationService.prototype.isFocusable = function (index) {
        return nodeIndex(this.focusableItem) === index;
    };
    NavigationService.prototype.isDisabled = function (index) {
        return this.model.findNode(index).disabled;
    };
    NavigationService.prototype.registerItem = function (id, index, disabled) {
        this.model.registerItem(id, index, disabled);
    };
    NavigationService.prototype.unregisterItem = function (id, index) {
        if (this.isActive(index)) {
            this.activateParent(index);
        }
        this.model.unregisterItem(id, index);
    };
    NavigationService.prototype.move = function (e) {
        if (!this.navigable) {
            return;
        }
        var moveAction = this.actions[e.keyCode];
        if (!moveAction) {
            return;
        }
        moveAction();
        e.preventDefault();
    };
    NavigationService.prototype.expand = function (_a) {
        var expand = _a.expand, intercept = _a.intercept;
        var index = nodeIndex(this.activeItem);
        if (!index || intercept(index)) {
            return;
        }
        this.notifyExpand(expand);
    };
    NavigationService.prototype.moveToParent = function () {
        if (this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findParent(nodeIndex(this.activeItem)));
        return true;
    };
    NavigationService.prototype.moveToChild = function () {
        if (!this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findChild(nodeIndex(this.activeItem)));
        return true;
    };
    NavigationService.prototype.notifyExpand = function (expand) {
        this.expands.next(this.navigationState(expand));
    };
    NavigationService.prototype.notifyMove = function () {
        this.moves.next(this.navigationState());
    };
    NavigationService.prototype.navigationState = function (expand) {
        if (expand === void 0) { expand = false; }
        return ({ expand: expand, index: nodeIndex(this.activeItem), isFocused: this.isFocused });
    };
    NavigationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NavigationService.ctorParameters = function () { return [
        { type: LocalizationService }
    ]; };
    return NavigationService;
}());

/**
 * @hidden
 */
var NodeChildrenService = /** @class */ (function () {
    function NodeChildrenService() {
        this.changes = new Subject();
    }
    NodeChildrenService.prototype.childrenLoaded = function (item, children) {
        this.changes.next({ item: item, children: children });
    };
    NodeChildrenService.decorators = [
        { type: Injectable },
    ];
    return NodeChildrenService;
}());

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
var NodeTemplateDirective = /** @class */ (function () {
    function NodeTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    NodeTemplateDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[kendoTreeViewNodeTemplate]'
                },] },
    ];
    /** @nocollapse */
    NodeTemplateDirective.ctorParameters = function () { return [
        { type: TemplateRef, decorators: [{ type: Optional }] }
    ]; };
    return NodeTemplateDirective;
}());

/**
 * @hidden
 */
var SelectionService = /** @class */ (function () {
    function SelectionService() {
        this.changes = new Subject();
    }
    SelectionService.prototype.isFirstSelected = function (index) {
        return this.firstIndex === index;
    };
    SelectionService.prototype.setFirstSelected = function (index, selected) {
        if (this.firstIndex === index && selected === false) {
            this.firstIndex = null;
        }
        else if (!this.firstIndex && selected) {
            this.firstIndex = index;
        }
    };
    SelectionService.prototype.select = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index });
    };
    SelectionService.decorators = [
        { type: Injectable },
    ];
    return SelectionService;
}());

var INDEX_REGEX = /\d+$/;
/**
 * @hidden
 */
var TreeViewLookupService = /** @class */ (function () {
    function TreeViewLookupService() {
        this.map = new Map();
    }
    TreeViewLookupService.prototype.registerItem = function (item, parent) {
        var currentLookup = {
            children: [],
            item: item,
            parent: this.item(nodeIndex(parent))
        };
        this.map.set(item.index, currentLookup);
    };
    TreeViewLookupService.prototype.registerChildren = function (index, children) {
        var item = this.item(index);
        if (!item) {
            return;
        }
        item.children = children;
    };
    TreeViewLookupService.prototype.unregisterItem = function (index, dataItem) {
        var current = this.item(index);
        if (current && current.item.dataItem === dataItem) {
            this.map.delete(index);
            if (current.parent && current.parent.children) {
                current.parent.children = current.parent.children.filter(function (item) { return item.dataItem !== dataItem; });
            }
        }
    };
    TreeViewLookupService.prototype.replaceItem = function (index, item, parent) {
        if (!item) {
            return;
        }
        this.unregisterItem(index, item.dataItem);
        this.registerItem(item, parent);
        this.addToParent(item, parent);
    };
    TreeViewLookupService.prototype.itemLookup = function (index) {
        var item = this.item(index);
        if (!item) {
            return null;
        }
        return {
            children: this.mapChildren(item.children),
            item: item.item,
            parent: item.parent
        };
    };
    TreeViewLookupService.prototype.hasItem = function (index) {
        return this.map.has(index);
    };
    TreeViewLookupService.prototype.item = function (index) {
        return this.map.get(index) || null;
    };
    TreeViewLookupService.prototype.addToParent = function (item, parent) {
        if (parent) {
            var parentItem = this.item(parent.index);
            var index = parseInt(INDEX_REGEX.exec(item.index)[0], 10);
            parentItem.children = parentItem.children || [];
            parentItem.children.splice(index, 0, item);
        }
    };
    TreeViewLookupService.prototype.mapChildren = function (children) {
        var _this = this;
        if (children === void 0) { children = []; }
        return children.map(function (c) {
            var _a = _this.item(c.index), item = _a.item, parent = _a.parent, children = _a.children;
            return {
                children: _this.mapChildren(children),
                item: item,
                parent: parent
            };
        });
    };
    TreeViewLookupService.decorators = [
        { type: Injectable },
    ];
    return TreeViewLookupService;
}());

var providers = [
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
var TreeViewComponent = /** @class */ (function () {
    function TreeViewComponent(expandService, navigationService, nodeChildrenService, selectionService, treeViewLookupService, ngZone, renderer, element, dataChangeNotification, localization) {
        var _this = this;
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
        this.fetchNodes = function () { return _this.data; };
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
        this.children = function () { return of([]); };
        this.checkboxes = false;
        this.expandIcons = false;
        this.isActive = false;
        this.data = new BehaviorSubject([]);
        this._animate = true;
        this.subscriptions = new Subscription(function () { });
        this.domSubscriptions = [];
    }
    Object.defineProperty(TreeViewComponent.prototype, "role", {
        get: function () { return 'tree'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "direction", {
        /** @hidden */
        get: function () {
            return this.localization.rtl ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "animate", {
        get: function () {
            return !this._animate;
        },
        /**
         * Determines whether the content animation is enabled.
         */
        set: function (value) {
            this._animate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "nodes", {
        /**
         * The nodes which will be displayed by the TreeView
         * ([see example]({% slug databinding_treeview %})).
         */
        set: function (value) {
            this.dataChangeNotification.notify();
            this.data.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "hasChildren", {
        /**
         * A function which determines if a specific node has child nodes
         * ([see example]({% slug databinding_treeview %})).
         */
        get: function () {
            return this._hasChildren || hasChildren;
        },
        set: function (callback) {
            this._hasChildren = callback;
            this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "isChecked", {
        /**
         * A function which determines if a specific node is selected
         * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
         */
        get: function () {
            return this._isChecked || isChecked;
        },
        set: function (callback) {
            this._isChecked = callback;
            this.checkboxes = Boolean(this._isChecked);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "isExpanded", {
        /**
         * A function which determines if a specific node is expanded.
         */
        get: function () {
            return this._isExpanded || isExpanded;
        },
        set: function (callback) {
            this._isExpanded = callback;
            this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewComponent.prototype, "isSelected", {
        /**
         * A function which determines if a specific node is selected
         * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
         */
        get: function () {
            return this._isSelected || isSelected;
        },
        set: function (callback) {
            this._isSelected = callback;
        },
        enumerable: true,
        configurable: true
    });
    TreeViewComponent.prototype.ngOnChanges = function (_) {
        this.navigationService.navigable = Boolean(this.navigable);
    };
    TreeViewComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
        this.domSubscriptions.forEach(function (subscription) { return subscription(); });
    };
    TreeViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.add(this.nodeChildrenService
            .changes
            .subscribe(function (x) { return _this.childrenLoaded.emit(x); }));
        this.subscriptions.add(this.expandService.changes
            .subscribe(function (_a) {
            var index = _a.index, dataItem = _a.dataItem, expand = _a.expand;
            return expand
                ? _this.expand.emit({ index: index, dataItem: dataItem })
                : _this.collapse.emit({ index: index, dataItem: dataItem });
        }));
        this.subscriptions.add(this.navigationService.checks
            .subscribe(function (x) {
            return _this.checkedChange.emit(_this.treeViewLookupService.itemLookup(x));
        }));
        this.subscriptions.add(this.selectionService.changes
            .subscribe(function (x) {
            if (hasObservers(_this.selectionChange)) {
                _this.ngZone.run(function () {
                    _this.selectionChange.emit(x);
                });
            }
        }));
        if (this.element) {
            this.ngZone.runOutsideAngular(function () {
                _this.attachDomHandlers();
            });
        }
    };
    /**
     * Blurs the focused TreeView item.
     */
    TreeViewComponent.prototype.blur = function () {
        if (!isDocumentAvailable()) {
            return;
        }
        var target = focusableNode(this.element);
        if (document.activeElement === target) {
            target.blur();
        }
    };
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
    TreeViewComponent.prototype.focus = function (index) {
        this.navigationService.activateIndex(index);
        var target = focusableNode(this.element);
        if (target) {
            target.focus();
        }
    };
    /**
     * Based on the specified index, returns the TreeItemLookup node.
     *
     * @param index - The index of the node.
     * @returns {TreeItemLookup} - The item that was searched (looked up).
     */
    TreeViewComponent.prototype.itemLookup = function (index) {
        return this.treeViewLookupService.itemLookup(index);
    };
    /**
     * @hidden
     */
    TreeViewComponent.prototype.isDisabledNode = function (node) {
        return this.navigationService.isDisabled(node.item.index);
    };
    TreeViewComponent.prototype.attachDomHandlers = function () {
        var element = this.element.nativeElement;
        this.clickHandler = this.clickHandler.bind(this);
        this.domSubscriptions.push(this.renderer.listen(element, 'contextmenu', this.clickHandler), this.renderer.listen(element, 'click', this.clickHandler), this.renderer.listen(element, 'dblclick', this.clickHandler), this.renderer.listen(element, 'focusin', this.focusHandler.bind(this)), this.renderer.listen(element, 'focusout', this.blurHandler.bind(this)), this.renderer.listen(element, 'keydown', this.keydownHandler.bind(this)));
    };
    TreeViewComponent.prototype.focusHandler = function (e) {
        var _this = this;
        var focusItem;
        if (match(e.target, '.k-treeview-item')) {
            focusItem = e.target;
        }
        else if (!isFocusable(e.target)) { // with compliments to IE
            focusItem = closestNode(e.target);
        }
        if (focusItem) {
            this.navigationService.activateIndex(nodeId(e.target));
            if (!this.isActive && hasObservers(this.onFocus)) {
                this.ngZone.run(function () {
                    _this.onFocus.emit();
                });
            }
            this.isActive = true;
        }
    };
    TreeViewComponent.prototype.blurHandler = function (e) {
        var _this = this;
        if (this.isActive && match(e.target, '.k-treeview-item') &&
            (!e.relatedTarget || !match(e.relatedTarget, '.k-treeview-item') || !hasParent(e.relatedTarget, this.element.nativeElement))) {
            this.navigationService.deactivate();
            this.isActive = false;
            if (hasObservers(this.onBlur)) {
                this.ngZone.run(function () {
                    _this.onBlur.emit();
                });
            }
        }
    };
    TreeViewComponent.prototype.clickHandler = function (e) {
        var _this = this;
        var target = e.target;
        if ((e.type === 'contextmenu' && !hasObservers(this.nodeClick)) ||
            (e.type === 'click' && !hasObservers(this.nodeClick) && !hasObservers(this.selectionChange)) ||
            (e.type === 'dblclick' && !hasObservers(this.nodeDblClick)) || isFocusable(target) ||
            !isContent(target) || !hasParent(target, this.element.nativeElement)) {
            return;
        }
        var index = nodeId(closestNode(target));
        // the disabled check is probably not needed due to the k-state-disabled styles
        if (!index || this.navigationService.isDisabled(index)) {
            return;
        }
        this.ngZone.run(function () {
            var lookup = _this.treeViewLookupService.itemLookup(index);
            if (e.type === 'click') {
                _this.navigationService.selectIndex(index);
            }
            var emitter = e.type === 'dblclick' ? _this.nodeDblClick : _this.nodeClick;
            emitter.emit({
                item: lookup.item,
                originalEvent: e,
                type: e.type
            });
        });
    };
    TreeViewComponent.prototype.keydownHandler = function (e) {
        var _this = this;
        if (this.isActive && this.navigable) {
            this.ngZone.run(function () {
                _this.navigationService.move(e);
            });
        }
    };
    TreeViewComponent.decorators = [
        { type: Component, args: [{
                    changeDetection: ChangeDetectionStrategy.Default,
                    exportAs: 'kendoTreeView',
                    providers: providers,
                    selector: 'kendo-treeview',
                    template: "\n    <ul class=\"k-treeview-lines\"\n      kendoTreeViewGroup\n      role=\"group\"\n      [checkboxes]=\"checkboxes\"\n      [expandIcons]=\"expandIcons\"\n      [children]=\"children\"\n      [hasChildren]=\"hasChildren\"\n      [isChecked]=\"isChecked\"\n      [isDisabled]=\"isDisabled\"\n      [isExpanded]=\"isExpanded\"\n      [isSelected]=\"isSelected\"\n      [nodeTemplateRef]=\"nodeTemplate?.templateRef\"\n      [textField]=\"textField\"\n      [nodes]=\"fetchNodes\"\n      >\n    </ul>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeViewComponent.ctorParameters = function () { return [
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
    ]; };
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
    return TreeViewComponent;
}());

var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
var getterCache = {};
// tslint:disable-next-line:no-string-literal
getterCache['undefined'] = function (obj) { return obj; };
/**
 * @hidden
 */
var getter = function (field, safe) {
    var key = field + safe;
    if (getterCache[key]) {
        return getterCache[key];
    }
    var fields = [];
    field.replace(FIELD_REGEX, function (_, index, indexAccessor, field) {
        fields.push(isPresent(index) ? index : (indexAccessor || field));
        return undefined;
    });
    getterCache[key] = function (obj) {
        var result = obj;
        for (var idx = 0; idx < fields.length; idx++) {
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
var TreeViewGroupComponent = /** @class */ (function () {
    function TreeViewGroupComponent(expandService, loadingService, indexBuilder, treeViewLookupService, navigationService, nodeChildrenService, dataChangeNotification) {
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
        this.isChecked = function () { return 'none'; };
        this.isDisabled = function () { return false; };
        this.isExpanded = function () { return false; };
        this.isSelected = function () { return false; };
        this.children = function () { return of([]); };
        this.hasChildren = function () { return false; };
    }
    Object.defineProperty(TreeViewGroupComponent.prototype, "role", {
        get: function () { return 'group'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewGroupComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
            var mappedChildren = this.mapToTreeItem(data);
            this.setNodeChildren(mappedChildren);
            this.emitChildrenLoaded(mappedChildren);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewGroupComponent.prototype, "hasTemplate", {
        get: function () {
            return isPresent(this.nodeTemplateRef);
        },
        enumerable: true,
        configurable: true
    });
    TreeViewGroupComponent.prototype.expandNode = function (index, dataItem, expand) {
        if (expand) {
            this.expandService.expand(index, dataItem);
        }
        else {
            this.expandService.collapse(index, dataItem);
        }
    };
    TreeViewGroupComponent.prototype.checkNode = function (index) {
        this.navigationService.checkIndex(index);
        this.navigationService.activateIndex(index);
    };
    TreeViewGroupComponent.prototype.nodeIndex = function (index) {
        return this.indexBuilder.nodeIndex(index.toString(), this.parentIndex);
    };
    TreeViewGroupComponent.prototype.nodeText = function (dataItem) {
        var textField = isArray(this.textField) ? this.textField[0] : this.textField;
        return getter(textField, true)(dataItem);
    };
    TreeViewGroupComponent.prototype.ngOnDestroy = function () {
        if (this.nodesSubscription) {
            this.nodesSubscription.unsubscribe();
        }
        if (this.dataChangeSubscription) {
            this.dataChangeSubscription.unsubscribe();
        }
    };
    TreeViewGroupComponent.prototype.ngOnInit = function () {
        this.subscribeToNodesChange();
        this.dataChangeSubscription = this.dataChangeNotification
            .changes
            .subscribe(this.subscribeToNodesChange.bind(this));
    };
    TreeViewGroupComponent.prototype.ngOnChanges = function (changes) {
        if (changes.parentIndex) {
            this.setNodeChildren(this.mapToTreeItem(this.data));
        }
    };
    TreeViewGroupComponent.prototype.fetchChildren = function (node, index) {
        var _this = this;
        return this.children(node)
            .pipe(catchError(function () {
            _this.loadingService.notifyLoaded(index);
            return EMPTY;
        }), tap(function () { return _this.loadingService.notifyLoaded(index); }));
    };
    Object.defineProperty(TreeViewGroupComponent.prototype, "nextFields", {
        get: function () {
            if (isArray(this.textField)) {
                return this.textField.length > 1 ? this.textField.slice(1) : this.textField;
            }
            return [this.textField];
        },
        enumerable: true,
        configurable: true
    });
    TreeViewGroupComponent.prototype.setNodeChildren = function (children) {
        this.treeViewLookupService.registerChildren(this.parentIndex, children);
    };
    TreeViewGroupComponent.prototype.mapToTreeItem = function (data) {
        var _this = this;
        if (!this.parentIndex) {
            return [];
        }
        return data.map(function (dataItem, idx) { return ({ dataItem: dataItem, index: _this.nodeIndex(idx) }); });
    };
    TreeViewGroupComponent.prototype.emitChildrenLoaded = function (children) {
        if (!this.parentIndex) {
            return;
        }
        this.nodeChildrenService.childrenLoaded({ dataItem: this.parentDataItem, index: this.parentIndex }, children);
    };
    TreeViewGroupComponent.prototype.subscribeToNodesChange = function () {
        var _this = this;
        if (this.nodesSubscription) {
            this.nodesSubscription.unsubscribe();
        }
        this.nodesSubscription = this.nodes(this.parentDataItem, this.parentIndex).subscribe(function (x) { _this.data = x; });
    };
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
                    template: "\n        <li\n            *ngFor=\"let node of data; let index = index\" class=\"k-item k-treeview-item\"\n            kendoTreeViewItem\n            [dataItem]=\"node\"\n            [index]=\"nodeIndex(index)\"\n            [parentDataItem]=\"parentDataItem\"\n            [parentIndex]=\"parentIndex\"\n            [isChecked]=\"isChecked(node, nodeIndex(index))\"\n            [isDisabled]=\"disabled || isDisabled(node, nodeIndex(index))\"\n            [isExpanded]=\"isExpanded(node, nodeIndex(index))\"\n            [isSelected]=\"isSelected(node, nodeIndex(index))\"\n            [attr.data-treeindex]=\"nodeIndex(index)\"\n        >\n            <div class=\"k-mid\">\n                <span\n                    class=\"k-icon\"\n                    [class.k-i-collapse]=\"isExpanded(node, nodeIndex(index))\"\n                    [class.k-i-expand]=\"!isExpanded(node, nodeIndex(index))\"\n                    [kendoTreeViewLoading]=\"nodeIndex(index)\"\n                    (click)=\"expandNode(nodeIndex(index), node, !isExpanded(node, nodeIndex(index)))\"\n                    *ngIf=\"expandIcons && hasChildren(node)\"\n                    >\n                </span>\n                <kendo-checkbox\n                    *ngIf=\"checkboxes\"\n                    [node]=\"node\"\n                    [index]=\"nodeIndex(index)\"\n                    [isChecked]=\"isChecked\"\n                    (checkStateChange)=\"checkNode(nodeIndex(index))\"\n                    tabindex=\"-1\"\n                ></kendo-checkbox>\n                <span kendoTreeViewItemContent\n                    [attr.data-treeindex]=\"nodeIndex(index)\"\n                    [dataItem]=\"node\"\n                    [index]=\"nodeIndex(index)\"\n                    [initialSelection]=\"isSelected(node, nodeIndex(index))\"\n                    [isSelected]=\"isSelected\"\n                    class=\"k-in\"\n                >\n                    <ng-container [ngSwitch]=\"hasTemplate\">\n                        <ng-container *ngSwitchCase=\"true\">\n                            <ng-template\n                                [ngTemplateOutlet]=\"nodeTemplateRef\" [ngTemplateOutletContext]=\"{$implicit: node, index: nodeIndex(index)}\"\n                                >\n                            </ng-template>\n                        </ng-container>\n                        <ng-container *ngSwitchDefault>\n                            {{nodeText(node)}}\n                        </ng-container>\n                    </ng-container>\n                </span>\n            </div>\n            <ul\n                *ngIf=\"isExpanded(node, nodeIndex(index)) && hasChildren(node)\"\n                kendoTreeViewGroup\n                role=\"group\"\n                [nodes]=\"fetchChildren\"\n                [checkboxes]=\"checkboxes\"\n                [expandIcons]=\"expandIcons\"\n                [children]=\"children\"\n                [hasChildren]=\"hasChildren\"\n                [isChecked]=\"isChecked\"\n                [isDisabled]=\"isDisabled\"\n                [disabled]=\"disabled || isDisabled(node, nodeIndex(index))\"\n                [isExpanded]=\"isExpanded\"\n                [isSelected]=\"isSelected\"\n                [nodeTemplateRef]=\"nodeTemplateRef\"\n                [parentIndex]=\"nodeIndex(index)\"\n                [parentDataItem]=\"node\"\n                [textField]=\"nextFields\"\n                [@toggle]=\"true\"\n                >\n            </ul>\n        </li>\n    "
                },] },
    ];
    /** @nocollapse */
    TreeViewGroupComponent.ctorParameters = function () { return [
        { type: ExpandStateService },
        { type: LoadingNotificationService },
        { type: IndexBuilderService },
        { type: TreeViewLookupService },
        { type: NavigationService },
        { type: NodeChildrenService },
        { type: DataChangeNotificationService }
    ]; };
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
    return TreeViewGroupComponent;
}());

var indexChecked = function (keys, index) { return keys.filter(function (k) { return k === index; }).length > 0; };
var matchKey = function (index) { return function (k) {
    if (index === k) {
        return true;
    }
    if (!k.split) {
        return false;
    }
    return k.split('_').reduce(function (_a, part) {
        var key = _a.key, result = _a.result;
        key += part;
        if (index === key || result) {
            return { result: true };
        }
        key += "_";
        return { key: key, result: false };
    }, { key: "", result: false }).result;
}; };
/**
 * A directive which manages the in-memory checked state of the TreeView node
 * ([see example]({% slug checkboxes_treeview %})).
 */
var CheckDirective = /** @class */ (function () {
    function CheckDirective(treeView, zone) {
        var _this = this;
        this.treeView = treeView;
        this.zone = zone;
        /**
         * Fires when the `checkedKeys` collection was updated.
         */
        this.checkedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(function () { });
        this.checkActions = {
            'multiple': function (e) { return _this.checkMultiple(e); },
            'single': function (e) { return _this.checkSingle(e); }
        };
        this._checkedKeys = [];
        this.subscriptions.add(this.treeView.checkedChange
            .subscribe(function (e) { return _this.check(e); }));
        this.subscriptions.add(this.treeView.childrenLoaded
            .pipe(filter(function () { return _this.options.checkChildren; }), switchMap(function (e) { return _this.zone.onStable.pipe(take(1), map(function () { return e; })); }))
            .subscribe(function (e) { return _this.addChildrenKeys(e); }));
        this.treeView.isChecked = this.isItemChecked.bind(this);
    }
    Object.defineProperty(CheckDirective.prototype, "isChecked", {
        /**
         * @hidden
         */
        set: function (value) {
            this.treeView.isChecked = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckDirective.prototype, "checkedKeys", {
        /**
         * Defines the collection that will store the checked keys
         * ([see example]({% slug checkboxes_treeview %})).
         */
        get: function () {
            return this._checkedKeys;
        },
        set: function (keys) {
            this._checkedKeys = keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckDirective.prototype, "options", {
        get: function () {
            var defaultOptions = {
                checkChildren: true,
                checkParents: true,
                enabled: true,
                mode: "multiple"
            };
            if (!isPresent(this.checkable)) {
                return defaultOptions;
            }
            var isBoolean = typeof this.checkable === 'boolean';
            var checkSettings = isBoolean
                ? { enabled: this.checkable }
                : this.checkable;
            return Object.assign(defaultOptions, checkSettings);
        },
        enumerable: true,
        configurable: true
    });
    CheckDirective.prototype.ngOnChanges = function (changes) {
        if (changes.checkable) {
            this.treeView.checkboxes = this.options.enabled;
            this.toggleCheckOnClick();
        }
    };
    CheckDirective.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
        this.unsubscribeClick();
    };
    CheckDirective.prototype.isItemChecked = function (dataItem, index) {
        if (!this.checkKey) {
            return this.isIndexChecked(index);
        }
        var keyIndex = this.checkedKeys.indexOf(this.itemKey({ dataItem: dataItem, index: index }));
        return keyIndex > -1 ? 'checked' : 'none';
    };
    CheckDirective.prototype.isIndexChecked = function (index) {
        var checkedKeys = this.checkedKeys.filter(matchKey(index));
        if (indexChecked(checkedKeys, index)) {
            return 'checked';
        }
        var _a = this.options, mode = _a.mode, checkParents = _a.checkParents;
        if (mode === 'multiple' && checkParents && checkedKeys.length) {
            return 'indeterminate';
        }
        return 'none';
    };
    CheckDirective.prototype.itemKey = function (e) {
        if (!this.checkKey) {
            return e.index;
        }
        if (typeof this.checkKey === "string") {
            return e.dataItem[this.checkKey];
        }
        if (typeof this.checkKey === "function") {
            return this.checkKey(e);
        }
    };
    CheckDirective.prototype.check = function (e) {
        var _a = this.options, enabled = _a.enabled, mode = _a.mode;
        var performSelection = this.checkActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    };
    CheckDirective.prototype.checkSingle = function (node) {
        var key = this.itemKey(node.item);
        this.checkedKeys = this.checkedKeys[0] !== key ? [key] : [];
        this.notify();
    };
    CheckDirective.prototype.checkMultiple = function (node) {
        this.checkNode(node);
        if (this.options.checkParents) {
            this.checkParents(node.parent);
        }
        this.notify();
    };
    CheckDirective.prototype.toggleCheckOnClick = function () {
        var _this = this;
        this.unsubscribeClick();
        if (this.options.checkOnClick) {
            this.clickSubscription = this.treeView.nodeClick.subscribe(function (args) {
                if (args.type === 'click') {
                    var lookup = _this.treeView.itemLookup(args.item.index);
                    _this.check(lookup);
                }
            });
        }
    };
    CheckDirective.prototype.unsubscribeClick = function () {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
    };
    CheckDirective.prototype.checkNode = function (node, check) {
        var _this = this;
        var key = this.itemKey(node.item);
        var idx = this.checkedKeys.indexOf(key);
        var isChecked = idx > -1;
        var shouldCheck = check === undefined ? !isChecked : check;
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
            node.children.map(function (n) { return _this.checkNode(n, shouldCheck); });
        }
    };
    CheckDirective.prototype.checkParents = function (parent) {
        var currentParent = parent;
        while (currentParent) {
            var parentKey = this.itemKey(currentParent.item);
            var parentIndex = this.checkedKeys.indexOf(parentKey);
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
    };
    CheckDirective.prototype.allChildrenSelected = function (children) {
        var _this = this;
        var isCheckedReducer = function (acc, item) { return (acc && _this.isItemChecked(item.dataItem, item.index) === 'checked'); };
        return children.reduce(isCheckedReducer, true);
    };
    CheckDirective.prototype.notify = function () {
        this.checkedKeysChange.emit(this.checkedKeys.slice());
    };
    CheckDirective.prototype.addChildrenKeys = function (args) {
        var _this = this;
        if (this.checkedKeys.indexOf(this.itemKey(args.item)) === -1) {
            return;
        }
        var keys = args.children.reduce(function (acc, item) {
            var itemKey = _this.itemKey(item);
            var existingKey = _this.checkedKeys.find(function (key) { return itemKey === key; });
            if (!existingKey) {
                acc.push(itemKey);
            }
            return acc;
        }, []);
        if (keys.length) {
            this.checkedKeys = this.checkedKeys.concat(keys);
            this.zone.run(function () {
                _this.notify();
            });
        }
    };
    CheckDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewCheckable]' },] },
    ];
    /** @nocollapse */
    CheckDirective.ctorParameters = function () { return [
        { type: TreeViewComponent },
        { type: NgZone }
    ]; };
    CheckDirective.propDecorators = {
        isChecked: [{ type: Input }],
        checkKey: [{ type: Input, args: ["checkBy",] }],
        checkedKeys: [{ type: Input }],
        checkable: [{ type: Input, args: ['kendoTreeViewCheckable',] }],
        checkedKeysChange: [{ type: Output }]
    };
    return CheckDirective;
}());

/**
 * A directive which manages the disabled in-memory state of the TreeView node
 * ([see example]({% slug disabledstate_treeview %})).
 */
var DisableDirective = /** @class */ (function () {
    function DisableDirective(treeView, cdr) {
        var _this = this;
        this.treeView = treeView;
        this.cdr = cdr;
        /**
         * Defines the collection that will store the disabled keys.
         */
        this.disabledKeys = [];
        this.treeView.isDisabled = function (dataItem, index) { return (_this.disabledKeys.indexOf(_this.itemKey({ dataItem: dataItem, index: index })) > -1); };
    }
    Object.defineProperty(DisableDirective.prototype, "isDisabled", {
        /**
         * @hidden
         */
        set: function (value) {
            this.treeView.isDisabled = value;
        },
        enumerable: true,
        configurable: true
    });
    DisableDirective.prototype.ngOnChanges = function (changes) {
        if (changes === void 0) { changes = {}; }
        var disabledKeys = changes.disabledKeys;
        if (disabledKeys && !disabledKeys.firstChange) {
            this.cdr.markForCheck();
        }
    };
    DisableDirective.prototype.itemKey = function (e) {
        if (!this.disableKey) {
            return e.index;
        }
        if (typeof this.disableKey === "string") {
            return e.dataItem[this.disableKey];
        }
        if (typeof this.disableKey === "function") {
            return this.disableKey(e);
        }
    };
    DisableDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewDisable]' },] },
    ];
    /** @nocollapse */
    DisableDirective.ctorParameters = function () { return [
        { type: TreeViewComponent },
        { type: ChangeDetectorRef }
    ]; };
    DisableDirective.propDecorators = {
        isDisabled: [{ type: Input }],
        disableKey: [{ type: Input, args: ["kendoTreeViewDisable",] }],
        disabledKeys: [{ type: Input }]
    };
    return DisableDirective;
}());

/**
 * A directive which manages the expanded state of the TreeView
 * ([see example]({% slug expandedstate_treeview %})).
 */
var ExpandDirective = /** @class */ (function () {
    function ExpandDirective(treeView) {
        var _this = this;
        this.treeView = treeView;
        /**
         * Fires when the `expandedKeys` collection was updated.
         */
        this.expandedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(function () { });
        this._expandedKeys = [];
        this.subscriptions.add(merge(this.treeView.expand.pipe(map(function (e) { return (__assign({ expand: true }, e)); })), this.treeView.collapse.pipe(map(function (e) { return (__assign({ expand: false }, e)); }))).subscribe(this.toggleExpand.bind(this)));
        this.treeView.isExpanded = function (dataItem, index) {
            return _this.expandedKeys.indexOf(_this.itemKey({ dataItem: dataItem, index: index })) > -1;
        };
    }
    Object.defineProperty(ExpandDirective.prototype, "isExpanded", {
        /**
         * @hidden
         */
        set: function (value) {
            this.treeView.isExpanded = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpandDirective.prototype, "expandedKeys", {
        /**
         * Defines the collection that will store the expanded keys.
         */
        get: function () {
            return this._expandedKeys;
        },
        set: function (keys) {
            this._expandedKeys = keys;
        },
        enumerable: true,
        configurable: true
    });
    ExpandDirective.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    ExpandDirective.prototype.itemKey = function (e) {
        if (this.expandKey) {
            if (typeof this.expandKey === "string") {
                return e.dataItem[this.expandKey];
            }
            if (typeof this.expandKey === "function") {
                return this.expandKey(e);
            }
        }
        return e.index;
    };
    ExpandDirective.prototype.toggleExpand = function (_a) {
        var index = _a.index, dataItem = _a.dataItem, expand = _a.expand;
        var item = this.itemKey({ index: index, dataItem: dataItem });
        var idx = this.expandedKeys.indexOf(item);
        var notify = false;
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
    };
    ExpandDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewExpandable]' },] },
    ];
    /** @nocollapse */
    ExpandDirective.ctorParameters = function () { return [
        { type: TreeViewComponent }
    ]; };
    ExpandDirective.propDecorators = {
        isExpanded: [{ type: Input }],
        expandKey: [{ type: Input, args: ["expandBy",] }],
        expandedKeysChange: [{ type: Output }],
        expandedKeys: [{ type: Input }]
    };
    return ExpandDirective;
}());

/**
 * A directive which manages the in-memory selection state of the TreeView node
 * ([see example]({% slug selection_treeview %})).
 */
var SelectDirective = /** @class */ (function () {
    function SelectDirective(treeView) {
        var _this = this;
        this.treeView = treeView;
        /**
         * Fires when the `selectedKeys` collection was updated.
         */
        this.selectedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(function () { });
        this.selectActions = {
            'multiple': function (e) { return _this.selectMultiple(e); },
            'single': function (e) { return _this.selectSingle(e); }
        };
        this._selectedKeys = [];
        this.subscriptions.add(this.treeView.selectionChange.subscribe(this.select.bind(this)));
        this.treeView.isSelected = function (dataItem, index) { return (_this.selectedKeys.indexOf(_this.itemKey({ dataItem: dataItem, index: index })) > -1); };
    }
    Object.defineProperty(SelectDirective.prototype, "isSelected", {
        /**
         * @hidden
         */
        set: function (value) {
            this.treeView.isSelected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectDirective.prototype, "selectedKeys", {
        /**
         * Defines the collection that will store the selected keys
         * ([see example]({% slug selection_treeview %}#toc-selection-modes)).
         */
        get: function () {
            return this._selectedKeys;
        },
        set: function (keys) {
            this._selectedKeys = keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectDirective.prototype, "getAriaMultiselectable", {
        get: function () {
            return this.options.mode === 'multiple';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectDirective.prototype, "options", {
        get: function () {
            var defaultOptions = {
                enabled: true,
                mode: 'single'
            };
            if (!isPresent(this.selection)) {
                return defaultOptions;
            }
            var isBoolean = typeof this.selection === 'boolean';
            var selectionSettings = isBoolean ? { enabled: this.selection } : this.selection;
            return Object.assign(defaultOptions, selectionSettings);
        },
        enumerable: true,
        configurable: true
    });
    SelectDirective.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    SelectDirective.prototype.itemKey = function (e) {
        if (!this.selectKey) {
            return e.index;
        }
        if (typeof this.selectKey === 'string') {
            return e.dataItem[this.selectKey];
        }
        if (typeof this.selectKey === 'function') {
            return this.selectKey(e);
        }
    };
    SelectDirective.prototype.select = function (e) {
        var _a = this.options, enabled = _a.enabled, mode = _a.mode;
        var performSelection = this.selectActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    };
    SelectDirective.prototype.selectSingle = function (node) {
        var key = this.itemKey(node);
        if (this.selectedKeys[0] === key) {
            return;
        }
        this.selectedKeys = [key];
        this.notify();
    };
    SelectDirective.prototype.selectMultiple = function (node) {
        var key = this.itemKey(node);
        var idx = this.selectedKeys.indexOf(key);
        var isSelected = idx > -1;
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
    };
    SelectDirective.prototype.notify = function () {
        this.selectedKeysChange.emit(this.selectedKeys.slice());
    };
    SelectDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewSelectable]' },] },
    ];
    /** @nocollapse */
    SelectDirective.ctorParameters = function () { return [
        { type: TreeViewComponent }
    ]; };
    SelectDirective.propDecorators = {
        isSelected: [{ type: Input }],
        selectKey: [{ type: Input, args: ['selectBy',] }],
        selection: [{ type: Input, args: ['kendoTreeViewSelectable',] }],
        selectedKeys: [{ type: Input }],
        selectedKeysChange: [{ type: Output }],
        getAriaMultiselectable: [{ type: HostBinding, args: ['attr.aria-multiselectable',] }]
    };
    return SelectDirective;
}());

/**
 * A directive which encapsulates the retrieval of child nodes.
 */
var HierarchyBindingDirective = /** @class */ (function () {
    function HierarchyBindingDirective(treeView) {
        this.treeView = treeView;
    }
    Object.defineProperty(HierarchyBindingDirective.prototype, "childrenField", {
        /**
         * The field name which holds the data items of the child component.
         */
        get: function () {
            return this._childrenField;
        },
        /**
         * The field name which holds the data items of the child component.
         */
        set: function (value) {
            if (!value) {
                throw new Error("'childrenField' cannot be empty");
            }
            this._childrenField = value;
        },
        enumerable: true,
        configurable: true
    });
    HierarchyBindingDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (isPresent(this.childrenField)) {
            this.treeView.children = function (item) { return of(getter(_this.childrenField, true)(item)); };
            this.treeView.hasChildren = function (item) {
                var children = getter(_this.childrenField, true)(item);
                return Boolean(children && children.length);
            };
        }
    };
    HierarchyBindingDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewHierarchyBinding]' },] },
    ];
    /** @nocollapse */
    HierarchyBindingDirective.ctorParameters = function () { return [
        { type: TreeViewComponent }
    ]; };
    HierarchyBindingDirective.propDecorators = {
        childrenField: [{ type: Input }]
    };
    return HierarchyBindingDirective;
}());

/**
 * @hidden
 */
var LoadingIndicatorDirective = /** @class */ (function () {
    function LoadingIndicatorDirective(expandService, loadingService, cd) {
        this.expandService = expandService;
        this.loadingService = loadingService;
        this.cd = cd;
        this._loading = false;
    }
    Object.defineProperty(LoadingIndicatorDirective.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        set: function (value) {
            this._loading = value;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    LoadingIndicatorDirective.prototype.ngOnInit = function () {
        var _this = this;
        var loadingNotifications = this.loadingService
            .changes
            .pipe(filter(function (index) { return index === _this.index; }));
        this.subscription = this.expandService
            .changes
            .pipe(filter(function (_a) {
            var index = _a.index;
            return index === _this.index;
        }), tap(function (_a) {
            var expand = _a.expand;
            if (!expand && _this.loading) {
                _this.loading = false;
            }
        }), filter(function (_a) {
            var expand = _a.expand;
            return expand;
        }), switchMap(function (x) { return of(x).pipe(delay(100), takeUntil(loadingNotifications)); }))
            .subscribe(function () { return _this.loading = true; });
        this.subscription.add(loadingNotifications.subscribe(function () { return _this.loading = false; }));
    };
    LoadingIndicatorDirective.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    LoadingIndicatorDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewLoading]' },] },
    ];
    /** @nocollapse */
    LoadingIndicatorDirective.ctorParameters = function () { return [
        { type: ExpandStateService },
        { type: LoadingNotificationService },
        { type: ChangeDetectorRef }
    ]; };
    LoadingIndicatorDirective.propDecorators = {
        loading: [{ type: HostBinding, args: ["class.k-i-loading",] }],
        index: [{ type: Input, args: ["kendoTreeViewLoading",] }]
    };
    return LoadingIndicatorDirective;
}());

/**
 * @hidden
 * Performs the right-to-left function composition. Functions must have a unary.
 */
var compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (data) { return args.reduceRight(function (acc, curr) { return curr(acc); }, data); };
};

var findChildren = function (prop, nodes, value) { return nodes.filter(function (x) { return prop(x) === value; }); };
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
var FlatDataBindingDirective = /** @class */ (function () {
    function FlatDataBindingDirective(treeView) {
        this.treeView = treeView;
        this.originalData = [];
    }
    Object.defineProperty(FlatDataBindingDirective.prototype, "nodes", {
        /**
         * The nodes which will be displayed by the TreeView.
         */
        set: function (values) {
            this.originalData = values || [];
            if (!isNullOrEmptyString(this.parentIdField)) {
                var prop = getter(this.parentIdField, true);
                this.treeView.nodes = (this.originalData).filter(compose(isBlank, prop));
            }
            else {
                this.treeView.nodes = this.originalData.slice(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FlatDataBindingDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (isPresent(this.parentIdField) && isPresent(this.idField)) {
            var fetchChildren_1 = function (node) {
                return findChildren(getter(_this.parentIdField, true), _this.originalData || [], getter(_this.idField, true)(node));
            };
            this.treeView.hasChildren = function (node) { return fetchChildren_1(node).length > 0; };
            this.treeView.children = function (node) { return of(fetchChildren_1(node)); };
        }
    };
    /**
     * @hidden
     */
    FlatDataBindingDirective.prototype.ngOnChanges = function (changes) {
        if (isChanged("parentIdField", changes, false)) {
            this.nodes = this.originalData;
        }
    };
    FlatDataBindingDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewFlatDataBinding]' },] },
    ];
    /** @nocollapse */
    FlatDataBindingDirective.ctorParameters = function () { return [
        { type: TreeViewComponent }
    ]; };
    FlatDataBindingDirective.propDecorators = {
        nodes: [{ type: Input }],
        parentIdField: [{ type: Input }],
        idField: [{ type: Input }]
    };
    return FlatDataBindingDirective;
}());

var buildItem = function (index, dataItem) { return ({ dataItem: dataItem, index: index }); };
var id = 0;
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
var TreeViewItemDirective = /** @class */ (function () {
    function TreeViewItemDirective(element, expandService, navigationService, selectionService, lookupService, renderer, ib) {
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
    Object.defineProperty(TreeViewItemDirective.prototype, "isChecked", {
        set: function (checked) {
            if (checked === 'checked') {
                this.ariaChecked = 'true';
            }
            else if (checked === 'indeterminate') {
                this.ariaChecked = 'mixed';
            }
            else {
                this.ariaChecked = 'false';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "isExpanded", {
        get: function () {
            return this._isExpanded || false;
        },
        set: function (isExpanded) {
            this._isExpanded = isExpanded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "isSelected", {
        get: function () {
            return this._isSelected || false;
        },
        set: function (isSelected) {
            this._isSelected = isSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "treeItem", {
        get: function () {
            return buildItem(this.index, this.dataItem);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "parentTreeItem", {
        get: function () {
            return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
        },
        enumerable: true,
        configurable: true
    });
    TreeViewItemDirective.prototype.ngOnInit = function () {
        this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
        this.registerNavigationItem();
        this.isInitialized = true;
        this.setAttribute('role', 'treeitem');
        this.setAriaAttributes();
        this.setDisabledClass();
        this.updateTabIndex();
    };
    TreeViewItemDirective.prototype.ngOnChanges = function (changes) {
        var index = changes.index, isDisabled = changes.isDisabled;
        if (index || changes.isChecked || changes.isExpanded || changes.isSelected) {
            this.setAriaAttributes();
        }
        if (isDisabled) {
            this.setDisabledClass();
        }
        this.moveLookupItem(changes);
        this.moveNavigationItem(index);
        this.disableNavigationItem(isDisabled);
    };
    TreeViewItemDirective.prototype.ngOnDestroy = function () {
        this.navigationService.unregisterItem(this.id, this.index);
        this.lookupService.unregisterItem(this.index, this.dataItem);
        this.subscriptions = this.subscriptions.reduce(function (list, callback) { return (callback.unsubscribe(), list); }, []);
    };
    TreeViewItemDirective.prototype.subscribe = function () {
        var _this = this;
        this.subscriptions = [
            this.navigationService.moves
                .subscribe(function () {
                _this.updateTabIndex();
                _this.focusItem();
            }),
            this.navigationService.expands
                .pipe(filter(function (_a) {
                var index = _a.index;
                return index === _this.index && !_this.isDisabled;
            }))
                .subscribe(function (_a) {
                var expand = _a.expand;
                return _this.expand(expand);
            })
        ];
    };
    TreeViewItemDirective.prototype.registerNavigationItem = function () {
        this.navigationService.registerItem(this.id, this.index, this.isDisabled);
        this.activateItem();
    };
    TreeViewItemDirective.prototype.activateItem = function () {
        if (this.isDisabled) {
            return;
        }
        var navigationService = this.navigationService;
        var selectionService = this.selectionService;
        var index = this.index;
        selectionService.setFirstSelected(index, this.isSelected);
        if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
            navigationService.activateIndex(index);
        }
    };
    TreeViewItemDirective.prototype.expand = function (shouldExpand) {
        this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
    };
    TreeViewItemDirective.prototype.isFocusable = function () {
        return !this.isDisabled && this.navigationService.isFocusable(this.index);
    };
    TreeViewItemDirective.prototype.focusItem = function () {
        if (this.isInitialized && this.navigationService.isActive(this.index)) {
            this.element.nativeElement.focus();
        }
    };
    TreeViewItemDirective.prototype.moveLookupItem = function (changes) {
        if (changes === void 0) { changes = {}; }
        var dataItem = changes.dataItem, index = changes.index, parentDataItem = changes.parentDataItem, parentIndex = changes.parentIndex;
        if ((index && index.firstChange) || //skip first change
            (!dataItem && !index && !parentDataItem && !parentIndex)) {
            return;
        }
        var oldIndex = (index || {}).previousValue || this.index;
        this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
    };
    TreeViewItemDirective.prototype.moveNavigationItem = function (indexChange) {
        if (indexChange === void 0) { indexChange = {}; }
        var currentValue = indexChange.currentValue, firstChange = indexChange.firstChange, previousValue = indexChange.previousValue;
        if (!firstChange && isPresent(currentValue) && isPresent(previousValue)) {
            this.navigationService.unregisterItem(this.id, previousValue);
            this.navigationService.registerItem(this.id, currentValue, this.isDisabled);
        }
    };
    TreeViewItemDirective.prototype.disableNavigationItem = function (disableChange) {
        if (!disableChange || disableChange.firstChange) {
            return;
        }
        var service = this.navigationService;
        if (this.isDisabled) {
            service.activateClosest(this.index); //activate before unregister the item
        }
        else {
            service.activateFocusable();
        }
        service.unregisterItem(this.id, this.index);
        service.registerItem(this.id, this.index, this.isDisabled);
    };
    TreeViewItemDirective.prototype.setAriaAttributes = function () {
        this.setAttribute('aria-level', this.ib.level(this.index).toString());
        this.setAttribute('aria-expanded', this.isExpanded.toString());
        this.setAttribute('aria-selected', this.isSelected.toString());
        this.setAttribute('aria-checked', this.ariaChecked);
    };
    TreeViewItemDirective.prototype.setDisabledClass = function () {
        this.setClass('k-state-disabled', this.isDisabled);
    };
    TreeViewItemDirective.prototype.setClass = function (className, toggle) {
        var action = toggle ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    };
    TreeViewItemDirective.prototype.updateTabIndex = function () {
        this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
    };
    TreeViewItemDirective.prototype.setAttribute = function (attr, value) {
        this.renderer.setAttribute(this.element.nativeElement, attr, value);
    };
    TreeViewItemDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewItem]' },] },
    ];
    /** @nocollapse */
    TreeViewItemDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ExpandStateService },
        { type: NavigationService },
        { type: SelectionService },
        { type: TreeViewLookupService },
        { type: Renderer2 },
        { type: IndexBuilderService }
    ]; };
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
    return TreeViewItemDirective;
}());

/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
var TreeViewItemContentDirective = /** @class */ (function () {
    function TreeViewItemContentDirective(element, navigationService, selectionService, renderer) {
        var _this = this;
        this.element = element;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.renderer = renderer;
        this.initialSelection = false;
        this.subscriptions = new Subscription(function () { });
        this.subscriptions.add(this.navigationService.moves
            .subscribe(this.updateItem.bind(this)));
        this.subscriptions.add(this.navigationService.selects
            .pipe(filter(function (index) { return index === _this.index; }))
            .subscribe(function (index) {
            return _this.selectionService.select(index, _this.dataItem);
        }));
        this.subscriptions.add(this.selectionService.changes
            .subscribe(function () {
            _this.updateSelection(_this.isSelected(_this.dataItem, _this.index));
        }));
    }
    TreeViewItemContentDirective.prototype.ngOnChanges = function (changes) {
        if (changes.initialSelection) {
            this.updateSelection(this.initialSelection);
        }
    };
    TreeViewItemContentDirective.prototype.ngOnInit = function () {
        this.updateSelection(this.initialSelection);
    };
    TreeViewItemContentDirective.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    TreeViewItemContentDirective.prototype.updateItem = function () {
        this.render(this.navigationService.isActive(this.index), 'k-state-focused');
    };
    TreeViewItemContentDirective.prototype.updateSelection = function (selected) {
        this.render(selected, 'k-state-selected');
    };
    TreeViewItemContentDirective.prototype.render = function (addClass, className) {
        var action = addClass ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    };
    TreeViewItemContentDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewItemContent]' },] },
    ];
    /** @nocollapse */
    TreeViewItemContentDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NavigationService },
        { type: SelectionService },
        { type: Renderer2 }
    ]; };
    TreeViewItemContentDirective.propDecorators = {
        dataItem: [{ type: Input }],
        index: [{ type: Input }],
        initialSelection: [{ type: Input }],
        isSelected: [{ type: Input }]
    };
    return TreeViewItemContentDirective;
}());

/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
var CheckBoxComponent = /** @class */ (function () {
    function CheckBoxComponent(element, renderer, changeDetector) {
        this.element = element;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        /**
         * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
         */
        this.id = "_" + guid();
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
    Object.defineProperty(CheckBoxComponent.prototype, "classWrapper", {
        //XXX: implement ComponentValueAccessor
        //XXX: focus/blur methods
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckBoxComponent.prototype, "indeterminate", {
        get: function () {
            return this.checkState === 'indeterminate';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckBoxComponent.prototype, "checked", {
        get: function () {
            return this.checkState === 'checked';
        },
        enumerable: true,
        configurable: true
    });
    CheckBoxComponent.prototype.ngOnInit = function () {
        this.renderer.removeAttribute(this.element.nativeElement, "tabindex");
    };
    CheckBoxComponent.prototype.ngDoCheck = function () {
        this.checkState = this.isChecked(this.node, this.index);
    };
    CheckBoxComponent.prototype.handleChange = function (e) {
        var state = e.target.checked ? 'checked' : 'none';
        // update the View State so that Angular updates the input if the isChecked value is the same
        this.checkState = state;
        this.changeDetector.detectChanges();
        this.checkStateChange.emit(state);
    };
    CheckBoxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kendo-checkbox',
                    template: "\n        <input\n            class=\"k-checkbox\"\n            type=\"checkbox\"\n            [id]=\"id\"\n            [checked]=\"checked\"\n            [indeterminate]=\"indeterminate\"\n            [tabindex]=\"tabindex\"\n            (change)=\"handleChange($event)\"\n        />\n        <label\n            class=\"k-checkbox-label\"\n            tabindex=\"-1\"\n            [for]=\"id\"\n        >{{labelText}}</label>\n    "
                },] },
    ];
    /** @nocollapse */
    CheckBoxComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
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
    return CheckBoxComponent;
}());

var COMPONENT_DIRECTIVES = [
    CheckBoxComponent
];
/**
 * @hidden
 *
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the CheckBox component.
 */
var CheckBoxModule = /** @class */ (function () {
    function CheckBoxModule() {
    }
    CheckBoxModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [COMPONENT_DIRECTIVES],
                    exports: [COMPONENT_DIRECTIVES]
                },] },
    ];
    return CheckBoxModule;
}());

var COMPONENT_DIRECTIVES$1 = [
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
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [COMPONENT_DIRECTIVES$1],
                    exports: [COMPONENT_DIRECTIVES$1],
                    imports: [CommonModule, CheckBoxModule]
                },] },
    ];
    return SharedModule;
}());

var EXPORTS = [
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
var TreeViewModule = /** @class */ (function () {
    function TreeViewModule() {
    }
    TreeViewModule.decorators = [
        { type: NgModule, args: [{
                    exports: [EXPORTS],
                    imports: [SharedModule]
                },] },
    ];
    return TreeViewModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { CheckBoxComponent, CheckBoxModule, DataChangeNotificationService, ExpandStateService, IndexBuilderService, LoadingIndicatorDirective, LoadingNotificationService, NavigationService, NodeChildrenService, SelectionService, SharedModule, TreeViewGroupComponent, TreeViewItemContentDirective, TreeViewItemDirective, TreeViewLookupService, TreeViewComponent, TreeViewModule, NodeTemplateDirective, CheckDirective, DisableDirective, ExpandDirective, SelectDirective, HierarchyBindingDirective, FlatDataBindingDirective };
