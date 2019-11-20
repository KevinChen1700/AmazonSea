using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Models
{
    public class Boat : Model3D, IUpdatable
    {
        private List<Chest> _chests;
        public List<Chest> chests { get { return _chests; } }

        private List<BoatTask> tasks = new List<BoatTask>();

        private bool _loadable;
        public bool loadable { get { return _loadable; } }

        public Boat(decimal x, decimal y, decimal z, decimal rotationX, decimal rotationY, decimal rotationZ)
        {
            this.type = "boat";
            this.guid = Guid.NewGuid();

            this._x = x;
            this._y = y;
            this._z = z;

            this._rX = rotationX;
            this._rY = rotationY;
            this._rZ = rotationZ;

            this._chests = new List<Chest>();
            this._loadable = false;
        }

        public Boat(Point point)
        {
            this.type = "boat";
            this.guid = Guid.NewGuid();

            this._x = point.x;
            this._y = point.y;
            this._z = point.z;

            this._chests = new List<Chest>();
            this._loadable = false;
        }
        public void AddChest(Chest chest)
        {
            _chests.Add(chest);
            chest.AssignPoint(null);
            chest.Move(this.x, this.y + 0.2m, this.z);
        }

        public void RemoveChest(Robot r)
        {
            if (_chests.Last() != null && r.chest == null)
            {
                r.AssignChest(_chests.Last());
                _chests.Remove(_chests.Last());
            }
        }
        public void RemoveChest(Point point)
        {
            if (_chests.Last() != null && point.chest == null)
            {
                point.AddChest(_chests.Last());
                _chests.Remove(_chests.Last());
            }
        }
        public void SwitchLoadable()
        {
            if (loadable == false)
            {
                this._loadable = true;
            }
            else
            {
                this._loadable = false;
            }
        }
        public void Move(Point point)
        {
            if (this.x < point.x)
            {
                this.Move(this.x + 0.2m, this.y, this.z);
            }
            else if (this.x > point.x)
            {
                this.Move(this.x - 0.2m, this.y, this.z);
            }

            if (this.z < point.z)
            {
                this.Move(this.x, this.y, this.z + 0.2m);
            }
            else if (this.z > point.z)
            {
                this.Move(this.x, this.y, this.z - 0.2m);
            }

            if (_chests != null)
            {
                foreach (Chest chest in _chests)
                {
                    chest.Move(this.x, this.y + 0.4m, this.z);
                }
            }
        }

        public void AddTask(BoatTask task)
        {
            tasks.Add(task);
        }

        public override bool Update(int tick)
        {
            if (tasks != null && tasks.Any())
            {
                if (tasks.First().TaskComplete(this))
                {
                    tasks.RemoveAt(0);

                    if (tasks.Count == 0)
                    {
                        tasks = null;
                    }
                }
                if (tasks != null)
                {
                    tasks.First().StartTask(this);
                }
            }
            return base.Update(tick);
        }
    }
}