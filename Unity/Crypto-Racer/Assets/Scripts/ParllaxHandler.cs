using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParllaxHandler : MonoBehaviour
{

    public GameObject backTemplate;
    public GameObject farTemplate;
    public GameObject player;
    public int backOffset = -10;
    private GameObject backContainer;
    private GameObject farContainer;
    public float backTemplateStep = 4.26f;
    public int farOffset = -5;
    public float farTemplateStep = 0.318f;

    private float parallaxOffset = 0.0f;
    private float backOffsetX = 0.1f;
    private float farOffsetX = 0.2f;
    // Start is called before the first frame update
    void Start()
    {
        backContainer = new GameObject("BackContainer");
        backContainer.transform.parent = transform;
        farContainer = new GameObject("FarContainer");
        farContainer.transform.parent = transform;
        for (int i = 0; i < 50; i++) {
            GameObject back = Instantiate(backTemplate);
            back.transform.position = new Vector3(backOffset + (i * backTemplateStep), 0, 7.21f);
            back.transform.parent = backContainer.transform;
            GameObject far = Instantiate(farTemplate);
            far.transform.position = new Vector3(farOffset + (i * farTemplateStep), 0.4f, 4.573f);
            far.transform.parent = farContainer.transform;
        }

        backTemplate.SetActive(false);
        farTemplate.SetActive(false);
        
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        parallaxOffset = player.transform.position.x;
        backContainer.transform.position = new Vector3((parallaxOffset * backOffsetX), 0, 7.21f);
        farContainer.transform.position = new Vector3((parallaxOffset * farOffsetX) - 0.02f, 0.1f, 4.573f);
    }
}
