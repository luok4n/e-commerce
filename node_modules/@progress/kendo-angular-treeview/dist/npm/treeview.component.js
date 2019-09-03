"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var kendo_angular_common_1 = require("@progress/kendo-angular-common");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var rxjs_1 = require("rxjs");
var data_change_notification_service_1 = require("./data-change-notification.service");
var default_callbacks_1 = require("./default-callbacks");
var expand_state_service_1 = require("./expand-state.service");
var index_builder_service_1 = require("./index-builder.service");
var loading_notification_service_1 = require("./loading-notification.service");
var navigation_service_1 = require("./navigation/navigation.service");
var node_children_service_1 = require("./node-children.service");
var node_template_directive_1 = require("./node-template.directive");
var selection_service_1 = require("./selection/selection.service");
var treeview_lookup_service_1 = require("./treeview-lookup.service");
var utils_1 = require("./utils");
var providers = [
    expand_state_service_1.ExpandStateService,
    index_builder_service_1.IndexBuilderService,
    treeview_lookup_service_1.TreeViewLookupService,
    loading_notification_service_1.LoadingNotificationService,
    node_children_service_1.NodeChildrenService,
    navigation_service_1.NavigationService,
    selection_service_1.SelectionService,
    data_change_notification_service_1.DataChangeNotificationService,
    kendo_angular_l10n_1.LocalizationService,
    {
        provide: kendo_angular_l10n_1.L10N_PREFIX,
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
        this.childrenLoaded = new core_1.EventEmitter();
        /**
         * Fires when the user blurs the component.
         */
        this.onBlur = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires when the user focuses the component.
         */
        this.onFocus = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires when the user expands a TreeView node.
         */
        this.expand = new core_1.EventEmitter();
        /**
         * Fires when the user collapses a TreeView node.
         */
        this.collapse = new core_1.EventEmitter();
        /**
         * Fires when the user selects a TreeView node checkbox
         * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
         */
        this.checkedChange = new core_1.EventEmitter();
        /**
         * Fires when the user selects a TreeView node
         * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
         */
        this.selectionChange = new core_1.EventEmitter();
        /**
         * Fires when the user clicks a TreeView node.
         */
        this.nodeClick = new core_1.EventEmitter();
        /**
         * Fires when the user double clicks a TreeView node.
         */
        this.nodeDblClick = new core_1.EventEmitter();
        /**
         * A function which determines if a specific node is disabled.
         */
        this.isDisabled = default_callbacks_1.isDisabled;
        /**
         * Determines whether the TreeView keyboard navigable is enabled.
         */
        this.navigable = true;
        /**
         * A function which provides the child nodes for a given parent node
         * ([see example]({% slug databinding_treeview %})).
         */
        this.children = function () { return rxjs_1.of([]); };
        this.checkboxes = false;
        this.expandIcons = false;
        this.isActive = false;
        this.data = new rxjs_1.BehaviorSubject([]);
        this._animate = true;
        this.subscriptions = new rxjs_1.Subscription(function () { });
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
            return this._hasChildren || default_callbacks_1.hasChildren;
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
            return this._isChecked || default_callbacks_1.isChecked;
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
            return this._isExpanded || default_callbacks_1.isExpanded;
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
            return this._isSelected || default_callbacks_1.isSelected;
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
            if (kendo_angular_common_1.hasObservers(_this.selectionChange)) {
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
        if (!kendo_angular_common_1.isDocumentAvailable()) {
            return;
        }
        var target = utils_1.focusableNode(this.element);
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
        var target = utils_1.focusableNode(this.element);
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
        if (utils_1.match(e.target, '.k-treeview-item')) {
            focusItem = e.target;
        }
        else if (!utils_1.isFocusable(e.target)) { // with compliments to IE
            focusItem = utils_1.closestNode(e.target);
        }
        if (focusItem) {
            this.navigationService.activateIndex(utils_1.nodeId(e.target));
            if (!this.isActive && kendo_angular_common_1.hasObservers(this.onFocus)) {
                this.ngZone.run(function () {
                    _this.onFocus.emit();
                });
            }
            this.isActive = true;
        }
    };
    TreeViewComponent.prototype.blurHandler = function (e) {
        var _this = this;
        if (this.isActive && utils_1.match(e.target, '.k-treeview-item') &&
            (!e.relatedTarget || !utils_1.match(e.relatedTarget, '.k-treeview-item') || !utils_1.hasParent(e.relatedTarget, this.element.nativeElement))) {
            this.navigationService.deactivate();
            this.isActive = false;
            if (kendo_angular_common_1.hasObservers(this.onBlur)) {
                this.ngZone.run(function () {
                    _this.onBlur.emit();
                });
            }
        }
    };
    TreeViewComponent.prototype.clickHandler = function (e) {
        var _this = this;
        var target = e.target;
        if ((e.type === 'contextmenu' && !kendo_angular_common_1.hasObservers(this.nodeClick)) ||
            (e.type === 'click' && !kendo_angular_common_1.hasObservers(this.nodeClick) && !kendo_angular_common_1.hasObservers(this.selectionChange)) ||
            (e.type === 'dblclick' && !kendo_angular_common_1.hasObservers(this.nodeDblClick)) || utils_1.isFocusable(target) ||
            !utils_1.isContent(target) || !utils_1.hasParent(target, this.element.nativeElement)) {
            return;
        }
        var index = utils_1.nodeId(utils_1.closestNode(target));
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
        { type: core_1.Component, args: [{
                    changeDetection: core_1.ChangeDetectionStrategy.Default,
                    exportAs: 'kendoTreeView',
                    providers: providers,
                    selector: 'kendo-treeview',
                    template: "\n    <ul class=\"k-treeview-lines\"\n      kendoTreeViewGroup\n      role=\"group\"\n      [checkboxes]=\"checkboxes\"\n      [expandIcons]=\"expandIcons\"\n      [children]=\"children\"\n      [hasChildren]=\"hasChildren\"\n      [isChecked]=\"isChecked\"\n      [isDisabled]=\"isDisabled\"\n      [isExpanded]=\"isExpanded\"\n      [isSelected]=\"isSelected\"\n      [nodeTemplateRef]=\"nodeTemplate?.templateRef\"\n      [textField]=\"textField\"\n      [nodes]=\"fetchNodes\"\n      >\n    </ul>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeViewComponent.ctorParameters = function () { return [
        { type: expand_state_service_1.ExpandStateService },
        { type: navigation_service_1.NavigationService },
        { type: node_children_service_1.NodeChildrenService },
        { type: selection_service_1.SelectionService },
        { type: treeview_lookup_service_1.TreeViewLookupService },
        { type: core_1.NgZone },
        { type: core_1.Renderer2 },
        { type: core_1.ElementRef },
        { type: data_change_notification_service_1.DataChangeNotificationService },
        { type: kendo_angular_l10n_1.LocalizationService }
    ]; };
    TreeViewComponent.propDecorators = {
        classNames: [{ type: core_1.HostBinding, args: ["class.k-widget",] }, { type: core_1.HostBinding, args: ["class.k-treeview",] }],
        role: [{ type: core_1.HostBinding, args: ["attr.role",] }],
        direction: [{ type: core_1.HostBinding, args: ["attr.dir",] }],
        animate: [{ type: core_1.Input }, { type: core_1.HostBinding, args: ['@.disabled',] }],
        childrenLoaded: [{ type: core_1.Output }],
        onBlur: [{ type: core_1.Output, args: ['blur',] }],
        onFocus: [{ type: core_1.Output, args: ['focus',] }],
        expand: [{ type: core_1.Output }],
        collapse: [{ type: core_1.Output }],
        checkedChange: [{ type: core_1.Output }],
        selectionChange: [{ type: core_1.Output }],
        nodeClick: [{ type: core_1.Output }],
        nodeDblClick: [{ type: core_1.Output }],
        nodeTemplate: [{ type: core_1.ContentChild, args: [node_template_directive_1.NodeTemplateDirective,] }],
        nodes: [{ type: core_1.Input }],
        textField: [{ type: core_1.Input }],
        hasChildren: [{ type: core_1.Input }],
        isChecked: [{ type: core_1.Input }],
        isDisabled: [{ type: core_1.Input }],
        isExpanded: [{ type: core_1.Input }],
        isSelected: [{ type: core_1.Input }],
        navigable: [{ type: core_1.Input }],
        children: [{ type: core_1.Input }]
    };
    return TreeViewComponent;
}());
exports.TreeViewComponent = TreeViewComponent;
