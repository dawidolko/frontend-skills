# Launch kit

| File | What it is |
| --- | --- |
| `thumbnail-youtube.png`, `.jpg` | Video thumbnail, 1280×720, in Polish (`thumbnail-youtube-en.*` in English) |
| `thumbnail-linkedin.png`, `.jpg` | Post image, 1200×627, in Polish (`thumbnail-linkedin-en.*` in English) |
| `linkedin-post-pl.txt`, `linkedin-post-en.txt` | The announcement post in Polish (the main one) and English |
| `thumbnail.html`, `build.mjs` | The thumbnail's source and the script that renders it |

The thumbnails show the author's portrait, which is passed to the script and not stored here:

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright/index.mjs node media/launch/build.mjs --photo <portrait.png>
```

The counts on the thumbnail are read from the dictionary when it is rendered. The video itself is built from
[`media/video/`](../video/README.md).
