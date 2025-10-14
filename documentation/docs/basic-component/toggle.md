---
id: toggle
title: Toggle
sidebar_label: Toggle
---

# Toggle

The `Toggle` component is used to create a two-state switch with smooth animations using **GSAP**.  
It is often used for switching between options like **"Light / Dark"**, **"Monthly / Yearly"**, or **"On / Off"**.

---

## ⚙️Props

| Prop | Type | Default | Description |
|------|------|----------|--------------|
| **textLeft** | `string` | — | The label text displayed on the left side of the toggle. |
| **textRight** | `string` | — | The label text displayed on the right side of the toggle. |
| **onToggle** | `(value: string) => void` | — | Callback fired when the selected value changes. |

## 💡 Usage Examples
### Example

```tsx
import React from "react";
import Toggle from "@/components/toggle";

export default function Example() {
  return (
    <Toggle
      textLeft="Light"
      textRight="Dark"
      onToggle={(value) => console.log("Selected:", value)}
    />
  );
}
```