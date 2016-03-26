using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReVision.Forms
{
    public class TaskAsyncHelper
    {
        private static readonly Task _emptyTask = MakeTask<object>(null);
        public static Task Empty
        {
            get
            {
                return _emptyTask;
            }
        }

        private static Task<T> MakeTask<T>(T value)
        {
            return FromResult<T>(value);
        }

        public static Task<T> FromResult<T>(T value)
        {
            var tcs = new TaskCompletionSource<T>();
            tcs.SetResult(value);
            return tcs.Task;
        }
    }
}
