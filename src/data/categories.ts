export const CATEGORIES = {
  PAPELERIA: 'papeleria-corporativa',
  GRANDES_FORMATOS: 'grandes-formatos',
  PROMOCIONALES: 'promocionales',
  PACKAGING: 'packaging-etiquetas',
} as const;

export type CategorySlug = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'papeleria-corporativa': 'Papelería Corporativa',
  'grandes-formatos': 'Grandes Formatos',
  'promocionales': 'Regalos Promocionales',
  'packaging-etiquetas': 'Packaging y Etiquetas',
};

export const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  'papeleria-corporativa': 'Afiches, cuadernos, carpetas, tarjetas y volantes para tu empresa.',
  'grandes-formatos': 'Gigantografías, señalética, brandeo vehicular y mobiliario comunicacional.',
  'promocionales': 'Galvanos, pendrives, lápices, credenciales, lanyards y más.',
  'packaging-etiquetas': 'Cajas corrugadas, microcorrugado, cajas de lujo y etiquetas industriales.',
};
