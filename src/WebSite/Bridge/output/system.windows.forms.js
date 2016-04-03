(function (globals) {
    "use strict";

    Bridge.define('System.Windows.Forms.AnchorStyles', {
        statics: {
            none: 0,
            left: 1,
            top: 2,
            right: 4,
            bottom: 8
        },
        $enum: true,
        $flags: true
    });
    
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
    
    Bridge.define('System.Windows.Forms.DockStyle', {
        statics: {
            none: 0,
            left: 1,
            right: 2,
            top: 3,
            bottom: 4,
            fill: 5
        },
        $enum: true
    });
    
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
                Disposed: null,
                ObservableItemPropertyChanged: null,
                PropertyChanged: null
            },
            properties: {
                ControlName: null,
                Tag: null
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
        }
    });
    
    Bridge.define('System.Windows.Forms.Control', {
        inherits: [System.Windows.Forms.Component],
        element: null,
        labelElement: null,
        mBackColor: null,
        controls: null,
        mAnchor: 3,
        mControls: null,
        mDock: 0,
        mText: null,
        mLocation: null,
        mSize: null,
        mVisible: true,
        config: {
            events: {
                Resize: null,
                Click: null,
                TextChanged: null
            },
            properties: {
                Parent: null,
                ParentId: null,
                BackgroundImage: null,
                TabIndex: 0,
                Name: null,
                AutoSize: false
            },
            init: function () {
                this.element = document.createElement('div');
                this.labelElement = document.createElement('span');
                this.mSize = new System.Drawing.Size(300, 300);
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
        getAnchor: function () {
            return this.mAnchor;
        },
        setAnchor: function (value) {
            if (this.mAnchor !== value) {
                this.mAnchor = value;
                this.raisePropertyChanged("Anchor", value);
            }
        },
        getDock: function () {
            return this.mDock;
        },
        setDock: function (value) {
            if (this.mDock !== value) {
                this.mDock = value;
                this.raisePropertyChanged("Dock", value);
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
        getLocation: function () {
            return this.mLocation;
        },
        setLocation: function (value) {
            if (this.mLocation !== value) {
                this.mLocation = value;
                this.raisePropertyChanged("Location", value);
            }
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
            return this.getLocation().x + this.getSize().width;
        },
        getBottom: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().y + this.getSize().height;
        },
        getTop: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().y;
        },
        getLeft: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return this.getLocation().x;
        },
        getWidth: function () {
            return this.getSize().width;
        },
        getHeight: function () {
            return this.getSize().height;
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
    
            this.element.style.backgroundColor = this.getBackColor();
            this.labelElement.innerHTML = this.getText();
            this.element.style.visibility = this.getVisible() ? "visible" : "hidden";
    
            if (Bridge.hasValue(this.getParent())) {
                var rightSet = false, leftSet = false, topSet = false, bottomSet = false;
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.right)) {
                    rightSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.left)) {
                    leftSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.bottom)) {
                    topSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.top)) {
                    bottomSet = true;
                }
    
                if (topSet && !rightSet && !leftSet && !bottomSet) {
                    var width = this.getParent().getWidth();
                    this.getLocation().x = Bridge.Int.div(width, 2) - (Bridge.Int.div(this.getWidth(), 2));
                }
    
                if (bottomSet && topSet && !rightSet && !leftSet) {
                    var height = this.getParent().getHeight();
                    this.getLocation().y = Bridge.Int.div(height, 2) - (Bridge.Int.div(this.getHeight(), 2));
                }
    
                if (bottomSet && leftSet && !topSet && !rightSet) {
                    var height1 = this.getParent().getHeight();
                    this.getLocation().y = height1 - this.getHeight();
                }
    
                if (bottomSet && rightSet && !topSet && !leftSet) {
                    var width1 = this.getParent().getWidth();
                    this.getLocation().x = width1 - this.getWidth();
    
                    var height2 = this.getParent().getHeight();
                    this.getLocation().y = height2 - this.getHeight();
                }
    
                if (topSet && rightSet && !leftSet && !bottomSet) {
                    var width2 = this.getParent().getWidth();
                    this.getLocation().x = width2 - this.getWidth();
                }
    
    
                if (this.getDock() !== System.Windows.Forms.DockStyle.fill) {
                    this.element.style.position = "absolute";
                }
                else  {
                    this.element.style.position = "relative";
                }
            }
            else  {
                this.element.style.position = "absolute";
            }
    
            switch (this.getDock()) {
                case System.Windows.Forms.DockStyle.none: 
                    this.element.style.width = this.getWidth() + "px";
                    this.element.style.height = this.getHeight() + "px";
                    this.element.style.top = this.getLocation().x + "px";
                    this.element.style.left = this.getLocation().y + "px";
                    break;
                case System.Windows.Forms.DockStyle.left: 
                    this.element.style.left = "0px";
                    this.element.style.width = this.getWidth() + "px";
                    this.element.style.height = "100%";
                    break;
                case System.Windows.Forms.DockStyle.right: 
                    this.element.style.right = "0px";
                    this.element.style.width = this.getWidth() + "px";
                    this.element.style.height = "100%";
                    break;
                case System.Windows.Forms.DockStyle.top: 
                    this.element.style.top = "0px";
                    this.element.style.height = this.getHeight() + "px";
                    this.element.style.width = "100%";
                    break;
                case System.Windows.Forms.DockStyle.bottom: 
                    this.element.style.bottom = "0px";
                    this.element.style.height = this.getHeight() + "px";
                    this.element.style.width = "100%";
                    break;
                case System.Windows.Forms.DockStyle.fill: 
                    this.element.style.right = "0px";
                    this.element.style.bottom = "0px";
                    this.element.style.left = "0px";
                    this.element.style.top = "0px";
                    this.element.style.height = "100%";
                    this.element.style.width = "100%";
                    break;
            }
    
            if (Bridge.hasValue(this.getParent())) {
                this.getParent().element.appendChild(this.element);
            }
            else  {
                this.element.style.height = "100%";
                this.element.style.width = "100%";
            }
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
            }
    
            if (Bridge.hasValue(this.getParent())) {
                this.reAlignControls(this.getParent(), this);
            }
        },
        getControls: function () {
            var $t;
            if (!Bridge.hasValue(this.mControls)) {
                this.mControls = new Bridge.List$1(System.Windows.Forms.Control)();
                if (this.controls.length === 0) {
                    return this.mControls;
                }
                $t = Bridge.getEnumerator(this.controls);
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
                    this.mControls.add(ctrl1);
                }
            }
    
            return this.mControls;
        },
        reAlignControls: function (parent, current) {
            var $t, $t1, $t2, $t3;
            var childControls = parent.getControls();
    
            var top = 0;
            var left = 0;
            var bottom = 0;
            var right = 0;
    
            switch (current.getDock()) {
                case System.Windows.Forms.DockStyle.left: 
                    {
                        left = current.getWidth();
                        $t = Bridge.getEnumerator(childControls);
                        while ($t.moveNext()) {
                            var child = $t.getCurrent();
                            if (child.getClientId() === current.getClientId()) {
                                continue;
                            }
                            switch (child.getDock()) {
                                case System.Windows.Forms.DockStyle.bottom: 
                                case System.Windows.Forms.DockStyle.top: 
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var ctrlWidth = this.getInt(child.element.style.width);
                                        var ctrlLeft = this.getInt(child.element.style.left);
                                        child.element.style.left = ctrlLeft + left + "px";
                                        child.element.style.width = ctrlWidth - ctrlLeft - left + "px";
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.right: 
                    {
                        right = current.getWidth();
                        $t1 = Bridge.getEnumerator(childControls);
                        while ($t1.moveNext()) {
                            var child1 = $t1.getCurrent();
                            if (child1.getClientId() === current.getClientId()) {
                                continue;
                            }
                            switch (child1.getDock()) {
                                case System.Windows.Forms.DockStyle.top: 
                                case System.Windows.Forms.DockStyle.bottom: 
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var ctrlWidth1 = this.getInt(child1.element.style.width);
                                        var ctrlLeft1 = this.getInt(child1.element.style.left);
                                        var newWidth = ctrlWidth1 - right - ctrlLeft1;
                                        child1.element.style.width = newWidth + "px";
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.top: 
                    {
                        top = current.getHeight();
                        $t2 = Bridge.getEnumerator(childControls);
                        while ($t2.moveNext()) {
                            var child2 = $t2.getCurrent();
                            if (child2.getClientId() === current.getClientId()) {
                                continue;
                            }
                            switch (child2.getDock()) {
                                case System.Windows.Forms.DockStyle.top: 
                                    {
                                        var ctrlTop = this.getInt(child2.element.style.top);
                                        child2.element.style.top = ctrlTop + top + "px";
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var ctrlTop1 = this.getInt(child2.element.style.top);
                                        var ctrlHeight = this.getInt(child2.element.style.height);
                                        child2.element.style.top = ctrlTop1 + top + "px";
                                        child2.element.style.height = ctrlHeight - top + "px";
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.bottom: 
                    {
                        bottom = current.getHeight();
                        $t3 = Bridge.getEnumerator(childControls);
                        while ($t3.moveNext()) {
                            var child3 = $t3.getCurrent();
                            if (child3.getClientId() === current.getClientId()) {
                                continue;
                            }
                            switch (child3.getDock()) {
                                case System.Windows.Forms.DockStyle.bottom: 
                                    {
                                        var ctrlTop2 = this.getInt(child3.element.style.top); //.offsetTop;
                                        child3.element.style.top = ctrlTop2 - bottom + "px";
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var ctrlHeight1 = this.getInt(child3.element.style.height);
                                        child3.element.style.height = ctrlHeight1 - bottom + "px";
                                    }
                                    break;
                            }
                        }
                    }
                    break;
            }
    
        },
        getInt: function (px) {
            if (Bridge.String.endsWith(px, "px")) {
                px = px.substr(0, px.length - 2);
            }
            return Bridge.Int.parseInt(px, -2147483648, 2147483647);
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
