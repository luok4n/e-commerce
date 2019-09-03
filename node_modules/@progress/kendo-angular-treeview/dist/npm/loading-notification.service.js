"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/**
 * @hidden
 */
var LoadingNotificationService = /** @class */ (function () {
    function LoadingNotificationService() {
        this.changes = new rxjs_1.Subject();
    }
    LoadingNotificationService.prototype.notifyLoaded = function (index) {
        this.changes.next(index);
    };
    LoadingNotificationService.decorators = [
        { type: core_1.Injectable },
    ];
    return LoadingNotificationService;
}());
exports.LoadingNotificationService = LoadingNotificationService;
