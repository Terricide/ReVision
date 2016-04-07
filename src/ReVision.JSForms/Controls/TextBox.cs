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
        public char PasswordChar;
        private TextAreaElement textArea;
        private InputElement inputElement;

        public TextBox()
        {
            RenderLabel = false;
        }

        public override void Render()
        {
            if (this.Multiline)
            {
                if( this.textArea == null )
                {
                    textArea = new TextAreaElement();
                    this.Element = textArea;
                }
                if( !string.IsNullOrEmpty(this.Text) )
                {
                    textArea.Value = this.Text;
                }
            }
            else
            {
                if ( inputElement == null )
                {
                    inputElement = new InputElement();
                    this.Element = inputElement;
                }
                if (this.PasswordChar != '\0')
                {
                    inputElement.Type = InputType.Password;
                }
                inputElement.Value = this.Text;
            }
            this.Element.ClassName = "k-textbox";

            base.Render();
        }
    }
}
