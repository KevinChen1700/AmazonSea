using System;
using System.Collections.Generic;
using System.Linq;
using Controllers;

namespace Models
{
    public class World : IObservable<Command>, IUpdatable
    {
        private List<Model3D> worldObjects = new List<Model3D>();
        private List<IObserver<Command>> observers = new List<IObserver<Command>>();
        private Graph pointGraph;
        private Graph boatGraph;

        // locations for the boat, robots and chest
        public World()
        {
            Point a = new Point(-20, 0, 0);
            Point b = new Point(-10, 0, 0);
            Point c = new Point(-10, 0, 10);
            Point d = new Point(0, 0, 10);
            Point e = new Point(10, 0, 10);
            Point f = new Point(10, 0, 0);
            Point g = new Point(10, 0, -10);
            Point h = new Point(0, 0, -10);
            Point i = new Point(-10, 0, -10);
            Point j = new Point(0, 0, 0);

            Point tA = new Point(-20, 0, -50);
            Point tB = new Point(-20, 0, 0);
            Point tC = new Point(-20, 0, 50);

            a.AddNode(b);
            b.AddNode(new List<Point>() { c, i });
            c.AddNode(d);
            d.AddNode(new List<Point>() { e, j });
            e.AddNode(f);
            f.AddNode(g);
            h.AddNode(new List<Point>() { i, j, g });

            tB.AddNode(new List<Point>() { tA, tB });

            List<Point> pointList = new List<Point>() { a, b, c, d, e, f, g, h, i, j };
            pointGraph = new Graph((pointList));

            boatGraph = new Graph(new List<Point>() { tA, tB, tC });

            Robot robot1 = CreateRobot(a);
            Robot robot2 = CreateRobot(a);
            Robot robot3 = CreateRobot(a);

            Chest chest1 = CreateChest(e);
            Chest chest2 = CreateChest(i);
            Chest chest3 = CreateChest(j);
            Chest chest4 = CreateChest(g);
            Chest chest5 = CreateChest(b);
            Chest chest6 = CreateChest(c);

            Boat t = CreateBoat(tA);

            robot1.AddTask(new RobotMove(pointGraph, chest1.point));
            robot2.AddTask(new RobotMove(pointGraph, chest2.point));
            robot3.AddTask(new RobotMove(pointGraph, chest3.point));

            int counter = 3;

            foreach (Model3D r in worldObjects)
            {
                if (r is Robot)
                {
                    ((Robot)r).AddTask(new RobotPickUp());
                    ((Robot)r).AddTask(new RobotMove(pointGraph, a));
                    ((Robot)r).AddTask(new RobotDropOff(t));
                    ((Robot)r).AddTask(new RobotPickUp());
                    ((Robot)r).AddTask(new RobotMove(pointGraph, pointList[counter]));
                    ((Robot)r).AddTask(new RobotDropOff(pointList[counter]));
                    counter++;
                    ((Robot)r).AddTask(new RobotMove(pointGraph, a));
                }
            }
            t.AddTask(new BoatMove(tB));
            t.AddTask(new BoatLoad());
            t.AddTask(new BoatMove(tC));
            t.AddTask(new BoatTeleport(tA));
            t.AddTask(new BoatMove(tB));
            t.AddTask(new BoatDump(a));
            t.AddTask(new BoatMove(tC));
        }

        private Robot CreateRobot(decimal x, decimal y, decimal z)
        {
            Robot r = new Robot(x, y, z, 0, 0, 0);
            worldObjects.Add(r);
            return r;
        }
        
        //places a robot at a specific point
        private Robot CreateRobot(Point p)
        {
            Robot r = new Robot(p);
            worldObjects.Add(r);
            return r;
        }

        private Chest CreateChest(decimal x, decimal y, decimal z)
        {
            Chest r = new Chest(x, y, z, 0, 0, 0);
            worldObjects.Add(r);
            return r;
        }

        private Chest CreateChest(Point p)
        {
            Chest r = new Chest(p);
            worldObjects.Add(r);
            return r;
        }

        private Boat CreateBoat(Point p)
        {
            Boat r = new Boat(p);
            worldObjects.Add(r);
            return r;
        }
        public IDisposable Subscribe(IObserver<Command> observer)
        {
            if (!observers.Contains(observer))
            {
                observers.Add(observer);

                SendCreationCommandsToObserver(observer);
            }
            return new Unsubscriber<Command>(observers, observer);
        }

        private void SendCommandToObservers(Command c)
        {
            for (int i = 0; i < this.observers.Count; i++)
            {
                this.observers[i].OnNext(c);
            }
        }

        private void SendCreationCommandsToObserver(IObserver<Command> obs)
        {
            foreach (Model3D m3d in worldObjects)
            {
                obs.OnNext(new UpdateModel3DCommand(m3d));
            }
        }

        public bool Update(int tick)
        {
            for (int i = 0; i < worldObjects.Count; i++)
            {
                Model3D u = worldObjects[i];

                if (u is IUpdatable)
                {
                    bool needsCommand = ((IUpdatable)u).Update(tick);

                    if (needsCommand)
                    {
                        SendCommandToObservers(new UpdateModel3DCommand(u));
                    }
                }
            }
            return true;
        }
    }

    internal class Unsubscriber<Command> : IDisposable
    {
        private List<IObserver<Command>> _observers;
        private IObserver<Command> _observer;

        internal Unsubscriber(List<IObserver<Command>> observers, IObserver<Command> observer)
        {
            this._observers = observers;
            this._observer = observer;
        }

        public void Dispose()
        {
            if (_observers.Contains(_observer))
                _observers.Remove(_observer);
        }
    }
}