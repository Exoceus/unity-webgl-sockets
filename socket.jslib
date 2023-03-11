mergeInto(LibraryManager.library, {

    initSocket: function(roomString){
        // Visit https://docs.unity3d.com/Documentation/Manual/webgl-interactingwithbrowserscripting.html to learn more about jslib scriptign
        // You can take accept strings as function args but remember to apply UTF8ToString(your_string) to convert to JS string
        // I reccommend that instead of passing complex data types like arrays and objects, pass JSON strings
        // You can accept numeric types directly

        console.log("Trying to initialize socket client.");


        if(io) {
            // make sure the connection url starts with ws:// and NOT https:// or http://
            // If you have a URL like 'http://localhost:3000' just change it to 'ws://localhost:3000'

            let url = "ws://your_url";

            let socket = io(url);

            window.socket = socket;

            socket.on("connect", () => {
                console.log("Connection was successful");
            });

            socket.on("someEvent", (response) => {
                // trying to send data back to C# script:
                if(window.unityInstance){
                    window.unityInstance.SendMessage('your_gameobject_name_that_has_script', 'function_name', your_data);
                } else{
                    console.warn("Unity instance not accessible. Please make sure that you modified the script in index.html to make the unity instance accessible.");
                }
            });

            // ... you can follow docs from: https://socket.io/docs/v4/client-api/#socket

        } else{
            console.warn("Socket library not defined. Please check that you added a script tag in the head of the index.html file of the build.");
        }
    }

});