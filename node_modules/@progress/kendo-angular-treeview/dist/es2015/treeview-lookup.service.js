import { Injectable } from '@angular/core';
import { nodeIndex } from './utils';
const INDEX_REGEX = /\d+$/;
/**
 * @hidden
 */
export class TreeViewLookupService {
    constructor() {
        this.map = new Map();
    }
    registerItem(item, parent) {
        const currentLookup = {
            children: [],
            item,
            parent: this.item(nodeIndex(parent))
        };
        this.map.set(item.index, currentLookup);
    }
    registerChildren(index, children) {
        const item = this.item(index);
        if (!item) {
            return;
        }
        item.children = children;
    }
    unregisterItem(index, dataItem) {
        const current = this.item(index);
        if (current && current.item.dataItem === dataItem) {
            this.map.delete(index);
            if (current.parent && current.parent.children) {
                current.parent.children = current.parent.children.filter(item => item.dataItem !== dataItem);
            }
        }
    }
    replaceItem(index, item, parent) {
        if (!item) {
            return;
        }
        this.unregisterItem(index, item.dataItem);
        this.registerItem(item, parent);
        this.addToParent(item, parent);
    }
    itemLookup(index) {
        const item = this.item(index);
        if (!item) {
            return null;
        }
        return {
            children: this.mapChildren(item.children),
            item: item.item,
            parent: item.parent
        };
    }
    hasItem(index) {
        return this.map.has(index);
    }
    item(index) {
        return this.map.get(index) || null;
    }
    addToParent(item, parent) {
        if (parent) {
            const parentItem = this.item(parent.index);
            const index = parseInt(INDEX_REGEX.exec(item.index)[0], 10);
            parentItem.children = parentItem.children || [];
            parentItem.children.splice(index, 0, item);
        }
    }
    mapChildren(children = []) {
        return children.map(c => {
            const { item, parent, children } = this.item(c.index);
            return {
                children: this.mapChildren(children),
                item,
                parent
            };
        });
    }
}
TreeViewLookupService.decorators = [
    { type: Injectable },
];
