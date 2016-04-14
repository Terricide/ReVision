using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Drawing
{
    public class Size
    {
        public Size(int width, int height)
        {
            this.Width = width;
            this.Height = height;
        }
        public int Width;
        public int Height;

        public bool Equals(Size obj)
        {
            if( obj.Height != this.Height || obj.Width != this.Width )
            {
                return false;
            }
            return true;
        }

        public override bool Equals(object obj)
        {
            if( obj is Size )
            {
                var size = (Size)obj;
                if (size.Height != this.Height || size.Width != this.Width)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }

        public static bool operator ==(Size lhs, Size rhs)
        {
            if (lhs.Height != rhs.Height || lhs.Width != rhs.Width)
            {
                return false;
            }
            return true;
        }

        public static bool operator !=(Size lhs, Size rhs)
        {
            if (lhs.Height != rhs.Height || lhs.Width != rhs.Width)
            {
                return true;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}
