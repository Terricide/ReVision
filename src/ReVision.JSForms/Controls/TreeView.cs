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
        private qx.ui.tree.Tree tree;
        private qx.ui.tree.TreeFolder root;
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

        public TreeView()
        {
            this.tree = new qx.ui.tree.Tree();
            this.tree.HideRoot = true;
            this.Element = tree;
        }

        //private DivElement TreeElement;

        //public Fancytree FancyTree;

        public override void Render()
        {
            //this.Element.Style.Overflow = Bridge.Html5.Overflow.Auto;
            //this.TreeElement = new DivElement();
            //this.TreeElement.Id = "TR_" + this.ClientId;

            RenderNode(null, null);


            base.Render();

            this.Element.AddListener("changeSelection", (e) =>
            {
                qx.ui.tree.Tree tree = (dynamic)e.Target;
                var selected = (from t in tree.Selection
                                select (qx.ui.tree.TreeFolder)t);
                var folders = (selected.Select(n => new { Name = n.Label })).ToArray();
                this.FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "AfterSelect",
                    Value = folders
                });
            });

            //this.Element.AppendChild(this.TreeElement);
            //this.Element.Style.BorderStyle = BorderStyle.Solid;
            //this.Element.Style.BorderWidth = BorderWidth.Thin;
            //this.Element.Style.BorderColor = "gray";
            //this.FancyTree = Fancytree.Element(this.TreeElement);
        }

        private void RenderNode(qx.ui.tree.TreeFolder parent, TreeNode parentNode)
        {
            TreeNode[] nodes = new TreeNode[0];

            if (parentNode == null)
            {
                nodes = this.Nodes;
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
                var folder = new qx.ui.tree.TreeFolder();
                folder.Label = node.Name;
                node.Folder = folder;

                RenderNode(folder, node);

                if (parent != null)
                {
                    parent.Add(folder);
                }
                else
                {
                    if( root == null )
                    {
                        root = new qx.ui.tree.TreeFolder();
                        root.Open = true;
                        tree.Root = root;
                    }
                    root.Add(folder);
                }
            }
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
