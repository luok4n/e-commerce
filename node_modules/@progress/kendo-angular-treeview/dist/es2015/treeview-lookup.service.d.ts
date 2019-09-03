import { TreeItem } from './treeitem.interface';
import { ItemLookup, TreeItemLookup } from './treeitem-lookup.interface';
/**
 * @hidden
 */
export declare class TreeViewLookupService {
    private map;
    registerItem(item: TreeItem, parent?: TreeItem): void;
    registerChildren(index: string, children: TreeItem[]): void;
    unregisterItem(index: string, dataItem: any): void;
    replaceItem(index: string, item: TreeItem, parent?: TreeItem): void;
    itemLookup(index: string): TreeItemLookup;
    hasItem(index: string): boolean;
    item(index: string): ItemLookup;
    private addToParent;
    private mapChildren;
}
