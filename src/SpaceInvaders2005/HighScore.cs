using System;
using System.Drawing;
using System.IO;

namespace SpaceInvaders
{
	/// <summary>
	/// Summary description for HighScore.
	/// </summary>
	public class HighScore : Score
	{
		public HighScore(int x, int y) : base(x, y)
		{
			//
			// TODO: Add constructor logic here
			//
		}

		public override void Draw(Graphics g)
		{
				g.DrawString("High Score: " + Count.ToString(), MyFont, Brushes.LimeGreen, Position.X, Position.Y, new StringFormat());
		}

		public void Write(int theScore)
		{
			Read();
			if (Count < theScore)
			{
				Count = theScore;
				StreamWriter sw = new StreamWriter("highscore.txt", false);
				sw.WriteLine(Count.ToString());
				sw.Close();
			}
		}


		public void Read()
		{
		  if (File.Exists("highscore.txt"))
		  {
			StreamReader sr = new StreamReader("highscore.txt");
			string score = sr.ReadLine();
			Count = Convert.ToInt32(score);
			sr.Close();
		  }
		}

	}
}
