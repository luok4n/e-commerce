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
export class TreeViewComponent {
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
