using UnityEngine;
using System.Threading.Tasks;
using Fusion.Sockets;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using Fusion.Photon.Realtime;
using System.Net;
using System;

namespace Fusion.Sample.DedicatedServer {

  public class ServerManager : MonoBehaviour {

    /// <summary>
    /// Network Runner Prefab used to Spawn a new Runner used by the Server
    /// </summary>
    [SerializeField] private NetworkRunner _runnerPrefab;

    async void Start() {
      // Load Menu Scene if not Running in Headless Mode
      // This can be replaced with a check to UNITY_SERVER if running on Unity 2021.2+
      if (CommandLineUtils.IsHeadlessMode() == false) {

        SceneManager.LoadScene((int)SceneDefs.MENU, LoadSceneMode.Single);
        return;
      }

      // Continue with start the Dedicated Server
      Application.targetFrameRate = 30;

      var config = DedicatedServerConfig.Resolve();
      Debug.Log(config);

      // Start a new Runner instance
      var runner = Instantiate(_runnerPrefab);

      // Start the Server
      var result = await StartSimulation(
        runner,
        config.SessionName,
        config.SessionProperties,
        config.Port,
        config.Lobby,
        config.Region,
        config.PublicIP,
        config.PublicPort
      );

      // Check if all went fine
      if (result.Ok) {
        Log.Debug($"Runner Start DONE");
      } else {
        // Quit the application if startup fails
        Log.Debug($"Error while starting Server: {result.ShutdownReason}");

        // it can be used any error code that can be read by an external application
        // using 0 means all went fine
        Application.Quit(1);
      }
    }

    private Task<StartGameResult> StartSimulation(
      NetworkRunner runner,
      string SessionName,
      Dictionary<string, SessionProperty> customProps,
      ushort port,
      string customLobby,
      string customRegion,
      string customPublicIP = null,
      ushort customPublicPort = 0
    ) {

      // Build Custom Photon Config
      var photonSettings = PhotonAppSettings.Instance.AppSettings.GetCopy();

      if (string.IsNullOrEmpty(customRegion) == false) {
        photonSettings.FixedRegion = customRegion.ToLower();
      }

      // Build Custom External Addr
      NetAddress? externalAddr = null;

      if (string.IsNullOrEmpty(customPublicIP) == false && customPublicPort > 0) {
        if (IPAddress.TryParse(customPublicIP, out var _)) {
          externalAddr = NetAddress.CreateFromIpPort(customPublicIP, customPublicPort);
        } else {
          Log.Warn("Unable to parse 'Custom Public IP'");
        }
      }

      // Start Runner
      return runner.StartGame(new StartGameArgs() {
        SessionName = SessionName,
        GameMode = GameMode.Server,
        SceneManager = runner.gameObject.AddComponent<NetworkSceneManagerDefault>(),
        Scene = (int)SceneDefs.GAME,
        SessionProperties = customProps,
        Address = NetAddress.Any(port),
        CustomPublicAddress = externalAddr,
        CustomLobbyName = customLobby,
        CustomPhotonAppSettings = photonSettings,
      });
    }
  }
}