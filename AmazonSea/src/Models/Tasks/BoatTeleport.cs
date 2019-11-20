namespace Models
{
    public class BoatTeleport : BoatTask
    {
        private Point point;
        public BoatTeleport(Point point)
        {
            this.point = point;
        }
        public void StartTask(Boat t)
        {
            t.Move(point.x, point.y, point.z);
        }

        public bool TaskComplete(Boat t)
        {
            // moves the boat to a chosen point
            return t.x == point.x && t.y == point.y && t.z == point.z;
        }
    }
}