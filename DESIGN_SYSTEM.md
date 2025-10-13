# Design System Usage Guide

A comprehensive design system for MyStartup.ai ensuring consistent typography, spacing, and visual hierarchy across the application.

## 📐 Typography Scale

### Headings (Responsive)

Use these standardized heading classes instead of inline Tailwind classes:

```jsx
// ❌ OLD WAY (inconsistent)
<h1 className="text-4xl font-bold">Title</h1>
<h2 className="text-2xl font-semibold">Subtitle</h2>

// ✅ NEW WAY (standardized)
<h1 className="heading-1">Primary Title</h1>
<h2 className="heading-2">Section Header</h2>
<h3 className="heading-3">Subsection</h3>
<h4 className="heading-4">Card Title</h4>
<h5 className="heading-5">Small Heading</h5>
<h6 className="heading-6">Tiny Heading</h6>
```

**Heading Sizes:**
- `.heading-1`: 4xl → 5xl (mobile → desktop)
- `.heading-2`: 3xl → 4xl
- `.heading-3`: 2xl → 3xl
- `.heading-4`: xl → 2xl
- `.heading-5`: lg → xl
- `.heading-6`: base → lg

### Body Text

```jsx
<p className="text-body-lg">Large body text for emphasis</p>
<p className="text-body">Standard body text (default)</p>
<p className="text-body-sm">Small body text for details</p>
```

### Utility Text

```jsx
<span className="text-label">Form Label</span>
<span className="text-caption">Caption or helper text</span>
<span className="text-tiny">Tiny text (uppercase)</span>
```

---

## 📏 Spacing Tokens

### Section Spacing (Vertical Padding)

```jsx
// ❌ OLD WAY
<section className="py-12 md:py-16">

// ✅ NEW WAY
<section className="section-spacing">Content</section>
<section className="section-spacing-sm">Compact Section</section>
<section className="section-spacing-lg">Hero Section</section>
```

### Container Widths

```jsx
<div className="container-narrow">   {/* max-w-3xl */}
<div className="container-default">  {/* max-w-7xl */}
<div className="container-wide">     {/* max-w-[1600px] */}
```

### Card Padding

```jsx
<Card className="card-padding">Standard Card</Card>
<Card className="card-padding-sm">Compact Card</Card>
<Card className="card-padding-lg">Spacious Card</Card>
```

### Stack Spacing (Vertical)

For vertical spacing between elements:

```jsx
<div className="stack-xs">  {/* space-y-2 */}
<div className="stack-sm">  {/* space-y-4 */}
<div className="stack-md">  {/* space-y-6 */}
<div className="stack-lg">  {/* space-y-8 */}
<div className="stack-xl">  {/* space-y-12 */}
```

### Inline Spacing (Horizontal)

For horizontal spacing between elements:

```jsx
<div className="inline-xs">  {/* space-x-2 */}
<div className="inline-sm">  {/* space-x-4 */}
<div className="inline-md">  {/* space-x-6 */}
<div className="inline-lg">  {/* space-x-8 */}
```

### Grid Gaps

```jsx
<div className="grid grid-gap-sm">   {/* gap-4 */}
<div className="grid grid-gap-md">   {/* gap-6 */}
<div className="grid grid-gap-lg">   {/* gap-8 */}
```

---

## 🎨 Brand Gradients

Apply these gradient text effects for brand consistency:

```jsx
<h1 className="gradient-text-primary">
  MyStartup.ai
</h1>

<span className="gradient-text-secondary">Featured</span>

<span className="gradient-text-accent">New!</span>
```

**Gradient Colors:**
- `.gradient-text-primary`: Blue → Purple → Blue
- `.gradient-text-secondary`: Blue → Purple
- `.gradient-text-accent`: Purple → Cyan

---

## 💡 Usage Examples

### Hero Section

```jsx
<section className="section-spacing-lg container-default">
  <div className="stack-lg text-center">
    <h1 className="heading-1 gradient-text-primary">
      Transform Your Startup Idea
    </h1>
    <p className="text-body-lg">
      AI-powered platform for founders
    </p>
  </div>
</section>
```

### Card Layout

```jsx
<Card className="card-padding">
  <div className="stack-md">
    <h3 className="heading-3">Business Plan Generator</h3>
    <p className="text-body">
      Create investor-ready business plans
    </p>
    <Button>Get Started</Button>
  </div>
</Card>
```

### Form Section

```jsx
<div className="stack-sm">
  <label className="text-label">Startup Name</label>
  <Input placeholder="Enter your startup name" />
  <span className="text-caption">This will appear on documents</span>
</div>
```

### Grid Layout

```jsx
<div className="grid grid-cols-3 grid-gap-md">
  <Card className="card-padding-sm">Feature 1</Card>
  <Card className="card-padding-sm">Feature 2</Card>
  <Card className="card-padding-sm">Feature 3</Card>
</div>
```

---

## 🚀 Benefits

1. **Consistency**: Uniform sizing across all pages
2. **Responsive**: Automatically adapts to screen sizes
3. **Maintainable**: Update styles in one place
4. **Developer-Friendly**: Clear, semantic class names
5. **Performance**: Utility classes compiled at build time

---

## 📝 Best Practices

1. **Always use design system classes** for headings and spacing
2. **Combine with Tailwind** for colors, borders, and other styles
3. **Use semantic HTML** with design classes (h1 + .heading-1)
4. **Test responsiveness** - design classes adapt to breakpoints
5. **Don't override** design system classes with inline styles

---

## 🔄 Migration Guide

### Before (Inconsistent)
```jsx
<h1 className="text-3xl font-bold">Title</h1>
<h2 className="text-xl font-semibold">Subtitle</h2>
<div className="space-y-4">
  <p className="text-base">Content</p>
</div>
```

### After (Design System)
```jsx
<h1 className="heading-1">Title</h1>
<h2 className="heading-2">Subtitle</h2>
<div className="stack-sm">
  <p className="text-body">Content</p>
</div>
```

---

## 🎯 Quick Reference

| Element | Class | Size |
|---------|-------|------|
| H1 | `.heading-1` | 4xl → 5xl |
| H2 | `.heading-2` | 3xl → 4xl |
| H3 | `.heading-3` | 2xl → 3xl |
| Body | `.text-body` | base |
| Caption | `.text-caption` | xs |
| Section | `.section-spacing` | py-12 → py-24 |
| Card | `.card-padding` | p-6 → p-8 |
| Stack | `.stack-sm` | space-y-4 |
| Grid Gap | `.grid-gap-md` | gap-6 |

---

**Last Updated**: October 13, 2025
**Location**: `client/src/index.css` (lines 299-457)
