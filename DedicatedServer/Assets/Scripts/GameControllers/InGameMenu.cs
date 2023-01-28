using UnityEngine;
using UnityEngine.SceneManagement;

namespace Fusion.Sample.DedicatedServer {

  public class InGameMenu : SimulationBehaviour {
    private void OnGUI() {

      if (Runner == null) {
        return;
      }

      Rect area = new Rect(10, 90, Screen.width - 20, Screen.height - 100);

      GUILayout.BeginArea(area);
      GUILayout.FlexibleSpace();
      GUILayout.BeginHorizontal();
      {
        GUILayout.FlexibleSpace();

        if (GUILayout.Button("Shutdown", GUILayout.ExpandWidth(false), GUILayout.MinHeight(50), GUILayout.MinWidth(200))) {
          Runner.Shutdown();

          SceneManager.LoadScene((byte)SceneDefs.MENU);
        }
      }
      GUILayout.EndHorizontal();
      GUILayout.EndArea();
    }
  }
}