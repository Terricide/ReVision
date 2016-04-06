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
        private TextAreaElement hiddenField;
        private TextAreaElement textArea;
        private InputElement inputElement;

        public TextBox()
        {
            this.RenderLabel = false;
        }

        private string GenerateStars(int n)
        {
            var stars = "";
            var passwordChar = this.PasswordChar;
            for (var i = 0; i < n; i++)
            {
                stars += passwordChar;
            }
            return stars;
        }

        [Template("String.fromCharCode({0})")]
        public static void FromCharCode(char n)
        {
            return;
        }

        public override void Render()
        {

            if (this.Multiline)
            {
                textArea = new TextAreaElement();
                textArea.Value = this.Text;
                this.Element = textArea;
            }
            else
            {
                inputElement = new InputElement();
                //if (this.PasswordChar != '\0')
                //{
                //    input.Type = InputType.Password;
                //}
                inputElement.Value = this.Text;
                this.Element = inputElement;
            }
            this.Element.ClassName = "k-textbox";

            base.Render();

            this.Element.Style.BorderStyle = Bridge.Html5.BorderStyle.Solid;
            this.Element.Style.BorderWidth = Bridge.Html5.BorderWidth.Thin;
            this.Element.Style.BorderColor = "gray";

            hiddenField = new TextAreaElement();
            hiddenField.Id = "HI_" + ClientId;
            hiddenField.Style.Display = Display.None;

            this.Element.AppendChild(hiddenField);

            if (this.PasswordChar.Length > 0 && this.PasswordChar[0] != '\0')
            {
                this.Element.OnKeyDown += (e) =>
                {
                    Window.SetTimeout(() =>
                    {
                        dynamic e2 = e;
                        var text = hiddenField.Value;
                        var stars = hiddenField.Value.Length;

                        var unicode = e2.keyCode ? e2.keyCode : e2.charCode;

                        if ((unicode >= 65 && unicode <= 90)
                                || (unicode >= 97 && unicode <= 122)
                                    || (unicode >= 48 && unicode <= 57))
                        {
                            text = text + FromCharCode(unicode);
                            stars += 1;
                        }
                        else {
                            stars -= 1;
                        }

                        hiddenField.Value = text;

                        if(textArea != null)
                        {
                            textArea.Value = GenerateStars(stars);
                        }
                        else
                        {
                            inputElement.Value = GenerateStars(stars);
                        }
                    }, 500);
                };
            }
        }
    }
}
