var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var System;
(function (System) {
    var Windows;
    (function (Windows) {
        var Forms;
        (function (Forms) {
            var Component = (function () {
                function Component() {
                }
                return Component;
            }());
            Forms.Component = Component;
            var Control = (function (_super) {
                __extends(Control, _super);
                function Control(obj) {
                    _super.call(this);
                    this.BaseObj = obj;
                }
                Object.defineProperty(Control.prototype, "Width", {
                    get: function () {
                        return this.Size.Width;
                    },
                    set: function (width) {
                        this.Size.Width = width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Control.prototype, "Height", {
                    get: function () {
                        return this.Size.Height;
                    },
                    set: function (height) {
                        this.Size.Height = height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Control.prototype.Init = function () {
                    this.Element.style.top = this.Location.X + "px";
                    this.Element.style.left = this.Location.Y + "px";
                };
                Control.prototype.Render = function () {
                    for (var _i = 0, _a = this.Controls; _i < _a.length; _i++) {
                        var ctrl = _a[_i];
                        ctrl.Render();
                    }
                };
                return Control;
            }(Component));
            Forms.Control = Control;
            var Button = (function (_super) {
                __extends(Button, _super);
                function Button(obj) {
                    _super.call(this, obj);
                    this.Element = document.createElement("button");
                    this.Init();
                }
                Button.prototype.Init = function () {
                    _super.prototype.Init.call(this);
                };
                return Button;
            }(Control));
            Forms.Button = Button;
        })(Forms = Windows.Forms || (Windows.Forms = {}));
    })(Windows = System.Windows || (System.Windows = {}));
})(System || (System = {}));
var System;
(function (System) {
    var Drawing;
    (function (Drawing) {
        var Point = (function () {
            function Point(x, y) {
                this.X = x;
                this.Y = y;
            }
            return Point;
        }());
        Drawing.Point = Point;
        var Size = (function () {
            function Size(width, height) {
                this.Width = width;
                this.Height = height;
            }
            return Size;
        }());
        Drawing.Size = Size;
    })(Drawing = System.Drawing || (System.Drawing = {}));
})(System || (System = {}));
//# sourceMappingURL=test.js.map