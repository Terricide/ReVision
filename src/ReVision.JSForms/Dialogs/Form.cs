using Bridge;
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
        public FormStartPosition StartPosition;

        public Form()
        {
            this.RenderLabel = false;
        }

        //private int GetWidth()
        //{
        //    if (this.Element.ParentElement != null && jQuery.Element(this.Element.ParentElement).InnerWidth() > 0)
        //    {
        //        return jQuery.Element(this.Element.ParentElement).InnerWidth();
        //    }

        //    if (Document.DocumentElement != null)
        //    {
        //        return Document.DocumentElement.ClientWidth;
        //    }

        //    if (Document.Body != null)
        //    {
        //        return Document.Body.ClientWidth;
        //    }

        //    return this.Width;
        //}

        //private int GetHeight()
        //{
        //    if (this.Element.ParentElement != null && jQuery.Element(this.Element.ParentElement).InnerHeight() > 0)
        //    {
        //        return jQuery.Element(this.Element.ParentElement).InnerHeight();
        //    }

        //    if (Document.DocumentElement != null)
        //    {
        //        return Document.DocumentElement.ClientHeight;
        //    }

        //    if (Document.Body != null)
        //    {
        //        return Document.Body.ClientHeight;
        //    }

        //    return this.Height;
        //}

        public void ShowDialog()
        {
            qx.ui.window.Window win = null;

            if ( this.Parent != null )
            {
                win = new qx.ui.window.Window();
                win.Caption = this.Text;
                this.Element = win;
                win.Layout = new qx.ui.layout.Basic();
                win.SetPadding(0);
            }

            Render();

            if( win != null )
            {
                win.Width = this.ClientSize.Width + 10;
                win.Height = this.ClientSize.Height + 30;
                win.Open();
                win.Center();
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
    }

    public class KendoWindow
    {
        [Template("$({0}).kendoWindow({1})")]
        public static KendoWindow Element(Element elm, KendoWindow options)
        {
            return null;
        }
        public string Title;
        public int Width;
        public int Height;
        public ControlPosition Position = new ControlPosition();
        public class ControlPosition
        {
            public string Left;
            public string Top;
        }
        public string[] Actions = new string[0];
        public extern void Open();
        public extern void Close();
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
