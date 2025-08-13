---

BELOW IS LEFTOVERS

---



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
