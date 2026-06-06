import React, { useMemo } from 'react';

const LEVEL_CLASSES = [
  'bg-surface border border-ink/10',
  'bg-accent/30 border border-ink/10',
  'bg-accent/60 border border-ink/10',
  'bg-accent border border-ink/10',
  'bg-ink border border-ink'
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getLevel = (count) => {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ContributionHeatmap = ({ contributions = [] }) => {
  const { weeks, monthLabels, total, byDate } = useMemo(() => {
    const map = new Map();
    contributions.forEach((item) => {
      if (item?.date) {
        map.set(item.date, Number(item.count || 0));
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    const weekBuckets = [];
    days.forEach((day, index) => {
      const weekIndex = Math.floor(index / 7);
      if (!weekBuckets[weekIndex]) weekBuckets[weekIndex] = [];
      weekBuckets[weekIndex].push(new Date(day));
    });

    weekBuckets.forEach((week) => {
      while (week.length < 7) {
        week.push(null);
      }
    });

    const labels = weekBuckets.map((week, index) => {
      const firstDay = week.find(Boolean);
      const previousFirstDay = weekBuckets[index - 1]?.find(Boolean);
      if (!firstDay) return '';

      const isFirstWeek = index === 0;
      const isNewMonth = !previousFirstDay || firstDay.getMonth() !== previousFirstDay.getMonth();
      return isFirstWeek || isNewMonth ? MONTH_LABELS[firstDay.getMonth()] : '';
    });

    const totalCount = days.reduce((acc, day) => {
      const key = toDateKey(day);
      return acc + (map.get(key) || 0);
    }, 0);

    return { weeks: weekBuckets, monthLabels: labels, total: totalCount, byDate: map };
  }, [contributions]);

  if (!contributions || contributions.length === 0) {
    return (
      <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Contribution Heatmap</h2>
        <p className="text-muted font-sans text-sm">No contribution data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Contribution Heatmap</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-muted mt-1">
            {total} contributions in the last year
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted">
          <span>Less</span>
          {LEVEL_CLASSES.map((levelClass, index) => (
            <span key={index} className={`h-3 w-3 rounded-sm ${levelClass}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-fit">
          <div className="ml-8 flex gap-1 h-4 mb-1">
            {monthLabels.map((label, index) => (
              <span
                key={`${label || 'empty'}-${index}`}
                className="w-3 shrink-0 text-[10px] font-bold uppercase leading-none text-muted"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex w-6 shrink-0 flex-col gap-1 text-[10px] font-bold uppercase leading-3 text-muted">
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={`${label || 'day'}-${index}`} className="h-3">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <span key={dayIndex} className="h-3 w-3" />;
                    }
                    const key = toDateKey(day);
                    const count = byDate.get(key) || 0;
                    const level = getLevel(count);
                    return (
                      <span
                        key={key}
                        className={`h-3 w-3 rounded-sm ${LEVEL_CLASSES[level]}`}
                        title={`${key}: ${count} contributions`}
                        aria-label={`${key}: ${count} contributions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
