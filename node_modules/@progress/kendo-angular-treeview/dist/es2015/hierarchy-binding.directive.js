import { Directive, Input } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { getter } from './accessor';
import { isPresent } from './utils';
import { of } from 'rxjs';
/**
 * A directive which encapsulates the retrieval of child nodes.
 */
export class HierarchyBindingDirective {
    constructor(treeView) {
        this.treeView = treeView;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    set childrenField(value) {
        if (!value) {
            throw new Error("'childrenField' cannot be empty");
        }
        this._childrenField = value;
    }
    /**
     * The field name which holds the data items of the child component.
     */
    get childrenField() {
        return this._childrenField;
    }
    ngOnInit() {
        if (isPresent(this.childrenField)) {
            this.treeView.children = item => of(getter(this.childrenField, true)(item));
            this.treeView.hasChildren = item => {
                const children = getter(this.childrenField, true)(item);
                return Boolean(children && children.length);
            };
        }
    }
}
HierarchyBindingDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewHierarchyBinding]' },] },
];
/** @nocollapse */
HierarchyBindingDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
HierarchyBindingDirective.propDecorators = {
    childrenField: [{ type: Input }]
};
