---
id: switch
title: Switch
sidebar_label: Switch
---

# Switch

A customizable toggle component that can be used for theme switching or general boolean state control.  
When connected to your app’s theme context, it toggles between light and dark modes automatically.

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|--------------|
| **noDarkMode** | `boolean` | `false` | Disables dark mode functionality. When set to `true`, the switch only toggles its local state without affecting the app’s theme. |
| **checked** | `boolean` | `false` | Defines the initial state of the switch. If `true`, the switch starts in the “on” position. |
| **onChange** | `(checked: boolean) => void` | — | Callback function that runs when the switch value changes. Receives the new `checked` state as an argument. |
| **className** | `string` | — | Adds custom Tailwind or CSS classes for styling. |
| **...props** | `React.HTMLAttributes<HTMLButtonElement>` | — | Inherits all standard HTML button attributes (e.g., `disabled`, `aria-*`, `title`). |

---

## Example

```tsx
import React from "react";
import Switch from "@/components/switch";

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <Switch onChange={(val) => console.log("Switch:", val)} />
      <Switch noDarkMode checked />
    </div>
  );
}
```