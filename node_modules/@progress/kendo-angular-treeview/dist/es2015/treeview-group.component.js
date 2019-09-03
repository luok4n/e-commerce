import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { isPresent, isArray } from './utils';
import { getter } from './accessor';
import { LoadingNotificationService } from './loading-notification.service';
import { EMPTY, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataChangeNotificationService } from './data-change-notification.service';
/**
 * @hidden
 */
export class TreeViewGroupComponent {
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
