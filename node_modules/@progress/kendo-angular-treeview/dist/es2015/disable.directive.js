import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
/**
 * A directive which manages the disabled in-memory state of the TreeView node
 * ([see example]({% slug disabledstate_treeview %})).
 */
export class DisableDirective {
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
