namespace WindowsFormsLib
{
    partial class TestDockForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.pnRight = new System.Windows.Forms.Panel();
            this.panel2 = new System.Windows.Forms.Panel();
            this.pnBottom = new System.Windows.Forms.Panel();
            this.pnLeft = new System.Windows.Forms.Panel();
            this.pnLeft2 = new System.Windows.Forms.Panel();
            this.pnTop = new System.Windows.Forms.Panel();
            this.panel1 = new System.Windows.Forms.Panel();
            this.SuspendLayout();
            // 
            // pnRight
            // 
            this.pnRight.BackColor = System.Drawing.Color.BlueViolet;
            this.pnRight.Dock = System.Windows.Forms.DockStyle.Right;
            this.pnRight.Location = new System.Drawing.Point(854, 0);
            this.pnRight.Name = "pnRight";
            this.pnRight.Size = new System.Drawing.Size(122, 645);
            this.pnRight.TabIndex = 0;
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.Brown;
            this.panel2.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel2.Location = new System.Drawing.Point(654, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(200, 645);
            this.panel2.TabIndex = 1;
            // 
            // pnBottom
            // 
            this.pnBottom.BackColor = System.Drawing.SystemColors.MenuText;
            this.pnBottom.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.pnBottom.Location = new System.Drawing.Point(0, 545);
            this.pnBottom.Name = "pnBottom";
            this.pnBottom.Size = new System.Drawing.Size(654, 100);
            this.pnBottom.TabIndex = 2;
            // 
            // pnLeft
            // 
            this.pnLeft.BackColor = System.Drawing.Color.Turquoise;
            this.pnLeft.Dock = System.Windows.Forms.DockStyle.Left;
            this.pnLeft.Location = new System.Drawing.Point(0, 0);
            this.pnLeft.Name = "pnLeft";
            this.pnLeft.Size = new System.Drawing.Size(200, 545);
            this.pnLeft.TabIndex = 3;
            // 
            // pnLeft2
            // 
            this.pnLeft2.BackColor = System.Drawing.Color.SpringGreen;
            this.pnLeft2.Dock = System.Windows.Forms.DockStyle.Left;
            this.pnLeft2.Location = new System.Drawing.Point(200, 0);
            this.pnLeft2.Name = "pnLeft2";
            this.pnLeft2.Size = new System.Drawing.Size(200, 545);
            this.pnLeft2.TabIndex = 4;
            // 
            // pnTop
            // 
            this.pnTop.BackColor = System.Drawing.SystemColors.ActiveBorder;
            this.pnTop.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnTop.Location = new System.Drawing.Point(400, 0);
            this.pnTop.Name = "pnTop";
            this.pnTop.Size = new System.Drawing.Size(254, 100);
            this.pnTop.TabIndex = 5;
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Yellow;
            this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel1.Location = new System.Drawing.Point(400, 100);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(254, 445);
            this.panel1.TabIndex = 6;
            // 
            // TestDockForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(976, 645);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.pnTop);
            this.Controls.Add(this.pnLeft2);
            this.Controls.Add(this.pnLeft);
            this.Controls.Add(this.pnBottom);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.pnRight);
            this.Name = "TestDockForm";
            this.Text = "TestDockForm";
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel pnRight;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Panel pnBottom;
        private System.Windows.Forms.Panel pnLeft;
        private System.Windows.Forms.Panel pnLeft2;
        private System.Windows.Forms.Panel pnTop;
        private System.Windows.Forms.Panel panel1;
    }
}