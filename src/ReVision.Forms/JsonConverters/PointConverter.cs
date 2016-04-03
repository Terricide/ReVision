using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReVision.Forms.JsonConverters
{
    public class PointConverter : JsonConverter
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
            Point img = (Point)value;
            writer.WriteStartObject();
            writer.WritePropertyName("x");
            writer.WriteValue(img.X);
            writer.WritePropertyName("y");
            writer.WriteValue(img.Y);
            writer.WriteEndObject();
            writer.Flush();
        }
    }
}
