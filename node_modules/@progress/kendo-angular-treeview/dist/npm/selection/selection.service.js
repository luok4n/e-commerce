"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/**
 * @hidden
 */
var SelectionService = /** @class */ (function () {
    function SelectionService() {
        this.changes = new rxjs_1.Subject();
    }
    SelectionService.prototype.isFirstSelected = function (index) {
        return this.firstIndex === index;
    };
    SelectionService.prototype.setFirstSelected = function (index, selected) {
        if (this.firstIndex === index && selected === false) {
            this.firstIndex = null;
        }
        else if (!this.firstIndex && selected) {
            this.firstIndex = index;
        }
    };
    SelectionService.prototype.select = function (index, dataItem) {
        this.changes.next({ dataItem: dataItem, index: index });
    };
    SelectionService.decorators = [
        { type: core_1.Injectable },
    ];
    return SelectionService;
}());
exports.SelectionService = SelectionService;
