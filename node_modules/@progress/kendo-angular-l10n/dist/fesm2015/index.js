import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, skip, tap } from 'rxjs/operators';

/* tslint:disable:max-line-length */
/**
 * A base class for a service that returns localized messages.
 *
 * For more information, refer to the section on [using the message service]({% slug messages_l10n %}#toc-using-the-message-service).
 */
class MessageService {
    constructor() {
        /**
         * @hidden
         */
        this.changes = new Subject();
    }
    /**
     * Notifies the components that the messages were changed.
     *
     * @param rtl - (Optional) A new value for the [text direction token]({% slug api_l10n_rtl %}).
     */
    notify(rtl) {
        this.changes.next({ rtl });
    }
    /**
     * Returns a localized message for the supplied key.
     *
     * @param key - The message key. For example, `"kendo.grid.noRecords"`.
     * @return - The localized message for this key or `undefined` if not found.
     */
    get(key) {
        return undefined;
    }
}
MessageService.decorators = [
    { type: Injectable },
];

/**
 * Base class that acts as a component messages container.
 *
 * For internal use.
 * @hidden
 */
class ComponentMessages {
    get override() {
        return false;
    }
    ngOnChanges(changes) {
        this.register(changes);
        if (Object.keys(changes).some(field => !changes[field].isFirstChange())) {
            this.service.notifyChanges();
        }
    }
    ngOnInit() {
        this.subscription = this.service.changes.pipe(skip(1)).subscribe(() => this.register(this));
    }
    register(changes) {
        const keys = Object.keys(changes);
        keys.forEach(key => this.service.register(key, this[key], this.override));
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * A token that specifies the text direction of Kendo UI for Angular components.
 *
 * @example
 * {% embed_file rtl/app.module.ts preview %}
 * {% embed_file rtl/app.component.ts %}
 * {% embed_file shared/main.ts hidden %}
 *
 */
const RTL = new InjectionToken("Kendo UI Right-to-Left token");

/**
 * Localization prefix for the component messages.
 *
 * For internal use.
 * @hidden
 */
const L10N_PREFIX = new InjectionToken('Localization key prefix');
/**
 * Component localization service.
 *
 * For internal use.
 * @hidden
 */
class LocalizationService {
    constructor(prefix, messageService, _rtl) {
        this.prefix = prefix;
        this.messageService = messageService;
        this._rtl = _rtl;
        this.changes = new BehaviorSubject({ rtl: this._rtl });
        this.dictionary = {};
        if (messageService) {
            this.subscription = messageService.changes
                .pipe(map(({ rtl }) => rtl !== undefined ? rtl : this._rtl), tap(rtl => this._rtl = rtl))
                .subscribe(rtl => {
                this.dictionary = {};
                this.changes.next({ rtl });
            });
        }
    }
    get rtl() {
        return this._rtl;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    get(shortKey) {
        const key = this.key(shortKey);
        return this.dictionary[key];
    }
    register(shortKey, value, override = false) {
        const key = this.key(shortKey);
        let message = value;
        if (!override) {
            if (this.dictionary.hasOwnProperty(key)) {
                return;
            }
            message = this.defaultValue(key, value);
        }
        this.dictionary[key] = message;
    }
    notifyChanges() {
        this.changes.next({ rtl: this.rtl });
    }
    key(shortKey) {
        return this.prefix + '.' + shortKey;
    }
    defaultValue(key, value) {
        if (!this.messageService) {
            return value;
        }
        const alt = this.messageService.get(key);
        return (alt === undefined) ? value : alt;
    }
}
LocalizationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LocalizationService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [L10N_PREFIX,] }] },
    { type: MessageService, decorators: [{ type: Optional }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] }] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MessageService, ComponentMessages, L10N_PREFIX, LocalizationService, RTL };
