using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public partial class PictureBrowser : Form
    {
        List<Image> Images = new List<Image>();
        int currentImage = -1;
        public PictureBrowser()
        {
            InitializeComponent();
            foreach(var img in Directory.GetFiles(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"images"), "*.jpg"))
            {
                Images.Add(Image.FromFile(img));
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            currentImage++;
            if (currentImage >= this.Images.Count)
            {
                currentImage = 0;
            }
            pictureBox1.Image = Images[currentImage];
        }

        private void button2_Click(object sender, EventArgs e)
        {
            currentImage--;
            if( currentImage < 0 )
            {
                currentImage = 0;
            }
            pictureBox1.Image = Images[currentImage];
        }
    }
}
