using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class CarControl : MonoBehaviour
{
    public float speed = 10f;
    public float torque = 5f;
    private float movementX;
    private float movementY;
    private float movementZ;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        GetComponent<Rigidbody>().AddForce(new Vector3(movementX, movementY, movementZ) * speed); 
        GetComponent<Rigidbody>().AddTorque(new Vector3(movementY, movementX, movementZ) * torque);
    }

    void OnMove(InputValue value)
    {
        Vector2 v = value.Get<Vector2>();
        // car.GetComponent<Rigidbody>().AddForce(new Vector2(v.x, v.y));
        movementX = v.x;
        movementY = v.y;
        movementZ = v.y;
    }
}
