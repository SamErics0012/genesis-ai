---
id: accordion
title: Accordion
sidebar_label: Accordion
---

# Accordion

The `Accordion` component is a collapsible content container that reveals or hides content sections.  
It supports two display variants and uses smooth GSAP animations for expand/collapse transitions.

---

## Accordion

### Props

| Prop | Type | Default | Description |
|------|------|----------|--------------|
| **items** | `{ title: string; content: string }[]` | — | The list of accordion items. Each item contains a `title` and `content`. |
| **variant** | `"primary"` \| `"secondary"` | `"primary"` | Controls the visual style of the accordion. `primary` uses a solid background, while `secondary` uses minimal borders. |
| **className** | `string` | — | Custom class name for the accordion wrapper. |

---

### Example

```tsx
import React from "react";
import Accordion from "@/components/accordion";

const items = [
  { title: "What is this project about?", content: "It’s a modern React component library built with TypeScript and TailwindCSS." },
  { title: "Can I customize the styles?", content: "Yes, you can easily override styles using Tailwind utilities or custom classes." },
];

export default function Example() {
  return <Accordion items={items} variant="primary" />;
}
```

## AccordionItem
Used internally by the Accordion component.
Can also be used standalone if you need manual control over open/close state

### AccordionItem Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| **title** | `string` | — | The header text of the accordion item. |
| **content** | `string` | — | The text or content that appears when the accordion item is expanded. |
| **isOpen** | `boolean` | — | Whether the accordion item is currently open. |
| **onClick** | `() => void` | — | Function triggered when the item’s header is clicked. |
| **variant** | `"primary"` \| `"secondary"` | `"primary"` | Determines the visual style for the item. |