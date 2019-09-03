import { CheckMode } from './check-mode';
/**
 * The checkable settings of the TreeView
 * ([see example]({% slug checkboxes_treeview %})).
 *
 * @example
 * {% meta height:550 %}
 * ```ts-preview
 * import { Component } from '@angular/core';
 *
 * import { of } from 'rxjs';
 *
 * _@Component({
 *     selector: 'my-app',
 *     template: `
 *         <fieldset>
 *             <legend>Check Settings</legend>
 *             <div class="k-form-field">
 *                 <span>Mode</span>
 *                 <input type="radio" name="checkMode" id="singleCheck" value="single" class="k-radio"
 *                     [(ngModel)]="checkMode" />
 *                 <label class="k-radio-label" for="singleCheck">Single</label>
 *                 <input type="radio" name="checkMode" id="multipleCheck" value="multiple" class="k-radio"
 *                     [(ngModel)]="checkMode" />
 *                 <label class="k-radio-label" for="multipleCheck">Multiple</label>
 *             </div>
 *             <label class="k-form-field">
 *                 <input
 *                     type="checkbox"
 *                     id="checkChildren"
 *                     class="k-checkbox"
 *                     [(ngModel)]="checkChildren"
 *                 />
 *                 <label class="k-checkbox-label" for="checkChildren">Check all children</label>
 *             </label>
 *             <label class="k-form-field">
 *                 <input
 *                     type="checkbox"
 *                     id="checkParents"
 *                     class="k-checkbox"
 *                     [(ngModel)]="checkParents"
 *                 />
 *                 <label class="k-checkbox-label" for="checkParents">Check all parents when children are checked</label>
 *             </label>
 *         </fieldset>
 *         <br />
 *         <kendo-treeview
 *             [nodes]="data"
 *             [children]="children"
 *             [hasChildren]="hasChildren"
 *             textField="text"
 *
 *             [kendoTreeViewCheckable]="checkableSettings"
 *             [(checkedKeys)]="checkedKeys"
 *         >
 *         </kendo-treeview>
 *         <br />
 *         <div class="example-config">
 *             Checked keys: {{checkedKeys.join(",")}}
 *         </div>
 *         <i>Press SPACE key or use mouse click to un/check a checkbox</i>
 *   `
 * })
 * export class AppComponent {
 *     public checkedKeys: any[] = ["1"];
 *
 *     public checkChildren: boolean = true;
 *     public checkParents: boolean = true;
 *     public checkMode: any = 'multiple';
 *
 *     public get checkableSettings(): CheckableSettings {
 *         return {
 *             checkChildren: this.checkChildren,
 *             checkParents: this.checkParents,
 *             mode: this.checkMode
 *         };
 *     }
 *
 *     public data: any[] = [
 *         {
 *           text: "Furniture", items: [
 *             { text: "Tables & Chairs" },
 *             { text: "Sofas" },
 *             {
 *               text: "Occasional Furniture", items: [{
 *                 text: "Decor", items: [
 *                   { text: "Bed Linen" },
 *                   { text: "Curtains & Blinds" }
 *                 ]
 *               }]
 *             }
 *           ]
 *         },
 *         { text: "Decor" },
 *         { text: "Outdoors" }
 *     ];
 *
 *     public children = (dataItem: any): any[] => of(dataItem.items);
 *     public hasChildren = (dataItem: any): boolean => !!dataItem.items;
 * }
 * ```
 * {% endmeta %}
 */
export interface CheckableSettings {
    /**
     * Determines if a checkbox selection is allowed.
     * Defaults to `true`.
     */
    enabled?: boolean;
    /**
     * The available values are:
     * * `"single"`
     * * (Default) `"multiple"`
     */
    mode?: CheckMode;
    /**
     * Determines whether to automatically check the children nodes.
     * Defaults to `true`.
     *
     * > The option works only together with the multiple selection mode.
     */
    checkChildren?: boolean;
    /**
     * Determines whether to display the indeterminate state for the parent nodes.
     * Defaults to `true`.
     *
     * > The option works only together with the multiple selection mode.
     */
    checkParents?: boolean;
    /**
     * Specifies if on clicking the node, the item will be checked or unchecked.
     * Defaults to `false`.
     */
    checkOnClick?: boolean;
}
