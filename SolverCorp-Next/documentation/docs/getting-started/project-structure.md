---
id: project-structure
title: Project Structure
sidebar_label: Project Structure
---

# 📘 Project Structure

The project uses **React + TypeScript + Vite**.  
Below is the folder and file structure inside the `src/` directory:

---

## 📖 Explanation

### **app/**
This is the **Next.js App Router directory**, where you define your routes, layouts, and pages.

- **`(main)/`** → Contains main website routes such as `/about`, `/contact`, `/services`, etc.  
  Each folder represents a page route automatically handled by Next.js.  
- **`(withOutFooter)/`** → A layout group for pages without a footer (e.g., error pages, 404).  
- **`ClientLayout.tsx`** → Custom client-side layout logic (e.g., themes, animations).  
- **`layout.tsx`** → Root layout wrapper for the entire app.  
- **`not-found.tsx`** → 404 page shown when a route does not exist.  
- **`globals.css`** → Global CSS and Tailwind setup.  

---

### **documentation/**
Contains Docusaurus-style Markdown documentation files.  
Used for internal or public developer docs like installation guides, usage, and structure.

Example files:
- `intro.md`
- `installation.md`
- `project-structure.md`

---

### **src/**
Holds supporting files for the main app logic.

- **`assets/`** → Static files like images, icons, and SVGs.  
- **`component/`** → Reusable UI components (buttons, modals, cards).  
- **`context/`** → React Context providers (e.g., ThemeProvider, AppContext).  
- **`page-section/`** → Modular sections used to build pages (Hero, Features, etc).  
- **`theme/`** → Centralized theme configuration (colors, typography, etc).  
- **`utils/`** → Helper functions or constants shared across the app.  

---