import { ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Observable, Subject } from 'rxjs';
import { CheckedState } from './checkbox/checked-state';
import { DataChangeNotificationService } from './data-change-notification.service';
import { ExpandStateService } from './expand-state.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { NodeClickEvent } from './node-click-event.interface';
import { NodeTemplateDirective } from './node-template.directive';
import { SelectionService } from './selection/selection.service';
import { TreeItemLookup } from './treeitem-lookup.interface';
import { TreeItem } from './treeitem.interface';
import { TreeViewLookupService } from './treeview-lookup.service';
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
export declare class TreeViewComponent implements OnChanges, OnInit, OnDestroy {
    protected expandService: ExpandStateService;
    protected navigationService: NavigationService;
    protected nodeChildrenService: NodeChildrenService;
    protected selectionService: SelectionService;
    protected treeViewLookupService: TreeViewLookupService;
    private ngZone;
    private renderer;
    private element;
    private dataChangeNotification;
    private localization;
    classNames: boolean;
    readonly role: string;
    /** @hidden */
    readonly direction: string;
    /**
     * Determines whether the content animation is enabled.
     */
    animate: boolean;
    /** @hidden */
    fetchNodes: () => Subject<any[]>;
    /**
     * Fires when the children of the expanded node are loaded.
     */
    childrenLoaded: EventEmitter<{
        children: TreeItem[];
        item: TreeItem;
    }>;
    /**
     * Fires when the user blurs the component.
     */
    onBlur: EventEmitter<any>;
    /**
     * Fires when the user focuses the component.
     */
    onFocus: EventEmitter<any>;
    /**
     * Fires when the user expands a TreeView node.
     */
    expand: EventEmitter<TreeItem>;
    /**
     * Fires when the user collapses a TreeView node.
     */
    collapse: EventEmitter<TreeItem>;
    /**
     * Fires when the user selects a TreeView node checkbox
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    checkedChange: EventEmitter<TreeItemLookup>;
    /**
     * Fires when the user selects a TreeView node
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    selectionChange: EventEmitter<TreeItem>;
    /**
     * Fires when the user clicks a TreeView node.
     */
    nodeClick: EventEmitter<NodeClickEvent>;
    /**
     * Fires when the user double clicks a TreeView node.
     */
    nodeDblClick: EventEmitter<NodeClickEvent>;
    /**
     * @hidden
     */
    nodeTemplate: NodeTemplateDirective;
    /**
     * The nodes which will be displayed by the TreeView
     * ([see example]({% slug databinding_treeview %})).
     */
    nodes: any[];
    /**
     * The fields of the data item that provide the text content of the nodes
     * ([see example]({% slug databinding_treeview %})). If the `textField` input is set
     * to an array, each hierarchical level uses the field that corresponds to the same
     * index in the array, or the last item in the array.
     */
    textField: string | string[];
    /**
     * A function which determines if a specific node has child nodes
     * ([see example]({% slug databinding_treeview %})).
     */
    hasChildren: <T>(item: T) => boolean;
    /**
     * A function which determines if a specific node is selected
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    isChecked: <T>(item: T, index: string) => CheckedState;
    /**
     * A function which determines if a specific node is disabled.
     */
    isDisabled: <T>(item: T, index: string) => boolean;
    /**
     * A function which determines if a specific node is expanded.
     */
    isExpanded: <T>(item: T, index: string) => boolean;
    /**
     * A function which determines if a specific node is selected
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    isSelected: <T>(item: T, index: string) => boolean;
    /**
     * Determines whether the TreeView keyboard navigable is enabled.
     */
    navigable: boolean;
    /**
     * A function which provides the child nodes for a given parent node
     * ([see example]({% slug databinding_treeview %})).
     */
    children: <T>(item: T) => Observable<any[]>;
    checkboxes: boolean;
    expandIcons: boolean;
    isActive: boolean;
    data: Subject<any[]>;
    private _animate;
    private _isChecked;
    private _isExpanded;
    private _isSelected;
    private _hasChildren;
    private subscriptions;
    private domSubscriptions;
    constructor(expandService: ExpandStateService, navigationService: NavigationService, nodeChildrenService: NodeChildrenService, selectionService: SelectionService, treeViewLookupService: TreeViewLookupService, ngZone: NgZone, renderer: Renderer2, element: ElementRef, dataChangeNotification: DataChangeNotificationService, localization: LocalizationService);
    ngOnChanges(_: any): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    /**
     * Blurs the focused TreeView item.
     */
    blur(): void;
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
    focus(index?: string): void;
    /**
     * Based on the specified index, returns the TreeItemLookup node.
     *
     * @param index - The index of the node.
     * @returns {TreeItemLookup} - The item that was searched (looked up).
     */
    itemLookup(index: string): TreeItemLookup;
    /**
     * @hidden
     */
    isDisabledNode(node: any): boolean;
    private attachDomHandlers;
    private focusHandler;
    private blurHandler;
    private clickHandler;
    private keydownHandler;
}
