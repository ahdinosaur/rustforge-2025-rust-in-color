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
