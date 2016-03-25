# ReVision

Hi this is a project to replace VisualWebGUI if that project dies and isn't made open source. The goal is to make a library that could be a drop in replacement for VisualWebGUI and allow you use to use WinForms for web projects.

For the designer to work you need to link from the WebSite project to the WindowsFormLib project any new files. There are automatic project linkers you can download to use


https://gitter.im/Terricide/ReVision?utm_source=share-link&utm_medium=link&utm_campaign=share-link


Potential help setting up project to work

Hi,

To summarize my experience with the reference errors and IIS I also encountered:

Using VS 2013, I first accepted the prompt to target .NET Framework 4.5 (instead of 4.6.1 which I do not have installed) in 3 out of the 4 projects (see later for the 4th one)
When trying to build, I had 67 errors coming mainly from not being able to find System.Windows.Forms namespace ("Forms" part was underlined)
Website project referenced WindowsFormsLib, which I removed according to Mark's instruction above.
ReVision.Forms reference had a yellow triangle next to it. It turned out that this was from the fact that this project was targeting .NET 4.5.1, while the project that was using it (WebSite) had been converted to target 4.5. Visual Studio had NOT prompt me to change the target of ReVision project cause it was targeting originally 4.5.1 which is installed in my machine. Changing the target to 4.5 made the triangle disappear. Lesson learned: if converting to previous version of Visual Studio, make sure the projects target consistent .NET Framework versions.
After that the rebuild worked correctly.

However, I get an empty default.aspx page and two prompts from Google Chrome, 1. undefined and 2. disconnected.

Check my IIS installation... I have a Windows 10 machine (ugraded from win 7). According to my registry key HKLM\SOftware\Microsoft\InetStr\VersionString my IIS Version is 10.0. Went to Features and Programs and checked Windows components and IIS I checked the WebSockets protocol to install the feature.

And... voila!!! The default.aspx page shows up correctly.!

Hope this helps some people.

Best wishes for everybody having a holiday this weekend...

Alex
