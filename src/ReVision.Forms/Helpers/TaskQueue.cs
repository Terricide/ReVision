using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReVision.Forms
{

    public class TaskQueue
    {
        public void Enqueue(Task task)
        {
            lock (lockObject)
            {
                if (Busy)
                {
                    _q.Enqueue(task);
                }
                else
                {
                    Busy = true;
                    task.Start();
                    task.ContinueWith((t) =>
                    {
                        NextTask();
                    });
                }
            }
        }

        private static Queue<Task> _q = new Queue<Task>();

        private static bool Busy = false;
        private static object lockObject = new object();

        public TaskQueue()
        {

        }

        private void NextTask()
        {
            lock (lockObject)
            {
                if (_q.Count > 0)
                {
                    var task = _q.Dequeue();
                    task.Start();
                    task.ContinueWith((t) =>
                    {
                        NextTask();
                    });
                }
                else
                {
                    Busy = false;
                }
            }
        }
    }
}
