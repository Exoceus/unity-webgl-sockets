# Setup Socket Client for Unity WebGL

> **This is simply a guide with some code samples to get you started and is NOT a Unity package/plugin that you can import into your Unity package.**

If you are looking to use sockets in Unity then be warned that:
> WebGL doesn’t allow direct access to IP Sockets, but you can use WebSockets or WebRTC (the two most common networking protocols supported by browsers) to get around this. While WebSockets are widely supported, WebRTC allows peer-to-peer connections between browsers and unreliable connections. Unity doesn’t have a built-in API that allows you to use WebSockets or WebRTC, but you can use a JavaScript plugin to implement this. *Source: [Unity Docs](https://docs.unity3d.com/Manual/webgl-networking.html)*

The solution is to use create your own [browser script](https://docs.unity3d.com/2021.2/Documentation/Manual/webgl-interactingwithbrowserscripting.html) to interact with sockets.

## Setup

To make the browser script run as expected you will need to install socket and make the Unity instance accessible. But you can only do this once you have build the project to WebGL. After building, navigate to the `index.html` file at the root of the built project. If you build your project in a different folder, you will have to do this setup again.

### Socket Installation

Add a script to import socket.io (or other websocket libraries that you used in your browser script).

I reccommend using a CDN instead of a local file for convenience. This is the example for importing Socket.io 4.0.0 (this is not the latest version, you can import any version).

```html
<script src="https://cdn.socket.io/4.0.0/socket.io.js"></script>
```

### Unity Browser Instance

You will need to add some lines of code to facilitate sending data back to your C# script:

Find the script tag that is inside the body element and insert the two labelled statements below

```html
<script>
    ...

    function unityShowBanner(msg, type) {
        ...
    } 

    var unityInstance; // <--- Add this statement
    var buildUrl = "Build";
    var loaderUrl = buildUrl + "/webbuild.loader.js";

    ...

    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => {
          this.unityInstance = unityInstance; // <--- Add this statement
          loadingBar.style.display = "none";
          fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
          };
        }).catch((message) => {
          alert(message);
        });
      };
      document.body.appendChild(script);
</script>
```

Credit to [KyleDulce](https://github.com/KyleDulce/Unity-Socketio/wiki/Making-SocketIo-Work-in-2020.x) for this.

## Browser Script

1. Create a 'Plugins' folder in your Unity Assets directory if it is not already there.
1. Create a new file called socket_client.jslib (you can name this file whatever you want as long as it has the suffix .jslib). Make sure to create this file in the Plugins folder or any subfolder. This `.jslib` file is your browser script.
1. Copy text from the `socket.jslib` file into `socket_client.jslib`.
1. Modify the contents of your script according to your needs. Consult relevant [Unity Scripting Docs](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html) and [SocketIO Docs](https://socket.io/docs/v4/client-api/).

## Communication between C# and JS

The Unity Docs on this are easy to understand and to the point and I would reccommend you check it out for more details [here](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html).

In your C# script add this import:

```c#
using System.Runtime.InteropServices;
```

and then add these two lines for every function you want to import from your browser script and wrap it in a directive so that it only runs when you are in the WebGL platform:

```c#
#if UNITY_WEBGL
    [DllImport("__Internal")]
    private static extern void YourFunction();
#endif
```

You must also define function arguments due to C# being strongly typed:

```c#
[DllImport("__Internal")]
private static extern void YourFunctionWithArgs(string str, int num);
```

To send data from your browser script to your C# script, use:

```js
window.unityInstance.SendMessage('MyGameObject', 'MyFunction', 'MyArgument');
```

For this to work make sure you follow the isntructions in the setup.
