import { IndexBuilderService } from '../index-builder.service';
import { isPresent } from '../utils';
const last = (list) => list[list.length - 1];
const ɵ0 = last;
const safe = node => (node || {});
const ɵ1 = safe;
const safeChildren = node => (safe(node).children || []);
const ɵ2 = safeChildren;
const findLast = node => {
    let lastNode = node;
    let children = [].concat(safeChildren(node));
    while (children.length) {
        children = children.concat(safeChildren(last(children)));
        lastNode = children.shift();
    }
    return lastNode;
};
const ɵ3 = findLast;
/**
 * @hidden
 */
export class NavigationModel {
    constructor() {
        this.ib = new IndexBuilderService();
        this.nodes = [];
    }
    firstNode() {
        return this.nodes[0] || null;
    }
    lastNode() {
        const node = this.nodes[this.nodes.length - 1];
        if (!node) {
            return null;
        }
        return findLast(last(this.container(node))) || node;
    }
    closestNode(index) {
        const { prev } = safe(this.findNode(index));
        const sibling = prev || this.firstNode();
        return safe(sibling).index === index ? this.sibling(sibling, 1) : sibling;
    }
    findNode(index) {
        return this.find(index, this.nodes);
    }
    findParent(index) {
        const parentLevel = this.ib.level(index) - 1;
        return this.findNode(this.ib.indexForLevel(index, parentLevel));
    }
    findChild(index) {
        return safeChildren(this.findNode(index))[0] || null;
    }
    findPrev(item) {
        const index = item.index;
        const parent = this.findParent(index);
        const levelIndex = this.ib.lastLevelIndex(index);
        if (levelIndex === 0) {
            return parent;
        }
        const currentNode = this.findNode(index);
        let prev = this.sibling(currentNode, -1);
        if (prev) {
            let children = this.container(prev);
            while (children.length > 0) {
                prev = last(children);
                children = this.container(prev);
            }
        }
        return prev;
    }
    findNext(item) {
        const children = this.container(item);
        if (children.length === 0) {
            return this.sibling(item, 1);
        }
        return children[0];
    }
    registerItem(id, index, disabled) {
        const children = [];
        const level = this.ib.level(index);
        const parent = this.findParent(index);
        if (parent || level === 1) {
            const node = { id, children, index, parent, disabled };
            this.insert(node, parent);
        }
    }
    unregisterItem(id, index) {
        const node = this.find(index, this.nodes);
        if (!node || node.id !== id) {
            return;
        }
        const children = this.container(node.parent);
        children.splice(children.indexOf(node), 1);
    }
    childLevel(nodes) {
        const children = nodes.filter(node => isPresent(node));
        if (!children || !children.length) {
            return 1;
        }
        return this.ib.level(children[0].index);
    }
    container(node) {
        return node ? node.children : this.nodes;
    }
    find(index, nodes) {
        const childLevel = this.childLevel(nodes);
        const indexToMatch = this.ib.indexForLevel(index, childLevel);
        const isLeaf = childLevel === this.ib.level(index);
        const node = nodes.find(n => n && n.index === indexToMatch);
        if (!node) {
            return null;
        }
        return isLeaf ? node : this.find(index, node.children);
    }
    insert(node, parent) {
        const nodes = this.container(parent);
        nodes.splice(this.ib.lastLevelIndex(node.index), 0, node);
    }
    sibling(node, offset) {
        if (!node) {
            return null;
        }
        const parent = this.findParent(node.index);
        const container = this.container(parent);
        return container[container.indexOf(node) + offset] || this.sibling(parent, offset) || null;
    }
}
export { ɵ0, ɵ1, ɵ2, ɵ3 };
