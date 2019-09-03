/**
 * Represents a TreeView node.
 */
export interface TreeItem {
    /**
     * The data item that is bound to the TreeView node
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    dataItem: any;
    /**
     * The auto-generated hierarchical index of the TreeView node
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    index: string;
}
