export const enTypography = {
  fontFamilyLight: 'SpaceGrotesk_300Light',
  fontFamily: 'SpaceGrotesk_400Regular',
  fontFamilyMedium: 'SpaceGrotesk_500Medium',
  fontFamilySemiBold: 'SpaceGrotesk_600SemiBold',
  fontFamilyBold: 'SpaceGrotesk_700Bold',
} as const;

export const kaTypography = {
  fontFamilyLight: 'FiraGO_300Light',
  fontFamily: 'FiraGO_400Regular',
  fontFamilyMedium: 'FiraGO_500Medium',
  fontFamilySemiBold: 'FiraGO_600SemiBold',
  fontFamilyBold: 'FiraGO_700Bold',
} as const;

// default export — English (SpaceGrotesk), used in static StyleSheets as fallback
export const typography = enTypography;
