using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UIController : MonoBehaviour
{
    public TextMeshProUGUI speedText;
    public TextMeshProUGUI winText;
    public GameObject trackObjects;
    public GameObject player;
    private TrackController tc;
    private PlayerControl pc;
    private bool finished = false;

    public void Finish(int place) {
        finished = true;
        // speedText.text = "You finished " + place.ToString() + "!";
        winText.enabled = true;

    }

    // Start is called before the first frame update
    void Start()
    {
        tc = trackObjects.GetComponent<TrackController>();
        pc = player.GetComponent<PlayerControl>();
        
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        int speed = (int) pc.speed;
        if (!finished) speedText.text = "Speed: " + speed.ToString("0");   
    }
}
