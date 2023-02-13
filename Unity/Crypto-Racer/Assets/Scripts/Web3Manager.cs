using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Thirdweb;

public class Web3Manager : MonoBehaviour
{
    private ThirdwebSDK sdk;
    private Contract racerContract;
    private TextAsset abi;

    private bool tokensSet = false;
    private string wallet;
    private string playerCarTokenId;

    public bool Web3Ready() {
        if (!tokensSet) Debug.Log("Waiting3");
        return tokensSet;
    }

    public void SetTokens(string[] strings) {
        // string wallet, string racerContractAddr, string playerCarTokenId
        if (tokensSet) return;
        tokensSet = true;
        this.wallet = strings[0];
        this.playerCarTokenId = strings[1];
        // racerContract = sdk.GetContract(strings[2], abi.text);
    }
    void Start()
    {
        if (Application.isEditor) {
            string[] strings = new string[2];
            strings[0] = "0x0";
            strings[1] = "0x0";
            SetTokens(strings);
        }
        // sdk = new ThirdwebSDK("goerli");
        // abi = Resources.Load<TextAsset>("Scripts/RacerContractABI.json");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
