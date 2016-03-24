using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public delegate void TreeViewEventHandler(object sender, TreeViewEventArgs e);
    public delegate void TreeViewCancelEventHandler(object sender, TreeViewCancelEventArgs e);   

    public class TreeViewEventArgs : EventArgs
    {
        TreeNode node;
        TreeViewAction action = TreeViewAction.Unknown;

        /// <include file='doc\TreeViewEvent.uex' path='docs/doc[@for="TreeViewEventArgs.TreeViewEventArgs"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeViewEventArgs(TreeNode node)
        {
            this.node = node;
        }

        /// <include file='doc\TreeViewEvent.uex' path='docs/doc[@for="TreeViewEventArgs.TreeViewEventArgs1"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeViewEventArgs(TreeNode node, TreeViewAction action)
        {
            this.node = node;
            this.action = action;
        }

        /// <include file='doc\TreeViewEvent.uex' path='docs/doc[@for="TreeViewEventArgs.Node"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeNode Node
        {
            get
            {
                return node;
            }
        }

        /// <include file='doc\TreeViewEvent.uex' path='docs/doc[@for="TreeViewEventArgs.Action"]/*' />
        /// <devdoc>
        ///      An event specific action-flag.
        /// </devdoc>
        public TreeViewAction Action
        {
            get
            {
                return action;
            }
        }
    }

    public class TreeViewCancelEventArgs : CancelEventArgs
    {
        private TreeNode node;
        private TreeViewAction action;

        /// <include file='doc\TreeViewCancelEvent.uex' path='docs/doc[@for="TreeViewCancelEventArgs.TreeViewCancelEventArgs"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeViewCancelEventArgs(TreeNode node, bool cancel, TreeViewAction action)
            : base(cancel)
        {
            this.node = node;
            this.action = action;
        }

        /// <include file='doc\TreeViewCancelEvent.uex' path='docs/doc[@for="TreeViewCancelEventArgs.Node"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeNode Node
        {
            get
            {
                return node;
            }
        }

        /// <include file='doc\TreeViewCancelEvent.uex' path='docs/doc[@for="TreeViewCancelEventArgs.Action"]/*' />
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public TreeViewAction Action
        {
            get
            {
                return action;
            }
        }
    }
}
