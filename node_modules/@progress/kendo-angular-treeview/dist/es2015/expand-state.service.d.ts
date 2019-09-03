import { Subject } from "rxjs";
/**
 * @hidden
 */
export declare class ExpandStateService {
    changes: Subject<{
        dataItem: any;
        expand: boolean;
        index: string;
    }>;
    expand(index: any, dataItem: any): void;
    collapse(index: any, dataItem: any): void;
}
