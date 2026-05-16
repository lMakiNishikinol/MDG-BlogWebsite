"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EventType =
  | "share"
  | "holiday"
  | "exam"
  | "labor"
  | "ceremony"
  | "teacher-start"
  | "student-start";

interface DateEvent {
  date: string;
  title: string;
  description?: string;
  type?: EventType;
}

interface DateScheduleData {
  range: {
    start: string;
    end: string;
  };
  events: DateEvent[];
}

interface DayCell {
  date: Date;
  iso: string;
  day: number;
  isInRange: boolean;
  event?: DateEvent;
}

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(input: string): Date {
  const [y, m, d] = input.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function startOfWeekSunday(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function chunkDays(days: DayCell[]): DayCell[][] {
  const rows: DayCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }
  return rows;
}

function buildMonthDays(monthDate: Date, start: Date, end: Date, eventMap: Map<string, DateEvent>): DayCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1, 12, 0, 0);
  const last = new Date(year, month + 1, 0, 12, 0, 0);
  const daysInMonth = last.getDate();

  const firstWeekday = first.getDay();
  const result: DayCell[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    const fillerDate = new Date(year, month, 1 - (firstWeekday - i), 12, 0, 0);
    result.push({
      date: fillerDate,
      iso: toISODate(fillerDate),
      day: fillerDate.getDate(),
      isInRange: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day, 12, 0, 0);
    const iso = toISODate(date);
    result.push({
      date,
      iso,
      day,
      isInRange: date >= start && date <= end,
      event: eventMap.get(iso),
    });
  }

  while (result.length % 7 !== 0) {
    const lastCellDate = result[result.length - 1]?.date ?? last;
    const next = new Date(lastCellDate);
    next.setDate(lastCellDate.getDate() + 1);
    result.push({
      date: next,
      iso: toISODate(next),
      day: next.getDate(),
      isInRange: false,
    });
  }

  return result;
}

function getEventStyle(type?: EventType): string {
  switch (type) {
    case "share":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/35";
    case "holiday":
      return "bg-sky-500/20 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/35";
    case "exam":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/35";
    case "labor":
      return "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 ring-1 ring-fuchsia-500/35";
    case "ceremony":
      return "bg-rose-500/20 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/35";
    case "teacher-start":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-500/35";
    case "student-start":
      return "bg-lime-500/20 text-lime-700 dark:text-lime-300 ring-1 ring-lime-500/35";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 ring-1 ring-gray-500/35";
  }
}

