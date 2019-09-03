import { EventEmitter, OnDestroy, OnChanges, NgZone } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { CheckableSettings } from './checkable-settings';
import { CheckedState } from './checkbox/checked-state';
import { Subscription } from 'rxjs';
/**
 * A directive which manages the in-memory checked state of the TreeView node
 * ([see example]({% slug checkboxes_treeview %})).
 */
export declare class CheckDirective implements OnChanges, OnDestroy {
    protected treeView: TreeViewComponent;
    private zone;
    /**
     * @hidden
     */
    isChecked: <T>(item: T, index: string) => CheckedState;
    /**
     * Defines the item key that will be stored in the `checkedKeys` collection.
     */
    checkKey: string | ((context: {
        index: string;
        dataItem: any;
    }) => any);
    /**
     * Defines the collection that will store the checked keys
     * ([see example]({% slug checkboxes_treeview %})).
     */
    checkedKeys: any[];
    /**
     * Defines the collection that will store the checked keys.
     */
    checkable: boolean | CheckableSettings;
    /**
     * Fires when the `checkedKeys` collection was updated.
     */
    checkedKeysChange: EventEmitter<any[]>;
    protected subscriptions: Subscription;
    private readonly options;
    private checkActions;
    private _checkedKeys;
    private clickSubscription;
    constructor(treeView: TreeViewComponent, zone: NgZone);
    ngOnChanges(changes: any): void;
    ngOnDestroy(): void;
    protected isItemChecked(dataItem: any, index: string): CheckedState;
    protected isIndexChecked(index: string): CheckedState;
    protected itemKey(e: any): any;
    protected check(e: any): void;
    protected checkSingle(node: any): void;
    protected checkMultiple(node: any): void;
    protected toggleCheckOnClick(): void;
    private unsubscribeClick;
    private checkNode;
    private checkParents;
    private allChildrenSelected;
    private notify;
    private addChildrenKeys;
}
