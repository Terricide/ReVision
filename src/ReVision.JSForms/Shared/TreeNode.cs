using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TreeNode
    {
        public string Name;
        public string Text;
        public TreeNode[] Nodes;
        public TreeNode()
        {
            Nodes = new TreeNode[0];
        }
    }
}
