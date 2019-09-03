"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/**
 * @hidden
 */
var NodeChildrenService = /** @class */ (function () {
    function NodeChildrenService() {
        this.changes = new rxjs_1.Subject();
    }
    NodeChildrenService.prototype.childrenLoaded = function (item, children) {
        this.changes.next({ item: item, children: children });
    };
    NodeChildrenService.decorators = [
        { type: core_1.Injectable },
    ];
    return NodeChildrenService;
}());
exports.NodeChildrenService = NodeChildrenService;
