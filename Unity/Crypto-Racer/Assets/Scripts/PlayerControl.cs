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

    private TrackController tc;
    private SpriteRenderer sprite;
    private Vector2 movementVector;
    private const float panningProportionalityConstant = 0.01f;
    private const int maxSpeed = 15;
    private const int minSpeed = 0;
    public float speed;
    private float movementX;
    private bool isHeld;
    private float stanceX = 0.0f;
    private float timer = 0.0f;
    private float trackWidth = 0.8f;
    private float panning = 0.0f;

    // Equation for velocity:
    // V = vMax * (1 - e^(-k*tau))
    // Where vMax is the maximum velocity, k is the rate of change (acceleration constant), 
    // and tau is the time since the start of the movement.
    private float accelSetpoint = 0.0f;

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
        stanceX += movementX * 0.01f;
        stanceX = Mathf.Clamp(stanceX, -1 * trackWidth, trackWidth);
        // Base panning value determined by velocity
        float basePanning = speed * panningProportionalityConstant;
        // Add or subtract value based on movementX input
        panning = (basePanning * stanceX) + stanceX;
        // Ensure that the panning value stays within the track boundaries
        panning = Mathf.Clamp(panning, -trackWidth, trackWidth);

        // Debug.Log("panning: " + panning + ", basePanning: " + basePanning + ", movementX: " + movementX + ", speed: " + speed + ", stanceX: " + stanceX);

        GetComponent<Transform>().position = new Vector3(panning, -0.33f, -1);
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

    // Start is called before the first frame update
    void Start() {
        tc = trackObjects.GetComponent<TrackController>();
        sprite = GetComponent<SpriteRenderer>();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (isHeld) WhileHeld();
        else { speed -= 0.5f; speed = Mathf.Clamp(speed, minSpeed, maxSpeed); tc.SetTrackFps((int) speed); }
        if (!isHeld && speed > 0) BringSetpointToZero();

        CalculatePanning();
        mainCamera.transform.position = new Vector3(panning, 0, -3.03f);
    }
}
