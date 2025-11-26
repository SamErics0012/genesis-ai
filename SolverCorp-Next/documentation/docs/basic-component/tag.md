---
id: tag
title: Tag
sidebar_label: Tag
---

# Tag

The `Tag` component is a small badge-like element used to highlight keywords, categories, or statuses.  
It supports optional icons, dark mode, and customizable colors.

---

## ✨ Features
- Automatically adapts to light and dark mode.
- Optional sparkle icon (`starsSparkle`) for decorative effect.
- Fully customizable text color via `color` prop.
- Compact, rounded, and responsive design.

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `className` | `string` | `""` | Additional CSS classes for custom styling. |
| `color` | `string` | `"#070707"` | Custom text color for the tag. |
| `noDarkMode` | `boolean` | `false` | If `true`, disables automatic dark mode color switching. |
| `noIcon` | `boolean` | `false` | If `true`, hides the sparkle icon (`starsSparkle`). |
| `children` | `React.ReactNode` | — | Content inside the tag (usually text). |

---

## 💡 Usage Examples

### Basic Example

```tsx
import Tag from "@/components/tag";

export default function Example() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Tag>Default Tag</Tag>
      <Tag color="#1146F2">Blue Tag</Tag>
      <Tag noIcon>Tag Without Icon</Tag>
    </div>
  );
}
```

### Dark Mode Example
```tsx
<Tag>Light Mode</Tag>
<Tag noDarkMode color="#1146F2">Always Blue</Tag>
```

### With Custom Styling
```tsx
<Tag className="bg-[#1146F2] text-white border-none">
  Custom Styled Tag
</Tag>
```

### Without Icon
```tsx
<Tag noIcon>Simple Tag</Tag>
```