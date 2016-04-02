﻿/*
 * @version   : 1.11.2 - Bridge.NET
 * @author    : Object.NET, Inc. http://bridge.net/
 * @date      : 2016-03-08
 * @copyright : Copyright (c) 2008-2016, Object.NET, Inc. (http://object.net/). All rights reserved.
 * @license   : See license.txt and https://github.com/bridgedotnet/Bridge.NET/blob/master/LICENSE.
 */

(function (globals) {
    "use strict";

    // @source Core.js

    var core = {
        global: globals,

        emptyFn: function () { },

        property : function (scope, name, v) {
            scope[name] = v;

            var rs = name.charAt(0) === "$",
                cap = rs ? name.slice(1) : name;

            scope["get" + cap] = (function (name) {
                return function () {
                    return this[name];
                };
            })(name);

            scope["set" + cap] = (function (name) {
                return function (value) {
                    this[name] = value;
                };
            })(name);
        },

        event: function (scope, name, v) {
            scope[name] = v;

            var rs = name.charAt(0) === "$",
                cap = rs ? name.slice(1) : name;

            scope["add" + cap] = (function (name) {
                return function (value) {
                    this[name] = Bridge.fn.combine(this[name], value);
                };
            })(name);

            scope["remove" + cap] = (function (name) {
                return function (value) {
                    this[name] = Bridge.fn.remove(this[name], value);
                };
            })(name);
        },

        clone: function (obj) {
            if (Bridge.isArray(obj)) {
                return Bridge.Array.clone(obj);
            }

            if (Bridge.is(obj, Bridge.ICloneable)) {
                return obj.clone();
            }

            return null;
        },

        copy: function (to, from, keys, toIf) {
            if (typeof keys === "string") {
                keys = keys.split(/[,;\s]+/);
            }

            for (var name, i = 0, n = keys ? keys.length : 0; i < n; i++) {
                name = keys[i];

                if (toIf !== true || to[name] == undefined) {
                    if (Bridge.is(from[name], Bridge.ICloneable)) {
                        to[name] = Bridge.clone(from[name]);
                    } else {
                        to[name] = from[name];
                    }
                }
            }

            return to;
        },

        get: function (t) {
            if (t && t.$staticInit) {
                t.$staticInit();
            }

            return t;
        },

        ns: function (ns, scope) {
            var nsParts = ns.split("."),
                i = 0;

            if (!scope) {
                scope = Bridge.global;
            }

            for (i = 0; i < nsParts.length; i++) {
                if (typeof scope[nsParts[i]] === "undefined") {
                    scope[nsParts[i]] = { };
                }

                scope = scope[nsParts[i]];
            }

            return scope;
        },

        ready: function (fn, scope) {
            var delayfn = function () {
                if (scope) {
                    fn.apply(scope);
                } else {
                    fn();
                }
            };

            if (typeof Bridge.global.jQuery !== "undefined") {
                Bridge.global.jQuery(delayfn);
            } else {
                if (typeof Bridge.global.document === "undefined" || Bridge.global.document.readyState === "complete" || Bridge.global.document.readyState === "loaded") {
                    delayfn();
                } else {
                    Bridge.on("DOMContentLoaded", Bridge.global.document, delayfn);
                }
            }
        },

        on: function (event, elem, fn, scope) {
            var listenHandler = function (e) {
                var ret = fn.apply(scope || this, arguments);

                if (ret === false) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                return(ret);
            };

            var attachHandler = function () {
                var ret = fn.call(scope || elem, Bridge.global.event);

                if (ret === false) {
                    Bridge.global.event.returnValue = false;
                    Bridge.global.event.cancelBubble = true;
                }

                return (ret);
            };

            if (elem.addEventListener) {
                elem.addEventListener(event, listenHandler, false);
            } else {
                elem.attachEvent("on" + event, attachHandler);
            }
        },

        getHashCode: function (value, safe) {
            if (Bridge.isEmpty(value, true)) {
                if (safe) {
                    return 0;
                }

                throw new Bridge.InvalidOperationException("HashCode cannot be calculated for empty value");
            }

            if (value.getHashCode && Bridge.isFunction(value.getHashCode) && !value.__insideHashCode && value.getHashCode.length === 0) {
                value.__insideHashCode = true;
                var r = value.getHashCode();
                delete value.__insideHashCode;

                return r;
            }

            if (Bridge.isBoolean(value)) {
                return value ? 1 : 0;
            }

            if (Bridge.isDate(value)) {
                return value.valueOf() & 0xFFFFFFFF;
            }

            if (Bridge.isNumber(value)) {
                value = value.toExponential();

                return parseInt(value.substr(0, value.indexOf("e")).replace(".", ""), 10) & 0xFFFFFFFF;
            }

            if (Bridge.isString(value)) {
                var hash = 0,
                    i;

                for (i = 0; i < value.length; i++) {
                    hash = (((hash << 5) - hash) + value.charCodeAt(i)) & 0xFFFFFFFF;
                }

                return hash;
            }

            if (value.$$hashCode) {
                return value.$$hashCode;
            }

            if (typeof value === "object") {
                var result = 0,
                    removeCache = false,
                    len,
                    i,
                    item,
                    cacheItem,
                    temp;

                if (!Bridge.$$hashCodeCache) {
                    Bridge.$$hashCodeCache = [];
                    Bridge.$$hashCodeCalculated = [];
                    removeCache = true;
                }

                for (i = 0, len = Bridge.$$hashCodeCache.length; i < len; i += 1) {
                    item = Bridge.$$hashCodeCache[i];

                    if (item.obj === value) {
                        return item.hash;
                    }
                }

                cacheItem = { obj: value, hash: 0 };
                Bridge.$$hashCodeCache.push(cacheItem);

                for (var property in value) {
                    if (value.hasOwnProperty(property) && property !== "__insideHashCode") {
                        temp = Bridge.isEmpty(value[property], true) ? 0 : Bridge.getHashCode(value[property]);
                        result = 29 * result + temp;
                    }
                }

                cacheItem.hash = result;

                if (removeCache) {
                    delete Bridge.$$hashCodeCache;
                }

                if (result !== 0) {
                    return result;
                }
            }

            return value.$$hashCode || (value.$$hashCode = (Math.random() * 0x100000000) | 0);
        },

        getDefaultValue: function (type) {
            if (
                (type.getDefaultValue) && type.getDefaultValue.length === 0) {
                return type.getDefaultValue();
            } else if (type === Boolean) {
                return false;
            } else if (type === Date) {
                return new Date(-864e13);
            } else if (type === Number) {
                return 0;
            }

            return null;
        },

        getTypeName: function (obj) {
            var str;

            if (obj.$$name) {
                return obj.$$name;
            }

            if ((obj).constructor === Function) {
                str = (obj).toString();
            } else {
                str = (obj).constructor.toString();
            }

            var results = (/function (.{1,})\(/).exec(str);
            return (results && results.length > 1) ? results[1] : "Object";
        },

        is: function (obj, type, ignoreFn, allowNull) {
	        if (typeof type === "string") {
                type = Bridge.unroll(type);
	        }

            if (obj == null) {
                return !!allowNull;
            }

            if (ignoreFn !== true) {
	            if (Bridge.isFunction(type.$is)) {
	                return type.$is(obj);
	            }

	            if (Bridge.isFunction(type.instanceOf)) {
	                return type.instanceOf(obj);
	            }
            }

            if ((obj.constructor === type) || (obj instanceof type)) {
	            return true;
            }

            if (Bridge.isArray(obj) || obj instanceof Bridge.ArrayEnumerator) {
                return Bridge.Array.is(obj, type);
            }

            if (Bridge.isString(obj)) {
                return Bridge.String.is(obj, type);
            }

            if (!type.$$inheritors) {
                return false;
            }

            var inheritors = type.$$inheritors,
                i;

            for (i = 0; i < inheritors.length; i++) {
                if (Bridge.is(obj, inheritors[i])) {
	                return true;
	            }
            }

            return false;
	    },

        as: function (obj, type, allowNull) {
	        return Bridge.is(obj, type, false, allowNull) ? obj : null;
        },

        cast: function (obj, type, allowNull) {
            if (obj === null) {
                return null;
            }

            var result = Bridge.as(obj, type, allowNull);

	        if (result === null) {
	            throw new Bridge.InvalidCastException("Unable to cast type " + (obj ? Bridge.getTypeName(obj) : "'null'") + " to type " + Bridge.getTypeName(type));
	        }

	        return result;
        },

	    apply: function (obj, values) {
	        var names = Bridge.getPropertyNames(values, true),
	            i;

	        for (i = 0; i < names.length; i++) {
	            var name = names[i];

	            if (typeof obj[name] === "function" && typeof values[name] !== "function") {
	                obj[name](values[name]);
	            } else {
	                obj[name] = values[name];
	            }
	        }

	        return obj;
        },

	    merge: function (to, from) {
	        if (to instanceof Bridge.Decimal && Bridge.isNumber(from)) {
	            return new Bridge.Decimal(from);
	        }

	        if (to instanceof Boolean ||
                to instanceof Number ||
                to instanceof String ||
                to instanceof Function ||
                to instanceof Date ||
                to instanceof Bridge.Int ||
                to instanceof Bridge.Decimal) {
	            return from;
	        }

	        var key,
			    i,
                value,
                toValue,
			    fn;

	        if (Bridge.isArray(from) && Bridge.isFunction(to.add || to.push)) {
	            fn = Bridge.isArray(to) ? to.push : to.add;

	            for (i = 0; i < from.length; i++) {
	                fn.apply(to, from[i]);
	            }
	        } else {
	            for (key in from) {
	                value = from[key];

	                if (typeof to[key] === "function") {
	                    if (key.match(/^\s*get[A-Z]/)) {
	                        Bridge.merge(to[key](), value);
	                    } else {
	                        to[key](value);
	                    }
	                } else {
	                    var setter = "set" + key.charAt(0).toUpperCase() + key.slice(1);

	                    if (typeof to[setter] === "function" && typeof value !== "function") {
	                        to[setter](value);
	                    } else if (value && value.constructor === Object && to[key]) {
	                        toValue = to[key];
	                        Bridge.merge(toValue, value);
	                    } else {
	                        to[key] = value;
	                    }
	                }
	            }
	        }

	        return to;
	    },

	    getEnumerator: function (obj, suffix) {
	        if (typeof obj === "string") {
	            obj = Bridge.String.toCharArray(obj);
	        }

	        if (suffix && obj && obj["getEnumerator" + suffix]) {
	            return obj["getEnumerator" + suffix].call(obj);
	        }

	        if (obj && obj.getEnumerator) {
	            return obj.getEnumerator();
	        }

	        if ((Object.prototype.toString.call(obj) === "[object Array]") ||
                (obj && Bridge.isDefined(obj.length))) {
	            return new Bridge.ArrayEnumerator(obj);
	        }

	        throw new Bridge.InvalidOperationException("Cannot create enumerator");
	    },

	    getPropertyNames: function (obj, includeFunctions) {
	        var names = [],
	            name;

	        for (name in obj) {
                if (includeFunctions || typeof obj[name] !== "function") {
                    names.push(name);
                }
	        }

	        return names;
	    },

	    isDefined: function (value, noNull) {
	        return typeof value !== "undefined" && (noNull ? value !== null : true);
	    },

	    isEmpty: function (value, allowEmpty) {
	        return (typeof value === "undefined" || value === null) || (!allowEmpty ? value === "" : false) || ((!allowEmpty && Bridge.isArray(value)) ? value.length === 0 : false);
	    },

	    toArray: function (ienumerable) {
	        var i,
	            item,
                len,
	            result = [];

	        if (Bridge.isArray(ienumerable)) {
                for (i = 0, len = ienumerable.length; i < len; ++i) {
                    result.push(ienumerable[i]);
                }
	        } else {
                i = Bridge.getEnumerator(ienumerable);

                while (i.moveNext()) {
                    item = i.getCurrent();
                    result.push(item);
                }
	        }

	        return result;
	    },

        isArray: function (obj) {
            return Object.prototype.toString.call(obj) in {
                "[object Array]": 1,
                "[object Uint8Array]": 1,
                "[object Int8Array]": 1,
                "[object Int16Array]": 1,
                "[object Uint16Array]": 1,
                "[object Int32Array]": 1,
                "[object Uint32Array]": 1,
                "[object Float32Array]": 1,
                "[object Float64Array]": 1
            };
        },

        isFunction: function (obj) {
            return typeof (obj) === "function";
        },

        isDate: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Date]";
        },

        isNull: function (value) {
            return (value === null) || (value === undefined);
        },

        isBoolean: function (value) {
            return typeof value === "boolean";
        },

        isNumber: function (value) {
            return typeof value === "number" && isFinite(value);
        },

        isString: function (value) {
            return typeof value === "string";
        },

        unroll: function (value) {
            var d = value.split("."),
                o = Bridge.global[d[0]],
                i = 1;

            for (i; i < d.length; i++) {
                if (!o) {
                    return null;
                }

                o = o[d[i]];
            }

            return o;
        },

        equals: function (a, b) {
            if (a && Bridge.isFunction(a.equals) && a.equals.length === 1) {
                return a.equals(b);
            }
            if (b && Bridge.isFunction(b.equals) && b.equals.length === 1) {
                return a.equals(b);
            } else if (Bridge.isDate(a) && Bridge.isDate(b)) {
                return a.valueOf() === b.valueOf();
            } else if (Bridge.isNull(a) && Bridge.isNull(b)) {
                return true;
            } else if (Bridge.isNull(a) !== Bridge.isNull(b)) {
                return false;
            }

            var eq = a === b;
            if (!eq && typeof a === "object" && typeof b === "object") {
                return (Bridge.getHashCode(a) === Bridge.getHashCode(b)) && Bridge.objectEquals(a, b);
            }

            return eq;
        },

        objectEquals: function (a, b) {
            Bridge.$$leftChain = [];
            Bridge.$$rightChain = [];

            var result = Bridge.deepEquals(a, b);

            delete Bridge.$$leftChain;
            delete Bridge.$$rightChain;

            return result;
        },

        deepEquals: function (a, b) {
            if (typeof a === "object" && typeof b === "object") {
                if (Bridge.$$leftChain.indexOf(a) > -1 || Bridge.$$rightChain.indexOf(b) > -1) {
                    return false;
                }

                var p;

                for (p in b) {
                    if (b.hasOwnProperty(p) !== a.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof b[p] !== typeof a[p]) {
                        return false;
                    }
                }

                for (p in a) {
                    if (b.hasOwnProperty(p) !== a.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof a[p] !== typeof b[p]) {
                        return false;
                    }

                    if (typeof (a[p]) === "object") {
                        Bridge.$$leftChain.push(a);
                        Bridge.$$rightChain.push(b);

                        if (!Bridge.deepEquals(a[p], b[p])) {
                            return false;
                        }

                        Bridge.$$leftChain.pop();
                        Bridge.$$rightChain.pop();
                    } else {
                        if (!Bridge.equals(a[p], b[p])) {
                            return false;
                        }
                    }
                }

                return true;
            } else {
                return Bridge.equals(a, b);
            }
        },

        compare: function (a, b, safe) {
            if (!Bridge.isDefined(a, true)) {
                if (safe) {
                    return 0;
                }

                throw new Bridge.NullReferenceException();
            } else if (Bridge.isNumber(a) || Bridge.isString(a) || Bridge.isBoolean(a)) {
                if (Bridge.isString(a) && !Bridge.hasValue(b)) {
                    return 1;
                }
                return a < b ? -1 : (a > b ? 1 : 0);
            } else if (Bridge.isDate(a)) {
                return Bridge.compare(a.valueOf(), b.valueOf());
            }

            if (Bridge.isFunction(a.compareTo)) {
                return a.compareTo(b);
            }

            if (Bridge.isFunction(b.compareTo)) {
                return -b.compareTo(a);
            }

            if (safe) {
                return 0;
            }

            throw new Bridge.Exception("Cannot compare items");
        },

        equalsT: function (a, b) {
            if (!Bridge.isDefined(a, true)) {
                throw new Bridge.NullReferenceException();
            } else if (Bridge.isNumber(a) || Bridge.isString(a) || Bridge.isBoolean(a)) {
                return a === b;
            } else if (Bridge.isDate(a)) {
                return a.valueOf() === b.valueOf();
            }

            return a.equalsT ? a.equalsT(b) : b.equalsT(a);
        },

        format: function (obj, formatString) {
            if (Bridge.isNumber(obj)) {
                return Bridge.Int.format(obj, formatString);
            } else if (Bridge.isDate(obj)) {
                return Bridge.Date.format(obj, formatString);
            }

            return obj.format(formatString);
        },

        getType: function (instance) {
            if (!Bridge.isDefined(instance, true)) {
                throw new Bridge.NullReferenceException("instance is null");
            }

            try {
                return instance.constructor;
            } catch (ex) {
                return Object;
            }
        },

        isLower: function isLower(c) {
            var s = String.fromCharCode(c);

            return s === s.toLowerCase() && s !== s.toUpperCase();
        },

        isUpper: function isUpper(c) {
            var s = String.fromCharCode(c);

            return s !== s.toLowerCase() && s === s.toUpperCase();
        },

        coalesce: function (a, b) {
            return Bridge.hasValue(a) ? a : b;
        },

        fn: {
            call: function (obj, fnName) {
                var args = Array.prototype.slice.call(arguments, 2);

                obj = obj || Bridge.global;

                return obj[fnName].apply(obj, args);
            },

            makeFn: function (fn, length) {
                switch (length) {
                    case 0  : return function () { return fn.apply(this, arguments); };
                    case 1  : return function (a) { return fn.apply(this, arguments); };
                    case 2  : return function (a,b) { return fn.apply(this, arguments); };
                    case 3  : return function (a,b,c) { return fn.apply(this, arguments); };
                    case 4  : return function (a,b,c,d) { return fn.apply(this, arguments); };
                    case 5  : return function (a,b,c,d,e) { return fn.apply(this, arguments); };
                    case 6  : return function (a,b,c,d,e,f) { return fn.apply(this, arguments); };
                    case 7  : return function (a,b,c,d,e,f,g) { return fn.apply(this, arguments); };
                    case 8  : return function (a,b,c,d,e,f,g,h) { return fn.apply(this, arguments); };
                    case 9  : return function (a, b, c, d, e, f, g, h, i) { return fn.apply(this, arguments); };
                    case 10:  return function (a, b, c, d, e, f, g, h, i, j) { return fn.apply(this, arguments); };
                    case 11:  return function (a, b, c, d, e, f, g, h, i, j, k) { return fn.apply(this, arguments); };
                    case 12:  return function (a, b, c, d, e, f, g, h, i, j, k, l) { return fn.apply(this, arguments); };
                    case 13:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m) { return fn.apply(this, arguments); };
                    case 14:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) { return fn.apply(this, arguments); };
                    case 15:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) { return fn.apply(this, arguments); };
                    case 16:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) { return fn.apply(this, arguments); };
                    case 17:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) { return fn.apply(this, arguments); };
                    case 18:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) { return fn.apply(this, arguments); };
                    case 19:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) { return fn.apply(this, arguments); };
                    default:  return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) { return fn.apply(this, arguments); };
                }
            },

            bind: function (obj, method, args, appendArgs) {
                if (method && method.$method === method && method.$scope === obj) {
                    return method;
                }

                var fn;

                if (arguments.length === 2) {
                    fn = Bridge.fn.makeFn(function () {
                        Bridge.caller.unshift(this);
                        var result = method.apply(obj, arguments);
                        Bridge.caller.shift(this);

                        return result;
                    }, method.length);
                } else {
                    fn = Bridge.fn.makeFn(function () {
                        var callArgs = args || arguments;

                        if (appendArgs === true) {
                            callArgs = Array.prototype.slice.call(arguments, 0);
                            callArgs = callArgs.concat(args);
                        } else if (typeof appendArgs === "number") {
                            callArgs = Array.prototype.slice.call(arguments, 0);

                            if (appendArgs === 0) {
                                callArgs.unshift.apply(callArgs, args);
                            } else if (appendArgs < callArgs.length) {
                                callArgs.splice.apply(callArgs, [appendArgs, 0].concat(args));
                            } else {
                                callArgs.push.apply(callArgs, args);
                            }
                        }
                        Bridge.caller.unshift(this);
                        var result = method.apply(obj, callArgs);
                        Bridge.caller.shift(this);

                        return result;
                    }, method.length);
                }

                fn.$method = method;
                fn.$scope = obj;

                return fn;
            },

            bindScope: function (obj, method) {
                var fn = Bridge.fn.makeFn(function () {
                    var callArgs = Array.prototype.slice.call(arguments, 0);

                    callArgs.unshift.apply(callArgs, [obj]);

                    Bridge.caller.unshift(this);
                    var result = method.apply(obj, callArgs);
                    Bridge.caller.shift(this);

                    return result;
                }, method.length);

                fn.$method = method;
                fn.$scope = obj;

                return fn;
            },

            $build: function (handlers) {
                var fn = function () {
                    var list = fn.$invocationList,
                        result = null,
                        i,
                        handler;

                    for (i = 0; i < list.length; i++) {
                        handler = list[i];
                        result = handler.apply(null, arguments);
                    }

                    return result;
                };

                fn.$invocationList = handlers ? Array.prototype.slice.call(handlers, 0) : [];

                if (fn.$invocationList.length === 0) {
                    return null;
                }

                return fn;
            },

            combine: function (fn1, fn2) {
                if (!fn1 || !fn2) {
                    return fn1 || fn2;
                }

                var list1 = fn1.$invocationList ? fn1.$invocationList : [fn1],
                    list2 = fn2.$invocationList ? fn2.$invocationList : [fn2];

                return Bridge.fn.$build(list1.concat(list2));
            },

            remove: function (fn1, fn2) {
                if (!fn1 || !fn2) {
                    return fn1 || null;
                }

                var list1 = fn1.$invocationList ? fn1.$invocationList : [fn1],
                    list2 = fn2.$invocationList ? fn2.$invocationList : [fn2],
                    result = [],
                    exclude,
                    i, j;

                for (i = list1.length - 1; i >= 0; i--) {
                    exclude = false;

                    for (j = 0; j < list2.length; j++) {
                        if (list1[i] === list2[j] ||
                            ((list1[i].$method && (list1[i].$method === list2[j].$method)) && (list1[i].$scope && (list1[i].$scope === list2[j].$scope)))) {
                            exclude = true;
                            break;
                        }
                    }

                    if (!exclude) {
                        result.push(list1[i]);
                    }
                }

                result.reverse();

                return Bridge.fn.$build(result);
            }
        }
    };

    if (!Object.create) {
        Object.create = function (o, properties) {
            if (typeof o !== "object" && typeof o !== "function") {
                throw new TypeError("Object prototype may only be an Object: " + o);
            } else if (o === null) {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument");
            }

            if (typeof properties != "undefined") {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument");
            }

            function F() { }

            F.prototype = o;

            return new F();
        };
    }

    globals.Bridge = core;
    globals.Bridge.caller = [];

    // @source Nullable.js

    var nullable = {
        hasValue: function (obj) {
            return (obj !== null) && (obj !== undefined);
        },

        getValue: function (obj) {
            if (!Bridge.Nullable.hasValue(obj)) {
                throw new Bridge.InvalidOperationException("Nullable instance doesn't have a value.");
            }
            return obj;
        },

        getValueOrDefault: function (obj, defValue) {
            return Bridge.Nullable.hasValue(obj) ? obj : defValue;
        },

        add: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a + b : null;
        },

        band: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a & b : null;
        },

        bor: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a | b : null;
        },

        and: function (a, b) {
            if (a === true && b === true) {
                return true;
            } else if (a === false || b === false) {
                return false;
            }

            return null;
        },

        or: function (a, b) {
            if (a === true || b === true) {
                return true;
            } else if (a === false && b === false) {
                return false;
            }

            return null;
        },

        div: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a / b : null;
        },

        eq: function (a, b) {
            return !Bridge.hasValue(a) ? !Bridge.hasValue(b) : (a === b);
        },

        equals: function (a, b, fn) {
            return !Bridge.hasValue(a) ? !Bridge.hasValue(b) : (fn ? fn(a, b) : Bridge.equals(a, b));
        },

        toString: function (a, fn) {
            return !Bridge.hasValue(a) ? "" : (fn ? fn(a) : a.toString());
        },

        getHashCode: function (a, fn) {
            return !Bridge.hasValue(a) ? 0 : (fn ? fn(a) : Bridge.getHashCode(a));
        },

        xor: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a ^ b : null;
        },

        gt: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) && a > b;
        },

        gte: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) && a >= b;
        },

        neq: function (a, b) {
            return !Bridge.hasValue(a) ? Bridge.hasValue(b) : (a !== b);
        },

        lt: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) && a < b;
        },

        lte: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) && a <= b;
        },

        mod: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a % b : null;
        },

        mul: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a * b : null;
        },

        sl: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a << b : null;
        },

        sr: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a >> b : null;
        },

        srr: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? a >>> b : null;
        },

        sub: function (a, b) {
	        return Bridge.hasValue(a) && Bridge.hasValue(b) ? a - b : null;
        },

        bnot: function (a) {
            return Bridge.hasValue(a) ? ~a : null;
        },

        neg: function (a) {
            return Bridge.hasValue(a) ? -a : null;
        },

        not: function (a) {
	        return Bridge.hasValue(a) ? !a : null;
        },

        pos: function (a) {
	        return Bridge.hasValue(a) ? +a : null;
        },

        lift: function () {
	        for (var i = 1; i < arguments.length; i++) {
	            if (!Bridge.hasValue(arguments[i])) {
	                return null;
	            }
	        }

	        if (arguments[0] == null)
	            return null;

	        if (arguments[0].apply == undefined)
	            return arguments[0];

	        return arguments[0].apply(null, Array.prototype.slice.call(arguments, 1));
        },

        lift1: function (f, o) {
            return Bridge.hasValue(o) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : o[f].apply(o, Array.prototype.slice.call(arguments, 2))) : null;
        },

        lift2: function (f, a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))) : null;
        },

        liftcmp: function (f, a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))) : false;
        },

        lifteq: function (f, a, b) {
            var va = Bridge.hasValue(a), vb = Bridge.hasValue(b);
            return (!va && !vb) || (va && vb && (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))));
        },

        liftne: function (f, a, b) {
            var va = Bridge.hasValue(a), vb = Bridge.hasValue(b);
            return (va !== vb) || (va && (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))));
        }
    };

    Bridge.Nullable = nullable;
    Bridge.hasValue = Bridge.Nullable.hasValue;

    // @source Char.js

    var char = {
        charCodeAt: function (str, index) {
            if (str == null) {
                throw new Bridge.ArgumentNullException();
            }

            if (str.length != 1) {
                throw new Bridge.FormatException("String must be exactly one character long");
            }

            return str.charCodeAt(index);
        },

        isWhiteSpace: function (value) {
            return /\s/.test(value);
        },

        isDigit: function (value) {
            if (value < 256) {
                return (value >= 48 && value <= 57);
            }

            return new RegExp("[0-9\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]").test(String.fromCharCode(value));
        },

        isLetter: function (value) {
            if (value < 256) {
                return (value >= 65 && value <= 90) || (value >= 97 && value <= 122);
            }

            return new RegExp("[A-Za-z\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uAA70\uAADD\uAAF3\uAAF4\uFF70\uFF9E\uFF9F\u00AA\u00BA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]").test(String.fromCharCode(value));
        },

        isHighSurrogate: function (value) {
            return new RegExp("[\uD800-\uDBFF]").test(String.fromCharCode(value));
        },

        isLowSurrogate: function (value) {
            return new RegExp("[\uDC00-\uDFFF]").test(String.fromCharCode(value));
        },

        isSurrogate: function (value) {
            return new RegExp("[\uD800-\uDFFF]").test(String.fromCharCode(value));
        },

        isSymbol: function (value) {
            if (value < 256) {
                return ([36, 43, 60, 61, 62, 94, 96, 124, 126, 162, 163, 164, 165, 166, 167, 168, 169, 172, 174, 175, 176, 177, 180, 182, 184, 215, 247].indexOf(value) != -1);
            }

            return new RegExp("[\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF]").test(String.fromCharCode(value));
        },

        isSeparator: function (value) {
            if (value < 256) {
                return (value == 32 || value == 160);
            }

            return new RegExp("[\u2028\u2029\u0020\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]").test(String.fromCharCode(value));
        },

        isPunctuation: function (value) {
            if (value < 256) {
                return ([33,34,35,37,38,39,40,41,42,44,45,46,47,58,59,63,64,91,92,93,95,123,125,161,171,173,183,187,191].indexOf(value) != -1);
            }

            return new RegExp("[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65\u002D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D\u0028\u005B\u007B\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3E\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62\u0029\u005D\u007D\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3F\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63\u00AB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20\u00BB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21\u005F\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F\u0021-\u0023\u0025-\u0027\u002A\u002C\u002E\u002F\u003A\u003B\u003F\u0040\u005C\u00A1\u00A7\u00B6\u00B7\u00BF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166D\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65]").test(String.fromCharCode(value));
        },

        isNumber: function (value) {
            if (value < 256) {
                return ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 178, 179, 185, 188, 189, 190].indexOf(value) != -1);
            }

            return new RegExp("[\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF\u00B2\u00B3\u00B9\u00BC-\u00BE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D70-\u0D75\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835]").test(String.fromCharCode(value));
        },

        isControl: function (value) {
            if (value < 256) {
                return (value >= 0 && value <= 31) || (value >= 127 && value <= 159);
            }

            return new RegExp("[\u0000-\u001F\u007F\u0080-\u009F]").test(String.fromCharCode(value));
        }
    };

    Bridge.Char = char;

    // @source String.js

    var string = {
        is: function (obj, type) {
            if (!Bridge.isString(obj)) {
                return false;
            }

            if ((obj.constructor === type) || (obj instanceof type)) {
                return true;
            }

            if (type === Bridge.IEnumerable ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IEnumerable$1") ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IComparable$1") ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IEquatable$1")) {
                return true;
            }

            return false;
        },

        lastIndexOf: function (s, search, startIndex, count) {
            var index = s.lastIndexOf(search, startIndex);
            return (index < (startIndex - count + 1)) ? -1 : index;
        },

        lastIndexOfAny: function (s, chars, startIndex, count) {
            var length = s.length;
            if (!length) {
                return -1;
            }

            chars = String.fromCharCode.apply(null, chars);
            startIndex = startIndex || length - 1;
            count = count || length;

            var endIndex = startIndex - count + 1;
            if (endIndex < 0) {
                endIndex = 0;
            }

            for (var i = startIndex; i >= endIndex; i--) {
                if (chars.indexOf(s.charAt(i)) >= 0) {
                    return i;
                }
            }
            return -1;
        },

        isNullOrWhiteSpace: function (value) {
            //do not replace == to ===, it ichecks to undefined also
            return value == null || value.match(/^ *$/) !== null;
        },

        isNullOrEmpty: function (value) {
            return Bridge.isEmpty(value, false);
        },

        fromCharCount: function (c, count) {
            if (count >= 0) {
                return String(Array(count + 1).join(String.fromCharCode(c)));
            } else {
                throw new Bridge.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }
        },

        format: function (format) {
            var me = this,
                _formatRe = /(\{+)((\d+|[a-zA-Z_$]\w+(?:\.[a-zA-Z_$]\w+|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*))?)(\}+)|(\{+)|(\}+)/g,
                args = Array.prototype.slice.call(arguments, 1),
                fn = this.decodeBraceSequence;

            return format.replace(_formatRe, function (m, openBrace, elementContent, index, align, format, closeBrace, repeatOpenBrace, repeatCloseBrace) {
                if (repeatOpenBrace) {
                    return fn(repeatOpenBrace);
                }

                if (repeatCloseBrace) {
                    return fn(repeatCloseBrace);
                }

                if (openBrace.length % 2 === 0 || closeBrace.length % 2 === 0) {
                    return fn(openBrace) + elementContent + fn(closeBrace);
                }

                return fn(openBrace, true) + me.handleElement(index, align, format, args) + fn(closeBrace, true);
            });
        },

        handleElement: function (index, alignment, formatStr, args) {
            var value;

            index = parseInt(index, 10);

            if (index > args.length - 1) {
                throw new Bridge.FormatException("Input string was not in a correct format.");
            }

            value = args[index];

            if (value == null) {
                value = "";
            }

            if (formatStr && Bridge.is(value, Bridge.IFormattable)) {
                value = Bridge.format(value, formatStr);
            } else {
                value = "" + value;
            }

            if (alignment) {
                alignment = parseInt(alignment, 10);
                if (!Bridge.isNumber(alignment)) {
                    alignment = null;
                }
            }

            return Bridge.String.alignString(value.toString(), alignment);
        },

        decodeBraceSequence: function (braces, remove) {
            return braces.substr(0, (braces.length + (remove ? 0 : 1)) / 2);
        },

        alignString: function (str, alignment, pad, dir) {
            if (!alignment) {
                return str;
            }

            if (!pad) {
                pad = " ";
            }

            if (Bridge.isNumber(pad)) {
                pad = String.fromCharCode(pad);
            }

            if (!dir) {
                dir = alignment < 0 ? 1 : 2;
            }

            alignment = Math.abs(alignment);

            if (alignment + 1 >= str.length) {
                switch (dir) {
                    case 2:
                        str = Array(alignment + 1 - str.length).join(pad) + str;
                        break;

                    case 3:
                        var padlen = alignment - str.length,
                            right = Math.ceil(padlen / 2),
                            left = padlen - right;

                        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                        break;

                    case 1:
                    default:
                        str = str + Array(alignment + 1 - str.length).join(pad);
                        break;
                }
            }

            return str;
        },

        startsWith: function (str, prefix) {
            if (!prefix.length) {
                return true;
            }

            if (prefix.length > str.length) {
                return false;
            }

            prefix = Bridge.String.escape(prefix);

            return str.match("^" + prefix) !== null;
        },

        endsWith: function (str, suffix) {
            if (!suffix.length) {
                return true;
            }

            if (suffix.length > str.length) {
                return false;
            }

            suffix = Bridge.String.escape(suffix);

            return str.match(suffix + "$") !== null;
        },

        contains: function (str, value) {
            if (value == null) {
                throw new Bridge.ArgumentNullException();
            }

            if (str == null) {
                return false;
            }

            return str.indexOf(value) > -1;
        },

        indexOfAny: function (str, anyOf) {
            if (anyOf == null) {
                throw new Bridge.ArgumentNullException();
            }

            if (str == null || str === "") {
                return -1;
            }

            var startIndex = (arguments.length > 2) ? arguments[2] : 0;

            if (startIndex < 0) {
                throw new Bridge.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero");
            }

            var length = (arguments.length > 3) ? arguments[3] : str.length - startIndex;

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (length > str.length - startIndex) {
                throw new Bridge.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
            }

            var s = str.substr(startIndex, length);

            for (var i = 0; i < anyOf.length; i++) {
                var c = String.fromCharCode(anyOf[i]);
                var index = s.indexOf(c);

                if (index > -1) {
                    return index + startIndex;
                }
            }

            return -1;
        },

        indexOf: function (str, value) {
            if (value == null) {
                throw new Bridge.ArgumentNullException();
            }

            if (str == null || str === "") {
                return -1;
            }

            var startIndex = (arguments.length > 2) ? arguments[2] : 0;

            if (startIndex < 0 || startIndex > str.length) {
                throw new Bridge.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero and must refer to a location within the string");
            }

            if (value === "") {
                return (arguments.length > 2) ? startIndex : 0;
            }

            var length = (arguments.length > 3) ? arguments[3] : str.length - startIndex;

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (length > str.length - startIndex) {
                throw new Bridge.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
            }

            var s = str.substr(startIndex, length);
            var index = (arguments.length === 5 && arguments[4] % 2 !== 0) ? s.toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) : s.indexOf(value);

            if (index > -1) {
                if (arguments.length === 5) {
                    // StringComparison
                    return (Bridge.String.compare(value, s.substr(index, value.length), arguments[4]) === 0) ? index + startIndex : -1;
                } else {
                    return index + startIndex;
                }
            }

            return -1;
        },

        equals: function () {
            return Bridge.String.compare.apply(this, arguments) === 0;
        },

        compare: function (strA, strB) {
            if (strA == null) {
                return (strB == null) ? 0 : -1;
            }

            if (strB == null) {
                return 1;
            }

            if (arguments.length >= 3) {
                if (!Bridge.isBoolean(arguments[2])) {
                    // StringComparison
                    switch (arguments[2]) {
                        case 1: // CurrentCultureIgnoreCase
                            return strA.localeCompare(strB, Bridge.CultureInfo.getCurrentCulture().name, { sensitivity: "accent" });
                        case 2: // InvariantCulture
                            return strA.localeCompare(strB, Bridge.CultureInfo.invariantCulture.name);
                        case 3: // InvariantCultureIgnoreCase
                            return strA.localeCompare(strB, Bridge.CultureInfo.invariantCulture.name, { sensitivity: "accent" });
                        case 4: // Ordinal
                            return (strA === strB) ? 0 : ((strA > strB) ? 1 : -1);
                        case 5: // OrdinalIgnoreCase
                            return (strA.toUpperCase() === strB.toUpperCase()) ? 0 : ((strA.toUpperCase() > strB.toUpperCase()) ? 1 : -1);
                        case 0: // CurrentCulture
                        default:
                            break;
                    }
                } else {
                    // ignoreCase
                    if (arguments[2]) {
                        strA = strA.toLocaleUpperCase();
                        strB = strB.toLocaleUpperCase();
                    }

                    if (arguments.length === 4) {
                        // CultureInfo
                        return strA.localeCompare(strB, arguments[3].name);
                    }
                }
            }

            return strA.localeCompare(strB);
        },

        toCharArray: function (str, startIndex, length) {
            if (startIndex < 0 || startIndex > str.length || startIndex > str.length - length) {
                throw new Bridge.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero and must refer to a location within the string");
            }

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (!Bridge.hasValue(startIndex)) {
                startIndex = 0;
            }

            if (!Bridge.hasValue(length)) {
                length = str.length;
            }

            var arr = [];

            for (var i = startIndex; i < startIndex + length; i++) {
                arr.push(str.charCodeAt(i));
            }

            return arr;
        },

        escape: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        replaceAll: function (str, a, b) {
            var reg = new RegExp(Bridge.String.escape(a), "g");

            return str.replace(reg, b);
        },

        insert: function (index, strA, strB) {
            return index > 0 ? (strA.substring(0, index) + strB + strA.substring(index, strA.length)) : (strB + strA);
        },

        remove: function (s, index, count) {
            if (!count || ((index + count) > this.length)) {
                return s.substr(0, index);
            }
            return s.substr(0, index) + s.substr(index + count);
        },

        split: function (s, strings, limit, options) {
            var re = (!Bridge.hasValue(strings) || strings.length === 0) ? new RegExp("\\s", "g") : new RegExp(strings.map(Bridge.String.escape).join('|'), 'g'),
                res = [],
                m,
                i;
            for (i = 0;; i = re.lastIndex) {
                if (m = re.exec(s)) {
                    if (options !== 1 || m.index > i) {
                        if (res.length === limit - 1) {
                            res.push(s.substr(i));
                            return res;
                        }
                        else
                            res.push(s.substring(i, m.index));
                    }
                }
                else {
                    if (options !== 1 || i !== s.length)
                        res.push(s.substr(i));
                    return res;
                }
            }
        },

        trimEnd: function (s, chars) {
            return s.replace(chars ? new RegExp('[' + String.fromCharCode.apply(null, chars) + ']+$') : /\s*$/, '');
        },

        trimStart: function(s, chars) {
            return s.replace(chars ? new RegExp('^[' + String.fromCharCode.apply(null, chars) + ']+') : /^\s*/, '');
        },

        trim: function(s, chars) {
            return Bridge.String.trimStart(Bridge.String.trimEnd(s, chars), chars);
        }
    };

    Bridge.String = string;

    // @source Enum.js

    var enumMethods = {
        nameEquals: function (n1, n2, ignoreCase) {
            if (ignoreCase) {
                return n1.toLowerCase() === n2.toLowerCase();
            }

            return (n1.charAt(0).toLowerCase() + n1.slice(1)) === (n2.charAt(0).toLowerCase() + n2.slice(1));
        },

        checkEnumType: function(enumType) {
            if (!enumType) {
                throw new Bridge.ArgumentNullException("enumType");
            }

            if (!enumType.prototype.$enum) {
                throw new Bridge.ArgumentException("", "enumType");
            }
        },

        toName: function(name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        },

        parse: function(enumType, s, ignoreCase, silent) {
            var values = enumType;

            Bridge.Enum.checkEnumType(enumType);

            if (!enumType.prototype.$flags) {
                for (var f in values) {
                    if (enumMethods.nameEquals(f, s, ignoreCase)) {
                        return values[f];
                    }
                }
            }
            else {
                var parts = s.split(',');
                var value = 0;
                var parsed = true;

                for (var i = parts.length - 1; i >= 0; i--) {
                    var part = parts[i].trim();
                    var found = false;

                    for (var f in values) {
                        if (enumMethods.nameEquals(f, part, ignoreCase)) {
                            value |= values[f];
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        parsed = false;
                        break;
                    }
                }

                if (parsed) {
                    return value;
                }
            }

            if (silent !== true) {
                throw new Bridge.ArgumentException('Invalid Enumeration Value');
            }

            return null;
        },

        toString: function (enumType, value, forceFlags) {
            Bridge.Enum.checkEnumType(enumType);

            var values = enumType;
            if ((!enumType.prototype.$flags && forceFlags !== true) || (value === 0)) {
                for (var i in values) {
                    if (values[i] === value) {
                        return enumMethods.toName(i);
                    }
                }
                //throw new Bridge.ArgumentException('Invalid Enumeration Value');
                return value.toString();
            }
            else {
                var parts = [];
                for (var i in values) {
                    if (values[i] & value) {
                        parts.push(enumMethods.toName(i));
                    }
                }
                if (!parts.length) {
                    //throw new Bridge.ArgumentException('Invalid Enumeration Value');
                    return value.toString();
                }
                return parts.join(', ');
            }
        },

        getValues: function (enumType) {
            Bridge.Enum.checkEnumType(enumType);
            var parts = [];
            var values = enumType;
            for (var i in values) {
                if (values.hasOwnProperty(i) && i.indexOf("$") < 0)
                    parts.push(values[i]);
            }
            return parts;
        },

        format: function (enumType, value, format) {
            Bridge.Enum.checkEnumType(enumType);

            var name;
            if (!Bridge.hasValue(value) && (name = "value") || !Bridge.hasValue(format) && (name = "format")) {
                throw new Bridge.ArgumentNullException(name);
            }

            switch (format) {
                case "G":
                case "g":
                    return Bridge.Enum.toString(enumType, value);
                case "x":
                case "X":
                    return value.toString(16);
                case "d":
                case "D":
                    return value.toString();
                case "f":
                case "F":
                    return Bridge.Enum.toString(enumType, value, true);
                default:
                    throw new Bridge.FormatException();
            }
        },

        getNames: function (enumType) {
            Bridge.Enum.checkEnumType(enumType);
            var parts = [];
            var values = enumType;
            for (var i in values) {
                if (values.hasOwnProperty(i) && i.indexOf("$") < 0)
                    parts.push(enumMethods.toName(i));
            }
            return parts;
        },

        getName: function (enumType, value) {
            Bridge.Enum.checkEnumType(enumType);
            var values = enumType;
            for (var i in values) {
                if (values[i] === value) {
                    return i.charAt(0).toUpperCase() + i.slice(1);
                }
            }

            return null;
        },

        hasFlag: function(value, flag) {
            return !!(value & flag);
        },

        isDefined: function (enumType, value) {
            Bridge.Enum.checkEnumType(enumType);
            var values = enumType;
            var isString = Bridge.isString(value);
            for (var i in values) {
                if (isString ? enumMethods.nameEquals(i, value, false) : values[i] === value) {
                    return true;
                }
            }

            return false;
        },

        tryParse: function (enumType, value, result, ignoreCase) {
            result.v = 0;
            result.v = enumMethods.parse(enumType, value, ignoreCase, true);

            if (result.v == null) {
                return false;
            }

            return true;
        }
    };

    Bridge.Enum = enumMethods;

    // @source Browser.js

	var check = function (regex) {
	    return regex.test(navigator.userAgent.toLowerCase());
	},

    isStrict = Bridge.global.document && Bridge.global.document.compatMode === "CSS1Compat",

    version = function (is, regex) {
        var m;

        return (is && (m = regex.exec(navigator.userAgent.toLowerCase()))) ? parseFloat(m[1]) : 0;
    },

    docMode = Bridge.global.document ? Bridge.global.document.documentMode : null,
    isOpera = check(/opera/),
    isOpera10_5 = isOpera && check(/version\/10\.5/),
    isChrome = check(/\bchrome\b/),
    isWebKit = check(/webkit/),
    isSafari = !isChrome && check(/safari/),
    isSafari2 = isSafari && check(/applewebkit\/4/),
    isSafari3 = isSafari && check(/version\/3/),
    isSafari4 = isSafari && check(/version\/4/),
    isSafari5_0 = isSafari && check(/version\/5\.0/),
    isSafari5 = isSafari && check(/version\/5/),
    isIE = !isOpera && (check(/msie/) || check(/trident/)),
    isIE7 = isIE && ((check(/msie 7/) && docMode !== 8 && docMode !== 9 && docMode !== 10) || docMode === 7),
    isIE8 = isIE && ((check(/msie 8/) && docMode !== 7 && docMode !== 9 && docMode !== 10) || docMode === 8),
    isIE9 = isIE && ((check(/msie 9/) && docMode !== 7 && docMode !== 8 && docMode !== 10) || docMode === 9),
    isIE10 = isIE && ((check(/msie 10/) && docMode !== 7 && docMode !== 8 && docMode !== 9) || docMode === 10),
    isIE11 = isIE && ((check(/trident\/7\.0/) && docMode !== 7 && docMode !== 8 && docMode !== 9 && docMode !== 10) || docMode === 11),
    isIE6 = isIE && check(/msie 6/),
    isGecko = !isWebKit && !isIE && check(/gecko/),
    isGecko3 = isGecko && check(/rv:1\.9/),
    isGecko4 = isGecko && check(/rv:2\.0/),
    isGecko5 = isGecko && check(/rv:5\./),
    isGecko10 = isGecko && check(/rv:10\./),
    isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
    isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
    isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
    isWindows = check(/windows|win32/),
    isMac = check(/macintosh|mac os x/),
    isLinux = check(/linux/),
    scrollbarSize = null,
    chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
    firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
    ieVersion = version(isIE, /msie (\d+\.\d+)/),
    operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
    safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
    webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
    isSecure = Bridge.global.location ? /^https/i.test(Bridge.global.location.protocol) : false,
    isiPhone = /iPhone/i.test(navigator.platform),
    isiPod = /iPod/i.test(navigator.platform),
    isiPad = /iPad/i.test(navigator.userAgent),
    isBlackberry = /Blackberry/i.test(navigator.userAgent),
    isAndroid = /Android/i.test(navigator.userAgent),
    isDesktop = isMac || isWindows || (isLinux && !isAndroid),
    isTablet = isiPad,
    isPhone = !isDesktop && !isTablet;

	var browser = {
	    isStrict: isStrict,
	    isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
	    isOpera: isOpera,
	    isOpera10_5: isOpera10_5,
	    isWebKit: isWebKit,
	    isChrome: isChrome,
	    isSafari: isSafari,
	    isSafari3: isSafari3,
	    isSafari4: isSafari4,
	    isSafari5: isSafari5,
	    isSafari5_0: isSafari5_0,
	    isSafari2: isSafari2,
	    isIE: isIE,
	    isIE6: isIE6,
	    isIE7: isIE7,
	    isIE7m: isIE6 || isIE7,
	    isIE7p: isIE && !isIE6,
	    isIE8: isIE8,
	    isIE8m: isIE6 || isIE7 || isIE8,
	    isIE8p: isIE && !(isIE6 || isIE7),
	    isIE9: isIE9,
	    isIE9m: isIE6 || isIE7 || isIE8 || isIE9,
	    isIE9p: isIE && !(isIE6 || isIE7 || isIE8),
	    isIE10: isIE10,
	    isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
	    isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
	    isIE11: isIE11,
	    isIE11m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10 || isIE11,
	    isIE11p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9 || isIE10),
	    isGecko: isGecko,
	    isGecko3: isGecko3,
	    isGecko4: isGecko4,
	    isGecko5: isGecko5,
	    isGecko10: isGecko10,
	    isFF3_0: isFF3_0,
	    isFF3_5: isFF3_5,
	    isFF3_6: isFF3_6,
	    isFF4: 4 <= firefoxVersion && firefoxVersion < 5,
	    isFF5: 5 <= firefoxVersion && firefoxVersion < 6,
	    isFF10: 10 <= firefoxVersion && firefoxVersion < 11,
	    isLinux: isLinux,
	    isWindows: isWindows,
	    isMac: isMac,
	    chromeVersion: chromeVersion,
	    firefoxVersion: firefoxVersion,
	    ieVersion: ieVersion,
	    operaVersion: operaVersion,
	    safariVersion: safariVersion,
	    webKitVersion: webKitVersion,
	    isSecure: isSecure,
	    isiPhone: isiPhone,
	    isiPod: isiPod,
	    isiPad: isiPad,
	    isBlackberry: isBlackberry,
	    isAndroid: isAndroid,
	    isDesktop: isDesktop,
	    isTablet: isTablet,
	    isPhone: isPhone,
	    iOS: isiPhone || isiPad || isiPod,
	    standalone: Bridge.global.navigator ? !!Bridge.global.navigator.standalone : false
	};

	Bridge.Browser = browser;
    // @source Class.js

    var initializing = false;

    // The base Class implementation
    var base = {
        cache: { },

        initCtor: function () {
            var value = arguments[0];

            if (this.$multipleCtors && arguments.length > 0 && typeof value == "string") {
                value = value === "constructor" ? "$constructor" : value;

                if ((value === "$constructor" || Bridge.String.startsWith(value, "constructor$")) && Bridge.isFunction(this[value])) {
                    this[value].apply(this, Array.prototype.slice.call(arguments, 1));

                    return;
                }
            }

            if (this.$constructor) {
                this.$constructor.apply(this, arguments);
            }
        },

        initConfig: function (extend, base, cfg, statics, scope) {
            var initFn,
                isFn = Bridge.isFunction(cfg),
                fn = function () {
                    var name,
                        config;

                    config = Bridge.isFunction(cfg) ? cfg() : cfg;

                    if (config.fields) {
                        for (name in config.fields) {
                            this[name] = config.fields[name];
                        }
                    }

                    if (config.properties) {
                        for (name in config.properties) {
                            Bridge.property(this, name, config.properties[name]);
                        }
                    }

                    if (config.events) {
                        for (name in config.events) {
                            Bridge.event(this, name, config.events[name]);
                        }
                    }
                    if (config.alias) {
                        for (name in config.alias) {
                            if (this[name]) {
                                this[name] = this[config.alias[name]];
                            }
                        }
                    }

                    if (config.init) {
                        initFn = config.init;
                    }
                };

            if (!isFn) {
                fn.apply(scope);
            }

            scope.$initMembers = function () {
                if (extend && !statics && base.$initMembers) {
                    base.$initMembers.apply(this, arguments);
                }

                if (isFn) {
                    fn.apply(this);
                }

                if (initFn) {
                    initFn.apply(this, arguments);
                }
            };
        },

        // Create a new Class that inherits from this class
        define: function (className, gscope, prop) {
            if (!prop) {
                prop = gscope;
                gscope = Bridge.global;
            }

            if (Bridge.isFunction(prop)) {
                fn = function () {
                    var args = Array.prototype.slice.call(arguments),
                        name,
                        obj,
                        c;

                    args.unshift(className);
                    name = Bridge.Class.genericName.apply(null, args),
                        c = Bridge.Class.cache[name];

                    if (c) {
                        return c;
                    }

                    obj = prop.apply(null, args.slice(1));
                    obj.$cacheName = name;
                    c = Bridge.define(name, obj);

                    return  c;
                };

                return Bridge.Class.generic(className, gscope, fn);
            }

            prop = prop || {};

            var extend = prop.$inherits || prop.inherits,
                statics = prop.$statics || prop.statics,
                base,
                cacheName = prop.$cacheName,
                prototype,
                scope = prop.$scope || Bridge.global,
                i,
                v,
                ctorCounter,
                isCtor,
                ctorName,
                name,
                fn;

            if (prop.$inherits) {
                delete prop.$inherits;
            } else {
                delete prop.inherits;
            }

            if (Bridge.isFunction(statics)) {
                statics = null;
            } else if (prop.$statics) {
                delete prop.$statics;
            } else {
                delete prop.statics;
            }

            if (prop.$cacheName) {
                delete prop.$cacheName;
            }

            // The dummy class constructor
            function Class() {
                if (!(this instanceof Class)) {
                    var args = Array.prototype.slice.call(arguments, 0),
                        object = Object.create(Class.prototype),
                        result = Class.apply(object, args);

                    return typeof result === "object" ? result : object;
                }

                // All construction is actually done in the init method
                if (!initializing) {
                    if (this.$staticInit) {
                        this.$staticInit();
                    }

                    if (this.$initMembers) {
                        this.$initMembers.apply(this, arguments);
                    }

                    this.$$initCtor.apply(this, arguments);
                }
            };

            scope = Bridge.Class.set(scope, className, Class);

            if (cacheName) {
                Bridge.Class.cache[cacheName] = Class;
            }

            Class.$$name = className;

            if (extend && Bridge.isFunction(extend)) {
                extend = extend();
            }

            base = extend ? extend[0].prototype : this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            prototype = extend ? new extend[0]() : new Object();
            initializing = false;

            if (statics) {
                var staticsConfig = statics.$config || statics.config;

                if (staticsConfig && !Bridge.isFunction(staticsConfig)) {
                    Bridge.Class.initConfig(extend, base, staticsConfig, true, Class);

                    if (statics.$config) {
                        delete statics.$config;
                    } else {
                        delete statics.config;
                    }
                }
            }

            var instanceConfig = prop.$config || prop.config;

            if (instanceConfig && !Bridge.isFunction(instanceConfig)) {
                Bridge.Class.initConfig(extend, base, instanceConfig, false, prop);                

                if (prop.$config) {
                    delete prop.$config;
                } else {
                    delete prop.config;
                }
            } else {
                prop.$initMembers = extend ? function () {
                    base.$initMembers.apply(this, arguments);
                } : function () { };
            }

            prop.$$initCtor = Bridge.Class.initCtor;

            // Copy the properties over onto the new prototype
            ctorCounter = 0;

            var keys = [];

            for (name in prop) {
                keys.push(name);
            }

            if (Bridge.Browser.isIE8) {
                if (prop.hasOwnProperty("constructor") && keys.indexOf("constructor") < 0) {
                    keys.push("constructor");
                }
            }            

            for (var i = 0; i < keys.length; i++) {
                name = keys[i];

                v = prop[name];
                isCtor = name === "constructor";
                ctorName = isCtor ? "$constructor" : name;

                if (Bridge.isFunction(v) && (isCtor || Bridge.String.startsWith(name, "constructor$"))) {
                    ctorCounter++;
                    isCtor = true;
                }

                prototype[ctorName] = prop[name];

                if (isCtor) {
                    (function (ctorName) {
                        Class[ctorName] = function () {
                            var args = Array.prototype.slice.call(arguments);

                            if (this.$initMembers) {
                                this.$initMembers.apply(this, args);
                            }

                            args.unshift(ctorName);
                            this.$$initCtor.apply(this, args);
                        };
                    })(ctorName);

                    Class[ctorName].prototype = prototype;
                    Class[ctorName].prototype.constructor = Class;
                }
            }

            if (ctorCounter === 0) {
                prototype.$constructor = extend ? function () {
                    base.$constructor.apply(this, arguments);
                } : function () { };
            }

            if (ctorCounter > 1) {
                prototype.$multipleCtors = true;
            }

            prototype.$$name = className;

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            if (statics) {
                for (name in statics) {
                    Class[name] = statics[name];
                }
            }

            if (!extend) {
                extend = [Object];
            }

            Class.$$inherits = extend;

            for (i = 0; i < extend.length; i++) {
                scope = extend[i];

                if (!scope.$$inheritors) {
                    scope.$$inheritors = [];
                }

                scope.$$inheritors.push(Class);
            }

            fn = function () {
                Class.$staticInit = null;

                if (Class.$initMembers) {
                    Class.$initMembers.call(Class);
                }

                if (Class.constructor) {
                    Class.constructor.call(Class);
                }
            };

            Bridge.Class.$queue.push(Class);
            Class.$staticInit = fn;

            return Class;
        },


        addExtend: function (cls, extend) {
            var i,
                scope;

            Array.prototype.push.apply(cls.$$inherits, extend);

            for (i = 0; i < extend.length; i++) {
                scope = extend[i];

                if (!scope.$$inheritors) {
                    scope.$$inheritors = [];
                }

                scope.$$inheritors.push(cls);
            }
        },

        set: function (scope, className, cls) {
            var nameParts = className.split("."),
                name,
                key,
                exists,
                i;

            for (i = 0; i < (nameParts.length - 1) ; i++) {
                if (typeof scope[nameParts[i]] == "undefined") {
                    scope[nameParts[i]] = { };
                }

                scope = scope[nameParts[i]];
            }

            name = nameParts[nameParts.length - 1];
            exists = scope[name];

            if (exists) {
                for (key in exists) {
                    if (key.indexOf("$", key.length - 1) !== -1) {
                        var key1 = key.slice(0, -1);
                        if (typeof exists[key1] === "function" && exists[key1].$$name) {
                            cls[key] = exists[key];
                        }
                    }
                    else if (typeof exists[key] === "function" && exists[key].$$name) {
                        cls[key] = exists[key];
                    }
                }
            }            

            scope[name] = cls;

            return scope;
        },

        genericName: function () {
            var name = arguments[0];

            for (var i = 1; i < arguments.length; i++) {
                name += "$" + Bridge.getTypeName(arguments[i]);
            }

            return name;
        },

        generic: function (className, scope, fn) {
            if (!fn) {
                fn = scope;
                scope = Bridge.global;
            }
            fn.$$name = className;
            Bridge.Class.set(scope, className, fn);

            return fn;
        },

        init: function (fn) {
            for (var i = 0; i < Bridge.Class.$queue.length; i++) {
                var t = Bridge.Class.$queue[i];

                if (t.$staticInit) {
                    t.$staticInit();
                }
            }
            Bridge.Class.$queue.length = 0;

            if (fn) {
                fn();
            }
        }
    };

    Bridge.Class = base;
    Bridge.Class.$queue = [];
    Bridge.define = Bridge.Class.define;
    Bridge.init = Bridge.Class.init;

    // @source Exception.js

    Bridge.define("Bridge.Exception", {
        constructor: function (message, innerException) {
            this.message = message ? message : null;
            this.innerException = innerException ? innerException : null;
            this.errorStack = new Error();
            this.data = new Bridge.Dictionary$2(Object, Object)();
        },

        getMessage: function () {
            return this.message;
        },

        getInnerException: function () {
            return this.innerException;
        },

        getStackTrace: function () {
            return this.errorStack.stack;
        },

        getData: function () {
            return this.data;
        },

        toString: function () {
            return this.getMessage();
        },

        statics: {
            create: function (error) {
                if (Bridge.is(error, Bridge.Exception)) {
                    return error;
                }

                if (error instanceof TypeError) {
                    return new Bridge.NullReferenceException(error.message, new Bridge.ErrorException(error));
                } else if (error instanceof RangeError) {
                    return new Bridge.ArgumentOutOfRangeException(null, error.message, new Bridge.ErrorException(error));
                } else if (error instanceof Error) {
                    return new Bridge.ErrorException(error);
                } else {
                    return new Bridge.Exception(error ? error.toString() : null);
                }
            }
        }
    });

    Bridge.define("Bridge.SystemException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "System error.", innerException);
        }
    });

    Bridge.define("Bridge.OutOfMemoryException", {
        inherits: [Bridge.SystemException],

        constructor: function (message, innerException) {
            if (!message) {
                message = "Insufficient memory to continue the execution of the program.";
            }

            Bridge.SystemException.prototype.$constructor.call(this, message, innerException);
        }
    });

    Bridge.define("Bridge.ErrorException", {
        inherits: [Bridge.Exception],

        constructor: function (error) {
            Bridge.Exception.prototype.$constructor.call(this, error.message);
            this.errorStack = error;
            this.error = error;
        },

        getError: function () {
            return this.error;
        }
    });

    Bridge.define("Bridge.ArgumentException", {
        inherits: [Bridge.Exception],

        constructor: function (message, paramName, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Value does not fall within the expected range.", innerException);
            this.paramName = paramName ? paramName : null;
        },

        getParamName: function () {
            return this.paramName;
        }
    });

    Bridge.define("Bridge.ArgumentNullException", {
        inherits: [Bridge.ArgumentException],

        constructor: function (paramName, message, innerException) {
            if (!message) {
                message = "Value cannot be null.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }
            }

            Bridge.ArgumentException.prototype.$constructor.call(this, message, paramName, innerException);
        }
    });

    Bridge.define("Bridge.ArgumentOutOfRangeException", {
        inherits: [Bridge.ArgumentException],

        constructor: function (paramName, message, innerException, actualValue) {
            if (!message) {
                message = "Value is out of range.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }
            }

            Bridge.ArgumentException.prototype.$constructor.call(this, message, paramName, innerException);

            this.actualValue = actualValue ? actualValue : null;
        },

        getActualValue: function () {
            return this.actualValue;
        }
    });

    Bridge.define("Bridge.CultureNotFoundException", {
        inherits: [Bridge.ArgumentException],

        constructor: function (paramName, invalidCultureName, message, innerException, invalidCultureId) {
            if (!message) {
                message = "Culture is not supported.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }

                if (invalidCultureName) {
                    message += "\n" + invalidCultureName + " is an invalid culture identifier.";
                }
            }

            Bridge.ArgumentException.prototype.$constructor.call(this, message, paramName, innerException);

            this.invalidCultureName = invalidCultureName ? invalidCultureName : null;
            this.invalidCultureId = invalidCultureId ? invalidCultureId : null;
        },

        getInvalidCultureName: function () {
            return this.invalidCultureName;
        },

        getInvalidCultureId: function () {
            return this.invalidCultureId;
        }
    });

    Bridge.define("Bridge.KeyNotFoundException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Key not found.", innerException);
        }
    });

    Bridge.define("Bridge.ArithmeticException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Overflow or underflow in the arithmetic operation.", innerException);
        }
    });

    Bridge.define("Bridge.DivideByZeroException", {
        inherits: [Bridge.ArithmeticException],

        constructor: function (message, innerException) {
            Bridge.ArithmeticException.prototype.$constructor.call(this, message || "Division by 0.", innerException);
        }
    });

    Bridge.define("Bridge.OverflowException", {
        inherits: [Bridge.ArithmeticException],

        constructor: function (message, innerException) {
            Bridge.ArithmeticException.prototype.$constructor.call(this, message || "Arithmetic operation resulted in an overflow.", innerException);
        }
    });

    Bridge.define("Bridge.FormatException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Invalid format.", innerException);
        }
    });

    Bridge.define("Bridge.InvalidCastException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "The cast is not valid.", innerException);
        }
    });

    Bridge.define("Bridge.InvalidOperationException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Operation is not valid due to the current state of the object.", innerException);
        }
    });

    Bridge.define("Bridge.NotImplementedException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "The method or operation is not implemented.", innerException);
        }
    });

    Bridge.define("Bridge.NotSupportedException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Specified method is not supported.", innerException);
        }
    });

    Bridge.define("Bridge.NullReferenceException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Object is null.", innerException);
        }
    });

    Bridge.define("Bridge.RankException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Attempted to operate on an array with the incorrect number of dimensions.", innerException);
        }
    });

    Bridge.define("Bridge.PromiseException", {
        inherits: [Bridge.Exception],

        constructor: function (args, message, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || (args.length && args[0] ? args[0].toString() : "An error occurred"), innerException);
            this.arguments = Bridge.Array.clone(args);
        },

        getArguments: function () {
            return this.arguments;
        }
    });

    Bridge.define("Bridge.OperationCanceledException", {
        inherits: [Bridge.Exception],

        constructor: function (message, token, innerException) {
            Bridge.Exception.prototype.$constructor.call(this, message || "Operation was canceled.", innerException);
            this.cancellationToken = token || Bridge.CancellationToken.none;
        }
    });

    Bridge.define("Bridge.TaskCanceledException", {
        inherits: [Bridge.OperationCanceledException],

        constructor: function (message, task, innerException) {
            Bridge.OperationCanceledException.prototype.$constructor.call(this, message || "A task was canceled.", null, innerException);
            this.task = task || null;
        }
    });

    Bridge.define("Bridge.AggregateException", {
        inherits: [Bridge.Exception],

        constructor: function (message, innerExceptions) {
            this.innerExceptions = new Bridge.ReadOnlyCollection$1(Bridge.Exception)(Bridge.hasValue(innerExceptions) ? Bridge.toArray(innerExceptions) : []);
            Bridge.Exception.prototype.$constructor.call(this, message || 'One or more errors occurred.', this.innerExceptions.items.length ? this.innerExceptions.items[0] : null);
        },

        handle: function (predicate) {
            if (!Bridge.hasValue(predicate)) {
                throw new Bridge.ArgumentNullException("predicate");
            }

            var count = this.innerExceptions.getCount(),
                unhandledExceptions = [];

            for (var i = 0; i < count; i++) {
                if (!predicate(this.innerExceptions.get(i))) {
                    unhandledExceptions.push(this.innerExceptions.get(i));
                }
            }

            if (unhandledExceptions.length > 0) {
                throw new Bridge.AggregateException(this.getMessage(), unhandledExceptions);
            }
        },

        flatten: function () {
            // Initialize a collection to contain the flattened exceptions.
            var flattenedExceptions = new Bridge.List$1(Bridge.Exception)();

            // Create a list to remember all aggregates to be flattened, this will be accessed like a FIFO queue
            var exceptionsToFlatten = new Bridge.List$1(Bridge.AggregateException)();
            exceptionsToFlatten.add(this);
            var nDequeueIndex = 0;

            // Continue removing and recursively flattening exceptions, until there are no more.
            while (exceptionsToFlatten.getCount() > nDequeueIndex) {
                // dequeue one from exceptionsToFlatten
                var currentInnerExceptions = exceptionsToFlatten.getItem(nDequeueIndex++).innerExceptions;

                for (var i = 0; i < currentInnerExceptions.getCount() ; i++) {
                    var currentInnerException = currentInnerExceptions.get(i);

                    if (!Bridge.hasValue(currentInnerException)) {
                        continue;
                    }

                    var currentInnerAsAggregate = Bridge.as(currentInnerException, Bridge.AggregateException);

                    // If this exception is an aggregate, keep it around for later.  Otherwise,
                    // simply add it to the list of flattened exceptions to be returned.
                    if (Bridge.hasValue(currentInnerAsAggregate)) {
                        exceptionsToFlatten.add(currentInnerAsAggregate);
                    }
                    else {
                        flattenedExceptions.add(currentInnerException);
                    }
                }
            }

            return new Bridge.AggregateException(this.getMessage(), flattenedExceptions);
        }
    });

    // @source Interfaces.js

    Bridge.define("Bridge.IFormattable", {
        statics: {
            $is: function (obj) {
                if (Bridge.isNumber(obj)) {
                    return true;
                }

                if (Bridge.isDate(obj)) {
                    return true;
                }

                return Bridge.is(obj, Bridge.IFormattable, true);
            }
        }
    });

    Bridge.define("Bridge.IComparable");

    Bridge.define("Bridge.IFormatProvider");

    Bridge.define("Bridge.ICloneable");

    Bridge.Class.generic("Bridge.IComparable$1", function (T) {
        var $$name = Bridge.Class.genericName("Bridge.IComparable$1", T);

        return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name));
    });

    Bridge.Class.generic("Bridge.IEquatable$1", function (T) {
        var $$name = Bridge.Class.genericName("Bridge.IEquatable$1", T);

        return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name));
    });

    Bridge.define("Bridge.IPromise");
    Bridge.define("Bridge.IDisposable");

    /// <reference path="Init.js" />
    // @source Globalization.js

    Bridge.define("Bridge.DateTimeFormatInfo", {
        inherits: [Bridge.IFormatProvider, Bridge.ICloneable],

        statics: {
            $allStandardFormats: {
                "d": "shortDatePattern",
                "D": "longDatePattern",
                "f": "longDatePattern shortTimePattern",
                "F": "longDatePattern longTimePattern",
                "g": "shortDatePattern shortTimePattern",
                "G": "shortDatePattern longTimePattern",
                "m": "monthDayPattern",
                "M": "monthDayPattern",
                "o": "roundtripFormat",
                "O": "roundtripFormat",
                "r": "rfc1123",
                "R": "rfc1123",
                "s": "sortableDateTimePattern",
                "S": "sortableDateTimePattern1",
                "t": "shortTimePattern",
                "T": "longTimePattern",
                "u": "universalSortableDateTimePattern",
                "U": "longDatePattern longTimePattern",
                "y": "yearMonthPattern",
                "Y": "yearMonthPattern"
            },

            constructor: function () {
                this.invariantInfo = Bridge.merge(new Bridge.DateTimeFormatInfo(), {
                    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    abbreviatedMonthGenitiveNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                    amDesignator: "AM",
                    dateSeparator: "/",
                    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    firstDayOfWeek: 0,
                    fullDateTimePattern: "dddd, dd MMMM yyyy HH:mm:ss",
                    longDatePattern: "dddd, dd MMMM yyyy",
                    longTimePattern: "HH:mm:ss",
                    monthDayPattern: "MMMM dd",
                    monthGenitiveNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    pmDesignator: "PM",
                    rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
                    shortDatePattern: "MM/dd/yyyy",
                    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                    shortTimePattern: "HH:mm",
                    sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    sortableDateTimePattern1: "yyyy'-'MM'-'dd",
                    timeSeparator: ":",
                    universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    yearMonthPattern: "yyyy MMMM",
                    roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.uzzz"
                });
            }
        },

        getFormat: function (type) {
            switch (type) {
                case Bridge.DateTimeFormatInfo:
                    return this;
                default:
                    return null;
            }
        },

        getAbbreviatedDayName: function (dayofweek) {
            if (dayofweek < 0 || dayofweek > 6) {
                throw new Bridge.ArgumentOutOfRangeException("dayofweek");
            }

            return this.abbreviatedDayNames[dayofweek];
        },

        getAbbreviatedMonthName: function (month) {
            if (month < 1 || month > 13) {
                throw new Bridge.ArgumentOutOfRangeException("month");
            }

            return this.abbreviatedMonthNames[month - 1];
        },

        getAllDateTimePatterns: function (format, returnNull) {
            var f = Bridge.DateTimeFormatInfo.$allStandardFormats,
                formats,
                names,
                pattern,
                i,
                result = [];

            if (format) {
                if (!f[format]) {
                    if (returnNull) {
                        return null;
                    }

                    throw new Bridge.ArgumentException(null, "format");
                }

                formats = { };
                formats[format] = f[format];
            } else {
                formats = f;
            }

            for (f in formats) {
                names = formats[f].split(" ");
                pattern = "";

                for (i = 0; i < names.length; i++) {
                    pattern = (i === 0 ? "" : (pattern + " ")) + this[names[i]];
                }

                result.push(pattern);
            }

            return result;
        },

        getDayName: function (dayofweek) {
            if (dayofweek < 0 || dayofweek > 6) {
                throw new Bridge.ArgumentOutOfRangeException("dayofweek");
            }

            return this.dayNames[dayofweek];
        },

        getMonthName: function (month) {
            if (month < 1 || month > 13) {
                throw new Bridge.ArgumentOutOfRangeException("month");
            }

            return this.monthNames[month-1];
        },

        getShortestDayName: function (dayOfWeek) {
            if (dayOfWeek < 0 || dayOfWeek > 6) {
                throw new Bridge.ArgumentOutOfRangeException("dayOfWeek");
            }

            return this.shortestDayNames[dayOfWeek];
        },

        clone: function () {
            return Bridge.copy(new Bridge.DateTimeFormatInfo(), this, [
                "abbreviatedDayNames",
                "abbreviatedMonthGenitiveNames",
                "abbreviatedMonthNames",
                "amDesignator",
                "dateSeparator",
                "dayNames",
                "firstDayOfWeek",
                "fullDateTimePattern",
                "longDatePattern",
                "longTimePattern",
                "monthDayPattern",
                "monthGenitiveNames",
                "monthNames",
                "pmDesignator",
                "rfc1123",
                "shortDatePattern",
                "shortestDayNames",
                "shortTimePattern",
                "sortableDateTimePattern",
                "timeSeparator",
                "universalSortableDateTimePattern",
                "yearMonthPattern",
                "roundtripFormat"
            ]);
        }
    });

    Bridge.define("Bridge.NumberFormatInfo", {
        inherits: [Bridge.IFormatProvider, Bridge.ICloneable],

        statics: {
            constructor: function () {
                this.numberNegativePatterns =  ["(n)", "-n", "- n", "n-", "n -"];
                this.currencyNegativePatterns = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
                this.currencyPositivePatterns = ["$n", "n$", "$ n", "n $"];
                this.percentNegativePatterns = ["-n %", "-n%", "-%n", "%-n", "%n-", "n-%", "n%-", "-% n", "n %-", "% n-", "% -n", "n- %"];
                this.percentPositivePatterns = ["n %", "n%", "%n", "% n"];

                this.invariantInfo = Bridge.merge(new Bridge.NumberFormatInfo(), {
                    nanSymbol: "NaN",
                    negativeSign: "-",
                    positiveSign: "+",
                    negativeInfinitySymbol: "-Infinity",
                    positiveInfinitySymbol: "Infinity",

                    percentSymbol: "%",
                    percentGroupSizes: [3],
                    percentDecimalDigits: 2,
                    percentDecimalSeparator: ".",
                    percentGroupSeparator: ",",
                    percentPositivePattern: 0,
                    percentNegativePattern: 0,

                    currencySymbol: "¤",
                    currencyGroupSizes: [3],
                    currencyDecimalDigits: 2,
                    currencyDecimalSeparator: ".",
                    currencyGroupSeparator: ",",
                    currencyNegativePattern: 0,
                    currencyPositivePattern: 0,

                    numberGroupSizes: [3],
                    numberDecimalDigits: 2,
                    numberDecimalSeparator: ".",
                    numberGroupSeparator: ",",
                    numberNegativePattern: 1
                });
            }
        },

        getFormat: function (type) {
            switch (type) {
                case Bridge.NumberFormatInfo:
                    return this;
                default:
                    return null;
            }
        },

        clone: function () {
            return Bridge.copy(new Bridge.NumberFormatInfo(), this, [
                "nanSymbol",
                "negativeSign",
                "positiveSign",
                "negativeInfinitySymbol",
                "positiveInfinitySymbol",
                "percentSymbol",
                "percentGroupSizes",
                "percentDecimalDigits",
                "percentDecimalSeparator",
                "percentGroupSeparator",
                "percentPositivePattern",
                "percentNegativePattern",
                "currencySymbol",
                "currencyGroupSizes",
                "currencyDecimalDigits",
                "currencyDecimalSeparator",
                "currencyGroupSeparator",
                "currencyNegativePattern",
                "currencyPositivePattern",
                "numberGroupSizes",
                "numberDecimalDigits",
                "numberDecimalSeparator",
                "numberGroupSeparator",
                "numberNegativePattern"
            ]);
        }
    });

    Bridge.define("Bridge.CultureInfo", {
        inherits: [Bridge.IFormatProvider, Bridge.ICloneable],

        statics: {
            constructor: function () {
                this.cultures = this.cultures || {};

                this.invariantCulture = Bridge.merge(new Bridge.CultureInfo("iv", true), {
                    englishName: "Invariant Language (Invariant Country)",
                    nativeName: "Invariant Language (Invariant Country)",
                    numberFormat: Bridge.NumberFormatInfo.invariantInfo,
                    dateTimeFormat: Bridge.DateTimeFormatInfo.invariantInfo
                });

                this.setCurrentCulture(Bridge.CultureInfo.invariantCulture);
            },

            getCurrentCulture: function () {
                return this.currentCulture;
            },

            setCurrentCulture: function (culture) {
                this.currentCulture = culture;

                Bridge.DateTimeFormatInfo.currentInfo = culture.dateTimeFormat;
                Bridge.NumberFormatInfo.currentInfo = culture.numberFormat;
            },

            getCultureInfo: function (name) {
                if (!name) {
                    throw new Bridge.ArgumentNullException("name");
                }

                return this.cultures[name];
            },

            getCultures: function () {
                var names = Bridge.getPropertyNames(this.cultures),
                    result = [],
                    i;

                for (i = 0; i < names.length; i++) {
                    result.push(this.cultures[names[i]]);
                }

                return result;
            }
        },

        constructor: function (name, create) {
            this.name = name;

            if (!Bridge.CultureInfo.cultures) {
                Bridge.CultureInfo.cultures = {};
            }

            if (Bridge.CultureInfo.cultures[name]) {
                Bridge.copy(this, Bridge.CultureInfo.cultures[name], [
                    "englishName",
                    "nativeName",
                    "numberFormat",
                    "dateTimeFormat"
                ]);
            } else {
                if (!create) {
                    throw new Bridge.CultureNotFoundException("name", name);
                }

                Bridge.CultureInfo.cultures[name] = this;
            }
        },

        getFormat:  function (type) {
            switch (type) {
                case Bridge.NumberFormatInfo:
                    return this.numberFormat;
                case Bridge.DateTimeFormatInfo:
                    return this.dateTimeFormat;
                default:
                    return null;
            }
        },

        clone: function () {
            return new Bridge.CultureInfo(this.name);
        }
    });

    // @source Math.js

    var math = {
        divRem: function(a, b, result) {
            var remainder = a % b;
            result.v = remainder;
            return (a - remainder) / b;
        },

        round: function(n, d, rounding) {
            var m = Math.pow(10, d || 0);
            n *= m;
            var sign = (n > 0) | -(n < 0);
            if (n % 1 === 0.5 * sign) {
                var f = Math.floor(n);
                return (f + (rounding === 4 ? (sign > 0) : (f % 2 * sign))) / m;
            }

            return Math.round(n) / m;
        }
    };

    Bridge.Math = math;

    // @source Integer.js

    /*(function () {
        var createIntType = function (name, min, max) {
            var type = Bridge.define(name, {
                inherits: [Bridge.IComparable, Bridge.IFormattable],
                statics: {
                    min: min,
                    max: max,

                    instanceOf: function (instance) {
                        return typeof(instance) === 'number' && Math.round(instance, 0) == instance && instance >= min && instance <= max;
                    },
                    getDefaultValue: function () {
                        return 0;
                    },
                    parse: function (s) {
                        return Bridge.Int.parseInt(s, min, max);
                    },
                    tryParse: function (s, result) {
                        return Bridge.Int.tryParseInt(s, result, min, max);
                    },
                    format: function (number, format, provider) {
                        return Bridge.Int.format(number, format, provider);
                    }
                }
            });

            Bridge.Class.addExtend(type, [Bridge.IComparable$1(type), Bridge.IEquatable$1(type)]);
        };

        createIntType('Bridge.Byte', 0, 255);
        createIntType('Bridge.SByte', -128, 127);
        createIntType('Bridge.Int16', -32768, 32767);
        createIntType('Bridge.UInt16', 0, 65535);
        createIntType('Bridge.Int32', -2147483648, 2147483647);
        createIntType('Bridge.UInt32', 0, 4294967295);
        createIntType('Bridge.Int64', -9223372036854775808, 9223372036854775807);
        createIntType('Bridge.UInt64', 0, 18446744073709551615);
        createIntType('Bridge.Char', 0, 65535);

        Bridge.Char.tryParse = function (s, result) {
            var b = s && s.length === 1;
            result.v = b ? s.charCodeAt(0) : 0;
            return b;
        };

        Bridge.Char.parse = function (s) {
            if (!Bridge.hasValue(s)) {
                throw new Bridge.ArgumentNullException('s');
            }

            if (s.length !== 1) {
                throw new Bridge.FormatException();
            }
            return s.charCodeAt(0);
        };
    })();*/

    Bridge.define("Bridge.Int", {
        inherits: [Bridge.IComparable, Bridge.IFormattable],
        statics: {
            instanceOf: function (instance) {
                return typeof(instance) === "number" && isFinite(instance) && Math.floor(instance, 0) === instance;
            },

            getDefaultValue: function () {
                return 0;
            },

            format: function (number, format, provider) {
                var nf = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.NumberFormatInfo),
                    decimalSeparator = nf.numberDecimalSeparator,
                    groupSeparator = nf.numberGroupSeparator,
                    isDecimal = number instanceof Bridge.Decimal,
                    isNeg = isDecimal ? number.isNegative() : number < 0,
                    match,
                    precision,
                    groups,
                    fs;

                if (isDecimal ? !number.isFinite() : !isFinite(number)) {
                    return Number.NEGATIVE_INFINITY === number || (isDecimal && isNeg) ? nf.negativeInfinitySymbol : nf.positiveInfinitySymbol;
                }

                if (!format) {
                    return this.defaultFormat(number, 0, 0, 15, nf, true);
                }

                match = format.match(/^([a-zA-Z])(\d*)$/);

                if (match) {
                    fs = match[1].toUpperCase();
                    precision = parseInt(match[2], 10);
                    precision = precision > 15 ? 15 : precision;

                    switch (fs) {
                        case "D":
                            return this.defaultFormat(number, isNaN(precision) ? 1 : precision, 0, 0, nf, true);
                        case "F":
                        case "N":
                            if (isNaN(precision)) {
                                precision = nf.numberDecimalDigits;
                            }
                            return this.defaultFormat(number, 1, precision, precision, nf, fs === "F");
                        case "G":
                        case "E":
                            var exponent = 0,
                                coefficient = isDecimal ? number.abs() : Math.abs(number),
                                exponentPrefix = match[1],
                                exponentPrecision = 3,
                                minDecimals,
                                maxDecimals;

                            while (isDecimal ? coefficient.gte(10) : (coefficient >= 10)) {
                                if (isDecimal) {
                                    coefficient = coefficient.div(10);
                                } else {
                                    coefficient /= 10;
                                }
                                
                                exponent++;
                            }

                            while (isDecimal ? (coefficient.ne(0) && coefficient.lt(1)) : (coefficient !== 0 && coefficient < 1)) {
                                if (isDecimal) {
                                    coefficient = coefficient.mul(10);
                                } else {
                                    coefficient *= 10;
                                }
                                exponent--;
                            }

                            if (fs === "G") {
                                if (exponent > -5 && (!precision || exponent < precision)) {
                                    minDecimals = precision ? precision - (exponent > 0 ? exponent + 1 : 1) : 0;
                                    maxDecimals = precision ? precision - (exponent > 0 ? exponent + 1 : 1) : 15;
                                    return this.defaultFormat(number, 1, minDecimals, maxDecimals, nf, true);
                                }

                                exponentPrefix = exponentPrefix === "G" ? "E" : "e";
                                exponentPrecision = 2;
                                minDecimals = (precision || 1) - 1;
                                maxDecimals = (precision || 11) - 1;
                            } else {
                                minDecimals = maxDecimals = isNaN(precision) ? 6 : precision;
                            }

                            if (exponent >= 0) {
                                exponentPrefix += nf.positiveSign;
                            } else {
                                exponentPrefix += nf.negativeSign;
                                exponent = -exponent;
                            }

                            if (isNeg) {
                                if (isDecimal) {
                                    coefficient = coefficient.mul(-1);
                                } else {
                                    coefficient *= -1;
                                }
                            }

                            return this.defaultFormat(coefficient, 1, minDecimals, maxDecimals, nf) + exponentPrefix + this.defaultFormat(exponent, exponentPrecision, 0, 0, nf, true);
                        case "P":
                            if (isNaN(precision)) {
                                precision = nf.percentDecimalDigits;
                            }

                            return this.defaultFormat(number * 100, 1, precision, precision, nf, false, "percent");
                        case "X":
                            var result = isDecimal ? number.round().value.toString(16) : Math.round(number).toString(16);

                            if (match[1] === "X") {
                                result = result.toUpperCase();
                            }

                            precision -= result.length;

                            while (precision-- > 0) {
                                result = "0" + result;
                            }

                            return result;
                        case "C":
                            if (isNaN(precision)) {
                                precision = nf.currencyDecimalDigits;
                            }

                            return this.defaultFormat(number, 1, precision, precision, nf, false, "currency");
                        case "R":
                            return isDecimal ? (number.toString()) : ("" + number);
                    }
                }

                if (format.indexOf(",.") !== -1 || Bridge.String.endsWith(format, ",")) {
                    var count = 0,
                        index = format.indexOf(",.");

                    if (index === -1) {
                        index = format.length - 1;
                    }

                    while (index > -1 && format.charAt(index) === ",") {
                        count++;
                        index--;
                    }

                    if (isDecimal) {
                        number = number.div(Math.pow(1000, count));
                    } else {
                        number /= Math.pow(1000, count);
                    }
                }

                if (format.indexOf("%") !== -1) {
                    if (isDecimal) {
                        number = number.mul(100);
                    } else {
                        number *= 100;
                    }
                }

                groups = format.split(";");

                if ((isDecimal ? number.lt(0) : (number < 0)) && groups.length > 1) {
                    if (isDecimal) {
                        number = number.mul(-1);
                    } else {
                        number *= -1;
                    }
                    
                    format = groups[1];
                } else {
                    format = groups[(isDecimal ? number.ne(0) : !number) && groups.length > 2 ? 2 : 0];
                }

                return this.customFormat(number, format, nf, !format.match(/^[^\.]*[0#],[0#]/));
            },

            defaultFormat: function (number, minIntLen, minDecLen, maxDecLen, provider, noGroup, name) {
                name = name || "number";

                var nf = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.NumberFormatInfo),
                    str,
                    decimalIndex,
                    negPattern,
                    roundingFactor,
                    groupIndex,
                    groupSize,
                    groups = nf[name + "GroupSizes"],
                    decimalPart,
                    index,
                    done,
                    startIndex,
                    length,
                    part,
                    sep,
                    buffer = "",
                    isDecimal = number instanceof Bridge.Decimal,
                    isNeg = isDecimal ? number.isNegative() : number < 0;

                roundingFactor = Math.pow(10, maxDecLen);

                if (isDecimal) {
                    str = number.abs().mul(roundingFactor).round().div(roundingFactor).toString();
                } else {
                    str = "" + (Math.round(Math.abs(number) * roundingFactor) / roundingFactor);
                }

                decimalIndex = str.indexOf(".");

                if (decimalIndex > 0) {
                    decimalPart = nf[name + "DecimalSeparator"] + str.substr(decimalIndex + 1);
                    str = str.substr(0, decimalIndex);
                }

                if (str.length < minIntLen) {
                    str = Array(minIntLen - str.length + 1).join("0") + str;
                }

                if (decimalPart) {
                    if ((decimalPart.length - 1) < minDecLen) {
                        decimalPart += Array(minDecLen - decimalPart.length + 2).join("0");
                    }

                    if (maxDecLen === 0) {
                        decimalPart = null;
                    } else if ((decimalPart.length - 1) > maxDecLen) {
                        decimalPart = decimalPart.substr(0, maxDecLen + 1);
                    }
                }

                groupIndex = 0;
                groupSize = groups[groupIndex];

                if (str.length < groupSize) {
                    buffer = str;

                    if (decimalPart) {
                        buffer += decimalPart;
                    }
                } else {
                    index = str.length;
                    done = false;
                    sep = noGroup ? "" : nf[name + "GroupSeparator"];

                    while (!done) {
                        length = groupSize;
                        startIndex = index - length;

                        if (startIndex < 0) {
                            groupSize += startIndex;
                            length += startIndex;
                            startIndex = 0;
                            done = true;
                        }

                        if (!length) {
                            break;
                        }

                        part = str.substr(startIndex, length);

                        if (buffer.length) {
                            buffer = part + sep + buffer;
                        } else {
                            buffer = part;
                        }

                        index -= length;

                        if (groupIndex < groups.length - 1) {
                            groupIndex++;
                            groupSize = groups[groupIndex];
                        }
                    }

                    if (decimalPart) {
                        buffer += decimalPart;
                    }
                }

                if (isNeg) {
                    negPattern = Bridge.NumberFormatInfo[name + "NegativePatterns"][nf[name + "NegativePattern"]];

                    return negPattern.replace("-", nf.negativeSign).replace("%", nf.percentSymbol).replace("$", nf.currencySymbol).replace("n", buffer);
                } else if (Bridge.NumberFormatInfo[name + "PositivePatterns"]) {
                    negPattern = Bridge.NumberFormatInfo[name + "PositivePatterns"][nf[name + "PositivePattern"]];

                    return negPattern.replace("%", nf.percentSymbol).replace("$", nf.currencySymbol).replace("n", buffer);
                }

                return buffer;
            },

            customFormat: function (number, format, nf, noGroup) {
                var digits = 0,
                    forcedDigits = -1,
                    integralDigits = -1,
                    decimals = 0,
                    forcedDecimals = -1,
                    atDecimals = 0,
                    unused = 1,
                    c, i, f,
                    endIndex,
                    roundingFactor,
                    decimalIndex,
                    isNegative = false,
                    name,
                    groupCfg,
                    buffer = "",
                    isDecimal = number instanceof Bridge.Decimal,
                    isNeg = isDecimal ? number.isNegative() : number < 0;

                name = "number";

                if (format.indexOf("%") !== -1) {
                    name = "percent";
                } else if (format.indexOf("$") !== -1) {
                    name = "currency";
                }

                for (i = 0; i < format.length; i++) {
                    c = format.charAt(i);

                    if (c === "'" || c === '"') {
                        i = format.indexOf(c, i + 1);

                        if (i < 0) {
                            break;
                        }
                    } else if (c === "\\") {
                        i++;
                    } else {
                        if (c === "0" || c === "#") {
                            decimals += atDecimals;

                            if (c === "0") {
                                if (atDecimals) {
                                    forcedDecimals = decimals;
                                } else if (forcedDigits < 0) {
                                    forcedDigits = digits;
                                }
                            }

                            digits += !atDecimals;
                        }

                        atDecimals = atDecimals || c === ".";
                    }
                }
                forcedDigits = forcedDigits < 0 ? 1 : digits - forcedDigits;

                if (isNeg) {
                    isNegative = true;
                }

                roundingFactor = Math.pow(10, decimals);

                if (isDecimal) {
                    number = number.abs().mul(roundingFactor).round().div(roundingFactor).toString();
                } else {
                    number = "" + (Math.round(Math.abs(number) * roundingFactor) / roundingFactor);
                }

                decimalIndex = number.indexOf(".");
                integralDigits = decimalIndex < 0 ? number.length : decimalIndex;
                i = integralDigits - digits;

                groupCfg = {
                    groupIndex: Math.max(integralDigits, forcedDigits),
                    sep: noGroup ? "" : nf[name + "GroupSeparator"]
                };

                for (f = 0; f < format.length; f++) {
                    c = format.charAt(f);

                    if (c === "'" || c === '"') {
                        endIndex = format.indexOf(c, f + 1);

                        buffer += format.substring(f + 1, endIndex < 0 ? format.length : endIndex);

                        if (endIndex < 0) {
                            break;
                        }

                        f = endIndex;
                    } else if (c === "\\") {
                        buffer += format.charAt(f + 1);
                        f++;
                    } else if (c === "#" || c === "0") {
                        groupCfg.buffer = buffer;

                        if (i < integralDigits) {
                            if (i >= 0) {
                                if (unused) {
                                    this.addGroup(number.substr(0, i), groupCfg);
                                }

                                this.addGroup(number.charAt(i), groupCfg);
                            } else if (i >= integralDigits - forcedDigits) {
                                this.addGroup("0", groupCfg);
                            }
                            unused = 0;
                        } else if (forcedDecimals-- > 0 || i < number.length) {
                            this.addGroup(i >= number.length ? "0" : number.charAt(i), groupCfg);
                        }

                        buffer = groupCfg.buffer;

                        i++;
                    } else if (c === ".") {
                        if (number.length > ++i || forcedDecimals > 0) {
                            buffer += nf[name + "DecimalSeparator"];
                        }
                    } else if (c !== ",") {
                        buffer += c;
                    }
                }

                if (isNegative < 0) {
                    buffer = "-" + buffer;
                }

                return buffer;
            },

            addGroup: function (value, cfg) {
                var buffer = cfg.buffer,
                    sep = cfg.sep,
                    groupIndex = cfg.groupIndex;

                for (var i = 0, length = value.length; i < length; i++) {
                    buffer += value.charAt(i);

                    if (sep && groupIndex > 1 && groupIndex-- % 3 === 1) {
                        buffer += sep;
                    }
                }

                cfg.buffer = buffer;
                cfg.groupIndex = groupIndex;
            },

            parseFloat: function (str, provider) {
                if (str == null) {
                    throw new Bridge.ArgumentNullException("str");
                }

                var nfInfo = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.NumberFormatInfo),
                    result = parseFloat(str.replace(nfInfo.numberDecimalSeparator, "."));

                if (isNaN(result) && str !== nfInfo.nanSymbol) {
                    if (str === nfInfo.negativeInfinitySymbol) {
                        return Number.NEGATIVE_INFINITY;
                    }

                    if (str === nfInfo.positiveInfinitySymbol) {
                        return Number.POSITIVE_INFINITY;
                    }

                    throw new Bridge.FormatException("Input string was not in a correct format.");
                }

                return result;
            },

            tryParseFloat: function (str, provider, result) {
                result.v = 0;

                if (str == null) {
                    return false;
                }

                var nfInfo = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.NumberFormatInfo);

                result.v = parseFloat(str.replace(nfInfo.numberDecimalSeparator, "."));

                if (isNaN(result.v) && str !== nfInfo.nanSymbol) {
                    if (str === nfInfo.negativeInfinitySymbol) {
                        result.v = Number.NEGATIVE_INFINITY;
                        return true;
                    }

                    if (str === nfInfo.positiveInfinitySymbol) {
                        result.v = Number.POSITIVE_INFINITY;
                        return true;
                    }

                    return false;
                }

                return true;
            },

            parseInt: function (str, min, max, radix) {
                if (str == null) {
                    throw new Bridge.ArgumentNullException("str");
                }

                if (!/^[+-]?[0-9]+$/.test(str)) {
                    throw new Bridge.FormatException("Input string was not in a correct format.");
                }

                var result = parseInt(str, radix || 10);

                if (isNaN(result)) {
                    throw new Bridge.FormatException("Input string was not in a correct format.");
                }

                if (result < min || result > max) {
                    throw new Bridge.OverflowException();
                }

                return result;
            },

            tryParseInt: function (str, result, min, max, radix) {
                result.v = 0;

                if (!/^[+-]?[0-9]+$/.test(str)) {
                    return false;
                }

                result.v = parseInt(str, radix || 10);

                if (result.v < min || result.v > max) {
                    return false;
                }

                return true;
            },

            trunc: function (num) {
                if (!Bridge.isNumber(num)) {
                    return null;
                }

                return num > 0 ? Math.floor(num) : Math.ceil(num);
            },

            div: function (x, y) {
                if (!Bridge.isNumber(x) || !Bridge.isNumber(y)) {
                    return null;
                }

                if (y === 0) {
                    throw new Bridge.DivideByZeroException();
                }

                return this.trunc(x / y);
            },

            mod: function (x, y) {
                if (!Bridge.isNumber(x) || !Bridge.isNumber(y)) {
                    return null;
                }

                if (y === 0) {
                    throw new Bridge.DivideByZeroException();
                }
                return x % y;
            },

            check: function (x, type) {
                if (Bridge.isNumber(x) && !type.instanceOf(x)) {
                    throw new Bridge.OverflowException();
                }
                
                return x;
            },

            sxb: function (x) {
                return x | (x & 0x80 ? 0xffffff00 : 0);
            },

            sxs: function (x) {
                return x | (x & 0x8000 ? 0xffff0000 : 0);
            },

            clip8: function (x) {
                return Bridge.isNumber(x) ? Bridge.Int.sxb(x & 0xff) : null;
            },

            clipu8: function (x) {
                return Bridge.isNumber(x) ? x & 0xff : null;
            },

            clip16: function (x) {
                return Bridge.isNumber(x) ? Bridge.Int.sxs(x & 0xffff) : null;
            },

            clipu16: function (x) {
                return Bridge.isNumber(x) ? x & 0xffff : null;
            },

            clip32: function (x) {
                return Bridge.isNumber(x) ? x | 0 : null;
            },

            clipu32: function (x) {
                return Bridge.isNumber(x) ? x >>> 0 : null;
            },

            clip64: function (x) {
                return Bridge.isNumber(x) ? (Math.floor(x / 0x100000000) | 0) * 0x100000000 + (x >>> 0) : null;
            },

            clipu64: function (x) {
                return Bridge.isNumber(x) ? (Math.floor(x / 0x100000000) >>> 0) * 0x100000000 + (x >>> 0) : null;
            },

            sign: function (x) {
                return Bridge.isNumber(x) ? (x === 0 ? 0 : (x < 0 ? -1 : 1)) : null;
            }
        }
    });

    Bridge.Class.addExtend(Bridge.Int, [Bridge.IComparable$1(Bridge.Int), Bridge.IEquatable$1(Bridge.Int)]);

    // @source Decimal.js

    /* decimal.js v4.0.2 https://github.com/MikeMcl/decimal.js/LICENCE */

    !function (e) { "use strict"; function n(e) { for (var n, r, t = 1, i = e.length, o = e[0] + ""; i > t; t++) { for (n = e[t] + "", r = y - n.length; r--;) n = "0" + n; o += n } for (i = o.length; 48 === o.charCodeAt(--i) ;); return o.slice(0, i + 1 || 1) } function r(e, n, r, t) { var i, o, s, c, u; for (o = 1, s = e[0]; s >= 10; s /= 10, o++); return s = n - o, 0 > s ? (s += y, i = 0) : (i = Math.ceil((s + 1) / y), s %= y), o = E(10, y - s), u = e[i] % o | 0, null == t ? 3 > s ? (0 == s ? u = u / 100 | 0 : 1 == s && (u = u / 10 | 0), c = 4 > r && 99999 == u || r > 3 && 49999 == u || 5e4 == u || 0 == u) : c = (4 > r && u + 1 == o || r > 3 && u + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == E(10, s - 2) - 1 || (u == o / 2 || 0 == u) && 0 == (e[i + 1] / o / 100 | 0) : 4 > s ? (0 == s ? u = u / 1e3 | 0 : 1 == s ? u = u / 100 | 0 : 2 == s && (u = u / 10 | 0), c = (t || 4 > r) && 9999 == u || !t && r > 3 && 4999 == u) : c = ((t || 4 > r) && u + 1 == o || !t && r > 3 && u + 1 == o / 2) && (e[i + 1] / o / 1e3 | 0) == E(10, s - 3) - 1, c } function t(e, n, r) { var t = e.constructor; return null == n || ((m = 0 > n || n > 8) || 0 !== n && (t.errors ? parseInt : parseFloat)(n) != n) && !u(t, "rounding mode", n, r, 0) ? t.rounding : 0 | n } function i(e, n, r, t) { var i = e.constructor; return !(m = (t || 0) > n || n >= A + 1) && (0 === n || (i.errors ? parseInt : parseFloat)(n) == n) || u(i, "argument", n, r, 0) } function o(e, t) { var i, o, s, c, u, l, f, h = 0, g = 0, p = 0, m = e.constructor, d = m.ONE, v = m.rounding, N = m.precision; if (!e.c || !e.c[0] || e.e > 17) return new m(e.c ? e.c[0] ? e.s < 0 ? 0 : 1 / 0 : d : e.s ? e.s < 0 ? 0 : e : 0 / 0); for (null == t ? (w = !1, u = N) : u = t, f = new m(.03125) ; e.e > -2;) e = e.times(f), p += 5; for (o = Math.log(E(2, p)) / Math.LN10 * 2 + 5 | 0, u += o, i = c = l = new m(d), m.precision = u; ;) { if (c = a(c.times(e), u, 1), i = i.times(++g), f = l.plus(P(c, i, u, 1)), n(f.c).slice(0, u) === n(l.c).slice(0, u)) { for (s = p; s--;) l = a(l.times(l), u, 1); if (null != t) return m.precision = N, l; if (!(3 > h && r(l.c, u - o, v, h))) return a(l, m.precision = N, v, w = !0); m.precision = u += 10, i = c = f = new m(d), g = 0, h++ } l = f } } function s(e, r, t, i) { var o, s, c = e.constructor, u = (e = new c(e)).e; if (null == r ? t = 0 : (a(e, ++r, t), t = i ? r : r + e.e - u), u = e.e, o = n(e.c), 1 == i || 2 == i && (u >= r || u <= c.toExpNeg)) { for (; o.length < t; o += "0"); o.length > 1 && (o = o.charAt(0) + "." + o.slice(1)), o += (0 > u ? "e" : "e+") + u } else { if (i = o.length, 0 > u) { for (s = t - i; ++u; o = "0" + o); o = "0." + o } else if (++u > i) { for (s = t - u, u -= i; u--; o += "0"); s > 0 && (o += ".") } else s = t - i, i > u ? o = o.slice(0, u) + "." + o.slice(u) : s > 0 && (o += "."); if (s > 0) for (; s--; o += "0"); } return e.s < 0 && e.c[0] ? "-" + o : o } function c(e) { var n = e.length - 1, r = n * y + 1; if (n = e[n]) { for (; n % 10 == 0; n /= 10, r--); for (n = e[0]; n >= 10; n /= 10, r++); } return r } function u(e, n, r, t, i) { if (e.errors) { var o = new Error((t || ["new Decimal", "cmp", "div", "eq", "gt", "gte", "lt", "lte", "minus", "mod", "plus", "times", "toFraction", "pow", "random", "log", "sqrt", "toNearest", "divToInt"][v ? 0 > v ? -v : v : 0 > 1 / v ? 1 : 0]) + "() " + (["number type has more than 15 significant digits", "LN10 out of digits"][n] || n + ([m ? " out of range" : " not an integer", " not a boolean or binary digit"][i] || "")) + ": " + r); throw o.name = "Decimal Error", m = v = 0, o } } function l(e, n, r) { var t = new e(e.ONE); for (w = !1; 1 & r && (t = t.times(n)), r >>= 1, r;) n = n.times(n); return w = !0, t } function f(e, t) { var i, o, s, c, l, h, g, p, m, d, v, N = 1, E = 10, x = e, b = x.c, y = x.constructor, O = y.ONE, S = y.rounding, D = y.precision; if (x.s < 0 || !b || !b[0] || !x.e && 1 == b[0] && 1 == b.length) return new y(b && !b[0] ? -1 / 0 : 1 != x.s ? 0 / 0 : b ? 0 : x); if (null == t ? (w = !1, g = D) : g = t, y.precision = g += E, i = n(b), o = i.charAt(0), !(Math.abs(c = x.e) < 15e14)) return x = new y(o + "." + i.slice(1)), g + 2 > M.length && u(y, 1, g + 2, "ln"), x = f(x, g - E).plus(new y(M.slice(0, g + 2)).times(c + "")), y.precision = D, null == t ? a(x, D, S, w = !0) : x; for (; 7 > o && 1 != o || 1 == o && i.charAt(1) > 3;) x = x.times(e), i = n(x.c), o = i.charAt(0), N++; for (c = x.e, o > 1 ? (x = new y("0." + i), c++) : x = new y(o + "." + i.slice(1)), d = x, p = l = x = P(x.minus(O), x.plus(O), g, 1), v = a(x.times(x), g, 1), s = 3; ;) { if (l = a(l.times(v), g, 1), m = p.plus(P(l, new y(s), g, 1)), n(m.c).slice(0, g) === n(p.c).slice(0, g)) { if (p = p.times(2), 0 !== c && (g + 2 > M.length && u(y, 1, g + 2, "ln"), p = p.plus(new y(M.slice(0, g + 2)).times(c + ""))), p = P(p, new y(N), g, 1), null != t) return y.precision = D, p; if (!r(p.c, g - E, S, h)) return a(p, y.precision = D, S, w = !0); y.precision = g += E, m = l = x = P(d.minus(O), d.plus(O), g, 1), v = a(x.times(x), g, 1), s = h = 1 } p = m, s += 2 } } function a(e, n, r, t) { var i, o, s, c, u, l, f, a, h = e.constructor; e: if (null != n) { if (!(f = e.c)) return e; for (i = 1, c = f[0]; c >= 10; c /= 10, i++); if (o = n - i, 0 > o) o += y, s = n, u = f[a = 0], l = u / E(10, i - s - 1) % 10 | 0; else if (a = Math.ceil((o + 1) / y), a >= f.length) { if (!t) break e; for (; f.length <= a; f.push(0)); u = l = 0, i = 1, o %= y, s = o - y + 1 } else { for (u = c = f[a], i = 1; c >= 10; c /= 10, i++); o %= y, s = o - y + i, l = 0 > s ? 0 : N(u / E(10, i - s - 1) % 10) } if (t = t || 0 > n || null != f[a + 1] || (0 > s ? u : u % E(10, i - s - 1)), t = 4 > r ? (l || t) && (0 == r || r == (e.s < 0 ? 3 : 2)) : l > 5 || 5 == l && (4 == r || t || 6 == r && (o > 0 ? s > 0 ? u / E(10, i - s) : 0 : f[a - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7)), 1 > n || !f[0]) return f.length = 0, t ? (n -= e.e + 1, f[0] = E(10, n % y), e.e = -n || 0) : f[0] = e.e = 0, e; if (0 == o ? (f.length = a, c = 1, a--) : (f.length = a + 1, c = E(10, y - o), f[a] = s > 0 ? (u / E(10, i - s) % E(10, s) | 0) * c : 0), t) for (; ;) { if (0 == a) { for (o = 1, s = f[0]; s >= 10; s /= 10, o++); for (s = f[0] += c, c = 1; s >= 10; s /= 10, c++); o != c && (e.e++, f[0] == b && (f[0] = 1)); break } if (f[a] += c, f[a] != b) break; f[a--] = 0, c = 1 } for (o = f.length; 0 === f[--o]; f.pop()); } return w && (e.e > h.maxE ? e.c = e.e = null : e.e < h.minE && (e.c = [e.e = 0])), e } var h, g, p, m, d = e.crypto, w = !0, v = 0, N = Math.floor, E = Math.pow, x = Object.prototype.toString, b = 1e7, y = 7, O = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_", S = {}, D = 9e15, A = 1e9, F = 3e3, M = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058"; S.absoluteValue = S.abs = function () { var e = new this.constructor(this); return e.s < 0 && (e.s = 1), a(e) }, S.ceil = function () { return a(new this.constructor(this), this.e + 1, 2) }, S.comparedTo = S.cmp = function (e, n) { var r, t = this, i = t.c, o = (v = -v, e = new t.constructor(e, n), e.c), s = t.s, c = e.s, u = t.e, l = e.e; if (!s || !c) return null; if (r = i && !i[0], n = o && !o[0], r || n) return r ? n ? 0 : -c : s; if (s != c) return s; if (r = 0 > s, !i || !o) return u == l ? 0 : !i ^ r ? 1 : -1; if (u != l) return u > l ^ r ? 1 : -1; for (s = -1, c = (u = i.length) < (l = o.length) ? u : l; ++s < c;) if (i[s] != o[s]) return i[s] > o[s] ^ r ? 1 : -1; return u == l ? 0 : u > l ^ r ? 1 : -1 }, S.decimalPlaces = S.dp = function () { var e, n, r = null; if (e = this.c) { if (r = ((n = e.length - 1) - N(this.e / y)) * y, n = e[n]) for (; n % 10 == 0; n /= 10, r--); 0 > r && (r = 0) } return r }, S.dividedBy = S.div = function (e, n) { return v = 2, P(this, new this.constructor(e, n)) }, S.dividedToIntegerBy = S.divToInt = function (e, n) { var r = this, t = r.constructor; return v = 18, a(P(r, new t(e, n), 0, 1, 1), t.precision, t.rounding) }, S.equals = S.eq = function (e, n) { return v = 3, 0 === this.cmp(e, n) }, S.exponential = S.exp = function () { return o(this) }, S.floor = function () { return a(new this.constructor(this), this.e + 1, 3) }, S.greaterThan = S.gt = function (e, n) { return v = 4, this.cmp(e, n) > 0 }, S.greaterThanOrEqualTo = S.gte = function (e, n) { return v = 5, n = this.cmp(e, n), 1 == n || 0 === n }, S.isFinite = function () { return !!this.c }, S.isInteger = S.isInt = function () { return !!this.c && N(this.e / y) > this.c.length - 2 }, S.isNaN = function () { return !this.s }, S.isNegative = S.isNeg = function () { return this.s < 0 }, S.isZero = function () { return !!this.c && 0 == this.c[0] }, S.lessThan = S.lt = function (e, n) { return v = 6, this.cmp(e, n) < 0 }, S.lessThanOrEqualTo = S.lte = function (e, n) { return v = 7, n = this.cmp(e, n), -1 == n || 0 === n }, S.logarithm = S.log = function (e, t) { var i, o, s, c, l, h, g, p, m, d = this, N = d.constructor, E = N.precision, x = N.rounding, b = 5; if (null == e) e = new N(10), i = !0; else { if (v = 15, e = new N(e, t), o = e.c, e.s < 0 || !o || !o[0] || !e.e && 1 == o[0] && 1 == o.length) return new N(0 / 0); i = e.eq(10) } if (o = d.c, d.s < 0 || !o || !o[0] || !d.e && 1 == o[0] && 1 == o.length) return new N(o && !o[0] ? -1 / 0 : 1 != d.s ? 0 / 0 : o ? 0 : 1 / 0); if (l = i && (c = o[0], o.length > 1 || 1 != c && 10 != c && 100 != c && 1e3 != c && 1e4 != c && 1e5 != c && 1e6 != c), w = !1, g = E + b, p = g + 10, h = f(d, g), i ? (p > M.length && u(N, 1, p, "log"), s = new N(M.slice(0, p))) : s = f(e, g), m = P(h, s, g, 1), r(m.c, c = E, x)) do if (g += 10, h = f(d, g), i ? (p = g + 10, p > M.length && u(N, 1, p, "log"), s = new N(M.slice(0, p))) : s = f(e, g), m = P(h, s, g, 1), !l) { +n(m.c).slice(c + 1, c + 15) + 1 == 1e14 && (m = a(m, E + 1, 0)); break } while (r(m.c, c += 10, x)); return w = !0, a(m, E, x) }, S.minus = function (e, n) { var r, t, i, o, s = this, c = s.constructor, u = s.s; if (v = 8, e = new c(e, n), n = e.s, !u || !n) return new c(0 / 0); if (u != n) return e.s = -n, s.plus(e); var l = s.c, f = e.c, h = N(e.e / y), g = N(s.e / y), p = c.precision, m = c.rounding; if (!g || !h) { if (!l || !f) return l ? (e.s = -n, e) : new c(f ? s : 0 / 0); if (!l[0] || !f[0]) return s = f[0] ? (e.s = -n, e) : new c(l[0] ? s : 3 == m ? -0 : 0), w ? a(s, p, m) : s } if (l = l.slice(), t = l.length, u = g - h) { for ((o = 0 > u) ? (u = -u, r = l, t = f.length) : (h = g, r = f), (g = Math.ceil(p / y)) > t && (t = g), u > (t += 2) && (u = t, r.length = 1), r.reverse(), n = u; n--; r.push(0)); r.reverse() } else for ((o = t < (i = f.length)) && (i = t), u = n = 0; i > n; n++) if (l[n] != f[n]) { o = l[n] < f[n]; break } if (o && (r = l, l = f, f = r, e.s = -e.s), (n = -((i = l.length) - f.length)) > 0) for (; n--; l[i++] = 0); for (g = b - 1, n = f.length; n > u;) { if (l[--n] < f[n]) { for (t = n; t && !l[--t]; l[t] = g); --l[t], l[n] += b } l[n] -= f[n] } for (; 0 == l[--i]; l.pop()); for (; 0 == l[0]; l.shift(), --h); for (l[0] || (l = [h = 0], e.s = 3 == m ? -1 : 1), e.c = l, u = 1, n = l[0]; n >= 10; n /= 10, u++); return e.e = u + h * y - 1, w ? a(e, p, m) : e }, S.modulo = S.mod = function (e, n) { var r, t, i = this, o = i.constructor, s = o.modulo; return v = 9, e = new o(e, n), n = e.s, r = !i.c || !n || e.c && !e.c[0], r || !e.c || i.c && !i.c[0] ? r ? new o(0 / 0) : a(new o(i), o.precision, o.rounding) : (w = !1, 9 == s ? (e.s = 1, t = P(i, e, 0, 3, 1), e.s = n, t.s *= n) : t = P(i, e, 0, s, 1), t = t.times(e), w = !0, i.minus(t)) }, S.naturalLogarithm = S.ln = function () { return f(this) }, S.negated = S.neg = function () { var e = new this.constructor(this); return e.s = -e.s || null, a(e) }, S.plus = function (e, n) { var r, t = this, i = t.constructor, o = t.s; if (v = 10, e = new i(e, n), n = e.s, !o || !n) return new i(0 / 0); if (o != n) return e.s = -n, t.minus(e); var s = t.c, c = e.c, u = N(e.e / y), l = N(t.e / y), f = i.precision, h = i.rounding; if (!l || !u) { if (!s || !c) return new i(o / 0); if (!s[0] || !c[0]) return t = c[0] ? e : new i(s[0] ? t : 0 * o), w ? a(t, f, h) : t } if (s = s.slice(), o = l - u) { for (0 > o ? (o = -o, r = s, n = c.length) : (u = l, r = c, n = s.length), (l = Math.ceil(f / y)) > n && (n = l), o > ++n && (o = n, r.length = 1), r.reverse() ; o--; r.push(0)); r.reverse() } for (s.length - c.length < 0 && (r = c, c = s, s = r), o = c.length, n = 0, l = b; o; s[o] %= l) n = (s[--o] = s[o] + c[o] + n) / l | 0; for (n && (s.unshift(n), ++u), o = s.length; 0 == s[--o]; s.pop()); for (e.c = s, o = 1, n = s[0]; n >= 10; n /= 10, o++); return e.e = o + u * y - 1, w ? a(e, f, h) : e }, S.precision = S.sd = function (e) { var n = null, r = this; return e != n && e !== !!e && 1 !== e && 0 !== e && u(r.constructor, "argument", e, "precision", 1), r.c && (n = c(r.c), e && r.e + 1 > n && (n = r.e + 1)), n }, S.round = function () { var e = this, n = e.constructor; return a(new n(e), e.e + 1, n.rounding) }, S.squareRoot = S.sqrt = function () { var e, r, t, i, o, s, c = this, u = c.c, l = c.s, f = c.e, h = c.constructor, g = new h(.5); if (1 !== l || !u || !u[0]) return new h(!l || 0 > l && (!u || u[0]) ? 0 / 0 : u ? c : 1 / 0); for (w = !1, l = Math.sqrt(+c), 0 == l || l == 1 / 0 ? (r = n(u), (r.length + f) % 2 == 0 && (r += "0"), l = Math.sqrt(r), f = N((f + 1) / 2) - (0 > f || f % 2), l == 1 / 0 ? r = "1e" + f : (r = l.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + f), i = new h(r)) : i = new h(l.toString()), t = (f = h.precision) + 3; ;) if (s = i, i = g.times(s.plus(P(c, s, t + 2, 1))), n(s.c).slice(0, t) === (r = n(i.c)).slice(0, t)) { if (r = r.slice(t - 3, t + 1), "9999" != r && (o || "4999" != r)) { (!+r || !+r.slice(1) && "5" == r.charAt(0)) && (a(i, f + 1, 1), e = !i.times(i).eq(c)); break } if (!o && (a(s, f + 1, 0), s.times(s).eq(c))) { i = s; break } t += 4, o = 1 } return w = !0, a(i, f, h.rounding, e) }, S.times = function (e, n) { var r, t, i = this, o = i.constructor, s = i.c, c = (v = 11, e = new o(e, n), e.c), u = N(i.e / y), l = N(e.e / y), f = i.s; if (n = e.s, e.s = f == n ? 1 : -1, !((u || s && s[0]) && (l || c && c[0]))) return new o(!f || !n || s && !s[0] && !c || c && !c[0] && !s ? 0 / 0 : s && c ? 0 * e.s : e.s / 0); for (t = u + l, f = s.length, n = c.length, n > f && (r = s, s = c, c = r, l = f, f = n, n = l), l = f + n, r = []; l--; r.push(0)); for (u = n - 1; u > -1; u--) { for (n = 0, l = f + u; l > u;) n = r[l] + c[u] * s[l - u - 1] + n, r[l--] = n % b | 0, n = n / b | 0; r[l] = (r[l] + n) % b | 0 } for (n ? ++t : r[0] || r.shift(), l = r.length; !r[--l]; r.pop()); for (e.c = r, f = 1, n = r[0]; n >= 10; n /= 10, f++); return e.e = f + t * y - 1, w ? a(e, o.precision, o.rounding) : e }, S.toDecimalPlaces = S.toDP = function (e, n) { var r = this; return r = new r.constructor(r), null != e && i(r, e, "toDP") ? a(r, (0 | e) + r.e + 1, t(r, n, "toDP")) : r }, S.toExponential = function (e, n) { var r = this; return r.c ? s(r, null != e && i(r, e, "toExponential") ? 0 | e : null, null != e && t(r, n, "toExponential"), 1) : r.toString() }, S.toFixed = function (e, n) { var r, o = this, c = o.constructor, u = c.toExpNeg, l = c.toExpPos; return null != e && (e = i(o, e, r = "toFixed") ? o.e + (0 | e) : null, n = t(o, n, r)), c.toExpNeg = -(c.toExpPos = 1 / 0), null != e && o.c ? (r = s(o, e, n), o.s < 0 && o.c && (o.c[0] ? r.indexOf("-") < 0 && (r = "-" + r) : r = r.replace("-", ""))) : r = o.toString(), c.toExpNeg = u, c.toExpPos = l, r }, S.toFormat = function (e, n) { var r = this; if (!r.c) return r.toString(); var t, i = r.s < 0, o = r.constructor.format, s = o.groupSeparator, c = +o.groupSize, u = +o.secondaryGroupSize, l = r.toFixed(e, n).split("."), f = l[0], a = l[1], h = i ? f.slice(1) : f, g = h.length; if (u && (t = c, c = u, g -= u = t), c > 0 && g > 0) { for (t = g % c || c, f = h.substr(0, t) ; g > t; t += c) f += s + h.substr(t, c); u > 0 && (f += s + h.slice(t)), i && (f = "-" + f) } return a ? f + o.decimalSeparator + ((u = +o.fractionGroupSize) ? a.replace(new RegExp("\\d{" + u + "}\\B", "g"), "$&" + o.fractionGroupSeparator) : a) : f }, S.toFraction = function (e) { var r, t, i, o, s, l, f, a, h = this, g = h.constructor, p = r = new g(g.ONE), d = l = new g(0), x = h.c, b = new g(d); if (!x) return h.toString(); for (i = b.e = c(x) - h.e - 1, b.c[0] = E(10, (f = i % y) < 0 ? y + f : f), (null == e || (!(v = 12, s = new g(e)).s || (m = s.cmp(p) < 0 || !s.c) || g.errors && N(s.e / y) < s.c.length - 1) && !u(g, "max denominator", e, "toFraction", 0) || (e = s).cmp(b) > 0) && (e = i > 0 ? b : p), w = !1, s = new g(n(x)), f = g.precision, g.precision = i = x.length * y * 2; a = P(s, b, 0, 1, 1), t = r.plus(a.times(d)), 1 != t.cmp(e) ;) r = d, d = t, p = l.plus(a.times(t = p)), l = t, b = s.minus(a.times(t = b)), s = t; return t = P(e.minus(r), d, 0, 1, 1), l = l.plus(t.times(p)), r = r.plus(t.times(d)), l.s = p.s = h.s, o = P(p, d, i, 1).minus(h).abs().cmp(P(l, r, i, 1).minus(h).abs()) < 1 ? [p + "", d + ""] : [l + "", r + ""], w = !0, g.precision = f, o }, S.toNearest = function (e, n) { var r = this, i = r.constructor; return r = new i(r), null == e ? (e = new i(i.ONE), n = i.rounding) : (v = 17, e = new i(e), n = t(r, n, "toNearest")), e.c ? r.c && (e.c[0] ? (w = !1, r = P(r, e, 0, 4 > n ? [4, 5, 7, 8][n] : n, 1).times(e), w = !0, a(r)) : r.c = [r.e = 0]) : r.s && (e.s && (e.s = r.s), r = e), r }, S.toNumber = function () { var e = this; return +e || (e.s ? 0 * e.s : 0 / 0) }, S.toPower = S.pow = function (e, t) { var i, s, c, u, h = this, g = h.constructor, p = h.s, m = (v = 13, +(e = new g(e, t))), d = 0 > m ? -m : m, x = g.precision, b = g.rounding; if (!h.c || !e.c || (c = !h.c[0]) || !e.c[0]) return new g(E(c ? 0 * p : +h, m)); if (h = new g(h), i = h.c.length, !h.e && h.c[0] == h.s && 1 == i) return h; if (t = e.c.length - 1, e.e || e.c[0] != e.s || t) if (s = N(e.e / y), c = s >= t, !c && 0 > p) u = new g(0 / 0); else { if (c && F > i * y * d) { if (u = l(g, h, d), e.s < 0) return g.ONE.div(u) } else { if (p = 0 > p && 1 & e.c[Math.max(s, t)] ? -1 : 1, t = E(+h, m), s = 0 != t && isFinite(t) ? new g(t + "").e : N(m * (Math.log("0." + n(h.c)) / Math.LN10 + h.e + 1)), s > g.maxE + 1 || s < g.minE - 1) return new g(s > 0 ? p / 0 : 0); w = !1, g.rounding = h.s = 1, d = Math.min(12, (s + "").length), u = o(e.times(f(h, x + d)), x), u = a(u, x + 5, 1), r(u.c, x, b) && (s = x + 10, u = a(o(e.times(f(h, s + d)), s), s + 5, 1), +n(u.c).slice(x + 1, x + 15) + 1 == 1e14 && (u = a(u, x + 1, 0))), u.s = p, w = !0, g.rounding = b } u = a(u, x, b) } else u = a(h, x, b); return u }, S.toPrecision = function (e, n) { var r = this; return null != e && i(r, e, "toPrecision", 1) && r.c ? s(r, 0 | --e, t(r, n, "toPrecision"), 2) : r.toString() }, S.toSignificantDigits = S.toSD = function (e, n) { var r = this, o = r.constructor; return r = new o(r), null != e && i(r, e, "toSD", 1) ? a(r, 0 | e, t(r, n, "toSD")) : a(r, o.precision, o.rounding) }, S.toString = function (e) { var r, t, i, o = this, c = o.constructor, l = o.e; if (null === l) t = o.s ? "Infinity" : "NaN"; else { if (e === r && (l <= c.toExpNeg || l >= c.toExpPos)) return s(o, null, c.rounding, 1); if (t = n(o.c), 0 > l) { for (; ++l; t = "0" + t); t = "0." + t } else if (i = t.length, l > 0) if (++l > i) for (l -= i; l--; t += "0"); else i > l && (t = t.slice(0, l) + "." + t.slice(l)); else if (r = t.charAt(0), i > 1) t = r + "." + t.slice(1); else if ("0" == r) return r; if (null != e) if ((m = !(e >= 2 && 65 > e)) || e != (0 | e) && c.errors) u(c, "base", e, "toString", 0); else if (t = h(c, t, 0 | e, 10, o.s), "0" == t) return t } return o.s < 0 ? "-" + t : t }, S.truncated = S.trunc = function () { return a(new this.constructor(this), this.e + 1, 1) }, S.valueOf = S.toJSON = function () { return this.toString() }, h = function () { function e(e, n, r) { for (var t, i, o = [0], s = 0, c = e.length; c > s;) { for (i = o.length; i--; o[i] *= n); for (o[t = 0] += O.indexOf(e.charAt(s++)) ; t < o.length; t++) o[t] > r - 1 && (null == o[t + 1] && (o[t + 1] = 0), o[t + 1] += o[t] / r | 0, o[t] %= r) } return o.reverse() } return function (n, r, t, i, o) { var s, c, u, f, a, h, g = r.indexOf("."), p = n.precision, m = n.rounding; for (37 > i && (r = r.toLowerCase()), g >= 0 && (r = r.replace(".", ""), h = new n(i), f = l(n, h, r.length - g), h.c = e(f.toFixed(), 10, t), h.e = h.c.length), a = e(r, i, t), s = c = a.length; 0 == a[--c]; a.pop()); if (!a[0]) return "0"; if (0 > g ? s-- : (f.c = a, f.e = s, f.s = o, f = P(f, h, p, m, 0, t), a = f.c, u = f.r, s = f.e), g = a[p], c = t / 2, u = u || null != a[p + 1], 4 > m ? (null != g || u) && (0 == m || m == (f.s < 0 ? 3 : 2)) : g > c || g == c && (4 == m || u || 6 == m && 1 & a[p - 1] || m == (f.s < 0 ? 8 : 7))) for (a.length = p, --t; ++a[--p] > t;) a[p] = 0, p || (++s, a.unshift(1)); else a.length = p; for (c = a.length; !a[--c];); for (g = 0, r = ""; c >= g; r += O.charAt(a[g++])); if (0 > s) { for (; ++s; r = "0" + r); r = "0." + r } else if (g = r.length, ++s > g) for (s -= g; s--; r += "0"); else g > s && (r = r.slice(0, s) + "." + r.slice(s)); return r } }(); var P = function () { function e(e, n, r) { var t, i = 0, o = e.length; for (e = e.slice() ; o--;) t = e[o] * n + i, e[o] = t % r | 0, i = t / r | 0; return i && e.unshift(i), e } function n(e, n, r, t) { var i, o; if (r != t) o = r > t ? 1 : -1; else for (i = o = 0; r > i; i++) if (e[i] != n[i]) { o = e[i] > n[i] ? 1 : -1; break } return o } function r(e, n, r, t) { for (var i = 0; r--;) e[r] -= i, i = e[r] < n[r] ? 1 : 0, e[r] = i * t + e[r] - n[r]; for (; !e[0] && e.length > 1; e.shift()); } return function (t, i, o, s, c, u) { var l, f, h, g, p, m, d, w, v, E, x, O, S, D, A, F, M, P, R, q = t.constructor, L = t.s == i.s ? 1 : -1, I = t.c, U = i.c; if (!(I && I[0] && U && U[0])) return new q(t.s && i.s && (I ? !U || I[0] != U[0] : U) ? I && 0 == I[0] || !U ? 0 * L : L / 0 : 0 / 0); for (u ? (g = 1, f = t.e - i.e) : (u = b, g = y, f = N(t.e / g) - N(i.e / g)), P = U.length, F = I.length, v = new q(L), E = v.c = [], h = 0; U[h] == (I[h] || 0) ; h++); if (U[h] > (I[h] || 0) && f--, null == o ? (L = o = q.precision, s = q.rounding) : L = c ? o + (t.e - i.e) + 1 : o, 0 > L) E.push(1), p = !0; else { if (L = L / g + 2 | 0, h = 0, 1 == P) { for (m = 0, U = U[0], L++; (F > h || m) && L--; h++) D = m * u + (I[h] || 0), E[h] = D / U | 0, m = D % U | 0; p = m || F > h } else { for (m = u / (U[0] + 1) | 0, m > 1 && (U = e(U, m, u), I = e(I, m, u), P = U.length, F = I.length), A = P, x = I.slice(0, P), O = x.length; P > O; x[O++] = 0); R = U.slice(), R.unshift(0), M = U[0], U[1] >= u / 2 && M++; do m = 0, l = n(U, x, P, O), 0 > l ? (S = x[0], P != O && (S = S * u + (x[1] || 0)), m = S / M | 0, m > 1 ? (m >= u && (m = u - 1), d = e(U, m, u), w = d.length, O = x.length, l = n(d, x, w, O), 1 == l && (m--, r(d, w > P ? R : U, w, u))) : (0 == m && (l = m = 1), d = U.slice()), w = d.length, O > w && d.unshift(0), r(x, d, O, u), -1 == l && (O = x.length, l = n(U, x, P, O), 1 > l && (m++, r(x, O > P ? R : U, O, u))), O = x.length) : 0 === l && (m++, x = [0]), E[h++] = m, l && x[0] ? x[O++] = I[A] || 0 : (x = [I[A]], O = 1); while ((A++ < F || null != x[0]) && L--); p = null != x[0] } E[0] || E.shift() } if (1 == g) v.e = f, v.r = +p; else { for (h = 1, L = E[0]; L >= 10; L /= 10, h++); v.e = h + f * g - 1, a(v, c ? o + v.e + 1 : o, s, p) } return v } }(); if (g = function () { function e(e) { var n, r, t, i = this, o = "config", s = i.errors ? parseInt : parseFloat; return e == r || "object" != typeof e && !u(i, "object expected", e, o) ? i : ((t = e[n = "precision"]) != r && ((m = 1 > t || t > A) || s(t) != t ? u(i, n, t, o, 0) : i[n] = 0 | t), (t = e[n = "rounding"]) != r && ((m = 0 > t || t > 8) || s(t) != t ? u(i, n, t, o, 0) : i[n] = 0 | t), (t = e[n = "toExpNeg"]) != r && ((m = -D > t || t > 0) || s(t) != t ? u(i, n, t, o, 0) : i[n] = N(t)), (t = e[n = "toExpPos"]) != r && ((m = 0 > t || t > D) || s(t) != t ? u(i, n, t, o, 0) : i[n] = N(t)), (t = e[n = "minE"]) != r && ((m = -D > t || t > 0) || s(t) != t ? u(i, n, t, o, 0) : i[n] = N(t)), (t = e[n = "maxE"]) != r && ((m = 0 > t || t > D) || s(t) != t ? u(i, n, t, o, 0) : i[n] = N(t)), (t = e[n = "errors"]) != r && (t === !!t || 1 === t || 0 === t ? (m = v = 0, i[n] = !!t) : u(i, n, t, o, 1)), (t = e[n = "crypto"]) != r && (t === !!t || 1 === t || 0 === t ? i[n] = !(!t || !d || "object" != typeof d) : u(i, n, t, o, 1)), (t = e[n = "modulo"]) != r && ((m = 0 > t || t > 9) || s(t) != t ? u(i, n, t, o, 0) : i[n] = 0 | t), (e = e[n = "format"]) != r && ("object" == typeof e ? i[n] = e : u(i, "format object expected", e, o)), i) } function n(e) { return new this(e).exp() } function r(e) { return new this(e).ln() } function t(e, n) { return new this(e).log(n) } function o(e, n, r) { var t, i, o = 0; for ("[object Array]" == x.call(n[0]) && (n = n[0]), t = new e(n[0]) ; ++o < n.length;) { if (i = new e(n[o]), !i.s) { t = i; break } t[r](i) && (t = i) } return t } function s() { return o(this, arguments, "lt") } function c() { return o(this, arguments, "gt") } function l(e, n) { return new this(e).pow(n) } function f(e) { var n, r, t, o = 0, s = [], c = this, l = new c(c.ONE); if (null != e && i(l, e, "random") ? e |= 0 : e = c.precision, r = Math.ceil(e / y), c.crypto) if (d && d.getRandomValues) for (n = d.getRandomValues(new Uint32Array(r)) ; r > o;) t = n[o], t >= 429e7 ? n[o] = d.getRandomValues(new Uint32Array(1))[0] : s[o++] = t % 1e7; else if (d && d.randomBytes) { for (n = d.randomBytes(r *= 4) ; r > o;) t = n[o] + (n[o + 1] << 8) + (n[o + 2] << 16) + ((127 & n[o + 3]) << 24), t >= 214e7 ? d.randomBytes(4).copy(n, o) : (s.push(t % 1e7), o += 4); o = r / 4 } else u(c, "crypto unavailable", d, "random"); if (!o) for (; r > o;) s[o++] = 1e7 * Math.random() | 0; for (r = s[--o], e %= y, r && e && (t = E(10, y - e), s[o] = (r / t | 0) * t) ; 0 === s[o]; o--) s.pop(); if (0 > o) s = [r = 0]; else { for (r = -1; 0 === s[0];) s.shift(), r -= y; for (o = 1, t = s[0]; t >= 10;) t /= 10, o++; y > o && (r -= y - o) } return l.e = r, l.c = s, l } function g(e) { return new this(e).sqrt() } function p(i) { function o(e, n) { var r = this; if (!(r instanceof o)) return u(o, "Decimal called without new", e), new o(e, n); if (r.constructor = o, e instanceof o) { if (null == n) return v = 0, r.s = e.s, r.e = e.e, r.c = (e = e.c) ? e.slice() : e, r; if (10 == n) return a(new o(e), o.precision, o.rounding); e += "" } return b(o, r, e, n) } return o.precision = 20, o.rounding = 4, o.modulo = 1, o.toExpNeg = -7, o.toExpPos = 21, o.minE = -D, o.maxE = D, o.errors = !0, o.crypto = !1, o.format = { decimalSeparator: ".", groupSeparator: ",", groupSize: 3, secondaryGroupSize: 0, fractionGroupSeparator: " ", fractionGroupSize: 0 }, o.prototype = S, o.ONE = new o(1), o.ROUND_UP = 0, o.ROUND_DOWN = 1, o.ROUND_CEIL = 2, o.ROUND_FLOOR = 3, o.ROUND_HALF_UP = 4, o.ROUND_HALF_DOWN = 5, o.ROUND_HALF_EVEN = 6, o.ROUND_HALF_CEIL = 7, o.ROUND_HALF_FLOOR = 8, o.EUCLID = 9, o.config = e, o.constructor = p, o.exp = n, o.ln = r, o.log = t, o.max = s, o.min = c, o.pow = l, o.sqrt = g, o.random = f, null != i && o.config(i), o } var b = function () { var e = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, n = String.prototype.trim || function () { return this.replace(/^\s+|\s+$/g, "") }; return function (r, t, i, o) { var s, c, l, f, g, p; if ("string" != typeof i && (i = (f = "number" == typeof i || "[object Number]" == x.call(i)) && 0 === i && 0 > 1 / i ? "-0" : i + ""), g = i, null == o && e.test(i)) t.s = 45 === i.charCodeAt(0) ? (i = i.slice(1), -1) : 1; else { if (10 == o) return a(new r(i), r.precision, r.rounding); if (i = n.call(i).replace(/^\+(?!-)/, ""), t.s = 45 === i.charCodeAt(0) ? (i = i.replace(/^-(?!-)/, ""), -1) : 1, null != o ? o != (0 | o) && r.errors || (m = !(o >= 2 && 65 > o)) ? (u(r, "base", o, 0, 0), p = e.test(i)) : (s = "[" + O.slice(0, o = 0 | o) + "]+", i = i.replace(/\.$/, "").replace(/^\./, "0."), (p = new RegExp("^" + s + "(?:\\." + s + ")?$", 37 > o ? "i" : "").test(i)) ? (f && (i.replace(/^0\.0*|\./, "").length > 15 && u(r, 0, g), f = !f), i = h(r, i, 10, o, t.s)) : "Infinity" != i && "NaN" != i && (u(r, "not a base " + o + " number", g), i = "NaN")) : p = e.test(i), !p) return t.c = t.e = null, "Infinity" != i && ("NaN" != i && u(r, "not a number", g), t.s = null), v = 0, t } for ((c = i.indexOf(".")) > -1 && (i = i.replace(".", "")), (l = i.search(/e/i)) > 0 ? (0 > c && (c = l), c += +i.slice(l + 1), i = i.substring(0, l)) : 0 > c && (c = i.length), l = 0; 48 === i.charCodeAt(l) ; l++); for (o = i.length; 48 === i.charCodeAt(--o) ;); if (i = i.slice(l, o + 1)) { if (o = i.length, f && o > 15 && u(r, 0, g), t.e = c = c - l - 1, t.c = [], l = (c + 1) % y, 0 > c && (l += y), o > l) { for (l && t.c.push(+i.slice(0, l)), o -= y; o > l;) t.c.push(+i.slice(l, l += y)); i = i.slice(l), l = y - i.length } else l -= o; for (; l--; i += "0"); t.c.push(+i), w && (t.e > r.maxE ? t.c = t.e = null : t.e < r.minE && (t.c = [t.e = 0])) } else t.c = [t.e = 0]; return v = 0, t } }(); return p() }(), Bridge.$Decimal = g, "function" == typeof define && define.amd) define(function () { return g }); else if ("undefined" != typeof module && module.exports) { if (module.exports = g, !d) try { d = require("crypto") } catch (R) { } } else p = e.Decimal, g.noConflict = function () { return e.Decimal = p, g } }(Bridge.global);

    Bridge.Decimal = function (v, provider) {
        if (this.constructor !== Bridge.Decimal) {
            return new Bridge.Decimal(v);
        }

        if (typeof v === "string") {
            provider = provider || Bridge.CultureInfo.getCurrentCulture();

            var nfInfo = provider && provider.getFormat(Bridge.NumberFormatInfo);

            if (nfInfo && nfInfo.numberDecimalSeparator !== ".") {
                v = v.replace(nfInfo.numberDecimalSeparator, ".");
            }

            if (!/^\s*[+-]?(\d+|\d*\.\d+)((e|E)[+-]?\d+)?\s*$/.test(v)) {
                throw new Bridge.FormatException();
            }

            v = v.replace(/\s/g, "");
        }

        this.value = Bridge.Decimal.getValue(v);
    }

    Bridge.Decimal.$$name = "Bridge.Decimal";
    Bridge.Decimal.prototype.$$name = "Bridge.Decimal";

    Bridge.Decimal.$$inherits = [];
    Bridge.Class.addExtend(Bridge.Decimal, [Bridge.IComparable, Bridge.IFormattable, Bridge.IComparable$1(Bridge.Decimal), Bridge.IEquatable$1(Bridge.Decimal)]);
    

    Bridge.Decimal.getDefaultValue = function () {
        return new Bridge.Decimal(0);
    };

    Bridge.Decimal.getValue = function (d) {
        if (!Bridge.hasValue(d)) {
            return null;
        }

        if (d instanceof Bridge.Decimal) {
            return d.value;
        }

        return new Bridge.$Decimal(d);
    };

    Bridge.Decimal.create = function (d) {
        if (!Bridge.hasValue(d)) {
            return null;
        }

        if (d instanceof Bridge.Decimal) {
            return d;
        }

        return new Bridge.Decimal(d);
    };

    Bridge.Decimal.lift = function (d) {
        return d == null ? null : Bridge.Decimal.create(d);
    }; 

    Bridge.Decimal.prototype.toString = function (format, provider) {
        if (!format && !provider) {
            return this.value.toString();
        }

        return Bridge.Int.format(this, format, provider);
    };

    Bridge.Decimal.prototype.toFloat = function () {
        return this.value.toNumber();
    };

    Bridge.Decimal.prototype.format = function (format, provider) {
        return Bridge.Int.format(this.toFloat(), format, provider);
    };

    Bridge.Decimal.prototype.decimalPlaces = function () {
        return this.value.decimalPlaces();
    };

    Bridge.Decimal.prototype.dividedToIntegerBy = function (d) {
        return new Bridge.Decimal(this.value.dividedToIntegerBy(Bridge.Decimal.getValue(d)));
    };

    Bridge.Decimal.prototype.exponential = function () {
        return new Bridge.Decimal(this.value.exponential());
    };

    Bridge.Decimal.prototype.abs = function () {
        return new Bridge.Decimal(this.value.abs());
    };

    Bridge.Decimal.prototype.floor = function () {
        return new Bridge.Decimal(this.value.floor());
    };

    Bridge.Decimal.prototype.ceil = function () {
        return new Bridge.Decimal(this.value.ceil());
    };

    Bridge.Decimal.prototype.trunc = function () {
        return new Bridge.Decimal(this.value.trunc());
    };

    Bridge.Decimal.round = function (obj, mode) {
        obj = Bridge.Decimal.create(obj);

        var old = Bridge.$Decimal.rounding;

        Bridge.$Decimal.rounding = mode;

        var d = new Bridge.Decimal(obj.value.round());

        Bridge.$Decimal.rounding = old;

        return d;
    };

    Bridge.Decimal.toDecimalPlaces = function(obj, decimals, mode) {
        obj = Bridge.Decimal.create(obj);
        var d = new Bridge.Decimal(obj.value.toDecimalPlaces(decimals, mode));
        return d;
    };

    Bridge.Decimal.prototype.compareTo = function (another) {
        return this.value.comparedTo(Bridge.Decimal.getValue(another));
    };

    Bridge.Decimal.prototype.add = function (another) {
        return new Bridge.Decimal(this.value.plus(Bridge.Decimal.getValue(another)));
    };

    Bridge.Decimal.prototype.sub = function (another) {
        return new Bridge.Decimal(this.value.minus(Bridge.Decimal.getValue(another)));
    };

    Bridge.Decimal.prototype.isZero = function () {
        return this.value.isZero;
    };

    Bridge.Decimal.prototype.mul = function (another) {
        return new Bridge.Decimal(this.value.times(Bridge.Decimal.getValue(another)));
    };

    Bridge.Decimal.prototype.div = function (another) {
        return new Bridge.Decimal(this.value.dividedBy(Bridge.Decimal.getValue(another)));
    };

    Bridge.Decimal.prototype.mod = function (another) {
        return new Bridge.Decimal(this.value.modulo(Bridge.Decimal.getValue(another)));
    };

    Bridge.Decimal.prototype.neg = function () {
        return new Bridge.Decimal(this.value.negated());
    };

    Bridge.Decimal.prototype.inc = function () {
        return new Bridge.Decimal(this.value.plus(Bridge.Decimal.getValue(1)));
    };

    Bridge.Decimal.prototype.dec = function () {
        return new Bridge.Decimal(this.value.minus(Bridge.Decimal.getValue(1)));
    };

    Bridge.Decimal.prototype.sign = function () {
        return this.value.isZero() ? 0 : (this.value.isNegative() ? -1 : 1);
    };

    Bridge.Decimal.prototype.clone = function () {
        return new Bridge.Decimal(this);
    };

    Bridge.Decimal.prototype.ne = function (v) {
        return !!this.compareTo(v);
    };

    Bridge.Decimal.prototype.lt = function (v) {
        return this.compareTo(v) < 0;
    };

    Bridge.Decimal.prototype.lte = function (v) {
        return this.compareTo(v) <= 0;
    };

    Bridge.Decimal.prototype.gt = function (v) {
        return this.compareTo(v) > 0;
    };

    Bridge.Decimal.prototype.gte = function (v) {
        return this.compareTo(v) >= 0;
    };

    Bridge.Decimal.prototype.equals = function (v) {
        return !this.compareTo(v);
    };

    Bridge.Decimal.prototype.equalsT = function (v) {
        return !this.compareTo(v);
    };

    Bridge.Decimal.prototype.getHashCode = function () {
        var n = (this.sign() * 397 + this.value.e) | 0;

        for (var i = 0; i < this.value.c.length; i++) {
            n = (n * 397 + this.value.c[i]) | 0;
        }

        return n;
    };

    Bridge.Decimal.toInt = function (v) {
        if (!v) {
            return null;
        }

        var i = Bridge.Int.trunc(Bridge.Decimal.getValue(v).toNumber());

        if (!Bridge.Int.instanceOf(i)) {
            throw new Bridge.OverflowException();
        }

        return i;
    };

    Bridge.Decimal.tryParse = function (s, provider, v) {
        try {
            v.v = new Bridge.Decimal(s, provider);

            return true;
        } catch (e) {
            v.v = new Bridge.Decimal(0);

            return false;
        }
    };

    Bridge.Decimal.toFloat = function (v) {
        if (!v) {
            return null;
        }

        return Bridge.Decimal.getValue(v).toNumber();
    };

    Bridge.Decimal.setConfig = function (config) {
        Bridge.$Decimal.config(config);
    };

    Bridge.Decimal.min = function () {
        var values = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            values.push(Bridge.Decimal.getValue(arguments[i]));
        }

        return new Bridge.Decimal(Bridge.$Decimal.min.apply(Bridge.$Decimal, values));
    };

    Bridge.Decimal.max = function () {
        var values = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            values.push(Bridge.Decimal.getValue(arguments[i]));
        }

        return new Bridge.Decimal(Bridge.$Decimal.max.apply(Bridge.$Decimal, values));
    };

    Bridge.Decimal.random = function (dp) {
        return new Bridge.Decimal(Bridge.$Decimal.random(dp));
    };

    Bridge.Decimal.exp = function (d) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).exp());
    };

    Bridge.Decimal.exp = function (d) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).exp());
    };

    Bridge.Decimal.ln = function (d) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).ln());
    };

    Bridge.Decimal.log = function (d, logBase) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).log(logBase));
    };

    Bridge.Decimal.pow = function (d, exponent) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).pow(exponent));
    };

    Bridge.Decimal.sqrt = function (d) {
        return new Bridge.Decimal(Bridge.Decimal.getValue(d).sqrt());
    };

    Bridge.Decimal.prototype.isFinite = function () {
        return this.value.isFinite();
    };

    Bridge.Decimal.prototype.isInteger = function () {
        return this.value.isInteger();
    };

    Bridge.Decimal.prototype.isNaN = function () {
        return this.value.isNaN();
    };

    Bridge.Decimal.prototype.isNegative = function () {
        return this.value.isNegative();
    };

    Bridge.Decimal.prototype.isZero = function () {
        return this.value.isZero();
    };

    Bridge.Decimal.prototype.log = function (logBase) {
        return new Bridge.Decimal(this.value.log(logBase));
    };

    Bridge.Decimal.prototype.ln = function () {
        return new Bridge.Decimal(this.value.ln());
    };

    Bridge.Decimal.prototype.precision = function () {
        return this.value.precision();
    };

    Bridge.Decimal.prototype.round = function () {
        var old = Bridge.$Decimal.rounding,
            r;

        Bridge.$Decimal.rounding = 6;
        r = new Bridge.Decimal(this.value.round());
        Bridge.$Decimal.rounding = old;

        return r;
    };

    Bridge.Decimal.prototype.sqrt = function () {
        return new Bridge.Decimal(this.value.sqrt());
    };

    Bridge.Decimal.prototype.toDecimalPlaces = function (dp, rm) {
        return new Bridge.Decimal(this.value.toDecimalPlaces(dp, rm));
    };

    Bridge.Decimal.prototype.toExponential = function (dp, rm) {
        return this.value.toExponential(dp, rm);
    };

    Bridge.Decimal.prototype.toFixed = function (dp, rm) {
        return this.value.toFixed(dp, rm);
    };

    Bridge.Decimal.prototype.pow = function (n) {
        return new Bridge.Decimal(this.value.pow(n));
    };

    Bridge.Decimal.prototype.toPrecision = function (dp, rm) {
        return this.value.toPrecision(dp, rm);
    };

    Bridge.Decimal.prototype.toSignificantDigits = function (dp, rm) {
        return new Bridge.Decimal(this.value.toSignificantDigits(dp, rm));
    };

    Bridge.Decimal.prototype.valueOf = function () {
        return this.value.valueOf();
    };

    Bridge.Decimal.prototype.toFormat = function (dp, rm, provider) {
        var old = Bridge.$Decimal.format,
            d;

        if (provider && !provider.getFormat) {
            var oldConfig = Bridge.merge({}, old || {});
            Bridge.$Decimal.format = Bridge.merge(oldConfig, provider);
            d = this.value.toFormat(dp, rm);
        } else {
            provider = provider || Bridge.CultureInfo.getCurrentCulture();
            var nfInfo = provider && provider.getFormat(Bridge.NumberFormatInfo);

            if (nfInfo) {
                Bridge.$Decimal.format.decimalSeparator = nfInfo.numberDecimalSeparator;
                Bridge.$Decimal.format.groupSeparator = nfInfo.numberGroupSeparator;
                Bridge.$Decimal.format.groupSize = nfInfo.numberGroupSizes[0];
            }

            d = this.value.toFormat(dp, rm);
        }
        
        
        Bridge.$Decimal.format = old;
        return d;
    };

    Bridge.$Decimal.config({ precision: 29 });

    Bridge.Decimal.Zero = Bridge.Decimal(0);
    Bridge.Decimal.One = Bridge.Decimal(1);
    Bridge.Decimal.MinusOne = Bridge.Decimal(-1);
    Bridge.Decimal.MinValue = Bridge.Decimal("-79228162514264337593543950335");
    Bridge.Decimal.MaxValue = Bridge.Decimal("79228162514264337593543950335");

    // @source Date.js

Bridge.define("Bridge.DayOfWeek", {
    $enum: true,
    $statics: {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
    }
});

var date = {
        getDefaultValue: function() {
            return new Date(-864e13);
        },

        utcNow:  function () {
            var d = new Date();

            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
        },

        today: function () {
            var d = new Date();

            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        },

        timeOfDay: function(dt) {
            return new Bridge.TimeSpan((dt - new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())) * 10000);
        },

        isUseGenitiveForm: function (format, index, tokenLen, patternToMatch) {
	        var i,
                repeat = 0;

	        for (i = index - 1; i >= 0 && format[i] !== patternToMatch; i--) { }

            if (i >= 0) {
                while (--i >= 0 && format[i] === patternToMatch) {
                    repeat++;
                }

                if (repeat <= 1) {
                    return true;
                }
            }

            for (i = index + tokenLen; i < format.length && format[i] !== patternToMatch; i++) {
            }

            if (i < format.length) {
                repeat = 0;

                while (++i < format.length && format[i] === patternToMatch) {
                    repeat++;
                }

                if (repeat <= 1) {
                    return true;
                }
            }

            return false;
        },

        format: function (date, format, provider) {
            var me = this,
                df = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.DateTimeFormatInfo),
                year = date.getFullYear(),
                month = date.getMonth(),
                dayOfMonth = date.getDate(),
                dayOfWeek = date.getDay(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                millisecond = date.getMilliseconds(),
                timezoneOffset = date.getTimezoneOffset(),
                formats;

            format = format || "G";

            if (format.length === 1) {
                formats = df.getAllDateTimePatterns(format, true);
                format = formats ? formats[0] : format;
            } else if (format.length === 2 && format.charAt(0) === "%") {
                format = format.charAt(1);
            }

            return format.replace(/(\\.|'[^']*'|"[^"]*"|d{1,4}|M{1,4}|yyyy|yy|y|HH?|hh?|mm?|ss?|tt?|f{1,3}|z{1,3}|\:|\/)/g,
			    function (match, group, index) {
			        var part = match;

			        switch (match) {
			            case "dddd":
			                part = df.dayNames[dayOfWeek];

			                break;
			            case "ddd":
			                part = df.abbreviatedDayNames[dayOfWeek];

			                break;
			            case "dd":
			                part = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;

			                break;
			            case "d":
			                part = dayOfMonth;

			                break;
			            case "MMMM":
			                if (me.isUseGenitiveForm(format, index, 4, "d")) {
			                    part = df.monthGenitiveNames[month];
			                } else {
			                    part = df.monthNames[month];
			                }

			                break;
			            case "MMM":
			                if (me.isUseGenitiveForm(format, index, 3, "d")) {
			                    part = df.abbreviatedMonthGenitiveNames[month];
			                } else {
			                    part = df.abbreviatedMonthNames[month];
			                }

			                break;
			            case "MM":
			                part = (month + 1) < 10 ? "0" + (month + 1) : (month + 1);

			                break;
			            case "M":
			                part = month + 1;

			                break;
			            case "yyyy":
			                part = year;

			                break;
			            case "yy":
			                part = (year % 100).toString();

			                if (part.length === 1) {
			                    part = "0" + part;
			                }

			                break;
			            case "y":
			                part = year % 100;

			                break;
			            case "h":
			            case "hh":
			                part = hour % 12;

			                if (!part) {
			                    part = "12";
			                } else if (match === "hh" && part.length === 1) {
			                    part = "0" + part;
			                }

			                break;
			            case "HH":
			                part = hour.toString();

			                if (part.length === 1) {
			                    part = "0" + part;
			                }

			                break;
			            case "H":
			                part = hour;
			                break;
			            case "mm":
			                part = minute.toString();

			                if (part.length === 1) {
			                    part = "0" + part;
			                }

			                break;
			            case "m":
			                part = minute;

			                break;
			            case "ss":
			                part = second.toString();

			                if (part.length === 1) {
			                    part = "0" + part;
			                }

			                break;
			            case "s":
			                part = second;
			                break;
			            case "t":
			            case "tt":
			                part = (hour < 12) ? df.amDesignator : df.pmDesignator;

			                if (match === "t") {
			                    part = part.charAt(0);
			                }

			                break;
			            case "f":
			            case "ff":
			            case "fff":
			                part = millisecond.toString();

			                if (part.length < 3) {
			                    part = Array(3 - part.length).join("0") + part;
			                }

			                if (match === "ff") {
			                    part = part.substr(0, 2);
			                } else if (match === "f") {
			                    part = part.charAt(0);
			                }

			                break;
			            case "z":
			                part = timezoneOffset / 60;
			                part = ((part >= 0) ? "-" : "+") + Math.floor(Math.abs(part));

			                break;
			            case "zz":
			            case "zzz":
			                part = timezoneOffset / 60;
			                part = ((part >= 0) ? "-" : "+") + Bridge.String.alignString(Math.floor(Math.abs(part)).toString(), 2, "0", 2);

			                if (match === "zzz") {
			                    part += df.timeSeparator + Bridge.String.alignString(Math.floor(Math.abs(timezoneOffset % 60)).toString(), 2, "0", 2);
			                }

			                break;
			            case ":":
			                part = df.timeSeparator;

			                break;
			            case "/":
			                part = df.dateSeparator;

			                break;
			            default:
			                part = match.substr(1, match.length - 1 - (match.charAt(0) !== "\\"));

			                break;
			        }

			        return part;
			    });
        },

        parse: function (value, provider, utc, silent) {
            var dt = this.parseExact(value, null, provider, utc, true);

            if (dt !== null) {
                return dt;
            }

            dt = Date.parse(value);

            if (!isNaN(dt)) {
                return new Date(dt);
            } else if (!silent) {
                throw new Bridge.FormatException("String does not contain a valid string representation of a date and time.");
            }
        },

        parseExact: function (str, format, provider, utc, silent) {
            if (!format) {
                format = ["G", "g", "F", "f", "D", "d", "R", "r", "s", "S", "U", "u", "O", "o", "Y", "y", "M", "m", "T", "t"];
            }

            if (Bridge.isArray(format)) {
                var j = 0,
                    d;

                for (j; j < format.length; j++) {
                    d = Bridge.Date.parseExact(str, format[j], provider, utc, true);

                    if (d != null) {
                        return d;
                    }
                }

                if (silent) {
                    return null;
                }

                throw new Bridge.FormatException("String does not contain a valid string representation of a date and time.");
            }

            var df = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.DateTimeFormatInfo),
                am = df.amDesignator,
                pm = df.pmDesignator,
                idx = 0,
                index = 0,
                i = 0,
                c,
                token,
                year = 0,
                month = 1,
                date = 1,
                hh = 0,
                mm = 0,
                ss = 0,
                ff = 0,
                tt = "",
                zzh = 0,
                zzm = 0,
                zzi,
                sign,
                neg,
                names,
                name,
                invalid = false,
                inQuotes = false,
                tokenMatched,
                formats;

            if (str == null) {
                throw new Bridge.ArgumentNullException("str");
            }

            format = format || "G";

            if (format.length === 1) {
                formats = df.getAllDateTimePatterns(format, true);
                format = formats ? formats[0] : format;
            } else if (format.length === 2 && format.charAt(0) === "%") {
                format = format.charAt(1);
            }

            while (index < format.length) {
                c = format.charAt(index);
                token = "";

                if (inQuotes === "\\") {
                    token += c;
                    index++;
                } else {
                    while ((format.charAt(index) === c) && (index < format.length)) {
                        token += c;
                        index++;
                    }
                }

                tokenMatched = true;

                if (!inQuotes) {
                    if (token === "yyyy" || token === "yy" || token === "y") {
                        if (token === "yyyy") {
                            year = this.subparseInt(str, idx, 4, 4);
                        } else if (token === "yy") {
                            year = this.subparseInt(str, idx, 2, 2);
                        } else if (token === "y") {
                            year = this.subparseInt(str, idx, 2, 4);
                        }

                        if (year == null) {
                            invalid = true;
                            break;
                        }

                        idx += year.length;

                        if (year.length === 2) {
                            year = ~~year;
                            year = (year > 30 ? 1900 : 2000) + year;
                        }
                    } else if (token === "MMM" || token === "MMMM") {
                        month = 0;

                        if (token === "MMM") {
                            if (this.isUseGenitiveForm(format, index, 3, "d")) {
                                names = df.abbreviatedMonthGenitiveNames;
                            } else {
                                names = df.abbreviatedMonthNames;
                            }
                        } else {
                            if (this.isUseGenitiveForm(format, index, 4, "d")) {
                                names = df.monthGenitiveNames;
                            } else {
                                names = df.monthNames;
                            }
                        }

                        for (i = 0; i < names.length; i++) {
                            name = names[i];

                            if (str.substring(idx, idx + name.length).toLowerCase() === name.toLowerCase()) {
                                month = (i % 12) + 1;
                                idx += name.length;

                                break;
                            }
                        }

                        if ((month < 1) || (month > 12)) {
                            invalid = true;

                            break;
                        }
                    } else if (token === "MM" || token === "M") {
                        month = this.subparseInt(str, idx, token.length, 2);

                        if (month == null || month < 1 || month > 12) {
                            invalid = true;

                            break;
                        }

                        idx += month.length;
                    } else if (token === "dddd" || token === "ddd") {
                        names = token === "ddd" ? df.abbreviatedDayNames : df.dayNames;

                        for (i = 0; i < names.length; i++) {
                            name = names[i];

                            if (str.substring(idx, idx + name.length).toLowerCase() === name.toLowerCase()) {
                                idx += name.length;

                                break;
                            }
                        }
                    } else if (token === "dd" || token === "d") {
                        date = this.subparseInt(str, idx, token.length, 2);

                        if (date == null || date < 1 || date > 31) {
                            invalid = true;

                            break;
                        }

                        idx += date.length;
                    } else if (token === "hh" || token === "h") {
                        hh = this.subparseInt(str, idx, token.length, 2);

                        if (hh == null || hh < 1 || hh > 12) {
                            invalid = true;

                            break;
                        }

                        idx += hh.length;
                    } else if (token === "HH" || token === "H") {
                        hh = this.subparseInt(str, idx, token.length, 2);

                        if (hh == null || hh < 0 || hh > 23) {
                            invalid = true;

                            break;
                        }

                        idx += hh.length;
                    } else if (token === "mm" || token === "m") {
                        mm = this.subparseInt(str, idx, token.length, 2);

                        if (mm == null || mm < 0 || mm > 59) {
                            return null;
                        }

                        idx += mm.length;
                    } else if (token === "ss" || token === "s") {
                        ss = this.subparseInt(str, idx, token.length, 2);

                        if (ss == null || ss < 0 || ss > 59) {
                            invalid = true;

                            break;
                        }

                        idx += ss.length;
                    } else if (token === "u") {
                        ff = this.subparseInt(str, idx, 1, 7);

                        if (ff == null) {
                            invalid = true;

                            break;
                        }

                        idx += ff.length;

                        if (ff.length > 3) {
                            ff = ff.substring(0, 3);
                        }
                    } else if (token === "fffffff" || token === "ffffff" || token === "fffff" || token === "ffff" || token === "fff" || token === "ff" || token === "f") {
                        ff = this.subparseInt(str, idx, token.length, 7);

                        if (ff == null) {
                            invalid = true;

                            break;
                        }

                        idx += ff.length;

                        if (ff.length > 3) {
                            ff = ff.substring(0, 3);
                        }
                    } else if (token === "t") {
                        if (str.substring(idx, idx + 1).toLowerCase() === am.charAt(0).toLowerCase()) {
                            tt = am;
                        } else if (str.substring(idx, idx + 1).toLowerCase() === pm.charAt(0).toLowerCase()) {
                            tt = pm;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx += 1;
                    } else if (token === "tt") {
                        if (str.substring(idx, idx + 2).toLowerCase() === am.toLowerCase()) {
                            tt = am;
                        } else if (str.substring(idx, idx + 2).toLowerCase() === pm.toLowerCase()) {
                            tt = pm;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx += 2;
                    } else if (token === "z" || token === "zz") {
                        sign = str.charAt(idx);

                        if (sign === "-") {
                            neg = true;
                        } else if (sign === "+") {
                            neg = false;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx++;

                        zzh = this.subparseInt(str, idx, 1, 2);

                        if (zzh == null || zzh > 14) {
                            invalid = true;

                            break;
                        }

                        idx += zzh.length;

                        if (neg) {
                            zzh = -zzh;
                        }
                    } else if (token === "zzz") {
                        name = str.substring(idx, idx + 6);
                        idx += 6;

                        if (name.length !== 6) {
                            invalid = true;

                            break;
                        }

                        sign = name.charAt(0);

                        if (sign === "-") {
                            neg = true;
                        } else if (sign === "+") {
                            neg = false;
                        } else {
                            invalid = true;

                            break;
                        }

                        zzi = 1;
                        zzh = this.subparseInt(name, zzi, 1, 2);

                        if (zzh == null || zzh > 14) {
                            invalid = true;

                            break;
                        }

                        zzi += zzh.length;

                        if (neg) {
                            zzh = -zzh;
                        }

                        if (name.charAt(zzi) !== df.timeSeparator) {
                            invalid = true;

                            break;
                        }

                        zzi++;

                        zzm = this.subparseInt(name, zzi, 1, 2);

                        if (zzm == null || zzh > 59) {
                            invalid = true;

                            break;
                        }
                    } else {
                        tokenMatched = false;
                    }
                }

                if (inQuotes || !tokenMatched) {
                    name = str.substring(idx, idx + token.length);

                    if ((!inQuotes && ((token === ":" && name !== df.timeSeparator) ||
                        (token === "/" && name !== df.dateSeparator))) ||
                        (name !== token && token !== "'" && token !== '"' && token !== "\\")) {
                        invalid = true;

                        break;
                    }

                    if (inQuotes === "\\") {
                        inQuotes = false;
                    }

                    if (token !== "'" && token !== '"' && token !== "\\") {
                        idx += token.length;
                    } else {
                        if (inQuotes === false) {
                            inQuotes = token;
                        } else {
                            if (inQuotes !== token) {
                                invalid = true;
                                break;
                            }

                            inQuotes = false;
                        }
                    }
                }
            }

            if (inQuotes) {
                invalid = true;
            }

            if (!invalid) {
                if (idx !== str.length) {
                    invalid = true;
                } else if (month === 2) {
                    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                        if (date > 29) {
                            invalid = true;
                        }
                    } else if (date > 28) {
                        invalid = true;
                    }
                } else if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
                    if (date > 30) {
                        invalid = true;
                    }
                }
            }

            if (invalid) {
                if (silent) {
                    return null;
                }

                throw new Bridge.FormatException("String does not contain a valid string representation of a date and time.");
            }

            if (hh < 12 && tt === pm) {
                hh = hh - 0 + 12;
            } else if (hh > 11 && tt === am) {
                hh -= 12;
            }

            if (zzh === 0 && zzm === 0 && !utc) {
                return new Date(year, month - 1, date, hh, mm, ss, ff);
            }

            return new Date(Date.UTC(year, month - 1, date, hh - zzh, mm - zzm, ss, ff));
        },

        subparseInt: function (str, index, min, max) {
            var x,
                token;

            for (x = max; x >= min; x--) {
                token = str.substring(index, index + x);

                if (token.length < min) {
                    return null;
                }

                if (/^\d+$/.test(token)) {
                    return token;
                }
            }

            return null;
        },

        tryParse: function (value, provider, result, utc) {
            result.v = this.parse(value, provider, utc, true);

            if (result.v == null) {
                result.v = new Date(-864e13);

                return false;
            }

            return true;
        },

        tryParseExact: function (value, format, provider, result, utc) {
            result.v = this.parseExact(value, format, provider, utc, true);

            if (result.v == null) {
                result.v = new Date(-864e13);

                return false;
            }

            return true;
        },

        isDaylightSavingTime: function (dt) {
            var temp = Bridge.Date.today();

            temp.setMonth(0);
            temp.setDate(1);

            return temp.getTimezoneOffset() !== dt.getTimezoneOffset();
        },

        toUTC: function (date) {
            return new Date(date.getUTCFullYear(),
                            date.getUTCMonth(),
                            date.getUTCDate(),
                            date.getUTCHours(),
                            date.getUTCMinutes(),
                            date.getUTCSeconds(),
                            date.getUTCMilliseconds());
        },

        toLocal: function (date) {
            return new Date(Date.UTC(date.getFullYear(),
                                     date.getMonth(),
                                     date.getDate(),
                                     date.getHours(),
                                     date.getMinutes(),
                                     date.getSeconds(),
                                     date.getMilliseconds()));
        },

        subdt: function(d, t) {
            return Bridge.hasValue(d) && Bridge.hasValue(t) ? (new Date(d - new Date(t.ticks / 10000))) : null;
        },

        adddt: function(d, t) {
            return Bridge.hasValue(d) && Bridge.hasValue(t) ? (new Date(d.getTime() + (t.ticks / 10000))) : null;
        },

        subdd: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (new Bridge.TimeSpan((a - b) * 10000)) : null;
        },

        gt: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a > b) : false;
        },

        gte: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a >= b) : false;
        },

        lt: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a < b) : false;
        },

        lte: function (a, b) {
            return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a <= b) : false;
        }
    };

    Bridge.Date = date;

    // @source TimeSpan.js

    Bridge.define("Bridge.TimeSpan", {
        inherits: [Bridge.IComparable],
        statics: {
            fromDays: function (value) {
                return new Bridge.TimeSpan(value * 864e9);
            },

            fromHours: function (value) {
                return new Bridge.TimeSpan(value * 36e9);
            },

            fromMilliseconds: function (value) {
                return new Bridge.TimeSpan(value * 1e4);
            },

            fromMinutes: function (value) {
                return new Bridge.TimeSpan(value * 6e8);
            },

            fromSeconds: function (value) {
                return new Bridge.TimeSpan(value * 1e7);
            },

            fromTicks: function (value) {
                return new Bridge.TimeSpan(value);
            },

            constructor: function () {
                this.zero = new Bridge.TimeSpan(0);
                this.maxValue = new Bridge.TimeSpan(864e13);
                this.minValue = new Bridge.TimeSpan(-864e13);
            },

            getDefaultValue: function () {
                return new Bridge.TimeSpan(0);
            },

            neg: function (t) {
                return Bridge.hasValue(t) ? (new Bridge.TimeSpan(-t.ticks)) : null;
            },

            sub: function (t1, t2) {
                return Bridge.hasValue(t1) && Bridge.hasValue(t2) ? (new Bridge.TimeSpan(t1.ticks - t2.ticks)) : null;
            },

            eq: function(t1, t2) {
                return Bridge.hasValue(t1) && Bridge.hasValue(t2) ? (t1.ticks === t2.ticks) : null;
            },

            neq: function (t1, t2) {
                return Bridge.hasValue(t1) && Bridge.hasValue(t2) ? (t1.ticks !== t2.ticks) : null;
            },

            plus: function (t) {
                return Bridge.hasValue(t) ? (new Bridge.TimeSpan(t.ticks)) : null;
            },

            add: function (t1, t2) {
                return Bridge.hasValue(t1) && Bridge.hasValue(t2) ? (new Bridge.TimeSpan(t1.ticks + t2.ticks)) : null;
            },

            gt: function (a, b) {
                return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a.ticks > b.ticks) : false;
            },

            gte: function (a, b) {
                return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a.ticks >= b.ticks) : false;
            },

            lt: function (a, b) {
                return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a.ticks < b.ticks) : false;
            },

            lte: function (a, b) {
                return Bridge.hasValue(a) && Bridge.hasValue(b) ? (a.ticks <= b.ticks) : false;
            }
        },

        constructor: function () {
            this.ticks = 0;

            if (arguments.length === 1) {
                this.ticks = arguments[0];
            } else if (arguments.length === 3) {
                this.ticks = (((arguments[0] * 60 + arguments[1]) * 60) + arguments[2]) * 1e7;
            } else if (arguments.length === 4) {
                this.ticks = ((((arguments[0] * 24 + arguments[1]) * 60 + arguments[2]) * 60) + arguments[3]) * 1e7;
            } else if (arguments.length === 5) {
                this.ticks = (((((arguments[0] * 24 + arguments[1]) * 60 + arguments[2]) * 60) + arguments[3]) * 1e3 + arguments[4]) * 1e4;
            }
        },

        getTicks: function () {
            return this.ticks;
        },

        getDays: function () {
            return this.ticks / 864e9 | 0;
        },

        getHours: function () {
            return this.ticks / 36e9 % 24 | 0;
        },

        getMilliseconds: function () {
            return this.ticks / 1e4 % 1e3 | 0;
        },

        getMinutes: function () {
            return this.ticks / 6e8 % 60 | 0;
        },

        getSeconds: function () {
            return this.ticks / 1e7 % 60 | 0;
        },

        getTotalDays: function () {
            return this.ticks / 864e9;
        },

        getTotalHours: function () {
            return this.ticks / 36e9;
        },

        getTotalMilliseconds: function () {
            return this.ticks / 1e4;
        },

        getTotalMinutes: function () {
            return this.ticks / 6e8;
        },

        getTotalSeconds: function () {
            return this.ticks / 1e7;
        },

        get12HourHour: function () {
            return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
        },

        add: function (ts) {
            return new Bridge.TimeSpan(this.ticks + ts.ticks);
        },

        subtract: function (ts) {
            return new Bridge.TimeSpan(this.ticks - ts.ticks);
        },

        duration: function () {
            return new Bridge.TimeSpan(Math.abs(this.ticks));
        },

        negate: function () {
            return new Bridge.TimeSpan(-this.ticks);
        },

        compareTo: function (other) {
            return this.ticks < other.ticks ? -1 : (this.ticks > other.ticks ? 1 : 0);
        },

        equals: function (other) {
            return other.ticks === this.ticks;
        },

        equalsT: function (other) {
            return other.ticks === this.ticks;
        },

        format: function (formatStr, provider) {
            return this.toString(formatStr, provider);
        },

        toString: function (formatStr, provider) {
            var ticks = this.ticks,
                result = "",
                me = this,
                dtInfo = (provider || Bridge.CultureInfo.getCurrentCulture()).getFormat(Bridge.DateTimeFormatInfo),
                format = function (t, n) {
                    return Bridge.String.alignString((t | 0).toString(), n || 2, "0", 2);
                };

            if (formatStr) {
                return formatStr.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g,
                    function (formatStr) {
                        switch (formatStr) {
                            case "d":
                                return me.getDays();
                            case "dd":
                                return format(me.getDays());
                            case "H":
                                return me.getHours();
                            case "HH":
                                return format(me.getHours());
                            case "h":
                                return me.get12HourHour();
                            case "hh":
                                return format(me.get12HourHour());
                            case "m":
                                return me.getMinutes();
                            case "mm":
                                return format(me.getMinutes());
                            case "s":
                                return me.getSeconds();
                            case "ss":
                                return format(me.getSeconds());
                            case "t":
                                return ((me.getHours() < 12) ? dtInfo.amDesignator : dtInfo.pmDesignator).substring(0, 1);
                            case "tt":
                                return (me.getHours() < 12) ? dtInfo.amDesignator : dtInfo.pmDesignator;
                        }
                    }
                );
            }

            if (Math.abs(ticks) >= 864e9) {
                result += format(ticks / 864e9) + ".";
                ticks %= 864e9;
            }

            result += format(ticks / 36e9) + ":";
            ticks %= 36e9;
            result += format(ticks / 6e8 | 0) + ":";
            ticks %= 6e8;
            result += format(ticks / 1e7);
            ticks %= 1e7;

            if (ticks > 0) {
                result += "." + format(ticks, 7);
            }

            return result;
        }
    });

    Bridge.Class.addExtend(Bridge.TimeSpan, [Bridge.IComparable$1(Bridge.TimeSpan), Bridge.IEquatable$1(Bridge.TimeSpan)]);

// @source Text/StringBuilder.js

Bridge.define("Bridge.Text.StringBuilder", {
    constructor: function () {
        this.buffer = [],
        this.capacity = 16;

        if (arguments.length === 1) {
            this.append(arguments[0]);
        } else if (arguments.length === 2) {
            this.append(arguments[0]);
            this.setCapacity(arguments[1]);
        } else if (arguments.length === 3) {
            this.append(arguments[0], arguments[1], arguments[2]);
        }
    },

    getLength: function () {
        if (this.buffer.length < 2) {
            return this.buffer[0] ? this.buffer[0].length : 0;
        }

        var s = this.buffer.join("");

        this.buffer = [];
        this.buffer[0] = s;

        return s.length;
    },

    getCapacity: function () {
        var length = this.getLength();

        return (this.capacity > length) ? this.capacity : length;
    },

    setCapacity: function (value) {
        var length = this.getLength();

        if (value > length) {
            this.capacity = value;
        }
    },

    toString: function () {
        var s = this.buffer.join("");

        this.buffer = [];
        this.buffer[0] = s;

        if (arguments.length === 2) {
            var startIndex = arguments[0],
                length = arguments[1];

            this.checkLimits(s, startIndex, length);

            return s.substr(startIndex, length);
        }

        return s;
    },

    append: function (value) {
        if (value == null) {
            return this;
        }

        if (arguments.length === 2) {
            // append a char repeated count times
            var count = arguments[1];

            if (count === 0) {
                return this;
            } else if (count < 0) {
                throw new Bridge.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }

            value = Array(count + 1).join(value).toString();
        } else if (arguments.length === 3) {
            // append a (startIndex, count) substring of value
            var startIndex = arguments[1],
                count = arguments[2];

            if (count === 0) {
                return this;
            }

            this.checkLimits(value, startIndex, count);
            value = value.substr(startIndex, count);
        }

        this.buffer[this.buffer.length] = value;

        return this;
    },

    appendFormat: function (format) {
        return this.append(Bridge.String.format.apply(Bridge.String, arguments));
    },

    clear: function () {
        this.buffer = [];

        return this;
    },

    appendLine: function () {
        if (arguments.length === 1) {
            this.append(arguments[0]);
        }

        return this.append("\r\n");
    },

    equals: function (sb) {
        if (sb == null) {
            return false;
        }

        if (sb === this) {
            return true;
        }

        return this.toString() === sb.toString();
    },

    remove: function (startIndex, length) {
        var s = this.buffer.join("");

        this.checkLimits(s, startIndex, length);

        if (s.length === length && startIndex === 0) {
            // Optimization.  If we are deleting everything
            return this.clear();
        }

        if (length > 0) {
            this.buffer = [];
            this.buffer[0] = s.substring(0, startIndex);
            this.buffer[1] = s.substring(startIndex + length, s.length);
        }

        return this;
    },

    insert: function (index, value) {
        if (value == null) {
            return this;
        }

        if (arguments.length === 3) {
            // insert value repeated count times
            var count = arguments[2];

            if (count === 0) {
                return this;
            } else if (count < 0) {
                throw new Bridge.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }

            value = Array(count + 1).join(value).toString();
        }

        var s = this.buffer.join("");
        this.buffer = [];

        if (index < 1) {
            this.buffer[0] = value;
            this.buffer[1] = s;
        } else if (index >= s.length) {
            this.buffer[0] = s;
            this.buffer[1] = value;
        } else {
            this.buffer[0] = s.substring(0, index);
            this.buffer[1] = value;
            this.buffer[2] = s.substring(index, s.length);
        }

        return this;
    },

    replace: function (oldValue, newValue) {
        var r = new RegExp(oldValue, "g"),
            s = this.buffer.join("");

        this.buffer = [];

        if (arguments.length === 4) {
            var startIndex = arguments[2],
                count = arguments[3],
                b = s.substr(startIndex, count);

            this.checkLimits(s, startIndex, count);

            this.buffer[0] = s.substring(0, startIndex);
            this.buffer[1] = b.replace(r, newValue);
            this.buffer[2] = s.substring(startIndex + count, s.length);
        } else {
            this.buffer[0] = s.replace(r, newValue);
        }

        return this;
    },

    checkLimits: function (value, startIndex, length) {
        if (length < 0) {
            throw new Bridge.ArgumentOutOfRangeException("length", "must be non-negative");
        }

        if (startIndex < 0) {
            throw new Bridge.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero");
        }

        if (length > value.length - startIndex) {
            throw new Bridge.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
        }
    }
});

// @source Text/Regex.js

(function () {
    var specials = [
            // order matters for these
              "-"
            , "["
            , "]"
            // order doesn't matter for any of these
            , "/"
            , "{"
            , "}"
            , "("
            , ")"
            , "*"
            , "+"
            , "?"
            , "."
            , "\\"
            , "^"
            , "$"
            , "|"
    ],

    regex = RegExp("[" + specials.join("\\") + "]", "g"),

    regexpEscape = function (s) {
        return s.replace(regex, "\\$&");
    };

    Bridge.regexpEscape = regexpEscape;
})();

Bridge.Debug = {
    writeln: function (text) {
        var global = Bridge.global;
        if (global.console) {
            if (global.console.debug) {
                global.console.debug(text);
                return;
            }
            else if (global.console.log) {
                global.console.log(text);
                return;
            }
        }
        else if (global.opera && global.opera.postError) {
            global.opera.postError(text);
            return;
        }
    },

    _fail: function (message) {
        Bridge.Debug.writeln(message);
        debugger;
    },

    assert: function (condition, message) {
        if (!condition) {
            message = 'Assert failed: ' + message;
            if (confirm(message + '\r\n\r\nBreak into debugger?')) {
                Bridge.Debug._fail(message);
            }
        }
    },

    fail: function (message) {
        Bridge.Debug._fail(message);
    }
}

Bridge.define("Bridge.Stopwatch", {
    constructor: function () {
        this._stopTime = 0;
        this._startTime = 0;
        this.isRunning = false;
    },

    reset: function () {
        this._stopTime = this._startTime = Bridge.Stopwatch.getTimestamp();
        this.isRunning = false;
    },

    ticks: function () {
        return (this.isRunning ? Bridge.Stopwatch.getTimestamp() : this._stopTime) - this._startTime;
    },

    milliseconds: function () {
        return Math.round(this.ticks() / Bridge.Stopwatch.frequency * 1000);
    },

    timeSpan: function () {
        return new Bridge.TimeSpan(this.milliseconds() * 10000);
    },

    start: function () {
        if (this.isRunning)
            return;
        this._startTime = Bridge.Stopwatch.getTimestamp();
        this.isRunning = true;
    },

    stop: function () {
        if (!this.isRunning)
            return;
        this._stopTime = Bridge.Stopwatch.getTimestamp();
        this.isRunning = false;
    },

    restart: function () {
        this.isRunning = false;
        this.start();
    },

    statics: {
        startNew: function () {
            var s = new Bridge.Stopwatch();
            s.start();
            return s;
        }
    }
});

if (typeof (window) !== 'undefined' && window.performance && window.performance.now) {
    Bridge.Stopwatch.frequency = 1e6;
    Bridge.Stopwatch.isHighResolution = true;
    Bridge.Stopwatch.getTimestamp = function () { return Math.round(window.performance.now() * 1000); };
}
else if (typeof (process) !== 'undefined' && process.hrtime) {
    Bridge.Stopwatch.frequency = 1e9;
    Bridge.Stopwatch.isHighResolution = true;
    Bridge.Stopwatch.getTimestamp = function () { var hr = process.hrtime(); return hr[0] * 1e9 + hr[1]; };
}
else {
    Bridge.Stopwatch.frequency = 1e3;
    Bridge.Stopwatch.isHighResolution = false;
    Bridge.Stopwatch.getTimestamp = function () { return new Date().valueOf(); };
}

Bridge.Contract = {
	reportFailure: function (failureKind, userMessage, condition, innerException, TException) {
		var conditionText = condition.toString();
		conditionText = conditionText.substring(conditionText.indexOf("return") + 7);
		conditionText = conditionText.substr(0, conditionText.lastIndexOf(";"));

		var failureMessage = (conditionText) ? "Contract '" + conditionText + "' failed" : "Contract failed";
		var displayMessage = (userMessage) ? failureMessage + ": " + userMessage : failureMessage;

		if (TException) {
			throw new TException(conditionText, userMessage);
		}
		else {
			throw new Bridge.ContractException(failureKind, displayMessage, userMessage, conditionText, innerException);
		}
	},
	assert: function (failureKind, condition, message) {
		if (!condition()) {
			Bridge.Contract.reportFailure(failureKind, message, condition, null);
		}
	},
	requires: function (TException, condition, message) {
		if (!condition()) {
			Bridge.Contract.reportFailure(0, message, condition, null, TException);
		}
	},
	forAll: function (fromInclusive, toExclusive, predicate) {
		if (!predicate) {
			throw new Bridge.ArgumentNullException("predicate");
		}
		for (; fromInclusive < toExclusive; fromInclusive++) {
			if (!predicate(fromInclusive)) {
				return false;
			}
		}
		return true;
	},
	forAll$1: function (collection, predicate) {
		if (!collection) {
			throw new Bridge.ArgumentNullException("collection");
		}
		if (!predicate) {
			throw new Bridge.ArgumentNullException("predicate");
		}
		var enumerator = Bridge.getEnumerator(collection);
		try {
			while (enumerator.moveNext()) {
				if (!predicate(enumerator.getCurrent())) {
					return false;
				}
			}
			return true;
		} finally {
			enumerator.dispose();
		}
	},
	exists: function (fromInclusive, toExclusive, predicate) {
		if (!predicate) {
			throw new Bridge.ArgumentNullException("predicate");
		}
		for (; fromInclusive < toExclusive; fromInclusive++) {
			if (predicate(fromInclusive)) {
				return true;
			}
		}
		return false;
	},
	exists$1: function (collection, predicate) {
		if (!collection) {
			throw new Bridge.ArgumentNullException("collection");
		}
		if (!predicate) {
			throw new Bridge.ArgumentNullException("predicate");
		}
		var enumerator = Bridge.getEnumerator(collection);
		try {
			while (enumerator.moveNext()) {
				if (predicate(enumerator.getCurrent())) {
					return true;
				}
			}
			return false;
		} finally {
			enumerator.dispose();
		}
	}
};

Bridge.define("Bridge.ContractFailureKind", {
    $enum: true,
    $statics: {
        precondition: 0,
        postcondition: 1,
        postconditionOnException: 2,
        invarian: 3,
        assert: 4,
        assume: 5
    }
});

Bridge.define("Bridge.ContractException", {
    inherits: [Bridge.Exception],

    constructor: function (failureKind, failureMessage, userMessage, condition, innerException) {
        Bridge.Exception.prototype.$constructor.call(this, failureMessage, innerException);
        this._kind = failureKind;
        this._failureMessage = failureMessage || null;
        this._userMessage = userMessage || null;
        this._condition = condition || null;
    },

    getKind: function () {
		return this._kind;
	},
	getFailure: function () {
		return this._failureMessage;
	},
	getUserMessage: function () {
		return this._userMessage;
	},
	getCondition: function() {
		return this._condition;
	}
});
    // @source Array.js

    var array = {
        toIndex: function (arr, indices) {
            if (indices.length !== (arr.$s ? arr.$s.length : 1)) {
                throw new Bridge.ArgumentException("Invalid number of indices");
            }

            if (indices[0] < 0 || indices[0] >= (arr.$s ? arr.$s[0] : arr.length)) {
                throw new Bridge.ArgumentException("Index 0 out of range");
            }

            var idx = indices[0],
                i;

            if (arr.$s) {
                for (i = 1; i < arr.$s.length; i++) {
                    if (indices[i] < 0 || indices[i] >= arr.$s[i]) {
                        throw new Bridge.ArgumentException("Index " + i + " out of range");
                    }

                    idx = idx * arr.$s[i] + indices[i];
                }
            }

            return idx;
        },

        $get: function (indices) {
            var r = this[Bridge.Array.toIndex(this, indices)];

            return typeof r !== "undefined" ? r : this.$v;
        },

        get: function (arr) {
            var r = arr[Bridge.Array.toIndex(arr, Array.prototype.slice.call(arguments, 1))];

            return typeof r !== "undefined" ? r : arr.$v;
        },

        $set: function (indices, value) {
            this[Bridge.Array.toIndex(this, Array.prototype.slice.call(indices, 0))] = value;
        },

        set: function (arr, value) {
            var indices = Array.prototype.slice.call(arguments, 2);
            arr[Bridge.Array.toIndex(arr, indices)] = value;
        },

        getLength: function (arr, dimension) {
            if (dimension >= (arr.$s ? arr.$s.length : 1)) {
                throw new Bridge.ArgumentException("Invalid dimension");
            }

            return arr.$s ? arr.$s[dimension] : arr.length;
        },

        getRank: function (arr) {
            return arr.$s ? arr.$s.length : 1;
        },

        getLower: function (arr, d) {
            return 0;
        },

        create: function (defvalue, initValues, sizes) {
            var arr = [],
                length = arguments.length > 2 ? 1 : 0,
                i, s, v,
                idx,
                indices,
                flatIdx;

            arr.$v = defvalue;
            arr.$s = [];
            arr.get = Bridge.Array.$get;
            arr.set = Bridge.Array.$set;

            for (i = 2; i < arguments.length; i++) {
                length *= arguments[i];
                arr.$s[i - 2] = arguments[i];
            }

            arr.length = length;

            if (initValues) {
                for (i = 0; i < arr.length; i++) {
                    indices = [];
                    flatIdx = i;

                    for (s = arr.$s.length - 1; s >= 0; s--) {
                        idx = flatIdx % arr.$s[s];
                        indices.unshift(idx);
                        flatIdx = Bridge.Int.div(flatIdx - idx, arr.$s[s]);
                    }

                    v = initValues;

                    for (idx = 0; idx < indices.length; idx++) {
                        v = v[indices[idx]];
                    }

                    arr[i] = v;
                }
            }

            return arr;
        },

        init: function (size, value) {
            var arr = new Array(size),
                isFn = Bridge.isFunction(value);

            for (var i = 0; i < size; i++) {
                arr[i] = isFn ? value() : value;
            }

            return arr;
        },

        toEnumerable: function (array) {
            return new Bridge.ArrayEnumerable(array);
        },

        toEnumerator: function (array) {
            return new Bridge.ArrayEnumerator(array);
        },

        is: function (obj, type) {
            if (obj instanceof Bridge.ArrayEnumerator) {
                if ((obj.constructor === type) || (obj instanceof type) ||
                    type === Bridge.ArrayEnumerator ||
                    type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IEnumerator")) {
                    return true;
                }
                return false;
            }


            if (!Bridge.isArray(obj)) {
                return false;
            }

            if ((obj.constructor === type) || (obj instanceof type)) {
                return true;
            }

            if (type === Bridge.IEnumerable ||
                type === Bridge.ICollection ||
                type === Bridge.ICloneable ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IEnumerable$1") ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.ICollection$1") ||
                type.$$name && Bridge.String.startsWith(type.$$name, "Bridge.IList$1")) {
                return true;
            }

            return false;
        },

        clone: function (arr) {
            if (arr.length === 1) {
                return [arr[0]];
            } else {
                return arr.slice(0);
            }
        },

        getCount: function (obj) {
            if (Bridge.isArray(obj)) {
                return obj.length;
            } else if (Bridge.isFunction(obj.getCount)) {
                return obj.getCount();
            }

            return 0;
        },

        add: function (obj, item) {
            if (Bridge.isArray(obj)) {
                obj.push(item);
            } else if (Bridge.isFunction(obj.add)) {
                obj.add(item);
            }
        },

        clear: function (obj) {
            if (Bridge.isArray(obj)) {
                obj.length = 0;
            } else if (Bridge.isFunction(obj.clear)) {
                obj.clear();
            }
        },

        fill: function (dst, val, index, count) {
            if (index < 0 || count < 0 || (index + count) > dst.length) {
                throw new Bridge.ArgumentException();
            }

            var isFn = Bridge.isFunction(val);

            while (--count >= 0) {
                dst[index + count] = isFn ? val() : val;
            }
        },

        copy: function (src, spos, dst, dpos, len) {
            if (spos < 0 || dpos < 0 || len < 0) {
                throw new Bridge.ArgumentOutOfRangeException();
            }

            if (len > (src.length - spos) || len > (dst.length - dpos)) {
                throw new Bridge.ArgumentException();
            }

            if (spos < dpos && src === dst) {
                while (--len >= 0) {
                    dst[dpos + len] = src[spos + len];
                }
            } else {
                for (var i = 0; i < len; i++) {
                    dst[dpos + i] = src[spos + i];
                }
            }
        },

        indexOf: function (arr, item) {
            if (Bridge.isArray(arr)) {
                var i,
                    ln,
                    el;

                for (i = 0, ln = arr.length; i < ln; i++) {
                    el = arr[i];

                    if (el === item || Bridge.EqualityComparer$1.$default.equals(el, item)) {
                        return i;
                    }
                }
            } else if (Bridge.isFunction(arr.indexOf)) {
                return arr.indexOf(item);
            }

            return -1;
        },

        contains: function (obj, item) {
            if (Bridge.isArray(obj)) {
                return Bridge.Array.indexOf(obj, item) > -1;
            } else if (Bridge.isFunction(obj.contains)) {
                return obj.contains(item);
            }

            return false;
        },

        remove: function (obj, item) {
            if (Bridge.isArray(obj)) {
                var index = Bridge.Array.indexOf(obj, item);

                if (index > -1) {
                    obj.splice(index, 1);

                    return true;
                }
            } else if (Bridge.isFunction(obj.remove)) {
                return obj.remove(item);
            }

            return false;
        },

        insert: function (obj, index, item) {
            if (Bridge.isArray(obj)) {
                obj.splice(index, 0, item);
            } else if (Bridge.isFunction(obj.insert)) {
                 obj.insert(index, item);
            }
        },

        removeAt: function (obj, index) {
            if (Bridge.isArray(obj)) {
                obj.splice(index, 1);
            } else if (Bridge.isFunction(obj.removeAt)) {
                obj.removeAt(index);
            }
        },

        getItem: function (obj, idx) {
            if (Bridge.isArray(obj)) {
                return obj[idx];
            } else if (Bridge.isFunction(obj.get)) {
                return obj.get(idx);
            } else if (Bridge.isFunction(obj.getItem)) {
                return obj.getItem(idx);
            } else if (Bridge.isFunction(obj.get_Item)) {
                return obj.get_Item(idx);
            }
        },

        setItem: function (obj, idx, value) {
            if (Bridge.isArray(obj)) {
                obj[idx] = value;
            } else if (Bridge.isFunction(obj.set)) {
                obj.set(idx, value);
            } else if (Bridge.isFunction(obj.setItem)) {
                obj.setItem(idx, value);
            } else if (Bridge.isFunction(obj.set_Item)) {
                obj.set_Item(idx, value);
            }
        },

        resize: function (arr, newSize, val) {
            if (newSize < 0) {
                throw new Bridge.ArgumentOutOfRangeException("newSize", null, null, newSize);
            }

            var oldSize = 0,
                isFn = Bridge.isFunction(val);

            if (!arr) {
                arr = new Array(newSize);
            } else {
                oldSize = arr.length;
                arr.length = newSize;
            }

            for (var i = oldSize; i < newSize; i++) {
                arr[i] = isFn ? val() : val;
            }
        },

        reverse: function (arr, index, length) {
            if (!array) {
                throw new Bridge.ArgumentNullException("arr");
            }

            if (!index && index !== 0) {
                index = 0;
                length = arr.length;
            }

            if (index < 0 || length < 0) {
                throw new Bridge.ArgumentOutOfRangeException((index < 0 ? "index" : "length"), "Non-negative number required.");
            }

            if ((array.length - index) < length) {
                throw new Bridge.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
            }

            if (Bridge.Array.getRank(arr) !== 1) {
                throw new Bridge.Exception("Only single dimension arrays are supported here.");
            }
 
            var i = index,
                j = index + length - 1;

            while (i < j) {
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
                j--;
            }
        },

        binarySearch: function (array, index, length,value, comparer) {
            if (!array) {
                throw new Bridge.ArgumentNullException("array");
            }
            
            var lb = 0;
            if (index < lb || length < 0) {
                throw new Bridge.ArgumentOutOfRangeException(index < lb ? "index" : "length", "Non-negative number required.");
            }

            if (array.length - (index - lb) < length) {
                throw new Bridge.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
            }

            if (Bridge.Array.getRank(array) !== 1) {
                throw new Bridge.RankException("Only single dimensional arrays are supported for the requested action.");
            }

            if (!comparer) {
                comparer = Bridge.Comparer$1.$default;
            }
 
            var lo = index,
                hi = index + length - 1,
                i,
                c;

            while (lo <= hi) {
                i = lo + ((hi - lo) >> 1);
 
                try {
                    c = comparer.compare(array[i], value);
                }
                catch (e) {
                    throw new Bridge.InvalidOperationException("Failed to compare two elements in the array.", e);
                }

                if (c === 0) {
                    return i;
                }

                if (c < 0) {
                    lo = i + 1;
                }
                else {
                    hi = i - 1;
                }
            }

            return ~lo;
        },

        sort: function (array, index, length, comparer) {
            if (!array) {
                throw new Bridge.ArgumentNullException("array");
            }

            if (arguments.length === 2 && typeof index === "object") {
                comparer = index;
                index = null;
            }

            if (!Bridge.isNumber(index)) {
                index = 0;
            }

            if (!Bridge.isNumber(length)) {
                length = array.length;
            }

            if (!comparer) {
                comparer = Bridge.Comparer$1.$default;
            }

            if (index === 0 && length === array.length) {
                array.sort(Bridge.fn.bind(comparer, comparer.compare));
            } else {
                var newarray = array.slice(index, index + length);
                newarray.sort(Bridge.fn.bind(comparer, comparer.compare));

                for (var i = index; i < (index + length); i++) {
                    array[i] = newarray[i-index];
                }
            }
        },

        min: function(arr, minValue) {
            var min = arr[0],
                len = arr.length;
            for (var i = 0; i < len; i++) {
                if ((arr[i] < min || min < minValue) && !(arr[i] < minValue)) {
                    min = arr[i];
                }
            }
            return min;
        },

        max: function (arr, maxValue) {
            var max =  arr[0],
                len = arr.length;
            for (var i = 0; i < len; i++) {
                if ((arr[i] > max || max > maxValue) && !(arr[i] > maxValue)) {
                    max = arr[i];
                }
            }
            return max;
        },

        addRange: function (arr, items) {
            if (Bridge.isArray(items)) {
                arr.push.apply(arr, items);
            }
            else {
                var e = Bridge.getEnumerator(items);
                try {
                    while (e.moveNext()) {
                        arr.push(e.getCurrent());
                    }
                }
                finally {
                    if (Bridge.is(e, Bridge.IDisposable)) {
                        e.dispose();
                    }
                }
            }
        }
    };

    Bridge.Array = array;

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, instance) {
            var length = this.length;
            var mapped = new Array(length);
            for (var i = 0; i < length; i++) {
                if (i in this) {
                    mapped[i] = callback.call(instance, this[i], i, this);
                }
            }
            return mapped;
        };
    }
        
    if (!Array.prototype.some) {
        Array.prototype.some = function (callback, instance) {
            var length = this.length;
            for (var i = 0; i < length; i++) {
                if (i in this && callback.call(instance, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
     }
 
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var k;

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var O = Object(this);

            var len = O.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }

            if (n >= len) {
                return -1;
            }

            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }
// @source /Collections/Interfaces.js

Bridge.define('Bridge.IEnumerable');
Bridge.define('Bridge.IEnumerator');
Bridge.define('Bridge.IEqualityComparer');
Bridge.define('Bridge.ICollection', {
    inherits: [Bridge.IEnumerable]
});

Bridge.Class.generic('Bridge.IEnumerator$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.IEnumerator$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IEnumerator]
    }));
});

Bridge.Class.generic('Bridge.IEnumerable$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.IEnumerable$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IEnumerable]
    }));
});

Bridge.Class.generic('Bridge.ICollection$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.ICollection$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IEnumerable$1(T)]
    }));
});

Bridge.Class.generic('Bridge.IEqualityComparer$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.IEqualityComparer$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
    }));
});

Bridge.Class.generic('Bridge.IDictionary$2', function (TKey, TValue) {
    var $$name = Bridge.Class.genericName('Bridge.IDictionary$2', TKey, TValue);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IEnumerable$1(Bridge.KeyValuePair$2(TKey, TValue))]
    }));
});

Bridge.Class.generic('Bridge.IList$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.IList$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.ICollection$1(T)]
    }));
});

Bridge.Class.generic('Bridge.IComparer$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.IComparer$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
    }));
});

Bridge.Class.generic('Bridge.ISet$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.ISet$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.ICollection$1(T)]
    }));
});
// @source /Collections/CustomEnumerator.js

Bridge.define('Bridge.CustomEnumerator', {
    inherits: [Bridge.IEnumerator],

    constructor: function (moveNext, getCurrent, reset, dispose, scope) {
        this.$moveNext = moveNext;
        this.$getCurrent = getCurrent;
        this.$dispose = dispose;
        this.$reset = reset;
        this.scope = scope;
    },

    moveNext: function () {
        try {
            return this.$moveNext.call(this.scope);
        }
        catch (ex) {
            this.dispose.call(this.scope);

            throw ex;
        }
    },

    getCurrent: function () {
        return this.$getCurrent.call(this.scope);
    },

    getCurrent$1: function () {
        return this.$getCurrent.call(this.scope);
    },

    reset: function () {
        if (this.$reset) {
            this.$reset.call(this.scope);
        }
    },

    dispose: function () {
        if (this.$dispose) {
            this.$dispose.call(this.scope);
        }
    }
});

// @source /Collections/ArrayEnumerator.js

Bridge.define('Bridge.ArrayEnumerator', {
    inherits: [Bridge.IEnumerator],

    constructor: function (array) {
        this.array = array;
        this.reset();
    },
    
    moveNext: function () {
        this.index++;

        return this.index < this.array.length;
    },

    getCurrent: function () {
        return this.array[this.index];
    },

    getCurrent$1: function () {
        return this.array[this.index];
    },

    reset: function () {
        this.index = -1;
    },

    dispose: Bridge.emptyFn
});

Bridge.define('Bridge.ArrayEnumerable', {
    inherits: [Bridge.IEnumerable],
    constructor: function (array) {
        this.array = array;
    },

    getEnumerator: function () {
        return new Bridge.ArrayEnumerator(this.array);
    }
});
// @source /Collections/Comparer.js

Bridge.Class.generic('Bridge.EqualityComparer$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.EqualityComparer$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IEqualityComparer$1(T)],

        equals: function (x, y) {
            if (!Bridge.isDefined(x, true)) {
                return !Bridge.isDefined(y, true);
            } else if (Bridge.isDefined(y, true)) {
                var isBridge = x && x.$$name;

                if (!isBridge) {
                    return Bridge.equals(x, y);
                }
                else if (Bridge.isFunction(x.equalsT)) {
                    return Bridge.equalsT(x, y);
                }
                else if (Bridge.isFunction(x.equals)) {
                    return Bridge.equals(x, y);
                }

                return x === y;
            }

            return false;
        },

        getHashCode: function (obj) {
            return Bridge.isDefined(obj, true) ? Bridge.getHashCode(obj) : 0;
        }
    }));
});

Bridge.EqualityComparer$1.$default = new Bridge.EqualityComparer$1(Object)();

Bridge.Class.generic('Bridge.Comparer$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.Comparer$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IComparer$1(T)],

        constructor: function (fn) {
            this.fn = fn;
            this.compare = fn;
        }
    }));
});

Bridge.Comparer$1.$default = new Bridge.Comparer$1(Object)(function (x, y) {
    if (!Bridge.hasValue(x)) {
        return !Bridge.hasValue(y) ? 0 : -1;
    } else if (!Bridge.hasValue(y)) {
        return 1;
    }

    return Bridge.compare(x, y);
});
// @source /Collections/Dictionary.js

Bridge.Class.generic('Bridge.KeyValuePair$2', function (TKey, TValue) {
    var $$name = Bridge.Class.genericName('Bridge.KeyValuePair$2', TKey, TValue);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        constructor: function (key, value) {
            this.key = key;
            this.value = value;
        },

        toString: function() {
            var s = "[";
            
            if (this.key != null) {
                s += this.key.toString();
            }

            s += ", ";

            if (this.value != null) {
                s += this.value.toString();
            }

            s += "]";

            return s;
        }
    }));
});

Bridge.Class.generic('Bridge.Dictionary$2', function (TKey, TValue) {
    var $$name = Bridge.Class.genericName('Bridge.Dictionary$2', TKey, TValue);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.IDictionary$2(TKey, TValue)],

        constructor: function (obj, comparer) {
            this.comparer = comparer || Bridge.EqualityComparer$1.$default;
            this.clear();

            if (Bridge.is(obj, Bridge.Dictionary$2(TKey, TValue))) {
                var e = Bridge.getEnumerator(obj),
                    c;

                while (e.moveNext()) {
                    c = e.getCurrent();
                    this.add(c.key, c.value);
                }
            } else if (Object.prototype.toString.call(obj) === '[object Object]') {
                var names = Bridge.getPropertyNames(obj),
                    name;

                for (var i = 0; i < names.length; i++) {
                    name = names[i];
                    this.add(name, obj[name]);
                }
            }
        },

        getKeys: function () {
            return new Bridge.DictionaryCollection$1(TKey)(this, true);
        },

        getValues: function () {
            return new Bridge.DictionaryCollection$1(TValue)(this, false);
        },

        clear: function () {
            this.entries = { };
            this.count = 0;
        },

        findEntry: function (key) {
            var hash = this.comparer.getHashCode(key),
                entries,
                i;

            if (Bridge.isDefined(this.entries[hash])) {
                entries = this.entries[hash];

                for (i = 0; i < entries.length; i++) {
                    if (this.comparer.equals(entries[i].key, key)) {
                        return entries[i];
                    }
                }
            }
        },

        containsKey: function (key) {
            return !!this.findEntry(key);
        },

        containsValue: function (value) {
            var e, i;

            for (e in this.entries) {
                if (this.entries.hasOwnProperty(e)) {
                    var entries = this.entries[e];

                    for (i = 0; i < entries.length; i++) {
                        if (this.comparer.equals(entries[i].value, value)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        get: function (key) {
            var entry = this.findEntry(key);

            if (!entry) {
                throw new Bridge.KeyNotFoundException('Key ' + key + ' does not exist.');
            }

            return entry.value;
        },

        getItem: function (key) {
            return this.get(key);
        },

        set: function (key, value, add) {
            var entry = this.findEntry(key),
                hash;

            if (entry) {
                if (add) {
                    throw new Bridge.ArgumentException('Key ' + key + ' already exists.');
                }

                entry.value = value;
                return;
            }

            hash = this.comparer.getHashCode(key);
            entry = new Bridge.KeyValuePair$2(TKey, TValue)(key, value);

            if (this.entries[hash]) {
                this.entries[hash].push(entry);
            } else {
                this.entries[hash] = [entry];
            }

            this.count++;
        },

        setItem: function (key, value, add) {
            this.set(key, value, add);
        },

        add: function (key, value) {
            this.set(key, value, true);
        },

        remove: function (key) {
            var hash = this.comparer.getHashCode(key),
                entries,
                i;

            if (!this.entries[hash]) {
                return false;
            }

            entries = this.entries[hash];

            for (i = 0; i < entries.length; i++) {
                if (this.comparer.equals(entries[i].key, key)) {
                    entries.splice(i, 1);

                    if (entries.length == 0) {
                        delete this.entries[hash];
                    }

                    this.count--;

                    return true;
                }
            }

            return false;
        },

        getCount: function () {
            return this.count;
        },

        getComparer: function () {
            return this.comparer;
        },

        tryGetValue: function (key, value) {
            var entry = this.findEntry(key);

            value.v = entry ? entry.value : Bridge.getDefaultValue(TValue);

            return !!entry;
        },

        getCustomEnumerator: function (fn) {
            var hashes = Bridge.getPropertyNames(this.entries),
                hashIndex = -1,
                keyIndex;

            return new Bridge.CustomEnumerator(function () {
                if (hashIndex < 0 || keyIndex >= (this.entries[hashes[hashIndex]].length - 1)) {
                    keyIndex = -1;
                    hashIndex++;
                }

                if (hashIndex >= hashes.length) {
                    return false;
                }

                keyIndex++;

                return true;
            }, function () {
                return fn(this.entries[hashes[hashIndex]][keyIndex]);
            }, function () {
                hashIndex = -1;
            }, null, this);
        },

        getEnumerator: function () {
            return this.getCustomEnumerator(function (e) {
                 return e;
            });
        }
    }));
});

Bridge.Class.generic('Bridge.DictionaryCollection$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.DictionaryCollection$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.ICollection$1(T)],

        constructor: function (dictionary, keys) {
            this.dictionary = dictionary;
            this.keys = keys;
        },

        getCount: function () {
            return this.dictionary.getCount();
        },

        getEnumerator: function () {
            return this.dictionary.getCustomEnumerator(this.keys ? function (e) {
                return e.key;
            } : function (e) {
                return e.value;
            });
        },

        contains: function (value) {
            return this.keys ? this.dictionary.containsKey(value) : this.dictionary.containsValue(value);
        },

        add: function (v) {
            throw new Bridge.NotSupportedException();
        },

        clear: function () {
            throw new Bridge.NotSupportedException();
        },

        remove: function () {
            throw new Bridge.NotSupportedException();
        }
    }));
});

// @source /Collections/List.js

Bridge.Class.generic('Bridge.List$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.List$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.ICollection$1(T), Bridge.ICollection, Bridge.IList$1(T)],
        constructor: function (obj) {
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                this.items = Bridge.Array.clone(obj);
            } else if (Bridge.is(obj, Bridge.IEnumerable)) {
                this.items = Bridge.toArray(obj);
            } else {
                this.items = [];
            }
        },

        checkIndex: function (index) {
            if (index < 0 || index > (this.items.length - 1)) {
                throw new Bridge.ArgumentOutOfRangeException('Index out of range');
            }
        },

        getCount: function () {
            return this.items.length;
        },

        get: function (index) {
            this.checkIndex(index);

            return this.items[index];
        },

        getItem: function (index) {
            return this.get(index);
        },

        set: function (index, value) {
            this.checkReadOnly();
            this.checkIndex(index);
            this.items[index] = value;
        },

        setItem: function (index, value) {
            this.set(index, value);
        },

        add: function (value) {
            this.checkReadOnly();
            this.items.push(value);
        },

        addRange: function (items) {
            this.checkReadOnly();

            var array = Bridge.toArray(items),
                i,
                len;

            for (i = 0, len = array.length; i < len; ++i) {
                this.items.push(array[i]);
            }
        },

        clear: function () {
            this.checkReadOnly();
            this.items = [];
        },

        indexOf: function (item, startIndex) {
            var i, el;

            if (!Bridge.isDefined(startIndex)) {
                startIndex = 0;
            }

            if (startIndex !== 0) {
                this.checkIndex(startIndex);
            }

            for (i = startIndex; i < this.items.length; i++) {
                el = this.items[i];

                if (el === item || Bridge.EqualityComparer$1.$default.equals(el, item)) {
                    return i;
                }
            }

            return -1;
        },

        insertRange: function (index, items) {
            this.checkReadOnly();

            if (index !== this.items.length) {
                this.checkIndex(index);
            }

            var array = Bridge.toArray(items);

            for (var i = 0; i < array.length; i++) {
                this.insert(index++, array[i]);
            }
        },

        contains: function (item) {
            return this.indexOf(item) > -1;
        },

        getEnumerator: function () {
            return new Bridge.ArrayEnumerator(this.items);
        },

        getRange: function (index, count) {
            if (!Bridge.isDefined(index)) {
                index = 0;
            }

            if (!Bridge.isDefined(count)) {
                count = this.items.length;
            }

            if (index !== 0) {
                this.checkIndex(index);
            }

            this.checkIndex(index + count - 1);

            var result = [],
                i,
				maxIndex = index + count;
				
            for (i = index; i < maxIndex; i++) {
                result.push(this.items[i]);
            }

            return new Bridge.List$1(T)(result);
        },

        insert: function (index, item) {
            this.checkReadOnly();

            if (index !== this.items.length) {
                this.checkIndex(index);
            }

            if (Bridge.isArray(item)) {
                for (var i = 0; i < item.length; i++) {
                    this.insert(index++, item[i]);
                }
            } else {
                this.items.splice(index, 0, item);
            }
        },

        join: function (delimeter) {
            return this.items.join(delimeter);
        },

        lastIndexOf: function (item, fromIndex) {
            if (!Bridge.isDefined(fromIndex)) {
                fromIndex = this.items.length - 1;
            }

            if (fromIndex !== 0) {
                this.checkIndex(fromIndex);
            }

            for (var i = fromIndex; i >= 0; i--) {
                if (item === this.items[i]) {
                    return i;
                }
            }

            return -1;
        },

        remove: function (item) {
            this.checkReadOnly();

            var index = this.indexOf(item);

            if (index < 0) {
                return false;
            }

            this.checkIndex(index);
            this.items.splice(index, 1);
            return true;
        },

        removeAt: function (index) {
            this.checkReadOnly();
            this.checkIndex(index);
            this.items.splice(index, 1);
        },

        removeRange: function (index, count) {
            this.checkReadOnly();
            this.checkIndex(index);
            this.items.splice(index, count);
        },

        reverse: function () {
            this.checkReadOnly();
            this.items.reverse();
        },

        slice: function (start, end) {
            this.checkReadOnly();

            return new Bridge.List$1(this.$$name.substr(this.$$name.lastIndexOf('$')+1))(this.items.slice(start, end));
        },

        sort: function (comparison) {
            this.checkReadOnly();
            this.items.sort(comparison || Bridge.Comparer$1.$default.compare);
        },

        splice: function (start, count, items) {
            this.checkReadOnly();
            this.items.splice(start, count, items);
        },

        unshift: function () {
            this.checkReadOnly();
            this.items.unshift();
        },

        toArray: function () {
            return Bridge.toArray(this);
        },

        checkReadOnly: function () {
            if (this.readOnly) {
                throw new Bridge.NotSupportedException();
            }
        },

        binarySearch: function (index, length, value, comparer) {
            if (arguments.length === 1) {
                value = index;
                index = null;
            }

            if (arguments.length === 2) {
                value = index;
                comparer = length;
                index = null;
                length = null;
            }

            if (!Bridge.isNumber(index)) {
                index = 0;
            }

            if (!Bridge.isNumber(length)) {
                length = this.items.length;
            }

            if (!comparer) {
                comparer = Bridge.Comparer$1.$default;
            }

            return Bridge.Array.binarySearch(this.items, index, length, value, comparer);
        },

        convertAll: function (TOutput, converter) {
            if (!Bridge.hasValue(converter)) {
                throw new Bridge.ArgumentNullException("converter is null.");
            }

            var list = new Bridge.List$1(TOutput)(this.items.length);
            for (var i = 0; i < this.items.length; i++) {
                list.items[i] = converter(this.items[i]);
            }

            return list;
        }
    }));
});

Bridge.Class.generic('Bridge.ReadOnlyCollection$1', function (T) {
    var $$name = Bridge.Class.genericName('Bridge.ReadOnlyCollection$1', T);

    return Bridge.Class.cache[$$name] || (Bridge.Class.cache[$$name] = Bridge.define($$name, {
        inherits: [Bridge.List$1(T)],
        constructor: function (list) {
            if (list == null) {
                throw new Bridge.ArgumentNullException("list");
            }

            Bridge.List$1(T).prototype.$constructor.call(this, list);
            this.readOnly = true;
        }
    }));
});

    // @source Task.js

    Bridge.define("Bridge.Task", {
        inherits: [Bridge.IDisposable],
        constructor: function (action, state) {
            this.action = action;
            this.state = state;
            this.exception = null;
            this.status = Bridge.TaskStatus.created;
            this.callbacks = [];
            this.result = null;
        },

        statics: {
            delay: function (delay, state) {
                var tcs = new Bridge.TaskCompletionSource();

                setTimeout(function () {
                    tcs.setResult(state);
                }, delay);

                return tcs.task;
            },

            fromResult: function (result) {
                var t = new Bridge.Task();

                t.status = Bridge.TaskStatus.ranToCompletion;
                t.result = result;

                return t;
            },

            run: function (fn) {
                var tcs = new Bridge.TaskCompletionSource();

                setTimeout(function () {
                    try {
                        tcs.setResult(fn());
                    } catch (e) {
                        tcs.setException(Bridge.Exception.create(e));
                    }
                }, 0);

                return tcs.task;
            },

            whenAll: function (tasks) {
                var tcs = new Bridge.TaskCompletionSource(),
                    result,
                    executing,
                    cancelled = false,
                    exceptions = [],
                    i;

                if (Bridge.is(tasks, Bridge.IEnumerable)) {
                    tasks = Bridge.toArray(tasks);
                }
                else if (!Bridge.isArray(tasks)) {
                    tasks = Array.prototype.slice.call(arguments, 0);
                }

                if (tasks.length === 0) {
                    tcs.setResult([]);
                    return tcs.task;
                }

                executing = tasks.length;
                result = new Array(tasks.length);

                for (i = 0; i < tasks.length; i++) {
                    (function(i) {
                        tasks[i].continueWith(function (t) {
                            switch (t.status) {
                                case Bridge.TaskStatus.ranToCompletion:
                                    result[i] = t.getResult();
                                    break;
                                case Bridge.TaskStatus.canceled:
                                    cancelled = true;
                                    break;
                                case Bridge.TaskStatus.faulted:
                                    Bridge.Array.addRange(exceptions, t.exception.innerExceptions);
                                    break;
                                default:
                                    throw new Bridge.InvalidOperationException("Invalid task status: " + t.status);
                            }

                            if (--executing === 0) {
                                if (exceptions.length > 0) {
                                    tcs.setException(exceptions);
                                } else if (cancelled) {
                                    tcs.setCanceled();
                                } else {
                                    tcs.setResult(result);
                                }
                            }
                        });
                    })(i);
                }

                return tcs.task;
            },

            whenAny: function (tasks) {
                if (Bridge.is(tasks, Bridge.IEnumerable)) {
                    tasks = Bridge.toArray(tasks);
                }
                else if (!Bridge.isArray(tasks)) {
                    tasks = Array.prototype.slice.call(arguments, 0);
                }

                if (!tasks.length) {
                    throw new Bridge.ArgumentException("At least one task is required");
                }

                var tcs = new Bridge.TaskCompletionSource(),
                    i;

                for (i = 0; i < tasks.length; i++) {
                    tasks[i].continueWith(function (t) {
                        switch (t.status) {
                            case Bridge.TaskStatus.ranToCompletion:
                                tcs.trySetResult(t);
                                break;
                            case Bridge.TaskStatus.canceled:
                                tcs.trySetCanceled();
                                break;
                            case Bridge.TaskStatus.faulted:
                                tcs.trySetException(t.exception.innerExceptions);
                                break;
                            default:
                                throw new Bridge.InvalidOperationException("Invalid task status: " + t.status);
                        }
                    });
                }

                return tcs.task;
            },

            fromCallback: function (target, method) {
                var tcs = new Bridge.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 2),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                args.push(callback);

                target[method].apply(target, args);

                return tcs.task;
            },

            fromCallbackResult: function (target, method, resultHandler) {
                var tcs = new Bridge.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 3),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                resultHandler(args, callback);

                target[method].apply(target, args);

                return tcs.task;
            },

            fromCallbackOptions: function (target, method, name) {
                var tcs = new Bridge.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 3),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                args[0] = args[0] || { };
                args[0][name] = callback;

                target[method].apply(target, args);

                return tcs.task;
            },

            fromPromise: function (promise, handler, errorHandler) {
                var tcs = new Bridge.TaskCompletionSource();

                if (!promise.then) {
                    promise = promise.promise();
                }

                if (typeof (handler) === 'number') {
                    handler = (function (i) { return function () { return arguments[i >= 0 ? i : (arguments.length + i)]; }; })(handler);
                }
                else if (typeof (handler) !== 'function') {
                    handler = function () { return Array.prototype.slice.call(arguments, 0); };
                }

                promise.then(function () {
                    tcs.setResult(handler ? handler.apply(null, arguments) : Array.prototype.slice.call(arguments, 0));
                }, function () {
                    tcs.setException(errorHandler ? errorHandler.apply(null, arguments) : new Bridge.PromiseException(Array.prototype.slice.call(arguments, 0)));
                });

                return tcs.task;
            }
        },

        continueWith: function (continuationAction, raise) {
            var tcs = new Bridge.TaskCompletionSource(),
                me = this,
                fn = raise ? function () {
                    tcs.setResult(continuationAction(me));
                } : function () {
                    try {
                        tcs.setResult(continuationAction(me));
                    }
                    catch (e) {
                        tcs.setException(Bridge.Exception.create(e));
                    }
                };

            if (this.isCompleted()) {
                setTimeout(fn, 0);
            } else {
                this.callbacks.push(fn);
            }

            return tcs.task;
        },

        start: function () {
            if (this.status !== Bridge.TaskStatus.created) {
                throw new Bridge.InvalidOperationException("Task was already started.");
            }

            var me = this;

            this.status = Bridge.TaskStatus.running;

            setTimeout(function () {
                try {
                    var result = me.action(me.state);
                    delete me.action;
                    delete me.state;
                    me.complete(result);
                } catch (e) {
                    me.fail(new Bridge.AggregateException(null, [Bridge.Exception.create(e)]));
                }
            }, 0);
        },

        runCallbacks: function () {
            var me = this;

            setTimeout(function () {
                for (var i = 0; i < me.callbacks.length; i++) {
                    me.callbacks[i](me);
                }

                delete me.callbacks;
            }, 0);
        },

        complete: function (result) {
            if (this.isCompleted()) {
                return false;
            }

            this.result = result;
            this.status = Bridge.TaskStatus.ranToCompletion;
            this.runCallbacks();

            return true;
        },

        fail: function (error) {
            if (this.isCompleted()) {
                return false;
            }

            this.exception = error;
            this.status = Bridge.TaskStatus.faulted;
            this.runCallbacks();

            return true;
        },

        cancel: function () {
            if (this.isCompleted()) {
                return false;
            }

            this.status = Bridge.TaskStatus.canceled;
            this.runCallbacks();

            return true;
        },

        isCanceled: function () {
            return this.status === Bridge.TaskStatus.canceled;
        },

        isCompleted: function () {
            return this.status === Bridge.TaskStatus.ranToCompletion || this.status === Bridge.TaskStatus.canceled || this.status === Bridge.TaskStatus.faulted;
        },

        isFaulted: function () {
            return this.status === Bridge.TaskStatus.faulted;
        },

        _getResult: function (awaiting) {
            switch (this.status) {
                case Bridge.TaskStatus.ranToCompletion:
                    return this.result;
                case Bridge.TaskStatus.canceled:
                    var ex = new Bridge.TaskCanceledException(null, this);
                    throw awaiting ? ex : new Bridge.AggregateException(null, [ex]);
                case Bridge.TaskStatus.faulted:
                    throw awaiting ? (this.exception.innerExceptions.getCount() > 0 ? this.exception.innerExceptions.get(0) : null) : this.exception;
                default:
                    throw new Bridge.InvalidOperationException("Task is not yet completed.");
            }
        },

        getResult: function () {
            return this._getResult(false);
        },

        dispose: function () {
        },

        getAwaiter: function () {
            return this;
        },

        getAwaitedResult: function () {
            return this._getResult(true);
        }
    });

    Bridge.define("Bridge.TaskStatus", {
        $enum: true,
        $statics: {
            created: 0,
            waitingForActivation: 1,
            waitingToRun: 2,
            running: 3,
            waitingForChildrenToComplete: 4,
            ranToCompletion: 5,
            canceled: 6,
            faulted: 7
        }
    });


    Bridge.define("Bridge.TaskCompletionSource", {
        constructor: function() {
            this.task = new Bridge.Task();
            this.task.status = Bridge.TaskStatus.running;
        },

        setCanceled: function () {
            if (!this.task.cancel()) {
                throw new Bridge.InvalidOperationException("Task was already completed.");
            }
        },

        setResult: function(result) {
            if (!this.task.complete(result)) {
                throw new Bridge.InvalidOperationException("Task was already completed.");
            }
        },

        setException: function(exception) {
            if (!this.trySetException(exception)) {
                throw new Bridge.InvalidOperationException("Task was already completed.");
            }
        },

        trySetCanceled: function() {
            return this.task.cancel();
        },

        trySetResult: function(result) {
            return this.task.complete(result);
        },

        trySetException: function(exception) {
            if (Bridge.is(exception, Bridge.Exception)) {
                exception = [exception];
            }
                
            return this.task.fail(new Bridge.AggregateException(null, exception));
        }
    });

    Bridge.define("Bridge.CancellationToken", {
         constructor: function (source) {
            if (!Bridge.is(source, Bridge.CancellationTokenSource)) {
                source = source ? Bridge.CancellationToken.sourceTrue : Bridge.CancellationToken.sourceFalse;
            }
                
            this.source = source;
        },

        getCanBeCanceled: function () {
            return !this.source.uncancellable;
        },

        getIsCancellationRequested: function () {
            return this.source.isCancellationRequested;
        },

        throwIfCancellationRequested: function () {
            if (this.source.isCancellationRequested) {
                throw new Bridge.OperationCanceledException(this);
            }
        },

        register: function (cb, s) {
            return this.source.register(cb, s);
        },

        statics: {
            sourceTrue: {
                isCancellationRequested: true, 
                register: function(f, s) {
                    f(s); 
                    return new Bridge.CancellationTokenRegistration();
                } 
            },
            sourceFalse: {
                uncancellable: true, 
                isCancellationRequested: false, 
                register: function() {
                     return new Bridge.CancellationTokenRegistration();
                }
            },
            getDefaultValue: function () {
                return new Bridge.CancellationToken();
            }
        }
    });

    Bridge.CancellationToken.none = new Bridge.CancellationToken();

    Bridge.define("Bridge.CancellationTokenRegistration", {
        inherits: function() {
            return [Bridge.IDisposable, Bridge.IEquatable$1(Bridge.CancellationTokenRegistration)];
        },
        constructor: function (cts, o) {
            this.cts = cts;
            this.o = o;
        },

        dispose: function () {
            if (this.cts) {
                this.cts.deregister(this.o);
                this.cts = this.o = null;
            }
        },

        equalsT: function (o) {
            return this === o;
        },

        statics: {
            getDefaultValue: function () {
                return new Bridge.CancellationTokenRegistration();
            }
        }
    });

    Bridge.define("Bridge.CancellationTokenSource", {
        inherits: [Bridge.IDisposable],

        constructor: function (delay) {
            this.timeout = typeof delay === "number" && delay >= 0 ? setTimeout(Bridge.fn.bind(this, this.cancel), delay, -1) : null;
            this.isCancellationRequested = false;
            this.token = new Bridge.CancellationToken(this);
            this.handlers = [];
        },

        cancel: function (throwFirst) {
            if (this.isCancellationRequested) {
                return ;
            }

            this.isCancellationRequested = true;
            var x = [];
            var h = this.handlers;

            this.clean();

            for (var i = 0; i < h.length; i++) {
                try {
                    h[i].f(h[i].s);
                }
                catch (ex) {
                    if (throwFirst && throwFirst !== -1) {
                        throw ex;
                    }
                        
                    x.push(ex);
                }
            }
            if (x.length > 0 && throwFirst !== -1) {
                throw new Bridge.AggregateException(null, x);
            }
                
        },

        cancelAfter: function (delay) {
            if (this.isCancellationRequested) {
                return;
            }
                
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
                
            this.timeout = setTimeout(Bridge.fn.bind(this, this.cancel), delay, -1);
        },

        register: function (f, s) {
            if (this.isCancellationRequested) {
                f(s);
                return new Bridge.CancellationTokenRegistration();
            }
            else {
                var o = {f: f, s: s };
                this.handlers.push(o);
                return new Bridge.CancellationTokenRegistration(this, o);
            }
        },

        deregister: function (o) {
            var ix = this.handlers.indexOf(o);
            if (ix >= 0) {
                this.handlers.splice(ix, 1);
            }
        },

        dispose: function () {
            this.clean();
        },

        clean: function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
                
            this.timeout = null;
            this.handlers = [];

            if (this.links) {
                for (var i = 0; i < this.links.length; i++) {
                    this.links[i].dispose();
                }
                    
                this.links = null;
            }
        },

        statics: {
            createLinked: function () {
                var cts = new Bridge.CancellationTokenSource();
                cts.links = [];
                var d = Bridge.fn.bind(cts, cts.cancel);
                for (var i = 0; i < arguments.length; i++) {
                    cts.links.push(arguments[i].register(d));
                }
                return cts;
            }
        }
    });
    // @source Validation.js

    var validation = {
        isNull: function (value) {
            return !Bridge.isDefined(value, true);
        },

        isEmpty: function (value) {
            return value == null || value.length === 0 || Bridge.is(value, Bridge.ICollection) ? value.getCount() === 0 : false;
        },

        isNotEmptyOrWhitespace: function (value) {
            return Bridge.isDefined(value, true) && !(/^$|\s+/.test(value));
        },

        isNotNull: function (value) {
            return Bridge.isDefined(value, true);
        },

        isNotEmpty: function (value) {
            return !Bridge.Validation.isEmpty(value);
        },

        email: function (value) {
            var re = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;

            return re.test(value);
        },

        url: function (value) {
            var re = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:\.\d{1,3}){3})(?!(?:\.\d{1,3}){2})(?!\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
            return re.test(value);
        },

        alpha: function (value) {
            var re = /^[a-zA-Z_]+$/;

            return re.test(value);
        },

        alphaNum: function (value) {
            var re = /^[a-zA-Z_]+$/;

            return re.test(value);
        },

        creditCard: function (value, type) {
            var re,
                checksum,
                i,
                digit,
                notype= false;

            if (type === "Visa") {
                // Visa: length 16, prefix 4, dashes optional.
                re = /^4\d{3}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "MasterCard") {
                // Mastercard: length 16, prefix 51-55, dashes optional.
                re = /^5[1-5]\d{2}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "Discover") {
                // Discover: length 16, prefix 6011, dashes optional.
                re = /^6011[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "AmericanExpress") {
                // American Express: length 15, prefix 34 or 37.
                re = /^3[4,7]\d{13}$/;
            } else if (type === "DinersClub") {
                // Diners: length 14, prefix 30, 36, or 38.
                re = /^(3[0,6,8]\d{12})|(5[45]\d{14})$/;
            } else {
                // Basing min and max length on
                // http://developer.ean.com/general_info/Valid_Credit_Card_Types
                if (!value || value.length < 13 || value.length > 19) {
                    return false;
                }

                re = /[^0-9 \-]+/;
                notype = true;
            }

            if (!re.test(value)) {
                return false;
            }

            // Remove all dashes for the checksum checks to eliminate negative numbers
            value = value.split(notype ? "-" : /[- ]/).join("");

            // Checksum ("Mod 10")
            // Add even digits in even length strings or odd digits in odd length strings.
            checksum = 0;

            for (i = (2 - (value.length % 2)) ; i <= value.length; i += 2) {
                checksum += parseInt(value.charAt(i - 1));
            }

            // Analyze odd digits in even length strings or even digits in odd length strings.
            for (i = (value.length % 2) + 1; i < value.length; i += 2) {
                digit = parseInt(value.charAt(i - 1)) * 2;

                if (digit < 10) {
                    checksum += digit;
                } else {
                    checksum += (digit - 9);
                }
            }

            return (checksum % 10) === 0;
        }
    };

    Bridge.Validation = validation;

    // @source Version.js

    Bridge.define("Bridge.Version", {
        inherits: function() {
            return [Bridge.ICloneable, Bridge.IComparable$1(Bridge.Version), Bridge.IEquatable$1(Bridge.Version)];
        },

        statics: {
            separatorsArray: ".",

            config: {
                init: function() {
                    this.ZERO_CHAR_VALUE = Bridge.cast(48, Bridge.Int);
                }
            },

            appendPositiveNumber: function(num, sb) {
                var index = sb.getLength();
                var reminder;

                do {
                    reminder = num % 10;
                    num = Bridge.Int.div(num, 10);
                    sb.insert(index, String.fromCharCode(Bridge.cast((Bridge.Version.ZERO_CHAR_VALUE + reminder), Bridge.Int)));
                } while (num > 0);
            },

            parse: function(input) {
                if (input === null) {
                    throw new Bridge.ArgumentNullException("input");
                }

                var r = { v: new Bridge.Version.VersionResult() };

                r.v.init("input", true);

                if (!Bridge.Version.tryParseVersion(input, r)) {
                    throw r.v.getVersionParseException();
                }

                return r.v.m_parsedVersion;
            },

            tryParse: function(input, result) {
                var r = { v: new Bridge.Version.VersionResult() };

                r.v.init("input", false);

                var b = Bridge.Version.tryParseVersion(input, r);

                result.v = r.v.m_parsedVersion;

                return b;
            },

            tryParseVersion: function(version, result) {
                var major = {}, minor = {}, build = {}, revision = {};

                if (version === null) {
                    result.v.setFailure(Bridge.Version.ParseFailureKind.argumentNullException);
                    return false;
                }

                var parsedComponents = version.split(Bridge.Version.separatorsArray);
                var parsedComponentsLength = parsedComponents.length;

                if ((parsedComponentsLength < 2) || (parsedComponentsLength > 4)) {
                    result.v.setFailure(Bridge.Version.ParseFailureKind.argumentException);

                    return false;
                }

                if (!Bridge.Version.tryParseComponent(parsedComponents[0], "version", result, major)) {
                    return false;
                }

                if (!Bridge.Version.tryParseComponent(parsedComponents[1], "version", result, minor)) {
                    return false;
                }

                parsedComponentsLength -= 2;

                if (parsedComponentsLength > 0) {
                    if (!Bridge.Version.tryParseComponent(parsedComponents[2], "build", result, build)) {
                        return false;
                    }

                    parsedComponentsLength--;

                    if (parsedComponentsLength > 0) {
                        if (!Bridge.Version.tryParseComponent(parsedComponents[3], "revision", result, revision)) {
                            return false;
                        } else {
                            result.v.m_parsedVersion = new Bridge.Version("constructor$3", major.v, minor.v, build.v, revision.v);
                        }
                    } else {
                        result.v.m_parsedVersion = new Bridge.Version("constructor$2", major.v, minor.v, build.v);
                    }
                } else {
                    result.v.m_parsedVersion = new Bridge.Version("constructor$1", major.v, minor.v);
                }

                return true;
            },

            tryParseComponent: function(component, componentName, result, parsedComponent) {
                if (!Bridge.Int.tryParseInt(component, parsedComponent, -2147483648, 2147483647)) {
                    result.v.setFailure$1(Bridge.Version.ParseFailureKind.formatException, component);

                    return false;
                }

                if (parsedComponent.v < 0) {
                    result.v.setFailure$1(Bridge.Version.ParseFailureKind.argumentOutOfRangeException, componentName);

                    return false;
                }

                return true;
            },

            op_Equality: function(v1, v2) {
                if (v1 === null) {
                    return v2 === null;
                }

                return v1.equals(v2);
            },

            op_Inequality: function(v1, v2) {
                return !(Bridge.Version.op_Equality(v1, v2));
            },

            op_LessThan: function(v1, v2) {
                if (v1 === null && v2 === null) {
                    return false;
                }

                if (v2 === null) {
                    return (v1.compareTo(v2) < 0);
                }

                return (v2.compareTo(v1) > 0);
            },

            op_LessThanOrEqual: function(v1, v2) {
                if (v1 === null && v2 === null) {
                    return false;
                }

                if (v2 === null) {
                    return (v1.compareTo(v2) <= 0);
                }

                return (v2.compareTo(v1) >= 0);
            },

            op_GreaterThan: function(v1, v2) {
                return (Bridge.Version.op_LessThan(v2, v1));
            },

            op_GreaterThanOrEqual: function(v1, v2) {
                return (Bridge.Version.op_LessThanOrEqual(v2, v1));
            }
        },

        _Major: 0,
        _Minor: 0,

        config: {
            init: function() {
                this._Build = -1;
                this._Revision = -1;
            }
        },

        constructor$3: function(major, minor, build, revision) {
            if (major < 0) {
                throw new Bridge.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new Bridge.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            if (build < 0) {
                throw new Bridge.ArgumentOutOfRangeException("build", "Cannot be < 0");
            }

            if (revision < 0) {
                throw new Bridge.ArgumentOutOfRangeException("revision", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
            this._Build = build;
            this._Revision = revision;
        },

        constructor$2: function(major, minor, build) {
            if (major < 0) {
                throw new Bridge.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new Bridge.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            if (build < 0) {
                throw new Bridge.ArgumentOutOfRangeException("build", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
            this._Build = build;
        },

        constructor$1: function(major, minor) {
            if (major < 0) {
                throw new Bridge.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new Bridge.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
        },

        constructor$4: function(version) {
            var v = Bridge.Version.parse(version);

            this._Major = v.getMajor();
            this._Minor = v.getMinor();
            this._Build = v.getBuild();
            this._Revision = v.getRevision();
        },

        constructor: function() {
            this._Major = 0;
            this._Minor = 0;
        },

        getMajor: function() {
            return this._Major;
        },

        getMinor: function() {
            return this._Minor;
        },

        getBuild: function() {
            return this._Build;
        },

        getRevision: function() {
            return this._Revision;
        },

        getMajorRevision: function() {
            return this._Revision >> 16;
        },

        getMinorRevision: function() {
            var n = this._Revision & 65535;

            if (n > 32767) {
                n = -((n & 32767) ^ 32767) - 1;
            }

            return n;
        },

        clone: function() {
            var v = new Bridge.Version("constructor");

            v._Major = this._Major;
            v._Minor = this._Minor;
            v._Build = this._Build;
            v._Revision = this._Revision;

            return (v);
        },

        compareInternal: function(v) {
            if (this._Major !== v._Major) {
                if (this._Major > v._Major) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Minor !== v._Minor) {
                if (this._Minor > v._Minor) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Build !== v._Build) {
                if (this._Build > v._Build) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Revision !== v._Revision) {
                if (this._Revision > v._Revision) {
                    return 1;
                } else {
                    return -1;
                }
            }

            return 0;
        },

        compareTo$1: function(version) {
            if (version === null) {
                return 1;
            }

            var v = Bridge.as(version, Bridge.Version);

            if (v === null) {
                throw new Bridge.ArgumentException("version should be of Bridge.Version type");
            }

            return this.compareInternal(v);
        },

        compareTo: function(value) {
            if (value === null) {
                return 1;
            }

            return this.compareInternal(value);
        },
        equals$1: function (obj) {
            var v = Bridge.as(obj, Bridge.Version);

            if (v === null) {
                return false;
            }

            // check that major, minor, build & revision numbers match
            if ((this._Major !== v._Major) || (this._Minor !== v._Minor) || (this._Build !== v._Build) || (this._Revision !== v._Revision)) {
                return false;
            }

            return true;
        },
        equals: function(v) {
            return this.equals$1(v);
        },
        equalsT: function (v) {
            return this.equals$1(v);
        },
        getHashCode: function () {
            // Let's assume that most version numbers will be pretty small and just OR some lower order bits together.
            var accumulator = 0;

            accumulator |= (this._Major & 15) << 28;
            accumulator |= (this._Minor & 255) << 20;
            accumulator |= (this._Build & 255) << 12;
            accumulator |= (this._Revision & 4095);

            return accumulator;
        },
        toString: function () {
            if (this._Build === -1) {
                return (this.toString$1(2));
            }

            if (this._Revision === -1) {
                return (this.toString$1(3));
            }

            return (this.toString$1(4));
        },
        toString$1: function (fieldCount) {
            var sb;

            switch (fieldCount) {
                case 0:
                    return ("");
                case 1:
                    return (this._Major.toString());
                case 2:
                    sb = new Bridge.Text.StringBuilder();
                    Bridge.Version.appendPositiveNumber(this._Major, sb);
                    sb.append(String.fromCharCode(46));
                    Bridge.Version.appendPositiveNumber(this._Minor, sb);

                    return sb.toString();
                default:
                    if (this._Build === -1) {
                        throw new Bridge.ArgumentException("Build should be > 0 if fieldCount > 2", "fieldCount");
                    }

                    if (fieldCount === 3) {
                        sb = new Bridge.Text.StringBuilder();
                        Bridge.Version.appendPositiveNumber(this._Major, sb);
                        sb.append(String.fromCharCode(46));
                        Bridge.Version.appendPositiveNumber(this._Minor, sb);
                        sb.append(String.fromCharCode(46));
                        Bridge.Version.appendPositiveNumber(this._Build, sb);

                        return sb.toString();
                    }

                    if (this._Revision === -1) {
                        throw new Bridge.ArgumentException("Revision should be > 0 if fieldCount > 3", "fieldCount");
                    }

                    if (fieldCount === 4) {
                        sb = new Bridge.Text.StringBuilder();
                        Bridge.Version.appendPositiveNumber(this._Major, sb);
                        sb.append(String.fromCharCode(46));
                        Bridge.Version.appendPositiveNumber(this._Minor, sb);
                        sb.append(String.fromCharCode(46));
                        Bridge.Version.appendPositiveNumber(this._Build, sb);
                        sb.append(String.fromCharCode(46));
                        Bridge.Version.appendPositiveNumber(this._Revision, sb);

                        return sb.toString();
                    }

                    throw new Bridge.ArgumentException("Should be < 5", "fieldCount");
            }
        }
    });

    Bridge.define("Bridge.Version.ParseFailureKind", {
        statics: {
            argumentNullException: 0,
            argumentException: 1,
            argumentOutOfRangeException: 2,
            formatException: 3
        }
    });

    Bridge.define("Bridge.Version.VersionResult", {
        m_parsedVersion: null,
        m_failure: 0,
        m_exceptionArgument: null,
        m_argumentName: null,
        m_canThrow: false,
        constructor: function () {
        },

        init: function (argumentName, canThrow) {
            this.m_canThrow = canThrow;
            this.m_argumentName = argumentName;
        },

        setFailure: function (failure) {
            this.setFailure$1(failure, "");
        },

        setFailure$1: function (failure, argument) {
            this.m_failure = failure;
            this.m_exceptionArgument = argument;

            if (this.m_canThrow) {
                throw this.getVersionParseException();
            }
        },

        getVersionParseException: function () {
            switch (this.m_failure) {
                case Bridge.Version.ParseFailureKind.argumentNullException:
                    return new Bridge.ArgumentNullException(this.m_argumentName);
                case Bridge.Version.ParseFailureKind.argumentException:
                    return new Bridge.ArgumentException("VersionString");
                case Bridge.Version.ParseFailureKind.argumentOutOfRangeException:
                    return new Bridge.ArgumentOutOfRangeException(this.m_exceptionArgument, "Cannot be < 0");
                case Bridge.Version.ParseFailureKind.formatException:
                    try {
                        Bridge.Int.parseInt(this.m_exceptionArgument, -2147483648, 2147483647);
                    }
                    catch ($e) {
                        $e = Bridge.Exception.create($e);
                        var e;

                        if (Bridge.is($e, Bridge.FormatException)) {
                            e = $e;

                            return e;
                        } else if (Bridge.is($e, Bridge.OverflowException)) {
                            e = $e;

                            return e;
                        } else {
                            throw $e;
                        }
                    }
                    return new Bridge.FormatException("InvalidString");
                default:
                    return new Bridge.ArgumentException("VersionString");
            }
        },

        getHashCode: function () {
            var hash = 17;

            hash = hash * 23 + (this.m_parsedVersion == null ? 0 : Bridge.getHashCode(this.m_parsedVersion));
            hash = hash * 23 + (this.m_failure == null ? 0 : Bridge.getHashCode(this.m_failure));
            hash = hash * 23 + (this.m_exceptionArgument == null ? 0 : Bridge.getHashCode(this.m_exceptionArgument));
            hash = hash * 23 + (this.m_argumentName == null ? 0 : Bridge.getHashCode(this.m_argumentName));
            hash = hash * 23 + (this.m_canThrow == null ? 0 : Bridge.getHashCode(this.m_canThrow));

            return hash;
        },

        equals: function (o) {
            if (!Bridge.is(o, Bridge.Version.VersionResult)) {
                return false;
            }

            return Bridge.equals(this.m_parsedVersion, o.m_parsedVersion) && Bridge.equals(this.m_failure, o.m_failure) && Bridge.equals(this.m_exceptionArgument, o.m_exceptionArgument) && Bridge.equals(this.m_argumentName, o.m_argumentName) && Bridge.equals(this.m_canThrow, o.m_canThrow);
        },

        $clone: function (to) {
            var s = to || new Bridge.Version.VersionResult();

            s.m_parsedVersion = this.m_parsedVersion;
            s.m_failure = this.m_failure;
            s.m_exceptionArgument = this.m_exceptionArgument;
            s.m_argumentName = this.m_argumentName;
            s.m_canThrow = this.m_canThrow;

            return s;
        }
    });

    // @source Attribute.js

    Bridge.define("Bridge.Attribute");

    // @source INotifyPropertyChanged.js

    Bridge.define("Bridge.INotifyPropertyChanged");

    Bridge.define("Bridge.PropertyChangedEventArgs", {
        constructor: function (propertyName) {
            this.propertyName = propertyName;
        }
    });

    // @source Convert.js

    var scope = {};

    scope.convert = {
        typeCodes: {
            Empty: 0,
            Object: 1,
            DBNull: 2,
            Boolean: 3,
            Char: 4,
            SByte: 5,
            Byte: 6,
            Int16: 7,
            UInt16: 8,
            Int32: 9,
            UInt32: 10,
            Int64: 11,
            UInt64: 12,
            Single: 13,
            Double: 14,
            Decimal: 15,
            DateTime: 16,
            String: 18
        },

        toBoolean: function (value, formatProvider) {
            switch (typeof (value)) {
                case "boolean":
                    return value;

                case "number":
                    return value !== 0; // non-zero int/float value is always converted to True;

                case "string":
                    var lowCaseVal = value.toLowerCase().trim();

                    if (lowCaseVal === "true") {
                        return true;
                    } else if (lowCaseVal === "false") {
                        return false;
                    } else {
                        throw new Bridge.FormatException("String was not recognized as a valid Boolean.");
                    }

                case "object":
                    if (value == null) {
                        return false;
                    }

                    if (value instanceof Bridge.Decimal) {
                        return !value.isZero();
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            var typeCode = scope.internal.suggestTypeCode(value);
            scope.internal.throwInvalidCastEx(typeCode, scope.convert.typeCodes.Boolean);

            // try converting using IConvertible
            return scope.convert.convertToType(scope.convert.typeCodes.Boolean, value, formatProvider || null);
        },

        toChar: function (value, formatProvider, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (value instanceof Bridge.Decimal) {
                value = value.toFloat();
            }

            var type = typeof (value);
            valueTypeCode = valueTypeCode || scope.internal.suggestTypeCode(value);

            if (valueTypeCode === typeCodes.String && value == null) {
                type = "string";
            }

            if (valueTypeCode !== typeCodes.Object) {
                switch (type) {
                    case "boolean":
                        scope.internal.throwInvalidCastEx(typeCodes.Boolean, typeCodes.Char);

                    case "number":
                        var isFloatingType = scope.internal.isFloatingType(valueTypeCode);

                        if (isFloatingType || value % 1 !== 0) {
                            scope.internal.throwInvalidCastEx(valueTypeCode, typeCodes.Char);
                        }

                        scope.internal.validateNumberRange(value, typeCodes.Char, true);

                        return value;

                    case "string":
                        if (value == null) {
                            throw new Bridge.ArgumentNullException("value");
                        }

                        if (value.length !== 1) {
                            throw new Bridge.FormatException("String must be exactly one character long.");
                        }

                        return value.charCodeAt(0);
                }
            }

            if (valueTypeCode === typeCodes.Object || type === "object") {
                if (value == null) {
                    return 0;
                }

                if (Bridge.isDate(value)) {
                    scope.internal.throwInvalidCastEx(typeCodes.DateTime, typeCodes.Char);
                }
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            scope.internal.throwInvalidCastEx(valueTypeCode, scope.convert.typeCodes.Char);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCodes.Char, value, formatProvider || null);
        },

        toSByte: function (value, formatProvider, valueTypeCode) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.SByte, valueTypeCode || null);
        },

        toByte: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Byte);
        },

        toInt16: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int16);
        },

        toUInt16: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt16);
        },

        toInt32: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int32);
        },

        toUInt32: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt32);
        },

        toInt64: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int64);
        },

        toUInt64: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt64);
        },

        toSingle: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Single);
        },

        toDouble: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Double);
        },

        toDecimal: function (value, formatProvider) {
            if (value instanceof Bridge.Decimal) {
                return value;
            }

            return new Bridge.Decimal(scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Decimal));
        },

        toDateTime: function (value, formatProvider) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeof (value)) {
                case "boolean":
                    scope.internal.throwInvalidCastEx(typeCodes.Boolean, typeCodes.DateTime);

                case "number":
                    var fromType = scope.internal.suggestTypeCode(value);
                    scope.internal.throwInvalidCastEx(fromType, typeCodes.DateTime);

                case "string":
                    value = Bridge.Date.parse(value, formatProvider || null);

                    return value;

                case "object":
                    if (value == null) {
                        return scope.internal.getMinValue(typeCodes.DateTime);
                    }

                    if (Bridge.isDate(value)) {
                        return value;
                    }

                    if (value instanceof Bridge.Decimal) {
                        scope.internal.throwInvalidCastEx(typeCodes.Decimal, typeCodes.DateTime);
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            var valueTypeCode = scope.internal.suggestTypeCode(value);
            scope.internal.throwInvalidCastEx(valueTypeCode, scope.convert.typeCodes.DateTime);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCodes.DateTime, value, formatProvider || null);
        },

        toString: function (value, formatProvider, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes;
            var type = typeof (value);

            switch (type) {
                case "boolean":
                    return value ? "True" : "False";

                case "number":
                    if ((valueTypeCode || null) === typeCodes.Char) {
                        return String.fromCharCode(value);
                    }

                    if (isNaN(value)) {
                        return "NaN";
                    }

                    if (value % 1 !== 0) {
                        value = parseFloat(value.toPrecision(15));
                    }

                    return value.toString();

                case "string":
                    return value;

                case "object":
                    if (value == null) {
                        return "";
                    }

                    if (Bridge.isDate(value)) {
                        return Bridge.Date.format(value, null, formatProvider || null);
                    }

                    if (value instanceof Bridge.Decimal) {
                        if (value.isInteger()) {
                            return value.toFixed(0, 4);
                        }
                        return value.toPrecision(value.precision());
                    }

                    if (value.format) {
                        return value.format(null, formatProvider || null);
                    }

                    var typeName = Bridge.getTypeName(value);

                    return typeName;
            }

            // try converting using IConvertible
            return scope.convert.convertToType(scope.convert.typeCodes.String, value, formatProvider || null);
        },

        toNumberInBase: function (str, fromBase, typeCode) {
            if (fromBase !== 2 && fromBase !== 8 && fromBase !== 10 && fromBase !== 16) {
                throw new Bridge.ArgumentException("Invalid Base.");
            }

            if (str == null) {
                return 0;
            }

            if (str.length === 0) {
                throw new Bridge.ArgumentOutOfRangeException("Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            // Let's process the string in lower case.
            str = str.toLowerCase();

            var minValue = scope.internal.getMinValue(typeCode);
            var maxValue = scope.internal.getMaxValue(typeCode);

            // Calculate offset (start index)
            var isNegative = false;
            var startIndex = 0;

            if (str[startIndex] === "-") {
                if (fromBase !== 10) {
                    throw new Bridge.ArgumentException("String cannot contain a minus sign if the base is not 10.");
                }

                if (minValue >= 0) {
                    throw new Bridge.OverflowException("The string was being parsed as an unsigned number and could not have a negative sign.");
                }

                isNegative = true;
                ++startIndex;
            } else if (str[startIndex] === "+") {
                ++startIndex;
            }

            if (fromBase === 16 && str.length >= 2 && str[startIndex] === "0" && str[startIndex + 1] === "x") {
                startIndex += 2;
            }

            // Fill allowed codes for the specified base:
            var allowedCodes;

            if (fromBase === 2) {
                allowedCodes = scope.internal.charsToCodes("01");
            } else if (fromBase === 8) {
                allowedCodes = scope.internal.charsToCodes("01234567");
            } else if (fromBase === 10) {
                allowedCodes = scope.internal.charsToCodes("0123456789");
            } else if (fromBase === 16) {
                allowedCodes = scope.internal.charsToCodes("0123456789abcdef");
            } else {
                throw new Bridge.ArgumentException("Invalid Base.");
            }

            // Create charCode-to-Value map
            var codeValues = {};

            for (var i = 0; i < allowedCodes.length; i++) {
                var allowedCode = allowedCodes[i];
                codeValues[allowedCode] = i;
            }

            var firstAllowed = allowedCodes[0];
            var lastAllowed = allowedCodes[allowedCodes.length - 1];

            // Parse the number:
            var res = 0;
            var totalMax = maxValue - minValue + 1;

            for (var j = startIndex; j < str.length; j++) {
                var code = str[j].charCodeAt(0);

                if (code >= firstAllowed && code <= lastAllowed) {
                    res *= fromBase;
                    res += codeValues[code];

                    if (res > scope.internal.typeRanges.Int64_MaxValue_Safe) {
                        throw new Bridge.OverflowException("Value was either too large or too small. Long values are not supported.");
                    }

                } else {
                    if (j === startIndex) {
                        throw new Bridge.FormatException("Could not find any recognizable digits.");
                    } else {
                        throw new Bridge.FormatException("Additional non-parsable characters are at the end of the string.");
                    }
                }
            }

            if (isNegative) {
                res *= -1;
            }

            if (res > maxValue && fromBase !== 10 && minValue < 0) {
                // Assume that the value is negative, transform it:
                res = res - totalMax;
            }

            if (res < minValue || res > maxValue) {
                throw new Bridge.OverflowException("Value was either too large or too small.");
            }

            return res;
        },

        toStringInBase: function (value, toBase, typeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (toBase !== 2 && toBase !== 8 && toBase !== 10 && toBase !== 16) {
                throw new Bridge.ArgumentException("Invalid Base.");
            }

            var minValue = scope.internal.getMinValue(typeCode);
            var maxValue = scope.internal.getMaxValue(typeCode);

            // TODO: #778 Remove this temp solution when (U)Int64 is fully supported
            if (toBase !== 10) {
                if (typeCode === typeCodes.Int64) {
                    minValue = scope.internal.getMinValue(typeCodes.Int32);
                    maxValue = scope.internal.getMaxValue(typeCodes.Int32);
                } else if (typeCode === typeCodes.UInt64) {
                    minValue = scope.internal.getMinValue(typeCodes.UInt32);
                    maxValue = scope.internal.getMaxValue(typeCodes.UInt32);
                }
            }

            if (value < minValue || value > maxValue) {
                throw new Bridge.OverflowException("Value was either too large or too small for an unsigned byte.");
            }

            // Handle negative numbers:
            var isNegative = false;

            if (value < 0) {
                if (toBase === 10) {
                    isNegative = true;
                    value *= -1;
                } else {
                    value = (maxValue + 1 - minValue) + value;
                }
            }

            // Fill allowed codes for the specified base:
            var allowedChars;

            if (toBase === 2) {
                allowedChars = "01";
            } else if (toBase === 8) {
                allowedChars = "01234567";
            } else if (toBase === 10) {
                allowedChars = "0123456789";
            } else if (toBase === 16) {
                allowedChars = "0123456789abcdef";
            } else {
                throw new Bridge.ArgumentException("Invalid Base.");
            }

            // Fill Value-To-Char map:
            var charByValues = {};
            var allowedCharArr = allowedChars.split("");

            for (var i = 0; i < allowedCharArr.length; i++) {
                var allowedChar = allowedCharArr[i];
                charByValues[i] = allowedChar;
            }

            // Parse the number:
            var res = "";

            if (value === 0) {
                res = "0";
            } else {
                while (value > 0) {
                    var mod = value % toBase;
                    value = (value - mod) / toBase;

                    var char = charByValues[mod];
                    res += char;
                }
            }

            if (isNegative) {
                res += "-";
            }

            res = res.split("").reverse().join("");

            return res;
        },

        toBase64String: function (inArray, offset, length, options) {
            if (inArray == null) {
                throw new Bridge.ArgumentNullException("inArray");
            }

            offset = offset || 0;
            length = length != null ? length : inArray.length;
            options = options || 0; // 0 - means "None", 1 - stands for "InsertLineBreaks"

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new Bridge.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            if (options < 0 || options > 1) {
                throw new Bridge.ArgumentException("Illegal enum value.");
            }

            var inArrayLength = inArray.length;

            if (offset > (inArrayLength - length)) {
                throw new Bridge.ArgumentOutOfRangeException("offset", "Offset and length must refer to a position in the string.");
            }

            if (inArrayLength === 0) {
                return "";
            }

            var insertLineBreaks = (options === 1);
            var strArrayLen = scope.internal.toBase64_CalculateAndValidateOutputLength(length, insertLineBreaks);

            var strArray = [];
            strArray.length = strArrayLen;

            scope.internal.convertToBase64Array(strArray, inArray, offset, length, insertLineBreaks);

            var str = strArray.join("");

            return str;
        },

        toBase64CharArray: function (inArray, offsetIn, length, outArray, offsetOut, options) {
            if (inArray == null) {
                throw new Bridge.ArgumentNullException("inArray");
            }

            if (outArray == null) {
                throw new Bridge.ArgumentNullException("outArray");
            }

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offsetIn < 0) {
                throw new Bridge.ArgumentOutOfRangeException("offsetIn", "Value must be positive.");
            }

            if (offsetOut < 0) {
                throw new Bridge.ArgumentOutOfRangeException("offsetOut", "Value must be positive.");
            }

            options = options || 0;     // 0 - means "None", 1 - stands for "InsertLineBreaks"

            if (options < 0 || options > 1) {
                throw new Bridge.ArgumentException("Illegal enum value.");
            }
            var inArrayLength = inArray.length;

            if (offsetIn > inArrayLength - length) {
                throw new Bridge.ArgumentOutOfRangeException("offsetIn", "Offset and length must refer to a position in the string.");
            }

            if (inArrayLength === 0) {
                return 0;
            }

            var insertLineBreaks = options === 1;
            var outArrayLength = outArray.length;   //This is the maximally required length that must be available in the char array

            // Length of the char buffer required
            var numElementsToCopy = scope.internal.toBase64_CalculateAndValidateOutputLength(length, insertLineBreaks);

            if (offsetOut > (outArrayLength - numElementsToCopy)) {
                throw new Bridge.ArgumentOutOfRangeException("offsetOut", "Either offset did not refer to a position in the string, or there is an insufficient length of destination character array.");
            }

            var charsArr = [];
            var charsArrLength = scope.internal.convertToBase64Array(charsArr, inArray, offsetIn, length, insertLineBreaks);

            scope.internal.charsToCodes(charsArr, outArray, offsetOut);

            return charsArrLength;
        },

        fromBase64String: function (s) {
            // "s" is an unfortunate parameter name, but we need to keep it for backward compat.

            if (s == null) {
                throw new Bridge.ArgumentNullException("s");
            }

            var sChars = s.split("");
            var bytes = scope.internal.fromBase64CharPtr(sChars, 0, sChars.length);

            return bytes;
        },

        fromBase64CharArray: function (inArray, offset, length) {
            if (inArray == null) {
                throw new Bridge.ArgumentNullException("inArray");
            }

            if (length < 0) {
                throw new Bridge.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new Bridge.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            if (offset > (inArray.length - length)) {
                throw new Bridge.ArgumentOutOfRangeException("offset", "Offset and length must refer to a position in the string.");
            }

            var chars = scope.internal.codesToChars(inArray);
            var bytes = scope.internal.fromBase64CharPtr(chars, offset, length);

            return bytes;
        },

        convertToType: function (typeCode, value, formatProvider) {
            //TODO: #822 IConvertible 
            throw new Bridge.NotSupportedException("IConvertible interface is not supported.");
        }
    };

    scope.internal = {
        base64Table: [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
            "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
            "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
            "8", "9", "+", "/", "="
        ],

        typeRanges: {
            Char_MinValue: 0,
            Char_MaxValue: 65535,

            Byte_MinValue: 0,
            Byte_MaxValue: 255,

            SByte_MinValue: -128,
            SByte_MaxValue: 127,

            Int16_MinValue: -32768,
            Int16_MaxValue: 32767,

            UInt16_MinValue: 0,
            UInt16_MaxValue: 65535,

            Int32_MinValue: -2147483648,
            Int32_MaxValue: 2147483647,

            UInt32_MinValue: 0,
            UInt32_MaxValue: 4294967295,

            Int64_MinValue_Safe: -9007199254740991,
            Int64_MaxValue_Safe: 9007199254740991,

            UInt64_MinValue_Safe: 0,
            UInt64_MaxValue_Safe: 9007199254740991,

            Single_MinValue: -3.40282347e+38,
            Single_MaxValue: 3.40282347e+38,

            Double_MinValue: -1.7976931348623157e+308,
            Double_MaxValue: 1.7976931348623157e+308,

            Decimal_MinValue: -79228162514264337593543950335,
            Decimal_MaxValue: 79228162514264337593543950335
        },

        base64LineBreakPosition: 76,

        getTypeCodeName: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (scope.internal.typeCodeNames == null) {
                var names = {};

                for (var codeName in typeCodes) {
                    if (!typeCodes.hasOwnProperty(codeName)) {
                        continue;
                    }

                    var codeValue = typeCodes[codeName];

                    names[codeValue] = codeName;
                }
                scope.internal.typeCodeNames = names;
            }

            var name = scope.internal.typeCodeNames[typeCode];

            if (name == null) {
                throw Bridge.ArgumentOutOfRangeException("typeCode", "The specified typeCode is undefined.");
            }

            return name;
        },

        suggestTypeCode: function (value) {
            var typeCodes = scope.convert.typeCodes;
            var type = typeof (value);

            switch (type) {
                case "boolean":
                    return typeCodes.Boolean;

                case "number":
                    if (value % 1 !== 0)
                        return typeCodes.Double;

                    return typeCodes.Int32;

                case "string":
                    return typeCodes.String;

                case "object":
                    if (Bridge.isDate(value)) {
                        return typeCodes.DateTime;
                    }

                    if (value != null) {
                        return typeCodes.Object;
                    }

                    break;
            }
            return null;
        },

        getMinValue: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeCode) {
                case typeCodes.Char:
                    return scope.internal.typeRanges.Char_MinValue;
                case typeCodes.SByte:
                    return scope.internal.typeRanges.SByte_MinValue;
                case typeCodes.Byte:
                    return scope.internal.typeRanges.Byte_MinValue;
                case typeCodes.Int16:
                    return scope.internal.typeRanges.Int16_MinValue;
                case typeCodes.UInt16:
                    return scope.internal.typeRanges.UInt16_MinValue;
                case typeCodes.Int32:
                    return scope.internal.typeRanges.Int32_MinValue;
                case typeCodes.UInt32:
                    return scope.internal.typeRanges.UInt32_MinValue;
                case typeCodes.Int64:
                    return scope.internal.typeRanges.Int64_MinValue_Safe;
                case typeCodes.UInt64:
                    return scope.internal.typeRanges.UInt64_MinValue_Safe;
                case typeCodes.Single:
                    return scope.internal.typeRanges.Single_MinValue;
                case typeCodes.Double:
                    return scope.internal.typeRanges.Double_MinValue;
                case typeCodes.Decimal:
                    return scope.internal.typeRanges.Decimal_MinValue;
                case typeCodes.DateTime:
                    var date = new Date(0);
                    date.setFullYear(1);
                    return date;

                default:
                    return null;
            }
        },

        getMaxValue: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeCode) {
                case typeCodes.Char:
                    return scope.internal.typeRanges.Char_MaxValue;
                case typeCodes.SByte:
                    return scope.internal.typeRanges.SByte_MaxValue;
                case typeCodes.Byte:
                    return scope.internal.typeRanges.Byte_MaxValue;
                case typeCodes.Int16:
                    return scope.internal.typeRanges.Int16_MaxValue;
                case typeCodes.UInt16:
                    return scope.internal.typeRanges.UInt16_MaxValue;
                case typeCodes.Int32:
                    return scope.internal.typeRanges.Int32_MaxValue;
                case typeCodes.UInt32:
                    return scope.internal.typeRanges.UInt32_MaxValue;
                case typeCodes.Int64:
                    return scope.internal.typeRanges.Int64_MaxValue_Safe;
                case typeCodes.UInt64:
                    return scope.internal.typeRanges.UInt64_MaxValue_Safe;
                case typeCodes.Single:
                    return scope.internal.typeRanges.Single_MaxValue;
                case typeCodes.Double:
                    return scope.internal.typeRanges.Double_MaxValue;
                case typeCodes.Decimal:
                    return scope.internal.typeRanges.Decimal_MaxValue;
                default:
                    throw new Bridge.ArgumentOutOfRangeException("typeCode", "The specified typeCode is undefined.");
            }
        },

        isFloatingType: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;
            var isFloatingType =
                typeCode === typeCodes.Single ||
                typeCode === typeCodes.Double ||
                typeCode === typeCodes.Decimal;

            return isFloatingType;
        },

        toNumber: function (value, formatProvider, typeCode, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (value instanceof Bridge.Decimal) {
                value = value.toFloat();
            }

            var type = typeof (value);
            var isFloating = scope.internal.isFloatingType(typeCode);

            if (valueTypeCode === typeCodes.String) {
                type = "string";
            }

            switch (type) {
                case "boolean":
                    return value ? 1 : 0;

                case "number":
                    if (typeCode === typeCodes.Decimal) {
                        scope.internal.validateNumberRange(value, typeCode, true);

                        return new Bridge.Decimal(value, formatProvider);
                    }

                    if (!isFloating && (value % 1 !== 0)) {
                        value = scope.internal.roundToInt(value, typeCode);
                    }

                    if (isFloating) {
                        var minValue = scope.internal.getMinValue(typeCode);
                        var maxValue = scope.internal.getMaxValue(typeCode);

                        if (value > maxValue) {
                            value = Infinity;
                        } else if (value < minValue) {
                            value = -Infinity;
                        }
                    }

                    scope.internal.validateNumberRange(value, typeCode, false);
                    return value;

                case "string":
                    if (value == null) {
                        if (formatProvider != null) {
                            throw new Bridge.ArgumentNullException("String", "Value cannot be null.");
                        }

                        return 0;
                    }

                    if (isFloating) {
                        if (typeCode === typeCodes.Decimal) {
                            if (!/^[+-]?[0-9]+[.,]?[0-9]$/.test(value)) {
                                if (!/^[+-]?[0-9]+$/.test(value)) {
                                    throw new Bridge.FormatException("Input string was not in a correct format.");
                                }
                            }

                            value = Bridge.Decimal(value, formatProvider);
                        } else {
                            if (!/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(value)) {
                                throw new Bridge.FormatException("Input string was not in a correct format.");
                            }

                            value = parseFloat(value);
                        }
                    } else {
                        if (!/^[+-]?[0-9]+$/.test(value)) {
                            throw new Bridge.FormatException("Input string was not in a correct format.");
                        }

                        value = parseInt(value, 10);
                    }

                    if (isNaN(value)) {
                        throw new Bridge.FormatException("Input string was not in a correct format.");
                    }

                    scope.internal.validateNumberRange(value, typeCode, true);

                    return value;

                case "object":
                    if (value == null) {
                        return 0;
                    }

                    if (Bridge.isDate(value)) {
                        scope.internal.throwInvalidCastEx(scope.convert.typeCodes.DateTime, typeCode);
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            valueTypeCode = valueTypeCode || scope.internal.suggestTypeCode(value);
            scope.internal.throwInvalidCastEx(valueTypeCode, typeCode);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCode, value, formatProvider);
        },

        validateNumberRange: function (value, typeCode, denyInfinity) {
            var typeCodes = scope.convert.typeCodes;
            var minValue = scope.internal.getMinValue(typeCode);
            var maxValue = scope.internal.getMaxValue(typeCode);
            var typeName = scope.internal.getTypeCodeName(typeCode);

            if (typeCode === typeCodes.Single ||
                typeCode === typeCodes.Double) {

                if (!denyInfinity && (value === Infinity || value === -Infinity)) {
                    return;
                }
            }

            if (value < minValue || value > maxValue) {
                throw new Bridge.OverflowException("Value was either too large or too small for '" + typeName + "'.");
            }
        },

        roundToInt: function (value, typeCode) {
            if (value % 1 === 0) {
                return value;
            }

            var intPart;

            if (value >= 0) {
                intPart = Math.floor(value);
            } else {
                intPart = -1 * Math.floor(-value);
            }

            var floatPart = value - intPart;

            var minValue = scope.internal.getMinValue(typeCode);
            var maxValue = scope.internal.getMaxValue(typeCode);

            if (value >= 0.0) {
                if (value < (maxValue + 0.5)) {
                    if (floatPart > 0.5 || floatPart === 0.5 && (intPart & 1) !== 0) {
                        ++intPart;
                    }

                    return intPart;
                }
            } else if (value >= (minValue - 0.5)) {
                if (floatPart < -0.5 || floatPart === -0.5 && (intPart & 1) !== 0) {
                    --intPart;
                }

                return intPart;
            }

            var typeName = scope.internal.getTypeCodeName(typeCode);

            throw new Bridge.OverflowException("Value was either too large or too small for an '" + typeName + "'.");
        },

        toBase64_CalculateAndValidateOutputLength: function (inputLength, insertLineBreaks) {
            var base64LineBreakPosition = scope.internal.base64LineBreakPosition;

            var outlen = ~~(inputLength / 3) * 4;           // the base length - we want integer division here. 
            outlen += ((inputLength % 3) !== 0) ? 4 : 0;    // at most 4 more chars for the remainder

            if (outlen === 0) {
                return 0;
            }

            if (insertLineBreaks) {
                var newLines = ~~(outlen / base64LineBreakPosition);

                if ((outlen % base64LineBreakPosition) === 0) {
                    --newLines;
                }

                outlen += newLines * 2;                     // the number of line break chars we'll add, "\r\n"
            }

            // If we overflow an int then we cannot allocate enough
            // memory to output the value so throw
            if (outlen > 2147483647) {
                throw new Bridge.OutOfMemoryException();
            }

            return outlen;
        },

        convertToBase64Array: function (outChars, inData, offset, length, insertLineBreaks) {
            var base64Table = scope.internal.base64Table;
            var base64LineBreakPosition = scope.internal.base64LineBreakPosition;
            var lengthmod3 = length % 3;
            var calcLength = offset + (length - lengthmod3);
            var charCount = 0;
            var j = 0;

            // Convert three bytes at a time to base64 notation.  This will consume 4 chars.
            var i;

            for (i = offset; i < calcLength; i += 3) {
                if (insertLineBreaks) {
                    if (charCount === base64LineBreakPosition) {
                        outChars[j++] = "\r";
                        outChars[j++] = "\n";
                        charCount = 0;
                    }

                    charCount += 4;
                }

                outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                outChars[j + 1] = base64Table[((inData[i] & 0x03) << 4) | ((inData[i + 1] & 0xf0) >> 4)];
                outChars[j + 2] = base64Table[((inData[i + 1] & 0x0f) << 2) | ((inData[i + 2] & 0xc0) >> 6)];
                outChars[j + 3] = base64Table[(inData[i + 2] & 0x3f)];
                j += 4;
            }

            //Where we left off before
            i = calcLength;

            if (insertLineBreaks && (lengthmod3 !== 0) && (charCount === scope.internal.base64LineBreakPosition)) {
                outChars[j++] = "\r";
                outChars[j++] = "\n";
            }

            switch (lengthmod3) {
                case 2: //One character padding needed
                    outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                    outChars[j + 1] = base64Table[((inData[i] & 0x03) << 4) | ((inData[i + 1] & 0xf0) >> 4)];
                    outChars[j + 2] = base64Table[(inData[i + 1] & 0x0f) << 2];
                    outChars[j + 3] = base64Table[64]; //Pad
                    j += 4;
                    break;

                case 1: // Two character padding needed
                    outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                    outChars[j + 1] = base64Table[(inData[i] & 0x03) << 4];
                    outChars[j + 2] = base64Table[64]; //Pad
                    outChars[j + 3] = base64Table[64]; //Pad
                    j += 4;
                    break;
            }

            return j;
        },

        fromBase64CharPtr: function (input, offset, inputLength) {
            if (inputLength < 0) {
                throw new Bridge.ArgumentOutOfRangeException("inputLength", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new Bridge.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            // We need to get rid of any trailing white spaces.
            // Otherwise we would be rejecting input such as "abc= ":
            while (inputLength > 0) {
                var lastChar = input[offset + inputLength - 1];

                if (lastChar !== " " && lastChar !== "\n" && lastChar !== "\r" && lastChar !== "\t") {
                    break;
                }

                inputLength--;
            }

            // Compute the output length:
            var resultLength = scope.internal.fromBase64_ComputeResultLength(input, offset, inputLength);

            if (0 > resultLength) {
                throw new Bridge.InvalidOperationException("Contract voilation: 0 <= resultLength.");
            }

            // resultLength can be zero. We will still enter FromBase64_Decode and process the input.
            // It may either simply write no bytes (e.g. input = " ") or throw (e.g. input = "ab").

            // Create result byte blob:
            var decodedBytes = [];
            decodedBytes.length = resultLength;

            // Convert Base64 chars into bytes:
            scope.internal.fromBase64_Decode(input, offset, inputLength, decodedBytes, 0, resultLength);

            // We are done:
            return decodedBytes;
        },

        fromBase64_Decode: function (input, inputIndex, inputLength, dest, destIndex, destLength) {
            var startDestIndex = destIndex;

            // You may find this method weird to look at. Its written for performance, not aesthetics.
            // You will find unrolled loops label jumps and bit manipulations.

            var intA = "A".charCodeAt(0);
            var inta = "a".charCodeAt(0);
            var int0 = "0".charCodeAt(0);
            var intEq = "=".charCodeAt(0);
            var intPlus = "+".charCodeAt(0);
            var intSlash = "/".charCodeAt(0);
            var intSpace = " ".charCodeAt(0);
            var intTab = "\t".charCodeAt(0);
            var intNLn = "\n".charCodeAt(0);
            var intCRt = "\r".charCodeAt(0);
            var intAtoZ = ("Z".charCodeAt(0) - "A".charCodeAt(0));  // = ('z' - 'a')
            var int0To9 = ("9".charCodeAt(0) - "0".charCodeAt(0));

            var endInputIndex = inputIndex + inputLength;
            var endDestIndex = destIndex + destLength;

            // Current char code/value:
            var currCode;

            // This 4-byte integer will contain the 4 codes of the current 4-char group.
            // Eeach char codes for 6 bits = 24 bits.
            // The remaining byte will be FF, we use it as a marker when 4 chars have been processed.            
            var currBlockCodes = 0x000000FF;

            var allInputConsumed = false;
            var equalityCharEncountered = false;

            while (true) {
                // break when done:
                if (inputIndex >= endInputIndex) {
                    allInputConsumed = true;
                    break;
                }

                // Get current char:
                currCode = input[inputIndex].charCodeAt(0);
                inputIndex++;

                // Determine current char code (unsigned Int comparison):
                if (((currCode - intA) >>> 0) <= intAtoZ) {
                    currCode -= intA;
                } else if (((currCode - inta) >>> 0) <= intAtoZ) {
                    currCode -= (inta - 26);
                } else if (((currCode - int0) >>> 0) <= int0To9) {
                    currCode -= (int0 - 52);
                } else {
                    // Use the slower switch for less common cases:
                    switch (currCode) {
                        // Significant chars:
                        case intPlus:
                            currCode = 62;
                            break;

                        case intSlash:
                            currCode = 63;
                            break;

                            // Legal no-value chars (we ignore these):
                        case intCRt:
                        case intNLn:
                        case intSpace:
                        case intTab:
                            continue;

                            // The equality char is only legal at the end of the input.
                            // Jump after the loop to make it easier for the JIT register predictor to do a good job for the loop itself:
                        case intEq:
                            equalityCharEncountered = true;
                            break;

                            // Other chars are illegal:
                        default:
                            throw new Bridge.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                    }
                }

                if (equalityCharEncountered) {
                    break;
                }

                // Ok, we got the code. Save it:
                currBlockCodes = (currBlockCodes << 6) | currCode;

                // Last bit in currBlockCodes will be on after in shifted right 4 times:
                if ((currBlockCodes & 0x80000000) !== 0) {

                    if ((endDestIndex - destIndex) < 3) {
                        return -1;
                    }

                    dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                    dest[destIndex + 1] = 0xFF & (currBlockCodes >> 8);
                    dest[destIndex + 2] = 0xFF & (currBlockCodes);
                    destIndex += 3;

                    currBlockCodes = 0x000000FF;
                }

            } // end of while

            if (!allInputConsumed && !equalityCharEncountered) {
                throw new Bridge.InvalidOperationException("Contract violation: should never get here.");
            }

            if (equalityCharEncountered) {
                if (currCode !== intEq) {
                    throw new Bridge.InvalidOperationException("Contract violation: currCode == intEq.");
                }

                // Recall that inputIndex is now one position past where '=' was read.
                // '=' can only be at the last input pos:
                if (inputIndex === endInputIndex) {

                    // Code is zero for trailing '=':
                    currBlockCodes <<= 6;

                    // The '=' did not complete a 4-group. The input must be bad:
                    if ((currBlockCodes & 0x80000000) === 0) {
                        throw new Bridge.FormatException("Invalid length for a Base-64 char array or string.");
                    }

                    if ((endDestIndex - destIndex) < 2) {
                        // Autch! We underestimated the output length!
                        return -1;
                    }

                    // We are good, store bytes form this past group. We had a single "=", so we take two bytes:
                    dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                    dest[destIndex + 1] = 0xFF & (currBlockCodes >> 8);
                    destIndex += 2;

                    currBlockCodes = 0x000000FF;

                } else { // '=' can also be at the pre-last position iff the last is also a '=' excluding the white spaces:

                    // We need to get rid of any intermediate white spaces.
                    // Otherwise we would be rejecting input such as "abc= =":
                    while (inputIndex < (endInputIndex - 1)) {
                        var lastChar = input[inputIndex];

                        if (lastChar !== " " && lastChar !== "\n" && lastChar !== "\r" && lastChar !== "\t") {
                            break;
                        }

                        inputIndex++;
                    }

                    if (inputIndex === (endInputIndex - 1) && input[inputIndex] === "=") {
                        // Code is zero for each of the two '=':
                        currBlockCodes <<= 12;

                        // The '=' did not complete a 4-group. The input must be bad:
                        if ((currBlockCodes & 0x80000000) === 0) {
                            throw new Bridge.FormatException("Invalid length for a Base-64 char array or string.");
                        }

                        if ((endDestIndex - destIndex) < 1) {
                            // Autch! We underestimated the output length!
                            return -1;
                        }

                        // We are good, store bytes form this past group. We had a "==", so we take only one byte:
                        dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                        destIndex++;

                        currBlockCodes = 0x000000FF;

                    } else {
                        // '=' is not ok at places other than the end:
                        throw new Bridge.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                    }
                }

            }

            // We get here either from above or by jumping out of the loop:
            // The last block of chars has less than 4 items
            if (currBlockCodes !== 0x000000FF) {
                throw new Bridge.FormatException("Invalid length for a Base-64 char array or string.");
            }

            // Return how many bytes were actually recovered:
            return (destIndex - startDestIndex);

        },

        fromBase64_ComputeResultLength: function (input, startIndex, inputLength) {
            var intEq = "=";
            var intSpace = " ";

            if (inputLength < 0) {
                throw new Bridge.ArgumentOutOfRangeException("inputLength", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            var endIndex = startIndex + inputLength;
            var usefulInputLength = inputLength;
            var padding = 0;

            while (startIndex < endIndex) {

                var c = input[startIndex];
                startIndex++;

                // We want to be as fast as possible and filter out spaces with as few comparisons as possible.
                // We end up accepting a number of illegal chars as legal white-space chars.
                // This is ok: as soon as we hit them during actual decode we will recognise them as illegal and throw.
                if (c <= intSpace) {
                    usefulInputLength--;
                } else if (c === intEq) {
                    usefulInputLength--;
                    padding++;
                }
            }

            if (0 > usefulInputLength) {
                throw new Bridge.InvalidOperationException("Contract violation: 0 <= usefulInputLength.");
            }

            if (0 > padding) {
                // For legal input, we can assume that 0 <= padding < 3. But it may be more for illegal input.
                // We will notice it at decode when we see a '=' at the wrong place.
                throw new Bridge.InvalidOperationException("Contract violation: 0 <= padding.");
            }

            // Perf: reuse the variable that stored the number of '=' to store the number of bytes encoded by the
            // last group that contains the '=':
            if (padding !== 0) {
                if (padding === 1) {
                    padding = 2;
                } else if (padding === 2) {
                    padding = 1;
                } else {
                    throw new Bridge.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                }
            }

            // Done:
            return ~~(usefulInputLength / 4) * 3 + padding;
        },

        charsToCodes: function (chars, codes, codesOffset) {
            if (chars == null) {
                return null;
            }

            codesOffset = codesOffset || 0;

            if (codes == null) {
                codes = [];
                codes.length = chars.length;
            }

            for (var i = 0; i < chars.length; i++) {
                codes[i + codesOffset] = chars[i].charCodeAt(0);
            }

            return codes;
        },

        codesToChars: function (codes, chars) {
            if (codes == null) {
                return null;
            }

            chars = chars || [];

            for (var i = 0; i < codes.length; i++) {
                var code = codes[i];

                chars[i] = String.fromCharCode(code);
            }

            return chars;
        },

        throwInvalidCastEx: function (fromTypeCode, toTypeCode) {
            var fromType = scope.internal.getTypeCodeName(fromTypeCode);
            var toType = scope.internal.getTypeCodeName(toTypeCode);

            throw new Bridge.InvalidCastException("Invalid cast from '" + fromType + "' to '" + toType + "'.");
        }
    };

    Bridge.Convert = scope.convert;

/*--------------------------------------------------------------------------
 * linq.js - LINQ for JavaScript
 * ver 3.0.4-Beta5 (Jun. 20th, 2013)
 *
 * created and maintained by neuecc <ils@neue.cc>
 * licensed under MIT License
 * http://linqjs.codeplex.com/
 *------------------------------------------------------------------------*/

(function (root, undefined) {
    // ReadOnly Function
    var Functions = {
        Identity: function (x) { return x; },
        True: function () { return true; },
        Blank: function () { }
    };

    // const Type
    var Types = {
        Boolean: typeof true,
        Number: typeof 0,
        String: typeof "",
        Object: typeof {},
        Undefined: typeof undefined,
        Function: typeof function () { }
    };

    // createLambda cache
    var funcCache = { "": Functions.Identity };

    // private utility methods
    var Utils = {
        // Create anonymous function from lambda expression string
        createLambda: function (expression) {
            if (expression == null) return Functions.Identity;
            if (typeof expression === Types.String) {
                // get from cache
                var f = funcCache[expression];
                if (f != null) {
                    return f;
                }

                if (expression.indexOf("=>") === -1) {
                    var regexp = new RegExp("[$]+", "g");

                    var maxLength = 0;
                    var match;
                    while ((match = regexp.exec(expression)) != null) {
                        var paramNumber = match[0].length;
                        if (paramNumber > maxLength) {
                            maxLength = paramNumber;
                        }
                    }

                    var argArray = [];
                    for (var i = 1; i <= maxLength; i++) {
                        var dollar = "";
                        for (var j = 0; j < i; j++) {
                            dollar += "$";
                        }
                        argArray.push(dollar);
                    }

                    var args = Array.prototype.join.call(argArray, ",");

                    f = new Function(args, "return " + expression);
                    funcCache[expression] = f;
                    return f;
                }
                else {
                    var expr = expression.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
                    f = new Function(expr[1], "return " + expr[2]);
                    funcCache[expression] = f;
                    return f;
                }
            }
            return expression;
        },

        isIEnumerable: function (obj) {
            if (typeof Enumerator !== Types.Undefined) {
                try {
                    new Enumerator(obj); // check JScript(IE)'s Enumerator
                    return true;
                }
                catch (e) { }
            }

            return false;
        },

        // IE8's defineProperty is defined but cannot use, therefore check defineProperties
        defineProperty: (Object.defineProperties != null)
            ? function (target, methodName, value) {
                Object.defineProperty(target, methodName, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value
                })
            }
            : function (target, methodName, value) {
                target[methodName] = value;
            },

        compare: function (a, b) {
            return (a === b) ? 0
                 : (a > b) ? 1
                 : -1;
        },

        dispose: function (obj) {
            if (obj != null) obj.dispose();
        }
    };

    // IEnumerator State
    var State = { Before: 0, Running: 1, After: 2 };

    // "Enumerator" is conflict JScript's "Enumerator"
    var IEnumerator = function (initialize, tryGetNext, dispose) {
        var yielder = new Yielder();
        var state = State.Before;

        this.getCurrent = yielder.getCurrent;
        this.reset = function () { throw new Error('Reset is not supported'); };

        this.moveNext = function () {
            try {
                switch (state) {
                    case State.Before:
                        state = State.Running;
                        initialize();
                        // fall through
                    case State.Running:
                        if (tryGetNext.apply(yielder)) {
                            return true;
                        }
                        else {
                            this.dispose();
                            return false;
                        }
                    case State.After:
                        return false;
                }
            }
            catch (e) {
                this.dispose();
                throw e;
            }
        };

        this.dispose = function () {
            if (state != State.Running) return;

            try {
                dispose();
            }
            finally {
                state = State.After;
            }
        };
    };
    IEnumerator.$$inheritors = [Bridge.IDisposable];

    // for tryGetNext
    var Yielder = function () {
        var current = null;
        this.getCurrent = function () { return current; };
        this.yieldReturn = function (value) {
            current = value;
            return true;
        };
        this.yieldBreak = function () {
            return false;
        };
    };

    // Enumerable constuctor
    var Enumerable = function (getEnumerator) {
        this.getEnumerator = getEnumerator;
    };
    Enumerable.$$inheritors = [Bridge.IEnumerable];

    // Utility

    Enumerable.Utils = {}; // container

    Enumerable.Utils.createLambda = function (expression) {
        return Utils.createLambda(expression);
    };

    Enumerable.Utils.createEnumerable = function (getEnumerator) {
        return new Enumerable(getEnumerator);
    };

    Enumerable.Utils.createEnumerator = function (initialize, tryGetNext, dispose) {
        return new IEnumerator(initialize, tryGetNext, dispose);
    };

    Enumerable.Utils.extendTo = function (type) {
        var typeProto = type.prototype;
        var enumerableProto;

        if (type === Array) {
            enumerableProto = ArrayEnumerable.prototype;
            Utils.defineProperty(typeProto, "getSource", function () {
                return this;
            });
        }
        else {
            enumerableProto = Enumerable.prototype;
            Utils.defineProperty(typeProto, "getEnumerator", function () {
                return Enumerable.from(this).getEnumerator();
            });
        }

        for (var methodName in enumerableProto) {
            var func = enumerableProto[methodName];

            // already extended
            if (typeProto[methodName] == func) continue;

            // already defined(example Array#reverse/join/forEach...)
            if (typeProto[methodName] != null) {
                methodName = methodName + "ByLinq";
                if (typeProto[methodName] == func) continue; // recheck
            }

            if (func instanceof Function) {
                Utils.defineProperty(typeProto, methodName, func);
            }
        }
    };

    // Generator

    Enumerable.choice = function () // variable argument
    {
        var args = arguments;

        return new Enumerable(function () {
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    return this.yieldReturn(args[Math.floor(Math.random() * args.length)]);
                },
                Functions.Blank);
        });
    };

    Enumerable.cycle = function () // variable argument
    {
        var args = arguments;

        return new Enumerable(function () {
            var index = 0;
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    if (index >= args.length) index = 0;
                    return this.yieldReturn(args[index++]);
                },
                Functions.Blank);
        });
    };

    // private singleton
    var emptyEnumerable = new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return false; },
                Functions.Blank);
        });
    Enumerable.empty = function () {
        return emptyEnumerable;
    };

    Enumerable.from = function (obj) {
        if (obj == null) {
            return Enumerable.empty();
        }
        if (obj instanceof Enumerable) {
            return obj;
        }
        if (typeof obj == Types.Number || typeof obj == Types.Boolean) {
            return Enumerable.repeat(obj, 1);
        }
        if (typeof obj == Types.String) {
            return new Enumerable(function () {
                var index = 0;
                return new IEnumerator(
                    Functions.Blank,
                    function () {
                        return (index < obj.length) ? this.yieldReturn(obj.charAt(index++)) : false;
                    },
                    Functions.Blank);
            });
        }
        var ienum = Bridge.as(obj, Bridge.IEnumerable);
        if (ienum) {
            return new Enumerable(function () {
                var enumerator;
                return new IEnumerator(
                    function () { enumerator = Bridge.getEnumerator(ienum); },
                    function () {
                        var ok = enumerator.moveNext();
                        return ok ? this.yieldReturn(enumerator.getCurrent()) : false;
                    },
                    function () {
                        var disposable = Bridge.as(enumerator, Bridge.IDisposable);
                        if (disposable) {
                            disposable.dispose();
                        }
                    }
                );
            });
        }
        if (typeof obj != Types.Function) {
            // array or array like object
            if (typeof obj.length == Types.Number) {
                return new ArrayEnumerable(obj);
            }

            // JScript's IEnumerable
            if (!(obj instanceof Object) && Utils.isIEnumerable(obj)) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = new Enumerator(obj); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.atEnd()) ? false : this.yieldReturn(enumerator.item());
                        },
                        Functions.Blank);
                });
            }

            // WinMD IIterable<T>
            if (typeof Windows === Types.Object && typeof obj.first === Types.Function) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = obj.first(); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.hasCurrent) ? this.yieldReturn(enumerator.current) : this.yieldBreak();
                        },
                        Functions.Blank);
                });
            }
        }

        // case function/object : Create keyValuePair[]
        return new Enumerable(function () {
            var array = [];
            var index = 0;

            return new IEnumerator(
                function () {
                    for (var key in obj) {
                        var value = obj[key];
                        if (!(value instanceof Function) && Object.prototype.hasOwnProperty.call(obj, key)) {
                            array.push({ key: key, value: value });
                        }
                    }
                },
                function () {
                    return (index < array.length)
                        ? this.yieldReturn(array[index++])
                        : false;
                },
                Functions.Blank);
        });
    },

    Enumerable.make = function (element) {
        return Enumerable.repeat(element, 1);
    };

    // Overload:function (input, pattern)
    // Overload:function (input, pattern, flags)
    Enumerable.matches = function (input, pattern, flags) {
        if (flags == null) flags = "";
        if (pattern instanceof RegExp) {
            flags += (pattern.ignoreCase) ? "i" : "";
            flags += (pattern.multiline) ? "m" : "";
            pattern = pattern.source;
        }
        if (flags.indexOf("g") === -1) flags += "g";

        return new Enumerable(function () {
            var regex;
            return new IEnumerator(
                function () { regex = new RegExp(pattern, flags); },
                function () {
                    var match = regex.exec(input);
                    return (match) ? this.yieldReturn(match) : false;
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, count)
    // Overload:function (start, count, step)
    Enumerable.range = function (start, count, step) {
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start - step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value += step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, count)
    // Overload:function (start, count, step)
    Enumerable.rangeDown = function (start, count, step) {
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start + step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value -= step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, to)
    // Overload:function (start, to, step)
    Enumerable.rangeTo = function (start, to, step) {
        if (step == null) step = 1;

        if (start < to) {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start - step; },
                function () {
                    var next = value += step;
                    return (next <= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
        else {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start + step; },
                function () {
                    var next = value -= step;
                    return (next >= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
    };

    // Overload:function (element)
    // Overload:function (element, count)
    Enumerable.repeat = function (element, count) {
        if (count != null) return Enumerable.repeat(element).take(count);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(element); },
                Functions.Blank);
        });
    };

    Enumerable.repeatWithFinalize = function (initializer, finalizer) {
        initializer = Utils.createLambda(initializer);
        finalizer = Utils.createLambda(finalizer);

        return new Enumerable(function () {
            var element;
            return new IEnumerator(
                function () { element = initializer(); },
                function () { return this.yieldReturn(element); },
                function () {
                    if (element != null) {
                        finalizer(element);
                        element = null;
                    }
                });
        });
    };

    // Overload:function (func)
    // Overload:function (func, count)
    Enumerable.generate = function (func, count) {
        if (count != null) return Enumerable.generate(func).take(count);
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(func()); },
                Functions.Blank);
        });
    };

    // Overload:function ()
    // Overload:function (start)
    // Overload:function (start, step)
    Enumerable.toInfinity = function (start, step) {
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start - step; },
                function () { return this.yieldReturn(value += step); },
                Functions.Blank);
        });
    };

    // Overload:function ()
    // Overload:function (start)
    // Overload:function (start, step)
    Enumerable.toNegativeInfinity = function (start, step) {
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start + step; },
                function () { return this.yieldReturn(value -= step); },
                Functions.Blank);
        });
    };

    Enumerable.unfold = function (seed, func) {
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            var isFirst = true;
            var value;
            return new IEnumerator(
                Functions.Blank,
                function () {
                    if (isFirst) {
                        isFirst = false;
                        value = seed;
                        return this.yieldReturn(value);
                    }
                    value = func(value);
                    return this.yieldReturn(value);
                },
                Functions.Blank);
        });
    };

    Enumerable.defer = function (enumerableFactory) {

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = Enumerable.from(enumerableFactory()).getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : this.yieldBreak();
                },
                function () {
                    Utils.dispose(enumerator);
                });
        });
    };

    // Extension Methods

    /* Projection and Filtering Methods */

    // Overload:function (func)
    // Overload:function (func, resultSelector<element>)
    // Overload:function (func, resultSelector<element, nestLevel>)
    Enumerable.prototype.traverseBreadthFirst = function (func, resultSelector) {
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var nestLevel = 0;
            var buffer = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            buffer.push(enumerator.getCurrent());
                            return this.yieldReturn(resultSelector(enumerator.getCurrent(), nestLevel));
                        }

                        var next = Enumerable.from(buffer).selectMany(function (x) { return func(x); });
                        if (!next.any()) {
                            return false;
                        }
                        else {
                            nestLevel++;
                            buffer = [];
                            Utils.dispose(enumerator);
                            enumerator = next.getEnumerator();
                        }
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (func)
    // Overload:function (func, resultSelector<element>)
    // Overload:function (func, resultSelector<element, nestLevel>)
    Enumerable.prototype.traverseDepthFirst = function (func, resultSelector) {
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumeratorStack = [];
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            var value = resultSelector(enumerator.getCurrent(), enumeratorStack.length);
                            enumeratorStack.push(enumerator);
                            enumerator = Enumerable.from(func(enumerator.getCurrent())).getEnumerator();
                            return this.yieldReturn(value);
                        }

                        if (enumeratorStack.length <= 0) return false;
                        Utils.dispose(enumerator);
                        enumerator = enumeratorStack.pop();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Enumerable.from(enumeratorStack).forEach(function (s) { s.dispose(); });
                    }
                });
        });
    };

    Enumerable.prototype.flatten = function () {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = null;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (middleEnumerator != null) {
                            if (middleEnumerator.moveNext()) {
                                return this.yieldReturn(middleEnumerator.getCurrent());
                            }
                            else {
                                middleEnumerator = null;
                            }
                        }

                        if (enumerator.moveNext()) {
                            if (enumerator.getCurrent() instanceof Array) {
                                Utils.dispose(middleEnumerator);
                                middleEnumerator = Enumerable.from(enumerator.getCurrent())
                                    .selectMany(Functions.Identity)
                                    .flatten()
                                    .getEnumerator();
                                continue;
                            }
                            else {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                        }

                        return false;
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.pairwise = function (selector) {
        var source = this;
        selector = Utils.createLambda(selector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    enumerator.moveNext();
                },
                function () {
                    var prev = enumerator.getCurrent();
                    return (enumerator.moveNext())
                        ? this.yieldReturn(selector(prev, enumerator.getCurrent()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (func)
    // Overload:function (seed,func<value,element>)
    Enumerable.prototype.scan = function (seed, func) {
        var isUseSeed;
        if (func == null) {
            func = Utils.createLambda(seed); // arguments[0]
            isUseSeed = false;
        } else {
            func = Utils.createLambda(func);
            isUseSeed = true;
        }
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var value;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (isFirst) {
                        isFirst = false;
                        if (!isUseSeed) {
                            if (enumerator.moveNext()) {
                                return this.yieldReturn(value = enumerator.getCurrent());
                            }
                        }
                        else {
                            return this.yieldReturn(value = seed);
                        }
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(value = func(value, enumerator.getCurrent()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (selector<element>)
    // Overload:function (selector<element,index>)
    Enumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            return new WhereSelectEnumerable(this, null, selector);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(selector(enumerator.getCurrent(), index++))
                            : false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };

    // Overload:function (collectionSelector<element>)
    // Overload:function (collectionSelector<element,index>)
    // Overload:function (collectionSelector<element>,resultSelector)
    // Overload:function (collectionSelector<element,index>,resultSelector)
    Enumerable.prototype.selectMany = function (collectionSelector, resultSelector) {
        var source = this;
        collectionSelector = Utils.createLambda(collectionSelector);
        if (resultSelector == null) resultSelector = function (a, b) { return b; };
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = undefined;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (middleEnumerator === undefined) {
                        if (!enumerator.moveNext()) return false;
                    }
                    do {
                        if (middleEnumerator == null) {
                            var middleSeq = collectionSelector(enumerator.getCurrent(), index++);
                            middleEnumerator = Enumerable.from(middleSeq).getEnumerator();
                        }
                        if (middleEnumerator.moveNext()) {
                            return this.yieldReturn(resultSelector(enumerator.getCurrent(), middleEnumerator.getCurrent()));
                        }
                        Utils.dispose(middleEnumerator);
                        middleEnumerator = null;
                    } while (enumerator.moveNext());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            return new WhereEnumerable(this, predicate);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.getCurrent(), index++)) {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                        }
                        return false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };


    // Overload:function (selector<element>)
    // Overload:function (selector<element,index>)
    Enumerable.prototype.choose = function (selector) {
        selector = Utils.createLambda(selector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        var result = selector(enumerator.getCurrent(), index++);
                        if (result != null) {
                            return this.yieldReturn(result);
                        }
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.ofType = function (type) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
					enumerator = Bridge.getEnumerator(source);
				},
                function () {
                    while (enumerator.moveNext()) {
                        var v = Bridge.as(enumerator.getCurrent(), type);
                        if (Bridge.hasValue(v)) {
                            return this.yieldReturn(v);
                        }
                    }
                    return false;
                },
                function () {
					Utils.dispose(enumerator);
				});
        });
    };

    // mutiple arguments, last one is selector, others are enumerable
    Enumerable.prototype.zip = function () {
        var args = arguments;
        var selector = Utils.createLambda(arguments[arguments.length - 1]);

        var source = this;
        // optimized case:argument is 2
        if (arguments.length == 2) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;
                var index = 0;

                return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (firstEnumerator.moveNext() && secondEnumerator.moveNext()) {
                        return this.yieldReturn(selector(firstEnumerator.getCurrent(), secondEnumerator.getCurrent(), index++));
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    } finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            return new Enumerable(function () {
                var enumerators;
                var index = 0;

                return new IEnumerator(
                function () {
                    var array = Enumerable.make(source)
                        .concat(Enumerable.from(args).takeExceptLast().select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                    enumerators = Enumerable.from(array);
                },
                function () {
                    if (enumerators.all(function (x) { return x.moveNext() })) {
                        var array = enumerators
                            .select(function (x) { return x.getCurrent() })
                            .toArray();
                        array.push(index++);
                        return this.yieldReturn(selector.apply(null, array));
                    }
                    else {
                        return this.yieldBreak();
                    }
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
            });
        }
    };

    // mutiple arguments
    Enumerable.prototype.merge = function () {
        var args = arguments;
        var source = this;

        return new Enumerable(function () {
            var enumerators;
            var index = -1;

            return new IEnumerator(
                function () {
                    enumerators = Enumerable.make(source)
                        .concat(Enumerable.from(args).select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                },
                function () {
                    while (enumerators.length > 0) {
                        index = (index >= enumerators.length - 1) ? 0 : index + 1;
                        var enumerator = enumerators[index];

                        if (enumerator.moveNext()) {
                            return this.yieldReturn(enumerator.getCurrent());
                        }
                        else {
                            enumerator.dispose();
                            enumerators.splice(index--, 1);
                        }
                    }
                    return this.yieldBreak();
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
        });
    };

    /* Join Methods */

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);

        var source = this;

        return new Enumerable(function () {
            var outerEnumerator;
            var lookup;
            var innerElements = null;
            var innerCount = 0;

            return new IEnumerator(
                function () {
                    outerEnumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, comparer);
                },
                function () {
                    while (true) {
                        if (innerElements != null) {
                            var innerElement = innerElements[innerCount++];
                            if (innerElement !== undefined) {
                                return this.yieldReturn(resultSelector(outerEnumerator.getCurrent(), innerElement));
                            }

                            innerElement = null;
                            innerCount = 0;
                        }

                        if (outerEnumerator.moveNext()) {
                            var key = outerKeySelector(outerEnumerator.getCurrent());
                            innerElements = lookup.get(key).toArray();
                        } else {
                            return false;
                        }
                    }
                },
                function () { Utils.dispose(outerEnumerator); });
        });
    };

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator = source.getEnumerator();
            var lookup = null;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, comparer);
                },
                function () {
                    if (enumerator.moveNext()) {
                        var innerElement = lookup.get(outerKeySelector(enumerator.getCurrent()));
                        return this.yieldReturn(resultSelector(enumerator.getCurrent(), innerElement));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Set Methods */

    Enumerable.prototype.all = function (predicate) {
        predicate = Utils.createLambda(predicate);

        var result = true;
        this.forEach(function (x) {
            if (!predicate(x)) {
                result = false;
                return false; // break
            }
        });
        return result;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.any = function (predicate) {
        predicate = Utils.createLambda(predicate);

        var enumerator = this.getEnumerator();
        try {
            if (arguments.length == 0) return enumerator.moveNext(); // case:function ()

            while (enumerator.moveNext()) // case:function (predicate)
            {
                if (predicate(enumerator.getCurrent())) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.isEmpty = function () {
        return !this.any();
    };

    // multiple arguments
    Enumerable.prototype.concat = function () {
        var source = this;

        if (arguments.length == 1) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;

                return new IEnumerator(
                function () { firstEnumerator = source.getEnumerator(); },
                function () {
                    if (secondEnumerator == null) {
                        if (firstEnumerator.moveNext()) return this.yieldReturn(firstEnumerator.getCurrent());
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    if (secondEnumerator.moveNext()) return this.yieldReturn(secondEnumerator.getCurrent());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            var args = arguments;

            return new Enumerable(function () {
                var enumerators;

                return new IEnumerator(
                    function () {
                        enumerators = Enumerable.make(source)
                            .concat(Enumerable.from(args).select(Enumerable.from))
                            .select(function (x) { return x.getEnumerator() })
                            .toArray();
                    },
                    function () {
                        while (enumerators.length > 0) {
                            var enumerator = enumerators[0];

                            if (enumerator.moveNext()) {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                            else {
                                enumerator.dispose();
                                enumerators.splice(0, 1);
                            }
                        }
                        return this.yieldBreak();
                    },
                    function () {
                        Enumerable.from(enumerators).forEach(Utils.dispose);
                    });
            });
        }
    };

    Enumerable.prototype.insert = function (index, second) {
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var count = 0;
            var isEnumerated = false;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (count == index && secondEnumerator.moveNext()) {
                        isEnumerated = true;
                        return this.yieldReturn(secondEnumerator.getCurrent());
                    }
                    if (firstEnumerator.moveNext()) {
                        count++;
                        return this.yieldReturn(firstEnumerator.getCurrent());
                    }
                    if (!isEnumerated && secondEnumerator.moveNext()) {
                        return this.yieldReturn(secondEnumerator.getCurrent());
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.alternate = function (alternateValueOrSequence) {
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var enumerator;
            var alternateSequence;
            var alternateEnumerator;

            return new IEnumerator(
                function () {
                    if (alternateValueOrSequence instanceof Array || alternateValueOrSequence.getEnumerator != null) {
                        alternateSequence = Enumerable.from(Enumerable.from(alternateValueOrSequence).toArray()); // freeze
                    }
                    else {
                        alternateSequence = Enumerable.make(alternateValueOrSequence);
                    }
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) buffer = enumerator.getCurrent();
                },
                function () {
                    while (true) {
                        if (alternateEnumerator != null) {
                            if (alternateEnumerator.moveNext()) {
                                return this.yieldReturn(alternateEnumerator.getCurrent());
                            }
                            else {
                                alternateEnumerator = null;
                            }
                        }

                        if (buffer == null && enumerator.moveNext()) {
                            buffer = enumerator.getCurrent(); // hasNext
                            alternateEnumerator = alternateSequence.getEnumerator();
                            continue; // GOTO
                        }
                        else if (buffer != null) {
                            var retVal = buffer;
                            buffer = null;
                            return this.yieldReturn(retVal);
                        }

                        return this.yieldBreak();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(alternateEnumerator);
                    }
                });
        });
    };

    // Overload:function (value)
    // Overload:function (value, compareSelector)
    Enumerable.prototype.contains = function (value, comparer) {
        comparer = comparer || Bridge.EqualityComparer$1.$default;
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (comparer.equals(enumerator.getCurrent(), value)) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
        var source = this;
        if (defaultValue === undefined) defaultValue = null;

        return new Enumerable(function () {
            var enumerator;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        isFirst = false;
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    else if (isFirst) {
                        isFirst = false;
                        return this.yieldReturn(defaultValue);
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function ()
    // Overload:function (compareSelector)
    Enumerable.prototype.distinct = function (comparer) {
        return this.except(Enumerable.empty(), comparer);
    };

    Enumerable.prototype.distinctUntilChanged = function (compareSelector) {
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var compareKey;
            var initial;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        var key = compareSelector(enumerator.getCurrent());

                        if (initial) {
                            initial = false;
                            compareKey = key;
                            return this.yieldReturn(enumerator.getCurrent());
                        }

                        if (compareKey === key) {
                            continue;
                        }

                        compareKey = key;
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.except = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    keys = new Bridge.Dictionary$2(Object, Object)(null, comparer);
                    Enumerable.from(second).forEach(function (key) { keys.add(key); });
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.getCurrent();
                        if (!keys.containsKey(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.intersect = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;
            var outs;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();

                    keys = new Bridge.Dictionary$2(Object, Object)(null, comparer);
                    Enumerable.from(second).forEach(function (key) { keys.add(key); });
                    outs = new Bridge.Dictionary$2(Object, Object)(null, comparer);
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.getCurrent();
                        if (!outs.containsKey(current) && keys.containsKey(current)) {
                            outs.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.sequenceEqual = function (second, comparer) {
        comparer = comparer || Bridge.EqualityComparer$1.$default;

        var firstEnumerator = this.getEnumerator();
        try {
            var secondEnumerator = Enumerable.from(second).getEnumerator();
            try {
                while (firstEnumerator.moveNext()) {
                    if (!secondEnumerator.moveNext()
                    || !comparer.equals(firstEnumerator.getCurrent(), secondEnumerator.getCurrent())) {
                        return false;
                    }
                }

                if (secondEnumerator.moveNext()) return false;
                return true;
            }
            finally {
                Utils.dispose(secondEnumerator);
            }
        }
        finally {
            Utils.dispose(firstEnumerator);
        }
    };

    Enumerable.prototype.union = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var keys;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    keys = new Bridge.Dictionary$2(Object, Object)(null, comparer);
                },
                function () {
                    var current;
                    if (secondEnumerator === undefined) {
                        while (firstEnumerator.moveNext()) {
                            current = firstEnumerator.getCurrent();
                            if (!keys.containsKey(current)) {
                                keys.add(current);
                                return this.yieldReturn(current);
                            }
                        }
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    while (secondEnumerator.moveNext()) {
                        current = secondEnumerator.getCurrent();
                        if (!keys.containsKey(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    /* Ordering Methods */

    Enumerable.prototype.orderBy = function (keySelector, comparer) {
        return new OrderedEnumerable(this, keySelector, comparer, false);
    };

    Enumerable.prototype.orderByDescending = function (keySelector, comparer) {
        return new OrderedEnumerable(this, keySelector, comparer, true);
    };

    Enumerable.prototype.reverse = function () {
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var index;

            return new IEnumerator(
                function () {
                    buffer = source.toArray();
                    index = buffer.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(buffer[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.shuffle = function () {
        var source = this;

        return new Enumerable(function () {
            var buffer;

            return new IEnumerator(
                function () { buffer = source.toArray(); },
                function () {
                    if (buffer.length > 0) {
                        var i = Math.floor(Math.random() * buffer.length);
                        return this.yieldReturn(buffer.splice(i, 1)[0]);
                    }
                    return false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.weightedSample = function (weightSelector) {
        weightSelector = Utils.createLambda(weightSelector);
        var source = this;

        return new Enumerable(function () {
            var sortedByBound;
            var totalWeight = 0;

            return new IEnumerator(
                function () {
                    sortedByBound = source
                        .choose(function (x) {
                            var weight = weightSelector(x);
                            if (weight <= 0) return null; // ignore 0

                            totalWeight += weight;
                            return { value: x, bound: totalWeight };
                        })
                        .toArray();
                },
                function () {
                    if (sortedByBound.length > 0) {
                        var draw = Math.floor(Math.random() * totalWeight) + 1;

                        var lower = -1;
                        var upper = sortedByBound.length;
                        while (upper - lower > 1) {
                            var index = Math.floor((lower + upper) / 2);
                            if (sortedByBound[index].bound >= draw) {
                                upper = index;
                            }
                            else {
                                lower = index;
                            }
                        }

                        return this.yieldReturn(sortedByBound[upper].value);
                    }

                    return this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    /* Grouping Methods */

    // Overload:function (keySelector)
    // Overload:function (keySelector,elementSelector)
    // Overload:function (keySelector,elementSelector,resultSelector)
    // Overload:function (keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.groupBy = function (keySelector, elementSelector, resultSelector, comparer) {
        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        if (resultSelector != null) resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.toLookup(keySelector, elementSelector, comparer)
                        .toEnumerable()
                        .getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        return (resultSelector == null)
                            ? this.yieldReturn(enumerator.getCurrent())
                            : this.yieldReturn(resultSelector(enumerator.getCurrent().key(), enumerator.getCurrent()));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (keySelector)
    // Overload:function (keySelector,elementSelector)
    // Overload:function (keySelector,elementSelector,resultSelector)
    // Overload:function (keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.partitionBy = function (keySelector, elementSelector, resultSelector, comparer) {

        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        comparer = comparer || Bridge.EqualityComparer$1.$default;
        var hasResultSelector;
        if (resultSelector == null) {
            hasResultSelector = false;
            resultSelector = function (key, group) { return new Grouping(key, group); };
        }
        else {
            hasResultSelector = true;
            resultSelector = Utils.createLambda(resultSelector);
        }

        return new Enumerable(function () {
            var enumerator;
            var key;
            var group = [];

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) {
                        key = keySelector(enumerator.getCurrent());
                        group.push(elementSelector(enumerator.getCurrent()));
                    }
                },
                function () {
                    var hasNext;
                    while ((hasNext = enumerator.moveNext()) == true) {
                        if (comparer.equals(key, keySelector(enumerator.getCurrent()))) {
                            group.push(elementSelector(enumerator.getCurrent()));
                        }
                        else break;
                    }

                    if (group.length > 0) {
                        var result = (hasResultSelector)
                            ? resultSelector(key, Enumerable.from(group))
                            : resultSelector(key, group);
                        if (hasNext) {
                            key = keySelector(enumerator.getCurrent());
                            group = [elementSelector(enumerator.getCurrent())];
                        }
                        else group = [];

                        return this.yieldReturn(result);
                    }

                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.buffer = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    var array = [];
                    var index = 0;
                    while (enumerator.moveNext()) {
                        array.push(enumerator.getCurrent());
                        if (++index >= count) return this.yieldReturn(array);
                    }
                    if (array.length > 0) return this.yieldReturn(array);
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Aggregate Methods */

    // Overload:function (func)
    // Overload:function (seed,func)
    // Overload:function (seed,func,resultSelector)
    Enumerable.prototype.aggregate = function (seed, func, resultSelector) {
        resultSelector = Utils.createLambda(resultSelector);
        return resultSelector(this.scan(seed, func, resultSelector).last());
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.average = function (selector) {
        selector = Utils.createLambda(selector);

        var sum = 0;
        var count = 0;
        this.forEach(function (x) {
            x = selector(x);

            if (x instanceof Bridge.Decimal) {
                sum = x.add(sum);
            }
            else if (sum instanceof Bridge.Decimal) {
                sum = sum.add(x);
            } else {
                sum += x;
            }
            
            ++count;
        });

        return sum instanceof Bridge.Decimal ? sum.div(count) : (sum / count);
    };

    Enumerable.prototype.nullableAverage = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.average(selector);
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.count = function (predicate) {
        predicate = (predicate == null) ? Functions.True : Utils.createLambda(predicate);

        var count = 0;
        this.forEach(function (x, i) {
            if (predicate(x, i))++count;
        });
        return count;
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.max = function (selector) {
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) {
            return (Bridge.compare(a, b, true) === 1) ? a : b;
        });
    };

    Enumerable.prototype.nullableMax = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.max(selector);
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.min = function (selector) {
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) {
            return (Bridge.compare(a, b, true) === -1) ? a : b;
        });
    };

    Enumerable.prototype.nullableMin = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.min(selector);
    };

    Enumerable.prototype.maxBy = function (keySelector) {
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) {
            return (Bridge.compare(keySelector(a), keySelector(b), true) === 1) ? a : b;
        });
    };

    Enumerable.prototype.minBy = function (keySelector) {
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) {
            return (Bridge.compare(keySelector(a), keySelector(b), true) === -1) ? a : b;
        });
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.sum = function (selector) {
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(0, function(a, b) {
             if (a instanceof Bridge.Decimal) {
                 return a.add(b);
             }
             if (b instanceof Bridge.Decimal) {
                 return b.add(a);
             }
             return a + b;
        });
    };

    Enumerable.prototype.nullableSum = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.sum(selector);
    };

    /* Paging Methods */

    Enumerable.prototype.elementAt = function (index) {
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        if (!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
        return value;
    };

    Enumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.first = function (predicate) {
        if (predicate != null) return this.where(predicate).first();

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });

        if (!found) throw new Error("first:No element satisfies the condition.");
        return value;
    };

    Enumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).firstOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.last = function (predicate) {
        if (predicate != null) return this.where(predicate).last();

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });

        if (!found) throw new Error("last:No element satisfies the condition.");
        return value;
    };

    // Overload:function (defaultValue)
    // Overload:function (defaultValue,predicate)
    Enumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).lastOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.single = function (predicate) {
        if (predicate != null) return this.where(predicate).single();

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        if (!found) throw new Error("single:No element satisfies the condition.");
        return value;
    };

    // Overload:function (defaultValue)
    // Overload:function (defaultValue,predicate)
    Enumerable.prototype.singleOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).singleOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        return (!found) ? defaultValue : value;
    };

    Enumerable.prototype.skip = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    while (index++ < count && enumerator.moveNext()) {
                    }
                    ;
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.skipWhile = function (predicate) {
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;
            var isSkipEnd = false;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (!isSkipEnd) {
                        if (enumerator.moveNext()) {
                            if (!predicate(enumerator.getCurrent(), index++)) {
                                isSkipEnd = true;
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                            continue;
                        } else return false;
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;

                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.take = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (index++ < count && enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); }
            );
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.takeWhile = function (predicate) {
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext() && predicate(enumerator.getCurrent(), index++))
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function ()
    // Overload:function (count)
    Enumerable.prototype.takeExceptLast = function (count) {
        if (count == null) count = 1;
        var source = this;

        return new Enumerable(function () {
            if (count <= 0) return source.getEnumerator(); // do nothing

            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        if (q.length == count) {
                            q.push(enumerator.getCurrent());
                            return this.yieldReturn(q.shift());
                        }
                        q.push(enumerator.getCurrent());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.takeFromLast = function (count) {
        if (count <= 0 || count == null) return Enumerable.empty();
        var source = this;

        return new Enumerable(function () {
            var sourceEnumerator;
            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { sourceEnumerator = source.getEnumerator(); },
                function () {
                    if (enumerator == null) {
	                    while (sourceEnumerator.moveNext()) {
	                        if (q.length == count) q.shift();
	                        q.push(sourceEnumerator.getCurrent());
	                    }
                        enumerator = Enumerable.from(q).getEnumerator();
                    }
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (item)
    // Overload:function (predicate)
    Enumerable.prototype.indexOf = function (item, comparer) {
        var found = null;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) {
                    found = i;
                    return false;
                }
            });
        }
        else {
            comparer = comparer || Bridge.EqualityComparer$1.$default;
            this.forEach(function (x, i) {
                if (comparer.equals(x, item)) {
                    found = i;
                    return false;
                }
            });
        }

        return (found !== null) ? found : -1;
    };

    // Overload:function (item)
    // Overload:function (predicate)
    Enumerable.prototype.lastIndexOf = function (item, comparer) {
        var result = -1;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) result = i;
            });
        }
        else {
            comparer = comparer || Bridge.EqualityComparer$1.$default;
            this.forEach(function (x, i) {
                if (comparer.equals(x, item)) result = i;
            });
        }

        return result;
    };

    /* Convert Methods */


    Enumerable.prototype.asEnumerable = function () {
        return Enumerable.from(this);
    };

    Enumerable.prototype.toArray = function () {
        var array = [];
        this.forEach(function (x) { array.push(x); });
        return array;
    };

    Enumerable.prototype.toList = function (T) {
        var array = [];
        this.forEach(function (x) { array.push(x); });
        return new Bridge.List$1(T || Object)(array);
    };

    // Overload:function (keySelector)
    // Overload:function (keySelector, elementSelector)
    // Overload:function (keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toLookup = function (keySelector, elementSelector, comparer) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var dict = new Bridge.Dictionary$2(Object, Object)(null, comparer);
        var order = [];
        this.forEach(function (x) {
            var key = keySelector(x);
            var element = elementSelector(x);

            var array = { v: null };
            if (dict.tryGetValue(key, array)) {
                array.v.push(element);
            }
            else {
                order.push(key);
                dict.add(key, [element]);
            }
        });
        return new Lookup(dict, order);
    };

    Enumerable.prototype.toObject = function (keySelector, elementSelector) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var obj = {};
        this.forEach(function (x) {
            obj[keySelector(x)] = elementSelector(x);
        });
        return obj;
    };

    // Overload:function (keySelector, elementSelector)
    // Overload:function (keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toDictionary = function (keySelector, elementSelector, keyType, valueType, comparer) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var dict = new Bridge.Dictionary$2(keyType, valueType)(null, comparer);
        this.forEach(function (x) {
            dict.add(keySelector(x), elementSelector(x));
        });
        return dict;
    };

    // Overload:function ()
    // Overload:function (replacer)
    // Overload:function (replacer, space)
    Enumerable.prototype.toJSONString = function (replacer, space) {
        if (typeof JSON === Types.Undefined || JSON.stringify == null) {
            throw new Error("toJSONString can't find JSON.stringify. This works native JSON support Browser or include json2.js");
        }
        return JSON.stringify(this.toArray(), replacer, space);
    };

    // Overload:function ()
    // Overload:function (separator)
    // Overload:function (separator,selector)
    Enumerable.prototype.toJoinedString = function (separator, selector) {
        if (separator == null) separator = "";
        if (selector == null) selector = Functions.Identity;

        return this.select(selector).toArray().join(separator);
    };


    /* Action Methods */

    // Overload:function (action<element>)
    // Overload:function (action<element,index>)
    Enumerable.prototype.doAction = function (action) {
        var source = this;
        action = Utils.createLambda(action);

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        action(enumerator.getCurrent(), index++);
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (action<element>)
    // Overload:function (action<element,index>)
    // Overload:function (func<element,bool>)
    // Overload:function (func<element,index,bool>)
    Enumerable.prototype.forEach = function (action) {
        action = Utils.createLambda(action);

        var index = 0;
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (action(enumerator.getCurrent(), index++) === false) break;
            }
        } finally {
            Utils.dispose(enumerator);
        }
    };

    // Overload:function ()
    // Overload:function (separator)
    // Overload:function (separator,selector)
    Enumerable.prototype.write = function (separator, selector) {
        if (separator == null) separator = "";
        selector = Utils.createLambda(selector);

        var isFirst = true;
        this.forEach(function (item) {
            if (isFirst) isFirst = false;
            else document.write(separator);
            document.write(selector(item));
        });
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.writeLine = function (selector) {
        selector = Utils.createLambda(selector);

        this.forEach(function (item) {
            document.writeln(selector(item) + "<br />");
        });
    };

    Enumerable.prototype.force = function () {
        var enumerator = this.getEnumerator();

        try {
            while (enumerator.moveNext()) {
            }
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    /* Functional Methods */

    Enumerable.prototype.letBind = function (func) {
        func = Utils.createLambda(func);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = Enumerable.from(func(source)).getEnumerator();
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.share = function () {
        var source = this;
        var sharedEnumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            return new IEnumerator(
                function () {
                    if (sharedEnumerator == null) {
                        sharedEnumerator = source.getEnumerator();
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    return (sharedEnumerator.moveNext())
                        ? this.yieldReturn(sharedEnumerator.getCurrent())
                        : false;
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(sharedEnumerator);
        });
    };

    Enumerable.prototype.memoize = function () {
        var source = this;
        var cache;
        var enumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            var index = -1;

            return new IEnumerator(
                function () {
                    if (enumerator == null) {
                        enumerator = source.getEnumerator();
                        cache = [];
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    index++;
                    if (cache.length <= index) {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(cache[index] = enumerator.getCurrent())
                            : false;
                    }

                    return this.yieldReturn(cache[index]);
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(enumerator);
            cache = null;
        });
    };

    /* Error Handling Methods */

    Enumerable.prototype.catchError = function (handler) {
        handler = Utils.createLambda(handler);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    try {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(enumerator.getCurrent())
                            : false;
                    } catch (e) {
                        handler(e);
                        return false;
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.finallyAction = function (finallyAction) {
        finallyAction = Utils.createLambda(finallyAction);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    } finally {
                        finallyAction();
                    }
                });
        });
    };

    /* For Debug Methods */

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.log = function (selector) {
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(selector(item));
            }
        });
    };

    // Overload:function ()
    // Overload:function (message)
    // Overload:function (message,selector)
    Enumerable.prototype.trace = function (message, selector) {
        if (message == null) message = "Trace";
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(message, selector(item));
            }
        });
    };

    // private

    var OrderedEnumerable = function (source, keySelector, comparer, descending, parent) {
        this.source = source;
        this.keySelector = Utils.createLambda(keySelector);
        this.comparer = comparer || Bridge.Comparer$1.$default;
        this.descending = descending;
        this.parent = parent;
    };
    OrderedEnumerable.prototype = new Enumerable();

    OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, comparer, descending) {
        return new OrderedEnumerable(this.source, keySelector, comparer, descending, this);
    };

    OrderedEnumerable.prototype.thenBy = function (keySelector, comparer) {
        return this.createOrderedEnumerable(keySelector, comparer, false);
    };

    OrderedEnumerable.prototype.thenByDescending = function (keySelector, comparer) {
        return this.createOrderedEnumerable(keySelector, comparer, true);
    };

    OrderedEnumerable.prototype.getEnumerator = function () {
        var self = this;
        var buffer;
        var indexes;
        var index = 0;

        return new IEnumerator(
            function () {
                buffer = [];
                indexes = [];
                self.source.forEach(function (item, index) {
                    buffer.push(item);
                    indexes.push(index);
                });
                var sortContext = SortContext.create(self, null);
                sortContext.GenerateKeys(buffer);

                indexes.sort(function (a, b) { return sortContext.compare(a, b); });
            },
            function () {
                return (index < indexes.length)
                    ? this.yieldReturn(buffer[indexes[index++]])
                    : false;
            },
            Functions.Blank
        );
    };

    var SortContext = function (keySelector, comparer, descending, child) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.descending = descending;
        this.child = child;
        this.keys = null;
    };

    SortContext.create = function (orderedEnumerable, currentContext) {
        var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.comparer, orderedEnumerable.descending, currentContext);
        if (orderedEnumerable.parent != null) return SortContext.create(orderedEnumerable.parent, context);
        return context;
    };

    SortContext.prototype.GenerateKeys = function (source) {
        var len = source.length;
        var keySelector = this.keySelector;
        var keys = new Array(len);
        for (var i = 0; i < len; i++) keys[i] = keySelector(source[i]);
        this.keys = keys;

        if (this.child != null) this.child.GenerateKeys(source);
    };

    SortContext.prototype.compare = function (index1, index2) {
        var comparison = this.comparer.compare(this.keys[index1], this.keys[index2]);

        if (comparison == 0) {
            if (this.child != null) return this.child.compare(index1, index2);
            return Utils.compare(index1, index2);
        }

        return (this.descending) ? -comparison : comparison;
    };

    var DisposableEnumerable = function (getEnumerator, dispose) {
        this.dispose = dispose;
        Enumerable.call(this, getEnumerator);
    };
    DisposableEnumerable.prototype = new Enumerable();

    // optimize array or arraylike object

    var ArrayEnumerable = function (source) {
        this.getSource = function () { return source; };
    };
    ArrayEnumerable.prototype = new Enumerable();

    ArrayEnumerable.prototype.any = function (predicate) {
        return (predicate == null)
            ? (this.getSource().length > 0)
            : Enumerable.prototype.any.apply(this, arguments);
    };

    ArrayEnumerable.prototype.count = function (predicate) {
        return (predicate == null)
            ? this.getSource().length
            : Enumerable.prototype.count.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAt = function (index) {
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : Enumerable.prototype.elementAt.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : defaultValue;
    };

    ArrayEnumerable.prototype.first = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[0]
            : Enumerable.prototype.first.apply(this, arguments);
    };

    ArrayEnumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.firstOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[0] : defaultValue;
    };

    ArrayEnumerable.prototype.last = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[source.length - 1]
            : Enumerable.prototype.last.apply(this, arguments);
    };

    ArrayEnumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.lastOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[source.length - 1] : defaultValue;
    };

    ArrayEnumerable.prototype.skip = function (count) {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () { index = (count < 0) ? 0 : count; },
                function () {
                    return (index < source.length)
                        ? this.yieldReturn(source[index++])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.takeExceptLast = function (count) {
        if (count == null) count = 1;
        return this.take(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.takeFromLast = function (count) {
        return this.skip(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.reverse = function () {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () {
                    index = source.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(source[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.sequenceEqual = function (second, comparer) {
        if ((second instanceof ArrayEnumerable || second instanceof Array)
            && comparer == null
            && Enumerable.from(second).count() != this.count()) {
            return false;
        }

        return Enumerable.prototype.sequenceEqual.apply(this, arguments);
    };

    ArrayEnumerable.prototype.toJoinedString = function (separator, selector) {
        var source = this.getSource();
        if (selector != null || !(source instanceof Array)) {
            return Enumerable.prototype.toJoinedString.apply(this, arguments);
        }

        if (separator == null) separator = "";
        return source.join(separator);
    };

    ArrayEnumerable.prototype.getEnumerator = function () {
        return new Bridge.ArrayEnumerator(this.getSource());
    };

    // optimization for multiple where and multiple select and whereselect

    var WhereEnumerable = function (source, predicate) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1
    };
    WhereEnumerable.prototype = new Enumerable();

    WhereEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            var prevPredicate = this.prevPredicate;
            var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); };
            return new WhereEnumerable(this.prevSource, composedPredicate);
        }
        else {
            // if predicate use index, can't compose
            return Enumerable.prototype.where.call(this, predicate);
        }
    };

    WhereEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        return (selector.length <= 1)
            ? new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector)
            : Enumerable.prototype.select.call(this, selector);
    };

    WhereEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.getCurrent())) {
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    var WhereSelectEnumerable = function (source, predicate, selector) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1 or null
        this.prevSelector = selector; // selector.length always <= 1
    };
    WhereSelectEnumerable.prototype = new Enumerable();

    WhereSelectEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        return (predicate.length <= 1)
            ? new WhereEnumerable(this, predicate)
            : Enumerable.prototype.where.call(this, predicate);
    };

    WhereSelectEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            var prevSelector = this.prevSelector;
            var composedSelector = function (x) { return selector(prevSelector(x)); };
            return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
        }
        else {
            // if selector use index, can't compose
            return Enumerable.prototype.select.call(this, selector);
        }
    };

    WhereSelectEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var selector = this.prevSelector;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate == null || predicate(enumerator.getCurrent())) {
                        return this.yieldReturn(selector(enumerator.getCurrent()));
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    // Collections

    // dictionary = Dictionary<TKey, TValue[]>
    var Lookup = function (dictionary, order) {
        this.count = function () {
            return dictionary.getCount();
        };
        this.get = function (key) {
            var value = { v: null };
            var success = dictionary.tryGetValue(key, value);
            return Enumerable.from(success ? value.v : []);
        };
        this.contains = function (key) {
            return dictionary.containsKey(key);
        };
        this.toEnumerable = function () {
            return Enumerable.from(order).select(function (key) {
                return new Grouping(key, dictionary.get(key));
            });
        };
        this.getEnumerator = function () {
            return this.toEnumerable().getEnumerator();
        };
    };
    Lookup.$$inheritors = [Bridge.IEnumerable];

    var Grouping = function (groupKey, elements) {
        this.key = function () {
            return groupKey;
        };
        ArrayEnumerable.call(this, elements);
    };
    Grouping.prototype = new ArrayEnumerable();

    // module export
    if (typeof define === Types.Function && define.amd) { // AMD
        define("linqjs", [], function () { return Enumerable; });
    } else if (typeof module !== Types.Undefined && module.exports) { // Node
        module.exports = Enumerable;
    } else {
        root.Enumerable = Enumerable;
    }

    Bridge.Linq = {};
    Bridge.Linq.Enumerable = Enumerable;
})(Bridge.global);

    // @source End.js

    // module export
    if (typeof define === "function" && define.amd) {
        // AMD
        define("bridge", [], function () { return Bridge; });
    } else if (typeof module !== "undefined" && module.exports) {
        // Node
        module.exports = Bridge;
    }

})(this);

