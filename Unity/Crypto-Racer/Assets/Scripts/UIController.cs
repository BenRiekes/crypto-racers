using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UIController : MonoBehaviour
{
    public TextMeshProUGUI speedText;
    public GameObject trackObjects;
    public GameObject player;
    private TrackController tc;
    private PlayerControl pc;

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
        speedText.text = "Speed: " + speed.ToString("0");   
    }
}
