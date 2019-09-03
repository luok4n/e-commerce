import { EventEmitter } from '@angular/core';
/**
 * @hidden
 */
export declare class DataChangeNotificationService {
    readonly changes: EventEmitter<void>;
    notify(): void;
}
