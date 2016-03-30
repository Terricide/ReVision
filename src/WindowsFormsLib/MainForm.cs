using System;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();

            foreach(var dir in Directory.GetDirectories(AppDomain.CurrentDomain.BaseDirectory))
            {
                DirectoryInfo di = new DirectoryInfo(dir);
                this.treeView2.Nodes.Add(di.Name);
            }

        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.progressBar1.Value++;
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.label5.Text = comboBox1.SelectedItem as string;
        }

        private void dateTimePicker1_ValueChanged(object sender, EventArgs e)
        {
            this.label6.Text = dateTimePicker1.Value.ToString();
        }

        private void radioButton2_CheckedChanged(object sender, EventArgs e)
        {
            if( radioButton1.Checked )
            {
                this.label7.Text = radioButton1.Name + " checked";
            }
            else
            {
                this.label7.Text = radioButton2.Name + " checked";
            }
        }

        private void checkBox1_CheckedChanged(object sender, EventArgs e)
        {
            this.label10.Text = checkBox1.Checked.ToString();
        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {
            this.label18.Text = textBox2.Text;
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
            this.label17.Text = textBox1.Text;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            PictureBrowser frm = new PictureBrowser();
            frm.ShowDialog();
        }

        private void treeView2_AfterSelect(object sender, TreeViewEventArgs e)
        {
            this.listView1.Items.Clear();
            foreach (var dir in Directory.GetDirectories(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, e.Node.Name)))
            {
                DirectoryInfo di = new DirectoryInfo(dir);
                var li = this.listView1.Items.Add(di.Name);
                li.Tag = di;
            }
            foreach (var dir in Directory.GetFiles(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, e.Node.Name)))
            {
                this.listView1.Items.Add(Path.GetFileName(dir));
            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            this.tbPassword.PasswordChar = this.tbPassword.PasswordChar != '\0' ? default(char) : this.tbPassword.PasswordChar = '*';
        }

        private void button4_Click(object sender, EventArgs e)
        {
            this.tbMask.Mask = "000-00-0000";
        }

        private void button5_Click(object sender, EventArgs e)
        {
            throw new Exception("An error has occurred");
        }

        private void cuteButton1_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Hello world");
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            MessageBox.Show("Link clicked");
        }

        private void button6_Click(object sender, EventArgs e)
        {
            ChatWindow chat = new ChatWindow();
            chat.ShowDialog();
        }
    }
}
