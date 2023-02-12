using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AudioHandler : MonoBehaviour
{
    public Sprite mutedSprite;
    public Sprite unmutedSprite;
    private Image spriteRenderer;
    private AudioSource audioSource;
    private Button button;
    private bool muted = false;

    // Start is called before the first frame update
    void Start()
    {
        button = GetComponent<Button>();
        audioSource = GetComponent<AudioSource>();
        button.onClick.AddListener(OnPressed);
        spriteRenderer = GetComponent<Image>();
    }

    void OnPressed() {
        muted = !muted;
        AudioListener.volume = muted ? 0 : 1;
        spriteRenderer.sprite = muted ? mutedSprite : unmutedSprite;
    }
}
