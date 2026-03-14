const TERM_RANGES = {
  '1 тоқсан': { year: 'start', startMonth: 9, startDay: 1, endMonth: 10, endDay: 27 },
  '2 тоқсан': { year: 'start', startMonth: 11, startDay: 3, endMonth: 12, endDay: 28 },
  '3 тоқсан': { year: 'end', startMonth: 1, startDay: 8, endMonth: 3, endDay: 18 },
  '4 тоқсан': { year: 'end', startMonth: 3, startDay: 30, endMonth: 5, endDay: 25 },
} as const;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function buildIsoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseAcademicYear(academicYear: string) {
  const match = academicYear.match(/(\d{4})\D+(\d{4})/);
  if (!match) return null;

  const startYear = Number(match[1]);
  const endYear = Number(match[2]);

  if (Number.isNaN(startYear) || Number.isNaN(endYear)) return null;

  return { startYear, endYear };
}

export function filterEventsByTerm<T extends { date: string }>(events: T[], academicYear: string, term: string) {
  if (term === 'Жалпы') {
    return events;
  }

  const years = parseAcademicYear(academicYear);
  const range = TERM_RANGES[term as keyof typeof TERM_RANGES];

  if (!years || !range) {
    return events;
  }

  const year = range.year === 'start' ? years.startYear : years.endYear;
  const start = buildIsoDate(year, range.startMonth, range.startDay);
  const end = buildIsoDate(year, range.endMonth, range.endDay);

  return events.filter((event) => event.date >= start && event.date <= end);
}
