# NativeWind Usage Guide

NativeWind is now set up! You can use Tailwind CSS classes directly in your React Native components.

## Quick Start

Instead of using `StyleSheet.create()`, use the `className` prop:

```tsx
import { View, Text } from "react-native";

export const MyComponent = () => {
  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-primary">
        Hello NativeWind!
      </Text>
    </View>
  );
};
```

## Custom Colors (from your theme)

Your custom colors are available in `tailwind.config.js`:

```tsx
className="bg-primary"      // #000000 (black)
className="bg-secondary"    // #666666 (gray)
className="bg-tertiary"     // #999999 (light gray)
className="bg-background"   // #FFFFFF (white)
className="bg-card"         // #F5F5F5 (light gray card)
className="border-border"   // #E5E5E5 (border color)
className="text-success"    // #22C55E (green)
className="text-error"      // #EF4444 (red)
className="text-warning"    // #F59E0B (yellow)
```

## Common Patterns

### Layout
```tsx
className="flex-1"                    // { flex: 1 }
className="flex-row"                  // Row layout
className="flex-row items-center"    // Row with centered items
className="flex-row justify-between" // Row with space-between
className="items-center justify-center" // Centered content
```

### Spacing
```tsx
className="p-4"      // padding: 16px
className="px-4"     // horizontal padding
className="py-4"     // vertical padding
className="m-4"      // margin: 16px
className="gap-4"    // gap between flex children
```

### Text Styles
```tsx
className="text-xs"          // 12px
className="text-sm"          // 14px
className="text-base"        // 16px
className="text-lg"          // 18px
className="text-xl"          // 20px
className="text-2xl"         // 24px

className="font-normal"      // 400
className="font-medium"      // 500
className="font-semibold"    // 600
className="font-bold"        // 700
```

### Border Radius
```tsx
className="rounded-sm"       // 6px
className="rounded-md"       // 8px
className="rounded-lg"       // 12px
className="rounded-xl"       // 16px
className="rounded-full"     // 9999px (circular)
```

## Conditional Styles

Use template literals for dynamic styles:

```tsx
<View className={`p-4 ${isActive ? "bg-primary" : "bg-card"}`}>
  <Text>Content</Text>
</View>
```

## Custom Values

Use bracket notation for custom values:

```tsx
className="w-[28px]"           // width: 28px
className="h-[28px]"           // height: 28px
className="text-[11px]"        // fontSize: 11px
className="bg-[#DDDDDD]"       // custom color
className="-ml-[8px]"          // negative margin
```

## Migration from StyleSheet

**Before (StyleSheet):**
```tsx
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
});

<View style={styles.container}>
```

**After (NativeWind):**
```tsx
<View className="flex-row items-center bg-card rounded-xl p-4">
```

## Benefits

✅ No more StyleSheet.create()  
✅ No more importing theme constants  
✅ Faster development with familiar Tailwind syntax  
✅ Better autocomplete with Tailwind CSS IntelliSense  
✅ Smaller bundle size (styles are optimized)  
✅ Responsive design utilities built-in  

## Resources

- [NativeWind Docs](https://www.nativewind.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

