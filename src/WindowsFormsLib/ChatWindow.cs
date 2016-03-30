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
    public partial class ChatWindow : Form
    {
        public ChatWindow()
        {
            InitializeComponent();
        }

        private void tbMessage_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)10)
            {
                this.richTextBox1.AppendText(this.tbName.Text + " " + DateTime.Now + Environment.NewLine);
                this.richTextBox1.AppendText(this.tbMessage.Text + Environment.NewLine);

                this.tbMessage.Text = string.Empty;
            }
        }
    }
}
