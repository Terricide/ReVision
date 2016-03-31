var controls = [];
var rootForm = true;
var ws;

function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

$().ready(function () {
    var path = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));

    if (window.location.port.length > 1)
    {
        path = ":" + window.location.port + path
    }

    var data = sessionStorage.getItem('sessionId');
    if (data == undefined)
    {
        data = generateUUID();
        sessionStorage.setItem('sessionId', data)
    }

    ws = new WebSocket("ws://" + window.location.hostname + path + "/echo?id=" + data);
    ws.onopen = function () {
        var evt = {
            EventType: 'openForm'
        };
        send(evt);
        //alert("connected");
    };
    ws.onmessage = function (evt) {
        var obj = JSON.parse(evt.data);
        if (obj == null)
        {
            return;
        }

        if (obj.ClassName != undefined && obj.Message != undefined)
        {
            var exception = obj;
            if (obj.InnerException != undefined)
            {
                exception = obj.InnerException;
            }
            function onShow(e) {
                if (e.sender.getNotifications().length == 1) {
                    var element = e.element.parent(),
                        eWidth = element.width(),
                        eHeight = element.height(),
                        wWidth = $(window).width(),
                        wHeight = $(window).height(),
                        newTop, newLeft;

                    newLeft = Math.floor(wWidth / 2 - eWidth / 2);
                    newTop = Math.floor(wHeight / 2 - eHeight / 2);

                    e.element.parent().css({ top: newTop, left: newLeft });
                }
            }
            var notification = $("#notification").kendoNotification({
                autoHideAfter: 0,
                stacking: "down",
                show: onShow,
                templates: [{
                    type: "error",
                    template: $("#errorTemplate").html()
                }]

            }).data("kendoNotification");
            notification.show({
                title: exception.ExceptionMethod,
                message: exception.Message + ' ' + exception.StackTraceString
            }, "error");
            //alert(exception.ExceptionMethod + ' ' + exception.Message + ' ' + exception.StackTraceString);
            return;
        }

        if (obj.EventType != undefined)
        {
            switch(obj.EventType)
            {
                case 'MessageBox':
                    alert(obj.Value.Text);
                    break;
                case 'PropertyChanged':
                case 'addListViewItem':
                case 'addListItem':
                case 'removeListViewItem':
                case 'removeListItem':
                case 'addListViewColumn':
                case 'removeListViewColumn':
                case 'clearList':
                    onChangeProperty(obj);
                    break;
                case 'removeControl':
                    var windowDiv = document.getElementById('WI_' + obj.ClientId);
                    if (windowDiv != undefined)
                        $(windowDiv).remove();
                    var ctrl = document.getElementById('WU_' + obj.ClientId);
                    if (ctrl != undefined)
                        $(ctrl).remove();
                    break;
                case 'addControl':
                    onAddControl(obj);
                    break;
                case 'FormCreate':
                    createNewForm(obj.Value);
                    break;
                default:
                    alert(obj.EventType);
                    break;
            }
        }
    };
    ws.onerror = function (evt) {
        alert(evt.message);
    };
    ws.onclose = function () {
        alert("disconnected");
    };
});

function dropClasses(o) {

    for (var p in o) {
        if (o[p] instanceof jQuery || o[p] instanceof HTMLElement) {
            o[p] = null;
        }
        else if (typeof o[p] == 'object')
            dropClasses(o[p]);
    }
};

function send(e) {
    //var str = JSON.stringify(dropClasses(e));
    try
    {
        var str = stringifyRecursion(e);
        ws.send(str);
    }
    catch(e)
    {
        console.log(e);
    }
    //ws.send(JSON.stringify(e));
    //ws.send(str);
}

function onChangeProperty(obj) {
    if (controls[obj.ClientId] == undefined)
    {
        return;
    }
    controls[obj.ClientId].Update(obj);
}

function onAddControl(obj) {
    var ctrl = JSON.parse(obj.Value);
    var parent = document.getElementById("WU_" + ctrl.ParentId);
    var element = createNewElement(ctrl, parent);
}

function onRemoveControl(obj) {
    controls[obj.ClientId].Remove();
}

function createNewForm(obj) {
    var parent = null;
    if (obj.ParentId != undefined)
    {
        parent = controls[obj.ParentId];
    }
    if (controls[obj.ClientId] != undefined)
    {
        return;
    }
    createNewElement(obj, parent);
}

function createNewElement(obj, parent) {
    var type = obj.ControlName;
    var div = null;
    var ctrl = null;
    switch(type)
    {
        case "Form":
            {
                ctrl = new Form();
            }
            break;
        case "Button":
            {
                ctrl = new Button();
            }
            break;
        case "Label":
            {
                ctrl = new Label();
            }
            break;
        case "TextBox":
            {
                ctrl = new TextBox();
            }
            break;
        case "MaskedTextBox":
            {
                ctrl = new MaskedTextBox();
            }
            break;
        case "RichTextBox":
            {
                ctrl = new RichTextBox();
            }
            break;
        case "RadioButton":
            {
                ctrl = new RadioButton();
            }
            break;
        case "ListView":
            {
                ctrl = new ListView();
            }
            break;
        case "ComboBox":
            {
                ctrl = new ComboBox();
            }
            break;
        case "Panel":
            {
                ctrl = new Panel();
            }
            break;
        case "PictureBox":
            {
                ctrl = new PictureBox();
            }
            break;
        case "UserControl":
            {
                ctrl = new UserControl();
            }
            break;
        case "CheckBox":
            {
                ctrl = new CheckBox();
            }
            break;
        case "LinkLabel":
            {
                ctrl = new LinkLabel();
            }
            break;
        case "FlowLayoutPanel":
            {
                ctrl = new Panel();
            }
            break;
        case "TabControl":
            {
                ctrl = new TabControl();
            }
            break;
        case "TabPage":
            {
                ctrl = new TabPage();
            }
            break;
        case "TreeView":
            {
                ctrl = new TreeView();
            }
            break;
        case "CheckedListBox":
            {
                ctrl = new CheckedListBox();
            }
            break;
        case "ListBox":
            {
                ctrl = new ListBox();
            }
            break;
        case "GroupBox":
            {
                ctrl = new GroupBox();
            }
            break;
        case "MonthCalendar":
            {
                ctrl = new MonthCalendar();
            }
            break;
        case "DateTimePicker":
            {
                ctrl = new DateTimePicker();
            }
            break;
        case "ProgressBar":
            {
                ctrl = new ProgressBar();
            }
            break;
        case "SplitContainer":
            {
                ctrl = new SplitContainer();
            }
            break;
        case "StatusStrip":
            {
                ctrl = new Panel();
            }
            break;
        default:
            if (obj.Canvas != undefined)
            {
                ctrl = new CustomControl();
            }
            else
            {
                alert('Unknown type' + type);
                return;
            }
    }
    ctrl.Name = obj.Name;
    ctrl.ControlType = type;
    ctrl.ClientId = obj.ClientId;
    controls[obj.ClientId] = ctrl;
    controls[obj.ClientId].children = [];
    div = ctrl.Render(obj, parent);

    //var ul = null;

    //switch (type) {
    //    case "FlowLayoutPanel":
    //        ul = document.createElement('ul');
    //        div.Element.appendChild(ul);
    //        break;
    //}
   
    if (type != "TabControl") {

        for (var i = 0; i < obj.Controls.length; i++) {
            var childCtrl = obj.Controls[i];
            var li = div.Element;
            //if (ul != null)
            //{
            //    li = document.createElement('li');
            //    ul.appendChild(li);
            //}

            var newElement = createNewElement(childCtrl, li);
            controls[obj.ClientId].children.push(newElement);
        }
    }

    if (parent != null) {
        reAlignControl(parent, ctrl);
    }

    return div;
}

