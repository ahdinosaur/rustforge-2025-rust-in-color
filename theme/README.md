# slidev theme

My personal theme for [Slidev](https://github.com/slidevjs/slidev).

Originated from [`@slidev/theme-apple-basic`](https://github.com/slidevjs/themes/tree/main/packages/theme-apple-basic)

## Layouts

This theme provides the following layouts:

### Title
Usage:
```
---
layout: intro
---

# Presentation title

Presentation subtitle

<div class="absolute bottom-10">
  <span class="font-700">
    Author and Date
  </span>
</div>

```
![intro](https://i.imgur.com/gnB4oa8.png)

---

### Title & Photo
Usage:
```
---
layout: intro-image
image: 'image-url'
---

<div class="absolute top-10">
  <span class="font-700">
    Author and Date
  </span>
</div>

<div class="absolute bottom-10">
  <h1>Presentation title</h1>
  <p>Presentation subtitle</p>
</div>

```
![intro-image](https://i.imgur.com/976e8Hu.png)

---

### Title & Photo right
Usage:
```
---
layout: intro-image-right
image: 'image-url'
---

# Slide Title
## Slide Subtitle

```
![intro-image-right](https://i.imgur.com/dE1r2bg.png)

---

### Title, Bullets & Image
Usage:
```
---
layout: image-right
image: 'image-url'
---

# Slide Title
## Slide Subtitle

* Slide bullet text

```
![image-right](https://i.imgur.com/llEB75J.png)

---

### Title & Bullets
#### Layout used by default
![default](https://i.imgur.com/Glu7KWK.png)

---

### Bullets
Usage:
```
---
layout: bullets
---

* Slide bullet text

```
![bullets](https://i.imgur.com/rvQJMMc.png)

---

### Section
Usage:
```
---
layout: section
---

# Section Title

```
![section](https://i.imgur.com/vnL8XOB.png)

---

### Statement
Usage:
```
---
layout: statement
---

# Statement

```
![satement](https://i.imgur.com/Em3e8g3.png)

---

### Big fact
Usage:
```
---
layout: fact
---

# 100%
Fact information

```
![fact](https://i.imgur.com/hPL7qOj.png)

---

### Quote
Usage:
```
---
layout: quote
---

# "Notable quote"
Attribution

```
![quote](https://i.imgur.com/DMpzz0g.png)

---

### Photo - 3
Usage:
```
---
layout: 3-images
imageLeft: 'image-url'
imageTopRight: 'image-url'
imageBottomRight: 'image-url'
---
```
![3-images](https://i.imgur.com/Lun6FnS.png)

---

### Photo
Usage:
```
---
layout: image
image: 'image-url'
---
```
![image](https://i.imgur.com/S9TQ2AZ.png)
