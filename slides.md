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

layout: intro-image-right
image: /media/blinksy.gif
---

<h1>
  Rust In
    <span class="color-ctp-red">C</span>
    <span class="color-ctp-yellow">O</span>
    <span class="color-ctp-green">L</span>
    <span class="color-ctp-blue">O</span>
    <span class="color-ctp-mauve">R</span>
</h1>

Embedded LED Art 🌈

> Using _no-std_ _no-alloc_ **Rust** to animate an LED cube

<div class="flex flex-col items-center justify-center mt-6">
  <img src="/media/blinksy.gif" class="w-65 h-65" />
</div>

<div class="absolute bottom-6">
  <span class="font-700">
    mikey.nz ( @ahdinosaur)
  </span>
</div>

<div class="absolute bottom-5 right-6 text-xl">
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
layout: center
---

## I made this LED cube

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-cube.webm" type="video/webm">
</video>

<!--

I'm going to show you how.

-->

---
layout: big-center
---

### Backstory: I like LEDs

<!--

Not sure why, LEDs tickle my brain in a great way.

-->

---
layout: center
---

### Prior art: LED suspenders using FastLED

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-suspenders.mp4" type="video/mp4">
</video>

---
layout: center
---

### Prior art: Tetrahedron using Rust

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-tetrahedron.mp4" type="video/mp4">
</video>

<!--

This was early days for me and Rust.

In this project I came to my realization: each LED pixel should have a position in 3d space.

We use this position in 3d space to compute the color for each animation frame.

-->

---
layout: center
---

### Prior art: Tensegrity using WLED

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-tensegrity.mp4" type="video/mp4">
</video>

<!--

WLED is off-the-shelf software for LED projects.

-->

---
layout: big-center
---

## LEDs + Rust = <3

<!--

Since we're here for Rust, let's learn how to use LEDs plus Rust to make magic.

-->

---

### Start with the final code

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

<style>
    code {
        @apply text-xl;
    }
</style>

---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. Color: How our eyes perceive light
2. Layout: Where are the LEDs in space
3. Pattern: How to animate the space with color
4. Control: How to put these together
5. Quickstart: How to start an LED project now

<!--

Let's start with the smallest building block, the LED, and build up from there.

-->

---
layout: outline
---

## Talk Outline

1. **Driver: How to make an LED be a color**
    1. Color: How our eyes perceive light
2. Layout: Where are the LEDs in space
3. Pattern: How to animate the space with color
4. Control: How to put these together
5. Quickstart: How to start an LED project now

---
layout: big-center
---

### Let's start with LED basics

---
layout: big-center
---

### What are LEDs

LED = Light-emitting diode

<!--

Black magic where a tiny surface emits light.

-->

---
layout: big-center
---

### What are RGB LEDs

RGB = Red + Green + Blue

<img alt="NeoPixel close-up" src="/media/neopixel-closeup.webp" class="mt-3 h-0" />

<!--

3 LEDs next to each other.

We use red, green, and blue because those most closely match our 3 photo-receptors in our eyes, more on that later.

-->

---

### What are addressable LEDs?

- You talk to the first LED, it will talk to the next LED.
- Like filling a bucket, that overflows to the next bucket.
- So you must provide a color to every LED on every frame

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

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

We'll start with a basic `Driver` trait, similar to `smart-leds` crate.

We use an iterator to avoid heap allocations and minimize the memory usage.

-->

---

### "Clocked" LEDs

- Two wires: data + clock
- Each bit: set data, tick clock, repeat

<img alt="Clocked transmission" src="/media/clocked-transmission.svg" class="mt-5" />

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

<img alt="Clockless timing" src="/media/clockless-timing.svg" />

<!--

We'll be focusing on "Clockless" LEDs, as that's what I'm using for the cube.

For example with WS2812B LEDs, to represent a 0 bit the data line must be HIGH for 0.4 µs, then LOW for 0.85 µs. These timings must be accurate to within 150 ns. That's tiny!

Example timing (WS2812B):

- 0-bit: HIGH ~0.4µs, then LOW ~0.85µs
- 1-bit: HIGH ~0.8µs, then LOW ~0.45µs

-->

---

### "Clockless" LEDs (Part 2)

- One wire, no clock
- Bits are based on specific timings

<img alt="Clockless transmission" src="/media/clockless-transmission.svg" class="mt-5" />

---

### Trait to describe a "Clockless" chipset

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

### RMT: Remote Control Transceiver

<img src="/media/esp32-rmt.png" />

<!--

The board I'm using, the ESP32, has a peripheral for infrared transceivers (like a TV remote), however it can be used for transmitting any type of signal as pulses.

