import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
/**
 * @hidden
 */
export class SelectionService {
    constructor() {
        this.changes = new Subject();
    }
    isFirstSelected(index) {
        return this.firstIndex === index;
    }
    setFirstSelected(index, selected) {
        if (this.firstIndex === index && selected === false) {
            this.firstIndex = null;
        }
        else if (!this.firstIndex && selected) {
            this.firstIndex = index;
        }
    }
    select(index, dataItem) {
        this.changes.next({ dataItem, index });
    }
}
SelectionService.decorators = [
    { type: Injectable },
];
