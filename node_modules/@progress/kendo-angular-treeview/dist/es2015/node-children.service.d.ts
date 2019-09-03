import { Subject } from "rxjs";
import { TreeItem } from './treeitem.interface';
/**
 * @hidden
 */
export declare class NodeChildrenService {
    changes: Subject<{
        item: TreeItem;
        children: TreeItem[];
    }>;
    childrenLoaded(item: TreeItem, children: TreeItem[]): void;
}
