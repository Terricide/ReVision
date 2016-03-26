# ReVision

Hi this is a project to replace VisualWebGUI if that project dies and isn't made open source. The goal is to make a library that could be a drop in replacement for VisualWebGUI and allow you use to use WinForms for web projects.

For the designer to work you need to link from the WebSite project to the WindowsFormLib project any new files. There are automatic project linkers you can download to use


https://gitter.im/Terricide/ReVision?utm_source=share-link&utm_medium=link&utm_campaign=share-link


Note:
If you are planning on using IIS express instead of local IIS make sure it is IIS Express 8 which supports websockets.

Here is an example commit of changing a property so that it can be updated in runtime
https://github.com/Terricide/ReVision/commit/a9b9d8d60e062b76bc093628009f74a03745602a
