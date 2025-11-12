import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight } from "./theme";

// Common reusable styles
export const commonStyles = StyleSheet.create({
  // Layout
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },

  // Text styles
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.secondary,
  },
  textTertiary: {
    color: colors.tertiary,
  },
  textWhite: {
    color: colors.white,
  },

  // Font weights
  fontNormal: {
    fontWeight: fontWeight.normal,
  },
  fontMedium: {
    fontWeight: fontWeight.medium,
  },
  fontSemibold: {
    fontWeight: fontWeight.semibold,
  },
  fontBold: {
    fontWeight: fontWeight.bold,
  },

  // Headings
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },

  // Body text
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    color: colors.primary,
  },
  bodyMedium: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  bodySemibold: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },

  // Small text
  small: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.secondary,
  },
  smallMedium: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.secondary,
  },

  // Tiny text
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    color: colors.tertiary,
  },
  captionMedium: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.tertiary,
  },
});
