import { Subject } from "rxjs";
/**
 * @hidden
 */
export declare class LoadingNotificationService {
    changes: Subject<string>;
    notifyLoaded(index: string): void;
}
