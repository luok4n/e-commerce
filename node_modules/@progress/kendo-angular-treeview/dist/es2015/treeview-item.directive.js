import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { isPresent } from './utils';
import { filter } from 'rxjs/operators';
const buildItem = (index, dataItem) => ({ dataItem, index });
const ɵ0 = buildItem;
let id = 0;
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
export class TreeViewItemDirective {
    constructor(element, expandService, navigationService, selectionService, lookupService, renderer, ib) {
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
    set isChecked(checked) {
        if (checked === 'checked') {
            this.ariaChecked = 'true';
        }
        else if (checked === 'indeterminate') {
            this.ariaChecked = 'mixed';
        }
        else {
            this.ariaChecked = 'false';
        }
    }
    get isExpanded() {
        return this._isExpanded || false;
    }
    set isExpanded(isExpanded) {
        this._isExpanded = isExpanded;
    }
    get isSelected() {
        return this._isSelected || false;
    }
    set isSelected(isSelected) {
        this._isSelected = isSelected;
    }
    get treeItem() {
        return buildItem(this.index, this.dataItem);
    }
    get parentTreeItem() {
        return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
    }
    ngOnInit() {
        this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
        this.registerNavigationItem();
        this.isInitialized = true;
        this.setAttribute('role', 'treeitem');
        this.setAriaAttributes();
        this.setDisabledClass();
        this.updateTabIndex();
    }
    ngOnChanges(changes) {
        const { index, isDisabled } = changes;
        if (index || changes.isChecked || changes.isExpanded || changes.isSelected) {
            this.setAriaAttributes();
        }
        if (isDisabled) {
            this.setDisabledClass();
        }
        this.moveLookupItem(changes);
        this.moveNavigationItem(index);
        this.disableNavigationItem(isDisabled);
    }
    ngOnDestroy() {
        this.navigationService.unregisterItem(this.id, this.index);
        this.lookupService.unregisterItem(this.index, this.dataItem);
        this.subscriptions = this.subscriptions.reduce((list, callback) => (callback.unsubscribe(), list), []);
    }
    subscribe() {
        this.subscriptions = [
            this.navigationService.moves
                .subscribe(() => {
                this.updateTabIndex();
                this.focusItem();
            }),
            this.navigationService.expands
                .pipe(filter(({ index }) => index === this.index && !this.isDisabled))
                .subscribe(({ expand }) => this.expand(expand))
        ];
    }
    registerNavigationItem() {
        this.navigationService.registerItem(this.id, this.index, this.isDisabled);
        this.activateItem();
    }
    activateItem() {
        if (this.isDisabled) {
            return;
        }
        const navigationService = this.navigationService;
        const selectionService = this.selectionService;
        const index = this.index;
        selectionService.setFirstSelected(index, this.isSelected);
        if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
            navigationService.activateIndex(index);
        }
    }
    expand(shouldExpand) {
        this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
    }
    isFocusable() {
        return !this.isDisabled && this.navigationService.isFocusable(this.index);
    }
    focusItem() {
        if (this.isInitialized && this.navigationService.isActive(this.index)) {
            this.element.nativeElement.focus();
        }
    }
    moveLookupItem(changes = {}) {
        const { dataItem, index, parentDataItem, parentIndex } = changes;
        if ((index && index.firstChange) || //skip first change
            (!dataItem && !index && !parentDataItem && !parentIndex)) {
            return;
        }
        const oldIndex = (index || {}).previousValue || this.index;
        this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
    }
    moveNavigationItem(indexChange = {}) {
        const { currentValue, firstChange, previousValue } = indexChange;
        if (!firstChange && isPresent(currentValue) && isPresent(previousValue)) {
            this.navigationService.unregisterItem(this.id, previousValue);
            this.navigationService.registerItem(this.id, currentValue, this.isDisabled);
        }
    }
    disableNavigationItem(disableChange) {
        if (!disableChange || disableChange.firstChange) {
            return;
        }
        const service = this.navigationService;
        if (this.isDisabled) {
            service.activateClosest(this.index); //activate before unregister the item
        }
        else {
            service.activateFocusable();
        }
        service.unregisterItem(this.id, this.index);
        service.registerItem(this.id, this.index, this.isDisabled);
    }
    setAriaAttributes() {
        this.setAttribute('aria-level', this.ib.level(this.index).toString());
        this.setAttribute('aria-expanded', this.isExpanded.toString());
        this.setAttribute('aria-selected', this.isSelected.toString());
        this.setAttribute('aria-checked', this.ariaChecked);
    }
    setDisabledClass() {
        this.setClass('k-state-disabled', this.isDisabled);
    }
    setClass(className, toggle) {
        const action = toggle ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
    updateTabIndex() {
        this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
    }
    setAttribute(attr, value) {
        this.renderer.setAttribute(this.element.nativeElement, attr, value);
    }
}
TreeViewItemDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewItem]' },] },
];
/** @nocollapse */
TreeViewItemDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ExpandStateService },
    { type: NavigationService },
    { type: SelectionService },
    { type: TreeViewLookupService },
    { type: Renderer2 },
    { type: IndexBuilderService }
];
TreeViewItemDirective.propDecorators = {
    dataItem: [{ type: Input }],
    index: [{ type: Input }],
    parentDataItem: [{ type: Input }],
    parentIndex: [{ type: Input }],
    isChecked: [{ type: Input }],
    isDisabled: [{ type: Input }],
    isExpanded: [{ type: Input }],
    isSelected: [{ type: Input }]
};
export { ɵ0 };
