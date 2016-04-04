namespace System.Windows.Forms {
    export class Component {

    }

    export class Control extends Component {
        constructor(obj) {
            super();
            this.BaseObj = obj;
        }
        public Controls: Control[];
        public Parent: Control;
        public BaseObj;
        public Element: HTMLElement;
        public Location: System.Drawing.Point;
        public Size: System.Drawing.Size;
        public get Width() {
            return this.Size.Width;
        }
        public set Width(width: number) {
            this.Size.Width = width;
        }
        public get Height() {
            return this.Size.Height;
        }
        public set Height(height: number) {
            this.Size.Height = height;
        }
        public Init() {
            this.Element.style.top = this.Location.X + "px";
            this.Element.style.left = this.Location.Y + "px";
        }
        public Render() {
            for (var ctrl of this.Controls)
            {
                ctrl.Render();
            }
        }
    }

    export class Button extends Control {
        constructor(obj) {
            super(obj);
            this.Element = document.createElement("button");
            this.Init();
        }

        public Init() {
            super.Init();
        }
    }
}

namespace System.Drawing {
    export class Point {
        constructor(x: number, y: number) {
            this.X = x;
            this.Y = y;
        }
        public X: number;
        public Y: number;
    }
    export class Size {
        constructor(width: number, height: number) {
            this.Width = width;
            this.Height = height;
        }
        public Width: number;
        public Height: number;
    }
}