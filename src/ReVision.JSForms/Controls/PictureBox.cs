using Bridge.jQuery2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class PictureBox : Control
    {
        public PictureBoxSizeMode SizeMode;
        public PictureBox()
        {
            this.RenderLabel = false;
        }
        public string Image;

        public override void Render()
        {
            base.Render();

            UpdateImage();
        }

        public void UpdateImage()
        {
            if( string.IsNullOrEmpty(this.Image))
            {
                return;
            }

            var element = jQuery.Element(this.Element);
            element.Css("background-image", "url('data:image/png;base64," + this.Image + "')");
            switch (this.SizeMode)
            {
                case PictureBoxSizeMode.Normal:
                    element.Css("background-repeat", "no-repeat");
                    break;
                case PictureBoxSizeMode.AutoSize:
                    break;
                case PictureBoxSizeMode.CenterImage:
                    element.Css("background-repeat", "no-repeat");
                    break;
                case PictureBoxSizeMode.StretchImage:
                    element.Css("background-size", "cover");
                    break;
                case PictureBoxSizeMode.Zoom:
                    break;
            }
        }
    }
}
