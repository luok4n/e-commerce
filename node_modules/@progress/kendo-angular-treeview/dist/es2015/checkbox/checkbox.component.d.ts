import { ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { CheckedState } from './checked-state';
/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
export declare class CheckBoxComponent implements OnInit, DoCheck {
    private element;
    private renderer;
    private changeDetector;
    readonly classWrapper: boolean;
    /**
     * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
     */
    id: string;
    /**
     * A function that determines if node is checked.
     */
    isChecked: any;
    /**
     * The node item.
     */
    node: any;
    /**
     * The node index.
     */
    index: string;
    /**
     * Specifies the label text of the component.
     */
    labelText: string;
    /**
     * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
     */
    tabindex: number;
    /**
     * Fires when the user changes the check state of the component.
     */
    checkStateChange: EventEmitter<CheckedState>;
    readonly indeterminate: boolean;
    readonly checked: boolean;
    private checkState;
    constructor(element: ElementRef, renderer: Renderer2, changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    ngDoCheck(): void;
    handleChange(e: any): void;
}
