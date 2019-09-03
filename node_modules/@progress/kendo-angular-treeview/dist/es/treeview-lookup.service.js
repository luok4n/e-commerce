import { Injectable } from '@angular/core';
import { nodeIndex } from './utils';
var INDEX_REGEX = /\d+$/;
/**
 * @hidden
 */
var TreeViewLookupService = /** @class */ (function () {
    function TreeViewLookupService() {
        this.map = new Map();
    }
    TreeViewLookupService.prototype.registerItem = function (item, parent) {
        var currentLookup = {
            children: [],
            item: item,
            parent: this.item(nodeIndex(parent))
        };
        this.map.set(item.index, currentLookup);
    };
    TreeViewLookupService.prototype.registerChildren = function (index, children) {
        var item = this.item(index);
        if (!item) {
            return;
        }
        item.children = children;
    };
    TreeViewLookupService.prototype.unregisterItem = function (index, dataItem) {
        var current = this.item(index);
        if (current && current.item.dataItem === dataItem) {
            this.map.delete(index);
            if (current.parent && current.parent.children) {
                current.parent.children = current.parent.children.filter(function (item) { return item.dataItem !== dataItem; });
            }
        }
    };
    TreeViewLookupService.prototype.replaceItem = function (index, item, parent) {
        if (!item) {
            return;
        }
        this.unregisterItem(index, item.dataItem);
        this.registerItem(item, parent);
        this.addToParent(item, parent);
    };
    TreeViewLookupService.prototype.itemLookup = function (index) {
        var item = this.item(index);
        if (!item) {
            return null;
        }
        return {
            children: this.mapChildren(item.children),
            item: item.item,
            parent: item.parent
        };
    };
    TreeViewLookupService.prototype.hasItem = function (index) {
        return this.map.has(index);
    };
    TreeViewLookupService.prototype.item = function (index) {
        return this.map.get(index) || null;
    };
    TreeViewLookupService.prototype.addToParent = function (item, parent) {
        if (parent) {
            var parentItem = this.item(parent.index);
            var index = parseInt(INDEX_REGEX.exec(item.index)[0], 10);
            parentItem.children = parentItem.children || [];
            parentItem.children.splice(index, 0, item);
        }
    };
    TreeViewLookupService.prototype.mapChildren = function (children) {
        var _this = this;
        if (children === void 0) { children = []; }
        return children.map(function (c) {
            var _a = _this.item(c.index), item = _a.item, parent = _a.parent, children = _a.children;
            return {
                children: _this.mapChildren(children),
                item: item,
                parent: parent
            };
        });
    };
    TreeViewLookupService.decorators = [
        { type: Injectable },
    ];
    return TreeViewLookupService;
}());
export { TreeViewLookupService };
