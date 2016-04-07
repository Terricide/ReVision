using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ColumnHeader : Control
    {
        public ColumnHeader()
        {

        }
        public ColumnHeader(int width = 60) : this(null, width)
        {

        }
        public ColumnHeader(string columnName, int width = 60)
        {
            this.ColumnName = columnName;
            this.Size = new Drawing.Size(width, 0);
        }
        private string mColumnName = "Column Header";
        public string ColumnName
        {
            get
            {
                return mColumnName;
            }
            set
            {
                if (mColumnName != value)
                {
                    mColumnName = value;
                    RaisePropertyChanged("ColumnName", value);
                }
            }
        }

        public override string Text
        {
            get
            {
                return ColumnName;
            }
            set
            {
                ColumnName = value;
            }
        }

        public override string ControlName
        {
            get
            {
                return "ListViewColumn";
            }
        }
    }
}
