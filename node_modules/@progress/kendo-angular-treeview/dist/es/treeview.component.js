import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, NgZone, Output, Renderer2 } from '@angular/core';
import { hasObservers, isDocumentAvailable } from '@progress/kendo-angular-common';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DataChangeNotificationService } from './data-change-notification.service';
import { hasChildren, isChecked, isDisabled, isExpanded, isSelected } from './default-callbacks';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { LoadingNotificationService } from './loading-notification.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { NodeTemplateDirective } from './node-template.directive';
import { SelectionService } from './selection/selection.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { closestNode, focusableNode, hasParent, isContent, isFocusable, match, nodeId } from './utils';
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
export { TreeViewComponent };
