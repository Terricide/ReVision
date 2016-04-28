using System.Drawing;
using System.Drawing.Drawing2D;

namespace SpaceInvaders
{
	/// <summary>
	/// Summary description for Bomb.
	/// </summary>
	public class Bomb : GameObject
	{
		public const int kBombInterval = 5;
		public int TheBombInterval = kBombInterval;
        Pen BombPen;

		public Bomb(int x, int y)
		{
			ImageBounds.Width = 5;
			ImageBounds.Height = 15;
			Position.X = x;
			Position.Y = y;
            CreateBombInPath();
            CreateBombOutPath();

            BombPen = new Pen(Color.White, 2);
            BombPen.DashStyle = DashStyle.DashDot;

		}

        GraphicsPath bombIn = new GraphicsPath();
        GraphicsPath bombOut = new GraphicsPath();
        GraphicsPath bombInTransformed = new GraphicsPath();
        GraphicsPath bombOutTransformed = new GraphicsPath();

        void CreateBombInPath()
        {
            float width = 5;
            float height = 15;
            float seg = height / 3;
            bombIn.AddLine(new PointF(0, 0), new PointF(width, seg));
            bombIn.AddLine(new PointF(width, seg), new PointF(0, seg * 2));
            bombIn.AddLine(new PointF(0, seg * 2), new PointF(width, seg * 3));
        }

        void CreateBombOutPath()
        {
            float width = 5;
            float height = 15;
            float seg = height / 3;
            bombOut.AddLine(new PointF(width, 0), new PointF(0, seg));
            bombOut.AddLine(new PointF(0, seg), new PointF(width, seg * 2));
            bombOut.AddLine(new PointF(width, seg * 2), new PointF(0, seg * 3));
        }


        bool _invert = false;

        /// <summary>
        /// This routine draws the animated bomb
        /// using two toggling graphics paths
        /// giving the effect of a spinning bomb
        /// </summary>
        /// <param name="g"></param>
		public override void Draw(Graphics g)
		{
			UpdateBounds();
            Matrix m = new Matrix();

            m.Translate(MovingBounds.Left, MovingBounds.Top);
			// g.FillRectangle(Brushes.White , MovingBounds);
            if (_invert)
            {

                bombInTransformed = (GraphicsPath)bombIn.Clone();
                bombInTransformed.Transform(m);
                g.DrawPath(BombPen, bombInTransformed);
                bombInTransformed.Dispose();
            }
            else 
            {
                bombOutTransformed = (GraphicsPath)bombOut.Clone();
                bombOutTransformed.Transform(m);
                g.DrawPath(BombPen, bombOutTransformed);
                bombOutTransformed.Dispose();
            }
 
  /*          Matrix flipMatrix = new Matrix();
            flipMatrix.Scale(-1.0f, 1.0f);

            m.Translate(MovingBounds.Left, MovingBounds.Top);

            if (_invert)
            {
                m.Scale(-1, 1);  // flip around the y axis
            }

            // g.FillRectangle(Brushes.White , MovingBounds);
                bombInTransformed = (GraphicsPath)bombIn.Clone();
                bombInTransformed.Transform(m);

                g.DrawPath(BombPen, bombInTransformed);
                bombInTransformed.Dispose();
*/

            _invert = !_invert;

//            g.DrawPolygon(Pens.White, new PointF[]{new PointF(Position.X, Position.Y),
//                                                   new PointF(Position.X + width, Position.Y + seg),
//                                                   new PointF(Position.X, Position.Y + seg*2),
//                                                    new PointF(Position.X + 3, Position.Y + seg*3)});


			Position.Y += TheBombInterval;
		}

		public void ResetBomb(int yPos)
		{
		  Position.Y = yPos;
		  TheBombInterval = kBombInterval;
		  UpdateBounds();
		}


	}
}
