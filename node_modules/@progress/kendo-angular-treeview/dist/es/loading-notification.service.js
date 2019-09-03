import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
var LoadingNotificationService = /** @class */ (function () {
    function LoadingNotificationService() {
        this.changes = new Subject();
    }
    LoadingNotificationService.prototype.notifyLoaded = function (index) {
        this.changes.next(index);
    };
    LoadingNotificationService.decorators = [
        { type: Injectable },
    ];
    return LoadingNotificationService;
}());
export { LoadingNotificationService };
