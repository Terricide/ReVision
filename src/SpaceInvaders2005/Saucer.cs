using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;

namespace SpaceInvaders 
{
	/// <summary>
	/// Summary description for Saucer.
	/// </summary>
	public class Saucer : GameObject
	{
		private Image OtherImage1 = null;
		private Image OtherImage2 = null;


		public bool BeenHit = false;

		public int CountExplosion = 0;

		public bool Died = false;

		private int rseed = (int)DateTime.Now.Ticks;
		private Random RandomNumber = null;


		public bool DirectionRight = true;

		private const int kInterval = 10;
		private long Counter = 0;

		public Saucer(string i1, string i2, string i3) : base(i1)
		{
			//
			// TODO: Add constructor logic here
			//
			OtherImage1 = Image.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, i2));
			OtherImage2 = Image.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, i3));

			RandomNumber = new Random(rseed);

			Position.X = 20;
			Position.Y = 10;
			UpdateBounds();
		}

		public void Reset()
		{
			Position.X = 20;
			Died = false;
			BeenHit = false;
			ScoreCalculated = false;
			CountExplosion = 0;
			UpdateBounds();
		}

		public override void Draw(Graphics g)
		{
			UpdateBounds();

			if (BeenHit)
			{
				DrawExplosion(g);
				DrawNumber(g);
				return;
			}

			if (Counter % 3 == 0)
				g.DrawImage(TheImage, MovingBounds, 0, 0, ImageBounds.Width, ImageBounds.Height, GraphicsUnit.Pixel);
			else if (Counter % 3 == 1)
				g.DrawImage(OtherImage1, MovingBounds, 0, 0, ImageBounds.Width, ImageBounds.Height, GraphicsUnit.Pixel);
			else 
				g.DrawImage(OtherImage2, MovingBounds, 0, 0, ImageBounds.Width, ImageBounds.Height, GraphicsUnit.Pixel);
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

			Position.X += kInterval;

			Counter ++;
		}

		public int ScoreValue = 50;
		public bool ScoreCalculated = false;
		public int CalculateScore()
		{
				Random RandomScore = new Random((int)DateTime.Now.Ticks);
				ScoreValue = RandomScore.Next(1, 4) * 50;
				return ScoreValue;
		}

		public void DrawNumber(Graphics g)
		{
			if (Died == true)
				return;

			g.DrawString(ScoreValue.ToString(), new Font("Ariel", 14, FontStyle.Bold), Brushes.White, MovingBounds, new StringFormat());
		}


	}
}
