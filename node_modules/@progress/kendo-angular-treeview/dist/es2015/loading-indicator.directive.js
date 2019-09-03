import { Directive, ChangeDetectorRef, HostBinding, Input } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { LoadingNotificationService } from './loading-notification.service';
import { of } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
/**
 * @hidden
 */
export class LoadingIndicatorDirective {
    constructor(expandService, loadingService, cd) {
        this.expandService = expandService;
        this.loadingService = loadingService;
        this.cd = cd;
        this._loading = false;
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = value;
        this.cd.markForCheck();
    }
    ngOnInit() {
        const loadingNotifications = this.loadingService
            .changes
            .pipe(filter(index => index === this.index));
        this.subscription = this.expandService
            .changes
            .pipe(filter(({ index }) => index === this.index), tap(({ expand }) => {
            if (!expand && this.loading) {
                this.loading = false;
            }
        }), filter(({ expand }) => expand), switchMap(x => of(x).pipe(delay(100), takeUntil(loadingNotifications))))
            .subscribe(() => this.loading = true);
        this.subscription.add(loadingNotifications.subscribe(() => this.loading = false));
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
LoadingIndicatorDirective.decorators = [
    { type: Directive, args: [{ selector: '[kendoTreeViewLoading]' },] },
];
/** @nocollapse */
LoadingIndicatorDirective.ctorParameters = () => [
    { type: ExpandStateService },
    { type: LoadingNotificationService },
    { type: ChangeDetectorRef }
];
LoadingIndicatorDirective.propDecorators = {
    loading: [{ type: HostBinding, args: ["class.k-i-loading",] }],
    index: [{ type: Input, args: ["kendoTreeViewLoading",] }]
};
