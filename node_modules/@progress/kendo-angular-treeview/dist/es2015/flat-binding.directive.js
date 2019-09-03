import { Directive, Input } from '@angular/core';
import { isChanged } from '@progress/kendo-angular-common';
import { of } from 'rxjs';
import { getter } from './accessor';
import { compose } from './funcs';
import { TreeViewComponent } from './treeview.component';
import { isBlank, isNullOrEmptyString, isPresent } from './utils';
const findChildren = (prop, nodes, value) => nodes.filter(x => prop(x) === value);
const ɵ0 = findChildren;
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
export class FlatDataBindingDirective {
    constructor(treeView) {
        this.treeView = treeView;
        this.originalData = [];
    }
    /**
     * The nodes which will be displayed by the TreeView.
     */
    set nodes(values) {
        this.originalData = values || [];
        if (!isNullOrEmptyString(this.parentIdField)) {
            const prop = getter(this.parentIdField, true);
            this.treeView.nodes = (this.originalData).filter(compose(isBlank, prop));
        }
        else {
            this.treeView.nodes = this.originalData.slice(0);
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (isPresent(this.parentIdField) && isPresent(this.idField)) {
            const fetchChildren = node => findChildren(getter(this.parentIdField, true), this.originalData || [], getter(this.idField, true)(node));
            this.treeView.hasChildren = node => fetchChildren(node).length > 0;
            this.treeView.children = node => of(fetchChildren(node));
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        if (isChanged("parentIdField", changes, false)) {
            this.nodes = this.originalData;
        }
    }
}
FlatDataBindingDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewFlatDataBinding]' },] },
];
/** @nocollapse */
FlatDataBindingDirective.ctorParameters = () => [
    { type: TreeViewComponent }
];
FlatDataBindingDirective.propDecorators = {
    nodes: [{ type: Input }],
    parentIdField: [{ type: Input }],
    idField: [{ type: Input }]
};
export { ɵ0 };
