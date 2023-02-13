using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrackController : MonoBehaviour
{
    public GameObject track_objects;
    public GameObject trackPrefab;
    public GameObject player;
    public GameObject UIContainer;
    private PlayerControl pc;
    private UIController uic;
    public const float renderYBottom = -0.98f;
    public const float renderYStep = 0.04f;
    public const int renderHeight = 28;
    private List<Transform> track_objects_transforms;

    public string track = "s.40!r.90.30!s.20!l.45.50!s.40";
    private TrackInstruction[] trackInstructions;
    private TrackInstruction currentInstruction;
    private int currentInstructionIndex = 0;
    private int trackSegsTravelled = 0;
    private int trackSegsTravelledTotal = 0;

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
    private float multiplier = 0.05f;
    private int fps = 0;
    private int lastFps = 0;
    private bool trackProcessing = false;

    public float curvature = 0;
    public float targetCurvature = 0;

    public void SetTurnDir(DirectionLRS dir) {
        turnDir = dir;
    }

    public void SetTrackFps(int fps) {
        if (fps == this.fps) return;
        this.fps = fps;
    }

    public int GetTrackSegsTravelled() {
        return trackSegsTravelledTotal;
    }

    public int GetPosition() {
        return trackSegsTravelledTotal;
    }

    public bool IsFinished() {
        return currentInstructionIndex >= trackInstructions.Length;
    }

    public float CalculateTrackCurvature() {
    // float fTrackCurveDiff = (fTargetCurvature - fCurvature) * fElapsedTime * fSpeed;
    // fCurvature += fTrackCurveDiff;
    // fTrackCurvature += (fCurvature) * fElapsedTime * fSpeed;
        float fTrackCurveDiff = (targetCurvature - curvature) * Time.deltaTime;
        return curvature;

    }

    public bool PlayerIsOverObstacle() {
        // Look at 7th track index
        // If the player's x value is over a road, return false
        // else return true

        // Get the player's x value
        float playerX = player.transform.position.x;
        // Get the road's x value
        float roadX = track_objects_transforms[7].position.x;
        // Get the road's scale
        float roadScale = track_objects_transforms[7].localScale.x;
        // If the player's x value is over the road, return false
        if (playerX > roadX - roadScale / 2 && playerX < roadX + roadScale / 2) return false;
        // else return true
        return true;
    }

    void ReadTrackInstructions() {
        // A string like s.40!r.90.30!s.20!l.45.50!s.40 should be parsed into an array of TrackInstructions
        // The first instruction should be a straight for 40
        // The second instruction should be a right turn for 90 curvature and 30 units
        // The third instruction should be a straight for 20
        // The fourth instruction should be a left turn for 45 curvature and 50 units
        // The fifth instruction should be a straight for 40
        // The array should be stored in track_instructions

        // Split the string into an array of strings
        string[] trackInstructionsStrings = track.Split('!');
        if (trackInstructionsStrings[0].ToCharArray()[0] != 's') Debug.Log("P-2");
        trackInstructions = new TrackInstruction[trackInstructionsStrings.Length];

        for(int i = 0; i < trackInstructionsStrings.Length; i++) {
            string trackInstructionString = trackInstructionsStrings[i];
            char[] chars = trackInstructionString.ToCharArray();
            string[] split = trackInstructionString.Split('.');
            TrackInstruction instruction;
            int length;
            int curvature;

            switch (chars[0]) {
                case 's':
                    if (split.Length - 1 != TrackInstruction.straightParamsNum) {
                        Debug.Log("ERROR P-1-" + (split.Length - 1) + "-" + TrackInstruction.straightParamsNum);
                    }
                    length = int.Parse(split[1]);
                    instruction = new TrackInstruction(length);
                    break;
                case 'l':
                    if (split.Length - 1 != TrackInstruction.turnParamsNum) {
                        Debug.Log("ERROR P-1-" + (split.Length - 1) + "-" + TrackInstruction.turnParamsNum);
                    }
                    length = int.Parse(split[1]); 
                    curvature = int.Parse(split[2]);
                    instruction = new TrackInstruction(TrackInstructionType.LeftForCurvatureAndLength, curvature, length);
                    break;
                case 'r':
                    if (split.Length - 1 != TrackInstruction.turnParamsNum) {
                        Debug.Log("ERROR P-1-" + (split.Length - 1) + "-" + TrackInstruction.turnParamsNum);
                    }
                    length = int.Parse(split[1]);
                    curvature = int.Parse(split[2]);
                    instruction = new TrackInstruction(TrackInstructionType.RightForCurvatureAndLength, curvature, length);
                    break;
                default:
                    Debug.Log("ERROR -0-1: " + split[0]);
                    instruction = new TrackInstruction(0);
                    break;
            }
            trackInstructions[i] = instruction;
        }

        currentInstruction = trackInstructions[0];

        foreach(TrackInstruction instruction in trackInstructions) {
            Debug.Log("Instruction: " + instruction.type + " Curvature " + instruction.curvature + " Length " + instruction.length);
        }
    }

    void CalculateTrackTurn() {
        // if (currentInstructionIndex == 0) lastCurve = 0;

        float original_multipler = multiplier;
        int speedNormalized = pc.speed > 1 ? 1 : 0;
        float trackCurvatureDiff = (targetCurvature - curvature) * (Time.deltaTime / 2.0f) * speedNormalized;
        int c = 0;
        foreach (Transform track_object in track_objects_transforms) {
            Vector3 track_object_position = track_object.position;
            // track_object_position.x is the midpoint
            // the midpoint should be set based on the current curvature
            track_object_position.x += Mathf.Pow((trackCurvatureDiff * multiplier), 3);

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

        
        // Debug.Log("curvatureDiff: " + curvatureDiff);
        // RecalculateTrackObjectTransforms();
        multiplier = original_multipler;
        curvature += trackCurvatureDiff;
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
            road.localScale = new Vector3(maxRoadWidth - (i * 0.25f), road.localScale.y, road.localScale.z);
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

    void UpdateTrackSegmentPositions() {
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

    void AccelFrame() {
        if (trackProcessing) return;
        trackProcessing = true;
        Transform first = track_objects_transforms[0];
        if (accelDir == DirectionFB.Forward) {
            track_objects_transforms.RemoveAt(0);
            track_objects_transforms.Add(first);
            trackSegsTravelled++;
            trackSegsTravelledTotal++;
        } else {
            track_objects_transforms.RemoveAt(track_objects_transforms.Count - 1);
            track_objects_transforms.Insert(0, first);
            trackSegsTravelled--;
            trackSegsTravelledTotal--;
        }

        for (int i = 0; i < track_objects_transforms.Count; i++) {
            track_objects_transforms[i].name = i.ToString(); 
        }
        trackProcessing = false;
    }

    // Start is called before the first frame update
    void Start()
    {
        pc = player.GetComponent<PlayerControl>();
        uic = UIContainer.GetComponent<UIController>();
        RenderTrack();
        ReadTrackInstructions();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        UpdateTrackSegmentPositions();

        CalculateTrackTurn();
        // if (turnDir != DirectionLRS.Straight) {
        //     turnDir = DirectionLRS.Straight;
        // }

        if (lastFps != fps && !trackProcessing) {
            CancelInvoke("AccelFrame");
            InvokeRepeating("AccelFrame", 0, (float) 1.0 / fps);
        }


        if (trackSegsTravelled >= currentInstruction.length) {
            if (currentInstructionIndex + 1 > trackInstructions.Length) {
                currentInstruction.curvature = 0;
                currentInstruction.length = 999999999;
                uic.Finish(1);
                return;
            }

            curvature = targetCurvature;
            currentInstructionIndex++;
            currentInstruction = trackInstructions[currentInstructionIndex];
            trackSegsTravelled = 0;
            targetCurvature = currentInstruction.curvature;
            Debug.Log("New instruction: Curvature " + currentInstruction.curvature + " Length " + currentInstruction.length);
        }

        lastFps = fps;
    }
}
