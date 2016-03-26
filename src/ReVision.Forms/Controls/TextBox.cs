using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class TextBox : Control
    {
        public override string ControlName
        {
            get
            {
                return "TextBox";
            }
        }

        [JsonIgnore]
        public KeyEventHandler EnterKeyDown { get; set; }

        private char mPasswordChar;
        public char PasswordChar
        {
            get
            {
                return mPasswordChar;
            }
            set
            {
                if( mPasswordChar != value )
                {
                    mPasswordChar = value;
                    RaisePropertyChanged();
                }
            }
        }

        public bool Multiline { get; set; }
    }
}