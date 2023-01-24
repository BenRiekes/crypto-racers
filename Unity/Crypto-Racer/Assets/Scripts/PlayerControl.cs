using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerControl : MonoBehaviour
{
    public GameObject trackObjects;
    public float torque = 1f;
    public float accelForce = 0.01f;
    private TrackController tc;
    private SpriteRenderer sprite;
    private Vector2 movementVector;
    private int maxSpeed = 20;
    private int minSpeed = -5;
    public float speed;
    private float movementX;
    private bool isHeld;
    private float timer = 0.0f;

    // p = 0.01f and i = 0.03f makes it not overshoot, but it gets there way too fast

    private const float p = 0.013f;
    private const float i = 0.0015f;
    private const float d = 0.00f;
    private const float integrator_limit = 1.0f;
    private float accelSetpoint = 0.0f;
    private float accelError = 0.0f;
    private float accelErrorSum = 0.0f;
    private float accelErrorDiff = 0.0f;
    private float accelErrorPrev = 0.0f;
    private bool isFeedbackLoop = true;

    void WhileHeld() {
        if (!isHeld) return;
        // Debug.Log("movementVector: " + movementVector + ", timer: " + timer);
        movementX += movementVector.x * torque;
        movementX = Mathf.Clamp(movementX, -20, 20);
        timer += Time.deltaTime;
        float accelForce = movementVector.y * Mathf.Pow(2, timer);
        // Debug.Log("calculated accelForce: " + accelForce);
        accelSetpoint += accelForce;
        accelSetpoint = Mathf.Clamp(accelSetpoint, minSpeed, maxSpeed);
        // Debug.Log("accelSetpoint**: " + accelSetpoint);
        if (accelSetpoint >= 1) tc.SetTrackFps((int) speed);
        else tc.SetTrackFps(0);
    }

    void OnMove(InputValue value)
    {
        timer = 0.0f;
        Vector2 v = value.Get<Vector2>();
        this.movementVector = v;
        if (v.x == 0 && v.y == 0) {
            isHeld = false;
            accelSetpoint = 0;
            return;
        }
        isHeld = true;
    }

    // Mainly for when the player is not holding the controller
    void AccelPIDLoop() {
        if (!isFeedbackLoop) return;
        Debug.Log("accelSetpoint: " + accelSetpoint + ", speed: " + speed);
        accelError = accelSetpoint - speed;
        accelErrorSum += accelError * Time.deltaTime;
        accelErrorDiff = (accelError - accelErrorPrev) / Time.deltaTime;
        accelErrorPrev = accelError;

        float accelP = p * accelError;
        float accelI = i * accelErrorSum;
        float accelD = d * accelErrorDiff;
        accelI = Mathf.Clamp(accelI, -integrator_limit, integrator_limit);
        accelErrorSum = Mathf.Clamp(accelErrorSum, -integrator_limit * 10, integrator_limit * 10);

        float accelPID = accelP + accelI + accelD;
        speed += accelPID;
        speed = Mathf.Clamp(speed, minSpeed, maxSpeed);

        tc.SetTrackFps((int) speed);
    }

    // Start is called before the first frame update
    void Start()
    {
        tc = trackObjects.GetComponent<TrackController>();
        sprite = GetComponent<SpriteRenderer>();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (isHeld) WhileHeld();

        AccelPIDLoop();
        // Turn the car
        if (movementX >= 10) { sprite.color = Color.red; } else
        if (movementX <= -10) { sprite.color = Color.blue; }
        else { sprite.color = Color.white; }
    }
}
