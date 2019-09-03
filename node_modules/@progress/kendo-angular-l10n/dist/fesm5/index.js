import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, skip, tap } from 'rxjs/operators';

/* tslint:disable:max-line-length */
/**
 * A base class for a service that returns localized messages.
 *
 * For more information, refer to the section on [using the message service]({% slug messages_l10n %}#toc-using-the-message-service).
 */
var MessageService = /** @class */ (function () {
    function MessageService() {
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
    MessageService.prototype.notify = function (rtl) {
        this.changes.next({ rtl: rtl });
    };
    /**
     * Returns a localized message for the supplied key.
     *
     * @param key - The message key. For example, `"kendo.grid.noRecords"`.
     * @return - The localized message for this key or `undefined` if not found.
     */
    MessageService.prototype.get = function (key) {
        return undefined;
    };
    MessageService.decorators = [
        { type: Injectable },
    ];
    return MessageService;
}());

/**
 * Base class that acts as a component messages container.
 *
 * For internal use.
 * @hidden
 */
var ComponentMessages = /** @class */ (function () {
    function ComponentMessages() {
    }
    Object.defineProperty(ComponentMessages.prototype, "override", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ComponentMessages.prototype.ngOnChanges = function (changes) {
        this.register(changes);
        if (Object.keys(changes).some(function (field) { return !changes[field].isFirstChange(); })) {
            this.service.notifyChanges();
        }
    };
    ComponentMessages.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.service.changes.pipe(skip(1)).subscribe(function () { return _this.register(_this); });
    };
    ComponentMessages.prototype.register = function (changes) {
        var _this = this;
        var keys = Object.keys(changes);
        keys.forEach(function (key) { return _this.service.register(key, _this[key], _this.override); });
    };
    ComponentMessages.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return ComponentMessages;
}());

/**
 * A token that specifies the text direction of Kendo UI for Angular components.
 *
 * @example
 * {% embed_file rtl/app.module.ts preview %}
 * {% embed_file rtl/app.component.ts %}
 * {% embed_file shared/main.ts hidden %}
 *
 */
var RTL = new InjectionToken("Kendo UI Right-to-Left token");

/**
 * Localization prefix for the component messages.
 *
 * For internal use.
 * @hidden
 */
var L10N_PREFIX = new InjectionToken('Localization key prefix');
/**
 * Component localization service.
 *
 * For internal use.
 * @hidden
 */
var LocalizationService = /** @class */ (function () {
    function LocalizationService(prefix, messageService, _rtl) {
        var _this = this;
        this.prefix = prefix;
        this.messageService = messageService;
        this._rtl = _rtl;
        this.changes = new BehaviorSubject({ rtl: this._rtl });
        this.dictionary = {};
        if (messageService) {
            this.subscription = messageService.changes
                .pipe(map(function (_a) {
                var rtl = _a.rtl;
                return rtl !== undefined ? rtl : _this._rtl;
            }), tap(function (rtl) { return _this._rtl = rtl; }))
                .subscribe(function (rtl) {
                _this.dictionary = {};
                _this.changes.next({ rtl: rtl });
            });
        }
    }
    Object.defineProperty(LocalizationService.prototype, "rtl", {
        get: function () {
            return this._rtl;
        },
        enumerable: true,
        configurable: true
    });
    LocalizationService.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    LocalizationService.prototype.get = function (shortKey) {
        var key = this.key(shortKey);
        return this.dictionary[key];
    };
    LocalizationService.prototype.register = function (shortKey, value, override) {
        if (override === void 0) { override = false; }
        var key = this.key(shortKey);
        var message = value;
        if (!override) {
            if (this.dictionary.hasOwnProperty(key)) {
                return;
            }
            message = this.defaultValue(key, value);
        }
        this.dictionary[key] = message;
    };
    LocalizationService.prototype.notifyChanges = function () {
        this.changes.next({ rtl: this.rtl });
    };
    LocalizationService.prototype.key = function (shortKey) {
        return this.prefix + '.' + shortKey;
    };
    LocalizationService.prototype.defaultValue = function (key, value) {
        if (!this.messageService) {
            return value;
        }
        var alt = this.messageService.get(key);
        return (alt === undefined) ? value : alt;
    };
    LocalizationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LocalizationService.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Inject, args: [L10N_PREFIX,] }] },
        { type: MessageService, decorators: [{ type: Optional }] },
        { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] }] }
    ]; };
    return LocalizationService;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MessageService, ComponentMessages, L10N_PREFIX, LocalizationService, RTL };
