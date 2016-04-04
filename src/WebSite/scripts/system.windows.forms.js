"use strict";

class Component {

}

class Control extends Component {

    constructor(element) {
        super();
        this.Text = '';
        this.Element = document.createElement('div');
    }

    render(obj) {
        this.Location = new Point(obj.Location.x, obj.Location.y);
        //this.Element.style.top = obj.Location.x;
        //this.Element.style.left = obj.Location.y;
        this.Element.innerText = this.Text;
    }
}

class Button extends Control {

    constructor() {
        super();
        this.Element = document.createElement('button');
    }

    render(obj) {
        super.render(obj);

    }
}

class Point {

    constructor(x, y) {
        if (x == undefined) {
            this.x = 0;
        } else {
            this.x = x;
        }
        if (y == undefined) {
            this.y = 0;
        } else {
            this.y = y;
        }   
    }
}

class Size {

    constructor(width, height) {
        if (width == undefined) {
            this.width = 0;
        } else {
            this.width = width;
        }
        if (height == undefined) {
            this.height = 0;
        } else {
            this.height = height;
        }   
    }
}