// This function realigns all the controls for docking
function reAlignControl(parent, current) {
    var childControls = parent.children;

    var top = 0;
    var left = 0;
    var bottom = 0;
    var right = 0;

    switch (current.Element.Dock) {
        //Left
        case 1:
            {
                left = current.Element.clientWidth;
                for (var i = 0; i < childControls.length; i++) {
                    var child = childControls[i];
                    switch (child.Dock) {
                        case 4:
                        case 3:
                        case 5: {
                            var ctrl = $(child);
                            var ctrlWidth = ctrl.width();
                            var ctrlLeft = ctrl.position().left;
                            ctrl.css('left', ctrlLeft + left);
                            ctrl.css('width', ctrlWidth - ctrlLeft - left);
                        }                           
                        break;
                    }
                }
            }
            break;
            //Right
        case 2:
            {
                right = current.Element.clientWidth;
                for (var i = 0; i < childControls.length; i++) {
                    var child = childControls[i];
                    if (child.id == current.Element.id) {
                        continue;
                    }
                    switch (child.Dock) {
                        case 3:
                        case 4:
                        case 5: {
                            var ctrl = $(child);
                            var ctrlWidth = ctrl.width();
                            var ctrlLeft = ctrl.position().left;
                            var newWidth = ctrlWidth - right - ctrlLeft;
                            ctrl.css('width', newWidth);
                        }
                            break;
                    }
                }
            }
            break;
            //Top
        case 3:
            {
                top = $(current.Element).height();
                for (var i = 0; i < childControls.length; i++) {
                    var child = childControls[i];
                    if (child.id == current.Element.id) {
                        continue;
                    }
                    switch (child.Dock) {
                        case 3: {
                            var ctrl = $(child);
                            var ctrlTop = ctrl.position().top;
                            ctrl.css('top', ctrlTop + top);
                        }
                            break;
                        case 5: {
                            var ctrl = $(child);
                            var ctrlTop = ctrl.position().top;
                            var ctrlHeight = ctrl.height();
                            ctrl.css('top', ctrlTop + top);
                            ctrl.css('height', ctrlHeight - top);
                        }
                            break;
                    }
                }
            }
            break;
            //Bottom
        case 4:
            {
                bottom = $(current.Element).height();
                for (var i = 0; i < childControls.length; i++) {
                    var child = childControls[i];
                    if (child.id == current.Element.id) {
                        continue;
                    }
                    switch (child.Dock) {
                        case 4: {
                            var ctrl = $(child);
                            var ctrlTop = child.offsetTop;
                            ctrl.css('top', ctrlTop - bottom);
                        }
                            break;
                        case 5: {
                            var ctrl = $(child);
                            var ctrlHeight = ctrl.height();
                            ctrl.css('height', ctrlHeight - bottom);
                        }
                            break;
                    }
                }
            }
            break;
    }
}

var Control = function () {
    this.Element = null;
}

Control.prototype.Remove = function (obj) {
    var windowDiv = document.getElementById('WI_' + obj.ClientId);
    if (windowDiv != undefined)
        $(windowDiv).remove();
    var ctrl = document.getElementById('WU_' + obj.ClientId);
    if (ctrl != undefined)
        $(ctrl).remove();
}

Control.prototype.Update = function(div, obj) {
    var prop = obj.Value;
    if (prop == undefined) {
        return;
    }
    switch (prop.Name) {
        case "Size":
            var size = prop.Value.split(',');
            div.style.width = size[0] + 'px';
            div.style.height = size[1] + 'px';
            break;
        case "Visible":
            {
                if (prop.Value) {
                    div.style.visibility = 'inline-block';
                }
                else {
                    div.style.visibility = 'hidden';
                }
            }
            break;
    }
};

Control.prototype.RenderText = function(div, obj) {
    if (obj.ForeColor != undefined && obj.ForeColor != "")
    {
        div.style.color = obj.ForeColor;
    }

    if (obj.Font != undefined)
    {
        var split = obj.Font.split(',');

        div.style.fontFamily = split[0];

        var fs = parseInt(split[1].replace('pt', ''));
        fs = fs + 5;
        div.style.fontSize = fs + 'px';
    }

}

