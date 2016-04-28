using System;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace SpaceInvaders
{
	/// <summary>
	/// Summary description for Man.
	/// </summary>
	public class Man : GameObject
	{

		private int kInterval = 5;
		public bool Died = false;

		public Man(): base("man.gif")
		{
			Position.X = 200;
			Position.Y = 400;

		}

		public Point GetBulletStart()
		{
		  Point theStart = new Point(
			  MovingBounds.Left + MovingBounds.Width/2,
			  MovingBounds.Top - 10);

			return theStart;
		}

		int CountExplosion = 0;
		Random RandomNumber = new Random((int)DateTime.Now.Ticks);
		public void DrawExplosion(Graphics g)
		{
			CountExplosion++;
			if (CountExplosion < 15)
			{
				for (int i = 0; i < 50; i++)
				{
					int xval = RandomNumber.Next(MovingBounds.Width);
					int yval = RandomNumber.Next(MovingBounds.Height);
					xval += Position.X;
					yval += Position.Y;
					g.DrawLine(Pens.Chartreuse, xval, yval, xval, yval+1);
				}
			}
		}

		public bool BeenHit = false;



		public void MoveLeft()
		{
			Position.X -= kInterval;
			if (Position.X < 0)
				Position.X = 0;
		}

		public void MoveRight(int nLimit)
		{
			Position.X += kInterval;
			if (Position.X > nLimit - Width )
				Position.X = nLimit - Width;
		}

		public override void Draw(Graphics g)
		{
			if (Died)
				return;

			if (BeenHit == false)
			{
				base.Draw(g);
			}
			else
			{
				if (CountExplosion < 15)
					DrawExplosion(g);
				else
					Died = true;
			}
		}

		public void Reset()
		{
			BeenHit = false;
			Died = false;
			CountExplosion = 0;
		}


	}
}
