using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;

namespace SpaceInvaders
{
    class LivesIndicator : GameObject
    {
        public const int MAX_LIVES = 3;

        int _numberOfLives = MAX_LIVES;
        Font LivesFont = new Font("Compact", 20.0f);
        
        public LivesIndicator(int x, int y) : base("man.gif")
        {
            this.Position = new Point(x, y);
        }

        public void DecrementLives()
        {
            _numberOfLives--;
        }

        public override void Draw(System.Drawing.Graphics g)
        {
            g.DrawString("LIVES", LivesFont, Brushes.White, Position);

            if (_numberOfLives > 0)
            {
                g.DrawImage(TheImage, Position.X + 100, Position.Y, TheImage.Width * 2 / 3, TheImage.Height * 2 / 3);
            }

            if (_numberOfLives > 1)
            {
                g.DrawImage(TheImage, Position.X + 104 + TheImage.Width * 2 / 3, Position.Y, TheImage.Width * 2 / 3, TheImage.Height * 2 / 3);
            }

            if (_numberOfLives > 2)
            {
                g.DrawImage(TheImage, Position.X + 108 + 2 * TheImage.Width * 2 / 3, Position.Y, TheImage.Width * 2 / 3, TheImage.Height * 2 / 3);
            }
        }
    }
}
