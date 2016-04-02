using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public partial class Control
    {
        public event EventHandler Resize;
        public event EventHandler Click;
        public event EventHandler TextChanged;

        private string mText;
        public virtual string Text
        {
            get
            {
                return mText;
            }
            set
            {
                if (mText != value)
                {
                    mText = value;
                    RaisePropertyChanged("Text", value);
                    if (TextChanged != null)
                    {
                        TextChanged(this, EventArgs.Empty);
                    }
                }
            }
        }

        public int Handle
        {
            get
            {
                return Convert.ToInt32(this.ClientId);
            }
        }

        public int TabIndex { get; set; }
        public string Name { get; set; }
        public bool AutoSize { get; set; }

        public Point Location { get; set; }
        private Size mSize = new Size(300, 300);
        public Size Size
        {
            get
            {
                return mSize;
            }
            set
            {
                if (mSize != value)
                {
                    mSize = value;
                    RaisePropertyChanged("Size", value);
                    if (Resize != null)
                    {
                        Resize(this, EventArgs.Empty);
                    }
                }
            }
        }

        public int Right
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.X + this.Size.Width;
            }
        }

        public int Bottom
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.Y + this.Size.Height;
            }
        }

        public int Top
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.Y;
            }
            set
            {
                this.Location = new Point(this.Top, value);
            }
        }

        public int Left
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.X;
            }
            set
            {
                this.Location = new Point(value, this.Top);
            }
        }

        public int Width
        {
            get
            {
                return this.Size.Width;
            }
            set
            {
                this.Size = new Size(value, this.Height);
            }
        }

        public int Height
        {
            get
            {
                return this.Size.Height;
            }
            set
            {
                this.Size = new Size(this.Width, value);
            }
        }

        public Size ClientSize
        {
            get
            {
                return this.Size;
            }
        }
        private bool mVisible = true;
        public bool Visible
        {
            get
            {
                return mVisible;
            }
            set
            {
                if (this.mVisible != value)
                {
                    this.mVisible = value;
                    RaisePropertyChanged("Visible", value);
                }
            }
        }
    }
}
