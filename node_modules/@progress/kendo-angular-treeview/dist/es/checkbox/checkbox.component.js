import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2 } from '@angular/core';
import { guid } from '@progress/kendo-angular-common';
/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
var CheckBoxComponent = /** @class */ (function () {
    function CheckBoxComponent(element, renderer, changeDetector) {
        this.element = element;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        /**
         * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
         */
        this.id = "_" + guid();
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
    Object.defineProperty(CheckBoxComponent.prototype, "classWrapper", {
        //XXX: implement ComponentValueAccessor
        //XXX: focus/blur methods
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckBoxComponent.prototype, "indeterminate", {
        get: function () {
            return this.checkState === 'indeterminate';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckBoxComponent.prototype, "checked", {
        get: function () {
            return this.checkState === 'checked';
        },
        enumerable: true,
        configurable: true
    });
    CheckBoxComponent.prototype.ngOnInit = function () {
        this.renderer.removeAttribute(this.element.nativeElement, "tabindex");
    };
    CheckBoxComponent.prototype.ngDoCheck = function () {
        this.checkState = this.isChecked(this.node, this.index);
    };
    CheckBoxComponent.prototype.handleChange = function (e) {
        var state = e.target.checked ? 'checked' : 'none';
        // update the View State so that Angular updates the input if the isChecked value is the same
        this.checkState = state;
        this.changeDetector.detectChanges();
        this.checkStateChange.emit(state);
    };
    CheckBoxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kendo-checkbox',
                    template: "\n        <input\n            class=\"k-checkbox\"\n            type=\"checkbox\"\n            [id]=\"id\"\n            [checked]=\"checked\"\n            [indeterminate]=\"indeterminate\"\n            [tabindex]=\"tabindex\"\n            (change)=\"handleChange($event)\"\n        />\n        <label\n            class=\"k-checkbox-label\"\n            tabindex=\"-1\"\n            [for]=\"id\"\n        >{{labelText}}</label>\n    "
                },] },
    ];
    /** @nocollapse */
    CheckBoxComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
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
    return CheckBoxComponent;
}());
export { CheckBoxComponent };
