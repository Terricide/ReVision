using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class PictureBox : Control, ISupportInitialize
    {
        private Image mImage;
        [JsonConverter(typeof(ImageConverter))]
        public Image Image
        {
            get
            {
                return mImage;
            }
            set
            {
                if( mImage != value )
                {
                    mImage = value;
                    RaisePropertyChanged();
                }
            }
        }

        public PictureBoxSizeMode SizeMode { get; set; }

        public void BeginInit()
        {
            
        }

        public void EndInit()
        {
            
        }

        public override string ControlName
        {
            get
            {
                return "PictureBox";
            }
        }

        public System.Drawing.Image InitialImage { get; set; }
    }
}
