---
theme: ./theme
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
title: 'Rust in Color: Embedded LED Art'
info: |
  ## Rust in Color: Embedded LED Art

  Beautiful art with LEDs:

  > Using _no-std_ _no-alloc_ **Rust** to animate an LED cube

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

TODO

On the "start" and "end" slides of each section, show the whole outline, with an arrow to the point we are starting or ending. Or just have on start, because is clear now what we ended.

---

# Rust In Color: Embedded LED Art

Beautiful art with LEDs:

> Using _no-std_ _no-alloc_ **Rust** to animate an LED cube

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ahdinosaur/rustforge-2025-rust-in-color" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

---

## Hi I’m Mikey

I am Mikey, aka **@ahdinosaur**, aka [mikey.nz](https://mikey.nz).

- Node.js + Rust developer
- Based in Aotearoa New Zealand
- Cares about creative tech and community

---

## I made this LED cube

I'm going to show you how.

---

### Backstory: I like LEDs

<!--

Not sure why, LEDs tickle my brain in a great way.

-->

---

### Prior art: LED suspenders using FastLED

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-suspenders.mp4#t=15" type="video/mp4">
</video>

---

### Prior art: Tetrahedron using Rust

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tetrahedron.mp4" type="video/mp4">
</video>

<!--

This was early days for me and Rust.

In this project I came to my realization: each LED pixel should have a position in 3d space.

We use this position in 3d space to compute the color for each animation frame.

-->

---

### Prior art: Tensegrity using WLED

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tensegrity.mp4" type="video/mp4">
</video>

<!--

WLED is off-the-shelf software for LED projects.

-->

---

### LEDs + Rust = <3

<!--

Since we're here for Rust, here's how to use LEDs plus Rust to make magic.

-->

---

## Start with the top

```rust
let mut control = ControlBuilder::new_3d()
    .with_layout::<CubeLayout>()
    .with_pattern::<Noise3d<noise_fns::Perlin>>(NoiseParams::default())
    .with_driver(ws2812!(p, Layout::PIXEL_COUNT))
    .build();

loop {
    let elapsed_in_ms = elapsed().as_millis();
    control.tick(elapsed_in_ms).unwrap();
}
```

---

## Outline

- `1.` `Driver`: How to make an LED be a color
  - `1.1.` `Color`: How our eyes perecive light
- `2.` `Layout`: Where are the LEDs in space
- `3.` `Pattern`: How to animate the space with color
- `4.` `Control`: How to put these together
- `5.` Quickstart: How to start an LED project now

<!--

Let's start with the smallest building block, the LED, and build up from there.

-->

---

## 1. LED Driver

How to make an LED be a color

---

### Let's start with LED basics

---

### What are RGB LEDs

LED = Light-emitting diode

<!--

Black magic where a tiny surface emits light.

-->

---

### What are RGB LEDs

RGB = Red + Green + Blue

TODO image like https://circuitcamp.wordpress.com/2018/10/11/adafruit-neopixel-ws2812-led-complete-beginners-guide/

or https://www.youtube.com/watch?v=lIePNCM7ldc

<!--

3 LEDs next to each other.

We use red, green, and blue because those most closely match our 3 photo-receptors in our eyes, more on that later.

-->

---

### What are addressable LEDs?

- You only talk to one LED, but after it's been given a color it passes on the next color to the next LED.
- Like filling a bucket, that overflows to the next bucket.
- So you must tell provide a color to every LED on every frame

<div style="display: flex; flex-direction: row; justify-content: center; align-items: center; height: 20%;">
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
</div>

---

### Basic LED `Driver` trait

```rust
pub struct Rgb {
    red: u8,
    green: u8,
    blue: u8,
}

pub trait Driver {
    type Error;

    fn write<I>(&mut self, pixels: I) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = Rgb>;
}
```

<!--

We'll start with a basic `Driver` trait, similar to `smart-leds` crate.

We use an iterator to avoid heap allocations and minimize the memory usage.

-->

---

### "Clocked" LEDs

- Two wires: data + clock
- Each bit: set data, tick clock, repeat

<img src="/media/clocked-transmission.svg" />

<!--

A clocked protocol is based on SPI, where chipsets have a data line and a clock line.

For every bit we want to send from the controller to the LEDs:

- First the controller sets the data line (MOSI) to HIGH for a 1 or LOW for a 0.
- Then the controller “ticks” the clock line (SCLK), by going from LOW to HIGH.
- On the rising edge of the clock line, the LED will read the data line.
- Halfway through the clock cycle, the controller will reset the clock line to LOW.

-->

---

### "Clockless" LEDs

- One wire, no clock
- Bits are based on specific timings

<div style="height: 70%; display: flex; justify-content: center; align-items: center;">
  <img alt="Clockless timing" src="/media/clockless-timing.svg" style="height: 100%;" />
</div>

<!--

We'll be focusing on "Clockless" LEDs, as that's what I'm using for the cube.

For example with WS2812B LEDs, to represent a 0 bit the data line must be HIGH for 0.4 µs, then LOW for 0.85 µs. These timings must be accurate to within 150 ns. That's tiny!

Example timing (WS2812B):

- 0-bit: HIGH ~0.4µs, then LOW ~0.85µs
- 1-bit: HIGH ~0.8µs, then LOW ~0.45µs

-->

---

### Clockless LEDs (Part 2)

- One wire, no clock
- Bits are based on specific timings

<div style="height: 70%; display: flex; justify-content: center; align-items: center;">
  <img alt="Clockless transmission" src="/media/clockless-transmission.svg" style="height: 100%;" />
</div>

---

### Using a trait to represent a "Clockless" chipset

```rust
pub trait ClocklessLed {
    /// Duration of high signal for transmitting a '0' bit.
    const T_0H: Nanoseconds;

    /// Duration of low signal for transmitting a '0' bit.
    const T_0L: Nanoseconds;

    /// Duration of high signal for transmitting a '1' bit.
    const T_1H: Nanoseconds;

    /// Duration of low signal for transmitting a '1' bit.
    const T_1L: Nanoseconds;

    /// Duration of the reset period at the end of a transmission.
    ///
    /// This low signal period marks the end of a data frame and allows the LEDs
    /// to latch the received data and update their output.
    const T_RESET: Nanoseconds;

    /// Specification of the color channel order and format.
    ///
    /// Different LED chipsets may expect data in different channel orders (e.g., RGB, GRB, RGBW).
    const LED_CHANNELS: LedChannels;
}
```

<!--

Since we want to support all possible "Clockless" LED chipsets, we can represent the timings for a particular chipset as a trait.

Then, we can implement a driver using the timing trait as an argument (a generic type).

-->

---

### Impl Clockless with RMT

---

### The problem with naive RGB

---

## 1.1. Color

How our eyes perceive light

<!--

Versus what LEDs emit.

-->

---

### Pulse-width modulation

![LED PWM (Pulse-Width Modulation)](/media/led-pwm.svg)

<!--

Each LED is controlled via pulse-width modulation (PWM).

- If you tell an LED to be 100% bright, it will be on for 100% of the time (a 100% duty cycle).
- If you tell an LED to be 50% bright, it will be on for 50% of the time (a 50% duty cycle).

And so on. Our eyes don’t notice the flicker on and off.

-->

---

### Perception vs physics

Perceived brightness ≠ emitted photons

What we perceive to a linear change in photons is not linear.

![Gamma correction](/media/gamma-correction.svg)

<!--

For our evolutionary survival, we are much more sensitive to changes in dim light than we are to changes in bright light. If you double the amount of photons, we don’t see double the brightness.

This mismatch between physics and perception is why the “RGB” you think you know is actually gamma-encoded sRGB. sRGB allows us to think in terms of perception, where double the red value means double the perceived brightness of red. Then for LEDs, we convert the gamma-encoded sRGB to linear, to use as a gamma-corrected duty cycle.

By the way, if you start mixing RGB's, make sure to do so in the linear space.

-->

---

### Color systems

- sRGB: What we think as "RGB"
- Linear RGB: What use for LEDs
- HSV: An easy color system
- OkHsv: A new color system

A `FromColor` trait converts between all the colors.

---

### A better `Driver` trait

Now we want to improve how our `Driver` handles colors, with respect to human perception.

```rust
pub trait Driver {
    type Error;
    type Color;

    fn write<I, C>(
        &mut self,
        pixels: I,
        brightness: f32,
    ) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = C>,
        Self::Color: FromColor<C>;
}
```

<!--

Changes?

- FromColor trait
- brightness: f32

Most drivers expect Linear RGB as their color.
-->

---

### Recap: LED Driver

How to make an LED be a color

---

## 2. Layout

Where are the LEDs in space

---

### Thinking in spaces rather than LEDs

A common approach is to think in terms of arrays of pixels.

But what if instead, every pixel had a position in space?

<!--

Think like graphics shaders.

-->

---

### Backstory: Tetrahedron using Rust

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tetrahedron.mp4" type="video/mp4">
</video>

<!--

To understand what I mean about 3D layouts, look back at my LED tetrahedron:

Each pixel has a position in 3D space. Similar to a graphics shader, for every frame we calculate the color of every pixel, using its position and the current time.

-->


---

### Backstory: Tensegrity using WLED

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tensegrity.mp4" type="video/mp4">
</video>

<!--

Since I used WLED, there's no concept of 3d position, each strut is a 1d segment with an array of pixels.

While this still looks good, it's missing the same spatial feel, each strut more or less looks the same.

-->

---

### Counter-example: Cubes with WLED

---

### Counter-example: DIY Vegas sphere

<!--

- Wrapping a matrix around a sphere bunches pixels at poles
- That’s only a problem if you must map a 2D raster
- 3D-native patterns avoid uneven sampling artifacts

Even in the best mappings, these are still 2D screens wrapped around a 3D surface, which means limitations.

-->

---

### `Layout3d`

Map 3d space -1.0 → 1.0

- **X:** `-1.0` (left) → `1.0` (right)
- **Y:** `-1.0` (bottom) → `1.0` (top)
- **Z:** `-1.0` (back) → `1.0` (front)

<!--

Why -1.0 → 1.0? So 0.0 is the middle.

-->

---

### `Shape3d`

Create shapes in that space

> points, lines, grids, arcs, etc.

```rust
/// Enumeration of three-dimensional shape primitives.
///
/// Each variant represents a different type of 3D arrangement of LEDs.
#[derive(Debug, Clone)]
pub enum Shape3d {
    /// A single point at the specified location.
    Point(Vec3),

    /// A line of LEDs from `start` to `end` with `pixel_count` LEDs.
    Line {
        /// Starting point of the line
        start: Vec3,
        /// Ending point of the line
        end: Vec3,
        /// Number of LEDs along the line
        pixel_count: usize,
    },

    /// A grid of LEDs defined by three corners and dimensions.
    Grid {
        /// Starting point (origin) of the grid
        start: Vec3,
        /// Ending point for first horizontal row (defines the horizontal axis)
        horizontal_end: Vec3,
        /// Ending point for first vertical column (defines the vertical axis)
        vertical_end: Vec3,
        /// Number of LEDs along each horizontal row
        horizontal_pixel_count: usize,
        /// Number of LEDs along each vertical column
        vertical_pixel_count: usize,
        /// Whether horizontal rows of LEDs are wired in a zigzag pattern
        serpentine: bool,
    },
}
```

---

### `shape.pixel_count()`

```rust
impl Shape3d {
    /// Returns the total number of pixels (LEDs) in this shape.
    pub const fn pixel_count(&self) -> usize {
        match *self {
            Shape3d::Point(_) => 1,
            Shape3d::Line { pixel_count, .. } => pixel_count,
            Shape3d::Grid {
                horizontal_pixel_count,
                vertical_pixel_count,
                ..
            } => horizontal_pixel_count * vertical_pixel_count,
            Shape3d::Arc { pixel_count, .. } => pixel_count,
        }
    }
```

---

### `shape.points()`: A function that returns points for each pixel

> `shape.points()` maps each LED pixel into space between -1.0 and 1.0.

```rust
impl Shape3d {
    /// Returns an iterator over all points (LED positions) in this shape.
    pub fn points(&self) -> Shape3dPointsIterator {
        match *self {
            // Shape3d::Point => ...
            // Shape3d::Line => ...
            // Shape3d::Grid => ...
        }
        // ...
    }
}
```

<!--

How do we return a different iterator for each case, without allocations?

If we can't return `Box<dyn Iterator>`, what do we do?

Return a struct that `impl Iterator`, which wraps sub-iterators for each case.

-->

---

### Multi-case iterator with no-alloc

```rust
/// Iterator over points in a 3D shape.
#[derive(Debug)]
pub enum Shape3dPointsIterator {
    /// Iterator for a single point
    Point(Once<Vec3>),
    /// Iterator for points along a line
    Line(StepIterator<Vec3, f32>),
    /// Iterator for points in a grid
    Grid(GridStepIterator<Vec3, f32>),
}


impl Iterator for Shape3dPointsIterator {
    // ...
}
```

---

### LED Grids

<img src="/media/layout-2d-points.svg" />

<!--

Zig zag

-->

---

### Using `Layout3d`

---

### Recap: Layout

Where are the LEDs in space

## 3. Pattern

How to animate the space with color

<!--

A pattern, most similar to a WLED effect, generates colors for each LED based on time and position.

-->

---

### `Pattern` trait

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

<!--

- Works for 1D, 2D, and 3D
- Iterator output stays no-alloc

-->

---

### `Dim` and `LayoutForDim`?

```rust
pub trait Pattern<Dim, Layout>
where
  Layout: LayoutForDim<Dim>,
{
    // ...
}
```

And

```rust
impl<Layout: Layout1d> Pattern<Dim1d, Layout> for MyPattern {
    // ...
}
```

Because you can't:

```rust
impl<Layout: Layout1d> Pattern<Layout> {
    // ...
}

impl<Layout: Layout2d> Pattern<Layout> {
    // ...
}
```

<!--

`Dim` is a type marker which allows us to use a single `Pattern` trait for all dimensions: 1d, 2d, 3d.

This is because you can't implement the same trait with different generics.

`Dim` is a generic type, we have the concrete types: `Dim1d`, `Dim2d`, `Dim3d`.

Then, we have a trait `LayoutForDim`, which constrains the Layout to match the Dim marker.

-->

---

### Noise functions

(x, y, z, w) -> random number

<!--

Noise functions are random generators that are given a point and that smoothly interpolate over nearby points.

-->


---

### Noise `Pattern`

Using 4d noise function to generate colors in 3d.

```rust
/// Generates colors for a 3D layout using noise.
///
/// The pattern uses the LED x,y,z position and time as inputs to a 4D noise function,
/// mapping the noise value to a hue and value in the Okhsv color space.
fn tick(&self, time_in_ms: u64) -> impl Iterator<Item = Self::Color> {
    let Self { hue_noise, value_noise, params } = self;
    let NoiseParams { time_scalar, position_scalar } = params;

    let noise_time = time_in_ms as f32 * time_scalar;

    Layout::points().map(move |point| {
        let noise_args = [
            position_scalar * point.x,
            position_scalar * point.y,
            position_scalar * point.z,
            noise_time,
        ];
        let hue = hue_noise.sample4(noise_args);
        let saturation = 1.;
        let value = 0.75 + 0.25 * value_noise.sample4(noise_args);
        Okhsv::new(hue, saturation, value)
    }
}
```

---

### Recap: Pattern

How to animate the space with color

---


## 4. `Control`

How to put these together

### `Control` struct

Then we run our main loop, calling `.tick()` with the current time in milliseconds.

### `Control`'s type signature is out of control

### Enter `ControlBuilder`

We use a `ControlBuilder` to build a `Control`.

---

### ???

---

## 5. Quickstart

How to start an LED project now

---

### Blinksy

---

### Desktop

> Blinksy also has a way to simulate on your desktop: `blinksy-desktop`.

---

### Quickstart project

<https://github.com/ahdinosaur/blinksy-quickstart-gledopto>

<!--

- Allows you to write code and run on both desktop and microcontroller.
- Uses Gledopto microcontroller, an affordable device on AliExpress

-->

---

### ???

---

## Come play with me

Find me later, I have LEDs and microcontrollers you can play with.

---

layout: center
class: text-center
---

## Thanks for listening

Blinksy: <https://blinksy.dev>

Me: <https://mikey.nz>

<PoweredBySlidev mt-10 />
