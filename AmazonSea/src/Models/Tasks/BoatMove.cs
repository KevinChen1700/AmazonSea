namespace Models{
    public class BoatMove : BoatTask{
        private Point point;
        public BoatMove(Point point){
            this.point = point;
        }
        public void StartTask(Boat t)
        {
            t.Move(point);
        }

        public bool TaskComplete(Boat t)
        {
            if(t.x == point.x && t.y == point.y && t.z == point.z){
                return true;
            }
            return false;
        }
    }
}