(function (globals) {
    "use strict";

    Bridge.define('System.Drawing.Point', {
        x: 0,
        y: 0,
        constructor: function (x, y) {
            this.x = x;
            this.y = y;
        }
    });
    
    Bridge.define('System.Drawing.Size', {
        statics: {
            op_Equality: function (lhs, rhs) {
                if (lhs.height !== rhs.height || lhs.width !== rhs.width) {
                    return false;
                }
                return true;
            },
            op_Inequality: function (lhs, rhs) {
                if (lhs.height !== rhs.height || lhs.width !== rhs.width) {
                    return true;
                }
                return false;
            }
        },
        width: 0,
        height: 0,
        constructor: function (width, height) {
            this.width = width;
            this.height = height;
        },
        equals: function (obj) {
            if (obj.height !== this.height || obj.width !== this.width) {
                return false;
            }
            return true;
        },
        equals$1: function (obj) {
            if (Bridge.is(obj, System.Drawing.Size)) {
                var size = Bridge.cast(obj, System.Drawing.Size);
                if (size.height !== this.height || size.width !== this.width) {
                    return false;
                }
                else  {
                    return true;
                }
            }
            else  {
                return false;
            }
        },
        getHashCode: function () {
            return Bridge.getHashCode(this);
        }
    });
    
    
    
    Bridge.init();
})(this);
