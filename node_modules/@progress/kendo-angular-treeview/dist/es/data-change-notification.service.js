import { EventEmitter } from '@angular/core';
/**
 * @hidden
 */
var DataChangeNotificationService = /** @class */ (function () {
    function DataChangeNotificationService() {
        this.changes = new EventEmitter();
    }
    DataChangeNotificationService.prototype.notify = function () {
        this.changes.emit();
    };
    return DataChangeNotificationService;
}());
export { DataChangeNotificationService };
