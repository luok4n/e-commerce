import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * A directive which manages the expanded state of the TreeView
 * ([see example]({% slug expandedstate_treeview %})).
 */
export class ExpandDirective {
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
