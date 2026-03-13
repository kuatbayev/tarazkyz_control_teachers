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
  'Өнер тілі',
] as const;

export const ALL_SUBJECTS_LABEL = 'Барлық пәндер';
export const DEFAULT_SUBJECT = SUBJECT_OPTIONS[0];

export const EVENT_TYPES = [
  'Сабаққа келмеу',
  'Сабаққа кешігу',
  'БТС емтиханы күні келмеуі',
  'Кеш ескерту',
  'Ескертпей сабаққа келмеуі',
  'Ауырып қалуы',
  'Семинар / командировкаға кетуі',
] as const;

export const ALL_EVENT_TYPES_LABEL = 'Барлық түрлері';
export const DEFAULT_EVENT_TYPE = EVENT_TYPES[0];

export const MONTH_NAMES = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'] as const;
export const DISPLAY_MONTHS = ['Қыр', 'Қаз', 'Қар', 'Жел', 'Қаң', 'Ақп', 'Нау'] as const;
