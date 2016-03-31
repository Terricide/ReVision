using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsLib
{
    public partial class ChatWindow : Form
    {
        public ChatWindow()
        {
            InitializeComponent();

            foreach(var message in ChatMessages.Messages)
            {
                this.richTextBox1.AppendText(message.ToString());
            }

            ChatMessages.OnNewMessage += ChatMessages_OnNewMessage;
        }

        private void ChatMessages_OnNewMessage(object sender, ChatMessage e)
        {
            this.richTextBox1.AppendText(e.ToString());
        }

        private void tbMessage_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)10)
            {
                ChatMessages.AddMessage(this.tbName.Text, this.tbMessage.Text);
                this.tbMessage.Text = string.Empty;
            }
        }
    }

    public class ChatMessages
    {
        public static List<ChatMessage> Messages = new List<ChatMessage>();
        public static event EventHandler<ChatMessage> OnNewMessage;

        public static void AddMessage(string userName, string message)
        {
            var chatMessage = new ChatMessage(userName, message);
            Messages.Add(chatMessage);
            if (OnNewMessage != null)
            {
                OnNewMessage(null, chatMessage);
            }
        }
    }

    public class ChatMessage
    {
        public DateTime TimeStamp;
        public string UserName;
        public string Message;
        public ChatMessage(string userName, string message)
        {
            this.UserName = userName;
            this.Message = message;
            this.TimeStamp = DateTime.Now;
        }

        public override string ToString()
        {
            return this.UserName + " " + this.TimeStamp + Environment.NewLine + this.Message + Environment.NewLine;
        }
    }
}
