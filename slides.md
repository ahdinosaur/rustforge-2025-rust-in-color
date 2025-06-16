---
theme: ./theme
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
title: 'Rust in Color: Embedded LED Art'
info: |
  ## Rust in Color: Embedded LED Art

  Let's goooooooo.

  <https://blinksy.dev>

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

What what what

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ahdinosaur/rustforge-2025-rust-in-color" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Slide notes?
-->

---
---

# Hi I'm Mikey

I like computers and stuff.

<!--
-->

---
---

# What is this about?

<Toc text-sm minDepth="1" maxDepth="1" />

---
---

# Let's test some code

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

# Learn More

<https://blinksy.dev>

<PoweredBySlidev mt-10 />
