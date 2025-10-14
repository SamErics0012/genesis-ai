---
id: dark-layout
title: Dark Layout
sidebar_label: Dark Layout
---

# 🌙 Dark Layout

The **Dark Layout** enables a sleek interface optimized for low-light environments.  
This template uses a combination of **`data-theme`** (for global control) and Tailwind’s `dark:` utility classes** (for styling).

---

## ⚙️ How It Works

The theme state is handled globally through the context:

```tsx
// src/context/ThemeProvider.tsx
useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);
  }
```
When the dark theme is active, the html tag automatically receives the dark class, activating all dark: Tailwind styles.

## 🧩 Integration with Layout

Inside your layout file:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
```
This makes it possible to apply data-theme="dark" to the layout container for additional logic or theming libraries (like DaisyUI).

## 🎨 Styling Example

Here’s how you can use Tailwind’s dark: utility classes to style components:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-6 rounded-xl">
  <h2 className="text-2xl font-semibold">Dark Mode Example</h2>
  <p className="mt-2 text-gray-600 dark:text-gray-300">
    This section automatically switches between light and dark.
  </p>
</div>
```