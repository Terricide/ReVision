(function (globals) {
    "use strict";

    Bridge.define('System.Windows.Forms.AutoScaleMode', {
        statics: {
            none: 0,
            font: 1,
            dpi: 2,
            inherit: 3
        },
        $enum: true
    });
    
    Bridge.define('System.Windows.Forms.IObservableItem');
    
    Bridge.define('System.Windows.Forms.ObservableItemPropertyChangedArgs', {
        property: null,
        subject: null,
        constructor: function (strProperty) {
            this.property = strProperty;
        },
        constructor$1: function (strProperty, objSubject) {
            System.Windows.Forms.ObservableItemPropertyChangedArgs.prototype.$constructor.call(this, strProperty);
    
            this.subject = objSubject;
        },
        getProperty: function () {
            return this.property;
        },
        getSubject: function () {
            return this.subject;
        }
    });
    
    Bridge.define('System.Windows.Forms.WSEventArgs', {
        clientId: null,
        eventType: null,
        value: null
    });
    
    Bridge.define('System.Windows.Forms.Component', {
        inherits: [Bridge.IDisposable,System.Windows.Forms.IObservableItem],
        mClientId: null,
        config: {
            events: {
                PropertyChanged: null,
                Disposed: null,
                ObservableItemPropertyChanged: null
            },
            properties: {
                Tag: null,
                ControlName: null
            }
        },
        getClientId: function () {
            return this.mClientId;
        },
        setClientId: function (value) {
            if (this.mClientId !== value) {
                this.mClientId = value;
                this.raisePropertyChanged("ClientId", value);
            }
        },
        raisePropertyChanged: function (propName, val) {
            var $step = 0,
                $task1, 
                $jumpFromFinally, 
                $tcs = new Bridge.TaskCompletionSource(), 
                $returnValue, 
                $async_e, 
                $asyncBody = Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            $step = Bridge.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    if (Bridge.hasValue(this.PropertyChanged)) {
                                        this.PropertyChanged(this, new Bridge.PropertyChangedEventArgs(propName));
                                    }
                                    
                                    $task1 = this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                                        clientId: this.getClientId(),
                                        eventType: "PropertyChanged",
                                        value: { name: propName, value: val }
                                    } ));
                                    $step = 1;
                                    $task1.continueWith($asyncBody);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    $tcs.setResult(null);
                                    return;
                                }
                                default: {
                                    $tcs.setResult(null);
                                    return;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = Bridge.Exception.create($async_e1);
                        $tcs.setException($async_e);
                    }
                }, arguments);
    
            $asyncBody();
            return $tcs.task;
        },
        dispose: function () {
            throw new Bridge.NotImplementedException();
        },
        fireEvent: function (evt) {
            var $step = 0,
                $jumpFromFinally, 
                $tcs = new Bridge.TaskCompletionSource(), 
                $returnValue, 
                $async_e, 
                $asyncBody = Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            $step = Bridge.Array.min([0], $step);
                            switch ($step) {
                                case 0: {
                                    $tcs.setResult(null);
                                    return;
                                }
                                default: {
                                    $tcs.setResult(null);
                                    return;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = Bridge.Exception.create($async_e1);
                        $tcs.setException($async_e);
                    }
                }, arguments);
    
            $asyncBody();
            return $tcs.task;
        }
    });
    
    Bridge.define('System.Windows.Forms.Control', {
        inherits: [System.Windows.Forms.Component],
        mText: null,
        mSize: null,
        mVisible: true,
        element: null,
        mBackColor: null,
        config: {
            events: {
                Resize: null,
                Click: null,
                TextChanged: null
            },
            properties: {
                TabIndex: 0,
                Name: null,
                AutoSize: false,
                Location: null,
                Parent: null,
                ParentId: null,
                BackgroundImage: null,
                Controls: null
            },
            init: function () {
                this.mSize = new System.Drawing.Size(300, 300);
                this.element = document.createElement('div');
            }
        },
        getText: function () {
            return this.mText;
        },
        setText: function (value) {
            if (this.mText !== value) {
                this.mText = value;
                this.raisePropertyChanged("Text", value);
                if (Bridge.hasValue(this.TextChanged)) {
                    this.TextChanged(this, Object.empty);
                }
            }
        },
        getHandle: function () {
            return Bridge.Convert.toInt32(this.getClientId());
        },
        getSize: function () {
            return this.mSize;
        },
        setSize: function (value) {
            if (System.Drawing.Size.op_Inequality(this.mSize, value)) {
                this.mSize = value;
                this.raisePropertyChanged("Size", value);
                if (Bridge.hasValue(this.Resize)) {
                    this.Resize(this, Object.empty);
                }
            }
        },
        getRight: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().getX() + this.getSize().width;
        },
        getBottom: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().getY() + this.getSize().height;
        },
        getTop: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().getY();
        },
        setTop: function (value) {
            this.setLocation(new System.Drawing.Point(this.getTop(), value));
        },
        getLeft: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().getX();
        },
        setLeft: function (value) {
            this.setLocation(new System.Drawing.Point(value, this.getTop()));
        },
        getWidth: function () {
            return this.getSize().width;
        },
        setWidth: function (value) {
            this.setSize(new System.Drawing.Size(value, this.getHeight()));
        },
        getHeight: function () {
            return this.getSize().height;
        },
        setHeight: function (value) {
            this.setSize(new System.Drawing.Size(this.getWidth(), value));
        },
        getClientSize: function () {
            return this.getSize();
        },
        getVisible: function () {
            return this.mVisible;
        },
        setVisible: function (value) {
            if (this.mVisible !== value) {
                this.mVisible = value;
                this.raisePropertyChanged("Visible", value);
            }
        },
        getBackColor: function () {
            return this.mBackColor;
        },
        setBackColor: function (value) {
            if (this.mBackColor !== value) {
                this.mBackColor = value;
                this.raisePropertyChanged("BackColor", value);
            }
        },
        controls_CollectionChanged: function (sender, e) {
            var $t, $t1;
            if (e.getAction() === System.Collections.Specialized.NotifyCollectionChangedAction.add) {
                $t = Bridge.getEnumerator(e.getNewItems());
                while ($t.moveNext()) {
                    var ctrl = $t.getCurrent();
                    ctrl.setParent(this);
                }
            }
            else  {
                if (e.getAction() === System.Collections.Specialized.NotifyCollectionChangedAction.remove) {
                    $t1 = Bridge.getEnumerator(e.getOldItems());
                    while ($t1.moveNext()) {
                        var ctrl1 = $t1.getCurrent();
    
                    }
                }
            }
        },
        render: function () {
            var $t;
            this.element.id = "WU_" + this.getClientId();
    
            if (Bridge.hasValue(this.getParent())) {
                this.getParent().element.appendChild(this.element);
            }
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                var ctrl1 = Bridge.merge(new System.Windows.Forms.Control(), JSON.parse(JSON.stringify(ctrl)));
                switch (ctrl1.getControlName()) {
                    case "TabControl": 
                        var tc = Bridge.merge(new System.Windows.Forms.TabControl(), JSON.parse(JSON.stringify(ctrl)));
                        ctrl1 = tc;
                        break;
                    default: 
                        ctrl1 = Bridge.merge(new System.Windows.Forms.Control(), JSON.parse(JSON.stringify(ctrl)));
                        break;
                }
    
                ctrl1.setParent(this);
                ctrl1.render();
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ControlsCollection', {
        inherits: [Bridge.List$1(System.Windows.Forms.Control)],
        config: {
            events: {
                CollectionChanged: null
            },
            properties: {
                Parent: null
            }
        },
        constructor: function (parent) {
            Bridge.List$1(System.Windows.Forms.Control).prototype.$constructor.call(this);
    
            this.setParent(parent);
            this.addCollectionChanged(Bridge.fn.bind(this, this.controlsCollection_CollectionChanged1));
        },
        getItem$1: function (ctrlName) {
            return Bridge.Linq.Enumerable.from(this).where(function (n) {
                return n.getName() === ctrlName;
            }).firstOrDefault(null, Bridge.getDefaultValue(System.Windows.Forms.Control));
        },
        controlsCollection_CollectionChanged1: function (sender, e) {
            var $t, $t1;
            if (e.getAction() === System.Collections.Specialized.NotifyCollectionChangedAction.add) {
                $t = Bridge.getEnumerator(e.getNewItems());
                while ($t.moveNext()) {
                    var ctrl = $t.getCurrent();
                    ctrl.setParent(this.getParent());
                }
            }
            else  {
                if (e.getAction() === System.Collections.Specialized.NotifyCollectionChangedAction.remove) {
                    $t1 = Bridge.getEnumerator(e.getOldItems());
                    while ($t1.moveNext()) {
                        var ctrl1 = $t1.getCurrent();
                        ctrl1.setParent(null);
                    }
                }
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.Form', {
        inherits: [System.Windows.Forms.Control],
        showDialog: function () {
            this.render();
        }
    });
    
    Bridge.define('System.Windows.Forms.TabControl', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.init();
})(this);
