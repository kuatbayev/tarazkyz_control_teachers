export const SUBJECT_OPTIONS = [
  'Математика',
  'Физика',
  'Тарих',
  'Ағылшын тілі',
  'Биология',
  'Химия',
  'География',
  'Информатика',
  'Көркем еңбек',
  'Домбыра',
  'Дене шынықтыру',
  'Дүниежүзі тарихы',
  'МХК',
  'Қазақ тілі',
  'Орыс тілі',
  'Түрік тілі',
] as const;

export const ALL_SUBJECTS_LABEL = 'Барлық пәндер';
export const DEFAULT_SUBJECT = SUBJECT_OPTIONS[0];

export const EVENT_TYPES = [
  'Сабаққа келмеді',
  'Сабаққа кешікті',
  'БТС емтиханына келмеді',
  'PET/KET емтиханына келмеді',
  'Кеш ескерту',
  'Ескертпей сабаққа келмеді',
  'Ауырып қалуы',
  'Сұранды',
  'Семинар / командировкаға кетуі',
] as const;

export const ALL_EVENT_TYPES_LABEL = 'Барлық түрлері';
export const DEFAULT_EVENT_TYPE = EVENT_TYPES[0];
export const ABSENCE_EVENT_TYPES = [EVENT_TYPES[0], EVENT_TYPES[2], EVENT_TYPES[3], EVENT_TYPES[5]] as const;

export const TERM_OPTIONS = [
  { value: 'Жалпы', label: 'Жалпы' },
  { value: '1 тоқсан', label: '1 тоқсан (1 қыркүйек - 27 қазан)' },
  { value: '2 тоқсан', label: '2 тоқсан (3 қараша - 28 желтоқсан)' },
  { value: '3 тоқсан', label: '3 тоқсан (8 қаңтар - 18 наурыз)' },
  { value: '4 тоқсан', label: '4 тоқсан (30 наурыз - 25 мамыр)' },
] as const;

export function normalizeTermValue(term: string) {
  const normalized = term.trim().toLowerCase();

  if (normalized === '1 term') return '1 тоқсан';
  if (normalized === '2 term') return '2 тоқсан';
  if (normalized === '3 term') return '3 тоқсан';
  if (normalized === '4 term') return '4 тоқсан';

  const matchedOption = TERM_OPTIONS.find((option) => option.value.toLowerCase() === normalized);
  return matchedOption?.value ?? 'Жалпы';
}

export const MONTH_NAMES = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'] as const;
export const DISPLAY_MONTHS = ['Қыр', 'Қаз', 'Қар', 'Жел', 'Қаң', 'Ақп', 'Нау'] as const;
