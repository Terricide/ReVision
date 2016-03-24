using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebUI.Common.Resources
{
    public class ImageResourceHandle
    {
        public static Image FromHandle(string fileName)
        {
            if (System.Web.HttpContext.Current == null)
            {
                return null;
            }
            var path = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, "Resources\\Images");
            var filePath = Path.Combine(path, fileName);
            return Image.FromFile(filePath);
        }
    }
}
