using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TextBox : Control
    {
        public bool Multiline;
        public string PasswordChar;

        public TextBox()
        {
            RenderLabel = false;
        }

        public override void Update(WSEventArgs evt)
        {
            base.Update(evt);
            switch (evt.PropertyUpdate.Name)
            {
                case "PasswordChar":
                    {
                        this.PasswordChar = evt.PropertyUpdate.Value as string;
                        ((qx.ui.core.Widget)this.Element).Destroy();

                        Render();
                    }
                    break;
            }
        }

        public override void Render()
        {
            if( this.Multiline )
            {
                var tf  = new qx.ui.form.TextArea();
                tf.Value = this.Text;
                this.Element = tf;
            }
            else
            {
                var tf = new qx.ui.form.TextField();
                tf.Value = this.Text;
                this.Element = tf;
            }

            if (this.PasswordChar != null && this.PasswordChar.Length > 0 && this.PasswordChar[0] != '\0')
            {
                var tf = new qx.ui.form.PasswordField();
                tf.Value = this.Text;
                this.Element = tf;
            }

            this.Element.AddListener("changeValue", (e) =>
            {
                var af = (qx.ui.form.AbstractField)this.Element;
                this.Text = af.Value;
                FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "textchanged",
                    Value = af.Value
                });
            });

            this.Element.AddListener("input", (e) =>
            {
                var af = (qx.ui.form.AbstractField)this.Element;
                this.Text = af.Value;
                if (this.HasEvent("KeyPress"))
                {
                    FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "textchanged",
                        Value = af.Value
                    });
                }
            });

            base.Render();
        }
    }
}