-->

---

### RMT: Remote Control Transceiver (Part 2)

```rust
let t_0h = ((Led::T_0H.to_nanos() * freq_mhz) / 1_000) as u16;
let t_0l = ((Led::T_0L.to_nanos() * freq_mhz) / 1_000) as u16;
let t_1h = ((Led::T_1H.to_nanos() * freq_mhz) / 1_000) as u16;
let t_1l = ((Led::T_1L.to_nanos() * freq_mhz) / 1_000) as u16;
let t_reset = ((Led::T_RESET.to_nanos() * freq_mhz) / 1_000) as u16;

let pulses = (
    PulseCode::new(Level::High, t_0h, Level::Low, t_0l),
    PulseCode::new(Level::High, t_1h, Level::Low, t_1l),
    PulseCode::new(Level::Low, t_reset, Level::Low, 0),
);
```

---

### RMT: Remote Control Transceiver (Part 3)

```rust
fn write_color_byte_to_rmt(
    byte: &u8,
    rmt_iter: &mut IterMut<u32>,
    pulses: &(u32, u32, u32),
) -> Result<(), ClocklessRmtDriverError> {
    for bit_position in [128, 64, 32, 16, 8, 4, 2, 1] {
        *rmt_iter
            .next()
            .ok_or(ClocklessRmtDriverError::BufferSizeExceeded)? = match byte & bit_position {
            0 => pulses.0,
            _ => pulses.1,
        }
    }
    Ok(())
}
```

---
layout: big-center
---

### The problem with naive RGB

Colors are more complex than you might think.


---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. **Color: How our eyes perceive light**
2. Layout: Where are the LEDs in space
3. Pattern: How to animate the space with color
4. Control: How to put these together
5. Quickstart: How to start an LED project now

<!--

Versus what LEDs emit.

-->

---

### Pulse-width modulation

An LED can only be **ON** or **OFF**

<img alt="LED PWM (Pulse-Width Modulation)" src="/media/led-pwm.svg" />

<!--

- If you tell an LED to be 100% bright, it will be on for 100% of the time (a 100% duty cycle).
- If you tell an LED to be 50% bright, it will be on for 50% of the time (a 50% duty cycle).

And so on. Our eyes don’t notice the flicker on and off.

-->

---

### Emitted photons ≠ Perceived brightness

<div class="mt-2 flex flex-row justify-center align-center">
  <img alt="Uncorrected brightness" src="/media/brightness-uncorrected.svg" class="w-1/2" />
  <img alt="Corrected brightness" src="/media/brightness-corrected.svg" class="w-1/2" />
</div>

<!--

What we perceive to a linear change in photons is not linear.

For our evolutionary survival, we are much more sensitive to changes in dim light than we are to changes in bright light. If you double the amount of photons, we don’t see double the brightness.

This mismatch between physics and perception is why the “RGB” you think you know is actually gamma-encoded sRGB. sRGB allows us to think in terms of perception, where double the red value means double the perceived brightness of red. Then for LEDs, we convert the gamma-encoded sRGB to linear, to use as a gamma-corrected duty cycle.

By the way, if you start mixing RGB's, make sure to do so in the linear space.

-->

---

### Color systems

- sRGB: What we think as "RGB"
- Linear RGB: What use for LEDs
- HSV: An easy color system
- OkHsv: A correct color system

A `FromColor` trait converts between all the colors.

---

### A better LED `Driver` trait

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

<style>
    code {
        @apply text-lg;
    }
</style>

<!--

Now let's improve how our `Driver` handles colors, with respect to human perception.

Changes:

- `FromColor` trait
- brightness: f32

Most drivers expect Linear RGB as their color.
-->

---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. Color: How our eyes perceive light
2. **Layout: Where are the LEDs in space**
3. Pattern: How to animate the space with color
4. Control: How to put these together
5. Quickstart: How to start an LED project now

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

### Counter-example: WLED Cube

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/wled-cube.mp4" type="video/webm">
</video>

<img src="/media/wled-cube-mapping.jpg" class="max-h-25 mt-2" />

<!--

