using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReVision.Forms.JsonConverters
{
    public class SizeConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Point);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            Size img = (Size)value;
            writer.WriteStartObject();
            writer.WritePropertyName("width");
            writer.WriteValue(img.Width);
            writer.WritePropertyName("height");
            writer.WriteValue(img.Height);
            writer.WriteEndObject();
            writer.Flush();
        }
    }
}
