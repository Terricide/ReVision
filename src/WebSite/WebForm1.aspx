<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="WebSite.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="./scripts/jquery-2.2.2.js"></script>
    <script type="text/javascript" src="scripts/system.windows.forms.js"></script>
    <script>
        $().ready(function () {
            var btn = new Button();
            btn.Text = "hello world";
            var root = document.getElementById('root');
            btn.render({
                Location: {
                    x: 0,
                    y: 100
                }
            });
            root.appendChild(btn.Element);
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="root" />
    </form>
</body>
</html>