Control.prototype.Render = function (div, obj, parent) {
    obj.HasEvent = function (name) {
        if ($.inArray(name, this.AllEvents) > -1) {
            return true;
        }
        return false;
    };
    var parentWidth = null, parentHeight = null;
    if (parent != undefined && parent != null)
    {
        parentWidth = $(parent).width();
        parentHeight = $(parent).height();
        parent.appendChild(div);
    }

    this.Element = div;
    var loc = obj.Location.split(',');
    var size = null;

    if (obj.ClientSize != undefined) {
        size = obj.ClientSize.split(',');
    }

    if (size == null || size.length != 2 || parseInt(size[0]) == 0 || parseInt(size[1]) == 0) {
        size = obj.Size.split(',')
    }

    if (obj.Anchor != undefined && parent != null)
    {
        var rightSet, leftSet, bottomSet, topSet;

        var Anchor = {
            none: 0,
            left: 1,
            top: 2,
            right: 4,
            bottom: 8
        }

        if ((obj.Anchor & Anchor.right) == Anchor.right) {
            rightSet = true;
        }

        if ((obj.Anchor & Anchor.left) == Anchor.left) {
            leftSet = true;
        }

        if ((obj.Anchor & Anchor.bottom) == Anchor.bottom) {
            bottomSet = true;
        }

        if ((obj.Anchor & Anchor.top) == Anchor.top) {
            topSet = true;
        }

        if (topSet && rightSet == undefined && leftSet == undefined && bottomSet == undefined)
        {
            var width = $(parent).width();
            loc[0] = width / 2 - parseInt(size[0]) / 2;
        }

        if (bottomSet && topSet == undefined && rightSet == undefined && leftSet == undefined)
        {
            var height = $(parent).height();
            loc[1] = height / 2 - parseInt(size[1]) / 2;
        }

        if (bottomSet && leftSet && topSet == undefined && rightSet == undefined)
        {
            var height = $(parent).height();
            loc[1] = height - parseInt(size[1]);
        }

        if (bottomSet && rightSet && topSet == undefined && leftSet == undefined) {
            var width = $(parent).width();
            loc[0] = width - parseInt(size[0]);

            var height = $(parent).height();
            loc[1] = height - parseInt(size[1]);
        }

        if (topSet && rightSet && leftSet == undefined && bottomSet == undefined) {
            var width = $(parent).width();
            loc[0] = width - parseInt(size[0]);
        }


        if( obj.Anchor == 0 )
        {
            div.style.position = 'relative';
        }
        else
        {
            div.style.position = 'absolute';
        }
    }
    else
    {
        div.style.position = 'absolute';
    }

    if (obj.Dock != undefined)
    {
        div.Dock = obj.Dock;
        switch(obj.Dock)
        {
            //None
            case 0: //none
                {
                    div.style.width = size[0] + 'px';
                    div.style.height = size[1] + 'px';
                    div.style.top = loc[1] + 'px';
                    div.style.left = loc[0] + 'px';
                }
                break;
            //Left
            case 1:
                {
                    //div.style.cssFloat = 'left';
                    div.style.width = size[0] + 'px';
                    div.style.height = '100%';
                    div.setAttribute('r-docking', 'L');
                }
                break;
            //Right
            case 2:
                {
                    //div.style.cssFloat = 'right';
                    div.style.width = size[0] + 'px';
                    div.style.height = '100%';
                    div.style.right = 0;
                    div.setAttribute('r-docking', 'R');
                }
                break;
            //Top
            case 3:
                {
                    //div.style.verticalAlign = 'top';
                    div.style.height = size[1] + 'px';
                    div.style.width = '100%';
                    div.setAttribute('r-docking', 'T');
                }
                break;
            //Bottom
            case 4:
                {
                    //div.style.verticalAlign = 'bottom';
                    div.style.height = size[1] + 'px';
                    div.style.width = '100%';
                    
                    $(div).css({ bottom: 0 });
                    div.setAttribute('r-docking', 'B');
                }
                break;
            //Fill
            case 5:
                {
                    div.style.width = '100%';
                    div.style.height = '100%';
                    div.style.top = '0';
                    div.style.left = '0';
                    div.setAttribute('r-docking', 'F');
                }
                break;
        }
    }
    else
    {
        div.style.width = size[0] + 'px';
        div.style.height = size[1] + 'px';
        div.style.top = loc[1] + 'px';
        div.style.left = loc[0] + 'px';
    }

    div.style.paddingTop = obj.Padding.Top + 'px';
    div.style.paddingLeft = obj.Padding.Left + 'px';
    div.style.paddingRight = obj.Padding.Right + 'px';
    div.style.paddingBottom = obj.Padding.Bottom + 'px';

    div.style.backgroundColor = obj.BackColor;

    div.id = "WU_" + obj.ClientId;
    div.setAttribute('vControlName', obj.Name);

    if (obj.Visible != undefined && obj.Visible == false)
    {
        div.style.visibility = 'hidden';
    }

    if (obj.AutoScroll != undefined && obj.AutoScroll == false)
    {
        div.style.overflow = 'hidden';
    }

    Control.prototype.RenderText(div, obj);

    if (obj.HasEvent("Click")) {
        $(div).css({ "cursor": "pointer" });
        div.addEventListener('click', function (e) {
            var evt = {
                ClientId: this.id,
                EventType: 'click'
            };
            send(evt);
        });
    }

    if (obj.HasEvent("MouseMove")) {
        div.addEventListener('mousemove', function (e) {
            var args = {
                X: e.x,
                Y: e.y
            };
            var evt = {
                ClientId: this.id,
                EventType: 'mousemove',
                Value: args
            };
            send(evt);
        });
    }

    if (obj.HasEvent("MouseEnter")) {
        div.addEventListener('mouseenter', function (e) {
            var evt = {
                ClientId: this.id,
                EventType: 'mouseenter',
            };
            send(evt);
        });
    }

    if (obj.HasEvent("MouseLeave")) {
        div.addEventListener('mouseleave', function (e) {
            var evt = {
                ClientId: this.id,
                EventType: 'mouseleave'
            };
            send(evt);
        });
    }

    if (obj.BackgroundImage != undefined) {
        $(div).css("background-image", "url('data:image/png;base64," + obj.BackgroundImage + "')");
        if( obj.BackgroundImageLayout != undefined)
        {
            switch(obj.BackgroundImageLayout)
            {
                //none
                case 0:
                    break;
                //Center
                case 1:
                    break;
                //Stretch
                case 2:
                    $(div).css("background-size", "cover");
                    break;
                //Tile
                case 3:
                    break;
                //Zoom
                case 4:
                    break;
            }
        }        
    }
};

