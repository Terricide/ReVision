using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;

namespace SpaceInvaders 
{
	/// <summary>
	/// Summary description for Invader.
	/// </summary>
	public class Invader : GameObject
	{
		private Image OtherImage = null;

		private const int kBombInterval = 200;

		private Bomb TheBomb = new Bomb(0, 0);

		private bool ActiveBomb = false;

		public bool BeenHit = false;

		public int CountExplosion = 0;

		public bool Died = false;

		private int rseed = (int)DateTime.Now.Ticks;
		private Random RandomNumber = null;


		public bool DirectionRight = true;

		private const int kInterval = 10;
		private long Counter = 0;

		public Invader(string i1, string i2) : base(i1)
		{
            //
            // TODO: Add constructor logic here
            //
            OtherImage = Image.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, i2));

			RandomNumber = new Random(rseed);

			Position.X = 20;
			Position.Y = 10;
			UpdateBounds();
		}

		public override void Draw(Graphics g)
		{
			UpdateBounds();

			if (BeenHit)
			{
				DrawExplosion(g);
				return;
			}

			if (Counter % 2 == 0)
				g.DrawImage(TheImage, MovingBounds, 0, 0, ImageBounds.Width, ImageBounds.Height, GraphicsUnit.Pixel);
			else
				g.DrawImage(OtherImage, MovingBounds, 0, 0, ImageBounds.Width, ImageBounds.Height, GraphicsUnit.Pixel);

			if (ActiveBomb)
			{
			  TheBomb.Draw(g);
				if (Form1.ActiveForm != null)
				{
					if (TheBomb.Position.Y > Form1.ActiveForm.ClientRectangle.Height)
					{
						ActiveBomb = false;
					}
				}
			}


			if ((ActiveBomb == false) && (Counter % kBombInterval == 0))
			{
				ActiveBomb = true;
				TheBomb.Position.X = MovingBounds.X + MovingBounds.Width/2;
				TheBomb.Position.Y = MovingBounds.Y + 5;
			}

		}

		public void SlowBomb()
		{
//		  TheBomb.TheBombInterval = 2;
		}


		public void ResetBombPosition()
		{
			TheBomb.Position.X = MovingBounds.X + MovingBounds.Width/2;
			TheBomb.ResetBomb(MovingBounds.Y + 5);
		}

		public void SetCounter(long lCount)
		{
			Counter = lCount;
		}

		public void DrawExplosion(Graphics g)
		{

			if (Died)
				return;

			CountExplosion++;
			if (CountExplosion < 15)
			{
				for (int i = 0; i < 50; i++)
				{
					int xval = RandomNumber.Next(MovingBounds.Width);
					int yval = RandomNumber.Next(MovingBounds.Height);
					xval += Position.X;
					yval += Position.Y;
					g.DrawLine(Pens.White, xval, yval, xval, yval+1);
				}
			}
			else
			{
				Died = true;
			}
		}

		public void Move()
		{
			if (BeenHit)
				return;

			if (DirectionRight)
			{
				Position.X += kInterval;
			}
			else
			{
			    Position.X -=kInterval;
			}

			Counter ++;
		}

		public void MoveInPlace()
		{
			Counter ++;
		}

		public Rectangle GetBombBounds()
		{
		  return TheBomb.GetBounds();
		}

		public bool IsBombColliding(Rectangle r)
		{
			if (ActiveBomb && TheBomb.GetBounds().IntersectsWith(r))
			{
			  return true;
			}

			return false;
		}

	}
}
