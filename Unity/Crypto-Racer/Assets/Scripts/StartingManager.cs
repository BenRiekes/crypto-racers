using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class StartingManager : MonoBehaviour
{

    public TextMeshProUGUI startingText;
    public AudioClip readySound;
    public AudioClip goSound;
    private bool readyToStart = false;
    
    public GameObject playerControlObject;
    public GameObject web3ManagerObject;
    public GameObject networkingObject;
    public GameObject musicObject;
    private PlayerControl playerControl;
    private Web3Manager web3Manager;
    private Networking networking;
    private AudioHandler musicHandler;
    private AudioSource audioSource;


    // Start is called before the first frame update
    void Start()
    {
        startingText.text = "Ready...";
        InvokeRepeating("OscillateText", 0, 0.5f);
        web3Manager = web3ManagerObject.GetComponent<Web3Manager>();
        networking = networkingObject.GetComponent<Networking>();
        playerControl = playerControlObject.GetComponent<PlayerControl>();
        audioSource = GetComponent<AudioSource>();
        musicHandler = musicObject.GetComponent<AudioHandler>();
    }

    void OscillateText() {
        bool up = startingText.text == "Ready...";
        startingText.text = up ? "" : "Ready...";
    }

    void StartGame() {
        startingText.text = "Go!";
        audioSource.PlayOneShot(goSound);
        playerControl.StartGame();
        musicHandler.StartSound();
        Invoke("FinishStart", 1);
    }

    void FinishStart() {
        startingText.gameObject.SetActive(false);
        gameObject.SetActive(false);
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (
            networking.NetworkingReady() &&
            web3Manager.Web3Ready() &&
            playerControl.IsReady() &&
            !readyToStart
        ) {
            readyToStart = true;
            CancelInvoke("OscillateText");
            startingText.text = "Ready!";
            audioSource.PlayOneShot(readySound);
            Invoke("StartGame", 1);

        } else {
            Debug.Log("Waiting1: " + networking.NetworkingReady());
            Debug.Log("Waiting2: " + web3Manager.Web3Ready());
            Debug.Log("Waiting3: " + playerControl.IsReady());
        }
    }
}
