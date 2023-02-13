using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AudioHandler : MonoBehaviour
{
    public Sprite mutedSprite;
    public Sprite unmutedSprite;
    private Image spriteRenderer;
    public GameObject audioSourceObject;
    private AudioSource audioSource;
    private Button button;
    public bool muted = false;

    public void StartSound() {
        if (!muted) audioSource.Play();
    }

    // Start is called before the first frame update
    void Start()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(OnPressed);
        spriteRenderer = GetComponent<Image>();
        audioSource = audioSourceObject.GetComponent<AudioSource>();
    }

    void OnPressed() {
        muted = !muted;
        AudioListener.volume = muted ? 0 : 1;
        spriteRenderer.sprite = muted ? mutedSprite : unmutedSprite;
    }
}
