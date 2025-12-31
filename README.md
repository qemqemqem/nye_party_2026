# Time Machine 🕰️⚡

A sci-fi themed "Time Machine" prop for NYE 2026, built for the **University of California, Oakland** collaboration between the **Center for Quantum Chronodynamics** and the **Institute for Applied History**.

## Live Demo

Deploy to GitHub Pages and it just works!

## Features

- **5 Time Periods**: 2025, 1969, 1751, 423 BCE, and 2026
- **Wormhole Animation**: Press 1-5 to initiate time travel with a stunning wormhole effect
- **Hourly Chimes**: Church bell sounds on the hour (12-hour format)
- **Scrolling Facts**: Educational and humorous facts for each era
- **Image Slideshow**: Ken Burns effect with support for videos
- **Cosmic Sci-Fi Theme**: Deep space aesthetic with glowing elements

## Controls

| Key | Action |
|-----|--------|
| `1` | Travel to 2025 CE |
| `2` | Travel to 1969 CE (Moon Landing era) |
| `3` | Travel to 1751 CE (Colonial/Enlightenment) |
| `4` | Travel to 423 BCE (Ancient Greece) |
| `5` | Travel to 2026 CE (The Future!) |
| `Space` | Exit wormhole and arrive at destination |
| `B` | Test bell chimes (plays current hour) |
| `T` | Test 3 chimes (quick test) |

## Setup

### 1. Add Images

Place images in the appropriate folders:
- `images/2025/`
- `images/1969/`
- `images/1751/`
- `images/423bce/`
- `images/2026/`

Then update `images/manifest.json`:

```json
{
    "2025": ["photo1.jpg", "photo2.png"],
    "1969": ["apollo.jpg", "moonlanding.mp4"],
    "1751": ["colonial.jpg"],
    "423bce": ["parthenon.jpg", "socrates.png"],
    "2026": ["future.jpg"]
}
```

**Video Support**: If you include `.mp4`, `.webm`, or `.mov` files, they'll play as part of the slideshow!

### 2. Add Audio

Place these audio files in `audio/`:
- `bell.mp3` - Church bell sound (for hourly chimes)
- `wormhole.mp3` - Whooshing tunnel sound (loops during travel)
- `arrival.mp3` - Arrival/materialization sound

See `audio/README.md` for recommendations.

### 3. Deploy to GitHub Pages

1. Push to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → `main` → `/ (root)`
4. Wait a minute, then visit `https://yourusername.github.io/nye_party_2026/`

## Local Development

```bash
# Start a local server
python3 -m http.server 8080

# Visit http://localhost:8080
```

## Customizing Facts

Edit the text files in `facts/`:
- `facts/2025.txt` - Time machine meta-jokes
- `facts/1969.txt` - Moon landing era
- `facts/1751.txt` - Enlightenment era
- `facts/423bce.txt` - Ancient Greece
- `facts/2026.txt` - Future predictions

One fact per line. They'll scroll in the ticker at the bottom.

## Credits

Built with ❤️ and chronitons by the UC Oakland temporal research team.

*"The future is already here — it's just not very evenly distributed."*
— William Gibson
