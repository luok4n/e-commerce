import { TreeItem } from './treeitem.interface';
/**
 * Represents a node-tree lookup structure which persists information about the current node and about its parent and children nodes.
 */
export interface ItemLookup {
    /**
     * The current TreeItem instance
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    item: TreeItem;
    /**
     * The children of the current node
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    children?: TreeItem[];
    /**
     * The parent of the current node
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    parent?: ItemLookup;
}
/**
 * Represents a node-tree lookup structure which persists information about the current node and about its parent and children nodes.
 * Used in the [`checkedChange`]({% slug api_treeview_treeviewcomponent %}#toc-checkedchange) event of the TreeView.
 */
export interface TreeItemLookup {
    /**
     *  The current TreeItem instance.
     */
    item: TreeItem;
    /**
     * The lookup details for the parent of the current TreeView node.
     */
    parent?: ItemLookup;
    /**
     *  The lookup details for the children of the current TreeView node.
     */
    children?: TreeItemLookup[];
}
