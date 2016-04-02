// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

using System;

namespace Bridge.Html5
{
    /// <summary>
    /// The WebSocket interface provides the API for creating and managing a WebSocket connection
    /// to a server, as well as for sending and receiving data on the connection.
    /// </summary>
    [External]
    [Name("WebSocket")]
    public class WebSocket
    {
        /// <param name="url">
        /// The URL to which to connect; this should be the URL to which the WebSocket server will respond.
        /// </param>
        public extern WebSocket(string url);

        /// <param name="url">
        /// The URL to which to connect; this should be the URL to which the WebSocket server will respond.
        /// </param>
        /// <param name="protocol">
        /// This string is used to indicate sub-protocol, so that a single server
        /// can implement multiple WebSocket sub-protocols (for example, you might want one server
        /// to be able to handle different types of interactions depending on the specified protocol).
        /// </param>
        public extern WebSocket(string url, string protocol);

        /// <param name="url">
        /// The URL to which to connect; this should be the URL to which the WebSocket server will respond.
        /// </param>
        /// <param name="protocols">
        /// These strings are used to indicate sub-protocols, so that a single server
        /// can implement multiple WebSocket sub-protocols (for example, you might want one server
        /// to be able to handle different types of interactions depending on the specified protocol).
        /// </param>
        public extern WebSocket(string url, string[] protocols);

        /// <summary>
        /// Closes the WebSocket connection or connection attempt, if any.
        /// If the connection is already closed, this method does nothing.
        /// </summary>
        public extern void Close();

        /// <summary>
        /// Closes the WebSocket connection or connection attempt, if any.
        /// If the connection is already closed, this method does nothing.
        /// </summary>
        /// <param name="code">
        /// A numeric value indicating the status code explaining why the connection is being closed.
        /// </param>
        public extern void Close(CloseEvent.StatusCode code);

        /// <summary>
        /// Closes the WebSocket connection or connection attempt, if any.
        /// If the connection is already closed, this method does nothing.
        /// </summary>
        /// <param name="code">
        /// A numeric value indicating the status code explaining why the connection is being closed.
        /// </param>
        /// <param name="reason">
        /// A human-readable string explaining why the connection is closing. This string
        /// must be no longer than 123 bytes of UTF-8 text (not characters).
        /// </param>
        public extern void Close(CloseEvent.StatusCode code, string reason);

        /// <summary>
        /// Transmits data to the server over the WebSocket connection.
        /// </summary>
        /// <param name="data">A text string to send to the server.</param>
        public extern void Send(string data);

        /// <summary>
        /// Transmits data to the server over the WebSocket connection.
        /// </summary>
        /// <param name="data">A Blob to send to the server.</param>
        public extern void Send(Blob data);

        /// <summary>
        /// Transmits data to the server over the WebSocket connection.
        /// </summary>
        /// <param name="data">An ArrayBuffer to send to the server.</param>
        public extern void Send(ArrayBuffer data);

        /// <summary>
        /// An event handler property for handling socket connection event.
        /// </summary>
        [Name("onopen")]
        public Action<Event> OnOpen;

        /// <summary>
        /// An event handler property for handling socket closing event.
        /// </summary>
        [Name("onclose")]
        public Action<CloseEvent> OnClose;

        /// <summary>
        /// An event handler property for handling incoming message event.
        /// </summary>
        [Name("onmessage")]
        public Action<MessageEvent> OnMessage;

        /// <summary>
        /// An event handler property for handling socket error event.
        /// </summary>
        [Name("onerror")]
        public Action<Event> OnError;

        /// <summary>
        /// The current state of the connection.
        /// </summary>
        public readonly State ReadyState;

        /// <summary>
        /// The type of binary data being transmitted by the connection.
        /// </summary>
        public DataType BinaryType;

        /// <summary>
        /// The number of bytes of data that have been queued using calls to Send() but not yet
        /// transmitted to the network. This value does not reset to zero when the connection is closed;
        /// if you keep calling Send(), this will continue to climb.
        /// </summary>
        public readonly ulong BufferedAmount;

        /// <summary>
        /// The extensions selected by the server.
        /// </summary>
        public string Extensions;

        /// <summary>
        /// A string indicating the name of the sub-protocol the server selected;
        /// this will be one of the strings specified in the protocols parameter of constructor.
        /// </summary>
        public string Protocol;

        /// <summary>
        /// The URL as resolved by the constructor. This is always an absolute URL.
        /// </summary>
        public readonly string Url;

        [External]
        [Name("Number")]
        [Enum(Emit.Value)]
        public enum State
        {
            Connecting = 0,
            Open = 1,
            Closing = 2,
            Closed = 3
        }

        [External]
        [Name("String")]
        [Enum(Emit.StringNameLowerCase)]
        public enum DataType
        {
            Blob,
            ArrayBuffer
        }
    }
}