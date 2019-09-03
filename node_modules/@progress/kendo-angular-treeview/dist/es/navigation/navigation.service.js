import { Injectable } from '@angular/core';
import { Keys } from '@progress/kendo-angular-common';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Subject } from 'rxjs';
import { NavigationModel } from './navigation-model';
import { nodeIndex } from '../utils';
/**
 * @hidden
 */
var NavigationService = /** @class */ (function () {
    function NavigationService(localization) {
        var _a;
        var _this = this;
        this.localization = localization;
        this.expands = new Subject();
        this.moves = new Subject();
        this.checks = new Subject();
        this.selects = new Subject();
        this.navigable = true;
        this.actions = (_a = {},
            _a[Keys.ArrowUp] = function () { return _this.activate(_this.model.findPrev(_this.focusableItem)); },
            _a[Keys.ArrowDown] = function () { return _this.activate(_this.model.findNext(_this.focusableItem)); },
            _a[Keys.ArrowLeft] = function () { return (_this.expand({
                expand: _this.localization.rtl,
                intercept: _this.localization.rtl ? _this.moveToChild : _this.moveToParent
            })); },
            _a[Keys.ArrowRight] = function () { return (_this.expand({
                expand: !_this.localization.rtl,
                intercept: _this.localization.rtl ? _this.moveToParent : _this.moveToChild
            })); },
            _a[Keys.Home] = function () { return _this.activate(_this.model.firstNode()); },
            _a[Keys.End] = function () { return _this.activate(_this.model.lastNode()); },
            _a[Keys.Enter] = function () { return _this.navigable && _this.selectIndex(nodeIndex(_this.activeItem)); },
            _a[Keys.Space] = function () { return _this.navigable && _this.checkIndex(nodeIndex(_this.activeItem)); },
            _a);
        this.isFocused = false;
        this._model = new NavigationModel();
        this.moveToChild = this.moveToChild.bind(this);
        this.moveToParent = this.moveToParent.bind(this);
    }
    Object.defineProperty(NavigationService.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            this._model = model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "activeIndex", {
        get: function () {
            return nodeIndex(this.activeItem) || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "focusableItem", {
        get: function () {
            return this.activeItem || this.model.firstNode();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "isActiveExpanded", {
        get: function () {
            return this.activeItem && this.activeItem.children.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    NavigationService.prototype.activate = function (item) {
        if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
            return;
        }
        this.isFocused = true;
        this.activeItem = item || this.activeItem;
        this.notifyMove();
    };
    NavigationService.prototype.activateParent = function (index) {
        this.activate(this.model.findParent(index));
    };
    NavigationService.prototype.activateIndex = function (index) {
        if (!index) {
            return;
        }
        this.activate(this.model.findNode(index));
    };
    NavigationService.prototype.activateClosest = function (index) {
        if (!index || nodeIndex(this.focusableItem) !== index) {
            return;
        }
        this.activeItem = this.model.closestNode(index);
        this.notifyMove();
    };
    NavigationService.prototype.activateFocusable = function () {
        if (this.activeItem) {
            return;
        }
        this.activeItem = this.model.firstNode();
        this.notifyMove();
    };
    NavigationService.prototype.deactivate = function () {
        if (!this.navigable || !this.isFocused) {
            return;
        }
        this.isFocused = false;
        this.notifyMove();
    };
    NavigationService.prototype.checkIndex = function (index) {
        if (!this.isDisabled(index)) {
            this.checks.next(index);
        }
    };
    NavigationService.prototype.selectIndex = function (index) {
        if (!this.isDisabled(index)) {
            this.selects.next(index);
        }
    };
    NavigationService.prototype.isActive = function (index) {
        if (!index) {
            return false;
        }
        return this.isFocused && this.activeIndex === index;
    };
    NavigationService.prototype.isFocusable = function (index) {
        return nodeIndex(this.focusableItem) === index;
    };
    NavigationService.prototype.isDisabled = function (index) {
        return this.model.findNode(index).disabled;
    };
    NavigationService.prototype.registerItem = function (id, index, disabled) {
        this.model.registerItem(id, index, disabled);
    };
    NavigationService.prototype.unregisterItem = function (id, index) {
        if (this.isActive(index)) {
            this.activateParent(index);
        }
        this.model.unregisterItem(id, index);
    };
    NavigationService.prototype.move = function (e) {
        if (!this.navigable) {
            return;
        }
        var moveAction = this.actions[e.keyCode];
        if (!moveAction) {
            return;
        }
        moveAction();
        e.preventDefault();
    };
    NavigationService.prototype.expand = function (_a) {
        var expand = _a.expand, intercept = _a.intercept;
        var index = nodeIndex(this.activeItem);
        if (!index || intercept(index)) {
            return;
        }
        this.notifyExpand(expand);
    };
    NavigationService.prototype.moveToParent = function () {
        if (this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findParent(nodeIndex(this.activeItem)));
        return true;
    };
    NavigationService.prototype.moveToChild = function () {
        if (!this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findChild(nodeIndex(this.activeItem)));
        return true;
    };
    NavigationService.prototype.notifyExpand = function (expand) {
        this.expands.next(this.navigationState(expand));
    };
    NavigationService.prototype.notifyMove = function () {
        this.moves.next(this.navigationState());
    };
    NavigationService.prototype.navigationState = function (expand) {
        if (expand === void 0) { expand = false; }
        return ({ expand: expand, index: nodeIndex(this.activeItem), isFocused: this.isFocused });
    };
    NavigationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NavigationService.ctorParameters = function () { return [
        { type: LocalizationService }
    ]; };
    return NavigationService;
}());
export { NavigationService };
