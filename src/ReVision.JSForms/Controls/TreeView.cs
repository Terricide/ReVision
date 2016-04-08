using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TreeView : Control
    {
        private TreeNode[] mNodes;
        private TreeNode[] Nodes
        {
            get
            {
                return mNodes;
            }
            set
            {
                mNodes = JSON.Parse<TreeNode[]>(JSON.Stringify(value));
            }
        }

        private DivElement TreeElement;

        public Fancytree FancyTree;

        public override void Render()
        {
            this.Element.Style.Overflow = Bridge.Html5.Overflow.Auto;
            this.TreeElement = new DivElement();
            this.TreeElement.Id = "TR_" + this.ClientId;

            RenderNode(this.TreeElement, null);


            base.Render();

            this.Element.AppendChild(this.TreeElement);
            this.Element.Style.BorderStyle = BorderStyle.Solid;
            this.Element.Style.BorderWidth = BorderWidth.Thin;
            this.Element.Style.BorderColor = "gray";
            this.FancyTree = Fancytree.Element(this.TreeElement);
        }

        private void RenderNode(Element parent, TreeNode parentNode)
        {
            var ul = new UListElement();

            TreeNode[] nodes = new TreeNode[0];

            if( parentNode == null )
            {
                nodes = this.Nodes;
                ul.Style.Display = Display.None;
            }
            else
            {
                nodes = parentNode.Nodes;
            }

            if (nodes.Length == 0)
            {
                return;
            }

            for (var i = 0; i < nodes.Length; i++)
            {
                var node = nodes[i];
                var li = new LIElement();

                li.InnerHTML = node.Text;
                li.Id = node.Name;
                ul.AppendChild(li);

                RenderNode(li, node);
            }

            parent.AppendChild(ul);
        }
    }

    public class Fancytree
    {
        [Template("$({0}).fancytree()")]
        public static Fancytree Element(Element elm)
        {
            return null;
        }
    }
}
