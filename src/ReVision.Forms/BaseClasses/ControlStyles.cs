namespace System.Windows.Forms
{
    [Flags]
    public enum ControlStyles
    {
        //
        // Summary:
        //     If true, the control is a container-like control.
        ContainerControl = 1,
        //
        // Summary:
        //     If true, the control paints itself rather than the operating system doing so.
        //     If false, the System.Windows.Forms.Control.Paint event is not raised. This style
        //     only applies to classes derived from System.Windows.Forms.Control.
        UserPaint = 2,
        //
        // Summary:
        //     If true, the control is drawn opaque and the background is not painted.
        Opaque = 4,
        //
        // Summary:
        //     If true, the control is redrawn when it is resized.
        ResizeRedraw = 16,
        //
        // Summary:
        //     If true, the control has a fixed width when auto-scaled. For example, if a layout
        //     operation attempts to rescale the control to accommodate a new System.Drawing.Font,
        //     the control's System.Windows.Forms.Control.Width remains unchanged.
        FixedWidth = 32,
        //
        // Summary:
        //     If true, the control has a fixed height when auto-scaled. For example, if a layout
        //     operation attempts to rescale the control to accommodate a new System.Drawing.Font,
        //     the control's System.Windows.Forms.Control.Height remains unchanged.
        FixedHeight = 64,
        //
        // Summary:
        //     If true, the control implements the standard System.Windows.Forms.Control.Click
        //     behavior.
        StandardClick = 256,
        //
        // Summary:
        //     If true, the control can receive focus.
        Selectable = 512,
        //
        // Summary:
        //     If true, the control does its own mouse processing, and mouse events are not
        //     handled by the operating system.
        UserMouse = 1024,
        //
        // Summary:
        //     If true, the control accepts a System.Windows.Forms.Control.BackColor with an
        //     alpha component of less than 255 to simulate transparency. Transparency will
        //     be simulated only if the System.Windows.Forms.ControlStyles.UserPaint bit is
        //     set to true and the parent control is derived from System.Windows.Forms.Control.
        SupportsTransparentBackColor = 2048,
        //
        // Summary:
        //     If true, the control implements the standard System.Windows.Forms.Control.DoubleClick
        //     behavior. This style is ignored if the System.Windows.Forms.ControlStyles.StandardClick
        //     bit is not set to true.
        StandardDoubleClick = 4096,
        //
        // Summary:
        //     If true, the control ignores the window message WM_ERASEBKGND to reduce flicker.
        //     This style should only be applied if the System.Windows.Forms.ControlStyles.UserPaint
        //     bit is set to true.
        AllPaintingInWmPaint = 8192,
        //
        // Summary:
        //     If true, the control keeps a copy of the text rather than getting it from the
        //     System.Windows.Forms.Control.Handle each time it is needed. This style defaults
        //     to false. This behavior improves performance, but makes it difficult to keep
        //     the text synchronized.
        CacheText = 16384,
        //
        // Summary:
        //     If true, the System.Windows.Forms.Control.OnNotifyMessage(System.Windows.Forms.Message)
        //     method is called for every message sent to the control's System.Windows.Forms.Control.WndProc(System.Windows.Forms.Message@).
        //     This style defaults to false. System.Windows.Forms.ControlStyles.EnableNotifyMessage
        //     does not work in partial trust.
        EnableNotifyMessage = 32768,
        //
        // Summary:
        //     If true, drawing is performed in a buffer, and after it completes, the result
        //     is output to the screen. Double-buffering prevents flicker caused by the redrawing
        //     of the control. If you set System.Windows.Forms.ControlStyles.DoubleBuffer to
        //     true, you should also set System.Windows.Forms.ControlStyles.UserPaint and System.Windows.Forms.ControlStyles.AllPaintingInWmPaint
        //     to true.
        DoubleBuffer = 65536,
        //
        // Summary:
        //     If true, the control is first drawn to a buffer rather than directly to the screen,
        //     which can reduce flicker. If you set this property to true, you should also set
        //     the System.Windows.Forms.ControlStyles.AllPaintingInWmPaint to true.
        OptimizedDoubleBuffer = 131072,
        //
        // Summary:
        //     Specifies that the value of the control's Text property, if set, determines the
        //     control's default Active Accessibility name and shortcut key.
        UseTextForAccessibility = 262144
    }
}