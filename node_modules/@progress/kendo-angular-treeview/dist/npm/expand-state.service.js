"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/**
 * @hidden
 */
var ExpandStateService = /** @class */ (function () {
    function ExpandStateService() {
        this.changes = new rxjs_1.Subject();
    }
    ExpandStateService.prototype.expand = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index, expand: true });
    };
    ExpandStateService.prototype.collapse = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index, expand: false });
    };
    ExpandStateService.decorators = [
        { type: core_1.Injectable },
    ];
    return ExpandStateService;
}());
exports.ExpandStateService = ExpandStateService;
