using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

enum DirectionLRS { Left, Right, Straight }
enum DirectionFB { Forward, Backward }

public class DebugMenu : MonoBehaviour
{
    private Canvas canvas;
    public Button verbose_toggle;
    public Button toggle_animation;
    public Button close;
    public Button left_turn;
    public Button right_turn;
    public Button forward;
    public Button straight;
    public Button increase_multiplier;
    public Button decrease_multiplier;
    public TextMeshProUGUI multiplier_field;
    public GameObject track_objects;
    public float multiplier = 1;
    private List<Transform> track_objects_transforms;
    private Vector3[] track_object_positions;
    private Vector3[] track_object_scales;
    
    private bool verbose = true;
    public int fps = 30;
    private bool isAnimating = true;
    private DirectionLRS turnDir = DirectionLRS.Straight;

    void CloseModal () { canvas.enabled = false; }

    void ToggleVerbose() { verbose = !verbose; Debug.Log("Verbose: " + verbose); }

    void LogIfVerbose(string val) { if (verbose) Debug.Log(verbose);}

    void RecalculateTrackObjectTransforms() {
        track_objects_transforms = new List<Transform>(track_objects.GetComponentsInChildren<Transform>());
        track_objects_transforms.RemoveAt(0);
        track_object_positions = new Vector3[track_objects_transforms.Count];
        track_object_scales = new Vector3[track_objects_transforms.Count];

        for (int i = 0; i < track_objects_transforms.Count; i++) { 
            Transform track_object = track_objects_transforms[i];
            track_object_positions[i] = track_object.position;
            track_object_scales[i] = track_object.localScale;
        }
    }

    void ToggleAnimation() {
        isAnimating = !isAnimating;

        if (isAnimating) {
            toggle_animation.GetComponentInChildren<TextMeshProUGUI>().SetText("Stop Frames");
            InvokeRepeating("AccelFrame", 0, (float) 1.0 / fps);
            return;
        }
        toggle_animation.GetComponentInChildren<TextMeshProUGUI>().SetText("Start Frames");
        CancelInvoke("AccelFrame");
    }

    void IncrementMultiplier(bool positive) {
        multiplier += positive ? 0.1f : -0.1f;
        // Round to nearest tenth
        multiplier = Mathf.Round(multiplier * 10) / 10;
        multiplier_field.SetText(multiplier.ToString() + ":");
        if (verbose) Debug.Log("Multiplier: " + multiplier);
    }

    void StraightTrack() {
        foreach (Transform track_object in track_objects_transforms) {
            track_object.position = new Vector3(0, track_object.position.y, track_object.position.z);
        }
        if (verbose) Debug.Log("Straightened track");
    }    

    void SetTurnDir(DirectionLRS dir) {
        turnDir = dir;
    }

    void TurnFrame(DirectionLRS dir) {
        float original_multipler = multiplier;
        int c = 0;
        foreach (Transform track_object in track_objects_transforms) {
            Vector3 track_object_position = track_object.position;
            if (dir == DirectionLRS.Left) { track_object_position.x -= 1 * multiplier; }
            else { track_object_position.x += 1 * multiplier; }
            
            track_object.position = track_object_position;
            multiplier += 0.01f;
            track_object_positions[c] = track_object_position;
            track_object_scales[c] = track_object.localScale;
            c++;
        }
        // RecalculateTrackObjectTransforms();
        multiplier = original_multipler;
    }

    void AccelFrame(/*DirectionFB dir = DirectionFB.Forward*/) {
        Transform first = track_objects_transforms[0];
        track_objects_transforms.RemoveAt(0);
        track_objects_transforms.Add(first);

        for (int i = 0; i < track_objects_transforms.Count; i++) {
            track_objects_transforms[i].name = i.ToString(); 
        }
    }

    // Update is called once per frames
    void FixedUpdate()
    {
        if (Input.GetKeyDown(KeyCode.F12)) {
            canvas.enabled = !canvas.enabled;
        }

        // if (isAnimating){
            for (int i = 0; i < track_objects_transforms.Count; i++) {
                Transform track_object = track_objects_transforms[i];
                track_object.position = new Vector3(
                    track_object_positions[i].x,
                    track_object_positions[i].y,
                    track_object_positions[i].z
                );
                track_object.localScale = track_object_scales[i];
            }
        // }

        if (turnDir != DirectionLRS.Straight) {
            TurnFrame(turnDir);
            turnDir = DirectionLRS.Straight;
        }
        
    }

    // Start is called before the first frame update
    void Start()
    {
        canvas = GetComponent<Canvas>();

        RecalculateTrackObjectTransforms();

        close.onClick.AddListener(CloseModal);
        right_turn.onClick.AddListener(() => SetTurnDir(DirectionLRS.Right));
        left_turn.onClick.AddListener(() => SetTurnDir(DirectionLRS.Left));
        straight.onClick.AddListener(StraightTrack);
        increase_multiplier.onClick.AddListener(() => IncrementMultiplier(true));
        decrease_multiplier.onClick.AddListener(() => IncrementMultiplier(false));
        verbose_toggle.onClick.AddListener(() => ToggleVerbose());
        forward.onClick.AddListener(() => AccelFrame());
        toggle_animation.onClick.AddListener(ToggleAnimation);

        InvokeRepeating("AccelFrame", 0, (float) 1.0 / fps);
    }

    
}
