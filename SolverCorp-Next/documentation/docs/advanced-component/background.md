---
id: background
title: Hero Background
sidebar_label: Hero Background
---

# HeroBackground

`HeroBackground` is a layout component designed to create a smooth, blurred, gradient-style background typically used in hero sections.  
It allows you to include both `children` (main content) and a separate `component` (e.g., an illustration, animation, or CTA block) that will render outside the main content container.

---

## Features

- Provides a gradient-based, blurred background suitable for hero sections.
- Accepts any custom content as `children`.
- Supports additional React components via the `component` prop.
- Automatically adapts to dark mode via Tailwind’s `dark:` classes.

---

## ⚙️ Props

| Name       | Type                | Default | Description |
|-------------|--------------------|----------|--------------|
| `children`  | `React.ReactNode`  | `—` | The main content displayed within the hero section. Usually text, headings, or buttons. |
| `component` | `React.ReactNode`  | `—` | An optional extra component rendered outside the main content (e.g., an illustration or animation). |

---

## Example Usage

```tsx
import HeroBackground from "@/components/layout/HeroBackground";
import HeroContent from "@/components/hero/HeroContent";

export default function HomeHero() {
  return (
    <HeroBackground component={<HeroContent />}>
      <h1 className="text-white text-5xl font-bold">Welcome to the Future</h1>
      <p className="text-gray-300 mt-4">
        Build fast, beautiful, and responsive experiences with modern React.
      </p>
    </HeroBackground>
  );
}
```