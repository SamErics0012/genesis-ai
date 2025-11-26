---
id: icons
title: Icons
sidebar_label: Icons
---

# Icons

The `Icons` component provides a consistent and theme-aware way to render SVG icons across the project.  
Each icon is dynamically imported and mapped to a readable `name` prop for easier usage and maintenance.

---

## 🎨 Variants

You can render any icon from the predefined list by passing its `name` prop.  
Icons automatically switch color in dark mode unless `noDarkMode` is set to `true`.

| Icon Name | Description |
|------------|--------------|
| `moon` | Moon icon (used for dark mode toggle). |
| `sun` | Sun icon (used for light mode toggle). |
| `list` | Generic list icon. |
| `arrowRight` | Arrow pointing to the right. |
| `arrowLeft` | Arrow pointing to the left. |
| `arrowDown` | Arrow pointing down. |
| `arrowUpRight` | Arrow pointing up and to the right. |
| `starsSparkle` | Decorative sparkle star icon. |
| `group` | Group or team icon. |
| `cash` | Money or financial icon. |
| `target` | Goal or objective icon. |
| `caretUp` | Small caret pointing up. |
| `caretDown` | Small caret pointing down. |
| `copyRight` | Copyright symbol. |
| `trendsBlue` | Trend arrow (blue variant). |
| `rocketBlue` | Rocket icon (blue variant). |
| `targetBlue` | Target icon (blue variant). |
| `chats` | Chat bubble icon. |
| `map` | Map pin or navigation icon. |
| `phone` | Phone or contact icon. |
| `menu` | Burger menu icon. |

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `name` | `keyof typeof iconMap` | **Required** | The icon name from the list above. |
| `className` | `string` | `" "` | Additional class names for styling (e.g., width, height). |
| `color` | `string` | `"currentColor"` | Icon color when not in dark mode, or when `noDarkMode` is `true`. |
| `noDarkMode` | `boolean` | `false` | Prevents automatic color switching in dark mode. |

---

## 💡 Usage Examples

### Basic Example

```tsx
import Icons from "@/components/icon";

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <Icons name="arrowRight" className="w-6 h-6" />
      <Icons name="moon" className="w-6 h-6" />
      <Icons name="sun" className="w-6 h-6" />
    </div>
  );
}
```

### Dark Mode Example

```tsx
<Icons name="moon" className="w-8 h-8" />
<Icons name="sun" className="w-8 h-8" />
<Icons name="arrowRight" color="#1146F2" noDarkMode />

```