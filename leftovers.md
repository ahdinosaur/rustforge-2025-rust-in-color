---

BELOW IS LEFTOVERS

---

Old 3 sentence description:

> Blinksy is a Rust library for controlling LEDs in 1D, 2D, and 3D spatial layouts, designed for embedded systems (no-std & no-alloc). You model your LED setups as geometric shapes and create patterns that compute colors based on position and other parameters. This talk will share my creative journey with LEDs and how Rust can enable your journey too.

Old description:

>  Blinksy is a no-std, no-alloc Rust library for LED control, inspired by FastLED and WLED. It supports 1D, 2D, and 3D, allowing developers to define LED layouts as geometric shapes like lines, grids, arcs, and points. Patterns are written like shaders, computing colors for each LED based on position and other data. Blinksy supports multiple chipsets (APA102, WS2812B) and can be run on off-the-shelf embedded LED controllers.
>
> In this talk, I’ll share how Blinksy evolved from my LED projects, including a 3D tetrahedron modeled in Rust and an LED tensegrity structure powered by WLED. I’ll demonstrate the ins and outs of LEDs, and show how anyone can use Rust to build their own LED art.

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
