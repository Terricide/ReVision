using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TreeNode
    {
        public string Name { get; set; }
        public string Text { get; set; }
        public List<TreeNode> Nodes = new List<TreeNode>();
        public TreeNode()
        {
            
        }
        public TreeNode(string name)
        {
            this.Name = name;
            this.Text = name;
        }
        public TreeNode(string name, IEnumerable<TreeNode> nodes) : this(name)
        {
            this.Nodes.AddRange(nodes);
        }
    }
}
