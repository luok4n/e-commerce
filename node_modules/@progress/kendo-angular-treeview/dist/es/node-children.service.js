import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
var NodeChildrenService = /** @class */ (function () {
    function NodeChildrenService() {
        this.changes = new Subject();
    }
    NodeChildrenService.prototype.childrenLoaded = function (item, children) {
        this.changes.next({ item: item, children: children });
    };
    NodeChildrenService.decorators = [
        { type: Injectable },
    ];
    return NodeChildrenService;
}());
export { NodeChildrenService };
