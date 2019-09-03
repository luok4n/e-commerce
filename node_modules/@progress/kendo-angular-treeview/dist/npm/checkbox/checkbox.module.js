"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var checkbox_component_1 = require("./checkbox.component");
var COMPONENT_DIRECTIVES = [
    checkbox_component_1.CheckBoxComponent
];
/**
 * @hidden
 *
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the CheckBox component.
 */
var CheckBoxModule = /** @class */ (function () {
    function CheckBoxModule() {
    }
    CheckBoxModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [COMPONENT_DIRECTIVES],
                    exports: [COMPONENT_DIRECTIVES]
                },] },
    ];
    return CheckBoxModule;
}());
exports.CheckBoxModule = CheckBoxModule;
