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

---

## Hi I’m Mikey

I am Mikey, aka **@ahdinosaur**, aka [mikey.nz](https://mikey.nz).

I'm a Rust developer based in New Zealand who cares about creative tech and community.

---

## I made this LED cube

I'm going to show you how, from first principles.

---

## Talk Outline

- `1.` `Driver`: How to make an LED be a color
  - `1.1.` `Color`: How our eyes perecive light
- `2.` `Layout`: Where are the LEDs in space
- `3.` `Pattern`: How to animate the space with color
- `4.` `Control`: How to put these together
- `5.` Quickstart: How to start an LED project now

---

## 1. Driver

How to make an LED be a color

---

### Let's start with LED basics

---

### What are LEDs

LED = Light-emitting diode

Black magic where a tiny surface emits light.

---

### What are RGB LEDs

RGB = Red + Green + Blue

3 LEDs next to each other.

We use red, green, and blue because those most closely match our 3 photo-receptors in our eyes, more on that later.

---

### What are addressable LEDs?

- You only talk to one LED, but after it's been given a color it passes on the next color to the next LED.
- Like filling a bucket, that overflows to the next bucket.
- So you must tell provide a color to every LED on every frame

---

### So how do we talk to these LEDs?

There's two main types of addressable LEDs:

- "Clocked": e.g. DotStar LEDs
- "Clockless": e.g. NeoPixel LEDs

---

### Basic `Driver` trait

We'll start with a basic `Driver` trait, similar to `smart-leds-trait`:

```rust
pub struct Rgb {
    red: u8,
    green: u8,
    blue: u8,
}

pub trait Driver {
    type Error;
    type Color;

    fn write<I>(&mut self, pixels: I) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = Rgb>;
}
```

<!--

By using an iterator, we can avoid alloc.

-->

---

### How do we talk to "clocked" LEDs?

---

### Using Rust to talk to "clocked" LEDs

---

### How do we talk to "clockless" LEDs?

---

### Using Rust to talk to "clockless" LEDs

---

### Using a trait to represent "clockless" timings

Since we want to support all possible "clockless" LED chipsets, we can represent the timings for a particular chipset as a trait.

Then, we can implement a driver using the timing trait as an argument (a generic type).

---

### The problem with naive RGB

---

## 1.1. Color

How our eyes perceive light

---

TODO

---

### Color challenges


- Challenges
  - integers vs floats
  - Brightness
  - Color systems
    - sRGB vs linear sRGB vs HSV vs OkHsv
  - Color correction
  - (Future work: Multi-LED systems)

---

### A better `Driver` trait

Now we want to improve how our `Driver` handles colors, with respect to human perception.

---

## 2. Layout

Where are the LEDs in space

---

### Backstory: Tetrahedron using Rust

---

### Backstory: Tensegrity using WLED

---

### `Layout1d`

---

### Using `Layout1d`

---

### `Layout2d`

---

### `Shape2d`

---

### Learning: How to returning an iterator with no-alloc

---

### `Point2d`

---

### `Line2d`

---

### `Grid2d`

Notice the zig zag

---

### Using `Layout2d`

---

### `Layout3d`

---

### `Shape3d`

Like `Shape2d`

---

### Using `Layout3d`

---

## 3. Pattern

How to animate the space with color

---

### ???

---


## 4. `Control`

How to put these together

---

### ???

---

## 5. Quickstart

How to start an LED project now

---

### ???

---

IGNORE BELOW HERE, IS OLD NEWS

---

## Talk outline

- About me
- Prior projects
  - Tetrahedron using Rust
  - Tensegrity using WLED
- Overview
  - Layout: Where are the LEDs in space
  - Pattern: How to color the space
  - Driver: How to make an LED be a color
  - (Future work: interactions)
- Start with Driver: How to make an LED be a color
- Initial Driver trait (`smart-led`)
- Clocked (APA102 aka DotStar) LEDs
- Clockless (WS2812 aka NeoPixel) LEDs
- Create a rainbow
- Challenges
  - integers vs floats
  - Brightness
  - Color systems
    - sRGB vs linear sRGB vs HSV vs OkHsv
  - Color correction
  - (Future work: Multi-LED systems)
- New driver trait
- New colors
- New rainbow
- Make the rainbow scroll with time
- Rainbow as Pattern
- So that’s 1d, let’s do 2d
- How do pixels get laid out on a panel (note the zig zag)
- Make a scrolling rainbow in 2d
- Thinking in spaces rather than LEDs
- Counter examples:
  - Vegas Sphere, map 2d onto 3d
- 2d: map 2d as a space from -1.0 to 1.0
  - We create shapes in that space
  - We have a function that returns points for each pixel in that space
- Introducing Layout: Where are the LEDs in space
- Layout structs
  - Layout1d
  - Layout2d
- Introducing Pattern: How to color the space
- Pattern trait
- 1d examples
- 2d examples
- Now let’s do 3d!
- Map 3d as a space from -1.0 to 1.0
- Layout3d Trait
- Pattern Trait
- 3d examples
- Put it all together: Control
- How to start now

---

## The goals of this talk

1. You understand more about how LEDs work
2. You learn more Rust
2. You understand how to animate LEDs for fun and art

---

My goal is to build an LED cube with Rust.

---

## Prior projects – Tetrahedron (Rust)

---

## Prior projects – Tensegrity (WLED)

---

## Overview

- Layout: Where are the LEDs in space
- Pattern: How to color the space
- Driver: How to make an LED be a color

<!--
- Not including: Interactions
-->

---

## Start with `Driver`

How to make an LED be a color

---

## Initial `Driver` trait


```rust
pub trait Driver {
    type Error;
    type Color;

    fn write<I, C>(
        &mut self,
        pixels: I,
        brightness: f32,
        correction: ColorCorrection,
    ) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = C>,
        Self::Color: FromColor<C>;
}
```

<!--

By the way, **props to `smart-leds`** for paving the way on addressable LED drivers in Rust.

-->

---

## Clocked LEDs (APA102 / DotStar)

> A clocked protocol is based on SPI, where chipsets have a data line and a clock line.
> For every bit we want to send from the controller to the LEDs:
>
> - First the controller sets the data line (MOSI) to HIGH for a 1 or LOW for a 0.
> - Then the controller “ticks” the clock line (SCLK), by going from LOW to HIGH.
> - On the rising edge of the clock line, the LED will read the data line.
> - Halfway through the clock cycle, the controller will reset the clock line to LOW.

---

## Clockless LEDs (WS2812 / NeoPixel)

> A clockless protocol is based on specific timing periods, where chipsets have only a single data line.
> For example with WS2812B LEDs, to represent a 0 bit the data line must be HIGH for 0.4 µs, then LOW for 0.85 µs. These timings must be accurate to within 150 ns. That's tiny!

---

## Create a rainbow

> We have two visual patterns to start, each implementing `Pattern` for 1D, 2D, and soon 3D.
> - **Rainbow**: A basic scrolling rainbow.

---

## Challenges

- integers vs floats
- Brightness
- Color systems
  - sRGB vs linear sRGB vs HSV vs OkHsv
- Color correction
- (Future work: Multi-LED systems)

> Therefore, we use `LinearSrgb` when thinking about LEDs, since linear color values correspond to the luminous intensity of light, i.e. how many photons should be emitted.
> … This mismatch between physics and perception is why the “RGB” you think you know is actually gamma-encoded sRGB. … By the way, if you start mixing RGB's, make sure to do so in the linear space.

---

## New driver trait

```rust
pub trait Driver {
    type Error;
    type Color;

    fn write<I, C>(
        &mut self,
        pixels: I,
        brightness: f32,
        correction: ColorCorrection,
    ) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = C>,
        Self::Color: FromColor<C>;
}
```

---

## New colors

<!-- (content to be filled once written in a blog post) -->

---

## New rainbow

<!-- (content to be filled once written in a blog post) -->

---

## Make the rainbow scroll with time

```rust
layout1d!(Layout, 60);

let mut control = ControlBuilder::new_1d()
    .with_layout::<Layout>()
    .with_pattern::<Rainbow>(RainbowParams { ..Default::default() })
    .with_driver(ws2812!(p, Layout::PIXEL_COUNT))
    .build();

loop {
    let elapsed_in_ms = elapsed().as_millis();
    control.tick(elapsed_in_ms).unwrap();
}
```

---

## Rainbow as Pattern

> A pattern, most similar to a WLED effect, generates colors for LEDs based on time and position.

```rust
pub trait Pattern<Dim, Layout>
where
    Layout: LayoutForDim<Dim>,
{
    type Params;
    type Color;

    fn new(params: Self::Params) -> Self;
    fn tick(&self, time_in_ms: u64) -> impl Iterator<Item = Self::Color>;
}
```

---

## So that’s 1D – let’s do 2D

---

## How do pixels get laid out on a panel? (zig-zag)

> `serpentine: true`

---

## Scrolling rainbow in 2D

```rust
layout2d!(
    Layout,
    [Shape2d::Grid {
        start: Vec2::new(-1., -1.),
        horizontal_end: Vec2::new(1., -1.),
        vertical_end: Vec2::new(-1., 1.),
        horizontal_pixel_count: 16,
        vertical_pixel_count: 16,
        serpentine: true,
    }]
);
```

---

## Thinking in spaces rather than LEDs

> We aren't mapping 2D pixels onto a 3D surface, we're directly calculating the animation for each pixel in 3D space.
> What if we animated the pixels using a 3D-native approach?

---

## Prior projects – Tetrahedron (Rust)

> To understand what I mean about 3D layouts, look back at my LED tetrahedron:
> Each pixel has a position in 3D space. Unlike most 2D or 3D projection mappings, which take a 2D raster (pixels from an image or video) and project onto a 2D or 3D surface, the LED tetrahedron is more like a graphics shader, where for each pixel (which has a 3D position), and given the current time, you calculate the color. So we aren't mapping 2D pixels onto a 3D surface, we're directly calculating the animation for each pixel in 3D space.

---

## Prior projects – Tensegrity (WLED)

> In this case, I used WLED, which at the time only supported multiple 1D segments of 1D strips, now supports 2D grids. I made a 1D segment for every strut of the tensegrity.
> While this still looks good, it's missing the same spatial feel, each strut more or less looks the same.

---

## Counter-example: Vegas Sphere

> Even in the best mappings, these are still 2D screens wrapped around a 3D surface, which means limitations.

---

## 2D: map space -1.0 → 1.0

> For our 2D space, we can think of:
> `(-1.0, -1.0)` bottom left → `(1.0, 1.0)` top right.

---

## Create shapes in that space

> points, lines, grids, arcs, etc.

---

## A function that returns points for each pixel

> `.points()` maps each LED pixel into space between -1.0 and 1.0.

---

## Introducing Layout: Where are the LEDs?

> To define a layout, we must implement either the `Layout1d`, `Layout2d`, or soon `Layout3d` traits.

---

## Layout structs

- `Layout1d`
- `Layout2d`

---

## Introducing Pattern: How to color the space

> The pattern will compute colors for each LED based on its position.

---

## Pattern trait (again)

*(see earlier slide for code)*

---

## 1D examples

*(rainbow code already shown)*

---

## 2D examples

*(noise grid example from blog)*

```rust
with_pattern::<Noise2d<noise_fns::Perlin>>(NoiseParams { ..Default::default() })
```

---

## Now let’s do 3D!

> 3D layouts are coming soon, because I want an LED cube with native 3D animations!

---

## 3D space -1.0 → 1.0

<!-- future blog text TBD -->

---

## Layout3d Trait

<!-- future blog text TBD -->

---

## Pattern Trait (3D)

<!-- future blog text TBD -->

---

## 3D examples

<!-- future blog text TBD -->

---

## Put it all together: Control

> We use a `ControlBuilder` to build a `Control`. Then we run our main loop, calling `.tick()` with the current time in milliseconds.

---

## How to start now

> Blinksy also has a way to simulate on your desktop: `blinksy-desktop`.
> **Quickstart:** <https://github.com/ahdinosaur/blinksy-quickstart-gledopto>

---

layout: center
class: text-center
---

## Learn More

<https://blinksy.dev>

<PoweredBySlidev mt-10 />