var CustomControl = function () {

}

CustomControl.prototype = Object.create(Control.prototype);

CustomControl.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);

    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Text.innerText = prop.Value;
            break;
        case "Canvas": {
            var ctx = this.Canvas.getContext("2d");
            ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
            var image = new Image();
            image.onload = function () {
                ctx.drawImage(this, 0, 0);
            };
            image.src = "data:image/png  ;base64," + prop.Value;
        }
            break;
    }
};

CustomControl.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    if (obj.Canvas != undefined) {
        var size = null;

        if (obj.ClientSize != undefined) {
            size = obj.ClientSize.split(',');
        }

        this.Canvas = document.createElement('canvas');
        var ctx = this.Canvas.getContext("2d");
        this.Canvas.id = "CX_" + obj.ClientId;
        this.Canvas.width = size[0];
        this.Canvas.height = size[1];
        this.Canvas.style.position = "absolute";
        this.Element.appendChild(this.Canvas);
        var image = new Image();
        image.onload = function () {
            ctx.drawImage(this, 0, 0);
        };
        image.src = "data:image/png  ;base64," + obj.Canvas;
    }
    //if (obj.Text != undefined) {
    //    this.Text = document.createElement('div');
    //    Control.prototype.RenderText(this.Text, obj);
    //    this.Text.innerText = obj.Text;
    //    this.Text.style.textAlign = 'center';
    //    this.Text.style.width = this.Element.style.width;
    //    this.Text.style.height = '50%';
    //    this.Text.style.top = '45%';
    //    this.Text.style.position = 'absolute';
    //    this.Element.appendChild(this.Text);
    //}
    return this;
};

var Button = function () {

}

Button.prototype = Object.create(Control.prototype);

Button.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);

    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Element.innerText = prop.Value;
            break;
    }
};

Button.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('button');
    if (obj.Text != undefined) {
        this.Element.innerText = obj.Text;
    }
    Control.prototype.Render(this.Element, obj, parent);
    $(this.Element).kendoButton();
    return this;
};

var TextBox = function () {

}

TextBox.prototype = Object.create(Control.prototype);

TextBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Element.value = prop.Value;
            break;
        case "PasswordChar": {
            if (prop.Value != undefined && prop.Value.length > 0 && prop.Value != '\0') {
                this.Element.setAttribute("type", "password");
            }
            else {
                this.Element.setAttribute("type", "text");
            }
        }
            break;
    }
};

TextBox.prototype.Render = function (obj, parent) {
    if (obj.Multiline)
    {
        this.Element = document.createElement('textarea');
    }
    else
    {
        this.Element = document.createElement('input');
    }
    this.Element.className = "k-textbox";
    this.Element.onchange = function () {
        var evt = {
            ClientId: this.id,
            EventType: 'textchanged',
            Value: this.value
        };
        send(evt);
    };

    if (obj.PasswordChar != undefined && obj.PasswordChar.length > 0 && obj.PasswordChar != '\0')
    {
        this.Element.setAttribute("type", "password");
    }
    this.Element.value = obj.Text;
    Control.prototype.Render(this.Element, obj, parent);

    if (obj.HasEvent("KeyDown")) {
        $(this.Element).keydown(function (e) {
            var evt = {
                ClientId: this.id,
                EventType: 'keyDown',
                Value: {
                    Shift: e.shiftKey,
                    Alt: e.altKey,
                    Control: e.ctrlKey,
                    KeyValue: e.which
                }
            };
            send(evt);
        });
    }

    if (obj.HasEvent("KeyPress")) {
        $(this.Element).keydown(function (e) {
            if (e.char == '\n') {
                e.target.onchange();
            }
            var evt = {
                ClientId: this.id,
                EventType: 'keyPress',
                Value: {
                    KeyChar: e.char
                }
            };
            send(evt);
        });
    }

    return this;
};

var MaskedTextBox = function () {

}

MaskedTextBox.prototype = Object.create(Control.prototype);

MaskedTextBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Element.value = prop.Value;
            break;
        case "Mask":
            {
                var maskedtextbox = $(this.Element).data("kendoMaskedTextBox");
                maskedtextbox.destroy();

                this.Mask = $(this.Element).kendoMaskedTextBox({
                    mask: prop.Value
                });
            }
            break;
    }
};

MaskedTextBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('input');
    this.Element.className = "k-textbox";
    this.Element.onchange = function () {
        var evt = {
            ClientId: this.id,
            EventType: 'textchanged',
            Value: this.value
        };
        send(evt);
    };
    Control.prototype.Render(this.Element, obj, parent);
    this.Mask = $(this.Element).kendoMaskedTextBox({
        mask: obj.Mask
    });
    this.Element.value = obj.Text;
    return this;
};

var RichTextBox = function () {

}

RichTextBox.prototype = Object.create(Control.prototype);

RichTextBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Element.value = prop.Value;
            break;
    }
};

RichTextBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('textarea');
    this.Element.onchange = function () {
        var evt = {
            ClientId: this.id,
            EventType: 'textchanged',
            Value: this.value
        };
        send(evt);
    };
    this.Element.readOnly = obj.ReadOnly;
    this.Element.value = obj.Text;
    Control.prototype.Render(this.Element, obj, parent);
    this.Element.style.overflowY = 'auto';
    return this;
};

var ComboBox = function () {

}

ComboBox.prototype = Object.create(Control.prototype);

ComboBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);

    var prop = obj.Value;
    switch (prop.Name) {
        case "SelectedIndex":
            var item = this.cb.select(prop.Value);
            break;
    }
};

ComboBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.ComboBox = document.createElement('input');
    this.ComboBox.id = "CB_" + obj.ClientId;
    this.Element.appendChild(this.ComboBox);

    var ds = [];

    for (var i = 0; i < obj.Items.length; i++)
    {
        var item = {
            text: obj.Items[i],
            value: i
        };
        ds.push(item);
    }

    this.cb = $(this.ComboBox).kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: ds,
        filter: "contains",
        suggest: true,
        change: function (e) {
            var cmb = this;
            var evt = {
                ClientId: this.element[0].id,
                EventType: 'selectedIndexChanged',
                Value: cmb.selectedIndex
            };
            send(evt);
        }
    });

    Control.prototype.Render(this.Element, obj, parent);

    return this;
};

