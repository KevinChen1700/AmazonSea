namespace Models
{
    public class RobotDropOff : RobotTask
    {
        Boat boat;
        Point point;

        public RobotDropOff(Boat t)
        {
            boat = t;
            point = null;
        }

        public RobotDropOff(Point p)
        {
            boat = null;
            point = p;
        }
        public void StartTask(Robot r)
        {
            if (boat != null && boat.loadable)
            {
                r.RemoveChest(boat);
            }
            else if (point != null)
            {
                r.RemoveChest(point);
            }
        }
        public bool TaskComplete(Robot r)
        {
            return r.chest == null;
        }
    }
}