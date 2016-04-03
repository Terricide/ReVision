(function (globals) {
    "use strict";

    Bridge.define('System.Collections.Specialized.NotifyCollectionChangedAction', {
        statics: {
            add: 0,
            remove: 1,
            replace: 2,
            move: 3,
            reset: 4
        },
        $enum: true
    });
    
    Bridge.define('System.Collections.Specialized.NotifyCollectionChangedEventArgs$1', function (T) { return {
        config: {
            properties: {
                Action: 0,
                NewItems: null,
                NewStartingIndex: 0,
                OldItems: null,
                OldStartingIndex: 0
            }
        },
        constructor: function (action) {
    
        },
        constructor$6: function (action, changedItem) {
    
        },
        constructor$1: function (action, changedItems) {
    
        },
        constructor$7: function (action, changedItem, index) {
    
        },
        constructor$4: function (action, changedItems, startingIndex) {
    
        },
        constructor$9: function (action, newItem, oldItem) {
    
        },
        constructor$2: function (action, newItems, oldItems) {
    
        },
        constructor$10: function (action, newItem, oldItem, index) {
    
        },
        constructor$3: function (action, newItems, oldItems, startingIndex) {
    
        },
        constructor$8: function (action, changedItem, index, oldIndex) {
    
        },
        constructor$5: function (action, changedItems, index, oldIndex) {
    
        }
    }; });
    
    
    
    Bridge.init();
})(this);
