import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
export class TreeViewItemContentDirective {
    constructor(element, navigationService, selectionService, renderer) {
        this.element = element;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.renderer = renderer;
        this.initialSelection = false;
        this.subscriptions = new Subscription(() => { });
        this.subscriptions.add(this.navigationService.moves
            .subscribe(this.updateItem.bind(this)));
        this.subscriptions.add(this.navigationService.selects
            .pipe(filter((index) => index === this.index))
            .subscribe((index) => this.selectionService.select(index, this.dataItem)));
        this.subscriptions.add(this.selectionService.changes
            .subscribe(() => {
            this.updateSelection(this.isSelected(this.dataItem, this.index));
        }));
    }
    ngOnChanges(changes) {
        if (changes.initialSelection) {
            this.updateSelection(this.initialSelection);
        }
    }
    ngOnInit() {
        this.updateSelection(this.initialSelection);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    updateItem() {
        this.render(this.navigationService.isActive(this.index), 'k-state-focused');
    }
    updateSelection(selected) {
        this.render(selected, 'k-state-selected');
    }
    render(addClass, className) {
        const action = addClass ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
}
TreeViewItemContentDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewItemContent]' },] },
];
/** @nocollapse */
TreeViewItemContentDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NavigationService },
    { type: SelectionService },
    { type: Renderer2 }
];
TreeViewItemContentDirective.propDecorators = {
    dataItem: [{ type: Input }],
    index: [{ type: Input }],
    initialSelection: [{ type: Input }],
    isSelected: [{ type: Input }]
};
