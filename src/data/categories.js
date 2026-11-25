import { categoryColors, colors } from '../theme';

export const CATEGORIES = ['Comida', 'Transporte', 'Servicios', 'Ocio', 'Salud', 'Otros'];

export const CATEGORY_META = {
  Comida: { color: categoryColors.Comida, icon: 'fast-food-outline' },
  Transporte: { color: categoryColors.Transporte, icon: 'car-outline' },
  Servicios: { color: categoryColors.Servicios, icon: 'flash-outline' },
  Ocio: { color: categoryColors.Ocio, icon: 'game-controller-outline' },
  Salud: { color: categoryColors.Salud, icon: 'medkit-outline' },
  Otros: { color: categoryColors.Otros, icon: 'pricetag-outline' },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? {
    color: colors.muted,
    icon: 'pricetag-outline',
  };
}

export default CATEGORIES;
