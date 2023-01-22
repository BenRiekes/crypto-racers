using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerControl : MonoBehaviour
{
    private SpriteRenderer sprite;
    private Vector2 movementVector;
    public float torque = 1f;
    private float movementX;
    private bool isHeld;

    void WhileHeld() {
        if (!isHeld) return;
        movementX += movementVector.x * torque;
        movementX = Mathf.Clamp(movementX, -20, 20);
        Debug.Log(movementX);
    }

    void OnMove(InputValue value)
    {
        Vector2 v = value.Get<Vector2>();
        this.movementVector = v;
        if (v.x == 0) {
            isHeld = false;
            return;
        }
        isHeld = true;
    }

    // Start is called before the first frame update
    void Start()
    {
        sprite = GetComponent<SpriteRenderer>();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (isHeld) WhileHeld();
        // Turn the car
        if (movementX >= 10) { sprite.color = Color.red; } else
        if (movementX <= -10) { sprite.color = Color.blue; }
        else { sprite.color = Color.white; }
    }

    
}
