using System;
using System.Drawing;

namespace SpaceInvaders
{
	/// <summary>
	/// Summary description for InvaderRow.
	/// </summary>
	public class InvaderRow
	{
		public Invader[] Invaders = new Invader[11];
		public Point LastPosition = new Point(0, 0);
		public const int kBombIntervalSpacing = 50;


		public InvaderRow(string gif1, string gif2, int rowNum)
		{
			//
			// TODO: Add constructor logic here
			//
			for (int i = 0; i < Invaders.Length; i++)
			{
			  Invaders[i] = new Invader(gif1, gif2);
			  Invaders[i].Position.X = i * Invaders[i].GetBounds().Width + 5;
			  Invaders[i].Position.Y = rowNum * Invaders[i].GetBounds().Height + 10;
			  Invaders[i].SetCounter(i*kBombIntervalSpacing);
			}

			LastPosition = Invaders[Invaders.Length - 1].Position;
		}

		public void ResetBombCounters()
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				Invaders[i].ResetBombPosition();
				Invaders[i].SetCounter(i*kBombIntervalSpacing);
			}
		}

		public Invader this [int index]   // indexer declaration
		{
			get 
			{
			  return Invaders[index];
			}
		}


		public void Draw(Graphics g)
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				Invaders[i].Draw(g);
			}
		}

		public int CollisionTest(Rectangle aRect)
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				if ((Invaders[i].GetBounds().IntersectsWith(aRect)) && (!Invaders[i].BeenHit))
					return i;
			}

			return -1;
		}

		public bool DirectionRight
		{
			set
			{
				for (int i = 0; i < Invaders.Length; i++)
				{
					Invaders[i].DirectionRight = value;
				}
			}
		}

		public void Move()
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				Invaders[i].Move();
			}

			if (Invaders[0].DirectionRight)
				LastPosition = Invaders[Invaders.Length - 1].Position;
			else
				LastPosition = Invaders[0].Position;

		}

		public void MoveInPlace()
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				Invaders[i].MoveInPlace();
			}

		}


		public Invader GetFirstInvader()
		{
			int count = 0;
			Invader TheInvader  = Invaders[count];
			while ((TheInvader.BeenHit == true) && (count < Invaders.Length-1))
			{
			  count++;
			  TheInvader = Invaders[count];
			}

			return TheInvader;
		}

		public Invader GetLastInvader()
		{
			int count = Invaders.Length - 1;
			Invader TheInvader  = Invaders[count];
			while ((TheInvader.BeenHit == true) && (count > 0))
			{
				count--;
				TheInvader = Invaders[count];
			}

			return TheInvader;
		}

		public int NumberOfLiveInvaders()
		{
			int count = 0;
			for (int i = 0; i < Invaders.Length; i++)
			{
				 if (Invaders[i].Died == false)
					 count++;
			}

			return count;
		}

		public bool AlienHasLanded(int bottom)
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
			  if ( (Invaders[i].GetBounds().Bottom >= bottom) &&
				   (Invaders[i].BeenHit = false))
				  return true;
			}

			return false;
		
		}

		public void MoveDown()
		{
			for (int i = 0; i < Invaders.Length; i++)
			{
				Invaders[i].Position.Y += Invaders[i].GetBounds().Height/8;
				Invaders[i].UpdateBounds();
			}
		}


	}
}
