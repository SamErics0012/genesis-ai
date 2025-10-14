---
id: input
title: Input
sidebar_label: Input
---

# 🧾 Input Component

The `Input` component provides a consistent, styled input field for text, email, and textarea inputs.  
It supports light and dark themes automatically using Tailwind’s `dark:` classes.

---

## ✨ Overview

The `Input` component helps maintain design consistency across forms with built-in label and required state handling.

```tsx
import Input from "@/components/input";

<Input label="Name" placeholder="Enter your name" isRequired />
```

## 🎨 Variants

| Type | Description | Example |
|------|--------------|----------|
| `text` | Standard single-line text input. | `<Input type="text" label="Name" />` |
| `email` | Email input with browser validation. | `<Input type="email" label="Email" />` |
| `textarea` | Multi-line text area. | `<Input type="textarea" label="Message" />` |

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `type` | `"text"` \| `"email"` \| `"textarea"` | `"text"` | Determines the type of input rendered. |
| `label` | `string` | — | Optional label text displayed above the input. |
| `isRequired` | `boolean` | `false` | Adds an asterisk `*` and sets the input as required. |
| `placeholder` | `string` | — | Placeholder text inside the input field. |
| `className` | `string` | — | Custom class names for styling. |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | — | Passes through all native input attributes (e.g. `onChange`, `value`). |