var ListView = function () {

}

ListView.prototype = Object.create(Control.prototype);

ListView.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var evtType = obj.EventType;
    var item = JSON.parse(obj.Value);
    switch (evtType) {
        case "addListViewItem": {
            var grid = $(this.Element).data("kendoGrid");
            var row = {};
            for (var i = 0; i < grid.columns.length; i++) {
                var column = grid.columns[i];
                var rowValue = item.SubItems[i];
                row[column.field] = rowValue;
            }
            grid.dataSource.add(row);
            break;
        }
        case 'removeListViewItem':
            break;
        case 'clearList':
            var grid = $(this.Element).data("kendoGrid");
            grid.dataSource.data([]);
            break;
    }
};

ListView.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    var size = obj.Size.split(',');
    var width = size[0] + 'px';
    var height = size[1] + 'px';

    var columns = [];

    var model = {};

    for (var i = 0; i < obj.Columns.length; i++) {
        var shortName = obj.Columns[i].ColumnName.replace(/\s+/g, '') + '_' + i;
        var column = {
            field: shortName,
            width: obj.Columns[i].Width,
            title: obj.Columns[i].ColumnName
        };
        model[shortName] = {
            type: "string"
        }
        columns.push(column);
    }

    var dt = [];

    var options = {
        height: height,
        width: width,
        autoBind: false,       
        columns: columns,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        dataSource: {
            data: dt,
            schema: {
                model: {
                    fields: model
                }
            },
            pageSize: 20
        },
    };

    var str = JSON.stringify(options);

    $(this.Element).kendoGrid(options);
    
    var grid = $(this.Element).data("kendoGrid");
    for (var i = 0; i < obj.Items.length; i++) {
        var item = obj.Items[i];
        var row = {};
        for (var x = 0; x < grid.columns.length; x++) {
            var column = grid.columns[x];
            var rowValue = item.SubItems[x];
            row[column.field] = rowValue;
        }
        grid.dataSource.add(row);
    }

    Control.prototype.Render(this.Element, obj, parent);

    return this;
};

var RadioButton = function () {

}

RadioButton.prototype = Object.create(Control.prototype);

RadioButton.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Label.innerText = prop.Value;
            break;
    }
};

RadioButton.prototype.Render = function (obj, parent) {

    this.Element = document.createElement('div');
    $(this.Element).css({ "cursor": "pointer" });
    var rb = document.createElement('input');
    rb.id = "RB_" + obj.ClientId;
    rb['type'] = 'radio';
    rb['name'] = parent.id + 'rb_group';
    rb['checked'] = obj.Checked;

    $(rb).change(function () {
        var isChecked = this.checked;
        var evt = {
            ClientId: obj.ClientId,
            EventType: 'checkChanged',
            Value: isChecked
        };
        send(evt);
    });

    this.Element.appendChild(rb);

    this.Label = document.createElement('span');
    this.Label.className = 'Label-Control';
    this.Label.id = "TU_" + obj.ClientId;
    this.Element.appendChild(this.Label);

    if (obj.Text != undefined) {
        this.Label.innerText = obj.Text;
    }

    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var CheckBox = function () {

}

CheckBox.prototype = Object.create(Control.prototype);

CheckBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

CheckBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    var innerDiv = document.createElement('div');
    this.Element.appendChild(innerDiv);

    var rb = document.createElement('input');
    rb.id = "RB_" + obj.ClientId;
    rb['type'] = 'checkbox';

    $(rb).change(function () {
        var evt = {
            ClientId: obj.ClientId,
            EventType: 'checkChanged',
            Value: this.checked
        };
        send(evt);
    });

    innerDiv.style.position = 'relative';
    innerDiv.style.top = '50%';
    innerDiv.style.transform = 'translateY(-50%)';

    innerDiv.appendChild(rb);

    this.Label = document.createElement('span');
    this.Label.className = 'Label-Control';
    this.Label.id = "TU_" + obj.ClientId;
    innerDiv.appendChild(this.Label);

    if (obj.Text != undefined) {
        this.Label.innerText = obj.Text;
        rb['value'] = obj.Text;
    }

    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var Label = function () {

}

Label.prototype = Object.create(Control.prototype);

Label.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Label.innerText = prop.Value;
            break;
    }
};

Label.prototype.Render = function (obj, parent) {

    this.Element = document.createElement('div');
    this.Label = document.createElement('span');
    this.Label.className = 'Label-Control';
    this.Label.id = "TU_" + obj.ClientId;
    this.Element.appendChild(this.Label);

    if (obj.Text != undefined) {
        this.Label.innerText = obj.Text;
        Control.prototype.RenderText(this.Label, obj);
    }

    this.Label.onchange = function () {
        var evt = {
            ClientId: this.id,
            EventType: 'textchanged',
            Value: this.value
        };
        send(evt);
    };

    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var LinkLabel = function () {

}

LinkLabel.prototype = Object.create(Control.prototype);

LinkLabel.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Text":
            this.Label.innerText = prop.Value;
            break;
    }
};

LinkLabel.prototype.Render = function (obj, parent) {

    this.Element = document.createElement('div');

    this.Label = document.createElement('a');
    this.Label.id = "TU_" + obj.ClientId;

    if (obj.Text != undefined) {
        this.Label.innerText = obj.Text;
        Control.prototype.RenderText(this.Label, obj);
        if( obj.Font == null )
        {
            this.Label.style.color = 'blue';
            this.Label.style.textDecoration = 'underline';
        }
    }

    this.Element.appendChild(this.Label);

    Control.prototype.Render(this.Element, obj, parent);

    if (obj.HasEvent("LinkClicked")) {
        $(this.Element).css({ "cursor": "pointer" });
        this.Element.addEventListener('click', function (e) {
            var evt = {
                ClientId: this.id,
                EventType: 'linkClicked'
            };
            send(evt);
        });
    }

    return this;
};

var Panel = function () {

}

Panel.prototype = Object.create(Control.prototype);

Panel.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

