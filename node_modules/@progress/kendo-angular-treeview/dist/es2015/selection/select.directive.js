import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TreeViewComponent } from '../treeview.component';
import { isPresent, noop } from '../utils';
import { Subscription } from 'rxjs';
/**
 * A directive which manages the in-memory selection state of the TreeView node
 * ([see example]({% slug selection_treeview %})).
 */
export class SelectDirective {
    constructor(treeView) {
        this.treeView = treeView;
        /**
         * Fires when the `selectedKeys` collection was updated.
         */
        this.selectedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(() => { });
        this.selectActions = {
            'multiple': (e) => this.selectMultiple(e),
            'single': (e) => this.selectSingle(e)
        };
        this._selectedKeys = [];
        this.subscriptions.add(this.treeView.selectionChange.subscribe(this.select.bind(this)));
        this.treeView.isSelected = (dataItem, index) => (this.selectedKeys.indexOf(this.itemKey({ dataItem, index })) > -1);
    }
    /**
     * @hidden
     */
    set isSelected(value) {
        this.treeView.isSelected = value;
    }
    /**
     * Defines the collection that will store the selected keys
     * ([see example]({% slug selection_treeview %}#toc-selection-modes)).
     */
    get selectedKeys() {
        return this._selectedKeys;
    }
    set selectedKeys(keys) {
        this._selectedKeys = keys;
    }
    get getAriaMultiselectable() {
        return this.options.mode === 'multiple';
    }
    get options() {
        const defaultOptions = {
            enabled: true,
            mode: 'single'
        };
        if (!isPresent(this.selection)) {
            return defaultOptions;
        }
        const isBoolean = typeof this.selection === 'boolean';
        const selectionSettings = isBoolean ? { enabled: this.selection } : this.selection;
        return Object.assign(defaultOptions, selectionSettings);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    itemKey(e) {
        if (!this.selectKey) {
            return e.index;
        }
        if (typeof this.selectKey === 'string') {
            return e.dataItem[this.selectKey];
        }
        if (typeof this.selectKey === 'function') {
            return this.selectKey(e);
        }
    }
    select(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.selectActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    selectSingle(node) {
        const key = this.itemKey(node);
        if (this.selectedKeys[0] === key) {
            return;
        }
        this.selectedKeys = [key];
        this.notify();
    }
    selectMultiple(node) {
        const key = this.itemKey(node);
        const idx = this.selectedKeys.indexOf(key);
        const isSelected = idx > -1;
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
    }
    notify() {
        this.selectedKeysChange.emit(this.selectedKeys.slice());
    }
}
SelectDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewSelectable]' },] },
];
/** @nocollapse */
SelectDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
SelectDirective.propDecorators = {
    isSelected: [{ type: Input }],
    selectKey: [{ type: Input, args: ['selectBy',] }],
    selection: [{ type: Input, args: ['kendoTreeViewSelectable',] }],
    selectedKeys: [{ type: Input }],
    selectedKeysChange: [{ type: Output }],
    getAriaMultiselectable: [{ type: HostBinding, args: ['attr.aria-multiselectable',] }]
};
