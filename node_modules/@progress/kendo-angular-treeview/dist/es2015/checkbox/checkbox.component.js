import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2 } from '@angular/core';
import { guid } from '@progress/kendo-angular-common';
/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
export class CheckBoxComponent {
    constructor(element, renderer, changeDetector) {
        this.element = element;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        /**
         * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
         */
        this.id = `_${guid()}`;
        /**
         * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabindex = 0;
        /**
         * Fires when the user changes the check state of the component.
         */
        this.checkStateChange = new EventEmitter();
        this.checkState = 'none';
    }
    //XXX: implement ComponentValueAccessor
    //XXX: focus/blur methods
    get classWrapper() { return true; }
    get indeterminate() {
        return this.checkState === 'indeterminate';
    }
    get checked() {
        return this.checkState === 'checked';
    }
    ngOnInit() {
        this.renderer.removeAttribute(this.element.nativeElement, "tabindex");
    }
    ngDoCheck() {
        this.checkState = this.isChecked(this.node, this.index);
    }
    handleChange(e) {
        const state = e.target.checked ? 'checked' : 'none';
        // update the View State so that Angular updates the input if the isChecked value is the same
        this.checkState = state;
        this.changeDetector.detectChanges();
        this.checkStateChange.emit(state);
    }
}
CheckBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-checkbox',
                template: `
        <input
            class="k-checkbox"
            type="checkbox"
            [id]="id"
            [checked]="checked"
            [indeterminate]="indeterminate"
            [tabindex]="tabindex"
            (change)="handleChange($event)"
        />
        <label
            class="k-checkbox-label"
            tabindex="-1"
            [for]="id"
        >{{labelText}}</label>
    `
            },] },
];
/** @nocollapse */
CheckBoxComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
CheckBoxComponent.propDecorators = {
    classWrapper: [{ type: HostBinding, args: ['class.k-checkbox-wrapper',] }],
    id: [{ type: Input }],
    isChecked: [{ type: Input }],
    node: [{ type: Input }],
    index: [{ type: Input }],
    labelText: [{ type: Input }],
    tabindex: [{ type: Input }],
    checkStateChange: [{ type: Output }]
};
