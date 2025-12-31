# Performance Best Practices - Time Machine

## Recent Optimizations (Dec 30, 2025)

Fixed choppy animations in the wormhole effect. Key changes made:

### 1. Particle System (`js/wormhole.js`)
- Reduced spawn rate from 60/sec to ~7/sec
- Removed expensive `box-shadow` from individual particles
- Added `will-change` hints for GPU acceleration

### 2. Ring Animation (`css/styles.css`)
- Switched from `width/height` animation to `transform: scale()`
- Reduced box-shadows from 6 to 2 per ring
- Added `will-change: transform, opacity` on `.tunnel-ring`

---

## CSS Animation Guidelines

### DO: Use GPU-Accelerated Properties
These are cheap to animate (compositor-only):
- `transform` (translate, scale, rotate)
- `opacity`

### DON'T: Animate Layout Properties
These trigger expensive recalculations every frame:
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `font-size`

### Example - The Right Way
```css
/* BAD - triggers layout every frame */
@keyframes grow {
    from { width: 20px; height: 20px; }
    to { width: 500px; height: 500px; }
}

/* GOOD - GPU accelerated */
.element {
    width: 20px;
    height: 20px;
    will-change: transform;
}
@keyframes grow {
    from { transform: scale(1); }
    to { transform: scale(25); }
}
```

### Use `will-change` Sparingly
- Only on elements that actually animate
- Don't apply to everything (wastes GPU memory)
- Good candidates: continuously animated elements, elements that animate on user interaction

---

## JavaScript Animation Guidelines

### DOM Creation is Expensive
Every `document.createElement()` + `appendChild()` triggers work. If spawning particles:
- Keep spawn rate reasonable (< 10/sec for decorative effects)
- Reuse DOM elements when possible (object pooling)
- Use CSS animations over JS when possible

### Prefer `requestAnimationFrame` over `setInterval`
```javascript
// BAD - can stack up, not synced to display
setInterval(() => animate(), 16);

// GOOD - synced to display refresh
function animate() {
    // do work
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Clean Up After Animations
Always remove elements when animations complete:
```javascript
element.animate([...], { duration: 1000 })
    .onfinish = () => element.remove();
```

---

## Box-Shadow Performance

Box-shadows are expensive to composite, especially:
- Multiple layered shadows
- Large blur radius values
- Shadows on elements that animate

### Tips
- Keep to 1-2 shadows max on animated elements
- Use smaller blur radii
- Consider using `filter: drop-shadow()` for simple cases (sometimes faster)
- For glowing effects, a single shadow with larger spread can look similar to multiple stacked shadows

---

## Testing Performance

### Browser DevTools
1. Open DevTools → Performance tab
2. Record while triggering animations
3. Look for:
   - Long "Layout" blocks (purple) = layout thrashing
   - Long "Paint" blocks (green) = expensive paints
   - Dropped frames in the FPS graph

### Key Metrics
- Target: 60fps (16.67ms per frame)
- Acceptable: 30fps (33ms per frame)
- Choppy: < 20fps

---

## Current Architecture Notes

### Files Overview
- `js/wormhole.js` - Wormhole tunnel effect (particles + audio)
- `js/slideshow.js` - Image/video rotation with Ken Burns
- `js/app.js` - Main controller, year navigation
- `js/chimes.js` - Hourly bell sounds
- `js/audio-synth.js` - Web Audio API fallback sounds
- `css/styles.css` - All styling and animations

### Wormhole Effect
- 15 tunnel rings animated via CSS (`ring-expand` keyframes)
- Rings use `transform: scale()` for smooth expansion (GPU-accelerated)
- Only `transform` and `opacity` are animated (no layout thrashing)
- Fixed `border` and `box-shadow` on rings (not animated)
- Max 2 box-shadows per ring for compositor efficiency
- Particles created via JS, animated with Web Animations API
- Wiggle effect on `#wormhole-center` adds organic movement

### Cosmic Background Layers (added for visual depth)
All layers use only `transform` and `opacity` animations for GPU acceleration:
- `#wormhole-stars` - Static radial gradients, animates `opacity` only (twinkle)
- `#wormhole-nebula` - Subtle colored clouds, animates `transform` + `opacity` (drift)
- `#wormhole-core` - Golden glowing center, animates `transform` + `opacity` (pulse)
- Color gradient from warm center (cream/gold) to cool edges (purple/violet)

### Main Page Animations
- Starfield twinkle (CSS)
- Portal glow spin (CSS)
- Ken Burns on slideshow images (CSS)
- Year display float (CSS)
- Ticker scroll (CSS)
