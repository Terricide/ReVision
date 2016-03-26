using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TreeView : Control
    {
        public event TreeViewEventHandler AfterSelect;
        public event TreeViewCancelEventHandler BeforeSelect;
        public TreeNodeCollection Nodes = new TreeNodeCollection();

        public override string ControlName
        {
            get
            {
                return "TreeView";
            }
        }

        public override Task FireEvent(WSEventArgs evt)
        {
            return base.FireEvent(evt);
        }

        public override async Task ProcessMessage(WSEventArgs args)
        {
            var clientId = GetId(args.ClientId);

            if (clientId == this.ClientId)
            {
                switch(args.EventType)
                {
                    case "fancytreecreate":
                        IsHandleCreated = true;
                        break;
                    case "fancytreebeforeactivate":
                        if (BeforeSelect != null)
                        {
                            BeforeSelect(this, new TreeViewCancelEventArgs(null, false, TreeViewAction.ByMouse));
                        }
                        break;
                    case "fancytreeclick":
                        {
                            if (AfterSelect != null)
                            {
                                var node = this.Nodes.Where(n => n.Name == args.Value.ToString()).FirstOrDefault();
                                AfterSelect(this, new TreeViewEventArgs(node));
                            }
                        }
                        break;
                }
            }
            await base.ProcessMessage(args);
        }
    }

    public class TreeNodeCollection : List<TreeNode>
    {
        public void Add(string text)
        {
            TreeNode tn = new TreeNode(text);
            this.Add(tn);
        }
    }
}
