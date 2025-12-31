# Time Machine Web App - Build Plan 🕰️⚡

## Overview
A sci-fi themed "Time Machine" prop for NYE party. Hosted on GitHub Pages.

## Design Decisions (Confirmed)
- **Theme**: Cosmic sci-fi (deep blues, purples, starfield) - consistent across all eras
- **Clock Format**: 12-hour for chimes
- **Date Format**: CE/BCE
- **Controls**: Hidden (keyboard only)
- **Starting State**: 2025 with "System Operational" message
- **Branding**: "University of California Oakland" watermark
  - Center for Quantum Chronodynamics
  - Institute for Applied History

## Year Mapping
| Key | Year | Notes |
|-----|------|-------|
| 1 | 2025 CE | Starting point, "standby" facts about time machine |
| 2 | 1969 CE | Moon landing era, may include video |
| 3 | 1751 CE | Colonial/Enlightenment era |
| 4 | 423 BCE | Ancient Greece (Peloponnesian War era) |
| 5 | 2026 CE | The Future! NYE destination |

---

## Project Structure
```
nye_party_2026/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js           # Main application logic
│   ├── wormhole.js      # Wormhole animation
│   ├── chimes.js        # Hourly bell chimes
│   └── slideshow.js     # Image/video slideshow
├── audio/
│   ├── bell.mp3         # Single church bell bong
│   ├── wormhole.mp3     # Whooshing tunnel sound
│   └── arrival.mp3      # Landing sound effect
├── images/
│   ├── 2025/            # User will populate
│   ├── 1969/            # User will populate (may include .mp4)
│   ├── 1751/            # User will populate
│   ├── 423bce/          # User will populate
│   └── 2026/            # User will populate
├── facts/
│   ├── 2025.txt         # Facts + time machine jokes
│   ├── 1969.txt         # Moon landing era facts
│   ├── 1751.txt         # Enlightenment era facts
│   ├── 423bce.txt       # Ancient Greece facts
│   └── 2026.txt         # Future predictions/jokes
└── notes/
    └── ai/
        └── TIME_MACHINE_PLAN.md
```

---

## Build Order (Todos)

### Phase 1: Foundation
1. [ ] Create HTML structure with all containers
2. [ ] Create CSS with cosmic sci-fi theme
   - Starfield background (CSS animated)
   - Glowing text effects
   - Portal/frame styling
   - Scrolling ticker for facts
   - Bouncing/floating year display
   - UCO watermark styling

### Phase 2: Core Functionality
3. [ ] Create main app.js - state management & keyboard controls
4. [ ] Create slideshow.js - image rotation with Ken Burns effect
   - Support for video files (.mp4, .webm) if present
5. [ ] Create facts loader - parse and rotate facts from txt files

### Phase 3: Wormhole
6. [ ] Create wormhole.js - tunnel animation
   - CSS/Canvas based swirling tunnel
   - Random rotation/turns
   - Triggered by number keys
   - Exits on spacebar

### Phase 4: Audio
7. [ ] Create chimes.js - hourly bell system
   - Check time every minute
   - Play N bongs on the hour
8. [ ] Integrate wormhole and arrival sounds

### Phase 5: Content
9. [ ] Write facts for all 5 years
10. [ ] Create placeholder system for images

### Phase 6: Polish
11. [ ] Test all transitions
12. [ ] Ensure GitHub Pages compatibility (no server-side code)
13. [ ] Add any final visual polish

---

## Technical Notes

### GitHub Pages Constraints
- No server-side code - all client-side JS
- Facts files will need to be fetched via fetch() API
- Images need to be listed in a manifest (can't directory-list on GH Pages)

### Image Manifest Approach
Since GitHub Pages can't list directories, we'll use a JSON manifest:
```json
// images/manifest.json
{
  "2025": ["img1.jpg", "img2.jpg"],
  "1969": ["apollo.jpg", "moonlanding.mp4"],
  ...
}
```
User updates this when adding images.

### Video Support
- Check file extension for .mp4, .webm, .mov
- Use HTML5 <video> element with autoplay, muted initially
- Play once through, then continue slideshow
- Simple implementation - no complex controls

### Wormhole Animation Approach
- CSS 3D transforms for tunnel effect
- Multiple concentric rings with perspective
- Animated rotation and scale
- Particle overlay for energy effect
- Random direction changes every 1-2 seconds

### Audio Notes
- Use Web Audio API for precise timing on chimes
- Wormhole sound loops until spacebar
- Bell sound: need a good long church bell sample
- Consider generating with Web Audio API as fallback

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [UCO WATERMARK - top right corner, subtle]                  │
│                     Center for Quantum Chronodynamics       │
│                     Institute for Applied History           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ★  ·  ✦    ·    ★   ·  ✦                      │
│         ·        ╔══════════════╗         ·                │
│      ✦           ║    2025      ║           ★              │
│                  ║      CE      ║                          │
│         ·        ╚══════════════╝        ·                 │
│    ★                                           ✦            │
│         ┌─────────────────────────────────┐                │
│         │                                 │                │
│         │      [SLIDESHOW IMAGE]          │                │
│         │      with Ken Burns effect      │                │
│         │      in circular portal frame   │                │
│         │                                 │                │
│         └─────────────────────────────────┘                │
│                    ·    ★    ·                             │
│                                                             │
├═══════════════════════════════════════════════════════════──┤
│ ◄◄ SCROLLING: "The quantum flux capacitor requires 1.21   │
│    gigawatts of temporal energy per jump..."  ►►            │
└─────────────────────────────────────────────────────────────┘
```

---

## Facts Content Plan

### 2025 CE (Starting Point - Time Machine Meta)
- Jokes about how the time machine works
- Fake technical specs
- "Safety warnings"
- UC Oakland branding jokes

### 1969 CE
- Moon landing facts
- Nixon/politics
- Woodstock
- Technology of the era
- Pop culture

### 1751 CE
- Ben Franklin experiments
- Colonial America
- Enlightenment philosophy
- What life was like
- Inventions of the era

### 423 BCE
- Peloponnesian War context
- Socrates/philosophy
- Greek daily life
- Theater and arts
- Democracy in Athens

### 2026 CE
- Playful "predictions"
- NYE party jokes
- "The future is now"
- Optimistic vibes

---

## Ready to Build! 🚀

Starting with Phase 1: Foundation
