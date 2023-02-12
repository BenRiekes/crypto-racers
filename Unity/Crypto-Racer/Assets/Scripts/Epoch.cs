using UnityEngine;
using System.Collections;
using System;

public class Epoch: MonoBehaviour {
    public static int Current() {
        return (int) (DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
    }

    public static int SecondsElapsed(int since) {
        return (int) Mathf.Abs(Current() - since);
    }

    public static int SecondsElapsed(int t1, int t2) {
        return (int) Mathf.Abs(t1 - t2);
    }
}
