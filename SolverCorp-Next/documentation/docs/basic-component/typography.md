---
id: typography
title: Typography
sidebar_label: Typography
---

# Typography

The `Typography` component provides a consistent, responsive text system across the application.  
It supports different HTML tags, responsive font sizes, weights, and line heights, as well as dark mode handling.

---

## 🎨 Variants

| Prop | Description | Example |
|------|--------------|----------|
| `as` | Defines which HTML element to render. Can be any valid tag such as `p`, `h1`, `h2`, `span`, or `div`. | `<Typography as="h1" size={32}>Heading</Typography>` |
| `noDarkMode` | Disables dark mode color changes when set to `true`. | `<Typography noDarkMode color="#1146F2">Static Color</Typography>` |

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `as` | `keyof JSX.IntrinsicElements` \| `React.JSXElementConstructor<any>` | `"p"` | Defines which HTML tag will be rendered. |
| `size` | `number` | `16` | Font size for desktop view (in px). |
| `sizeTablet` | `number` | — | Optional font size for tablet view. |
| `sizeMobile` | `number` | — | Optional font size for mobile view. |
| `weight` | `number` | `400` | Font weight for desktop view. |
| `weightTablet` | `number` | — | Font weight for tablet view. |
| `weightMobile` | `number` | — | Font weight for mobile view. |
| `lineHeight` | `number` | — | Line height for desktop view (in px). |
| `lineHeightTablet` | `number` | — | Line height for tablet view. |
| `lineHeightMobile` | `number` | — | Line height for mobile view. |
| `letterSpacing` | `number` | — | Letter spacing for desktop view (in px). |
| `letterSpacingTablet` | `number` | — | Letter spacing for tablet view. |
| `letterSpacingMobile` | `number` | — | Letter spacing for mobile view. |
| `color` | `string` | `"#070707"` | Font color (overridden by dark mode unless `noDarkMode` is `true`). |
| `noDarkMode` | `boolean` | `false` | Disables automatic color switching in dark mode. |
| `className` | `string` | — | Custom Tailwind or CSS class names. |
| `children` | `React.ReactNode` | — | The text or elements to be displayed. |
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | — | Pass-through props for flexibility (e.g. `id`, `onClick`). |

---

## 💡 Usage Examples

### Basic Example

```tsx
import Typography from "@/components/typography";

export default function Example() {
  return (
    <Typography size={18} weight={600} lineHeight={28}>
      This is a base typography example.
    </Typography>
  );
}
```

### Responsive Example

```tsx
<Typography
  as="h2"
  size={32}
  sizeTablet={28}
  sizeMobile={20}
  weight={700}
  lineHeight={40}
>
  Responsive Typography
</Typography>

```

### Dark Mode Example

```tsx
<Typography color="#070707">
  This text will automatically turn white in dark mode.
</Typography>

<Typography color="#1146F2" noDarkMode>
  This text color stays blue in both light and dark mode.
</Typography>

```