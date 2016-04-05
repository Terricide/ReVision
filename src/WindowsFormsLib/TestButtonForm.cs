using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public partial class TestButtonForm : Form
    {
        public TestButtonForm()
        {
            InitializeComponent();

            this.dateTimePicker1.Value = DateTime.Now;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            int i = 0;
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            int i = 0;
        }
    }
}
