var controls = [];
var ws = null;

zebra.ready(function () {
    // import all classes, functions, constants
    // from zebra.ui, zebra.layout packages
    eval(zebra.Import("ui", "layout"));

    ws = new WebSocket("ws://" + window.location.hostname +
           "/WebUI2/echo");
    ws.onopen = function () {
        var evt = {
            EventType: 'openForm'
        };
        send(evt);
        //alert("connected");
    };
    ws.onmessage = function (evt) {
        var obj = JSON.parse(evt.data);
        if (obj == null) {
            return;
        }
        if (obj.EventType != undefined) {
            switch (obj.EventType) {
                case 'MessageBox':
                    alert(obj.Value.Text);
                    break;
                case 'PropertyChanged':
                    onChangeProperty(obj);
                    break;
                //case 'removeControl':
                //    var windowDiv = document.getElementById('WI_' + obj.ClientId);
                //    if (windowDiv != undefined)
                //        $(windowDiv).remove();
                //    var ctrl = document.getElementById('WU_' + obj.ClientId);
                //    if (ctrl != undefined)
                //        $(ctrl).remove();
                //    break;
                //case 'addControl':
                //    var ctrl = JSON.parse(obj.Value);
                //    var parent = document.getElementById("WU_" + ctrl.ParentId);
                //    createNewElement(ctrl, parent);
                //    break;
            }
        }
        else {
            createNewForm(obj);
        }
        //alert(evt.data);
    };
    ws.onerror = function (evt) {
        alert(evt.message);
    };
    ws.onclose = function () {
        alert("disconnected");
    };

    function send(e) {
        ws.send(JSON.stringify(e));
    }

    function onChangeProperty(obj) {
        controls[obj.ClientId].Update(obj);
    }

    function createNewForm(obj) {
        createNewElement(obj);
    }

    function createNewElement(obj, parent) {
        var type = obj.ControlName;
        var div = null;
        var ctrl = null;
        switch (type) {
            case "Form":
                {
                    ctrl = new FormCtrl();
                }
                break;
            case "Button":
                {
                    ctrl = new ButtonCtrl();

                }
                break;
            case "Label":
                {
                    ctrl = new LabelCtrl();
                }
                break;
            case "TextBox":
                {
                    ctrl = new TextBoxCtrl();
                }
                break;
            case "RadioButton":
                {
                    ctrl = new RadioButtonCtrl();
                }
                break;
            case "ListView":
                {
                    ctrl = new ListViewCtrl();
                }
                break;
            case "ComboBox":
                {
                    ctrl = new ComboBoxCtrl();
                }
                break;
            default:
                //alert('Unknown type' + type);
                return;
        }

        div = ctrl.Render(obj);

        controls[obj.ClientId] = ctrl;

        for (var i = 0; i < obj.Controls.length; i++) {
            var ctrl = obj.Controls[i];
            var newElement = createNewElement(ctrl);
            if (newElement == undefined)
                continue;

            div.add(newElement);
        }

        return div;
    }

    var ControlCtrl = function () {
        this.Element = null;
    }

    ControlCtrl.prototype.Update = function (elm, obj) {
        var prop = obj.Value;
        switch (prop.Name) {
            case "Size":
                {
                    //var size = prop.Value.split(',');
                    //this.Element.style.width = size[0] + 'px';
                    //this.Element.style.height = size[1] + 'px';
                }
                break;
            case "Visible":
                {
                    //if (prop.Value) {
                    //    this.Element.style.visibility = 'inline-block';
                    //}
                    //else {
                    //    this.Element.style.visibility = 'hidden';
                    //}
                }
                break;
            case "Text":
                {
                    if (elm.getValue != undefined) {
                        var current = elm.getValue();
                        if (current != prop.Value) {
                            elm.setValue(prop.Value);
                            var evt = {
                                ClientId: elm.id,
                                EventType: 'textchanged',
                                Value: prop.Value
                            };
                            send(evt);
                        }
                    }
                }
                break;
        }
    };

    ControlCtrl.prototype.Render = function (div, obj) {
        if (div == undefined)
        {
            return;
        }

        var size = obj.Size.split(',');
        var loc = obj.Location.split(',');
        div.id = obj.ClientId;

        div.setBounds(parseInt(loc[0]), parseInt(loc[1]), parseInt(size[0]), parseInt(size[1]));
        //this.prototype.Element = div;
    };

    var ButtonCtrl = function () {

    }

    ButtonCtrl.prototype = Object.create(ControlCtrl.prototype);

    ButtonCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
        var prop = obj.Value;
        switch (prop.Name) {
            case "Text":
                {
                    this.Label.setValue(prop.Value);
                }
                break;
        }
    };

    ButtonCtrl.prototype.Render = function (obj) {
        this.Label = new Label(obj.Text);
        this.Element = new Button(this.Label);
        this.Element.bind(function (e) {
            var evt = {
                ClientId: e.id,
                EventType: 'click'
            };
            send(evt);
        });
        ControlCtrl.prototype.Render(this.Element, obj)
        return this.Element;
    };

    var TextBoxCtrl = function () {

    }

    TextBoxCtrl.prototype = Object.create(ControlCtrl.prototype);

    TextBoxCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    TextBoxCtrl.prototype.Render = function (obj) {
        this.Element = new TextField(obj.Text, true);
        ControlCtrl.prototype.Render(this.Element, obj)
        return this.Element;
    };

    var ComboBoxCtrl = function () {

    }

    ComboBoxCtrl.prototype = Object.create(ControlCtrl.prototype);

    ComboBoxCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    ComboBoxCtrl.prototype.Render = function (obj) {
        this.Element = new Combo();
        ControlCtrl.prototype.Render(this.Element, obj)
        return this.Element;
    };

    var ListViewCtrl = function () {

    }

    ListViewCtrl.prototype = Object.create(ControlCtrl.prototype);

    ListViewCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    ListViewCtrl.prototype.Render = function (obj) {

    };

    var RadioButtonCtrl = function () {

    }

    RadioButtonCtrl.prototype = Object.create(ControlCtrl.prototype);

    RadioButtonCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    RadioButtonCtrl.prototype.Render = function (obj) {
        this.Element = new RadioBox();
        ControlCtrl.prototype.Render(this.Element, obj)
        return this.Element;
    };

    var LabelCtrl = function () {

    }

    LabelCtrl.prototype = Object.create(ControlCtrl.prototype);

    LabelCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    LabelCtrl.prototype.Render = function (obj) {
        this.Element = new Label();
        ControlCtrl.prototype.Render(this.Element, obj)
        return this.Element;
    };

    var FormCtrl = function () {

    }

    FormCtrl.prototype = Object.create(ControlCtrl.prototype);

    FormCtrl.prototype.Update = function (obj) {
        ControlCtrl.prototype.Update(this.Element, obj);
    };

    FormCtrl.prototype.Render = function (obj) {
        var size = obj.ClientSize.split(',');
        var loc = obj.Location.split(',');

        // create canvas
        this.Element = (new zCanvas(parseInt(size[0]), parseInt(size[1]))).root;
        this.Element.setBorder(borders.plain);

        return this.Element;
    };
});