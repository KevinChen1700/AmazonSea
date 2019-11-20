using System.Linq;

namespace Models
{
    public class BoatDump : BoatTask
    {
        Point point;
        public BoatDump(Point point)
        {
            this.point = point;
        }
        public void StartTask(Boat t)
        {
            if (point.chest == null)
            {
                t.RemoveChest(point);
            }
        }

        public bool TaskComplete(Boat t)
        {
            // places the chests to the assigned points untill there are not chest left on the boat
            return !t.chests.Any();
        }
    }
}