import { TreeItem } from './treeitem.interface';
/**
 * Arguments for the `nodeClick` event.
 */
export interface NodeClickEvent {
    /**
     * The clicked item.
     */
    item?: TreeItem;
    /**
     * The DOM event that triggered the node click event.
     */
    originalEvent?: any;
    /**
     * The event type.
     */
    type?: 'click' | 'contextmenu';
}
