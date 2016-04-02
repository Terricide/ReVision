// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent

namespace Bridge.Html5
{
    /// <summary>
    /// A CloseEvent is sent to clients using WebSockets when the connection is closed.
    /// </summary>
    [External]
    [Name("CloseEvent")]
    public class CloseEvent : Event
    {
        internal extern CloseEvent();

        /// <summary>
        /// Creates a new CloseEvent
        /// </summary>
        /// <param name="typeArg">Is a DOMString representing the name of the event.</param>
        public extern CloseEvent(string typeArg);

        /// <summary>
        /// Creates a new CloseEvent
        /// </summary>
        /// <param name="typeArg">Is a DOMString representing the name of the event.</param>
        /// <param name="closeEventInit">Is a CloseEventInit dictionary</param>
        public extern CloseEvent(string typeArg, CloseEventInit closeEventInit);

        /// <summary>
        /// Close code sent by the server.
        /// </summary>
        public readonly StatusCode Code;

        /// <summary>
        /// Reason the server closed the connection. This is specific to the particular server and sub-protocol.
        /// </summary>
        public readonly string Reason;

        /// <summary>
        /// Indicates whether or not the connection was cleanly closed.
        /// </summary>
        public readonly bool WasClean;

        [External]
        [Name("Number")]
        [Enum(Emit.Value)]
        public enum StatusCode : ushort
        {
            //0–999	 	Reserved and not used.
            /// <summary>
            /// Normal closure; the connection successfully completed whatever purpose for which it was created.
            /// </summary>
            CLOSE_NORMAL = 1000,
            /// <summary>
            /// The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.
            /// </summary>
            CLOSE_GOING_AWAY = 1001,
            /// <summary>
            /// // The endpoint is terminating the connection due to a protocol error.
            /// </summary>
            CLOSE_PROTOCOL_ERROR = 1002,
            /// <summary>
            /// The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).
            /// </summary>
            CLOSE_UNSUPPORTED = 1003,
            //1004 Reserved. A meaning might be defined in the future.
            /// <summary>
            /// Reserved.  Indicates that no status code was provided even though one was expected.
            /// </summary>
            CLOSE_NO_STATUS = 1005,
            /// <summary>
            /// Reserved. Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.
            /// </summary>
            CLOSE_ABNORMAL = 1006,
            /// <summary>
            /// The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).
            /// </summary>
            UNSUPPORTED_DATA = 1007,
            /// <summary>
            /// The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.
            /// </summary>
            POLICY_VIOLATION = 1008,
            /// <summary>
            /// The endpoint is terminating the connection because a data frame was received that is too large.
            /// </summary>
            CLOSE_TOO_LARGE = 1009,
            /// <summary>
            /// The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't.
            /// </summary>
            MISSIN_EXTENTION = 1010,
            /// <summary>
            /// The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.
            /// </summary>
            INTERNAL_ERROR = 1011,
            /// <summary>
            /// The server is terminating the connection because it is restarting. [Ref]
            /// </summary>
            SERVICE_RESTART = 1012,
            /// <summary>
            /// The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients. [Ref]
            /// </summary>
            TRY_AGAIN_LATER = 1013,
            //1014	 	Reserved for future use by the WebSocket standard.
            /// <summary>
            /// Reserved. Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).
            /// </summary>
            TLS_HANDSHAKE = 1015,
            // 1016–1999	Reserved for future use by the WebSocket standard.
            // 2000–2999	Reserved for use by WebSocket extensions.
            // 3000–3999	Available for use by libraries and frameworks. May not be used by applications. Available for registration at the IANA via first-come, first-serve.
            // 4000–4999	Available for use by applications.
        }
    }

    [External]
    [Name("Object")]
    public class CloseEventInit
    {
        /// <summary>
        /// Indicates the Close code.
        /// </summary>
        public CloseEvent.StatusCode Code;

        /// <summary>
        /// Indicates the Reason the server closed the connection. This is specific to the particular server and sub-protocol.
        /// </summary>
        public string Reason;

        /// <summary>
        /// Indicates whether or not the connection was cleanly closed.
        /// </summary>
        public bool WasClean;
    }
}