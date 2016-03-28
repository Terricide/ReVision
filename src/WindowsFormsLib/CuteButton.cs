using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public class CuteButton : System.Windows.Forms.Button
    {
        private Color m_color1 = Color.Red; // first color
        private Color m_color2 = Color.DarkBlue;  // second color
        private int m_color1Transparent = 64; // transparency degree 
                                              // (applies to the 1st color)
        private int m_color2Transparent = 64; // transparency degree 
                                              //  (applies to the 2nd color)

        public Color cuteColor1
        {
            get { return m_color1; }
            set
            {
                m_color1 = value;
                Invalidate();
            }
        }

        public Color cuteColor2
        {
            get { return m_color2; }
            set { m_color2 = value; Invalidate(); }
        }

        public int cuteTransparent1
        {
            get { return m_color1Transparent; }
            set { m_color1Transparent = value; Invalidate(); }
        }

        public int cuteTransparent2
        {
            get { return m_color2Transparent; }
            set { m_color2Transparent = value; Invalidate(); }
        }

        public CuteButton()
        {
            this.MouseLeave += CuteButton_MouseLeave;
            this.MouseEnter += CuteButton_MouseEnter;
            this.Invalidate();
        }

        private void CuteButton_MouseEnter(object sender, EventArgs e)
        {
            m_color1 = Color.Purple;
            m_color2 = Color.Black;
            Invalidate();
        }

        private void CuteButton_MouseLeave(object sender, EventArgs e)
        {
            m_color1 = Color.Red; // first color
            m_color2 = Color.DarkBlue;  // second color
            Invalidate();
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            // Calling the base class OnPaint
            base.OnPaint(pe);
            // Create two semi-transparent colors
            Color c1 = Color.FromArgb
                (m_color1Transparent, m_color1);
            Color c2 = Color.FromArgb
                (m_color2Transparent, m_color2);
            Brush b = new System.Drawing.Drawing2D.LinearGradientBrush
                (pe.ClipRectangle, c1, c2, 10);
            pe.Graphics.FillRectangle(b, pe.ClipRectangle);
            b.Dispose();
        }
    }
}
