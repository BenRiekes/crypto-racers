using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrackController : MonoBehaviour
{
    public GameObject track_objects;
    public GameObject trackPrefab;
    public const float renderYBottom = -0.93f;
    public const float renderYStep = 0.08f;
    public const int renderHeight = 14;
    private List<Transform> track_objects_transforms;

    private Vector3[] rowContainerPositions;
    private Vector3[] rowContainerScales;
    private Vector3[] wallLeftPositions;
    private Vector3[] wallRightPositions;
    private Vector3[] wallLeftScales;
    private Vector3[] wallRightScales;
    private Vector3[] roadTransforms;
    private Vector3[] roadScales;

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
            

            Transform road = track_object.GetChild(0);
            Transform wallLeft = track_object.GetChild(1);
            Transform wallRight = track_object.GetChild(2);
            track_object.position = track_object_position;
            multiplier += 0.01f;
            rowContainerPositions[c] = track_object_position;
            rowContainerScales[c] = track_object.localScale;
            wallLeftPositions[c] = wallLeft.position;
            wallRightPositions[c] = wallRight.position;
            wallLeftScales[c] = wallLeft.localScale;
            wallRightScales[c] = wallRight.localScale;
            roadTransforms[c] = road.position;
            roadScales[c] = road.localScale;

            c++;
        }
        // RecalculateTrackObjectTransforms();
        multiplier = original_multipler;
    }

    void RecalculateTrackObjectTransforms() {
        track_objects_transforms = new List<Transform>();
        foreach (Transform track_object in track_objects.transform) {
            track_objects_transforms.Add(track_object);
        }

        // track_objects_transforms.RemoveAt(0);
        rowContainerPositions = new Vector3[track_objects_transforms.Count];
        rowContainerScales = new Vector3[track_objects_transforms.Count];
        wallLeftPositions = new Vector3[track_objects_transforms.Count];
        wallRightPositions = new Vector3[track_objects_transforms.Count];
        wallLeftScales = new Vector3[track_objects_transforms.Count];
        wallRightScales = new Vector3[track_objects_transforms.Count];
        roadTransforms = new Vector3[track_objects_transforms.Count];
        roadScales = new Vector3[track_objects_transforms.Count];

        for (int i = 0; i < track_objects_transforms.Count; i++) { 
            Transform track_object = track_objects_transforms[i];
            GameObject road = track_object.GetChild(0).gameObject;
            GameObject wallLeft = track_object.GetChild(1).gameObject;
            GameObject wallRight = track_object.GetChild(2).gameObject;
            wallLeftPositions[i] = wallLeft.transform.position;
            wallRightPositions[i] = wallRight.transform.position;
            wallLeftScales[i] = wallLeft.transform.localScale;
            wallRightScales[i] = wallRight.transform.localScale;
            roadTransforms[i] = road.transform.position;
            roadScales[i] = road.transform.localScale;
            rowContainerPositions[i] = track_object.position;
            rowContainerScales[i] = track_object.localScale;
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

    void RenderTrack() {
        for (int i = 0; i < renderHeight; i++) {
            GameObject track_object = Instantiate(
                trackPrefab, 
                new Vector3(
                    0,
                    renderYBottom + (renderYStep * i),
                    0), 
                Quaternion.identity
            );
            // Set road segment color
            // road segment is contained as a child of track_object
            float wallMaxCompensation = 0.036f;
            float maxRoadWidth = trackPrefab.transform.GetChild(0).localScale.x;
            float roadColor = i % 2 == 0 ? 0 : 0.05f;
            bool wallIsRed = i % 2 == 0 ? false : true;
            float wallRColor = 1;
            float wallGBColor = wallIsRed ? 0 : 1f;
            float grassGColor = wallIsRed ? 0.5f : 0.3f;
            Transform road = track_object.transform.GetChild(0);
            Transform wallL = track_object.transform.GetChild(1);
            Transform wallR = track_object.transform.GetChild(2);
            Transform grass = track_object.transform.GetChild(3);
            road.GetComponent<SpriteRenderer>().color = new Color(roadColor, roadColor, roadColor);
            road.localScale = new Vector3(maxRoadWidth - (i * 0.5f), road.localScale.y, road.localScale.z);
            wallL.GetComponent<SpriteRenderer>().color = new Color(wallRColor, wallGBColor, wallGBColor);
            wallL.transform.localPosition = new Vector3(
                wallL.transform.localPosition.x + ((wallMaxCompensation / renderHeight) * (i + 1)),
                wallL.transform.localPosition.y,
                wallL.transform.localPosition.z
            );
            // track_object.transform.GetChild(2).GetComponent<SpriteRenderer>().color = new Color(wallColor, wallColor, wallColor);
            wallR.GetComponent<SpriteRenderer>().color = new Color(wallRColor, wallGBColor, wallGBColor);
            wallR.transform.localPosition = new Vector3(
                wallR.transform.localPosition.x - ((wallMaxCompensation / renderHeight) * (i + 1)),
                wallR.transform.localPosition.y,
                wallR.transform.localPosition.z
            );
            grass.GetComponent<SpriteRenderer>().color = new Color(0, grassGColor, 0);

            track_object.transform.parent = track_objects.transform;
            track_object.name = i.ToString();
        }
        trackPrefab.SetActive(false);

        RecalculateTrackObjectTransforms();
    }

    void UpdateTrackSegmentPoistions() {
        for (int i = 0; i < track_objects_transforms.Count; i++) {
            Transform track_object = track_objects_transforms[i];
            track_object.position = new Vector3(
                rowContainerPositions[i].x,
                rowContainerPositions[i].y,
                rowContainerPositions[i].z
            );
            track_object.localScale = rowContainerScales[i];
            Transform road = track_object.GetChild(0);
            Transform wallL = track_object.GetChild(1);
            Transform wallR = track_object.GetChild(2);
            road.position = roadTransforms[i];
            road.localScale = roadScales[i];
            wallL.position = wallLeftPositions[i];
            wallL.localScale = wallLeftScales[i];
            wallR.position = wallRightPositions[i];
            wallR.localScale = wallRightScales[i];
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        RenderTrack();
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
