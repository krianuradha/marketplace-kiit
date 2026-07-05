export const CATEGORIES = ['Clothing', 'Furniture', 'Electronics', 'Books', 'Sports', 'Home & Kitchen', 'Other'] as const;

export const SECTIONS = ["Queen's Castle", "King Palace"] as const;

export const USED_TIME_OPTIONS = [
  'Brand new',
  'Few months',
  '6 months',
  '1 year',
  '1-2 years',
  '2+ years',
] as const;

export const GENDER_OPTIONS = [
  { value: 'F', label: 'Female' },
  { value: 'M', label: 'Male' },
] as const;

export const SECTION_BY_GENDER = {
  F: "Queen's Castle",
  M: "King Palace",
} as const;
