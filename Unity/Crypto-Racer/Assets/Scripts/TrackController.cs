using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrackController : MonoBehaviour
{
    public GameObject track_objects;
    private List<Transform> track_objects_transforms;
    private Vector3[] track_object_positions;
    private Vector3[] track_object_scales;
    private DirectionLRS turnDir = DirectionLRS.Straight;
    private DirectionFB accelDir = DirectionFB.Forward;
    private float multiplier = 0.1f;
    private int fps = 0;
    private int lastFps = 0;
    private bool trackProcessing = false;

    public void SetTurnDir(DirectionLRS dir) {
        turnDir = dir;
    }

    public void SetTrackFps(int fps) {
        if (fps == this.fps) return;
        this.fps = fps;
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

    void AccelFrame() {
        if (trackProcessing) return;
        trackProcessing = true;
        Transform first = track_objects_transforms[0];
        if (accelDir == DirectionFB.Forward) {
            track_objects_transforms.RemoveAt(0);
            track_objects_transforms.Add(first);
        } else {
            track_objects_transforms.RemoveAt(track_objects_transforms.Count - 1);
            track_objects_transforms.Insert(0, first);
        }

        for (int i = 0; i < track_objects_transforms.Count; i++) {
            track_objects_transforms[i].name = i.ToString(); 
        }
        trackProcessing = false;
    }

    void UpdateTrackSegmentPoistions() {
        for (int i = 0; i < track_objects_transforms.Count; i++) {
            Transform track_object = track_objects_transforms[i];
            track_object.position = new Vector3(
                track_object_positions[i].x,
                track_object_positions[i].y,
                track_object_positions[i].z
            );
            track_object.localScale = track_object_scales[i];
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        RecalculateTrackObjectTransforms();
        // SetTrackFps(30);
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        // AccelFrame();
        UpdateTrackSegmentPoistions();

        if (turnDir != DirectionLRS.Straight) {
            TurnFrame(turnDir);
            turnDir = DirectionLRS.Straight;
        }

        if (lastFps != fps && !trackProcessing) {
            CancelInvoke("AccelFrame");
            InvokeRepeating("AccelFrame", 0, (float) 1.0 / fps);
        }

        lastFps = fps;
    }
}
