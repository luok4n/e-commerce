import { TemplateRef, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { LoadingNotificationService } from './loading-notification.service';
import { CheckedState } from './checkbox/checked-state';
import { Observable } from 'rxjs';
import { DataChangeNotificationService } from './data-change-notification.service';
/**
 * @hidden
 */
export declare class TreeViewGroupComponent implements OnChanges, OnInit, OnDestroy {
    protected expandService: ExpandStateService;
    protected loadingService: LoadingNotificationService;
    protected indexBuilder: IndexBuilderService;
    protected treeViewLookupService: TreeViewLookupService;
    protected navigationService: NavigationService;
    protected nodeChildrenService: NodeChildrenService;
    protected dataChangeNotification: DataChangeNotificationService;
    kGroupClass: boolean;
    readonly role: string;
    checkboxes: boolean;
    expandIcons: boolean;
    disabled: boolean;
    nodes: (node: any, index: string) => Observable<any[]>;
    textField: string | string[];
    parentDataItem: any;
    parentIndex: string;
    nodeTemplateRef: TemplateRef<any>;
    data: any[];
    private _data;
    private nodesSubscription;
    private dataChangeSubscription;
    constructor(expandService: ExpandStateService, loadingService: LoadingNotificationService, indexBuilder: IndexBuilderService, treeViewLookupService: TreeViewLookupService, navigationService: NavigationService, nodeChildrenService: NodeChildrenService, dataChangeNotification: DataChangeNotificationService);
    isChecked: <T>(item: T, index: string) => CheckedState;
    isDisabled: <T>(item: T, index: string) => boolean;
    isExpanded: <T>(item: T, index: string) => boolean;
    isSelected: <T>(item: T, index: string) => boolean;
    children: <T>(item: T) => Observable<any[]>;
    hasChildren: <T>(item: T) => boolean;
    readonly hasTemplate: boolean;
    expandNode(index: string, dataItem: any, expand: boolean): void;
    checkNode(index: string): void;
    nodeIndex(index: number): string;
    nodeText(dataItem: any): any;
    ngOnDestroy(): void;
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    fetchChildren(node: any, index: string): Observable<any>;
    readonly nextFields: string[];
    private setNodeChildren;
    private mapToTreeItem;
    private emitChildrenLoaded;
    private subscribeToNodesChange;
}
