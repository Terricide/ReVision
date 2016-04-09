using Bridge.Html5;
using Bridge.jQuery2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Form : Control
    {
        public string BackgroundImageData;
        private jQuery jWindow;
        private DivElement Window;

        public Form()
        {
            this.RenderLabel = false;
        }

        public void ShowDialog()
        {
            this.Window = new DivElement();
            this.Window.Id = "WI_" + this.ClientId;
            this.jWindow = jQuery.Element(this.Window);

            if (!string.IsNullOrEmpty(this.BackgroundImageData))
            {
                jWindow.Css("background-image", "url('data:image/png;base64," + this.BackgroundImageData + "')");
            }

            this.Window.AppendChild(this.Element);

            if (this.Parent == null)
            {
                Document.Body.AppendChild(this.Window);

                this.Element.Style.Width = "100%";
                this.Element.Style.Height = "100%";
                this.Window.Style.Width = "100%";
                this.Window.Style.Height = "100%";
            }
            else
            {
                Parent.Element.AppendChild(this.Window);
                this.Render();

                this.Element.Style.Width = this.Width - 10 + "px";

                var undoButton = (ButtonElement)Document.GetElementById("#undo");
                undoButton.OnClick = (e) =>
                {
                    KendoWindow win = (KendoWindow)this.jWindow.Data("kendoWindow");
                    win.Open();
                    undoButton.Style.Visibility = Visibility.Hidden;
                };

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
            }
        }
    }

    public class KendoWindow
    {
        public extern void Open();
    }
}

//            if (rootForm)
//            {
                
//                this.Window.IsRoot = true;
//                rootForm = false;
//            }
//            else
//            {
                

                
//                //undo.show();
//            }

//            var onResize = function(e) {
//                var state = 'normal';
//                var win = e.sender;
//                if (win.options.isMaximized != undefined && win.options.isMaximized)
//                {
//                    state = 'maximized';
//                }
//                else if (win.options.isMinimized != undefined && win.options.isMinimized)
//                {
//                    state = 'minimized';
//                }
//                var evt = {
//                ClientId: this.element[0].id,
//                EventType: 'WindowStateChange',
//                Value:
//                {
//                height: e.height,
//                    width: e.width,
//                    state: state
//                }
//            };
//            send(evt);
//        }

//        var loc = obj.Location.split(',');

//        switch(obj.StartPosition)
//        {
//            case 2:
//                {
//                    var w = getWidth();
//        var h = getHeight();
//        private jQuery jWindow;

//        public DivElement Window { get; private set; }

//        loc[1] = h / 2 - parseInt(size[1]) / 2;
//                    loc[0] = w / 2 - parseInt(size[0]) / 2;
//                }
//                break;
//        }

//        if (!window.data("kendoWindow")) {
//            var width = size[0] + 'px';
//var height = size[1] + 'px';
//window.kendoWindow({
//                width: width,
//                height: height,
//                title: obj.Text,
//                actions: [
//                    "Minimize",
//                    "Maximize",
//                    "Close"
//                ],
//                position: {
//                    left: loc[0] + 'px',
//                    top: loc[1] + 'px'
//                },
//                close: onClose,
//                resize: onResize,
//            });

//            window[0].style.overflow = 'hidden';
//            window[0].style.backgroundColor = obj.BackColor;
//        }
//    }

//    var evt = {
//        ClientId: obj.ClientId,
//        EventType: 'Load',
//    };
//    send(evt);

//    return this;

//            this.Render();
//        }
//    }
//}
