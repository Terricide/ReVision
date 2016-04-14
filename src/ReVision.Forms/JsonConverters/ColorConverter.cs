using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReVision.Forms.JsonConverters
{
    public class ColorConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Color);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            Color img = (Color)value;
            writer.WriteValue(ToHexValue(img));
            writer.Flush();
        }

        public string ToHexValue(Color color)
        {
            if (color.Name == "0")
            {
                return null;
            }

            if (color.Name == "Transparent")
            {
                return ColorTranslator.ToHtml(color);
            }

            var retVal =  "#" + color.R.ToString("X2") +
                         color.G.ToString("X2") +
                         color.B.ToString("X2");

            return retVal;
        }
    }
}