Panel.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    if (obj.Text != undefined) {
        this.Text = document.createElement('div');
        this.Text.innerText = obj.Text;
        this.Text.style.textAlign = 'center';
        this.Text.style.width = this.Element.style.width;
        this.Text.style.height = '45%';
        this.Text.style.top = '50%';
        this.Text.style.position = 'absolute';
        this.Element.appendChild(this.Text);
    }
    return this;
};

var Panel = function () {

}

Panel.prototype = Object.create(Control.prototype);

Panel.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

Panel.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var SplitContainer = function () {

}

SplitContainer.prototype = Object.create(Control.prototype);

SplitContainer.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

SplitContainer.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');

    this.Splitter = document.createElement('div');
    createNewElement(obj.Panel1, this.Splitter);
    createNewElement(obj.Panel2, this.Splitter);

    this.Element.appendChild(this.Splitter);
    Control.prototype.Render(this.Element, obj, parent);
    var s = $(this.Splitter).kendoSplitter({
        panes: [
             { size: obj.SplitterDistance },
        ]
    });
    return this;
};

var ProgressBar = function () {

}

ProgressBar.prototype = Object.create(Control.prototype);

ProgressBar.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Value":
            this.ProgressBar.value(prop.Value);
            break;
    }
};

ProgressBar.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    var pb = $(this.Element).kendoProgressBar({
        min: obj.Minimum,
        max: obj.Maximum,
        type: "value",
        animation: {
            duration: 400
        }
    }).data("kendoProgressBar");
    this.ProgressBar = pb;
    this.ProgressBar.value(obj.Value);
    return this;
};

var MonthCalendar = function () {

}

MonthCalendar.prototype = Object.create(Control.prototype);

MonthCalendar.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

MonthCalendar.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.Control = document.createElement('div');
    this.Element.appendChild(this.Control);
    Control.prototype.Render(this.Element, obj, parent);
    //$(this.Control).kendoDatePicker();
    var datepicker = $(this.Control).datepicker();
    return this;
};

var DateTimePicker = function () {

}

DateTimePicker.prototype = Object.create(Control.prototype);

DateTimePicker.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

DateTimePicker.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.Control = document.createElement('div');
    this.Element.appendChild(this.Control);
    Control.prototype.Render(this.Element, obj, parent);
    $(this.Control).kendoDatePicker({
        change: function() {
            var evt = {
                ClientId: obj.ClientId,
                EventType: 'valueChanged',
                Value: this.value()
            };
            send(evt);
        }
    });
    return this;
};

var GroupBox = function () {

}

GroupBox.prototype = Object.create(Control.prototype);

GroupBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

GroupBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.Element.style.borderWidth = '1px';
    this.Element.style.borderColor = 'grey';
    this.Element.style.borderStyle = 'solid';
    this.Label = document.createElement('label');
    this.Label.innerText = obj.Text;

    this.Element.appendChild(this.Label);

    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var TabControl = function () {

}

TabControl.prototype = Object.create(Control.prototype);

TabControl.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

TabControl.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    var ul = document.createElement('ul');

    Control.prototype.Render(this.Element, obj, parent);

    for (var i = 0; i < obj.Controls.length; i++)
    {
        var li = document.createElement('li');
        li.innerText = obj.Controls[i].Text;
        if (i == obj.SelectedIndex)
        {
            li.className = "k-state-active";
        }
        ul.appendChild(li);
    }
    this.Element.appendChild(ul);
    for (var i = 0; i < obj.Controls.length; i++) {
        var div = document.createElement('div');
        var size = obj.Controls[i].Size.split(',');
        div.style.height = size[1] + 'px';
        var newElement = createNewElement(obj.Controls[i], div);
        controls[obj.ClientId].children.push(newElement);
        this.Element.appendChild(div);
    }

    $(this.Element).kendoTabStrip({
        show: function (e) {
            var selectedIndex = $(e.item).index();
            var evt = {
                ClientId: this.element[0].id,
                EventType: 'selectedIndexChanged',
                Value: selectedIndex
            };
            send(evt);
        }
    });
    return this;
};

var TabPage = function () {

}

TabPage.prototype = Object.create(Control.prototype);

TabPage.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

TabPage.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    return this;
};

var TreeView = function () {

}

TreeView.prototype = Object.create(Control.prototype);

TreeView.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

TreeView.prototype.RenderNode = function(parent, obj)
{
    var ul = document.createElement('ul');
    ul.style.display = 'none';

    for (var i = 0; i < obj.Nodes.length; i++) {
        var node = obj.Nodes[i];
        var li = document.createElement('li');
        li.innerText = node.Text;
        li.id = node.Name;
        ul.appendChild(li);

        TreeView.prototype.RenderNode(li, node);
    }

    parent.appendChild(ul);
}

function logEvent(event, data, extra) {
    if (event.target == undefined)
        return;

    var id = event.target.id;
    if (event.target.ClientId != undefined)
    {
        id = event.target.ClientId;
    }
    else if (id == "" && event.target.parentNode != undefined)
    {
        id = event.target.parentNode.id;
    }

    var val = extra;
    if (data.node != undefined)
    {
        val = data.node.key;
    }

    var evt = {
        ClientId: id,
        EventType: event.type,
        Value: val
        //Value: data,
        //Extra: extra
    };
    send(evt);
}

