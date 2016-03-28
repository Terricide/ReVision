using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.ComponentModel;

namespace SpinnyFlashyShinyControls
{
    [DefaultEvent("Click")]
    public class GlassButton : Button
    {
        #region properties

        private Bitmap _bmpBackBuffer;
        private State _status;
        private State ButtonStatus
        {
            get { return _status; }
            set
            {
                _status = value;
                _bmpBackBuffer = null;
                this.Refresh();
            }
        }
        private enum State
        {
            Normal,
            Hover,
            Click
        }
        private enum RectangleCorners
        {
            None = 0, TopLeft = 1, TopRight = 2,
            BottomLeft = 4, BottomRight = 8,
            All = TopLeft | TopRight | BottomLeft | BottomRight
        }

        private int _radius = 6;
        public int RoundedCornerRadius
        {
            get { return _radius; }
            set { _radius = value; ButtonStatus = _status; }
        }

        private bool _antialias = true;
        public bool FontAntiAlias
        {
            get { return _antialias; }
            set { _antialias = value; ButtonStatus = _status; }
        }

        public override ContentAlignment TextAlign
        {
            get
            {
                return base.TextAlign;
            }
            set
            {
                base.TextAlign = value;
                ButtonStatus = _status;
            }
        }

        public override Color BackColor
        {
            get
            {
                return base.BackColor;
            }
            set
            {
                base.BackColor = value;
                ButtonStatus = _status;
            }
        }

        public override string Text
        {
            get
            {
                return base.Text;
            }
            set
            {
                base.Text = value;
                ButtonStatus = _status;
            }
        }

        public override Font Font
        {
            get
            {
                return base.Font;
            }
            set
            {
                base.Font = value;
                ButtonStatus = _status;
            }
        }

        public override Color ForeColor
        {
            get
            {
                return base.ForeColor;
            }
            set
            {
                base.ForeColor = value;
                ButtonStatus = _status;
            }
        }

        #endregion

