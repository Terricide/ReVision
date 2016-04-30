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
    
    Bridge.define('System.Windows.Forms.CheckedListBox.CheckedItem', {
        config: {
            properties: {
                Checked: false,
                Name: null
            }
        }
    });
    
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
    
    Bridge.define('System.Windows.Forms.Fancytree');
    
    Bridge.define('System.Windows.Forms.FormStartPosition', {
        statics: {
            windowsDefaultLocation: 0,
            centerParent: 1,
            centerScreen: 2,
            manual: 3,
            windowsDefaultBounds: 4
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
    
    Bridge.define('System.Windows.Forms.KendoGrid', {
        height: 0,
        width: 0,
        autoBind: false,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: null,
        dataSource: null,
        config: {
            init: function () {
                this.pageable = new System.Windows.Forms.KendoGrid.KendoGuidPageable();
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.KendoGrid.KendoGridDataSource', {
        data: null,
        pageSize: 0,
        schema: null,
        config: {
            init: function () {
                this.schema = new System.Windows.Forms.KendoGrid.KendoGridDataSource.KendoGridDataSourceSchema();
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.KendoGrid.KendoGridDataSource.KendoGridDataSourceSchema', {
        model: null,
        config: {
            init: function () {
                this.model = new System.Windows.Forms.KendoGrid.KendoGridDataSource.KendoGridDataSourceSchema.KendoGridDataSourceSchemaModel();
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.KendoGrid.KendoGridDataSource.KendoGridDataSourceSchema.KendoGridDataSourceSchemaModel', {
        fields: null
    });
    
    Bridge.define('System.Windows.Forms.KendoGrid.KendoGuidPageable', {
        input: true,
        numeric: false
    });
    
    Bridge.define('System.Windows.Forms.KendoMaskedTextBox');
    
    Bridge.define('System.Windows.Forms.KendoWindow', {
        title: null,
        width: 0,
        height: 0,
        position: null,
        actions: null,
        config: {
            init: function () {
                this.position = new System.Windows.Forms.KendoWindow.ControlPosition();
                this.actions = Bridge.Array.init(0, null);
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.KendoWindow.ControlPosition', {
        left: null,
        top: null
    });
    
    Bridge.define('System.Windows.Forms.ListViewItem', {
        SubItems: null
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
        constructor$2: function (left, right, top, bottom) {
            this.setLeft(left);
            this.setRight(right);
            this.setBottom(bottom);
            this.setTop(top);
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
    
    Bridge.define('System.Windows.Forms.PropertyUpdate', {
        name: null,
        value: null
    });
    
    Bridge.define('System.Windows.Forms.TreeNode', {
        name: null,
        text: null,
        nodes: null,
        folder: null,
        constructor: function () {
            this.nodes = Bridge.Array.init(0, null);
        }
    });
    
    Bridge.define('System.Windows.Forms.WSEventArgs', {
        clientId: null,
        eventType: null,
        value: null,
        getPropertyUpdate: function () {
            return Bridge.merge(new System.Windows.Forms.PropertyUpdate(), JSON.parse(JSON.stringify(this.value)));
        }
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
        radioButtonGroup: null,
        label: null,
        foreColor: null,
        font: null,
        backgroundImageLayout: 0,
        dockPanel: null,
        mPadding: null,
        renderLabel: true,
        canvas: null,
        mBackColor: null,
        controls: null,
        mAnchor: 3,
        mControls: null,
        mDock: 0,
        mText: null,
        mLocation: null,
        mSize: null,
        clientSize: null,
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
                this.element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
                this.radioButtonGroup = new qx.ui.form.RadioGroup();
                this.dockPanel = new qx.ui.container.Composite(new qx.ui.layout.Dock());
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
            var font = this.font;
            if (!Bridge.hasValue(font)) {
                font = "12px \"Microsoft Sans Serif\"";
                elm.setFont(qx.bom.Font.fromString(font));
            }
            else  {
                font = Bridge.String.replaceAll(font, "pt", "px");
                elm.setFont(qx.bom.Font.fromString(font));
                elm.getFont().setSize(Bridge.Int.clip32(Bridge.Nullable.add(elm.getFont().getSize(), 4)));
            }
    
    
            if (!Bridge.String.isNullOrEmpty(this.foreColor)) {
                elm.getFont().setColor(this.foreColor);
                elm.setTextColor(this.foreColor);
            }
    
            //if (!string.IsNullOrEmpty(this.Font))
            //{
            //    var split = this.Font.Split(',');
    
            //    elm.Font.Family = new string[] { split[0] };
    
            //    var size = split[1].Replace("pt", "").Trim();
            //    var fs = Int32.Parse(size.Split('.')[0]);
            //    //fs -= 1;
            //    elm.Font.Size = fs;
    
            //    if( split.Length > 2 )
            //    {
            //        var boldStype = split[2].Split('=');
            //        if( boldStype.Length > 1 )
            //        {
            //            if(boldStype[1] == "Bold")
            //            {
            //                elm.Font.Bold = true;
            //            }
            //        }
            //    }
            //}
            //else
            //{
            //    elm.Font.Family = new string[] { "Microsoft Sans Serif" };
            //    elm.Font.Size = 12;
            //}
        },
        setAttributes: function (parentElement) {
            if (parentElement === void 0) { parentElement = null; }
            if (!Bridge.hasValue(this.getParent())) {
                this.element = ReVision.JSForms.Application.rootDocument;
    
                //if (bounds == null)
                //{
                //    this.DockPanel.Width = Document.Body.ClientWidth;
                //    this.DockPanel.Height = Document.Body.ClientHeight;
                //}
                //else
                //{
                //    this.DockPanel.Width = bounds.Width;
                //    this.DockPanel.Height = bounds.Height;
                //}
    
                //if( parentElement != null )
                //{
                //    parentElement.Add(this.DockPanel, new qx.core.Options()
                //    {
                //        Left = 0,
                //        Top = 0,
                //    });
                //}
                //else
                //{
                //    this.Element.Add(this.DockPanel, new qx.core.Options()
                //    {
                //        Edge = 0
                //    });
                //}
            }
            else  {
                if (!Bridge.hasValue(parentElement)) {
                    parentElement = this.getParent().element;
                }
    
                //qx.ui.core.Bounds bounds = null;
    
                //if (this.Parent != null)
                //{
                //    bounds = ((qx.ui.core.LayoutItem)parentElement).GetBounds();
                //}
    
                //else
                //{
                //    this.Element.Add(this.DockPanel, new qx.core.Options()
                //    {
                //        Edge = 0
                //    });
                //}
    
                var li = null;
                if (Bridge.is(this.element, qx.ui.core.LayoutItem)) {
                    li = Bridge.cast(this.element, qx.ui.core.LayoutItem);
                }
    
                switch (this.getDock()) {
                    case System.Windows.Forms.DockStyle.none: 
                        parentElement.add(this.element,{ left: this.getLocation().x, top: this.getLocation().y });
                        if (!this.getAutoSize()) {
                            li.setWidth(this.getWidth());
                        }
                        li.setHeight(this.getHeight());
                        break;
                    case System.Windows.Forms.DockStyle.left: 
                        {
                            parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
                            li.setHeight(this.getHeight());
                            li.setWidth(this.getWidth());
                        }
                        break;
                    case System.Windows.Forms.DockStyle.right: 
                        {
                            parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
                            li.setHeight(this.getHeight());
                            li.setWidth(this.getWidth());
                        }
                        break;
                    case System.Windows.Forms.DockStyle.top: 
                        {
                            parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
                            li.setHeight(this.getHeight());
                            li.setWidth(this.getWidth());
                        }
                        break;
                    case System.Windows.Forms.DockStyle.bottom: 
                        {
                            parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
                            li.setHeight(this.getHeight());
                            li.setWidth(this.getWidth());
                        }
                        break;
                    case System.Windows.Forms.DockStyle.fill: 
                        {
                            this.resizeDockFill(parentElement, li);
                        }
                        break;
                }
    
            }
    
            switch (this.getDock()) {
                case System.Windows.Forms.DockStyle.fill: 
                    break;
                default: 
                    {
                        if (Bridge.is(this.element, qx.ui.core.LayoutItem)) {
                            var li1 = Bridge.cast(this.element, qx.ui.core.LayoutItem);
                            if (!this.getAutoSize()) {
                                li1.setWidth(this.getWidth());
                            }
                            li1.setHeight(this.getHeight());
                        }
                    }
                    break;
            }
    
            if (Bridge.is(this.element, qx.ui.core.Widget)) {
                var li2 = Bridge.cast(this.element, qx.ui.core.Widget);
                var bc = this.getBackColor();
                if (!Bridge.String.isNullOrEmpty(bc)) {
                    li2.setBackgroundColor(this.getBackColor());
                    //li.BackgroundColor = "#0f0";
                }
    
                if (!Bridge.String.isNullOrEmpty(this.getBackgroundImage())) {
                    var d = new qx.ui.decoration.Decorator();
                    d.setBackgroundImage("data:image/png;base64," + this.getBackgroundImage() + "");
                    li2.decorator = d;
                }
    
                this.setText$1(li2);
            }
    
    
            //this.Element.Id = "WU_" + this.ClientId;
    
            //this.Element.Style.BackgroundColor = this.BackColor;
            //this.Element.Style.Visibility = this.Visible ? Visibility.Visible : Visibility.Hidden;
    
            //if (this.Parent != null)
            //{
            //    bool rightSet = false, leftSet = false, topSet = false, bottomSet = false;
            //    if (this.Anchor.HasFlag(AnchorStyles.Right))
            //    {
            //        rightSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Left))
            //    {
            //        leftSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Top))
            //    {
            //        topSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Bottom))
            //    {
            //        bottomSet = true;
            //    }
    
            //    if (topSet && !rightSet && !leftSet && !bottomSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width / 2 - (this.Width / 2);
            //    }
    
            //    if (bottomSet && topSet && !rightSet && !leftSet)
            //    {
            //        var height = this.Parent.Height;
            //        this.Location.Y = height / 2 - (this.Height / 2);
            //    }
    
            //    if (bottomSet && leftSet && !topSet && !rightSet)
            //    {
            //        var height = this.Parent.Height;
            //        this.Location.Y = height - this.Height;
            //    }
    
            //    if (bottomSet && rightSet && !topSet && !leftSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width - this.Width;
    
            //        var height = this.Parent.Height;
            //        this.Location.Y = height - this.Height;
            //    }
    
            //    if (topSet && rightSet && !leftSet && !bottomSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width - this.Width;
            //    }
    
            //    this.Element.Style.Position = Position.Absolute;
            //}
            //else
            //{
            //    this.Element.Style.Position = Position.Absolute;
            //}
    
            //switch (this.Dock)
            //{
            //    case DockStyle.None:
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Top = this.Location.Y + "px";
            //        this.Element.Style.Left = this.Location.X + "px";
            //        break;
            //    case DockStyle.Left:
            //        this.Element.Style.Left = "0px";
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = "100%";
            //        break;
            //    case DockStyle.Right:
            //        this.Element.Style.Right = "0px";
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = "100%";
            //        break;
            //    case DockStyle.Top:
            //        this.Element.Style.Top = "0px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Width = "100%";
            //        break;
            //    case DockStyle.Bottom:
            //        this.Element.Style.Bottom = "0px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Width = "100%";
            //        break;
            //    case DockStyle.Fill:
            //        this.Element.Style.Right = "0px";
            //        this.Element.Style.Bottom = "0px";
            //        this.Element.Style.Left = "0px";
            //        this.Element.Style.Top = "0px";
            //        this.Element.Style.Height = "100%";
            //        this.Element.Style.Width = "100%";
            //        break;
            //}
    
            //this.Element.Style.PaddingTop = this.Padding.Top + "px";
            //this.Element.Style.PaddingLeft = this.Padding.Left + "px";
            //this.Element.Style.PaddingRight = this.Padding.Right + "px";
            //this.Element.Style.PaddingBottom = this.Padding.Bottom + "px";
    
            //if (Parent != null)
            //{
            //    if (jQuery.Element(this.Parent.Element).Has(this.Element).Length == 0)
            //    {
            //        this.Parent.Element.AppendChild(this.Element);
            //    }
            //}
            //else
            //{
            //    this.Element.Style.Height = "100%";
            //    this.Element.Style.Width = "100%";
            //}
    
            //SetupEventHandlers();
    
            //if (this.RenderLabel)
            //{
            //    if (!string.IsNullOrEmpty(this.Text))
            //    {
            //        if( this.Label == null )
            //        {
            //            this.Label = new Label();
            //        }
            //        SetText(this.Label.Element);
            //        if (this.HasEvent("TextChanged"))
            //        {
            //            this.Label.Element.OnChange = (e) =>
            //            {
            //                this.FireEvent(new WSEventArgs()
            //                {
            //                    ClientId = this.ClientId,
            //                    EventType = "textchanged",
            //                    Value = this.Label.Element.InnerHTML
            //                });
            //            };
            //        }
            //        this.Element.AppendChild(this.Label.Element);
            //    }
            //}
    
            //if (!string.IsNullOrEmpty(this.BackgroundImage))
            //{
            //    jQuery.Element(this.Element).Css("background-image", "url('data:image/png;base64," + this.BackgroundImage + "')");
            //    switch (this.BackgroundImageLayout)
            //    {
            //        case ImageLayout.Stretch:
            //            jQuery.Element(this.Element).Css("background-size", "cover");
            //            break;
            //    }
            //}
    
            //if (this.ForeColor)
            //{
            //    div.style.color = obj.ForeColor;
            //}
    
            //if (obj.Font != undefined)
            //{
            //    var split = obj.Font.split(',');
    
            //    div.style.fontFamily = split[0];
    
            //    var fs = parseInt(split[1].replace('pt', ''));
            //    fs = fs + 5;
            //    div.style.fontSize = fs + 'px';
            //}
        },
        resizeDockFill: function (parentElement, li) {
            var bounds = (Bridge.cast(this.getParent().element, qx.ui.core.LayoutItem)).getBounds();
    
            if (!Bridge.hasValue(bounds)) {
                li.setWidth(this.getWidth());
                li.setHeight(this.getHeight());
    
                parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
                return;
            }
    
            var ctrls = this.getParent().getControls().toArray();
            ctrls.reverse();
            var right = 0, bottom = 0;
    
    
            for (var i = 0; i < ctrls.length; i = (i + 1) | 0) {
                var ctrl = ctrls[i];
                if (ctrl === this) {
                    break;
                }
                switch (ctrl.getDock()) {
                    case System.Windows.Forms.DockStyle.right: 
                        right = (right + ctrl.getWidth()) | 0;
                        break;
                    case System.Windows.Forms.DockStyle.bottom: 
                        bottom = (bottom + ctrl.getHeight()) | 0;
                        break;
                }
            }
    
            var newWidth = (((bounds.width - this.getLeft()) | 0) - right) | 0;
            var newHeight = (((bounds.height - this.getTop()) | 0) - bottom) | 0;
    
            li.setWidth(newWidth);
            li.setHeight(newHeight);
    
            parentElement.add(this.element,{ left: this.getLeft(), top: this.getTop() });
        },
        update: function (evt) {
            switch (evt.getPropertyUpdate().name) {
                case "Canvas": 
                    break;
            }
        },
        render: function () {
            var $t;
            if (!Bridge.String.isNullOrEmpty(this.canvas)) {
                this.setBackgroundImage(this.canvas);
            }
    
            this.setAttributes();
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
            }
    
            //if (this.Parent != null)
            //{
            //    ReAlignControls(this.Parent, this);
            //}
    
            this.setupEventHandlers();
        },
        setupEventHandlers: function () {
            if (this.hasEvent("Click")) {
                this.element.addListener("execute", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f1));
            }
    
            if (this.hasEvent("KeyDown")) {
                this.element.addListener("keydown", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f2));
            }
    
            if (this.hasEvent("KeyUp")) {
                this.element.addListener("keyup", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f3));
            }
    
            if (this.hasEvent("KeyPress")) {
                this.element.addListener("keypress", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f3));
            }
    
            if (this.hasEvent("MouseDown")) {
                this.element.addListener("mousedown", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f4));
            }
    
            if (this.hasEvent("MouseUp")) {
                this.element.addListener("mouseup", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f5));
            }
    
            if (this.hasEvent("MouseMove")) {
                this.element.addListener("mousemove", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f6));
            }
    
            if (this.hasEvent("MouseOut")) {
                this.element.addListener("mouseout", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f7));
            }
    
            if (this.hasEvent("MouseOver")) {
                this.element.addListener("mouseover", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f8));
            }
    
            //if (this.HasEvent("MouseMove"))
            //{
            //    this.Element.OnMouseMove = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mousemove",
            //            Value = e
            //        });
            //    };
            //};
    
            //if (this.HasEvent("MouseEnter"))
            //{
            //    this.Element.OnMouseEnter = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mouseenter",
            //            Value = e
            //        });
            //    };
            //};
    
            //if (this.HasEvent("MouseLeave"))
            //{
            //    this.Element.OnMouseLeave = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mouseleave",
            //            Value = e
            //        });
            //    };
            //};
    
            if (this.hasEvent("TextChanged")) {
                this.element.addListener("onchange", Bridge.fn.bind(this, $_.System.Windows.Forms.Control.f9));
            }
        },
        fireEvent: function (evt, replacer) {
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
                                    if (replacer === void 0) { replacer = null; }
                                    ReVision.JSForms.Application.current.send(evt, replacer);
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
                        case "SplitContainer": 
                            var sc = Bridge.merge(new System.Windows.Forms.SplitContainer(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = sc;
                            break;
                        case "TreeView": 
                            var tv = Bridge.merge(new System.Windows.Forms.TreeView(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = tv;
                            break;
                        case "ListView": 
                            var lv = Bridge.merge(new System.Windows.Forms.ListView(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = lv;
                            break;
                        case "CheckedListBox": 
                            var clb = Bridge.merge(new System.Windows.Forms.CheckedListBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = clb;
                            break;
                        case "CustomControl": 
                            var cc = Bridge.merge(new System.Windows.Forms.CustomControl(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = cc;
                            break;
                        case "ProgressBar": 
                            var pb = Bridge.merge(new System.Windows.Forms.ProgressBar(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = pb;
                            break;
                        case "ListBox": 
                            var lb = Bridge.merge(new System.Windows.Forms.ListBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = lb;
                            break;
                        case "RichTextBox": 
                            var rtb = Bridge.merge(new System.Windows.Forms.RichTextBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = rtb;
                            break;
                        case "MonthCalendar": 
                            var mc = Bridge.merge(new System.Windows.Forms.MonthCalendar(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = mc;
                            break;
                        case "PictureBox": 
                            var pBox = Bridge.merge(new System.Windows.Forms.PictureBox(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = pBox;
                            break;
                        case "MainMenu": 
                            var mm = Bridge.merge(new System.Windows.Forms.MainMenu(), JSON.parse(JSON.stringify(ctrl)));
                            ctrl1 = mm;
                            break;
                        default: 
                            ctrl1 = Bridge.merge(new System.Windows.Forms.Control(), JSON.parse(JSON.stringify(ctrl)));
                            break;
                    }
                    ctrl1.setParent(this);
                    this.mControls.add(ctrl1);
                    ReVision.JSForms.Application.current.controls.add(ctrl1.getClientId(), ctrl1);
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
        getInt: function (px) {
            if (Bridge.String.endsWith(px, "px")) {
                px = px.substr(0, ((px.length - 2) | 0));
            }
            return Bridge.Int.parseInt(px, -2147483648, 2147483647);
        },
        onClick: function () {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "click"
            } ));
        }
    });
    
    var $_ = {};
    
    Bridge.ns("System.Windows.Forms.Control", $_)
    
    Bridge.apply($_.System.Windows.Forms.Control, {
        f1: function (e) {
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "click"
            } ));
        },
        f2: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.KeySequence);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "keydown",
                value: key
            } ));
        },
        f3: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.KeySequence);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "keyup",
                value: key
            } ));
        },
        f4: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.Mouse);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mousedown",
                value: key
            } ));
        },
        f5: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.Mouse);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mouseup",
                value: key
            } ));
        },
        f6: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.Mouse);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mousemove",
                value: key
            } ));
        },
        f7: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.Mouse);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mouseout",
                value: key
            } ));
        },
        f8: function (e) {
            var key = Bridge.cast(e, qx.qxevent.type.Mouse);
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "mouseover",
                value: key
            } ));
        },
        f9: function (e) {
            var val = null;
            if (Bridge.is(this.element, qx.ui.form.AbstractField)) {
                val = (Bridge.cast(this.element, qx.ui.form.AbstractField)).getValue();
            }
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "TextChanged",
                value: val
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
    
    Bridge.define('System.Windows.Forms.ListControl', {
        inherits: [System.Windows.Forms.Control],
        items: null
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
        selectedIndex: 0,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.ComboBox();
        },
        render: function () {
            //if (this.cb == null)
            //{
            //    this.cb = new Bridge.Html5.InputElement();
            //    this.cb.Id = "CB_" + this.ClientId;
            //    this.Element.AppendChild(this.cb);
            //}
    
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
    
            //ListItem[] arr = new ListItem[Items.Length];
    
            //for (int i = 0; i < Items.Length; i++)
            //{
            //    arr[i] = new ListItem()
            //    {
            //        Text = Items[i],
            //        Value = i
            //    };
            //}
    
            //var kb = KendoComboBox.Element(this.cb, "text", "value", "contains", true, arr, (e) =>
            //{
            //    var cmd = e.ToDynamic();
            //    this.SelectedIndex = cmd.sender.selectedIndex;
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "selectedIndexChanged",
            //        Value = cmd.sender.selectedIndex
            //    });
            //}, this.SelectedIndex);
    
            System.Windows.Forms.Control.prototype.render.call(this);
            var cb = Bridge.cast(this.element, qx.ui.form.ComboBox);
            cb.getChildrenContainer().addListener("changeSelection", Bridge.fn.bind(this, function (e) {
                var childContainer = cb.getChildrenContainer();
                var selectedIndex = cb.indexOf(childContainer.getSelection()[0]);
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "selectedIndexChanged",
                    value: selectedIndex
                } ));
                //this.SelectedIndex = cb.
            }));
            cb.setValue(this.getText());
            //cb.TextField.Value = this.Text;
            for (var i = 0; i < this.items.length; i = (i + 1) | 0) {
                cb.add(Bridge.merge(new qx.ui.form.ListItem(this.items[i].toString()), {
                    index: i
                } ),null);
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
    
    Bridge.define('System.Windows.Forms.CustomControl', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        }
    });
    
    Bridge.define('System.Windows.Forms.DateTimePicker', {
        inherits: [System.Windows.Forms.Control],
        mValue: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            //this.Value = DateTime.Now;
            this.element = new qx.ui.form.DateField();
        },
        getValue: function () {
            return this.mValue;
        },
        setValue: function (value) {
            var val = value;
            this.mValue = new Date(val);
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            var dtp = Bridge.cast(this.element, qx.ui.form.DateField);
            dtp.setValue(this.mValue);
    
            //if( dtp == null )
            //{
            //    dtp = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(dtp);
            //}
            //dtp.Value = (dynamic)this.Value;
    
            //KendoDatePicker.Element(dtp, (e) =>
            //{
            //    Value = e.ToDynamic().sender.value();
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "valueChanged",
            //        Value = this.Value
            //    });
            //}, this.Value);
        }
    });
    
    Bridge.define('System.Windows.Forms.Form', {
        inherits: [System.Windows.Forms.Control],
        backgroundImageData: null,
        jWindow: null,
        window: null,
        startPosition: 0,
        mMenu: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        getMenu: function () {
            return this.mMenu;
        },
        setMenu: function (value) {
            this.mMenu = Bridge.merge(new System.Windows.Forms.Menu(), JSON.parse(JSON.stringify(value)));
        },
        showDialog: function () {
            var $t, $t1;
            var win = null;
    
            if (Bridge.hasValue(this.getParent())) {
                win = new qx.ui.window.Window();
                win.setCaption(this.getText());
                this.element = win;
                win.setLayout(new qx.ui.layout.Basic());
                win.setPadding(0);
            }
    
            this.render();
    
            if (Bridge.hasValue(win)) {
                win.setWidth((this.clientSize.width + 10) | 0);
                win.setHeight((this.clientSize.height + 30) | 0);
                win.open();
                win.center();
            }
    
            if (Bridge.hasValue(this.getMenu())) {
                var frame = new qx.ui.container.Composite(new qx.ui.layout.Grow());
                var mb = new qx.ui.menubar.MenuBar();
                mb.setWidth(this.clientSize.width);
                $t = Bridge.getEnumerator(this.getMenu().getMenuItems());
                while ($t.moveNext()) {
                    var mi = $t.getCurrent();
                    var menuItem = Bridge.merge(new System.Windows.Forms.MenuItem(), JSON.parse(JSON.stringify(mi)));
                    var name = menuItem.getText();
                    var subMenu = new qx.ui.menu.Menu();
                    $t1 = Bridge.getEnumerator(mi.menuItems);
                    while ($t1.moveNext()) {
                        var child = $t1.getCurrent();
                        var menuItemChild = Bridge.merge(new System.Windows.Forms.MenuItem(), JSON.parse(JSON.stringify(child)));
                        var newButton = new qx.ui.menu.Button(menuItemChild.getText(), null, null, null);
                        subMenu.add(newButton,null);
                    }
                    var btn = new qx.ui.menubar.Button(name, null, subMenu);
                    mb.add(btn,null);
                }
                frame.add(mb,null);
                if (Bridge.hasValue(win)) {
                    win.add(frame,null);
                }
                else  {
                    this.element.add(frame,null);
                }
            }
    
    
            //this.Window = new DivElement();
            //this.Window.Id = "WI_" + this.ClientId;
            //this.jWindow = jQuery.Element(this.Window);
    
            //if (!string.IsNullOrEmpty(this.BackgroundImageData))
            //{
            //    jWindow.Css("background-image", "url('data:image/png;base64," + this.BackgroundImageData + "')");
            //}
    
            //this.Window.AppendChild(this.Element);
    
            //if (this.Parent == null)
            //{
            //    Document.Body.AppendChild(this.Window);
    
            //    this.Element.Style.Width = "100%";
            //    this.Element.Style.Height = "100%";
            //    this.Window.Style.Width = "100%";
            //    this.Window.Style.Height = "100%";
    
            //    this.Render();
            //}
            //else
            //{
            //    Parent.Element.AppendChild(this.Window);
    
            //    this.Element.Style.Width = this.ClientSize.Width - 10 + "px";
    
            //    var data = this.jWindow.Data("kendoWindow");
            //    if (data == null)
            //    {
            //        var loc = this.Location;
    
            //        switch (this.StartPosition)
            //        {
            //            case FormStartPosition.CenterScreen:
            //            case FormStartPosition.CenterParent:
            //                {
            //                    var w = GetWidth();
            //                    var h = GetHeight();
            //                    loc.Y = h / 2 - (this.ClientSize.Height) / 2;
            //                    loc.X = w / 2 - (this.ClientSize.Width) / 2;
            //                }
            //                break;
            //        }
    
            //        KendoWindow options = new KendoWindow();
            //        options.Width = this.ClientSize.Width;
            //        options.Height = this.ClientSize.Height;
            //        options.Title = this.Text;
            //        options.Actions = new string[]
            //        {
            //            "Minimize",
            //            "Maximize",
            //            "Close"
            //        };
            //        options.Position.Left = loc.X + "px";
            //        options.Position.Top = loc.Y + "px";
    
            //        var kendoWin = KendoWindow.Element(this.Window, options);
    
            //        this.Window.Style.BackgroundColor = this.BackColor;
            //        this.Window.Style.Overflow = Overflow.Hidden;
    
            //        foreach (var ctrl in this.GetControls())
            //        {
            //            ctrl.Render();
            //        }
    
            //        var width = size[0] + 'px';
            //        var height = size[1] + 'px';
            //        window.kendoWindow({
            //        width: width,
            //                        height: height,
            //                        title: obj.Text,
            //                        actions: [
            //                            "Minimize",
            //                            "Maximize",
            //                            "Close"
            //                        ],
            //                        position:
            //            {
            //            left: loc[0] + 'px',
            //                            top: loc[1] + 'px'
            //                        },
            //                        close: onClose,
            //                        resize: onResize,
            //                    });
    
            //        window[0].style.overflow = 'hidden';
            //        window[0].style.backgroundColor = obj.BackColor;
            //    }
    
            //var undoButton = (ButtonElement)Document.GetElementById("#undo");
            //undoButton.OnClick = (e) =>
            //{
            //    KendoWindow win = (KendoWindow)this.jWindow.Data("kendoWindow");
            //    win.Open();
            //    undoButton.Style.Visibility = Visibility.Hidden;
            //};
    
            //var window = $(this.Window),
            //var undo = jQuery.Element("#undo");
            //undo.Click = (e) =>
            //{
    
            //};
            //undo = $("#undo")
            //        .bind("click", function() {
            //    window.data("kendoWindow").open();
            //    undo.hide();
            //});
    
            //var onClose = function(e) {
            //    if (this.element[0].Visible != undefined && !this.element[0].Visible)
            //    {
            //        this.destroy();
            //        return;
            //    }
            //    var evt = {
            //ClientId: this.element[0].id,
            //EventType: 'FormClose'
            //   };
            //send(evt);
    
            //e.preventDefault();
            //}
        }
    });
    
    Bridge.define('System.Windows.Forms.Panel', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
        }
    });
    
    Bridge.define('System.Windows.Forms.ItemsControl', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.Label', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = new qx.ui.basic.Label();
        },
        update: function (evt) {
            System.Windows.Forms.Control.prototype.update.call(this, evt);
    
            switch (evt.getPropertyUpdate().name) {
                case "Text": 
                    this.setText(Bridge.as(evt.getPropertyUpdate().value, String));
                    var lbl = Bridge.cast(this.element, qx.ui.basic.Label);
                    lbl.setValue(this.getText());
                    break;
            }
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
            var lbl = Bridge.cast(this.element, qx.ui.basic.Label);
            lbl.setValue(this.getText());
        }
    });
    
    Bridge.define('System.Windows.Forms.LinkLabel', {
        inherits: [System.Windows.Forms.Control],
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            //jQuery.Element(this.Element).Css("cursor", "pointer");
    
            //if (string.IsNullOrEmpty(this.Font))
            //{
            //    this.Label.Element.Style.Color = "blue";
            //    this.Label.Element.Style.TextDecoration = Bridge.Html5.TextDecoration.Underline;
            //}
    
            //if (this.HasEvent("LinkClicked"))
            //{
            //    this.Element.OnClick = (e) =>
            //    {
            //        FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "linkClicked"
            //        });
            //    };
            //};
        }
    });
    
    Bridge.define('System.Windows.Forms.ListView', {
        inherits: [System.Windows.Forms.Control],
        mColumns: null,
        mItems: null,
        getColumns: function () {
            return this.mColumns;
        },
        setColumns: function (value) {
            var $t;
            this.mColumns = new Bridge.List$1(System.Windows.Forms.ColumnHeader)();
            $t = Bridge.getEnumerator(value);
            while ($t.moveNext()) {
                var col = $t.getCurrent();
                this.mColumns.add(Bridge.merge(new System.Windows.Forms.ColumnHeader(), JSON.parse(JSON.stringify(col))));
            }
        },
        getItems: function () {
            return this.mItems;
        },
        setItems: function (value) {
            var $t;
            this.mItems = new Bridge.List$1(System.Windows.Forms.ListViewItem)();
            $t = Bridge.getEnumerator(value);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                this.mItems.add(Bridge.merge(new System.Windows.Forms.ListViewItem(), JSON.parse(JSON.stringify(item))));
            }
    
        },
        update: function (evt) {
            System.Windows.Forms.Control.prototype.update.call(this, evt);
            var table = Bridge.cast(this.element, qx.ui.table.Table);
            switch (evt.eventType) {
                case "clearList": 
                    {
                        var model = Bridge.cast(table.getTableModel(), qx.ui.table.model.Simple);
                        model.removeRows(0, model.getRowCount());
                    }
                    break;
                case "addListViewItem": 
                    {
                        var item = Bridge.merge(new System.Windows.Forms.ListViewItem(), JSON.parse(evt.value.toString()));
                        this.mItems.add(item);
                        var data = Bridge.Array.init(1, null);
    
                        data[0] = Bridge.Array.init(this.getColumns().getCount(), null);
                        for (var x = 0; x < item.SubItems.length; x = (x + 1) | 0) {
                            data[0][x] = item.SubItems[x];
                        }
    
                        var model1 = Bridge.cast(table.getTableModel(), qx.ui.table.model.Simple);
                        model1.addRows(data);
                    }
                    break;
            }
        },
        renderItems: function () {
            var table = Bridge.cast(this.element, qx.ui.table.Table);
            var model = Bridge.cast(table.getTableModel(), qx.ui.table.model.Simple);
            var data = Bridge.Array.init(this.getItems().getCount(), null);
    
            for (var i = 0; i < this.getItems().getCount(); i = (i + 1) | 0) {
                data[i] = Bridge.Array.init(this.getColumns().getCount(), null);
                for (var x = 0; x < this.getItems().getCount(); x = (x + 1) | 0) {
                    var item = this.getItems().getItem(x);
                    data[i][x] = item.SubItems[x];
                }
            }
    
            model.addRows(data);
        },
        render: function () {
            var model = new qx.ui.table.model.Simple();
            if (this.getColumns().getCount() > 0) {
                var columnNames = Bridge.Array.init(this.getColumns().getCount(), null);
                for (var i = 0; i < this.getColumns().getCount(); i = (i + 1) | 0) {
                    var col = this.getColumns().getItem(i);
                    columnNames[i] = col.getColumnName();
                }
    
                model.setColumns(columnNames);
            }
    
            var table = new qx.ui.table.Table(model);
            this.element = table;
            System.Windows.Forms.Control.prototype.render.call(this);
    
            this.renderItems();
    
            //            this.Element = document.createElement('div');
            //            var size = obj.Size.split(',');
            //            var width = size[0] + 'px';
            //            var height = size[1] + 'px';
    
            //            var columns = [];
    
            //            var model = { };
    
            //            for (var i = 0; i < obj.Columns.length; i++)
            //            {
            //                var shortName = obj.Columns[i].ColumnName.replace(/\s +/ g, '') + '_' + i;
            //                var column = {
            //            field: shortName,
            //            width: obj.Columns[i].Width,
            //            title: obj.Columns[i].ColumnName
            //                };
            //            model[shortName] = {
            //                type: "string"
            //            }
            //            columns.push(column);
            //        }
    
            //        var dt = [];
    
            //        var options = {
            //        height: height,
            //        width: width,
            //        autoBind: false,
            //        columns: columns,
            //        scrollable: true,
            //        sortable: true,
            //        filterable: true,
            //        pageable: {
            //            input: true,
            //            numeric: false
            //        },
            //        dataSource: {
            //            data: dt,
            //            schema: {
            //                model: {
            //                    fields: model
            //                }
            //            },
            //            pageSize: 20
            //        },
            //    };
    
            //        var str = JSON.stringify(options);
    
            //    $(this.Element).kendoGrid(options);
    
            //        var grid = $(this.Element).data("kendoGrid");
            //    for (var i = 0; i<obj.Items.length; i++) {
            //        var item = obj.Items[i];
            //        var row = { };
            //        for (var x = 0; x<grid.columns.length; x++) {
            //            var column = grid.columns[x];
            //        var rowValue = item.SubItems[x];
            //        row[column.field] = rowValue;
            //        }
            //    grid.dataSource.add(row);
            //    }
    
            //Control.prototype.Render(this.Element, obj, parent);
            System.Windows.Forms.Control.prototype.render.call(this);
    
            //KendoGrid grid = new KendoGrid();
            //grid.AutoBind = false;
            //grid.Sortable = true;
            //grid.Filterable = true;
    
            //KendoGrid.Element(this.Element, grid);
    
            //this.Element.Style.BorderStyle = BorderStyle.Solid;
            //this.Element.Style.BorderWidth = BorderWidth.Thin;
            //this.Element.Style.BorderColor = "gray";
        }
    });
    
    Bridge.define('System.Windows.Forms.Menu', {
        inherits: [System.Windows.Forms.Control],
        mMenuItems: null,
        getMenuItems: function () {
            return this.mMenuItems;
        },
        setMenuItems: function (value) {
            this.mMenuItems = Bridge.merge(new Array(), JSON.parse(JSON.stringify(value)));
        }
    });
    
    Bridge.define('System.Windows.Forms.TextBox', {
        inherits: [System.Windows.Forms.Control],
        multiline: false,
        passwordChar: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
        },
        update: function (evt) {
            System.Windows.Forms.Control.prototype.update.call(this, evt);
            switch (evt.getPropertyUpdate().name) {
                case "PasswordChar": 
                    {
                        this.passwordChar = Bridge.as(evt.getPropertyUpdate().value, String);
                        (Bridge.cast(this.element, qx.ui.core.Widget)).destroy();
    
                        this.render();
                    }
                    break;
            }
        },
        render: function () {
            if (this.multiline) {
                var tf = new qx.ui.form.TextArea();
                tf.setValue(this.getText());
                this.element = tf;
            }
            else  {
                var tf1 = new qx.ui.form.TextField();
                tf1.setValue(this.getText());
                this.element = tf1;
            }
    
            if (Bridge.hasValue(this.passwordChar) && this.passwordChar.length > 0 && this.passwordChar.charCodeAt(0) !== 0) {
                var tf2 = new qx.ui.form.PasswordField();
                tf2.setValue(this.getText());
                this.element = tf2;
            }
    
            this.element.addListener("changeValue", Bridge.fn.bind(this, $_.System.Windows.Forms.TextBox.f1));
    
            this.element.addListener("input", Bridge.fn.bind(this, $_.System.Windows.Forms.TextBox.f2));
    
            System.Windows.Forms.Control.prototype.render.call(this);
        }
    });
    
    Bridge.ns("System.Windows.Forms.TextBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.TextBox, {
        f1: function (e) {
            var af = Bridge.cast(this.element, qx.ui.form.AbstractField);
            this.setText(af.getValue());
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "textchanged",
                value: af.getValue()
            } ));
        },
        f2: function (e) {
            var af = Bridge.cast(this.element, qx.ui.form.AbstractField);
            this.setText(af.getValue());
            if (this.hasEvent("KeyPress")) {
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "textchanged",
                    value: af.getValue()
                } ));
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.MonthCalendar', {
        inherits: [System.Windows.Forms.Control],
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.control.DateChooser();
        },
        render: function () {
            this.setSize(new System.Drawing.Size(227, 162));
            System.Windows.Forms.Control.prototype.render.call(this);
        }
    });
    
    Bridge.define('System.Windows.Forms.PictureBox', {
        inherits: [System.Windows.Forms.Control],
        sizeMode: 0,
        image: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = new qx.ui.basic.Image();
        },
        update: function (evt) {
            System.Windows.Forms.Control.prototype.update.call(this, evt);
    
            var pu = Bridge.merge(new System.Windows.Forms.PropertyUpdate(), JSON.parse(JSON.stringify(evt.value)));
            switch (pu.name) {
                case "Image": 
                    this.image = Bridge.as(pu.value, String);
                    this.updateImage();
                    break;
            }
            //switch(evt.Value)
            //{
    
            //}
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            this.updateImage();
        },
        updateImage: function () {
            if (Bridge.String.isNullOrEmpty(this.image)) {
                return;
            }
    
            var img = Bridge.cast(this.element, qx.ui.basic.Image);
            img.setSource("data:image/png;base64," + this.image + "");
    
    
            //var element = jQuery.Element(this.Element);
            //element.Css("background-image", "url('data:image/png;base64," + this.Image + "')");
            switch (this.sizeMode) {
                case System.Windows.Forms.PictureBoxSizeMode.normal: 
                    //element.Css("background-repeat", "no-repeat");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.autoSize: 
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.centerImage: 
                    //element.Css("background-repeat", "no-repeat");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.stretchImage: 
                    img.setScale(true);
                    //element.Css("background-size", "cover");
                    break;
                case System.Windows.Forms.PictureBoxSizeMode.zoom: 
                    break;
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.ProgressBar', {
        inherits: [System.Windows.Forms.Control],
        value: 0,
        maximum: 0,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.indicator.ProgressBar();
        },
        update: function (evt) {
            System.Windows.Forms.Control.prototype.update.call(this, evt);
    
            switch (evt.getPropertyUpdate().name) {
                case "Value": 
                    var pb = Bridge.cast(this.element, qx.ui.indicator.ProgressBar);
                    pb.setValue(Bridge.cast(evt.getPropertyUpdate().value, Bridge.Int32));
                    break;
            }
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
            var pb = Bridge.cast(this.element, qx.ui.indicator.ProgressBar);
            pb.setValue(this.value);
            pb.setMaximum(this.maximum);
        }
    });
    
    Bridge.define('System.Windows.Forms.RichTextBox', {
        inherits: [System.Windows.Forms.Control],
        readOnly: false,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.TextArea();
        },
        render: function () {
            System.Windows.Forms.Control.prototype.render.call(this);
    
            //var area = (TextAreaElement)this.Element;
            //area.ReadOnly = this.ReadOnly;
            //area.Value = this.Text;
            //area.Style.OverflowY = Bridge.Html5.Overflow.Auto;
        }
    });
    
    Bridge.define('System.Windows.Forms.ScrollableControl', {
        inherits: [System.Windows.Forms.Control]
    });
    
    Bridge.define('System.Windows.Forms.SplitContainer', {
        inherits: [System.Windows.Forms.Control],
        splitterDistance: 0,
        mPanel1: null,
        mPanel2: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
    
        },
        getPanel1: function () {
            return this.mPanel1;
        },
        setPanel1: function (value) {
            this.mPanel1 = Bridge.merge(new System.Windows.Forms.Panel(), JSON.parse(JSON.stringify(value)));
            this.mPanel1.setParent(this);
        },
        getPanel2: function () {
            return this.mPanel2;
        },
        setPanel2: function (value) {
            this.mPanel2 = Bridge.merge(new System.Windows.Forms.Panel(), JSON.parse(JSON.stringify(value)));
            this.mPanel2.setParent(this);
        },
        render: function () {
            var $t, $t1;
            var pane = new qx.ui.splitpane.Pane("horizontal");
            this.element = pane;
    
            $t = Bridge.getEnumerator(this.getPanel1().getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
            }
            $t1 = Bridge.getEnumerator(this.getPanel2().getControls());
            while ($t1.moveNext()) {
                var ctrl1 = $t1.getCurrent();
                ctrl1.render();
            }
    
            System.Windows.Forms.Control.prototype.render.call(this);
    
            pane.add(this.getPanel1().element, 0);
            pane.add(this.getPanel2().element, 1);
        }
    });
    
    Bridge.define('System.Windows.Forms.TabControl', {
        inherits: [System.Windows.Forms.Control],
        selectedIndex: 0,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = new qx.ui.tabview.TabView();
            //this.Element = new Bridge.Html5.DivElement();
        },
        render: function () {
            var $t;
            this.setAttributes();
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var tp = $t.getCurrent();
                this.element.add(tp.getPage(),null);
                tp.render();
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.TabPage', {
        inherits: [System.Windows.Forms.Control],
        config: {
            properties: {
                IsSelected: false,
                Page: null
            }
        },
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.setPage(new qx.ui.tabview.Page());
            this.element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        },
        render: function () {
            var $t;
            this.getPage().setLayout(new qx.ui.layout.VBox());
            this.getPage().setLabel(this.getText());
            this.getPage().add(this.element,null);
    
            $t = Bridge.getEnumerator(this.getControls());
            while ($t.moveNext()) {
                var ctrl = $t.getCurrent();
                ctrl.render();
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
        inherits: [System.Windows.Forms.Control],
        tree: null,
        root: null,
        mNodes: null,
        constructor: function () {
            System.Windows.Forms.Control.prototype.$constructor.call(this);
    
            this.tree = new qx.ui.tree.Tree();
            this.tree.setHideRoot(true);
            this.element = this.tree;
        },
        getNodes: function () {
            return this.mNodes;
        },
        setNodes: function (value) {
            this.mNodes = Bridge.merge(new Array(), JSON.parse(JSON.stringify(value)));
        },
        render: function () {
            //this.Element.Style.Overflow = Bridge.Html5.Overflow.Auto;
            //this.TreeElement = new DivElement();
            //this.TreeElement.Id = "TR_" + this.ClientId;
    
            this.renderNode(null, null);
    
    
            System.Windows.Forms.Control.prototype.render.call(this);
    
            this.element.addListener("changeSelection", Bridge.fn.bind(this, $_.System.Windows.Forms.TreeView.f3));
    
            //this.Element.AppendChild(this.TreeElement);
            //this.Element.Style.BorderStyle = BorderStyle.Solid;
            //this.Element.Style.BorderWidth = BorderWidth.Thin;
            //this.Element.Style.BorderColor = "gray";
            //this.FancyTree = Fancytree.Element(this.TreeElement);
        },
        renderNode: function (parent, parentNode) {
            var nodes = Bridge.Array.init(0, null);
    
            if (!Bridge.hasValue(parentNode)) {
                nodes = this.getNodes();
            }
            else  {
                nodes = parentNode.nodes;
            }
    
            if (nodes.length === 0) {
                return;
            }
    
            for (var i = 0; i < nodes.length; i = (i + 1) | 0) {
                var node = nodes[i];
                var folder = new qx.ui.tree.TreeFolder();
                folder.setLabel(node.name);
                node.folder = folder;
    
                this.renderNode(folder, node);
    
                if (Bridge.hasValue(parent)) {
                    parent.add(folder);
                }
                else  {
                    if (!Bridge.hasValue(this.root)) {
                        this.root = new qx.ui.tree.TreeFolder();
                        this.root.setOpen(true);
                        this.tree.setRoot(this.root);
                    }
                    this.root.add(folder);
                }
            }
        }
    });
    
    Bridge.ns("System.Windows.Forms.TreeView", $_)
    
    Bridge.apply($_.System.Windows.Forms.TreeView, {
        f1: function (t) {
            return Bridge.cast(t, qx.ui.tree.TreeFolder);
        },
        f2: function (n) {
            return { name: n.getLabel() };
        },
        f3: function (e) {
            var tree = e.getTarget();
            var selected = (Bridge.Linq.Enumerable.from(tree.getSelection()).select($_.System.Windows.Forms.TreeView.f1));
            var folders = (selected.select($_.System.Windows.Forms.TreeView.f2)).toArray();
            this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                clientId: this.getClientId(),
                eventType: "AfterSelect",
                value: folders
            } ));
        }
    });
    
    Bridge.define('System.Windows.Forms.Button', {
        inherits: [System.Windows.Forms.ButtonBase],
        constructor: function () {
            System.Windows.Forms.ButtonBase.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.Button();
        },
        render: function () {
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
    
            (Bridge.cast(this.element, qx.ui.form.Button)).setLabel(this.getText());
    
            //this.Parent.Element.Add(this.Element, new qx.html.Options()
            //{
            //    Left = this.Location.X,
            //    Top = this.Location.Y
            //});
            //KendoButton.Element(this.Element);
        }
    });
    
    Bridge.define('System.Windows.Forms.CheckBox', {
        inherits: [System.Windows.Forms.ButtonBase],
        config: {
            properties: {
                Checked: false
            }
        },
        constructor: function () {
            System.Windows.Forms.ButtonBase.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.CheckBox();
        },
        render: function () {
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
            var cb = Bridge.cast(this.element, qx.ui.form.CheckBox);
            cb.setLabel(this.getText());
            cb.setValue(this.getChecked());
    
            cb.addListener("changeValue", Bridge.fn.bind(this, function (e) {
                this.setChecked(cb.getValue());
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "checkChanged",
                    value: cb.getValue()
                } ));
            }));
    
            //var elm = jQuery.Element(this.Element);
    
            //elm.Css("cursor", "pointer");
    
            //if (rb == null)
            //{
            //    rb = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(rb);
            //}
            //rb.Id = "RB_" + this.ClientId;
            //rb.Type = InputType.Checkbox;
            //rb.Name = this.Parent.ClientId + "rb_group";
            //rb.Checked = this.Checked;
    
            //rb.OnChange = (e) =>
            //{
            //    this.Checked = rb.Checked;
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "checkChanged",
            //        Value = rb.Checked
            //    });
            //};
    
            //base.Render();
    
            //this.Element.OnClick = (e) =>
            //{
            //    rb.Checked = !rb.Checked;
            //    if (this.HasEvent("Click"))
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "click"
            //        });
            //    }
            //};
    
        }
    });
    
    Bridge.define('System.Windows.Forms.ListBox', {
        inherits: [System.Windows.Forms.ListControl],
        constructor: function () {
            System.Windows.Forms.ListControl.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.List();
        },
        render: function () {
            var $t;
            System.Windows.Forms.ListControl.prototype.render.call(this);
    
            var list = Bridge.cast(this.element, qx.ui.form.List);
            var items = (Bridge.Linq.Enumerable.from(this.items).select($_.System.Windows.Forms.ListBox.f1));
            $t = Bridge.getEnumerator(items);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                list.add(item,null);
            }
    
        }
    });
    
    Bridge.ns("System.Windows.Forms.ListBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.ListBox, {
        f1: function (l) {
            return new qx.ui.form.ListItem(l.toString());
        }
    });
    
    Bridge.define('System.Windows.Forms.GroupBox', {
        inherits: [System.Windows.Forms.Panel],
        constructor: function () {
            System.Windows.Forms.Panel.prototype.$constructor.call(this);
    
            this.renderLabel = false;
            this.element = new qx.ui.groupbox.GroupBox();
        },
        render: function () {
            var gb = Bridge.cast(this.element, qx.ui.groupbox.GroupBox);
            gb.setLegend(this.getText());
    
            System.Windows.Forms.Panel.prototype.render.call(this);
            //this.Element.Style.BorderStyle = Bridge.Html5.BorderStyle.Solid;
            //this.Element.Style.BorderWidth = Bridge.Html5.BorderWidth.Thin;
            //this.Element.Style.BorderColor = "gray";
    
            //if( this.Label == null )
            //{
            //    this.Label = new Label();
            //    this.Element.AppendChild(this.Label.Element);
            //}
            //this.Label.Element.Style.Top = "-6px";
            //this.Label.Element.Style.Left = "10px";
            //this.Label.Element.Style.PaddingLeft = "2px";
            //this.Label.Element.Style.PaddingRight = "2px";
            //this.Label.Element.Style.BackgroundColor = "white";
            //this.Label.Element.Style.Position = Bridge.Html5.Position.Relative;
            //SetText(this.Label.Element);
            //if (this.HasEvent("TextChanged"))
            //{
            //    this.Label.Element.OnChange = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "textchanged",
            //            Value = this.Label.Element.InnerHTML
            //        });
            //    };
            //}
        }
    });
    
    Bridge.define('System.Windows.Forms.HeaderedItemsControl', {
        inherits: [System.Windows.Forms.ItemsControl]
    });
    
    Bridge.define('System.Windows.Forms.MainMenu', {
        inherits: [System.Windows.Forms.Menu],
        constructor: function () {
            System.Windows.Forms.Menu.prototype.$constructor.call(this);
    
            this.element = new qx.ui.menubar.MenuBar();
        },
        render: function () {
            var $t;
            System.Windows.Forms.Menu.prototype.render.call(this);
    
            var mb = Bridge.cast(this.element, qx.ui.menubar.MenuBar);
            $t = Bridge.getEnumerator(this.getMenuItems());
            while ($t.moveNext()) {
                var mi = $t.getCurrent();
                mb.add(new qx.ui.menubar.Button(mi.getName(), null, null),null);
            }
        }
    });
    
    Bridge.define('System.Windows.Forms.MaskedTextBox', {
        inherits: [System.Windows.Forms.TextBox],
        mask: null,
        render: function () {
            System.Windows.Forms.TextBox.prototype.render.call(this);
    
            this.element.addListener("appear", Bridge.fn.bind(this, $_.System.Windows.Forms.MaskedTextBox.f1));
    
            //KendoMaskedTextBox.Element(this.Element, this.Mask);
        }
    });
    
    Bridge.ns("System.Windows.Forms.MaskedTextBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.MaskedTextBox, {
        f1: function (e) {
            var w = Bridge.cast(this.element, qx.ui.core.Widget);
            var elm = w.getContentElement().getDomElement();
            $(elm).mask(this.mask);
        }
    });
    
    Bridge.define('System.Windows.Forms.RadioButton', {
        inherits: [System.Windows.Forms.ButtonBase],
        config: {
            properties: {
                Checked: false
            }
        },
        constructor: function () {
            System.Windows.Forms.ButtonBase.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.RadioButton();
        },
        render: function () {
            System.Windows.Forms.ButtonBase.prototype.render.call(this);
    
            var rb = Bridge.cast(this.element, qx.ui.form.RadioButton);
            rb.setLabel(this.getText());
            rb.setValue(this.getChecked());
            rb.addListener("changeValue", Bridge.fn.bind(this, function (e) {
                this.setChecked(rb.getValue());
                this.fireEvent(Bridge.merge(new System.Windows.Forms.WSEventArgs(), {
                    clientId: this.getClientId(),
                    eventType: "checkChanged",
                    value: rb.getValue()
                } ));
            }));
    
            //qx.ui.form.RadioGroup group = null;
            //var groupId = this.Parent.ClientId + "rb_group";
            //if( rbGroups.ContainsKey(groupId) )
            //{
            //    group = rbGroups[groupId];
            //}
            //else
            //{
            //    group = new qx.ui.form.RadioGroup();
            //    rbGroups.Add(groupId, group);
            //}
            rb.setGroup(this.getParent().radioButtonGroup);
    
            //var elm = jQuery.Element(this.Element);
    
            //elm.Css("cursor", "pointer");
    
            //if(rb == null)
            //{
            //    rb = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(rb);
            //}
            //rb.Id = "RB_" + this.ClientId;
            //rb.Type = InputType.Radio;
            //rb.Name = this.Parent.ClientId + "rb_group";
            //rb.Checked = this.Checked;
    
            //rb.OnChange = (e) =>
            //{
    
            //};
    
            //base.Render();
    
            //this.Element.OnClick = (e) =>
            //{
            //    if( !rb.Checked )
            //    {
            //        rb.Checked = true;
            //    }
    
            //    if (this.HasEvent("Click"))
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "click"
            //        });
            //    }
            //};
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
    
    Bridge.define('System.Windows.Forms.CheckedListBox', {
        inherits: [System.Windows.Forms.ListBox],
        constructor: function () {
            System.Windows.Forms.ListBox.prototype.$constructor.call(this);
    
            this.element = new qx.ui.form.List();
        },
        render: function () {
            this.setAttributes();
    
            var list = Bridge.cast(this.element, qx.ui.form.List);
    
            //var rawData = JSON.Stringify(this.Items);
            //var arrayWrapper = qx.data.marshal.Json.CreateModel(rawData);
    
            //var listController = new qx.data.controller.List(arrayWrapper, list, "name");
    
            //foreach (var item in Items)
            //{
            //    list.Add(new qx.ui.form.CheckBox(item.ToString()));
            //}
            var rawData = (Bridge.Linq.Enumerable.from(this.items).select($_.System.Windows.Forms.CheckedListBox.f1)).toArray();
    
            var data = new qx.data.Array(rawData);
            var controller = new qx.data.controller.List(null, list);
    
            // create the delegate to change the bindings
            var del = { configureItem: $_.System.Windows.Forms.CheckedListBox.f2, createItem: $_.System.Windows.Forms.CheckedListBox.f3, bindItem: $_.System.Windows.Forms.CheckedListBox.f4 };
            controller.setDelegate(del);
    
            controller.setModel(data);
        }
    });
    
    Bridge.ns("System.Windows.Forms.CheckedListBox", $_)
    
    Bridge.apply($_.System.Windows.Forms.CheckedListBox, {
        f1: function (i) {
            return Bridge.merge(new System.Windows.Forms.CheckedListBox.CheckedItem(), {
                setName: i.toString(),
                setChecked: false
            } );
        },
        f2: function (item) {
            item.setPadding(3);
        },
        f3: function () {
            return new qx.ui.form.CheckBox();
        },
        f4: function (ctrl, item, id) {
            ctrl.bindProperty("", "model", null, item, id);
            ctrl.bindProperty("name", "label", null, item, id);
            ctrl.bindProperty("checked", "value", null, item, id);
            ctrl.bindPropertyReverse("checked", "value", null, item, id);
        }
    });
    
    Bridge.define('System.Windows.Forms.MenuItem', {
        inherits: [System.Windows.Forms.HeaderedItemsControl],
        menuItems: null,
        config: {
            properties: {
                Index: 0
            }
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
