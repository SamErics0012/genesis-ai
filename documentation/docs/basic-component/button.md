---
id: button
title: Button
sidebar_label: Button
---

# 🔘 Button Component

The `Button` component is a reusable and theme-friendly button designed with **TailwindCSS** and **React + TypeScript**.  
It supports multiple style variants to fit different use cases in your application.

---

## ✨ Overview

The `Button` component provides a simple and consistent way to render styled buttons with built-in variants.

```tsx
import Button from "@/components/button";

<Button variant="primary">Get Started</Button>
```

## 🎨 Variants

The Button component supports multiple visual variants:

| Variant | Description | Appearance |
|----------|--------------|-------------|
| `primary` | Main call-to-action button | Dark background with white text and arrow |
| `secondary` | Alternate inverted button | White background with dark text and arrow |
| `form` | Used for forms or compact buttons | Blue background, no icon |
| `back` | Simple button for navigation | Black background, no icon |


## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `variant` | `"primary"` \| `"secondary"` \| `"form"` \| `"back"` | `"primary"` | Defines which button variant to use. |
| `className` | `string` | — | Custom Tailwind or CSS class names to extend styling. |
| `children` | `React.ReactNode` | — | The content inside the button (usually text or icons). |
| `...props` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Supports all native HTML button attributes. |
