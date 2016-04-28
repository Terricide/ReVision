using System;
using System.Drawing;
using System.Drawing.Imaging;

namespace SpaceInvaders
{
	/// <summary>
	/// The score of the game
	/// </summary>
	public class Score
	{
		public int Count = 0;
		public Point Position = new Point(0,0);
		public Font MyFont = new Font("Compact", 24.0f, GraphicsUnit.Pixel );

		public Score(int x, int y)
		{
			// 
			// TODO: Add constructor logic here
			//
			Position.X = x;
			Position.Y = y;
		}


		public bool GameOver = false;

		public virtual void Draw(Graphics g)
		{
			if (GameOver == false)
				g.DrawString("Score: " + Count.ToString(), MyFont, Brushes.LimeGreen, Position.X, Position.Y, new StringFormat());
			else
				g.DrawString("Game Over - Final Score: " + Count.ToString(), MyFont, Brushes.White, Position.X - 100, Position.Y + MyFont.Height + 5, new StringFormat());

		}

		public Rectangle GetFrame()
		{
			Rectangle myRect = new Rectangle(Position.X, Position.Y, (int)MyFont.SizeInPoints*Count.ToString().Length, MyFont.Height);
			return myRect;
		}




		/// <summary>
		/// Resets the score to 0
		/// </summary>
		public void Reset()
		{
			Count = 0;
		}

		/// <summary>
		/// Increments the score by 1
		/// </summary>
		public void Increment()
		{
			Count++;
		}

		public void AddScore(int val)
		{
			Count += val;
		}
	}
}
