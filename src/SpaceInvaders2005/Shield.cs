using System;
using System.Drawing;
using System.Collections;

namespace SpaceInvaders
{
	/// <summary>
	/// Summary description for Shield.
	/// </summary>
	public class Shield : GameObject
	{
		private ArrayList BulletHoles = new ArrayList(50);
		public Shield(): base("shield.gif")
		{
			//
			// TODO: Add constructor logic here
			//
		}

		public override void Draw(Graphics g)
		{
			base.Draw(g);
			foreach(Rectangle r in BulletHoles)
			{
				g.FillRectangle(Brushes.Black, r);
			}
		}

		public void AddBulletHole(Rectangle r, bool dir)
		{
		  Rectangle rup = r;
		  rup.Inflate(r.Width/4, -r.Height/4);

			if (dir == true)
			{
				rup.Offset(0, -r.Height/2);
			}
			else
			{
	//			rup.Offset(0, r.Height/2);
				rup.Height += 20;

				// make sure the whole top part of the shield is clear
				if ((rup.Y - Position.Y) <= 20)
				{
				  rup.Y = Position.Y;
				  rup.Height += 5;
				}
			}

		  BulletHoles.Add(rup);
		}

		private bool CheckBulletHoleIntersection(Rectangle rTest, bool dirDown)
		{
			Rectangle rTest1 = rTest;

			// thin out bullet for test
			rTest1.X += rTest1.Width/2;
			rTest1.Width = 3;

			foreach(Rectangle r in BulletHoles)
			{
				if (rTest1.IntersectsWith(r))
				{
					return true;
				}
			}

			return false;
		}

		public bool TestCollision(Rectangle r, bool directionDown, out bool bulletHole)
		{
			bulletHole = false;

			if (CheckBulletHoleIntersection(r, directionDown))
			{
				bulletHole = true;
				return false;  // doesn't count as a collision
			}

			if (r.IntersectsWith(MovingBounds))
			{
			  AddBulletHole(r, directionDown);
			  return true;
			}

			return false;
		}


	}
}
