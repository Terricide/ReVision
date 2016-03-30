using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public class TestDockForm : Form
    {
        public TestDockForm()
        {
            var p = new Panel();
            p.Dock = DockStyle.Fill;
            p.Name = "pnFill";
            //Height = 100;
            p.BackColor = System.Drawing.Color.Blue;

            this.Controls.Add(p);

            p = new Panel();
            p.Name = "pnTop";
            p.Dock = DockStyle.Top;
            p.Height = 100;
            p.BackColor = System.Drawing.Color.Purple;

            this.Controls.Add(p);

            p = new Panel();
            p.Name = "pnTop";
            p.Dock = DockStyle.Bottom;
            p.Height = 100;
            p.BackColor = System.Drawing.Color.Yellow;

            this.Controls.Add(p);

            p = new Panel();
            p.Name = "pnBottom";
            p.Dock = DockStyle.Bottom;
            p.Height = 100;
            p.BackColor = System.Drawing.Color.Pink;

            this.Controls.Add(p);

            p = new Panel();
            p.Name = "pnLeft";
            p.Dock = DockStyle.Left;
            p.Width = 100;
            p.BackColor = System.Drawing.Color.Red;

            this.Controls.Add(p);

            p = new Panel();
            p.Name = "pnRight";
            p.Dock = DockStyle.Right;
            p.Width = 100;
            p.BackColor = System.Drawing.Color.Green;

            this.Controls.Add(p);
        }
    }
}