export default function DateScheduleCalendar() {
  const [data, setData] = useState<DateScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");
    const apply = (matches: boolean) => setIsTouchDevice(matches);

    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isTouchDevice || !activeDate) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setActiveDate(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isTouchDevice, activeDate]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        const res = await fetch("/data/date.json", { cache: "no-store" });
        if (!res.ok) throw new Error("无法读取日期配置");
        const json = (await res.json()) as DateScheduleData;

        if (!json?.range?.start || !json?.range?.end || !Array.isArray(json?.events)) {
          throw new Error("日期配置格式无效");
        }

        if (!canceled) {
          setData(json);
          setError("");
        }
      } catch (e) {
        if (!canceled) {
          const msg = e instanceof Error ? e.message : "日期配置加载失败";
          setError(msg);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  const calendar = useMemo(() => {
    if (!data) return [] as Array<{ month: Date; days: DayCell[] }>;

    const start = parseISODate(data.range.start);
    const end = parseISODate(data.range.end);

    const eventMap = new Map<string, DateEvent>();
    data.events.forEach((event) => {
      eventMap.set(event.date, event);
    });

    const months: Array<{ month: Date; days: DayCell[] }> = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1, 12, 0, 0);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1, 12, 0, 0);

    while (cursor <= endMonth) {
      months.push({
        month: new Date(cursor),
        days: buildMonthDays(cursor, start, end, eventMap),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }, [data]);

  const weekMeta = useMemo(() => {
    if (!data) return null;
    const start = parseISODate(data.range.start);
    const end = parseISODate(data.range.end);
    return {
      startWeek: startOfWeekSunday(start),
      endWeek: startOfWeekSunday(end),
    };
  }, [data]);

  const getWeekNumber = (weekStartDate: Date): number | null => {
    if (!weekMeta) return null;
    if (weekStartDate < weekMeta.startWeek || weekStartDate > weekMeta.endWeek) {
      return null;
    }

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const diff = weekStartDate.getTime() - weekMeta.startWeek.getTime();
    return Math.floor(diff / msPerWeek) + 1;
  };

  const eventLegend = useMemo(() => {
    if (!data) return [] as Array<{ key: string; label: string; type?: EventType }>;
    const byTitle = new Map<string, { key: string; label: string; type?: EventType }>();
    data.events.forEach((e) => {
      const key = `${e.type ?? "default"}:${e.title}`;
      if (!byTitle.has(key)) {
        byTitle.set(key, { key, label: e.title, type: e.type });
      }
    });
    return Array.from(byTitle.values());
  }, [data]);

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-800/50 p-5 md:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">日程安排加载中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-8 rounded-2xl border border-rose-200/70 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-950/20 p-5 md:p-6">
        <p className="text-sm text-rose-700 dark:text-rose-300">日程安排加载失败: {error || "未知错误"}</p>
      </div>
    );
  }

  return (
    <section className="mt-8" ref={containerRef}>
      <div className="mb-4 flex flex-col items-start gap-1.5 md:flex-row md:items-end md:justify-between md:gap-3">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">日程安排</h3>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          显示范围: {data.range.start} 至 {data.range.end}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {eventLegend.map((legend) => (
          <span
            key={legend.key}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getEventStyle(legend.type)}`}
          >
            {legend.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calendar.map(({ month, days }) => {
          const key = monthKey(month);
          const weekRows = chunkDays(days);
          return (
            <article
              key={key}
              className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-800/50 p-4 shadow-sm"
            >
              <h4 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-200">
                {month.getFullYear()} 年 {month.getMonth() + 1} 月
              </h4>

              <div className="grid grid-cols-[2rem_repeat(7,minmax(0,1fr))] md:grid-cols-[2.5rem_repeat(7,minmax(0,1fr))] gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span className="text-[10px] md:text-xs">周次</span>
                {WEEK_LABELS.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>

              <div className="space-y-1">
                {weekRows.map((weekDays, row) => {
                  const weekStartDate = startOfWeekSunday(weekDays[0].date);
                  const weekNo = getWeekNumber(weekStartDate);

                  const placeBelow = row === 0;
                  const panelVerticalClass = placeBelow ? "top-full mt-2" : "bottom-full mb-2";
                  return (
                    <div key={`${key}-w${row}`} className="grid grid-cols-[2rem_repeat(7,minmax(0,1fr))] md:grid-cols-[2.5rem_repeat(7,minmax(0,1fr))] gap-1 items-center">
                      <div className="h-8 md:h-9 flex items-center justify-center rounded-lg bg-gray-100/55 dark:bg-gray-700/30 text-[9px] md:text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {weekNo ? (
                          <>
                            <span className="hidden md:inline">第{weekNo}周</span>
                            <span className="md:hidden tracking-tight">W{weekNo}</span>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </div>

                      {weekDays.map((day, col) => {
                        const isOtherMonth = day.date.getMonth() !== month.getMonth();
                        const isSpecial = Boolean(day.event);
                        const isActive = activeDate === day.iso && isSpecial;

                        let horizontalClass = "left-1/2 -translate-x-1/2";
                        let arrowHorizontalClass = "left-1/2 -translate-x-1/2";

                        if (isTouchDevice) {
                          if (col <= 3) {
                            horizontalClass = "left-0";
                            arrowHorizontalClass = "left-4";
                          } else {
                            horizontalClass = "right-0";
                            arrowHorizontalClass = "right-4";
                          }
                        } else if (col <= 1) {
                          horizontalClass = "left-0";
                          arrowHorizontalClass = "left-4";
                        } else if (col >= 5) {
                          horizontalClass = "right-0";
                          arrowHorizontalClass = "right-4";
                        }

                        const arrowVerticalClass = placeBelow
                          ? "bottom-full translate-y-1 border-r border-b"
                          : "top-full -translate-y-1 border-l border-t";

                        return (
                          <div key={`${key}-${day.iso}`} className="relative">
                            <button
                              type="button"
                              disabled={!isSpecial}
                              onMouseEnter={() => !isTouchDevice && isSpecial && setActiveDate(day.iso)}
                              onMouseLeave={() => !isTouchDevice && isSpecial && setActiveDate((prev) => (prev === day.iso ? null : prev))}
                              onFocus={() => isSpecial && setActiveDate(day.iso)}
                              onBlur={() => isSpecial && setActiveDate((prev) => (prev === day.iso ? null : prev))}
                              onClick={() => {
                                if (!isSpecial) {
                                  if (isTouchDevice) {
                                    setActiveDate(null);
                                  }
                                  return;
                                }
                                setActiveDate((prev) => (prev === day.iso ? null : day.iso));
                              }}
                              className={[
                                "h-9 w-full rounded-lg text-xs md:text-sm transition-all duration-200",
                                isOtherMonth
                                  ? "text-gray-300 dark:text-gray-600"
                                  : day.isInRange
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "text-gray-400 dark:text-gray-500",
                                !isTouchDevice && isSpecial ? "cursor-target" : "",
                                isSpecial ? `${getEventStyle(day.event?.type)} hover:scale-[1.02]` : "hover:bg-gray-100/60 dark:hover:bg-gray-700/30",
                                isActive ? "ring-2 ring-offset-1 ring-[#56CFE1]/60 dark:ring-[#56CFE1]/70" : "",
                              ].join(" ")}
                              aria-label={isSpecial ? `${day.iso} ${day.event?.title}` : day.iso}
                              data-cursor-magnetic={!isTouchDevice && isSpecial ? "true" : undefined}
                            >
                              {day.day}
                            </button>

                            {isSpecial && isActive && (
                              <div
                                className={[
                                  "absolute z-30 w-44 sm:w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 p-2.5 text-left shadow-xl backdrop-blur",
                                  panelVerticalClass,
                                  horizontalClass,
                                ].join(" ")}
                              >
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{day.event?.title}</p>
                                <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">{day.event?.description ?? day.iso}</p>
                                <div
                                  className={[
                                    "absolute h-2 w-2 rotate-45 border-gray-200/80 bg-white dark:border-gray-700/80 dark:bg-gray-900",
                                    arrowHorizontalClass,
                                    arrowVerticalClass,
                                  ].join(" ")}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
