using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.core
{
    [External]
    public class Object
    {
        public virtual extern void AddListener(string name, Action<UIEvent> listener);

        [Template("add({0},{1})")]
        public extern void Add(Object btn, Options p = null);

        public extern Padding SetPadding(int val);
    }

    [External]
    [ObjectLiteral]
    public class Options
    {
        public int Left;
        public int Top;
    }

    [External]
    public class Padding
    {
        public Padding(int val)
        {
            return;
        }
    }
}
