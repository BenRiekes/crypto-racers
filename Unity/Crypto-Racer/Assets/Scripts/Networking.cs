using System;
using System.IO;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using Org.BouncyCastle.Utilities;
using Org.BouncyCastle.Bcpg;
using Org.BouncyCastle.Bcpg.OpenPgp;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;
public class Networking : MonoBehaviour
{

    private const string url = "http://127.0.0.1:5001/crypto-racers/us-central1/raceStatusUpdate";
    public GameObject player;
    public GameObject trackObjects;
    private PlayerControl playerControl;
    private TrackController trackController;

    private const string KEY = @"-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEY+bGphYJKwYBBAHaRw8BAQdAm6hBJLdEwGyApEkAIXhLCEmp2B9vdOhb6EcL
shVsVgi0K0NyeXB0byBSYWNlciBTZXJ2ZXIgPHJhY2VyQGNyeXB0b3JhY2VyLmNv
bT6ImQQTFgoAQRYhBDaEDeKnTV3n4dub0UfXVn3hnZhpBQJj5samAhsDBQkB4TOA
BQsJCAcCAiICBhUKCQgLAgQWAgMBAh4HAheAAAoJEEfXVn3hnZhpVtEBANgE9OQq
Ks2FktpVRNmg/zHLi5qPic78QKStEGzJjbrpAP0Xlmr+X81X9loorOLoyQd73BVy
c6ptyfbVNVTpaO6AB7g4BGPmxqYSCisGAQQBl1UBBQEBB0Ao/qgMkpdYPwphYfO1
+MDwVNDK1bgGs7BClVXmto9EBAMBCAeIfgQYFgoAJhYhBDaEDeKnTV3n4dub0UfX
Vn3hnZhpBQJj5samAhsMBQkB4TOAAAoJEEfXVn3hnZhpF14BAIkmasJ3ArQxwbRv
MNTQpXoimsXconaVMaQvgubYTaxnAQCtvr8l0XmmJzSous2YBVFhBKd9fRyRDE9Z
jHOJJcZMCg==
=sXHv
-----END PGP PUBLIC KEY BLOCK-----";

    private bool authProvided = false; 
    private string authHeader = "";
    public bool active = true;


    void Start() {
        playerControl = player.GetComponent<PlayerControl>();
        trackController = trackObjects.GetComponent<TrackController>();
        if (active) InvokeRepeating("MakeUpdateRequest", 0, 1);
    }

    public void ProvideAuthCredentials(string authHeader) {
        if (authProvided) return;
        authProvided = true;
        this.authHeader = authHeader;
    }

    public bool NetworkingReady() {
        return (authProvided || !active);
    }

    byte[] encryptMessage(string message) {
        PgpPublicKey publicKey = ReadPublicKey(KEY);

        MemoryStream bOut = new MemoryStream();
        PgpEncryptedDataGenerator encryptedDataGenerator = new PgpEncryptedDataGenerator(SymmetricKeyAlgorithmTag.TripleDes, new SecureRandom());
        encryptedDataGenerator.AddMethod(publicKey);
        Stream encryptedOut = encryptedDataGenerator.Open(bOut, new byte[4096]);
        StreamWriter writer = new StreamWriter(encryptedOut);
        writer.Write(message);
        writer.Close();
        encryptedOut.Close();

        return bOut.ToArray();
    }

    PgpPublicKey ReadPublicKey(string publicKeyString)
    {
        using (var inputStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(publicKeyString)))
        {
            using (var publicKeyStream = new ArmoredInputStream(inputStream))
            {
                PgpPublicKeyRingBundle publicKeyRingBundle = new PgpPublicKeyRingBundle(publicKeyStream);
                PgpPublicKey publicKey = GetFirstPublicKey(publicKeyRingBundle);
                return publicKey;
            }
        }
    }

    PgpPublicKey GetFirstPublicKey(PgpPublicKeyRingBundle publicKeyRingBundle)
    {
        foreach (PgpPublicKeyRing keyRing in publicKeyRingBundle.GetKeyRings())
        {
            foreach (PgpPublicKey key in keyRing.GetPublicKeys())
            {
                if (key.IsEncryptionKey)
                {
                    return key;
                }
            }
        }

        throw new ArgumentException("Can't find encryption key in key ring.");
    }

    private class Update {
        public string authorization;
        public string x;
    }

    void MakeUpdateRequest() {
        if (!authProvided) { Debug.Log("Waiting"); return; } 
        int position = trackController.GetPosition();
        float speed = playerControl.GetSpeed();
        int currentTime = Epoch.Current();
        bool finished = trackController.IsFinished();
        string update = String.Format("{0}:{1}:{2}:{3}", position, speed, currentTime, finished);
        byte[] updateBytes = Encoding.UTF8.GetBytes(update);

        // var publicKeyParameters = (RsaKeyParameters)publicKeyRea;

        // var rsa = new RSACryptoServiceProvider();
        // rsa.ImportParameters(
        //     new RSAParameters {
        //         Modulus = publicKeyRsaParams.Modulus.ToByteArrayUnsigned(),
        //         Exponent = publicKeyRsaParams.Exponent.ToByteArrayUnsigned()
        //     }
        // );

        // byte[] encrypted = encryptMessage(update);

        // Send a POST request to the server at url
        var data = new Update {
            authorization = authHeader,
            x = update
        };

        string json = JsonUtility.ToJson(data);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        // var req = new UnityWebRequest(url, "POST");
        // byte[] jsonToSend = new System.Text.UTF8Encoding().GetBytes(json);
        // req.uploadHandler = (UploadHandler) new UploadHandlerRaw(jsonToSend);
        // req.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
        // req.SetRequestHeader("Content-Type", "application/json");
        // req.SetRequestHeader("Authorization", authHeader);
        // req.SetRequestHeader("x", update);

        WWWForm form = new WWWForm();
        form.AddField("Authorization", authHeader);
        form.AddField("x", update);
        UnityWebRequest req = UnityWebRequest.Post(url, form);

        // HttpClient client = new HttpClient();
        // client.DefaultRequestHeaders.Add("Content-Type", "application/json");
        // client.DefaultRequestHeaders.Add("Authorization", authHeader);
        // client.DefaultRequestHeaders.Add("x", update);
        // client.PostAsync(url, new StringContent($"{}"));


        // var request = UnityWebRequest.Post(url, form);
        // UnityWebRequest request = new UnityWebRequest(url, "POST");
        // UploadHandlerRaw uploadHandler = new UploadHandlerRaw(updateBytes);
        // request.SetRequestHeader("Content-Type", "application/json");
        // request.SetRequestHeader("Authorization", authHeader);
        // request.SetRequestHeader("x", update);
        // // request.SetRequestHeader("x", BitConverter.ToString(encrypted));
        req.SendWebRequest();
    }
}

