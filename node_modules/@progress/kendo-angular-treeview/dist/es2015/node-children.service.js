import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
export class NodeChildrenService {
    constructor() {
        this.changes = new Subject();
    }
    childrenLoaded(item, children) {
        this.changes.next({ item, children });
    }
}
NodeChildrenService.decorators = [
    { type: Injectable },
];
