using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerControl : MonoBehaviour
{
    public GameObject trackObjects;
    public Camera mainCamera;
    public float torque = 0.000000005f;
    public const float accelForce = 0.63f;
    public Sprite[] turnSprites;
    public Sprite[] boomSprites;

    public Sprite[] allTurnSprites;

    private TrackController tc;
    private SpriteRenderer sprite;
    private Vector2 movementVector;
    private AudioSource audioSource;
    private const float panningProportionalityConstant = 0.01f;
    private const int maxSpeed = 15;
    private const int minSpeed = 0;
    public float speed = 0.0f;
    private float movementX = 0.0f;
    private float playerCurvature = 0.0f;
    private float trackCurvatureDiff = 0.0f;
    private bool isHeld;
    private float stanceX = 0.0f;
    private float timer = 0.0f;
    private float trackWidth = 0.8f;
    private float panning = 0.0f;
    private bool isLocked = true;
    private bool spritesLoaded = false;
    private int sheet = 1;

    // Equation for velocity:
    // V = vMax * (1 - e^(-k*tau))
    // Where vMax is the maximum velocity, k is the rate of change (acceleration constant), 
    // and tau is the time since the start of the movement.
    private float accelSetpoint = 0.0f;

    public void StartGame() {
        isLocked = false;
    }

    public float GetSpeed() {
        return speed;
    }

    public bool IsReady() {
        return spritesLoaded;
    }

    public void SendSheet(int sheet) {
        this.sheet = sheet;
        LoadSpritesheet();
    }

    void LoadSpritesheet() {
        if (spritesLoaded) return;
        int minIndex = (sheet * 12);
        if (minIndex < 0) minIndex = 0;
        int maxIndex = (sheet * 12) + 12;
        if (maxIndex > allTurnSprites.Length) maxIndex = allTurnSprites.Length;

        turnSprites = new Sprite[12];
        for (int i = 0; i < 12; i++) {
            turnSprites[i] = allTurnSprites[minIndex + i];
        }

        if(sheet > 0) {
            sprite.transform.localScale = new Vector3(0.34f, 0.2266667f, 1);
        }

        sprite.sprite = turnSprites[0];
        spritesLoaded = true;
    }

    void CalculateVelocity() {
        timer += Time.deltaTime;
        float vMax = accelSetpoint;
        float k = accelForce;
        float tau = timer;
        float v = vMax * (1 - Mathf.Exp(-k * tau));
        // Debug.Log("IS VELOCITY accelSetpoint: " + accelSetpoint + ", speed: " + speed + ", v: " + v + ", timer: " + timer);
        speed = v;
    }

    void WhileHeld() {
        if (!isHeld) return;
        // Debug.Log("movementVector: " + movementVector + ", timer: " + timer);
        movementX += movementVector.x * torque;
        movementX = Mathf.Clamp(movementX, -1 * turnSprites.Length + 1, turnSprites.Length - 1);
        if (movementX < 0) sprite.flipX = true;
        else sprite.flipX = false;
        sprite.sprite = turnSprites[(int) Mathf.Abs(movementX)];

        if (movementX != 0) {
            bool isPositive = movementX > 0;
            float curveFactor = isPositive ? 0.3f : -0.3f;
            playerCurvature += curveFactor * Time.deltaTime * (speed / 2.0f);
        }

        float accelForce = movementVector.y * Mathf.Pow(2, timer);
        // Debug.Log("calculated accelForce: " + accelForce);
        accelSetpoint += accelForce;
        accelSetpoint = Mathf.Clamp(accelSetpoint, minSpeed, maxSpeed);
        // Debug.Log("accelSetpoint**: " + accelSetpoint);
        if (accelSetpoint >= 1) tc.SetTrackFps((int) speed);
        else tc.SetTrackFps(0);
        CalculateVelocity();
    }

    void CalculatePanning() {
        float speedNormalized = speed > 1 ? 1 : 0;
        stanceX += movementX * Time.deltaTime;
        // stanceX = Mathf.Clamp(stanceX, -1 * trackWidth, trackWidth);
        // // Base panning value determined by velocity
        // float basePanning = speed * panningProportionalityConstant;
        // // Add or subtract value based on movementX input
        // panning = (basePanning * stanceX) + stanceX;
        // // Ensure that the panning value stays within the track boundaries
        // panning = Mathf.Clamp(panning, -trackWidth, trackWidth);

        // Debug.Log("panning: " + panning + ", basePanning: " + basePanning + ", movementX: " + movementX + ", speed: " + speed + ", stanceX: " + stanceX);

        playerCurvature = Mathf.Clamp(playerCurvature, -2 * trackWidth, 2 * trackWidth);
        float trackCurvature = tc.CalculateTrackCurvature();

        float pan = (-trackCurvature * Time.deltaTime) + playerCurvature;
        pan = Mathf.Clamp(pan, -2 * trackWidth, 2 * trackWidth);
        Debug.Log("calculated: " + pan);

        GetComponent<Transform>().position = new Vector3(stanceX + pan, -0.7f, -1);
    }

    void BringSetpointToZero() {
        if (accelSetpoint > 0) accelSetpoint -= 1.0f;
        else if (accelSetpoint < 0) accelSetpoint += 0.1f;
        else {
            accelSetpoint = 0;
        }
    }

    void OnMove(InputValue value) {
        Vector2 v = value.Get<Vector2>();
        if(v.y != movementVector.y && v.y <= 0) timer = 0.0f;
        this.movementVector = v;
        if (v.x == 0 && v.y == 0) {
            isHeld = false;
            return;
        }
        isHeld = true;

    }

    void EngineNoise() {
        // Oscillate pitch between 40 and 50 hz
        // square wave
        // 0.5 * sin(2 * pi * f * t) + 0.5
        
        // float pitch = 0.5f * Mathf.Sin(2 * Mathf.PI * 40 * Time.time) + 0.5f;
        float pitch = Mathf.Clamp((speed / 15), 0.1f, 1.0f);
        float volume = Mathf.Clamp((speed / 15) * 0.5f, 0.4f, 1.0f);
        audioSource.pitch = pitch;
        // tie volume to speed
        audioSource.volume = volume;
    }

    // Start is called before the first frame update
    void Start() {
        tc = trackObjects.GetComponent<TrackController>();
        sprite = GetComponent<SpriteRenderer>();
        audioSource = GetComponent<AudioSource>();
        if (Application.isEditor) {
            SendSheet(0);
        }
        audioSource.pitch = 0;
        audioSource.volume = 0;
        audioSource.Play();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (isLocked) return;
        if (isHeld) WhileHeld();
        else { speed -= 0.5f; speed = Mathf.Clamp(speed, minSpeed, maxSpeed); tc.SetTrackFps((int) speed); }
        if (!isHeld && speed > 0) BringSetpointToZero();

        if (tc.PlayerIsOverObstacle()) speed /= 2.0f;

        EngineNoise();

        CalculatePanning();
        // mainCamera.transform.position = new Vector3(panning, 0, -3.03f);
    }
}
