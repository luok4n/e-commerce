import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
export class LoadingNotificationService {
    constructor() {
        this.changes = new Subject();
    }
    notifyLoaded(index) {
        this.changes.next(index);
    }
}
LoadingNotificationService.decorators = [
    { type: Injectable },
];
