---
theme: ./theme
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
title: 'Rust in Color: Embedded LED Art'
info: |
  ## Rust in Color: Embedded LED Art

  Beautiful art with LEDs:

  > Using **Rust** to write nice code for an embedded _no-std_ _no-alloc_ LED cube.

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

> Using **Rust** to write nice code for an embedded _no-std_ _no-alloc_ LED cube.

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

::image::

<div class="h-full w-full flex flex-col items-center justify-center">
  <img src="/media/blinksy.gif" />
</div>

<!--

Hi hello!

I'm going to talk about how to use embedded Rust to make LED art.

-->

---
layout: intro-image-right
---

## Hi I’m Mikey

(aka **@ahdinosaur**, aka [mikey.nz](https://mikey.nz))

- Node.js + Rust developer
- Based in Pōneke (Wellington), Aotearoa (New Zealand)
- Care about creative tech and community
- Aspiring solarpunk

::image::

<div class="h-full w-full flex flex-col items-center justify-cente">
  <img src="/media/worm-family.jpg" class="w-3/4" />
</div>

<!--

I'm Mikey

- Previously a Node.js developer,
- A based here in Wellington,
- And I like making cool art amongst friends.

-->

---
layout: center
---

## I made this LED cube

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-cube.webm" type="video/webm">
</video>

<!--

So I made this LED cube, and I'm going to show you how.

-->

---
layout: center
---

### Prior art: LED suspenders

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-suspenders.mp4" type="video/mp4">
</video>

<!--

For the Big Burning Man

-->

---
layout: center
---

### Prior art: LED tetrahedron

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-tetrahedron.mp4" type="video/mp4">
</video>

<!--

For Kiwiburn

-->

---
layout: center
---

### Prior art: LED tensegrity

<video controls autoplay loop muted class="h-0 flex-1">
  <source src="/media/led-tensegrity.mp4" type="video/mp4">
</video>

<!--

This was my next installation, a Buckminster Fuller inspired tensegrity.

-->

---
layout: big-center
---

## Rust + LEDs = 💜

Use high-level abstractions for low-level systems.

`no-std` & `no-alloc`? No problem.

<!--

Rust is amazing.

With the power of abstraction, we can think at a very high-level, for very low-level applications.

I will show you how to use traits and generics to make great abstractions.

no-std and no-alloc is no problem, but you can't do things how you might be used to.

-->

---

### Start with the final code

```rust
let mut control = ControlBuilder::new_3d()
    .with_layout::<CubeLayout>()
    .with_pattern::<Noise3d<noise_fns::Perlin>>(NoiseParams::default())
    .with_driver(ws2812!(p, CubeLayout::PIXEL_COUNT))
    .build();

loop {
    let time = elapsed().as_millis();
    control.tick(time).unwrap();
}
```

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

This talk will explain how this code works, bit by bit.

While talking to LEDs is low-level, and everything we'll be doing is without allocations and without the standard library, the final API possible with Rust is still high-level.

We make an LED controller:

- We say it's 3d
- We say it has a layout of CubeLayout
- We say it has a pattern of Noise, with Perlin as noise function
- We say it has a driver of ws2812

Then we loop and call `control.tick`, passing in the current time.

-->

---
layout: big-center
---

## LEDs & Colors

How to emit and perceive light

<!--

So our first section is all about LEDs and color perception.

-->

---
layout: big-center
---

### What are RGB LEDs

LED = Light-emitting diode

<span class="color-ctp-red">R</span>
<span class="color-ctp-green">G</span>
<span class="color-ctp-blue">B</span> = <span class="color-ctp-red">Red</span> +
<span class="color-ctp-green">Green</span> +
<span class="color-ctp-blue">Blue</span>

<img alt="NeoPixel close-up" src="/media/neopixel-closeup.webp" class="mt-3 h-0" />

<!--

Let's start with the basics, what are LEDs anyways.

Honestly, they are black magic: a tiny rock we trick to emit light.

RGB is 3 tiny LEDs next to each other.

-->

---
layout: big-center
---

### Why RGB?


<img alt="Human eye cones" src="/media/human-eye-cones.svg" />

<!--

Why red, green, and blue?

We have 3 photo-receptors in our eyes, guess what colors they most closely line up with.

That means we don't actually see colors as we might think, we don't see the whole rainbow of wavelengths, we just see combinations of these 3 photo-receptors.

-->

---

### Pulse-width modulation

An LED can only be **ON** or **OFF**

<img alt="LED PWM (Pulse-Width Modulation)" src="/media/led-pwm.svg" />

<!--

An LED can only be full **ON** or full **OFF**, no such thing as being half-on.

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

On the left we have uncorrected photons: a linear duty cycle has a non-linear perceived brightness.

On the right we have gamma corrected photons: a gamma-corrected duty cycle has a linear perceived brightness.

The RGB we're used to is gamma-corrected, so double the red means double the perceived brightness of red.

However, when talking to LEDs, we need to use the linear colors.

-->

---

### Color systems

- sRGB: What we think as "RGB"
- Linear RGB: What use for LEDs
- HSV: An easy color system
- OkHsv: A correct color system
- ... So many more

A `FromColor` trait converts between all the colors.

---

### What are addressable LEDs?

- You talk to the first LED, it talks to the next LED.
- Like filling a bucket, that overflows to the next bucket.
- On every frame, you must provide a color to every LED.

<div style="display: flex; flex-direction: row; justify-content: center; align-items: center; height: 20%;">
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
  <img alt="WS2812 LED strip unit" src="/media/led-strip-unit.svg" style="height: 100%;" />
</div>

<!--

This is a common form of LEDs where they are sequenced, for example in a strip.

- You talk to the first LED, it will talk to the next LED.
- Like filling a bucket, that overflows to the next bucket.
- On every frame, you must provide a color to every LED.

-->

---

### "Clocked" LEDs

- Two wires: data + clock
- Each bit: set data, tick clock, repeat

<img alt="Clocked transmission" src="/media/clocked-transmission.svg" class="mt-5" />

<!--

We'll start with "Clocked" LEDs, where we talk to them over two wires: a data line and a clock line.

The LED waits until the clock line goes up, then reads the data line.

So to send a bit to an LED, you set the data line to what you want, then raise and lower the clock line.

As the sender, you control the clock speed, which will become the frame rate.


-->

---

### "Clockless" LEDs

- One wire, no clock
- Bits are based on specific timings

<img alt="Clockless timing" src="/media/clockless-timing.svg" />

<!--

Then LED manufacturers realized they could make things cheaper by removing the clock line.

So on "Clockless" LEDs, there's only one wire: a data line.

To send a bit is to send highs and lows of specific timings.

For example on the WS2812,

- 0-bit: HIGH ~0.4µs, then LOW ~0.85µs
- 1-bit: HIGH ~0.8µs, then LOW ~0.45µs

These timings must be accurate to within 150 ns. That's tiny!

-->

---

### "Clockless" LEDs (Part 2)

- One wire, no clock
- Bits are based on specific timings

<img alt="Clockless transmission" src="/media/clockless-transmission.svg" class="mt-5" />

<!--

Then to send many bits, you just repeat the process.

-->

---

### Trait to describe a "Clockless" LED

```rust
pub trait ClocklessLed {
    const T_0H: Nanoseconds;
    const T_0L: Nanoseconds;
    const T_1H: Nanoseconds;
    const T_1L: Nanoseconds;
}
```

```rust
struct Ws2812Led;

impl ClocklessLed for Ws2812Led {
    const T_0H: Nanoseconds = Nanoseconds::nanos(400);
    const T_0L: Nanoseconds = Nanoseconds::nanos(850);
    const T_1H: Nanoseconds = Nanoseconds::nanos(800);
    const T_1L: Nanoseconds = Nanoseconds::nanos(450);
}
```

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

Since every "Clockless" LED will have slightly different timings, but the overall pattern is the same:

We can use a `ClocklessLed` trait to represent the pattern.

Each particular LED implements the trait with their timings.

Then, we can implement a driver for all types that implement the `ClocklessLed` trait.

-->

---

### RMT: Remote Control Transceiver

<img src="/media/esp32-rmt.png" />

<!--

How do we get nanosecond-precision?

The board I'm using, the ESP32, has a peripheral for infrared transceivers (like a TV remote), however it can be used for transmitting any type of signal as pulses.

-->

---

### RMT: Remote Control Transceiver (Part 2)

```rust
let t_0h = ((Led::T_0H.to_nanos() * freq_mhz) / 1_000) as u16; // 32 cycles
let t_0l = ((Led::T_0L.to_nanos() * freq_mhz) / 1_000) as u16; // 68 cycles
let t_1h = ((Led::T_1H.to_nanos() * freq_mhz) / 1_000) as u16; // 64 cycles
let t_1l = ((Led::T_1L.to_nanos() * freq_mhz) / 1_000) as u16; // 36 cycles

let pulses = (
    PulseCode::new(Level::High, t_0h, Level::Low, t_0l),
    PulseCode::new(Level::High, t_1h, Level::Low, t_1l),
);
```

<style>
    code {
        @apply text-lg;
    }
</style>

<!--


-->


---

### RMT: Remote Control Transceiver (Part 3)

```rust
fn write_color_byte_to_rmt(
    byte: &u8,
    rmt_iter: &mut IterMut<u32>,
    pulses: &(u32, u32),
) -> Result<(), ClocklessRmtDriverError> {
    for bit_position in [128, 64, 32, 16, 8, 4, 2, 1] {
        let next = rmt_iter
            .next()
            .ok_or(ClocklessRmtDriverError::BufferSizeExceeded)?;
        *next = match byte & bit_position {
            0 => pulses.0,
            _ => pulses.1,
        }
    }
    Ok(())
}
```

<style>
    code {
        @apply text-xl leading-[1.4];
    }
</style>

---

### LED `Driver` trait

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
        @apply text-2xl;
    }
</style>

<!--

Now we're ready for our LED `Driver` trait.

Important to notice:

- Pixels can't just be a Vec, we can't use allocations.
  - Pixels must be an iterator
- The driver expects a color type, and the writer provides a color type, we automatically convert with the `FromColor` trait.

-->

---
layout: big-center
---

## LED Layout

Where are the LEDs in space

<!--

Okay, now time to lay these LEDs in space.

-->

---

### Thinking in spaces rather than LEDs

A common approach is to think in terms of arrays of pixels.

But what if instead, every pixel had a position in space?

<!--

Most LED projects, that I'm aware of, think in terms arrays of pixels.

This makes sense because images and videos are also arrays of pixels.

I want to think like graphics shaders.

What if every pixel had a position in space, which we'd use on every frame to calculate the color?

-->

---
layout: center
---

### Prior art: Tetrahedron using Rust

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tetrahedron.mp4" type="video/mp4">
</video>

<!--

To understand what I mean about 3D layouts, look back at my LED tetrahedron:

Each pixel has a position in 3D space. Similar to a graphics shader, for every frame we calculate the color of every pixel, using its position and the current time.

-->


---
layout: center
---

### Prior art: Tensegrity using WLED

<video controls autoplay loop muted class="w-full h-full">
  <source src="/media/led-tensegrity.mp4" type="video/mp4">
</video>

<!--

Since I used WLED, there's no concept of 3d position, each strut is a 1d segment with an array of pixels.

While this still looks good, it's missing the same spatial feel, each strut more or less looks the same.

-->

---
layout: center
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
layout: center
---

### Counter-example: DIY Vegas sphere

<img src="/media/led-sphere.jpg" class="h-0" />

<!--

I found a great YouTube video of someone making a DIY Vegas Sphere.

- In the video, they have a section on why they couldn't do the type of LED sphere on the right.
  - Because the pixels at the poles are closer than the pixels at the equator
- They say they need their pixels to be equidistant, and they did a great job making that happen.
- But this is only a problem because they want to project a 2D image or video onto their 3D surface.
- What if we did our animations in code, so it didn't matter where the pixels were?

Source: https://youtu.be/_ZtewjbFXoA

-->

---

### Layout in 3D

Map 3D space `-1.0` → `1.0`

- **X:** `-1.0` (left) → `1.0` (right)
- **Y:** `-1.0` (bottom) → `1.0` (top)
- **Z:** `-1.0` (back) → `1.0` (front)

<style>
    code {
        @apply text-lg leading-none;
    }
</style>

<!--

We're going to map our 3D space from -1 to +1.

Why -1.0 → 1.0? So 0.0 is the middle.

-->

---

<div class="text-center">

### Example 2D LED Grid

</div>

<img src="/media/layout-2d-points.svg" />

<!--

Here's an example of laying out an LED grid in 2D.

Not only do we need to know where every pixel is, we need to know the order of every pixel.

Notice the zig zag, that's how the LED grids are made, we need our code to understand that.

-->

---

### `Layout3d` trait

```rust
trait Layout3d {
    const PIXEL_COUNT: usize;

    fn shapes() -> impl Iterator<Item = Shape3d>;

    fn points() -> impl Iterator<Item = Vec3> {
        Self::shapes().flat_map(|s| s.points())
    }
}
```

<style>
    code {
        @apply text-2xl;
    }
</style>

<!--

Important to notice:

- We specify the shapes function
- We automatically get the points function, which combines the points of every shape.

-->

---

### `Shape3d` enum

```rust
enum Shape3d {
    Point(Vec3),
    Line {
        // ...
    },
    Grid {
        // ...
    },
    // ...
}
```

<style>
    code {
        @apply text-2xl;
    }
</style>

<!--

We have an enum to represent our shapes of LEDs in our 3D space.

- Point
- Line
- Grid

And so on...

-->

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

I had been learning to use enums a lot for cases when I would have done `Box<dyn>`.

So I realized you could return an enum that `impl Iterator`, which wraps sub-iterators for each case.

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
        use Shape3dPointsIterator::*;
        match self {
            Point(iter) => iter.next(),
            Line(iter) => iter.next(),
            Grid(iter) => iter.next(),
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
layout: big-center
---

## Animation Pattern

How to animate the space with color

fn tick(time) -> A color for every LED

<!--

Now we want to make our LEDs flash and dance.

Conceptually, an animation pattern is a function that:

- is called on every frame
- is given the time
- and returns a color for every LED

-->

---

### Animation `Pattern` trait

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

We'll do this as a trait.

Most important to notice:

- We see our tick function: given the current time, return an iterator of colors
- Also notice the generics: Dim and Layout

-->

---

### `Dim` and `LayoutForDim`?

We can't:

```rust
impl<Layout: Layout1d> Pattern<Layout> for MyPattern {
    // ...
}

impl<Layout: Layout2d> Pattern<Layout> for MyPattern {
    // ...
}
```

So we must:

```rust
impl<Layout: Layout1d> Pattern<Dim1d, Layout> for MyPattern {
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

They are commonly used in procedural generated terrains.

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
layout: big-center
---

## Control

How to put this all together

<!--

We have the building blocks, how do we put this all together?

-->

---

### A struct to bind them: `Control`

```rust
struct Control<Dim, Layout, Pattern, Driver> {
    dim: PhantomData<Dim>,
    layout: PhantomData<Layout>,
    pattern: Pattern,
    driver: Driver,
    brightness: f32,
}
```

<style>
  code {
    @apply text-2xl;
  }
</style>

---

### `Control` is out of control

```rust
let control: Control<
    Dim3d,
    CubeLayout,
    Noise3d<noise_fns::Perlin>,
    _
> = Control::new(
    NoiseParams::default(),
    ws2812!(p, Layout::PIXEL_COUNT)
);
```

<style>
    code {
        @apply text-2xl;
    }
</style>

<!--

To create `Control`, some things are types, some things are values.

Type arguments and value arguments aren't named, it's confusing

-->

---

### Enter `ControlBuilder`

We use a `ControlBuilder` to build a `Control`.

We use some clever Rust to combine what we need: types and values.

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

<!--

We will think of each of these generics as a slot.

Each step in the builder pattern will fill a slot.

-->

---

### First slot

```rust
impl ControlBuilder<(), (), (), ()> {
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

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

By the way, shout-out to Hanno Braun who's working on Fornjot, a CAD kernel in Rust, for this pattern in a stepper motor library.

-->

---

### Next slot

```rust
impl<Dim, Layout, Pattern> ControlBuilder<Dim, Layout, Pattern, ()> {
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

<style>
    code {
        @apply text-md;
    }
</style>

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
    pub fn build(self) -> Control<Dim, Layout, Pattern, Driver> {
        Control::new(self.pattern, self.driver)
    }
}
```

<style>
    code {
        @apply text-lg;
    }
</style>

---

### Back to the final code

```rust
let mut control = ControlBuilder::new_3d()
    .with_layout::<CubeLayout>()
    .with_pattern::<Noise3d<noise_fns::Perlin>>(NoiseParams::default())
    .with_driver(ws2812!(p, CubeLayout::PIXEL_COUNT))
    .build();

loop {
    let time = elapsed().as_millis();
    control.tick(time).unwrap();
}
```

<style>
    code {
        @apply text-xl;
    }
</style>

<!--

This is the code we saw at the beginning, now maybe things make slightly more sense.

-->


---
layout: outline
---

## Quickstart

How to start an LED project now

---

### Introducing: Blinksy

A Rust LED library for everything (and more):

<https://blinksy.dev>

<!--

Everything I've shown you, and much more I didn't have time for, is available as a Rust library called Blinksy.

I want to help people make art with LEDs.

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

### Template project

<https://blinksy.dev/quickstart>

TODO https://github.com/ahdinosaur/blinksy-quickstart-gledopto>

<!--

If you wanna start now, I made a template project.

- Setup so you write code to run on both desktop and micro-controller.
- Uses Gledopto micro-controller, an affordable device on AliExpress

-->

---
layout: center
---

## Thanks!

Blinksy: <https://blinksy.dev>

Me: <https://mikey.nz>

<!--

Find me, in person or online, I'm happy to help!

-->
