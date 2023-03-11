using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class example : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void initSocket();


    // Start is called before the first frame update
    void Start()
    {
        initSocket();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void YourFunctionToRecieveJSLibData(string data){
        // recieve data from broswer script
    }
}
