(function (globals) {
    "use strict";

    Bridge.define('Edges', {
        statics: {
            north: 0,
            west: 1,
            south: 2,
            east: 3,
            center: 4
        },
        $enum: true
    });
    
    
    
    Bridge.init();
})(this);
