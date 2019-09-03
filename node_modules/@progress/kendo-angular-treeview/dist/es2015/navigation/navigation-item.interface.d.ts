/**
 * @hidden
 */
export interface NavigationItem {
    id: number;
    children: NavigationItem[];
    index: string;
    parent: NavigationItem;
    disabled: boolean;
}
