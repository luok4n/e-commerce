import { ElementRef } from '@angular/core';
import { NavigationItem } from './navigation/navigation-item.interface';
import { TreeItem } from './treeitem.interface';
/**
 * @hidden
 */
export declare const match: (element: any, selector: string) => boolean;
/**
 * @hidden
 */
export declare const noop: () => void;
/**
 * @hidden
 */
export declare const isPresent: Function;
/**
 * @hidden
 */
export declare const isBlank: (value: any) => boolean;
/**
 * @hidden
 */
export declare const isArray: (value: any) => value is any[];
/**
 * @hidden
 */
export declare const isNullOrEmptyString: (value: string) => boolean;
/**
 * @hidden
 */
export declare const closestNode: (element: any) => HTMLElement;
/**
 * @hidden
 */
export declare const isFocusable: (element: any) => boolean;
/**
 * @hidden
 */
export declare const isContent: (element: any) => boolean;
/**
 * @hidden
 */
export declare const closest: (node: any, predicate: any) => any;
/**
 * @hidden
 */
export declare const hasParent: (element: any, container: any) => boolean;
/**
 * @hidden
 */
export declare const focusableNode: (element: ElementRef<any>) => HTMLElement;
/**
 * @hidden
 */
export declare const hasActiveNode: (target: any, node?: any) => boolean;
/**
 * @hidden
 */
export declare const nodeId: (node: HTMLElement) => string;
/**
 * @hidden
 */
export declare const nodeIndex: (item: NavigationItem | TreeItem) => string;
