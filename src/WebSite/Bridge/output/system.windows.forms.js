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
    
    Bridge.define('System.Windows.Forms.ComboBox.KendoComboBox', {
        dataTextField: null,
        dataValueField: null,
        dataSource: null,
        filter: null,
        suggest: false
    });
    
    Bridge.define('System.Windows.Forms.ComboBox.ListItem', {
        text: null,
        value: 0
    });
    
    Bridge.define('System.Windows.Forms.DateTimePicker.KendoDatePicker');
    
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
    
    Bridge.define('System.Windows.Forms.ImageLayout', {
        statics: {
            none: 0,
            center: 1,
            stretch: 2,
            tile: 3,
            zoom: 4
        },
        $enum: true
    });
    
    Bridge.define('System.Windows.Forms.KendoButton');
    
    Bridge.define('System.Windows.Forms.KendoMaskedTextBox');
    
    Bridge.define('System.Windows.Forms.KendoTabStrip');
    
    Bridge.define('System.Windows.Forms.ListViewItem');
    
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
    
    Bridge.define('System.Windows.Forms.Padding', {
        config: {
            properties: {
                Left: 0,
                Top: 0,
                Right: 0,
                Bottom: 0
            }
        },
        constructor$1: function (pad) {
            this.setLeft(pad);
            this.setRight(pad);
            this.setBottom(pad);
            this.setTop(pad);
        },
        constructor: function () {
    
        }
    });
    
    Bridge.define('System.Windows.Forms.PictureBoxSizeMode', {
        statics: {
            autoSize: 0,
            centerImage: 1,
            normal: 2,
            stretchImage: 3,
            zoom: 4
        },
        $enum: true
    });
    
    Bridge.define('System.Windows.Forms.TreeNode', {
        nodes: null,
        config: {
            properties: {
                Name: null,
                Text: null
            },
            init: function () {
                this.nodes = new Bridge.List$1(System.Windows.Forms.TreeNode)();
            }
        },
        constructor: function () {
    
        },
        constructor$1: function (name) {
            this.setName(name);
            this.setText(name);
        },
        constructor$2: function (name, nodes) {
            System.Windows.Forms.TreeNode.prototype.constructor$1.call(this, name);
    
            this.nodes.addRange(nodes);
        }
    });
    
    Bridge.define('System.Windows.Forms.WSEventArgs', {
        clientId: null,
        eventType: null,
        value: null
    });
    
    Bridge.define('System.Windows.Forms.Component', {
        inherits: [Bridge.IDisposable,System.Windows.Forms.IObservableItem],
        allEvents: null,
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
        hasEvent: function (name) {
            if (!Bridge.hasValue(this.allEvents)) {
                return false;
            }
    
            return Bridge.Linq.Enumerable.from(this.allEvents).contains(name);
        },
        raisePropertyChanged: function (propName, val) {
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
                                    if (Bridge.hasValue(this.PropertyChanged)) {
                                        this.PropertyChanged(this, new Bridge.PropertyChangedEventArgs(propName));
                                    }
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
        label: null,
        foreColor: null,
        font: null,
        backgroundImageLayout: 0,
        mPadding: null,
        renderLabel: true,
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
                this.mSize = new System.Drawing.Size(300, 300);
            }
        },
        getPadding: function () {
            return this.mPadding;
        },
        setPadding: function (value) {
            this.mPadding = Bridge.merge(new System.Windows.Forms.Padding(), JSON.parse(JSON.stringify(value)));
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
            return ((this.getLocation().x + this.getSize().width) | 0);
        },
        getBottom: function () {
            if (!Bridge.hasValue(this.getParent())) {
                return -1;
            }
            return ((this.getLocation().y + this.getSize().height) | 0);
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
        setText$1: function (elm) {
            if (!Bridge.String.isNullOrEmpty(this.foreColor)) {
                elm.style.color = this.foreColor;
            }
    
            if (!Bridge.String.isNullOrEmpty(this.font)) {
                var split = this.font.split(String.fromCharCode(44));
    
                elm.style.fontFamily = split[0];
    
                var size = Bridge.String.replaceAll(split[1], "pt", "");
                var fs = Bridge.Int.parseInt(size, -2147483648, 2147483647);
                fs = (fs + 5) | 0;
                elm.style.fontSize = fs + "px";
            }
    
            elm.innerHTML = this.getText();
        },
        setAttributes: function () {
            this.element.id = "WU_" + this.getClientId();
    
            this.element.style.backgroundColor = this.getBackColor();
            this.element.style.visibility = this.getVisible() ? "visible" : "hidden";
    
            if (Bridge.hasValue(this.getParent())) {
                var rightSet = false, leftSet = false, topSet = false, bottomSet = false;
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.right)) {
                    rightSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.left)) {
                    leftSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.top)) {
                    topSet = true;
                }
                if (Bridge.Enum.hasFlag(this.getAnchor(), System.Windows.Forms.AnchorStyles.bottom)) {
                    bottomSet = true;
                }
    
                if (topSet && !rightSet && !leftSet && !bottomSet) {
                    var width = this.getParent().getWidth();
                    this.getLocation().x = (((Bridge.Int.div(width, 2)) | 0) - (((Bridge.Int.div(this.getWidth(), 2)) | 0))) | 0;
                }
    
                if (bottomSet && topSet && !rightSet && !leftSet) {
                    var height = this.getParent().getHeight();
                    this.getLocation().y = (((Bridge.Int.div(height, 2)) | 0) - (((Bridge.Int.div(this.getHeight(), 2)) | 0))) | 0;
                }
    
                if (bottomSet && leftSet && !topSet && !rightSet) {
                    var height1 = this.getParent().getHeight();
                    this.getLocation().y = (height1 - this.getHeight()) | 0;
                }
    
                if (bottomSet && rightSet && !topSet && !leftSet) {
                    var width1 = this.getParent().getWidth();
                    this.getLocation().x = (width1 - this.getWidth()) | 0;
    
                    var height2 = this.getParent().getHeight();
                    this.getLocation().y = (height2 - this.getHeight()) | 0;
                }
    
                if (topSet && rightSet && !leftSet && !bottomSet) {
                    var width2 = this.getParent().getWidth();
                    this.getLocation().x = (width2 - this.getWidth()) | 0;
                }
    
                this.element.style.position = "absolute";
            }
            else  {
                this.element.style.position = "absolute";
            }
    
            switch (this.getDock()) {
                case System.Windows.Forms.DockStyle.none: 
                    this.element.style.width = this.getWidth() + "px";
                    this.element.style.height = this.getHeight() + "px";
                    this.element.style.top = this.getLocation().y + "px";
                    this.element.style.left = this.getLocation().x + "px";
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
    
            this.element.style.paddingTop = this.getPadding().getTop() + "px";
            this.element.style.paddingLeft = this.getPadding().getLeft() + "px";
            this.element.style.paddingRight = this.getPadding().getRight() + "px";
            this.element.style.paddingBottom = this.getPadding().getBottom() + "px";
    
            if (Bridge.hasValue(this.getParent())) {
                if ($(this.getParent().element).has(this.element).length === 0) {
                    this.getParent().element.appendChild(this.element);
                }
            }
            else  {
                this.element.style.height = "100%";
                this.element.style.width = "100%";
            }
    
            this.setupEventHandlers();
    
            if (this.renderLabel) {
                if (!Bridge.String.isNullOrEmpty(this.getText())) {
                    if (!Bridge.hasValue(this.label)) {
                        this.label = new System.Windows.Forms.Label();
                    }
                    this.setText$1(this.label.element);
                    if (this.hasEvent("TextChanged")) {
                        this.label.element.onchange = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f1);
                    }
                    this.element.appendChild(this.label.element);
                }
            }
    
            if (!Bridge.String.isNullOrEmpty(this.getBackgroundImage())) {
                $(this.element).css("background-image", "url('data:image/png;base64," + this.getBackgroundImage() + "')");
                switch (this.backgroundImageLayout) {
                    case System.Windows.Forms.ImageLayout.stretch: 
                        $(this.element).css("background-size", "cover");
                        break;
                }
            }
        },
        render: function () {
            var $t;
            this.setAttributes();
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
            }
    
            if (Bridge.hasValue(this.getParent())) {
                this.reAlignControls(this.getParent(), this);
            }
        },
        setupEventHandlers: function () {
            if (this.hasEvent("Click")) {
                this.element.onclick = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f2);
            }
    
            if (this.hasEvent("MouseMove")) {
                this.element.onmousemove = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f3);
            }
            ;
    
            if (this.hasEvent("MouseEnter")) {
                this.element.onmouseenter = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f4);
            }
            ;
    
            if (this.hasEvent("MouseLeave")) {
                this.element.onmouseleave = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f5);
            }
            ;
    
            if (this.hasEvent("TextChanged")) {
                this.element.onchange = Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f5);
            }
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
                                    ReVision.JSForms.Application.current.send(evt);
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
                        case "Button": 
                            var btn = Bridge.merge(new System.Windows.Forms.Button(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = btn;
                            break;
                        case "Label": 
                            var lbl = Bridge.merge(new System.Windows.Forms.Label(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = lbl;
                            break;
                        case "RadioButton": 
                            var rb = Bridge.merge(new System.Windows.Forms.RadioButton(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = rb;
                            break;
                        case "CheckBox": 
                            var cb = Bridge.merge(new System.Windows.Forms.CheckBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = cb;
                            break;
                        case "TabPage": 
                            var tp = Bridge.merge(new System.Windows.Forms.TabPage(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = tp;
                            break;
                        case "LinkLabel": 
                            var ll = Bridge.merge(new System.Windows.Forms.LinkLabel(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = ll;
                            break;
                        case "ComboBox": 
                            var cb1 = Bridge.merge(new System.Windows.Forms.ComboBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = cb1;
                            break;
                        case "DateTimePicker": 
                            var dtp = Bridge.merge(new System.Windows.Forms.DateTimePicker(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = dtp;
                            break;
                        case "GroupBox": 
                            var gb = Bridge.merge(new System.Windows.Forms.GroupBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = gb;
                            break;
                        case "Panel": 
                            var pn = Bridge.merge(new System.Windows.Forms.Panel(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = pn;
                            break;
                        case "TextBox": 
                            var tb = Bridge.merge(new System.Windows.Forms.TextBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = tb;
                            break;
                        case "MaskedTextBox": 
                            var mtb = Bridge.merge(new System.Windows.Forms.MaskedTextBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = mtb;
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
        raisePropertyChanged: function (propName, val) {
            var $step = 0,
                $task1, 
                $task2, 
                $jumpFromFinally, 
                $tcs = new Bridge.TaskCompletionSource(), 
                $returnValue, 
                $async_e, 
                $asyncBody = Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            $step = Bridge.Array.min([0,1,2], $step);
                            switch ($step) {
                                case 0: {
                                    $task1 = System.Windows.Forms.Component.prototype.raisePropertyChanged.call(this, propName, val);
                                    $step = 1;
                                    $task1.continueWith($asyncBody);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    
                                    $task2 = this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                                        clientId: this.getClientId(),
                                        eventType: "PropertyChanged",
                                        value: { name: propName, value: val }
                                    } ));
                                    $step = 2;
                                    $task2.continueWith($asyncBody);
                                    return;
                                }
                                case 2: {
                                    $task2.getAwaitedResult();
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
                        left = $(current.element).width();
                        $t = Bridge.getEnumerator(childControls);
                        while ($t.moveNext()) {
                            var child = $t.getCurrent();
                            if (child.getClientId() === current.getClientId()) {
                                break;
                            }
                            switch (child.getDock()) {
                                case System.Windows.Forms.DockStyle.left: 
                                    {
                                        var item = $(child.element);
                                        var ctrlWidth = item.width();
                                        item.css("left", (($(current.element).position().left + ctrlWidth) | 0));
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.top: 
                                case System.Windows.Forms.DockStyle.bottom: 
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var item1 = $(child.element);
                                        var ctrlWidth1 = item1.width();
                                        var ctrlLeft = item1.position().left;
                                        item1.css("left", ((ctrlLeft + left) | 0));
                                        item1.css("width", ((ctrlWidth1 - left) | 0));
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.right: 
                    {
                        right = $(current.element).width();
                        $t1 = Bridge.getEnumerator(childControls);
                        while ($t1.moveNext()) {
                            var child1 = $t1.getCurrent();
                            if (child1.getClientId() === current.getClientId()) {
                                break;
                            }
                            switch (child1.getDock()) {
                                case System.Windows.Forms.DockStyle.right: 
                                    {
                                        var item2 = $(child1.element);
                                        var ctrlWidth2 = item2.width();
                                        item2.css("left", (($(current.element).position().left - ctrlWidth2) | 0));
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.top: 
                                case System.Windows.Forms.DockStyle.bottom: 
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var item3 = $(child1.element);
                                        var ctrlWidth3 = item3.width();
    
                                        item3.css("width", ((ctrlWidth3 - right) | 0));
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.top: 
                    {
                        top = $(current.element).height();
                        $t2 = Bridge.getEnumerator(childControls);
                        while ($t2.moveNext()) {
                            var child2 = $t2.getCurrent();
                            if (child2.getClientId() === current.getClientId()) {
                                break;
                            }
                            switch (child2.getDock()) {
                                case System.Windows.Forms.DockStyle.top: 
                                    {
                                        var item4 = $(child2.element);
                                        var ctrlTop = item4.position().top;
                                        item4.css("top", ((ctrlTop + top) | 0));
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.left: 
                                case System.Windows.Forms.DockStyle.right: 
                                case System.Windows.Forms.DockStyle.fill: 
                                    {
                                        var item5 = $(child2.element);
                                        var ctrlTop1 = item5.position().top;
    
                                        var ctrlHeight = item5.height();
                                        item5.css("top", ((ctrlTop1 + top) | 0));
                                        item5.css("height", ((ctrlHeight - top) | 0));
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case System.Windows.Forms.DockStyle.bottom: 
                    {
                        bottom = $(current.element).height();
                        $t3 = Bridge.getEnumerator(childControls);
                        while ($t3.moveNext()) {
                            var child3 = $t3.getCurrent();
                            if (child3.getClientId() === current.getClientId()) {
                                break;
                            }
                            switch (child3.getDock()) {
                                case System.Windows.Forms.DockStyle.right: 
                                case System.Windows.Forms.DockStyle.fill: 
                                case System.Windows.Forms.DockStyle.left: 
                                    {
                                        var item6 = $(child3.element);
                                        item6.css("height", ((item6.height() - bottom) | 0));
                                    }
                                    break;
                                case System.Windows.Forms.DockStyle.bottom: 
                                    {
                                        var item7 = $(child3.element);
                                        var ctrlTop2 = child3.element.offsetTop;
                                        item7.css("top", ((ctrlTop2 - bottom) | 0));
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
                px = px.substr(0, ((px.length - 2) | 0));
            }
            return Bridge.Int.parseInt(px, -2147483648, 2147483647);
        }
    });
    
    var $_ = {};
    
    Bridge.ns("System.Windows.Forms.Control", $_)
    
    Bridge.apply($_.System.Windows.Forms.Control, {
        f1: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "textchanged",
                value: this.label.element.innerHTML
            } ));
        },
        f2: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "click"
            } ));
        },
        f3: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mousemove",
                value: e
            } ));
        },
        f4: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mouseenter",
                value: e
            } ));
        },
        f5: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mouseleave",
                value: e
            } ));
        }
    });
    
    Bridge.define('System.Windows.Forms.ToolStripItem', {
        inherits: [System.Windows.Forms.Component],
        config: {
            properties: {
                Name: null,
                Size: null,
                Text: null
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ButtonBase', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.ColumnHeader', {
        inherits: [System.Windows.Forms.Control],
        mColumnName: "Column Header",
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
    
        },
        constructor$1: function (width) {
            if (width === void 0) { width = 60; }
    
            System.Windows.Forms.ColumnHeader.prototype.constructor$2.call(this, null, width);
    
    
        },
        constructor$2: function (columnName, width) {
            if (width === void 0) { width = 60; }
    
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.setColumnName(columnName);
            this.setSize(new System.Drawing.Size(width, 0));
        },
        getColumnName: function () {
            return this.mColumnName;
        },
        setColumnName: function (value) {
            if (this.mColumnName !== value) {
                this.mColumnName = value;
                this.raisePropertyChanged("ColumnName", value);
            }
        },
        getText: function () {
            return this.getColumnName();
        },
        setText: function (value) {
            this.setColumnName(value);
        },
        getControlName: function () {
            return "ListViewColumn";
        }
    });
    
    Bridge.define('System.Windows.Forms.ComboBox', {
        inherits: [System.Windows.Forms.Control],
        items: null,
        cb: null,
        selectedIndex: 0,
        render: function () {
            if (!Bridge.hasValue(this.cb)) {
                this.cb = document.createElement('input');
                this.cb.id = "CB_" + this.getClientId();
                this.element.appendChild(this.cb);
            }
    
            //        for (var i = 0; i < obj.Items.length; i++)
            //        {
            //            var item = {
            //        text: obj.Items[i],
            //        value: i
            //            };
            //        ds.push(item);
            //    }
    
            //this.cb = $(this.ComboBox).kendoComboBox({
            //        dataTextField: "text",
            //    dataValueField: "value",
            //    dataSource: ds,
            //    filter: "contains",
            //    suggest: true,
            //    change: function(e) {
            //            var cmb = this;
            //            var evt = {
            //            ClientId: this.element[0].id,
            //            EventType: 'selectedIndexChanged',
            //            Value: cmb.selectedIndex
            //        };
            //        send(evt);
            //    }
            //});
    
            var arr = Bridge.Array.init(this.items.length, null);
    
            for (var i = 0; i < this.items.length; i = (i + 1) | 0) {
                arr[i] = Bridge.merge(new System.Windows.Forms.ComboBox.ListItem(), {
                    text: this.items[i],
                    value: i
                } );
            }
    
            var kb = $(this.cb).kendoComboBox({ dataTextField:"text", dataValueField:"value", filter:"contains", suggest:true, dataSource:arr, change: Bridge.fn.bind(this, $_.System.Windows.Forms.ComboBox.f1), index:this.selectedIndex });
    
            System.Windows.Forms.Control.prototype.render.call(this);
    
        }
    });
    
    Bridge.ns("System.Windows.Forms.ComboBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.ComboBox, {
        f1: function (e) {
            var cmd = e;
            this.selectedIndex = cmd.sender.selectedIndex;
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "selectedIndexChanged",
                value: cmd.sender.selectedIndex
            } ));
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
            }).firstOrDefault(null, null);
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
    
    Bridge.define('System.Windows.Forms.DateTimePicker', {
        inherits: [System.Windows.Forms.Control],
        dtp: null,
        config: {
            init: function () {
                this.value = new Date(-864e13);
            }
        },
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.value = new Date();
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            if (!Bridge.hasValue(this.dtp)) {
                this.dtp = document.createElement('input');
                this.element.appendChild(this.dtp);
            }
            this.dtp.value = this.value;
    
            $(this.dtp).kendoDatePicker({ change: Bridge.fn.bind(this, $_.System.Windows.Forms.DateTimePicker.f1), value: this.value });
        }
    });
    
    Bridge.ns("System.Windows.Forms.DateTimePicker", $_)
    
    Bridge.apply($_.System.Windows.Forms.DateTimePicker, {
        f1: function (e) {
            this.value = e.sender.value();
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "valueChanged",
                value: this.value
            } ));
        }
    });
    
    Bridge.define('System.Windows.Forms.Form', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        showDialog: function () {
            this.render();
        }
    });
    
    Bridge.define('System.Windows.Forms.Panel', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.Label', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = document.createElement('span');
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
            this.setText$1(this.element);
        }
    });
    
    Bridge.define('System.Windows.Forms.LinkLabel', {
        inherits: [System.Windows.Forms.Control],
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            $(this.element).css("cursor", "pointer");
    
            if (Bridge.String.isNullOrEmpty(this.font)) {
                this.label.element.style.color = "blue";
                this.label.element.style.textDecoration = "underline";
            }
    
            if (this.hasEvent("LinkClicked")) {
                this.element.onclick = Bridge.fn.bind(this, $_.System.Windows.Forms.LinkLabel.f1);
            }
            ;
        }
    });
    
    Bridge.ns("System.Windows.Forms.LinkLabel", $_)
    
    Bridge.apply($_.System.Windows.Forms.LinkLabel, {
        f1: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "linkClicked"
            } ));
        }
    });
    
    Bridge.define('System.Windows.Forms.ListControl', {
        inherits: [System.Windows.Forms.Control],
        items: null
    });
    
    Bridge.define('System.Windows.Forms.ListView', {
        inherits: [System.Windows.Forms.Control],
        columns: null
    });
    
    Bridge.define('System.Windows.Forms.TextBox', {
        inherits: [System.Windows.Forms.Control],
        multiline: false,
        passwordChar: null,
        textArea: null,
        inputElement: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        render: function () {
            if (this.multiline) {
                if (!Bridge.hasValue(this.textArea)) {
                    this.textArea = document.createElement('textarea');
                    this.element = this.textArea;
                }
                if (!Bridge.String.isNullOrEmpty(this.getText())) {
                    this.textArea.value = this.getText();
                }
            }
            else  {
                if (!Bridge.hasValue(this.inputElement)) {
                    this.inputElement = document.createElement('input');
                    this.element = this.inputElement;
                }
                if (Bridge.hasValue(this.passwordChar) && this.passwordChar.length > 0 && this.passwordChar.charCodeAt(0) !== 0) {
                    this.inputElement.type = "password";
                }
                this.inputElement.value = this.getText();
            }
            this.element.className = "k-textbox";
    
            System.Windows.Forms.Control.prototype.render.call(this);
        }
    });
    
    Bridge.define('System.Windows.Forms.MonthCalendar', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.PictureBox', {
        inherits: [System.Windows.Forms.Control],
        sizeMode: 0,
        image: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            this.updateImage();
        },
        updateImage: function () {
            if (Bridge.String.isNullOrEmpty(this.image)) {
                return;
            }
    
            var element = $(this.element);
            element.css("background-image", "url('data:image/png;base64," + this.image + "')");
            switch (this.sizeMode) {
                case System.Windows.Forms.PictureBoxSizeMode.normal: 
                    element.css("background-repeat", "no-repeat");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.autoSize: 
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.centerImage: 
                    element.css("background-repeat", "no-repeat");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.stretchImage: 
                    element.css("background-size", "cover");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.zoom: 
                    break;
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ProgressBar', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.RichTextBox', {
        inherits: [System.Windows.Forms.Control],
        readOnly: false,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = document.createElement('textarea');
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            var area = Bridge.cast(this.element, HTMLTextAreaElement);
            area.readOnly = this.readOnly;
            area.value = this.getText();
            area.style.overflowY = "auto";
        }
    });
    
    Bridge.define('System.Windows.Forms.ScrollableControl', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.SplitContainer', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.TabControl', {
        inherits: [System.Windows.Forms.Control],
        selectedIndex: 0,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = document.createElement('div');
        },
        render: function () {
            var $t, $t1;
            this.setAttributes();
            this.element.style.borderStyle = "none";
            var ul = document.createElement('ul');
            this.element.appendChild(ul);
            var index = 0;
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var child = $t.getCurrent();
                var tp = Bridge.as(child, System.Windows.Forms.TabPage);
                if (Bridge.hasValue(tp)) {
                    if (this.selectedIndex === index) {
                        tp.setIsSelected(true);
                    }
                    tp.renderTabs(ul);
                    index = (index + 1) | 0;
                }
            }
    
            $t1 = Bridge.getEnumerator(this.getControls());
            while ($t1.moveNext()) {
                var child1 = $t1.getCurrent();
                child1.render();
            }
    
            $(this.element).kendoTabStrip({animation:{open:{effects: 'none'}}});
    
            //int i = 0;
            //foreach(var ctrl in this.GetControls())
            //{
            //    var li = new Bridge.Html5.LIElement();
            //    if (i == this.SelectedIndex)
            //    {
            //        li.ClassName = "k-state-active";
            //    }
            //    i++;
            //    ul.AppendChild(li);
            //}
            //this.Element.AppendChild(ul);
            //        for (var i = 0; i < obj.Controls.length; i++)
            //        {
            //            var div = document.createElement('div');
            //            var size = obj.Controls[i].Size.split(',');
            //            div.style.height = size[1] + 'px';
            //            var newElement = createNewElement(obj.Controls[i], div);
            //            controls[obj.ClientId].children.push(newElement);
            //            this.Element.appendChild(div);
            //        }
    
            //$(this.Element).kendoTabStrip({
            //            show: function(e) {
            //                var selectedIndex = $(e.item).index();
            //                var evt = {
            //            ClientId: this.element[0].id,
            //            EventType: 'selectedIndexChanged',
            //            Value: selectedIndex
            //               };
            //            send(evt);
            //        }
            //    });
        }
    });
    
    Bridge.define('System.Windows.Forms.TabPage', {
        inherits: [System.Windows.Forms.Control],
        isLoaded: false,
        li: null,
        config: {
            properties: {
                IsSelected: false
            }
        },
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
    
        },
        render: function () {
            var $t;
            this.element.style.width = (((this.getParent().getWidth() - 27) | 0)) + "px";
            this.element.style.height = (((this.getParent().getHeight() - 35) | 0)) + "px";
            this.element.style.position = "relative";
            if (!this.isLoaded) {
                this.getParent().element.appendChild(this.element);
                this.isLoaded = true;
            }
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
            }
        },
        renderTabs: function (parent) {
            if (!Bridge.hasValue(this.li)) {
                this.li = document.createElement('li');
                this.li.id = "LI_" + this.getClientId();
                parent.appendChild(this.li);
            }
            this.li.innerHTML = this.getText();
            if (this.getIsSelected()) {
                this.li.className = "k-state-active";
            }
            else  {
                this.li.className = "";
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ToolStripLabel', {
        inherits: [System.Windows.Forms.ToolStripItem]
    });
    
    Bridge.define('System.Windows.Forms.ToolStripMenuItem', {
        inherits: [System.Windows.Forms.ToolStripItem]
    });
    
    Bridge.define('System.Windows.Forms.TreeView', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.Button', {
        inherits: [System.Windows.Forms.ButtonBase],
        constructor: function () {
            System.Windows.Forms.ButtonBase.prototype.$constructor.call(this);
    
            this.element = document.createElement('button');
        },
        render: function () {
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
    
            $(this.element).kendoButton();
        }
    });
    
    Bridge.define('System.Windows.Forms.CheckBox', {
        inherits: [System.Windows.Forms.ButtonBase],
        rb: null,
        config: {
            properties: {
                Checked: false
            }
        },
        render: function () {
            var elm = $(this.element);
    
            elm.css("cursor", "pointer");
    
            if (!Bridge.hasValue(this.rb)) {
                this.rb = document.createElement('input');
                this.element.appendChild(this.rb);
            }
            this.rb.id = "RB_" + this.getClientId();
            this.rb.type = "checkbox";
            this.rb.name = this.getParent().getClientId() + "rb_group";
            this.rb.checked = this.getChecked();
    
            this.rb.onchange = Bridge.fn.bind(this, $_.System.Windows.Forms.CheckBox.f1);
    
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
    
            this.element.onclick = Bridge.fn.bind(this, $_.System.Windows.Forms.CheckBox.f2);
    
        }
    });
    
    Bridge.ns("System.Windows.Forms.CheckBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.CheckBox, {
        f1: function (e) {
            this.setChecked(this.rb.checked);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "checkChanged",
                value: this.rb.checked
            } ));
        },
        f2: function (e) {
            this.rb.checked = !this.rb.checked;
            if (this.hasEvent("Click")) {
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "click"
                } ));
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.GroupBox', {
        inherits: [System.Windows.Forms.Panel],
        constructor: function () {
            System.Windows.Forms.Panel.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        render: function () {
            System.Windows.Forms.Panel.prototype.render.call(this);
            this.element.style.borderStyle = "solid";
            this.element.style.borderWidth = "thin";
            this.element.style.borderColor = "gray";
    
            if (!Bridge.hasValue(this.label)) {
                this.label = new System.Windows.Forms.Label();
                this.element.appendChild(this.label.element);
            }
            this.label.element.style.top = "-6px";
            this.label.element.style.left = "10px";
            this.label.element.style.paddingLeft = "2px";
            this.label.element.style.paddingRight = "2px";
            this.label.element.style.backgroundColor = "white";
            this.label.element.style.position = "relative";
            this.setText$1(this.label.element);
            if (this.hasEvent("TextChanged")) {
                this.label.element.onchange = Bridge.fn.bind(this, $_.System.Windows.Forms.GroupBox.f1);
            }
        }
    });
    
    Bridge.ns("System.Windows.Forms.GroupBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.GroupBox, {
        f1: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "textchanged",
                value: this.label.element.innerHTML
            } ));
        }
    });
    
    Bridge.define('System.Windows.Forms.ListBox', {
        inherits: [System.Windows.Forms.ListControl]
    });
    
    Bridge.define('System.Windows.Forms.MaskedTextBox', {
        inherits: [System.Windows.Forms.TextBox],
        mask: null,
        render: function () {
            System.Windows.Forms.TextBox.prototype.render.call(this);
            $(this.element).kendoMaskedTextBox({mask:this.mask});
        }
    });
    
    Bridge.define('System.Windows.Forms.RadioButton', {
        inherits: [System.Windows.Forms.ButtonBase],
        rb: null,
        config: {
            properties: {
                Checked: false
            }
        },
        render: function () {
            var elm = $(this.element);
    
            elm.css("cursor", "pointer");
    
            if (!Bridge.hasValue(this.rb)) {
                this.rb = document.createElement('input');
                this.element.appendChild(this.rb);
            }
            this.rb.id = "RB_" + this.getClientId();
            this.rb.type = "radio";
            this.rb.name = this.getParent().getClientId() + "rb_group";
            this.rb.checked = this.getChecked();
    
            this.rb.onchange = Bridge.fn.bind(this, $_.System.Windows.Forms.RadioButton.f1);
    
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
    
            this.element.onclick = Bridge.fn.bind(this, $_.System.Windows.Forms.RadioButton.f2);
        }
    });
    
    Bridge.ns("System.Windows.Forms.RadioButton", $_)
    
    Bridge.apply($_.System.Windows.Forms.RadioButton, {
        f1: function (e) {
            this.setChecked(this.rb.checked);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "checkChanged",
                value: this.rb.checked
            } ));
        },
        f2: function (e) {
            if (!this.rb.checked) {
                this.rb.checked = true;
            }
    
            if (this.hasEvent("Click")) {
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "click"
                } ));
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ToolStrip', {
        inherits: [System.Windows.Forms.ScrollableControl]
    });
    
    Bridge.define('System.Windows.Forms.ToolStripStatusLabel', {
        inherits: [System.Windows.Forms.ToolStripLabel],
        getControlName: function () {
            return "ToolStripStatusLabel";
        }
    });
    
    Bridge.define('System.Windows.Forms.StatusStrip', {
        inherits: [System.Windows.Forms.ToolStrip]
    });
    
    Bridge.define('System.Windows.Forms.ToolStripDropDown', {
        inherits: [System.Windows.Forms.ToolStrip]
    });
    
    Bridge.init();
})(this);
