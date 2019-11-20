using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Models
{
    public class Chest : Model3D, IUpdatable
    {
        private Point _point;
        public Point point { get { return _point; } }
        public Chest(decimal x, decimal y, decimal z, decimal rotationX, decimal rotationY, decimal rotationZ)
        {
            this.type = "chest";
            this.guid = Guid.NewGuid();

            this._x = x;
            this._y = y;
            this._z = z;

            this._rX = rotationX;
            this._rY = rotationY;
            this._rZ = rotationZ;
        }

        public Chest(Point point)
        {
            this.type = "chest";
            this.guid = Guid.NewGuid();
        
            this._x = point.x;
            this._y = point.y;
            this._z = point.z;
            
            this._point = point;
            point.AddChest(this);
        }

        public void AssignPoint(Point point){
            this._point = point;
        }
    }
}