        public GlassButton()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint, true);
            this.SetStyle(ControlStyles.DoubleBuffer, true);
            this.SetStyle(ControlStyles.ResizeRedraw, true);
            this.SetStyle(ControlStyles.Selectable, true);
            this.SetStyle(ControlStyles.UserPaint, true);
        }

        private void InitializeComponent()
        {
            this.Size = new System.Drawing.Size(100, 32);
            this.Font = new Font("Calibri", 12, FontStyle.Bold);
            this.ForeColor = Color.White;

            this.MouseEnter += new EventHandler(this.GlassButton_MouseEnter);
            this.MouseLeave += new EventHandler(this.GlassButton_MouseLeave);
            this.MouseDown += new MouseEventHandler(GlassButton_MouseDown);
            this.MouseUp += new MouseEventHandler(GlassButton_MouseUp);
            this.Resize += new EventHandler(GlassButton_Resize);
        }

        void GlassButton_Resize(object sender, EventArgs e)
        {
            ButtonStatus = State.Normal;
        }

        private void GlassButton_MouseUp(object sender, MouseEventArgs e)
        {
            ButtonStatus = State.Hover;
        }

        private void GlassButton_MouseDown(object sender, MouseEventArgs e)
        {
            ButtonStatus = State.Click;
        }

        private void GlassButton_MouseLeave(object sender, EventArgs e)
        {
            ButtonStatus = State.Normal;
        }

        private void GlassButton_MouseEnter(object sender, EventArgs e)
        {
            ButtonStatus = State.Hover;
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
            e.Graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;

            if (_bmpBackBuffer == null)
            {
                DrawButton(ref _bmpBackBuffer);
            }

            if (_bmpBackBuffer != null)
            {
                e.Graphics.DrawImage(_bmpBackBuffer, e.ClipRectangle, e.ClipRectangle, GraphicsUnit.Pixel);
            }
        }

        private void DrawButton(ref Bitmap bmp)
        {
            if (bmp == null)
            {
                bmp = new Bitmap(this.ClientSize.Width, this.ClientSize.Height);
            }

            using (Graphics gr = Graphics.FromImage(bmp))
            {
                DrawGlass(gr, new Rectangle(0, 0, this.Width, this.Height));
            }
        }


        private void DrawGlass(Graphics gr, Rectangle rectBar)
        {
            // Some calculations
            if (rectBar.Height <= 0) rectBar.Height = 1;
            int nAlphaStart = (int)(185 + 5 * rectBar.Width / 24),
                nAlphaEnd = (int)(10 + 4 * rectBar.Width / 24);

            if (nAlphaStart > 255) nAlphaStart = 255;
            else if (nAlphaStart < 0) nAlphaStart = 0;

            if (nAlphaEnd > 255) nAlphaEnd = 255;
            else if (nAlphaEnd < 0) nAlphaEnd = 0;

            Color ColorBacklight;
            Color ColorFillBK;
            Color ColorBorder;

            switch (_status)
            {
                case State.Click:
                    ColorBacklight = GetDarkerColor(this.BackColor, 20);
                    ColorFillBK = GetDarkerColor(this.BackColor, 40);
                    ColorBorder = GetDarkerColor(this.BackColor, 60);
                    break;
                case State.Hover:
                    ColorBacklight = GetLighterColor(this.BackColor, 5);
                    ColorFillBK = GetLighterColor(this.BackColor, 10);
                    ColorBorder = GetDarkerColor(this.BackColor, 100);
                    break;
                case State.Normal:
                default:
                    ColorBacklight = this.BackColor;
                    ColorFillBK = GetDarkerColor(this.BackColor, 85);
                    ColorBorder = GetDarkerColor(this.BackColor, 100);
                    break;
            }

            Color ColorBacklightEnd = Color.FromArgb(50, 0, 0, 0);
            Color ColorGlowStart = Color.FromArgb(nAlphaEnd, 255, 255, 255);
            Color ColorGlowEnd = Color.FromArgb(nAlphaStart, 255, 255, 255);

            // Create gradient path
            RectangleF er = new RectangleF(rectBar.Left - (rectBar.Width), rectBar.Top - (rectBar.Height / 2), rectBar.Width * 3, rectBar.Height * 4);
            GraphicsPath rctPath = new GraphicsPath();
            rctPath.AddEllipse(er);

            // Create gradient
            PathGradientBrush pgr = new PathGradientBrush(rctPath);
            pgr.CenterPoint = new PointF(rectBar.Width / 2, rectBar.Height);
            pgr.CenterColor = ColorBacklight;
            pgr.SurroundColors = new Color[] { ColorBacklightEnd };

            // Create glow
            GraphicsPath rectBarPath = CreateRoundedPath(rectBar.X, rectBar.Y, rectBar.Width - 1, rectBar.Height - 1, _radius, RectangleCorners.All);
            GraphicsPath rectBarPathHalf = CreateRoundedPath(rectBar.X, rectBar.Y, rectBar.Width - 1, (rectBar.Height - 1) / 2, _radius, RectangleCorners.TopRight | RectangleCorners.TopLeft);

            Rectangle rectGlow = new Rectangle(rectBar.Left, rectBar.Top, rectBar.Width, rectBar.Height / 2);
            LinearGradientBrush brGlow = new LinearGradientBrush(
                new PointF(rectGlow.Left, rectGlow.Height + 1), new PointF(rectGlow.Left, rectGlow.Top - 1),
                ColorGlowStart, ColorGlowEnd);

            // Draw the button
            if (this.Parent != null)
            {
                gr.FillRectangle(new SolidBrush(this.Parent.BackColor), rectBar);
            }
            gr.FillPath(new SolidBrush(ColorFillBK), rectBarPath);
            gr.FillPath(pgr, rectBarPath);
            gr.FillPath(brGlow, rectBarPathHalf);
            gr.DrawPath(new Pen(ColorBorder, 1), rectBarPath);

            StringFormat stringFormat = new StringFormat();

            switch (this.TextAlign)
            {
                case ContentAlignment.TopLeft:
                    stringFormat.Alignment = StringAlignment.Near;
                    stringFormat.LineAlignment = StringAlignment.Near;
                    break;
                case ContentAlignment.TopCenter:
                    stringFormat.Alignment = StringAlignment.Center;
                    stringFormat.LineAlignment = StringAlignment.Near;
                    break;
                case ContentAlignment.TopRight:
                    stringFormat.Alignment = StringAlignment.Far;
                    stringFormat.LineAlignment = StringAlignment.Near;
                    break;
                case ContentAlignment.MiddleLeft:
                    stringFormat.Alignment = StringAlignment.Near;
                    stringFormat.LineAlignment = StringAlignment.Center;
                    break;
                case ContentAlignment.MiddleCenter:
                    stringFormat.Alignment = StringAlignment.Center;
                    stringFormat.LineAlignment = StringAlignment.Center;
                    break;
                case ContentAlignment.MiddleRight:
                    stringFormat.Alignment = StringAlignment.Far;
                    stringFormat.LineAlignment = StringAlignment.Center;
                    break;
                case ContentAlignment.BottomLeft:
                    stringFormat.Alignment = StringAlignment.Near;
                    stringFormat.LineAlignment = StringAlignment.Far;
                    break;
                case ContentAlignment.BottomCenter:
                    stringFormat.Alignment = StringAlignment.Center;
                    stringFormat.LineAlignment = StringAlignment.Far;
                    break;
                case ContentAlignment.BottomRight:
                    stringFormat.Alignment = StringAlignment.Far;
                    stringFormat.LineAlignment = StringAlignment.Far;
                    break;
            }


            SolidBrush drawBrush = new SolidBrush(this.ForeColor);

            if (_antialias)
                gr.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

            gr.DrawString(this.Text, this.Font, drawBrush, rectBar, stringFormat);
        }

        private Color GetDarkerColor(Color color, byte intensity)
        {
            int r, g, b;
            r = color.R - intensity;
            g = color.G - intensity;
            b = color.B - intensity;
            if (r > 255 || r < 0) r *= -1;
            if (g > 255 || g < 0) g *= -1;
            if (b > 255 || b < 0) b *= -1;
            return Color.FromArgb(255, (byte)r, (byte)g, (byte)b);
        }

        private Color GetLighterColor(Color color, byte intensity)
        {
            int r, g, b;
            r = color.R + intensity;
            g = color.G + intensity;
            b = color.B + intensity;
            if (r > 255 || r < 0) r *= -1;
            if (g > 255 || g < 0) g *= -1;
            if (b > 255 || b < 0) b *= -1;
            return Color.FromArgb(255, (byte)r, (byte)g, (byte)b);
        }


        private GraphicsPath CreateRoundedPath(int x, int y, int width, int height, int radius, RectangleCorners corners)
        {
            int xw = x + width - 1;
            int yh = y + height - 1;
            int xwr = xw - radius;
            int yhr = yh - radius;
            int xr = x + radius;
            int yr = y + radius;
            int r2 = radius * 2;
            int xwr2 = xw - r2;
            int yhr2 = yh - r2;

            GraphicsPath p = new GraphicsPath();
            p.StartFigure();

            //Top Left Corner
            if ((RectangleCorners.TopLeft & corners) == RectangleCorners.TopLeft)
            {
                p.AddArc(x, y, r2, r2, 180, 90);
            }
            else
            {
                p.AddLine(x, yr, x, y);
                p.AddLine(x, y, xr, y);
            }

            //Top Edge
            p.AddLine(xr, y, xwr, y);

            //Top Right Corner
            if ((RectangleCorners.TopRight & corners) == RectangleCorners.TopRight)
            {
                p.AddArc(xwr2, y, r2, r2, 270, 90);
            }
            else
            {
                p.AddLine(xwr, y, xw, y);
                p.AddLine(xw, y, xw, yr);
            }

            //Right Edge
            p.AddLine(xw, yr, xw, yhr);

            //Bottom Right Corner
            if ((RectangleCorners.BottomRight & corners) == RectangleCorners.BottomRight)
            {
                p.AddArc(xwr2, yhr2, r2, r2, 0, 90);
            }
            else
            {
                p.AddLine(xw, yhr, xw, yh);
                p.AddLine(xw, yh, xwr, yh);
            }

            //Bottom Edge
            p.AddLine(xwr, yh, xr, yh);

            //Bottom Left Corner
            if ((RectangleCorners.BottomLeft & corners) == RectangleCorners.BottomLeft)
            {
                p.AddArc(x, yhr2, r2, r2, 90, 90);
            }
            else
            {
                p.AddLine(xr, yh, x, yh);
                p.AddLine(x, yh, x, yhr);
            }

            //Left Edge
            p.AddLine(x, yhr, x, yr);

            p.CloseFigure();
            return p;
        }
    }
}