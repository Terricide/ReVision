(function (globals) {
    "use strict";

    Bridge.define('qx.qxevent.type.KeyModifiers', {
        statics: {
            none: 0,
            shift: 1,
            ctrl: 2,
            alt: 4,
            meta: 8
        },
        $enum: true,
        $flags: true
    });
    
    
    
    Bridge.init();
})(this);
