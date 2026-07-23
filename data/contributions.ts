export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionYearData {
  total: number;
  days: ContributionDay[];
}

export function getContributionsForYear(year: number): ContributionYearData {
  const days: ContributionDay[] = [];
  let total = 0;

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  let seed = year;
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const startDayOfWeek = startDate.getDay();
  const adjustedStart = new Date(startDate);
  adjustedStart.setDate(startDate.getDate() - startDayOfWeek);

  const endDayOfWeek = endDate.getDay();
  const adjustedEnd = new Date(endDate);
  adjustedEnd.setDate(endDate.getDate() + (6 - endDayOfWeek));

  for (let d = new Date(adjustedStart); d <= adjustedEnd; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const isWithinYear = d.getFullYear() === year;
    
    let count = 0;
    if (isWithinYear) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const r = pseudoRandom();
      
      const month = d.getMonth();
      const seasonalModifier = Math.sin((month / 11) * Math.PI) * 0.3 + 0.7;

      if (isWeekend) {
        if (r > 0.85) count = Math.floor(r * 2);
      } else {
        if (r > 0.25) {
          count = Math.floor(r * 8 * seasonalModifier);
        }
      }
    }

    days.push({ date: dateStr, count });
    if (isWithinYear) {
      total += count;
    }
  }

  return { total, days };
}

