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

        }

        private void button1_Click(object sender, EventArgs e)
        {
            TestButtonForm form = new TestButtonForm();
            form.ShowDialog();
        }
    }
}
