using System.Linq;

namespace Models
{
    public class BoatLoad : BoatTask
    {
        public void StartTask(Boat t)
        {
            t.SwitchLoadable();
        }

        public bool TaskComplete(Boat t)
        {
            if(t.chests.Any() && t.loadable){
                t.SwitchLoadable();
            }

            //the boat leaves when there are 3 chest loaded into it
            return t.chests.Count == 3;
        }
    }
}