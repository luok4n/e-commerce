import { NavigationItem } from './navigation-item.interface';
/**
 * @hidden
 */
export declare class NavigationModel {
    private ib;
    private nodes;
    firstNode(): NavigationItem;
    lastNode(): NavigationItem;
    closestNode(index: string): NavigationItem;
    findNode(index: string): NavigationItem;
    findParent(index: string): NavigationItem;
    findChild(index: string): NavigationItem;
    findPrev(item: NavigationItem): NavigationItem;
    findNext(item: NavigationItem): NavigationItem;
    registerItem(id: number, index: string, disabled: boolean): void;
    unregisterItem(id: number, index: string): void;
    private childLevel;
    private container;
    private find;
    private insert;
    private sibling;
}
