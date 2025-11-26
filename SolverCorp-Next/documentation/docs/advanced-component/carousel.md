---
id: carousel
title: Carousel
sidebar_label: Carousel
---

# Carousel Component

The **Carousel** component displays a scrollable list of members, using GSAP for smooth animations and responsive behavior.  
It supports light/dark themes and dynamically adjusts how many cards are visible based on the screen width.

---

## ✨ Features

- **Responsive Design**  
  Adjusts the number of visible items based on screen width:  
  - `< 640px` → 1 item visible  
  - `< 1024px` → 3 items visible  
  - `≥ 1024px` → 4 items visible

- **Smooth GSAP Animation**  
  Uses `gsap.to()` for elegant sliding transitions.

- **Interactive Controls**  
  Includes **Previous** and **Next** buttons with disabled states at the edges.

- **Dark Mode Support**  
  Compatible with Tailwind’s `dark:` classes for theme switching.

- **Reusable Structure**  
  Simple prop-based design for easy integration into any section.

---

## 🧾 Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| **items** | `member[]` | — | Array of member data objects displayed in the carousel. |

---

## 🧩 Member Type

| Property | Type | Description |
|-----------|------|-------------|
| **name** | `string` | Full name of the team member. |
| **experience** | `string` | Description of the team member’s experience. |
| **image** | `string` | URL or path to the member’s image. |
| **position** | `string` | Role or title displayed on the badge. |

## 🧠 Example Usage

```tsx
import Carousel from "@/components/carousel";

const members = [
  {
    name: "John Doe",
    experience: "5 years in web development",
    image: "/images/john.png",
    position: "Frontend Developer",
  },
  {
    name: "Jane Smith",
    experience: "UI/UX Designer with 7 years experience",
    image: "/images/jane.png",
    position: "Designer",
  },
];

export default function TeamSection() {
  return <Carousel items={members} />;
}
```