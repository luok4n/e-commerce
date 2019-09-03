"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var kendo_angular_common_1 = require("@progress/kendo-angular-common");
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
        this.id = "_" + kendo_angular_common_1.guid();
        /**
         * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabindex = 0;
        /**
         * Fires when the user changes the check state of the component.
         */
        this.checkStateChange = new core_1.EventEmitter();
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
        { type: core_1.Component, args: [{
                    selector: 'kendo-checkbox',
                    template: "\n        <input\n            class=\"k-checkbox\"\n            type=\"checkbox\"\n            [id]=\"id\"\n            [checked]=\"checked\"\n            [indeterminate]=\"indeterminate\"\n            [tabindex]=\"tabindex\"\n            (change)=\"handleChange($event)\"\n        />\n        <label\n            class=\"k-checkbox-label\"\n            tabindex=\"-1\"\n            [for]=\"id\"\n        >{{labelText}}</label>\n    "
                },] },
    ];
    /** @nocollapse */
    CheckBoxComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef },
        { type: core_1.Renderer2 },
        { type: core_1.ChangeDetectorRef }
    ]; };
    CheckBoxComponent.propDecorators = {
        classWrapper: [{ type: core_1.HostBinding, args: ['class.k-checkbox-wrapper',] }],
        id: [{ type: core_1.Input }],
        isChecked: [{ type: core_1.Input }],
        node: [{ type: core_1.Input }],
        index: [{ type: core_1.Input }],
        labelText: [{ type: core_1.Input }],
        tabindex: [{ type: core_1.Input }],
        checkStateChange: [{ type: core_1.Output }]
    };
    return CheckBoxComponent;
}());
exports.CheckBoxComponent = CheckBoxComponent;
