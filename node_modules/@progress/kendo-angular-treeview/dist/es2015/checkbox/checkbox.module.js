import { NgModule } from '@angular/core';
import { CheckBoxComponent } from './checkbox.component';
const COMPONENT_DIRECTIVES = [
    CheckBoxComponent
];
/**
 * @hidden
 *
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the CheckBox component.
 */
export class CheckBoxModule {
}
CheckBoxModule.decorators = [
    { type: NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES],
                exports: [COMPONENT_DIRECTIVES]
            },] },
];
