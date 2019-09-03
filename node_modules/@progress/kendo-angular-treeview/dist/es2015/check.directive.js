import { Directive, EventEmitter, Input, Output, NgZone } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { isPresent, noop } from './utils';
import { Subscription } from 'rxjs';
import { filter, take, switchMap, map } from 'rxjs/operators';
const indexChecked = (keys, index) => keys.filter(k => k === index).length > 0;
const ɵ0 = indexChecked;
const matchKey = index => k => {
    if (index === k) {
        return true;
    }
    if (!k.split) {
        return false;
    }
    return k.split('_').reduce(({ key, result }, part) => {
        key += part;
        if (index === key || result) {
            return { result: true };
        }
        key += "_";
        return { key, result: false };
    }, { key: "", result: false }).result;
};
const ɵ1 = matchKey;
/**
 * A directive which manages the in-memory checked state of the TreeView node
 * ([see example]({% slug checkboxes_treeview %})).
 */
export class CheckDirective {
    constructor(treeView, zone) {
        this.treeView = treeView;
        this.zone = zone;
        /**
         * Fires when the `checkedKeys` collection was updated.
         */
        this.checkedKeysChange = new EventEmitter();
        this.subscriptions = new Subscription(() => { });
        this.checkActions = {
            'multiple': (e) => this.checkMultiple(e),
            'single': (e) => this.checkSingle(e)
        };
        this._checkedKeys = [];
        this.subscriptions.add(this.treeView.checkedChange
            .subscribe((e) => this.check(e)));
        this.subscriptions.add(this.treeView.childrenLoaded
            .pipe(filter(() => this.options.checkChildren), switchMap(e => this.zone.onStable.pipe(take(1), map(() => e))))
            .subscribe((e) => this.addChildrenKeys(e)));
        this.treeView.isChecked = this.isItemChecked.bind(this);
    }
    /**
     * @hidden
     */
    set isChecked(value) {
        this.treeView.isChecked = value;
    }
    /**
     * Defines the collection that will store the checked keys
     * ([see example]({% slug checkboxes_treeview %})).
     */
    get checkedKeys() {
        return this._checkedKeys;
    }
    set checkedKeys(keys) {
        this._checkedKeys = keys;
    }
    get options() {
        const defaultOptions = {
            checkChildren: true,
            checkParents: true,
            enabled: true,
            mode: "multiple"
        };
        if (!isPresent(this.checkable)) {
            return defaultOptions;
        }
        const isBoolean = typeof this.checkable === 'boolean';
        const checkSettings = isBoolean
            ? { enabled: this.checkable }
            : this.checkable;
        return Object.assign(defaultOptions, checkSettings);
    }
    ngOnChanges(changes) {
        if (changes.checkable) {
            this.treeView.checkboxes = this.options.enabled;
            this.toggleCheckOnClick();
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.unsubscribeClick();
    }
    isItemChecked(dataItem, index) {
        if (!this.checkKey) {
            return this.isIndexChecked(index);
        }
        const keyIndex = this.checkedKeys.indexOf(this.itemKey({ dataItem, index }));
        return keyIndex > -1 ? 'checked' : 'none';
    }
    isIndexChecked(index) {
        const checkedKeys = this.checkedKeys.filter(matchKey(index));
        if (indexChecked(checkedKeys, index)) {
            return 'checked';
        }
        const { mode, checkParents } = this.options;
        if (mode === 'multiple' && checkParents && checkedKeys.length) {
            return 'indeterminate';
        }
        return 'none';
    }
    itemKey(e) {
        if (!this.checkKey) {
            return e.index;
        }
        if (typeof this.checkKey === "string") {
            return e.dataItem[this.checkKey];
        }
        if (typeof this.checkKey === "function") {
            return this.checkKey(e);
        }
    }
    check(e) {
        const { enabled, mode } = this.options;
        const performSelection = this.checkActions[mode] || noop;
        if (!enabled) {
            return;
        }
        performSelection(e);
    }
    checkSingle(node) {
        const key = this.itemKey(node.item);
        this.checkedKeys = this.checkedKeys[0] !== key ? [key] : [];
        this.notify();
    }
    checkMultiple(node) {
        this.checkNode(node);
        if (this.options.checkParents) {
            this.checkParents(node.parent);
        }
        this.notify();
    }
    toggleCheckOnClick() {
        this.unsubscribeClick();
        if (this.options.checkOnClick) {
            this.clickSubscription = this.treeView.nodeClick.subscribe(args => {
                if (args.type === 'click') {
                    const lookup = this.treeView.itemLookup(args.item.index);
                    this.check(lookup);
                }
            });
        }
    }
    unsubscribeClick() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
    }
    checkNode(node, check) {
        const key = this.itemKey(node.item);
        const idx = this.checkedKeys.indexOf(key);
        const isChecked = idx > -1;
        const shouldCheck = check === undefined ? !isChecked : check;
        if (!isPresent(key) || (isChecked && check) || this.treeView.isDisabledNode(node)) {
            return;
        }
        if (isChecked) {
            this.checkedKeys.splice(idx, 1);
        }
        else {
            this.checkedKeys.push(key);
        }
        if (this.options.checkChildren) {
            node.children.map(n => this.checkNode(n, shouldCheck));
        }
    }
    checkParents(parent) {
        let currentParent = parent;
        while (currentParent) {
            const parentKey = this.itemKey(currentParent.item);
            const parentIndex = this.checkedKeys.indexOf(parentKey);
            if (this.allChildrenSelected(currentParent.children)) {
                if (parentIndex === -1) {
                    this.checkedKeys.push(parentKey);
                }
            }
            else if (parentIndex > -1) {
                this.checkedKeys.splice(parentIndex, 1);
            }
            currentParent = currentParent.parent;
        }
    }
    allChildrenSelected(children) {
        const isCheckedReducer = (acc, item) => (acc && this.isItemChecked(item.dataItem, item.index) === 'checked');
        return children.reduce(isCheckedReducer, true);
    }
    notify() {
        this.checkedKeysChange.emit(this.checkedKeys.slice());
    }
    addChildrenKeys(args) {
        if (this.checkedKeys.indexOf(this.itemKey(args.item)) === -1) {
            return;
        }
        const keys = args.children.reduce((acc, item) => {
            const itemKey = this.itemKey(item);
            const existingKey = this.checkedKeys.find(key => itemKey === key);
            if (!existingKey) {
                acc.push(itemKey);
            }
            return acc;
        }, []);
        if (keys.length) {
            this.checkedKeys = this.checkedKeys.concat(keys);
            this.zone.run(() => {
                this.notify();
            });
        }
    }
}
CheckDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewCheckable]' },] },
];
/** @nocollapse */
CheckDirective.ctorParameters = () => [
    { type: TreeViewComponent },
    { type: NgZone }
];
CheckDirective.propDecorators = {
    isChecked: [{ type: Input }],
    checkKey: [{ type: Input, args: ["checkBy",] }],
    checkedKeys: [{ type: Input }],
    checkable: [{ type: Input, args: ['kendoTreeViewCheckable',] }],
    checkedKeysChange: [{ type: Output }]
};
export { ɵ0, ɵ1 };
