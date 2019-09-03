import { Directive, Input } from '@angular/core';
import { isChanged } from '@progress/kendo-angular-common';
import { of } from 'rxjs';
import { getter } from './accessor';
import { compose } from './funcs';
import { TreeViewComponent } from './treeview.component';
import { isBlank, isNullOrEmptyString, isPresent } from './utils';
var findChildren = function (prop, nodes, value) { return nodes.filter(function (x) { return prop(x) === value; }); };
var ɵ0 = findChildren;
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
var FlatDataBindingDirective = /** @class */ (function () {
    function FlatDataBindingDirective(treeView) {
        this.treeView = treeView;
        this.originalData = [];
    }
    Object.defineProperty(FlatDataBindingDirective.prototype, "nodes", {
        /**
         * The nodes which will be displayed by the TreeView.
         */
        set: function (values) {
            this.originalData = values || [];
            if (!isNullOrEmptyString(this.parentIdField)) {
                var prop = getter(this.parentIdField, true);
                this.treeView.nodes = (this.originalData).filter(compose(isBlank, prop));
            }
            else {
                this.treeView.nodes = this.originalData.slice(0);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FlatDataBindingDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (isPresent(this.parentIdField) && isPresent(this.idField)) {
            var fetchChildren_1 = function (node) {
                return findChildren(getter(_this.parentIdField, true), _this.originalData || [], getter(_this.idField, true)(node));
            };
            this.treeView.hasChildren = function (node) { return fetchChildren_1(node).length > 0; };
            this.treeView.children = function (node) { return of(fetchChildren_1(node)); };
        }
    };
    /**
     * @hidden
     */
    FlatDataBindingDirective.prototype.ngOnChanges = function (changes) {
        if (isChanged("parentIdField", changes, false)) {
            this.nodes = this.originalData;
        }
    };
    FlatDataBindingDirective.decorators = [
        { type: Directive, args: [{ selector: '[kendoTreeViewFlatDataBinding]' },] },
    ];
    /** @nocollapse */
    FlatDataBindingDirective.ctorParameters = function () { return [
        { type: TreeViewComponent }
    ]; };
    FlatDataBindingDirective.propDecorators = {
        nodes: [{ type: Input }],
        parentIdField: [{ type: Input }],
        idField: [{ type: Input }]
    };
    return FlatDataBindingDirective;
}());
export { FlatDataBindingDirective };
export { ɵ0 };
