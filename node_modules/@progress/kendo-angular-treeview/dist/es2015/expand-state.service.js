import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
export class ExpandStateService {
    constructor() {
        this.changes = new Subject();
    }
    expand(index, dataItem) {
        this.changes.next({ dataItem, index, expand: true });
    }
    collapse(index, dataItem) {
        this.changes.next({ dataItem, index, expand: false });
    }
}
ExpandStateService.decorators = [
    { type: Injectable },
];
