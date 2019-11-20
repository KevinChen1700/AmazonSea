using System;
using System.Collections.Generic;
using System.Linq;

namespace Models
{
    public class RobotPickUp : RobotTask
    {
        public void StartTask(Robot r)
        {
            if (r.currentPoint.chest != null && r.chest == null)
            {
                r.AssignChest(r.currentPoint.chest);
                r.currentPoint.chest.AssignPoint(null);
                r.currentPoint.AddChest(null);
            }
        }

        public bool TaskComplete(Robot r)
        {
            if (r.chest != null)
            {
                return r.chest != null;
            }
            return false;
        }
    }
}