"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * @hidden
 */
var DataChangeNotificationService = /** @class */ (function () {
    function DataChangeNotificationService() {
        this.changes = new core_1.EventEmitter();
    }
    DataChangeNotificationService.prototype.notify = function () {
        this.changes.emit();
    };
    return DataChangeNotificationService;
}());
exports.DataChangeNotificationService = DataChangeNotificationService;
