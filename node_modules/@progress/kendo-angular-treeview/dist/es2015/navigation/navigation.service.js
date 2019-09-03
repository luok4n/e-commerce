import { Injectable } from '@angular/core';
import { Keys } from '@progress/kendo-angular-common';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Subject } from 'rxjs';
import { NavigationModel } from './navigation-model';
import { nodeIndex } from '../utils';
/**
 * @hidden
 */
export class NavigationService {
    constructor(localization) {
        this.localization = localization;
        this.expands = new Subject();
        this.moves = new Subject();
        this.checks = new Subject();
        this.selects = new Subject();
        this.navigable = true;
        this.actions = {
            [Keys.ArrowUp]: () => this.activate(this.model.findPrev(this.focusableItem)),
            [Keys.ArrowDown]: () => this.activate(this.model.findNext(this.focusableItem)),
            [Keys.ArrowLeft]: () => (this.expand({
                expand: this.localization.rtl,
                intercept: this.localization.rtl ? this.moveToChild : this.moveToParent
            })),
            [Keys.ArrowRight]: () => (this.expand({
                expand: !this.localization.rtl,
                intercept: this.localization.rtl ? this.moveToParent : this.moveToChild
            })),
            [Keys.Home]: () => this.activate(this.model.firstNode()),
            [Keys.End]: () => this.activate(this.model.lastNode()),
            [Keys.Enter]: () => this.navigable && this.selectIndex(nodeIndex(this.activeItem)),
            [Keys.Space]: () => this.navigable && this.checkIndex(nodeIndex(this.activeItem))
        };
        this.isFocused = false;
        this._model = new NavigationModel();
        this.moveToChild = this.moveToChild.bind(this);
        this.moveToParent = this.moveToParent.bind(this);
    }
    get model() {
        return this._model;
    }
    set model(model) {
        this._model = model;
    }
    get activeIndex() {
        return nodeIndex(this.activeItem) || null;
    }
    get focusableItem() {
        return this.activeItem || this.model.firstNode();
    }
    get isActiveExpanded() {
        return this.activeItem && this.activeItem.children.length > 0;
    }
    activate(item) {
        if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
            return;
        }
        this.isFocused = true;
        this.activeItem = item || this.activeItem;
        this.notifyMove();
    }
    activateParent(index) {
        this.activate(this.model.findParent(index));
    }
    activateIndex(index) {
        if (!index) {
            return;
        }
        this.activate(this.model.findNode(index));
    }
    activateClosest(index) {
        if (!index || nodeIndex(this.focusableItem) !== index) {
            return;
        }
        this.activeItem = this.model.closestNode(index);
        this.notifyMove();
    }
    activateFocusable() {
        if (this.activeItem) {
            return;
        }
        this.activeItem = this.model.firstNode();
        this.notifyMove();
    }
    deactivate() {
        if (!this.navigable || !this.isFocused) {
            return;
        }
        this.isFocused = false;
        this.notifyMove();
    }
    checkIndex(index) {
        if (!this.isDisabled(index)) {
            this.checks.next(index);
        }
    }
    selectIndex(index) {
        if (!this.isDisabled(index)) {
            this.selects.next(index);
        }
    }
    isActive(index) {
        if (!index) {
            return false;
        }
        return this.isFocused && this.activeIndex === index;
    }
    isFocusable(index) {
        return nodeIndex(this.focusableItem) === index;
    }
    isDisabled(index) {
        return this.model.findNode(index).disabled;
    }
    registerItem(id, index, disabled) {
        this.model.registerItem(id, index, disabled);
    }
    unregisterItem(id, index) {
        if (this.isActive(index)) {
            this.activateParent(index);
        }
        this.model.unregisterItem(id, index);
    }
    move(e) {
        if (!this.navigable) {
            return;
        }
        const moveAction = this.actions[e.keyCode];
        if (!moveAction) {
            return;
        }
        moveAction();
        e.preventDefault();
    }
    expand({ expand, intercept }) {
        const index = nodeIndex(this.activeItem);
        if (!index || intercept(index)) {
            return;
        }
        this.notifyExpand(expand);
    }
    moveToParent() {
        if (this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findParent(nodeIndex(this.activeItem)));
        return true;
    }
    moveToChild() {
        if (!this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findChild(nodeIndex(this.activeItem)));
        return true;
    }
    notifyExpand(expand) {
        this.expands.next(this.navigationState(expand));
    }
    notifyMove() {
        this.moves.next(this.navigationState());
    }
    navigationState(expand = false) {
        return ({ expand, index: nodeIndex(this.activeItem), isFocused: this.isFocused });
    }
}
NavigationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NavigationService.ctorParameters = () => [
    { type: LocalizationService }
];
