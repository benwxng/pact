# Pact App Styling Guide

Simple, clean StyleSheet-based styling system with shared constants.

## 📁 Structure

```
styles/
├── theme.ts      # Colors, spacing, fonts, shadows
└── common.ts     # Reusable common styles
```

## 🎨 How to Use

### Import what you need:

```typescript
import { colors, spacing, borderRadius, fontSize, fontWeight } from "@/styles/theme";
import { commonStyles } from "@/styles/common";
```

### Example Component:

```typescript
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "@/styles/theme";
import { commonStyles } from "@/styles/common";

export const MyComponent = () => {
  return (
    <View style={[commonStyles.card, styles.container]}>
      <Text style={commonStyles.h2}>Hello</Text>
      <Text style={commonStyles.body}>World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
});
```

## 🎯 Theme Values

### Colors
```typescript
colors.primary       // #000000
colors.secondary     // #666666
colors.tertiary      // #999999
colors.background    // #FFFFFF
colors.card          // #F5F5F5
colors.white         // #FFFFFF
colors.black         // #000000
colors.border        // #E5E5E5
colors.success       // #22C55E
colors.error         // #EF4444
colors.warning       // #F59E0B
```

### Spacing
```typescript
spacing.xs      // 4
spacing.sm      // 8
spacing.md      // 12
spacing.lg      // 16
spacing.xl      // 20
spacing.xxl     // 24
spacing.xxxl    // 32
```

### Border Radius
```typescript
borderRadius.sm      // 6
borderRadius.md      // 8
borderRadius.lg      // 12
borderRadius.xl      // 16
borderRadius.full    // 9999
```

### Font Sizes
```typescript
fontSize.xs      // 12
fontSize.sm      // 14
fontSize.base    // 16
fontSize.lg      // 18
fontSize.xl      // 20
fontSize.xxl     // 24
fontSize.xxxl    // 28
fontSize.huge    // 32
```

### Font Weights
```typescript
fontWeight.normal     // "400"
fontWeight.medium     // "500"
fontWeight.semibold   // "600"
fontWeight.bold       // "700"
```

### Shadows
```typescript
shadows.sm    // Small shadow
shadows.md    // Medium shadow
shadows.lg    // Large shadow (good for FABs)
```

## 📦 Common Styles

Use these for quick layouts:

```typescript
commonStyles.flex1              // { flex: 1 }
commonStyles.flexRow            // Row layout
commonStyles.flexRowCenter      // Row with centered items
commonStyles.flexRowBetween     // Row with space-between
commonStyles.center             // Centered content
commonStyles.container          // Full screen container
commonStyles.card               // Card background

// Text styles
commonStyles.h1                 // Large heading
commonStyles.h2                 // Medium heading
commonStyles.h3                 // Small heading
commonStyles.body               // Body text
commonStyles.bodyMedium         // Medium body text
commonStyles.bodySemibold       // Semibold body text
commonStyles.small              // Small text
commonStyles.caption            // Caption text

// Colors
commonStyles.textPrimary        // Black text
commonStyles.textSecondary      // Gray text
commonStyles.textTertiary       // Light gray text
commonStyles.textWhite          // White text
```

## ✅ Best Practices

### 1. Always import from theme:
```typescript
// Good ✅
import { colors } from "@/styles/theme";
backgroundColor: colors.card

// Bad ❌
backgroundColor: "#F5F5F5"
```

### 2. Use spacing constants:
```typescript
// Good ✅
padding: spacing.lg

// Bad ❌
padding: 16
```

### 3. Combine common styles with custom:
```typescript
// Good ✅
<View style={[commonStyles.card, styles.myCustomStyle]}>

// Okay, but more verbose
<View style={styles.myCustomStyle}>
```

### 4. Keep component styles at the bottom:
```typescript
export const MyComponent = () => {
  return <View>...</View>;
};

const styles = StyleSheet.create({
  // styles here
});
```

## 🎨 Customizing

To change app-wide colors, just edit `styles/theme.ts`:

```typescript
export const colors = {
  primary: "#FF6B6B",  // Change to red theme
  // ...
};
```

All components will update automatically!