TreeView.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.Element.style.overflow = 'auto';
    this.TreeElement = document.createElement('div');
    this.TreeElement.ClientId = obj.ClientId;
    TreeView.prototype.RenderNode(this.TreeElement, obj);
    Control.prototype.Render(this.Element, obj, parent);
    this.FancyTree = $(this.TreeElement).fancytree({
        //blurTree: function (event, data) {
        //    logEvent(event, data);
        //},
        create: function (event, data) {
            logEvent(event, data);
        },
        init: function (event, data, flag) {
            logEvent(event, data, "flag=" + flag);
        },
        //focusTree: function (event, data) {
        //    logEvent(event, data);
        //},
        restore: function (event, data) {
            logEvent(event, data);
        },
        // --- Node events -------------------------------------------------
        activate: function (event, data) {
            logEvent(event, data);
            //var node = data.node;
            //// acces node attributes
            //$("#echoActive").text(node.title);
            //if (!$.isEmptyObject(node.data)) {
            //    //          alert("custom node data: " + JSON.stringify(node.data));
            //}
        },
        beforeActivate: function (event, data) {
            logEvent(event, data, "current state=" + data.node.isActive());
            // return false to prevent default behavior (i.e. activation)
            //              return false;
        },
        beforeExpand: function (event, data) {
            logEvent(event, data, "current state=" + data.node.isExpanded());
            // return false to prevent default behavior (i.e. expanding or collapsing)
            //        return false;
        },
        beforeSelect: function (event, data) {
            //        console.log("select", event.originalEvent);
            logEvent(event, data, "current state=" + data.node.isSelected());
            // return false to prevent default behavior (i.e. selecting or deselecting)
            //        if( data.node.isFolder() ){
            //          return false;
            //        }
        },
        //blur: function (event, data) {
        //    logEvent(event, data);
        //    //$("#echoFocused").text("-");
        //},
        click: function (event, data) {
            var ctrl = this.RootControl;
            logEvent(event, data, ", targetType=" + data.targetType);
            // return false to prevent default behavior (i.e. activation, ...)
            //return false;
        },
        collapse: function (event, data) {
            logEvent(event, data);
        },
        createNode: function (event, data) {
            // Optionally tweak data.node.span or bind handlers here
            logEvent(event, data);
        },
        dblclick: function (event, data) {
            logEvent(event, data);
            //        data.node.toggleSelect();
        },
        deactivate: function (event, data) {
            logEvent(event, data);
            //$("#echoActive").text("-");
        },
        expand: function (event, data) {
            logEvent(event, data);
        },
        //focus: function (event, data) {
        //    logEvent(event, data);
        //    //$("#echoFocused").text(data.node.title);
        //},
        keydown: function (event, data) {
            logEvent(event, data);
            switch (event.which) {
                case 32: // [space]
                    data.node.toggleSelected();
                    return false;
            }
        },
        keypress: function (event, data) {
            // currently unused
            logEvent(event, data);
        },
        //lazyLoad: function (event, data) {
        //    logEvent(event, data);
        //    // return children or any other node source
        //    //data.result = { url: "ajax-sub2.json" };
        //    //        data.result = [
        //    //          {title: "A Lazy node", lazy: true},
        //    //          {title: "Another node", selected: true}
        //    //          ];
        //},
        loadChildren: function (event, data) {
            logEvent(event, data);
        },
        loadError: function (event, data) {
            logEvent(event, data);
        },
        //postProcess: function (event, data) {
        //    logEvent(event, data);
        //    // either modify the ajax response directly
        //    data.response[0].title += " - hello from postProcess";
        //    // or setup and return a new response object
        //    //        data.result = [{title: "set by postProcess"}];
        //},
        removeNode: function (event, data) {
            // Optionally release resources
            logEvent(event, data);
        },
        renderNode: function (event, data) {
            // Optionally tweak data.node.span
            //              $(data.node.span).text(">>" + data.node.title);
            logEvent(event, data);
        },
        renderTitle: function (event, data) {
            // NOTE: may be removed!
            // When defined, must return a HTML string for the node title
            logEvent(event, data);
            //        return "new title";
        },
        select: function (event, data) {
            logEvent(event, data, "current state=" + data.node.isSelected());
            //var s = data.tree.getSelectedNodes().join(", ");
            //$("#echoSelected").text(s);
        }
    });
    this.FancyTree.RootControl = this;
    this.FancyTree[0].id = 'TV_' + obj.ClientId;
    this.Element.appendChild(this.TreeElement);
    return this;
};

var UserControl = function () {

}

UserControl.prototype = Object.create(Control.prototype);

UserControl.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

UserControl.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);

    var evt = {
        ClientId: obj.ClientId,
        EventType: 'Load',
    };
    send(evt);

    return this;
};

var PictureBox = function () {

}

PictureBox.prototype = Object.create(Control.prototype);

PictureBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
    var prop = obj.Value;
    switch (prop.Name) {
        case "Image": {
            PictureBox.prototype.UpdateImage(prop.Value);
        }
            break;
    }
};

PictureBox.prototype.UpdateImage = function (img) {
    $(this.Element).css("background-image", "url('data:image/png;base64," + img + "')");
    if (this.Element.SizeMode != undefined) {
        switch (this.Element.SizeMode) {
            //none
            case 0:
                $(this.Element).css("background-repeat", "no-repeat");
                break;
                //AutoSize
            case 1:
                break;
                //CenterImage
            case 2:
                $(this.Element).css("background-repeat", "no-repeat");
                break;
                //Normal
            case 3:
                $(this.Element).css("background-size", "cover");
                break;
                //StretchImage
            case 4:
                break;
                //Zoom
        }
    }
}

PictureBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    Control.prototype.Render(this.Element, obj, parent);
    this.Element.SizeMode = obj.SizeMode;
    if (obj.Image != undefined) {
        PictureBox.prototype.UpdateImage(obj.Image);
    }
    return this;
};

var Form = function () {

}

Form.prototype = Object.create(Control.prototype);

Form.prototype.Update = function (obj) {
    //Control.prototype.Update(obj);

    if (this.Window == undefined) {
        return;
    }

    var window = $(this.Window);

    var prop = obj.Value;
    switch (prop.Name) {
        case "Size":
            {
                var size = prop.Value.split(',');
                var dlg = window.data("kendoWindow");
                var options = dlg.options;
                if (options.isMaximized)
                {
                    break;
                }
                if (options.isMinimized)
                {
                    break;
                }

                if (options.width == size[0] + 'px')
                {
                    break;
                }

                if (options.height == size[1] + 'px') {
                    break;
                }

                dlg.setOptions({
                    width: size[0] + 'px',
                    height: size[1] + 'px'
                });
            }
            break;
        case "Text":
            {
                if (this.Window != undefined) {
                    var window = $(this.Window);
                    window.data("kendoWindow").title(prop.Value);
                }
            }
            break;
        case "Visible":
            {
                if (this.Window != undefined) {
                    var window = $(this.Window);
                    var dialog = window.data("kendoWindow");
                    this.Window.Visible = prop.Value;
                    if (this.Window.IsRoot == undefined)
                    {
                        if (prop.Value) {
                            dialog.open();
                        }
                        else {
                            dialog.close();
                        }
                    }
                }
            }
            break;
    }
};

