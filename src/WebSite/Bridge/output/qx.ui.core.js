(function (globals) {
    "use strict";

    Bridge.define('qx.ui.core.Bounds', {
        statics: {
            getDefaultValue: function () { return new qx.ui.core.Bounds(); }
        },
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        constructor: function () {
        },
        getHashCode: function () {
            var hash = 17;
            hash = hash * 23 + (this.left == null ? 0 : Bridge.getHashCode(this.left));
            hash = hash * 23 + (this.top == null ? 0 : Bridge.getHashCode(this.top));
            hash = hash * 23 + (this.width == null ? 0 : Bridge.getHashCode(this.width));
            hash = hash * 23 + (this.height == null ? 0 : Bridge.getHashCode(this.height));
            return hash;
        },
        equals: function (o) {
            if (!Bridge.is(o,qx.ui.core.Bounds)) {
                return false;
            }
            return Bridge.equals(this.left, o.left) && Bridge.equals(this.top, o.top) && Bridge.equals(this.width, o.width) && Bridge.equals(this.height, o.height);
        },
        $clone: function (to) {
            var s = to || new qx.ui.core.Bounds();
            s.left = this.left;
            s.top = this.top;
            s.width = this.width;
            s.height = this.height;
            return s;
        }
    });
    
    
    
    Bridge.init();
})(this);
