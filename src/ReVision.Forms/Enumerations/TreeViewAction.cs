using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction"]/*' />
    /// <devdoc>
    ///     This enum is used to specify the action that caused a TreeViewEventArgs.
    /// </devdoc>
    public enum TreeViewAction
    {

        /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction.Unknown"]/*' />
        /// <devdoc>
        ///     The action is unknown.
        /// </devdoc>
        Unknown = 0,

        /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction.ByKeyboard"]/*' />
        /// <devdoc>
        ///     The event was caused by a keystroke.
        /// </devdoc>
        ByKeyboard = 1,

        /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction.ByMouse"]/*' />
        /// <devdoc>
        ///     The event was caused by a mouse click.
        /// </devdoc>
        ByMouse = 2,

        /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction.Collapse"]/*' />
        /// <devdoc>
        ///     The tree node is collapsing.
        /// </devdoc>
        Collapse = 3,

        /// <include file='doc\TreeViewAction.uex' path='docs/doc[@for="TreeViewAction.Expand"]/*' />
        /// <devdoc>
        ///     The tree node is expanding.
        /// </devdoc>
        Expand = 4,
    }
}
