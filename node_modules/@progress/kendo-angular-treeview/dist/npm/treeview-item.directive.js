"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var navigation_service_1 = require("./navigation/navigation.service");
var selection_service_1 = require("./selection/selection.service");
var expand_state_service_1 = require("./expand-state.service");
var index_builder_service_1 = require("./index-builder.service");
var treeview_lookup_service_1 = require("./treeview-lookup.service");
var utils_1 = require("./utils");
var operators_1 = require("rxjs/operators");
var buildItem = function (index, dataItem) { return ({ dataItem: dataItem, index: index }); };
var ɵ0 = buildItem;
exports.ɵ0 = ɵ0;
var id = 0;
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
var TreeViewItemDirective = /** @class */ (function () {
    function TreeViewItemDirective(element, expandService, navigationService, selectionService, lookupService, renderer, ib) {
        this.element = element;
        this.expandService = expandService;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.lookupService = lookupService;
        this.renderer = renderer;
        this.ib = ib;
        this.isDisabled = false;
        this.ariaChecked = 'false';
        this.id = id++;
        this.isInitialized = false;
        this.subscriptions = [];
        this.subscribe();
    }
    Object.defineProperty(TreeViewItemDirective.prototype, "isChecked", {
        set: function (checked) {
            if (checked === 'checked') {
                this.ariaChecked = 'true';
            }
            else if (checked === 'indeterminate') {
                this.ariaChecked = 'mixed';
            }
            else {
                this.ariaChecked = 'false';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "isExpanded", {
        get: function () {
            return this._isExpanded || false;
        },
        set: function (isExpanded) {
            this._isExpanded = isExpanded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "isSelected", {
        get: function () {
            return this._isSelected || false;
        },
        set: function (isSelected) {
            this._isSelected = isSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "treeItem", {
        get: function () {
            return buildItem(this.index, this.dataItem);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewItemDirective.prototype, "parentTreeItem", {
        get: function () {
            return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
        },
        enumerable: true,
        configurable: true
    });
    TreeViewItemDirective.prototype.ngOnInit = function () {
        this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
        this.registerNavigationItem();
        this.isInitialized = true;
        this.setAttribute('role', 'treeitem');
        this.setAriaAttributes();
        this.setDisabledClass();
        this.updateTabIndex();
    };
    TreeViewItemDirective.prototype.ngOnChanges = function (changes) {
        var index = changes.index, isDisabled = changes.isDisabled;
        if (index || changes.isChecked || changes.isExpanded || changes.isSelected) {
            this.setAriaAttributes();
        }
        if (isDisabled) {
            this.setDisabledClass();
        }
        this.moveLookupItem(changes);
        this.moveNavigationItem(index);
        this.disableNavigationItem(isDisabled);
    };
    TreeViewItemDirective.prototype.ngOnDestroy = function () {
        this.navigationService.unregisterItem(this.id, this.index);
        this.lookupService.unregisterItem(this.index, this.dataItem);
        this.subscriptions = this.subscriptions.reduce(function (list, callback) { return (callback.unsubscribe(), list); }, []);
    };
    TreeViewItemDirective.prototype.subscribe = function () {
        var _this = this;
        this.subscriptions = [
            this.navigationService.moves
                .subscribe(function () {
                _this.updateTabIndex();
                _this.focusItem();
            }),
            this.navigationService.expands
                .pipe(operators_1.filter(function (_a) {
                var index = _a.index;
                return index === _this.index && !_this.isDisabled;
            }))
                .subscribe(function (_a) {
                var expand = _a.expand;
                return _this.expand(expand);
            })
        ];
    };
    TreeViewItemDirective.prototype.registerNavigationItem = function () {
        this.navigationService.registerItem(this.id, this.index, this.isDisabled);
        this.activateItem();
    };
    TreeViewItemDirective.prototype.activateItem = function () {
        if (this.isDisabled) {
            return;
        }
        var navigationService = this.navigationService;
        var selectionService = this.selectionService;
        var index = this.index;
        selectionService.setFirstSelected(index, this.isSelected);
        if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
            navigationService.activateIndex(index);
        }
    };
    TreeViewItemDirective.prototype.expand = function (shouldExpand) {
        this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
    };
    TreeViewItemDirective.prototype.isFocusable = function () {
        return !this.isDisabled && this.navigationService.isFocusable(this.index);
    };
    TreeViewItemDirective.prototype.focusItem = function () {
        if (this.isInitialized && this.navigationService.isActive(this.index)) {
            this.element.nativeElement.focus();
        }
    };
    TreeViewItemDirective.prototype.moveLookupItem = function (changes) {
        if (changes === void 0) { changes = {}; }
        var dataItem = changes.dataItem, index = changes.index, parentDataItem = changes.parentDataItem, parentIndex = changes.parentIndex;
        if ((index && index.firstChange) || //skip first change
            (!dataItem && !index && !parentDataItem && !parentIndex)) {
            return;
        }
        var oldIndex = (index || {}).previousValue || this.index;
        this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
    };
    TreeViewItemDirective.prototype.moveNavigationItem = function (indexChange) {
        if (indexChange === void 0) { indexChange = {}; }
        var currentValue = indexChange.currentValue, firstChange = indexChange.firstChange, previousValue = indexChange.previousValue;
        if (!firstChange && utils_1.isPresent(currentValue) && utils_1.isPresent(previousValue)) {
            this.navigationService.unregisterItem(this.id, previousValue);
            this.navigationService.registerItem(this.id, currentValue, this.isDisabled);
        }
    };
    TreeViewItemDirective.prototype.disableNavigationItem = function (disableChange) {
        if (!disableChange || disableChange.firstChange) {
            return;
        }
        var service = this.navigationService;
        if (this.isDisabled) {
            service.activateClosest(this.index); //activate before unregister the item
        }
        else {
            service.activateFocusable();
        }
        service.unregisterItem(this.id, this.index);
        service.registerItem(this.id, this.index, this.isDisabled);
    };
    TreeViewItemDirective.prototype.setAriaAttributes = function () {
        this.setAttribute('aria-level', this.ib.level(this.index).toString());
        this.setAttribute('aria-expanded', this.isExpanded.toString());
        this.setAttribute('aria-selected', this.isSelected.toString());
        this.setAttribute('aria-checked', this.ariaChecked);
    };
    TreeViewItemDirective.prototype.setDisabledClass = function () {
        this.setClass('k-state-disabled', this.isDisabled);
    };
    TreeViewItemDirective.prototype.setClass = function (className, toggle) {
        var action = toggle ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    };
    TreeViewItemDirective.prototype.updateTabIndex = function () {
        this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
    };
    TreeViewItemDirective.prototype.setAttribute = function (attr, value) {
        this.renderer.setAttribute(this.element.nativeElement, attr, value);
    };
    TreeViewItemDirective.decorators = [
        { type: core_1.Directive, args: [{ selector: '[kendoTreeViewItem]' },] },
    ];
    /** @nocollapse */
    TreeViewItemDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef },
        { type: expand_state_service_1.ExpandStateService },
        { type: navigation_service_1.NavigationService },
        { type: selection_service_1.SelectionService },
        { type: treeview_lookup_service_1.TreeViewLookupService },
        { type: core_1.Renderer2 },
        { type: index_builder_service_1.IndexBuilderService }
    ]; };
    TreeViewItemDirective.propDecorators = {
        dataItem: [{ type: core_1.Input }],
        index: [{ type: core_1.Input }],
        parentDataItem: [{ type: core_1.Input }],
        parentIndex: [{ type: core_1.Input }],
        isChecked: [{ type: core_1.Input }],
        isDisabled: [{ type: core_1.Input }],
        isExpanded: [{ type: core_1.Input }],
        isSelected: [{ type: core_1.Input }]
    };
    return TreeViewItemDirective;
}());
exports.TreeViewItemDirective = TreeViewItemDirective;
