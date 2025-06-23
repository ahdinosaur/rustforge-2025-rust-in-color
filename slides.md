---
theme: ./theme
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
title: 'Rust in Color: Embedded LED Art'
info: |
  ## Rust in Color: Embedded LED Art

  Beautiful art with LEDs:

  > Using _no-std_ _no-alloc_ **Rust** to color an LED cube with 3d-native animations

  <https://blinksy.dev>

# https://sli.dev/custom/config-fonts
fonts:
  provider: coollabs

# https://sli.dev/features/drawing
drawings:
  enabled: false

# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left

# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true

# open graph
# seoMeta:
#  ogImage: https://cover.sli.dev
---

# Rust In Color: Embedded LED Art

Beautiful art with LEDs:

> Using _no-std_ _no-alloc_ **Rust** to color an LED cube with 3d-native animations

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ahdinosaur/rustforge-2025-rust-in-color" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Slide notes?
-->

---

## Hi I'm Mikey

I like computers and stuff.

<!--
-->

---

## What in this talk?

- Architecture Overview
- Layouts
  - Prior Art
    - Tetrahedron
    - Tensegrity
    - Vegas Sphere
- Patterns
  - Prior Art: WLED
- Drivers
  - Prior Art: FastLED
- How to start now

---

OR

- About me
- Overview
- Prior projects
    - Tetrahedron using Rust
    - Tensegrity using WLED
- How do addressable LEDs work
- Driver trait
- Clocked (APA102 aka DotStar) LEDs
- Clockless (WS2812 aka NeoPixel) LEDs
- Create a rainbow
- HSV color space
- Make the rainbow scroll with time
- So that's 1d, let's do 2d
- How do pixels get laid out on a panel (note the zig zag)
- Make a scrolling rainbow in 2d
- 3d layouts
- Prior art: Tetrahedron using Rust
- Prior art: Tensegrity using WLED
- Prior art: Vegas Sphere, map 2d onto 3d
- 3d-native
- Go back to 2d: map 2d as a space from -1.0 to 1.0
    - We create shapes in that space
    - We have a function that returns points for each pixel in that space
- Map 3d as a space from -1.0 to 1.0
    - We create shapes in that space
    - We have a function that returns points for each pixel in that space
- Layout3d Trait
- Pattern Trait
- Put it all together: Control
- How to start now


---

### Let's test some code

```rust
layout2d!(
    Layout,
    [Shape2d::Grid {
        start: Vec2::new(-1., -1.),
        row_end: Vec2::new(1., -1.),
        col_end: Vec2::new(-1., 1.),
        row_pixel_count: 16,
        col_pixel_count: 16,
        serpentine: true,
    }]
);
```

---
layout: center
class: text-center
---

## Learn More

<https://blinksy.dev>

<PoweredBySlidev mt-10 />
