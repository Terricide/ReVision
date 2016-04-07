(function (globals) {
    "use strict";

    Bridge.define('ReVision.JSForms.App', {
        statics: {
            config: {
                init: function () {
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                var app = new ReVision.JSForms.Application();
            }
        }
    });
    
    Bridge.define('ReVision.JSForms.Application', {
        statics: {
            current: null
        },
        ws: null,
        root: null,
        controls: null,
        config: {
            init: function () {
                this.controls = new Bridge.Dictionary$2(String,System.Windows.Forms.Control)();
            }
        },
        constructor: function () {
            Bridge.get(ReVision.JSForms.Application).current = this;
            var path = "";
    
            if (Bridge.hasValue(window.location.pathName)) {
                path = window.location.pathName.substr(0, Bridge.String.indexOf(window.location.pathName, String.fromCharCode(47), 1));
                if (window.location.port.length > 1) {
                    path = ":" + window.location.port + path;
                }
            }
            else  {
                path = "ws://localhost:56357/echo";
            }
    
            var data = "";
    
            if (Bridge.hasValue(window.sessionStorage)) {
                data = Bridge.as(window.sessionStorage.getItem("sessionId"), String);
                if (!Bridge.hasValue(data)) {
                    data = Bridge.get(System.Guid).newGuid();
                    window.sessionStorage.setItem("sessionId", data);
                }
            }
            else  {
                data = Bridge.get(System.Guid).newGuid();
            }
    
            this.ws = new WebSocket(path + "?id=" + data);
            this.ws.onopen = Bridge.fn.combine(this.ws.onopen, Bridge.fn.bind(this, this.onSocketOpen));
            this.ws.onmessage = Bridge.fn.combine(this.ws.onmessage, Bridge.fn.bind(this, this.onMessage));
            this.ws.onclose = Bridge.fn.combine(this.ws.onclose, Bridge.fn.bind(this, this.onClose));
            this.ws.onerror = Bridge.fn.combine(this.ws.onerror, Bridge.fn.bind(this, this.onError));
        },
        onError: function (arg) {
            window.alert("Error");
        },
        onClose: function (arg) {
    
        },
        onMessage: function (arg) {
            var evt = Bridge.merge(new System.Windows.Forms.WSEventArgs(), JSON.parse(arg.data.toString()));
            switch (evt.eventType) {
                case "MessageBox": 
                    window.alert(evt.value.toString());
                    break;
                case "PropertyChanged": 
                case "addListViewItem": 
                case "addListItem": 
                case "removeListViewItem": 
                case "removeListItem": 
                case "addListViewColumn": 
                case "removeListViewColumn": 
                case "clearList": 
                    //onChangeProperty(obj);
                    break;
                case "removeControl": 
                    //var windowDiv = document.getElementById('WI_' + obj.ClientId);
                    //if (windowDiv != undefined)
                    //    $(windowDiv).remove();
                    //var ctrl = document.getElementById('WU_' + obj.ClientId);
                    //if (ctrl != undefined)
                    //    $(ctrl).remove();
                    break;
                case "addControl": 
                    //onAddControl(obj);
                    break;
                case "FormCreate": 
                    var form = Bridge.merge(new System.Windows.Forms.Form(), JSON.parse(JSON.stringify(evt.value)));
                    form.setClientId(evt.clientId);
                    var parent = form.getParent();
                    if (!Bridge.hasValue(parent)) {
                        if (!Bridge.hasValue(this.root)) {
                            this.root = form;
                        }
                        window.onresize = Bridge.fn.bind(this, this.onResize);
                        document.title = form.getText();
                        document.body.appendChild(form.element);
                    }
                    this.addOrUpdate(form);
                    form.showDialog();
                    //createNewForm(obj.Value);
                    break;
                default: 
                    window.alert("Unknown message type:" + evt.eventType);
                    break;
            }
        },
        onResize: function (e) {
            if (e === void 0) { e = null; }
            this.controls.clear();
            this.root.element.innerHTML = "";
            this.root.showDialog();
        },
        addOrUpdate: function (ctrl) {
            if (!Bridge.String.isNullOrEmpty(ctrl.getParentId()) && this.controls.containsKey(ctrl.getParentId())) {
                ctrl.setParent(this.controls.get(ctrl.getParentId()));
            }
    
            if (!this.controls.containsKey(ctrl.getClientId())) {
                this.controls.add(ctrl.getClientId(), ctrl);
            }
            else  {
                this.controls.set(ctrl.getClientId(), ctrl);
            }
        },
        onSocketOpen: function (arg) {
            var args = new System.Windows.Forms.WSEventArgs();
            args.eventType = "openForm";
    
            this.send(args);
        },
        send: function (o) {
            var msg = JSON.stringify(o);
            this.ws.send(msg);
        }
    });
    
    
    
    Bridge.init();
})(this);
