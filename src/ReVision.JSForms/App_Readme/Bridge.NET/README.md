# ![Bridge.NET - C# to JavaScript Compiler](https://cloud.githubusercontent.com/assets/62210/13193769/bce9470e-d73b-11e5-8fc6-1ab4c8f9218f.png)

[Bridge.NET](http://bridge.net/) is an open source C#-to-JavaScript Compiler.

Compile your C#...

```csharp
Console.WriteLine("Hello, World!");
```

into JavaScript

```javascript
console.log("Hello, World!");
```

## TL;DR

* Read the [Getting Started](http://bridge.net/kb/getting-started/) Knowledge Base article
* Try [Live Bridge](http://live.bridge.net) if you want to just play
* Installation:
  * Add **Bridge.NET** Visual Studio extension, or 
  * Use [NuGet](https://www.nuget.org/packages/bridge) to install into a C# Class Library project (`Install-Package Bridge`)
* The [Attribute Reference](http://bridge.net/kb/attribute-reference/) is important
* Licensed under [Apache License, Version 2.0](LICENSE)
* Need Help? Bridge.NET [Forums](http://forums.bridge.net/) or GitHub [Issues](https://github.com/bridgedotnet/Bridge/issues)
* [@bridgedotnet](twitter.com/bridgedotnet) on Twitter

## Getting Started

A great place to start if you're new to Bridge.NET is reviewing the [Getting Started](http://bridge.net/kb/getting-started/) Knowledge Base article.

The easiest place to see Bridge in action is [Live Bridge](http://live.bridge.net/). 

## Sample

The following code sample demonstrates a simple **App.cs** class that will run automatically on page load and prompt with an `alert` message.

```csharp
using Bridge;
using Bridge.Html5;

namespace Demo
{
    public class App
    {
        [Ready]
        public static void Main()
        {
            // Simple alert() to confirm it's working
            Window.Alert("Success");
        }
    }
} 
```

The C# class above will be compiled into JavaScript and added to **/Bridge/ouput/demo.js** within your project. By default, Bridge will use the Namespace name as the file name. In this case: **demo.js**. There are many options to control the output of your JavaScript files, and the [Attribute Reference](http://bridge.net/kb/attribute-reference/) is an important [Knowledge Base](http://bridge.net/kb/) article to review. 

```javascript
Bridge.define('Demo.App', {
    statics: {
        config: {
            init: function () {
                Bridge.ready(this.main);
            }
        },
        main: function () {
            // Simple alert() to confirm it's working
            window.alert("Success");
        }
    }
}); 
```
## Installation

A full list of installation options available at [bridge.net/download/](http://bridge.net/download/), including full support on Windows, Mac OS and Linux for [Visual Studio Code](https://code.visualstudio.com/) and [Mono Develop](http://www.monodevelop.com/).

### Bridge for Visual Studio

If you're using Visual Studio, the best way to get started is by adding the Bridge.NET for Visual Studio [extension](https://visualstudiogallery.msdn.microsoft.com/dca5c80f-a0df-4944-8343-9c905db84757).

From within Visual Studio, go to the `Tools > Extensions and Updates...`.

![Visual Studio Extensions and Updates](https://cloud.githubusercontent.com/assets/62210/13193691/10876f0a-d73a-11e5-809d-69b090da6769.png)

From the options on the left side, be sure to select **Online**, then search for **Bridge**. Clicking **Download** will install Bridge for Visual Studio. After installation is complete, Visual Studio may require a restart. 

![Bridge for Visual Studio](https://cloud.githubusercontent.com/assets/62210/13193692/10964c46-d73a-11e5-8350-700236c98016.png)

After installation, you will have a new **Bridge.NET** project type. When creating new Bridge enabled projects, select this project type. 
### NuGet

Another option is installation of Bridge into a new **C# Class Library** project using [NuGet](https://www.nuget.org/packages/bridge). Within the NuGet Package Manager, search for **Bridge** and click to install. 

Another NuGet option is installing Bridge via the NuGet Command line. Run the following command:

```
Install-Package Bridge
```

More information regarding  Nuget package installation for Bridge is available in the [Knowledge Base](http://bridge.net/kb/nuget-installation/).

## Contributing

Interested in contributing to Bridge? Please see [CONTRIBUTING.md](https://github.com/bridgedotnet/Bridge/blob/master/.github/CONTRIBUTING.md).

We also flag some Issues as [up-for-grabs](https://github.com/bridgedotnet/Bridge/issues?q=is%3Aopen+is%3Aissue+label%3Aup-for-grabs). These are generally easy introductions to the inner workings of Bridge, although are items we just haven't had time to implement. Your help is always appreciated.

## Testing

Bridge is continually tested and the full test runner is available at http://testing.bridge.net/. 

## Credits

Bridge is developed by the team at [Object.NET](http://object.net/). Frameworks and Tools for .NET Developers.

## License

**Apache License, Version 2.0**

Please see [LICENSE](LICENSE) for details.
