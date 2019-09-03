import { EventEmitter } from '@angular/core';
/**
 * @hidden
 */
export class DataChangeNotificationService {
    constructor() {
        this.changes = new EventEmitter();
    }
    notify() {
        this.changes.emit();
    }
}
