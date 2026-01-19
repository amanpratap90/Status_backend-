
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Habit } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface ActivityMapProps {
  habits: Habit[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ habits }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Debounce habits changes to reduce re-renders
  const debouncedHabits = useDebounce(habits, 150);

  // Memoize date counts computation
  const dateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    debouncedHabits.forEach(h => {
      h.completedDays.forEach(d => {
        counts[d] = (counts[d] || 0) + 1;
      });
    });
    return counts;
  }, [debouncedHabits]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const cellSize = 12;
    const gap = 3;
    // Reduced from 53 weeks (365 days) to ~13 weeks (90 days) for better performance
    const weeks = 13;
    const width = weeks * (cellSize + gap) + margin.left + margin.right;
    const height = 7 * (cellSize + gap) + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data - only last 90 days instead of 365
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 90);
    const dateRange = d3.timeDays(startDate, now);

    const colorScale = d3.scaleThreshold<number, string>()
      .domain([1, 2, 4, 6])
      .range(["#1a1a1a", "#1b4332", "#2d6a4f", "#40916c", "#52b788"]);

    svg.selectAll("rect")
      .data(dateRange)
      .enter()
      .append("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => d3.timeWeek.count(startDate, d) * (cellSize + gap))
      .attr("y", d => d.getDay() * (cellSize + gap))
      .attr("fill", d => {
        const dateStr = d.toISOString().split('T')[0];
        return colorScale(dateCounts[dateStr] || 0);
      })
      .attr("rx", 2)
      .attr("ry", 2)
      .append("title")
      .text(d => {
        const dateStr = d.toISOString().split('T')[0];
        const count = dateCounts[dateStr] || 0;
        return `${count} completions on ${dateStr}`;
      });

  }, [dateCounts]);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-8 hover:border-emerald-500/20 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.1)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">Activity Map</h3>
          <p className="text-xs text-gray-500">Last 90 days</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 3, 5, 7].map(v => (
              <div key={v} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: v === 0 ? '#1a1a1a' : v === 1 ? '#1b4332' : v === 3 ? '#2d6a4f' : v === 5 ? '#40916c' : '#52b788' }}></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </div>
  );
};

export default React.memo(ActivityMap);