Source: [github.com/hpsaturn/cube_led_8x8x6_ws2812](https://github.com/hpsaturn/cube_led_8x8x6_ws2812)

-->

---

### Counter-example: DIY Vegas sphere

<img src="/media/led-sphere.jpg" class="h-0" />

<!--

I found a great YouTube video of someone making a DIY Vegas Sphere.

- In the video, they have a section on why they couldn't do the type of LED sphere on the right.
  - Because the pixels at the poles are separated by a different distance than pixels at the equator
- They say they need their pixels to be equidistant, and they did a great job making that happen.
- But this is only a problem because they want to project a 2D image or video onto their 3D surface.
- What if we did our animations in code, so it didn't matter where the pixels were?

Source: https://youtu.be/_ZtewjbFXoA

-->

---

### `Layout3d`

Map 3D space `-1.0` → `1.0`

- **X:** `-1.0` (left) → `1.0` (right)
- **Y:** `-1.0` (bottom) → `1.0` (top)
- **Z:** `-1.0` (back) → `1.0` (front)

<!--

Why -1.0 → 1.0? So 0.0 is the middle.

-->

---

### LED Grids

<img src="/media/layout-2d-points.svg" />

<!--

Zig zag

-->

---


### `Shape3d`

Create shapes of LEDs in that 3D space

```rust
/// Enumeration of three-dimensional shape primitives.
pub enum Shape3d {
    /// A single LED at the specified location.
    Point(Vec3),

    /// A line of LEDs from `start` to `end` with `pixel_count` LEDs.
    Line {
        // ...
    },

    /// A grid of LEDs defined by three corners and dimensions.
    Grid {
        // ...
    },

    // ...
}
```

<style>
    code {
        @apply text-lg leading-none;
    }
</style>

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

<style>
    code {
        @apply text-lg;
    }
</style>

---

### `shape.points()`

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

<style>
    code {
        @apply text-2xl;
    }
</style>

<!--

`shape.points()` maps each LED pixel into space between -1.0 and 1.0.

How do we return a different iterator for each case, without allocations?

If we can't return `Box<dyn Iterator>`, what do we do?

Return a struct that `impl Iterator`, which wraps sub-iterators for each case.

-->

---

### ~~`Box<dyn Iterator>`~~ for no-alloc

```rust
/// Iterator over points in a 3D shape.
pub enum Shape3dPointsIterator {
    /// Iterator for a single point
    Point(Once<Vec3>),
    /// Iterator for points along a line
    Line(StepIterator<Vec3, f32>),
    /// Iterator for points in a grid
    Grid(GridStepIterator<Vec3, f32>),
}

impl Iterator for Shape3dPointsIterator {
    type Item = Vec3;

    fn next(&mut self) -> Option<Self::Item> {
        match self {
            Shape2dPointsIterator::Point(iter) => iter.next(),
            Shape2dPointsIterator::Line(iter) => iter.next(),
            Shape2dPointsIterator::Grid(iter) => iter.next(),
        }
    }
}
```

<style>
    code {
        @apply text-lg leading-none;
    }
</style>

---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. Color: How our eyes perceive light
2. Layout: Where are the LEDs in space
3. **Pattern: How to animate the space with color**
4. Control: How to put these together
5. Quickstart: How to start an LED project now

<!--

A pattern, most similar to a WLED effect, generates colors for each LED based on time and position.

-->

---
layout: big-center
---

### Animation patterns

fn tick(time) -> A color for every LED

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

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

- Works for 1D, 2D, and 3D
- Iterator output stays no-alloc

-->

---

### `Dim` and `LayoutForDim`?

```rust
impl<Layout: Layout1d> Pattern<Dim1d, Layout> for MyPattern {
    // ...
}
```

Because you can't:

```rust
impl<Layout: Layout1d> Pattern<Layout> for MyPattern {
    // ...
}

impl<Layout: Layout2d> Pattern<Layout> for MyPattern {
    // ...
}
```

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

`Dim` is a type marker which allows us to use a single `Pattern` trait for all dimensions: 1d, 2d, 3d.

This is because you can't implement the same trait with different generics.

`Dim` is a generic type, we have the concrete types: `Dim1d`, `Dim2d`, `Dim3d`.

Then, we have a trait `LayoutForDim`, which constrains the Layout to match the Dim marker.

-->

---
layout: big-center
---

### Noise functions

(x, y, z, w) -> random number

<img alt="Perlin noise" src="/media/perlin-noise.png" class="h-72" />

<!--

Noise functions are random generators that given a point, returns a random sample that smoothly interpolate over nearby points.

We're going to use noise functions to generate colors.

-->

---

### Noise `Pattern`

```rust
/// Generates colors for a 3D layout using a 4D noise function.
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

<style>
  code {
    @apply text-lg leading-none;
  }
</style>

<!--

Here we use a 4D noise function to generate colors in 3D.

(x, y, z, time) -> colors for 3D layout

The pattern uses the LED x,y,z position and time as inputs to a 4D noise function, mapping the noise value to a hue and value in the Okhsv color space.

-->

---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. Color: How our eyes perceive light
2. Layout: Where are the LEDs in space
3. Pattern: How to animate the space with color
4. **Control**: How to put these together
5. Quickstart: How to start an LED project now

---

### Back to the final code

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

<style>
    code {
        @apply text-xl;
    }
</style>

---

### `Control` is out of control

```rust
struct Control<Dim, Layout, Pattern, Driver> {
    dim: PhantomData<Dim>,
    layout: PhantomData<Layout>,
    pattern: Pattern,
    driver: Driver,
    brightness: f32,
}


impl<Dim, Layout, Pattern, Driver> Control<Dim, Layout, Pattern, Driver>
where
    Driver: DriverTrait,
    Driver::Color: FromColor<Pattern::Color>,
    Layout: LayoutForDim<Dim>,
    Pattern: PatternTrait<Dim, Layout>,
{
    // fn tick ...
}
```

<style>
    code {
        @apply text-lg leading-[1.25];
    }
</style>

---

### Enter `ControlBuilder`

We use a `ControlBuilder` to build a `Control`.

How do we manage the type madness?

---

### Start with a generic `ControlBuilder`

```rust
pub struct ControlBuilder<Dim, Layout, Pattern, Driver> {
    dim: PhantomData<Dim>,
    layout: PhantomData<Layout>,
    pattern: Pattern,
    driver: Driver,
}
```

<style>
    code {
        @apply text-xl;
    }
</style>

---

### First step: Impl for unit type

```rust
impl ControlBuilder<(), (), (), ()> {
    /// Starts building a three-dimensional control system.
    ///
    /// # Returns
    ///
    /// A builder initialized for 3D
    pub fn new_3d() -> ControlBuilder<Dim3d, (), (), ()> {
        ControlBuilder {
            dim: PhantomData,
            layout: PhantomData,
            pattern: (),
            driver: (),
        }
    }
}
```

<!--

By the way, shout-out to Hanno Braun who's working on Fornjot, a CAD kernel in Rust, for this pattern in a stepper motor library.

-->


<style>
    code {
        @apply text-xl;
    }
</style>


---

### Next: impl for generics

```rust

impl<Dim, Layout, Pattern> ControlBuilder<Dim, Layout, Pattern, ()> {
    /// Specifies the LED driver for the control system.
    ///
    /// # Arguments
    ///
    /// * `driver` - The LED driver instance
    ///
    /// # Returns
    ///
    /// Builder with driver specified
    pub fn with_driver<Driver>(self, driver: Driver) -> ControlBuilder<Dim, Layout, Pattern, Driver>
    where
        Driver: DriverTrait,
    {
        ControlBuilder {
            dim: self.dim,
            layout: self.layout,
            pattern: self.pattern,
            driver,
        }
    }
}
```

---

### At the end we build

```rust
impl<Dim, Layout, Pattern, Driver> ControlBuilder<Dim, Layout, Pattern, Driver>
where
    Layout: LayoutForDim<Dim>,
    Pattern: PatternTrait<Dim, Layout>,
    Driver: DriverTrait,
    Driver::Color: FromColor<Pattern::Color>,
{
    /// Builds the final [`Control`] struct.
    ///
    /// # Returns
    ///
    /// A fully configured Control instance
    pub fn build(self) -> Control<Dim, Layout, Pattern, Driver> {
        Control::new(self.pattern, self.driver)
    }
}
```

---
layout: outline
---

## Talk Outline

1. Driver: How to make an LED be a color
    1. Color: How our eyes perceive light
2. Layout: Where are the LEDs in space
3. Pattern: How to animate the space with color
4. Control: How to put these together
5. **Quickstart**: How to start an LED project now

---

### Introducing: Blinksy

A Rust LED library for everything (and more):

<https://blinksy.dev>

<!--

Everything I've shown you, and more, is available as a Rust library called Blinksy.

I hope to help people make art with LEDs.

-->

---

### Desktop simulation

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/cube-desktop.webm" type="video/webm">
</video>

<!--

Blinksy also has a way to simulate on your desktop.

-->

---

### Quickstart project

<https://blinksy.dev/quickstart>

TODO https://github.com/ahdinosaur/blinksy-quickstart-gledopto>

<!--

If you wanna start now, I made a quickstart project.

- Setup so you write code to run on both desktop and micro-controller.
- Uses Gledopto micro-controller, an affordable device on AliExpress

-->

---

## Come play with me

Find me, in person or online, I'm happy to help!

---
layout: center
---

## Thanks!

Blinksy: <https://blinksy.dev>

Me: <https://mikey.nz>
