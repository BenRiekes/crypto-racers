using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

enum Direction { Left, Right }

public class DebugMenu : MonoBehaviour
{
    private Canvas canvas;
    public Button close;
    public Button left_turn;
    public Button right_turn;
    public Button straight;
    public Button increase_multiplier;
    public Button decrease_multiplier;
    public TextMeshProUGUI multiplier_field;
    public GameObject track_objects;
    public float multiplier = 1;
    private Transform[] track_objects_transforms;


    // Start is called before the first frame update
    void Start()
    {
        canvas = GetComponent<Canvas>();
        track_objects_transforms = track_objects.GetComponentsInChildren<Transform>();
        close.onClick.AddListener(CloseModal);
        right_turn.onClick.AddListener(() => TurnFrame(Direction.Right));
        left_turn.onClick.AddListener(() => TurnFrame(Direction.Left));
        straight.onClick.AddListener(StraightTrack);
        increase_multiplier.onClick.AddListener(() => IncrementMultiplier(true));
        decrease_multiplier.onClick.AddListener(() => IncrementMultiplier(false));
    }

    void CloseModal () { canvas.enabled = false; }

    void IncrementMultiplier(bool positive) {
        multiplier += positive ? 0.1f : -0.1f;
        // Round to nearest tenth
        multiplier = Mathf.Round(multiplier * 10) / 10;
        multiplier_field.SetText(multiplier.ToString() + ":");
    }

    void StraightTrack() {
        foreach (Transform track_object in track_objects_transforms) {
            track_object.position = new Vector3(0, track_object.position.y, track_object.position.z);
        }
    }

    

    void TurnFrame(Direction dir) {
        Debug.Log(dir);
        float original_multipler = multiplier;
        foreach (Transform track_object in track_objects_transforms) {
            Vector3 track_object_position = track_object.position;
            if (dir == Direction.Left) { track_object_position.x -= 1 * multiplier; }
            else { track_object_position.x += 1 * multiplier; }
            // track_object_position.x += 1 * multiplier;
            track_object.position = track_object_position;
            multiplier += 0.01f;
        }
        multiplier = original_multipler;
    }

    // Update is called once per frames
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.F12)) {
            canvas.enabled = !canvas.enabled;
        }
    }

    
}
