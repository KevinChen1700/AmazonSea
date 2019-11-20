namespace Models
{
    public interface BoatTask
    {
        void StartTask(Boat t);
        bool TaskComplete(Boat t);
    }
}