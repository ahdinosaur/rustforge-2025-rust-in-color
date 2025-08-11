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

TODO thoughts:

- focus on cube
  - should i drop clocked LEDs?
  - should i drop Layout1d and Layout2d?

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

I'm going to show you how, from first principles.

---

### Backstory: Why I care about LEDs

Shrug, LEDs tickle my brain in a great way.

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

Obviously we're all here for Rust conf, so here's how to use LEDs plus Rust to make magic.

-->

---

## Talk Outline

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

## 1. Driver

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

### So how do we talk to these LEDs?

There's two main types of addressable LEDs:

- "Clocked": e.g. DotStar LEDs
- "Clockless": e.g. NeoPixel LEDs

---

### Basic `Driver` trait

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

### Clocked LEDs

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

Why it’s friendly:

- Timing handled by the clock
- Easy to drive via SPI

-->

---

### APA102 LEDs

<div style="height: 100%; display: flex; justify-content: center; align-items: center;">
  <img alt="APA102 data format" src="/media/apa102-format.png" style="height: 100%;" />
</div>

---

### Impl Apa102 Driver with SPI (Part 1)

```rust
#[derive(Debug)]
struct Apa102Driver<Spi>
where
    Spi: SpiBus<u8>,
{
    writer: Spi,
}

impl<Spi> Driver for Apa102Driver<Spi>
where
    Spi: SpiBus<u8>,
{
    type Error = Spi::Error;

    fn write<I>(&mut self, pixels: I) -> Result<(), Self::Error>
    where
        I: IntoIterator<Item = Rgb>
    {
        // ...
    }
}
```

---

### Impl Apa102 Driver with SPI (Part 2)

```rust
fn write<I>(&mut self, pixels: I) -> Result<(), Self::Error>
where
    I: IntoIterator<Item = Rgb>
{
    // Start frame
    writer.write(&[0x00, 0x00, 0x00, 0x00])

    let mut num_pixels = 0;
    for rgb in pixels.into_iter().inspect(|_| num_pixels += 1) {
        // LED frame
        let brightness = 16; // 0 - 31
        writer.write(&[0b11100000 | (brightness & 0b00011111)])?;

        let led_frame: [u8; 3] = [rgb.blue, rgb.green, rgb.red];
        writer.write(&led_frame)?;
    }

    // End frame(s)
    let num_end_bytes = (num_pixels - 1).div_ceil(16);
    for _ in 0..num_end_bytes {
        writer.write(&[0x00])?
    }

    Ok(())
}
```

---

### Clockless LEDs

- One wire, no clock
- Bits are based on specific timings

<div style="height: 70%; display: flex; justify-content: center; align-items: center;">
  <img alt="Clockless timing" src="/media/clockless-timing.svg" style="height: 100%;" />
</div>

<!--

A clockless protocol is based on specific timing periods, where chipsets have only a single data line.

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

### Using a trait to represent "clockless" timings

Since we want to support all possible "clockless" LED chipsets, we can represent the timings for a particular chipset as a trait.

Then, we can implement a driver using the timing trait as an argument (a generic type).

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
}
```

---

### Impl Clockless with delay

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

<!--

For our evolutionary survival, we are much more sensitive to changes in dim light than we are to changes in bright light. If you double the amount of photons, we don’t see double the brightness.

-->

---

### Gamma correction

What we perceive to a linear change in photons is not linear.

![Gamma correction](/media/gamma-correction.svg)

<!--

This mismatch between physics and perception is why the “RGB” you think you know is actually gamma-encoded sRGB. sRGB allows us to think in terms of perception, where double the red value means double the perceived brightness of red. Then for LEDs, we convert the gamma-encoded sRGB to linear, to use as a gamma-corrected duty cycle.

By the way, if you start mixing RGB's, make sure to do so in the linear space.

-->

---

TODO below

---

### Brightness and gamma

<!--

- Apply gamma correction and a single global brightness
- Keep per-pixel math simple in your pattern

Tip:
- Use Hsv/Okhsv/Okhsl in patterns for intuitive control

-->

---

TODO

### Color systems

- sRGB vs linear sRGB vs HSV vs OkHsv

---

### Srgb

---

### LinearSrgb

LinearSrgb is what we convert into to drive our LEDs

---

### Hsv

---

### Okhsv

---

### FromColor

---

### Color correction

---

### Future work: Multi-LED systems

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
        correction: ColorCorrection,
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
- correction: ColorCorrection
-->

---

### Traits all the way down

<!--

To minimize duplication, we can abstract each LED into traits that describe:

- For clocked LED's, the data format
- For clockless LED's, the timing format
- For all LED's, the order of pixel channel data

And so on, but I don't have enough time to go deeper into this.

-->

---

### Apa102 Trait

---

### Ws2812 Trait

---

### Okay, but what about async?

It's basically the same, but using async.

<!--

You use async peripherals, like async SPI, async pin, and so on.

-->

---

### Recap: Driver

How to make an LED be a color

---

## 2. Layout

Where are the LEDs in space

---

### Thinking in spaces rather than LEDs

A common approach is to think in terms of arrays of pixels.

But what if instead, every pixel had a position in space?

---

### Animating in 3d spaces

A common approach is to map a 2D projection onto a 3D surface.

What if we animated the pixels natively in 3D?

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

Each pixel has a position in 3D space. Unlike most 2D or 3D projection mappings, which take a 2D raster (pixels from an image or video) and project onto a 2D or 3D surface, the LED tetrahedron is more like a graphics shader, where for each pixel (which has a 3D position), and given the current time, you calculate the color. So we aren't mapping 2D pixels onto a 3D surface, we're directly calculating the animation for each pixel in 3D space.

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

### Counter-example: DIY Vegas sphere

<!--

- Wrapping a matrix around a sphere bunches pixels at poles
- That’s only a problem if you must map a 2D raster
- 3D-native patterns avoid uneven sampling artifacts

Even in the best mappings, these are still 2D screens wrapped around a 3D surface, which means limitations.

-->

---

### Counter-example: Cubes with WLED

---


### `Layout1d`

Map 1d space -1.0 → 1.0

- LED 0 at \( -1.0 \), last LED at \( 1.0 \)
- Center is \( 0.0 \)

<!--

Why -1.0 → 1.0? So 0.0 is the middle.

This will be consistent across dimensional spaces.

-->

---

### Using `Layout1d`

---

### `Layout2d`

Map 2d space -1.0 → 1.0

> For our 2D space, we can think of:
> `(-1.0, -1.0)` bottom left → `(1.0, 1.0)` top right.

---

### `Shape2d`

## Create shapes in that space

> points, lines, grids, arcs, etc.

---

### `shape.points()`: A function that returns points for each pixel

> `shape.points()` maps each LED pixel into space between -1.0 and 1.0.

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

### Recap: Layout

Where are the LEDs in space

## 3. Pattern

How to animate the space with color

<!--

A pattern, most similar to a WLED effect, generates colors for each LED based on time and position.

-->

---

### Example 1d rainbow animation

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

### `Dim`?

TODO

(Do we even have time to talk about this?)

We need a marker trait because otherwise there'd have to be separate traits for each Pattern dimension.

You can't implement the same trait with different generic types

You can't

```rust
impl<Layout: Layout1d> Pattern<Layout> {
    // ...
}

impl<Layout: Layout2d> Pattern<Layout> {
    // ...
}
```

---

### 1d Rainbow `Pattern` trait

---

### Noise `Pattern`

---

### 3d Noise `Pattern`

---

### ???

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

---