Form.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.Window = document.createElement('div');
    this.Window.id = "WI_" + obj.ClientId;

    if (obj.BackgroundImageData != undefined) {
        $(this.Window).css("background-image", "url('data:image/png;base64," + obj.BackgroundImageData + "')");
    }

    this.Window.appendChild(this.Element);

    if (parent == undefined || parent == null)
    {
        document.body.appendChild(this.Window);
    }
    else
    {
        parent.Element.appendChild(this.Window);
    }

    var size = null;

    if (obj.ClientSize != undefined)
    {
        size = obj.ClientSize.split(',');
    }
    
    if (size == null || size.length != 2 || parseInt(size[0]) == 0 || parseInt(size[1]) == 0)
    {
        size = obj.Size.split(',')
    }

    if (rootForm)
    {
        this.Element.style.width = "100%";
        this.Element.style.height = "100%";
        this.Window.style.width = "100%";
        this.Window.style.height = "100%";
        this.Window.IsRoot = true;
        rootForm = false;
    }
    else
    {
        Control.prototype.Render(this.Element, obj);

        this.Element.style.width = parseInt(size[0]) - 10 + 'px';

        var window = $(this.Window),
                undo = $("#undo")
                        .bind("click", function () {
                            window.data("kendoWindow").open();
                            undo.hide();
                        });

        var onClose = function (e) {
            if (this.element[0].Visible != undefined && !this.element[0].Visible) {
                this.destroy();
                return;
            }
            var evt = {
                ClientId: this.element[0].id,
                EventType: 'FormClose'
            };
            send(evt);

            e.preventDefault();
            //undo.show();
        }

        var onResize = function (e) {
            var state = 'normal';
            var win = e.sender;
            if (win.options.isMaximized != undefined && win.options.isMaximized) {
                state = 'maximized';
            }
            else if (win.options.isMinimized != undefined && win.options.isMinimized) {
                state = 'minimized';
            }
            var evt = {
                ClientId: this.element[0].id,
                EventType: 'WindowStateChange',
                Value: {
                    height: e.height,
                    width: e.width,
                    state: state
                }
            };
            send(evt);
        }

        var loc = obj.Location.split(',');

        switch(obj.StartPosition)
        {
            case 2:
                {
                    var w = getWidth();
                    var h = getHeight();
                    loc[1] = h / 2 - parseInt(size[1]) / 2;
                    loc[0] = w / 2 - parseInt(size[0]) / 2;
                }
                break;
        }

        if (!window.data("kendoWindow")) {
            var width = size[0] + 'px';
            var height = size[1] + 'px';
            window.kendoWindow({
                width: width,
                height: height,
                title: obj.Text,
                actions: [
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                position: {
                    left: loc[0] + 'px',
                    top: loc[1] + 'px'
                },
                close: onClose,
                resize: onResize,
            });

            window[0].style.overflow = 'hidden';
            window[0].style.backgroundColor = obj.BackColor;
        }
    }

    var evt = {
        ClientId: obj.ClientId,
        EventType: 'Load',
    };
    send(evt);

    return this;
};

var CheckedListBox = function () {

}

CheckedListBox.prototype = Object.create(Control.prototype);

CheckedListBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

CheckedListBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.InnerDiv = document.createElement('div');
    this.InnerDiv.style.position = 'relative';
    this.InnerDiv.style.left = '-40px';
    this.Element.style.overflow = 'auto';



    this.List = document.createElement('ul');
    this.List.style.listStyleType = 'none';
    this.List.style.overflowX = 'hidden';

    for (var i = 0; i < obj.Items.length; i++) {
        var id = obj.ClientId + "_li_" + i;
        var li = document.createElement('li');
        li.style.margin = 0;
        li.style.padding = 0;
        li.style.position = 'relative';
        var lbl = document.createElement('label');
        lbl.style.margin = 0; 
        lbl.style.padding = 0;
        $(lbl).hover(function ()
            { $(this).addClass('.hover'); }, function () { $(this).removeClass('.hover'); });
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        lbl.attributes['for'] = id;
        cb.name = id;
        cb.id = id;
        lbl.innerText = obj.Items[i];
        li.appendChild(cb);
        li.appendChild(lbl);
        this.List.appendChild(li);
    }

    this.InnerDiv.appendChild(this.List);
    this.Element.appendChild(this.InnerDiv);

    Control.prototype.Render(this.Element, obj, parent);

    this.Element.className = "k-textbox";
    return this;
};

var ListBox = function () {

}

ListBox.prototype = Object.create(Control.prototype);

ListBox.prototype.Update = function (obj) {
    Control.prototype.Update(this.Element, obj);
};

ListBox.prototype.Render = function (obj, parent) {
    this.Element = document.createElement('div');
    this.InnerDiv = document.createElement('div');
    this.Element.style.overflow = 'auto';

    this.List = document.createElement('ul');
    this.List.style.listStyleType = 'none';
    this.List.style.overflowX = 'hidden';

    for (var i = 0; i < obj.Items.length; i++) {
        var id = obj.ClientId + "_li_" + i;
        var li = document.createElement('li');
        li.style.margin = 0;
        li.style.padding = 0;
        li.style.position = 'relative';
        li.style.left = '-30px';
        var lbl = document.createElement('label');
        lbl.style.margin = 0;
        lbl.style.padding = 0;
        $(lbl).hover(function ()
        { $(this).addClass('.hover'); }, function () { $(this).removeClass('.hover'); });
        lbl.attributes['for'] = id;
        lbl.innerText = obj.Items[i];
        li.appendChild(lbl);
        this.List.appendChild(li);
    }

    this.InnerDiv.appendChild(this.List);
    this.Element.appendChild(this.InnerDiv);

    Control.prototype.Render(this.Element, obj, parent);
    this.Element.className = "k-textbox";
    return this;
};

function getWidth() {
    if (self.innerHeight) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }
}

function getHeight() {
    if (self.innerHeight) {
        return self.innerHeight;
    }

    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }

    if (document.body) {
        return document.body.clientHeight;
    }
}
