using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebSite
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if( !this.IsPostBack )
            {
                var sessionId = this.Request.Cookies["SessionId"];
                if (sessionId == null)
                {
                    sessionId = new HttpCookie("SessionId", Guid.NewGuid().ToString());
                }
                this.Response.SetCookie(sessionId);
            }
        }
    }
}