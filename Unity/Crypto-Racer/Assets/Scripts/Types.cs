public enum DirectionLRS { Left, Right, Straight }
public enum DirectionFB { Forward, Backward }

public enum TrackInstructionType {
    LeftForCurvatureAndLength,
    RightForCurvatureAndLength,
    StraightForLength,
}

public class TrackInstruction {
    public TrackInstruction(TrackInstructionType type, int length, int curvature) {
        this.type = type;
        this.length = length;
        this.curvature = curvature;
    }

    /**
        * Shorthand for a straightaway instruction
    */
    public TrackInstruction(int length) {
        this.type = TrackInstructionType.StraightForLength;
        this.curvature = 0;
        this.length = length;
    }

    static public int straightParamsNum = 1;
    static public int turnParamsNum = 2;

    public int length;
    public int curvature;
    public TrackInstructionType type;
}