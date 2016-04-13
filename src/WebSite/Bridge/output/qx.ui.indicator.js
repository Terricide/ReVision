(function (globals) {
    "use strict";

    Bridge.define('qx.ui.indicator.ProgressBar', {
        inherits: [qx.ui.container.Composite],
        config: {
            properties: {
                Value: 0,
                Maximum: 0
            }
        }
    });
    
    
    
    Bridge.init();
})(this);
