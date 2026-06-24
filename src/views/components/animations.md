# Count Updating Animations

Usage in styled component `<Count key={count}>`:

```jsx
const Count = styled.span`
  @keyframes <name> {
    ...
  }
  animation: <name> <duration> <easing>;
`;
```

| Animation | human-language description | CSS |
|-----------|---------------------------|-----|
| **Pop** | Number briefly grows larger then returns — quick "bump" effect | `0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); }` |
| **Bounce** | Overshoots final size (big → small → settle) — playful rubber-band feel | `0% { transform: scale(1); } 30% { transform: scale(1.4); } 50% { transform: scale(0.9); } 70% { transform: scale(1.05); } 100% { transform: scale(1); }` |
| **Fade pulse** | Fades in slightly while scaling up — subtle glow-in effect | `0% { opacity: 0.6; } 50% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); }` |
| **Shake** | Wiggles left and right — draws attention without changing size | `0% { transform: translateX(0); } 25% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 75% { transform: translateX(-1px); } 100% { transform: translateX(0); }` |
| **Glow** | Green halo around text while scaling up — celebration effect | `0% { text-shadow: 0 0 0 transparent; } 50% { text-shadow: 0 0 8px #0f6; transform: scale(1.15); } 100% { text-shadow: 0 0 0 transparent; transform: scale(1); }` |
| **Slide up** | Slides upward from below while fading in — counter rolling over | `0% { transform: translateY(6px); opacity: 0; } 60% { transform: translateY(-2px); opacity: 1; } 100% { transform: translateY(0); opacity: 1; }` |
| **Flip** | 3D card-flip rotation around X axis — dramatic reveal | `0% { transform: perspective(200px) rotateX(90deg); } 50% { transform: perspective(200px) rotateX(-10deg); } 100% { transform: perspective(200px) rotateX(0); }` |
| **None** | Instant update, no visual feedback | remove `key={count}` and animation block |
