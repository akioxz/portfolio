"use client";

import { useState, useMemo, useEffect } from "react";
import Eyebrow from "./Eyebrow";
import SplitText from "./react-bits/SplitText";
import { getContributionsForYear, ContributionYearData } from "@/data/contributions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GithubActivity() {
  const years = [2026, 2025, 2024];
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [liveData, setLiveData] = useState<ContributionYearData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // True only once a live-fetch attempt has actually failed — distinct from
  // "still loading," so we don't flash the disclosure before we know we need it.
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "akioxz";

  // Fetch live data from server API, fall back to a seeded local generator on
  // failure/missing tokens. The fallback is disclosed in the UI (see
  // `fetchFailed` below) — it should never be presented as real activity.
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setFetchFailed(false);

    fetch(`/api/github?username=${githubUsername}&year=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fallback to local generator");
        return res.json();
      })
      .then((resData) => {
        if (active && resData.days) {
          setLiveData(resData);
        }
      })
      .catch(() => {
        if (active) {
          setLiveData(null); // Triggers fallback to local mock generator
          setFetchFailed(true);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedYear, githubUsername]);

  // Determine active dataset
  const data = useMemo<ContributionYearData>(() => {
    if (liveData) return liveData;
    return getContributionsForYear(selectedYear);
  }, [selectedYear, liveData]);

  // Chunk days into columns of 7 days (weeks)
  const weeks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < data.days.length; i += 7) {
      chunks.push(data.days.slice(i, i + 7));
    }
    return chunks;
  }, [data.days]);

  // Determine month label alignment
  const monthLabels = useMemo(() => {
    let lastMonth = -1;
    return weeks.map((week) => {
      const firstDay = new Date(week[0].date);
      const currentMonth = firstDay.getMonth();
      if (currentMonth !== lastMonth) {
        lastMonth = currentMonth;
        return MONTHS[currentMonth];
      }
      return "";
    });
  }, [weeks]);

  return (
    <section id="github" className="mb-20">
      <Eyebrow>GitHub Activity</Eyebrow>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SplitText
            text="GitHub Activity"
            tag="h2"
            className="text-xl font-mono text-cream font-medium"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-slate">
              {data.total.toLocaleString()} contributions
            </span>
            {isLoading && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-ping" />
            )}
            {!isLoading && fetchFailed && (
              <span
                className="font-mono text-[10px] uppercase tracking-wide text-amber/80 border border-amber/30 rounded px-1.5 py-0.5"
                title="Live GitHub data couldn't be loaded — showing an estimated pattern instead of real activity."
              >
                estimated
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto font-mono text-xs select-none">
          <div className="flex border border-slate/15 bg-surface/30 rounded-md p-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded transition-all duration-150 ${
                  selectedYear === year
                    ? "bg-surface text-teal font-medium"
                    : "text-slate hover:text-cream"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="p-5 rounded-lg border border-slate/15 bg-surface/35 overflow-hidden">
        <div className="flex items-start">
          {/* Weekday indicators */}
          <div className="flex flex-col gap-[3px] pr-2 font-mono text-[8px] text-slate select-none pt-4 text-right w-6">
            <span className="h-[9px] leading-none flex items-center justify-end">Sun</span>
            <span className="h-[9px]" />
            <span className="h-[9px] leading-none flex items-center justify-end">Tue</span>
            <span className="h-[9px]" />
            <span className="h-[9px] leading-none flex items-center justify-end">Thu</span>
            <span className="h-[9px]" />
            <span className="h-[9px] leading-none flex items-center justify-end">Sat</span>
          </div>

          {/* Map Grid */}
          <div className="flex-1 overflow-x-auto pb-2 scrollbar-thin select-none">
            {/* Months Header row */}
            <div className="flex gap-[3px] font-mono text-[8px] text-slate/75 mb-1 h-3">
              {monthLabels.map((label, index) => (
                <div key={index} className="w-[9px] shrink-0 text-left overflow-visible whitespace-nowrap">
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks columns grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    let colorClass = "bg-slate/10 dark:bg-slate/5";
                    if (day.count > 0 && day.count <= 2) colorClass = "bg-teal/20";
                    else if (day.count > 2 && day.count <= 5) colorClass = "bg-teal/45";
                    else if (day.count > 5 && day.count <= 8) colorClass = "bg-teal/70";
                    else if (day.count > 8) colorClass = "bg-teal";

                    const isCurrentYear = new Date(day.date).getFullYear() === selectedYear;

                    return (
                      <div
                        key={day.date}
                        className={`w-[9px] h-[9px] rounded-[1px] transition-all duration-200 ${
                          isCurrentYear ? colorClass : "opacity-0 pointer-events-none"
                        }`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] text-slate mt-4 pr-1">
          <span>Less</span>
          <div className="w-[9px] h-[9px] rounded-[1px] bg-slate/10 dark:bg-slate/5" />
          <div className="w-[9px] h-[9px] rounded-[1px] bg-teal/20" />
          <div className="w-[9px] h-[9px] rounded-[1px] bg-teal/45" />
          <div className="w-[9px] h-[9px] rounded-[1px] bg-teal/70" />
          <div className="w-[9px] h-[9px] rounded-[1px] bg-teal" />
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
