"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_builder_service_1 = require("../index-builder.service");
var utils_1 = require("../utils");
var last = function (list) { return list[list.length - 1]; };
var ɵ0 = last;
exports.ɵ0 = ɵ0;
var safe = function (node) { return (node || {}); };
var ɵ1 = safe;
exports.ɵ1 = ɵ1;
var safeChildren = function (node) { return (safe(node).children || []); };
var ɵ2 = safeChildren;
exports.ɵ2 = ɵ2;
var findLast = function (node) {
    var lastNode = node;
    var children = [].concat(safeChildren(node));
    while (children.length) {
        children = children.concat(safeChildren(last(children)));
        lastNode = children.shift();
    }
    return lastNode;
};
var ɵ3 = findLast;
exports.ɵ3 = ɵ3;
/**
 * @hidden
 */
var NavigationModel = /** @class */ (function () {
    function NavigationModel() {
        this.ib = new index_builder_service_1.IndexBuilderService();
        this.nodes = [];
    }
    NavigationModel.prototype.firstNode = function () {
        return this.nodes[0] || null;
    };
    NavigationModel.prototype.lastNode = function () {
        var node = this.nodes[this.nodes.length - 1];
        if (!node) {
            return null;
        }
        return findLast(last(this.container(node))) || node;
    };
    NavigationModel.prototype.closestNode = function (index) {
        var prev = safe(this.findNode(index)).prev;
        var sibling = prev || this.firstNode();
        return safe(sibling).index === index ? this.sibling(sibling, 1) : sibling;
    };
    NavigationModel.prototype.findNode = function (index) {
        return this.find(index, this.nodes);
    };
    NavigationModel.prototype.findParent = function (index) {
        var parentLevel = this.ib.level(index) - 1;
        return this.findNode(this.ib.indexForLevel(index, parentLevel));
    };
    NavigationModel.prototype.findChild = function (index) {
        return safeChildren(this.findNode(index))[0] || null;
    };
    NavigationModel.prototype.findPrev = function (item) {
        var index = item.index;
        var parent = this.findParent(index);
        var levelIndex = this.ib.lastLevelIndex(index);
        if (levelIndex === 0) {
            return parent;
        }
        var currentNode = this.findNode(index);
        var prev = this.sibling(currentNode, -1);
        if (prev) {
            var children = this.container(prev);
            while (children.length > 0) {
                prev = last(children);
                children = this.container(prev);
            }
        }
        return prev;
    };
    NavigationModel.prototype.findNext = function (item) {
        var children = this.container(item);
        if (children.length === 0) {
            return this.sibling(item, 1);
        }
        return children[0];
    };
    NavigationModel.prototype.registerItem = function (id, index, disabled) {
        var children = [];
        var level = this.ib.level(index);
        var parent = this.findParent(index);
        if (parent || level === 1) {
            var node = { id: id, children: children, index: index, parent: parent, disabled: disabled };
            this.insert(node, parent);
        }
    };
    NavigationModel.prototype.unregisterItem = function (id, index) {
        var node = this.find(index, this.nodes);
        if (!node || node.id !== id) {
            return;
        }
        var children = this.container(node.parent);
        children.splice(children.indexOf(node), 1);
    };
    NavigationModel.prototype.childLevel = function (nodes) {
        var children = nodes.filter(function (node) { return utils_1.isPresent(node); });
        if (!children || !children.length) {
            return 1;
        }
        return this.ib.level(children[0].index);
    };
    NavigationModel.prototype.container = function (node) {
        return node ? node.children : this.nodes;
    };
    NavigationModel.prototype.find = function (index, nodes) {
        var childLevel = this.childLevel(nodes);
        var indexToMatch = this.ib.indexForLevel(index, childLevel);
        var isLeaf = childLevel === this.ib.level(index);
        var node = nodes.find(function (n) { return n && n.index === indexToMatch; });
        if (!node) {
            return null;
        }
        return isLeaf ? node : this.find(index, node.children);
    };
    NavigationModel.prototype.insert = function (node, parent) {
        var nodes = this.container(parent);
        nodes.splice(this.ib.lastLevelIndex(node.index), 0, node);
    };
    NavigationModel.prototype.sibling = function (node, offset) {
        if (!node) {
            return null;
        }
        var parent = this.findParent(node.index);
        var container = this.container(parent);
        return container[container.indexOf(node) + offset] || this.sibling(parent, offset) || null;
    };
    return NavigationModel;
}());
exports.NavigationModel = NavigationModel;
