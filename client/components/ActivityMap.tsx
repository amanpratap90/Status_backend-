
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Habit } from '../types';

interface ActivityMapProps {
  habits: Habit[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ habits }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const cellSize = 12;
    const gap = 3;
    const weeks = 53;
    const width = weeks * (cellSize + gap) + margin.left + margin.right;
    const height = 7 * (cellSize + gap) + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data
    const now = new Date();
    const startDate = d3.timeYear.floor(now);
    const dateRange = d3.timeDays(startDate, d3.timeYear.offset(startDate, 1));

    // Aggregate data from habits
    const dateCounts: Record<string, number> = {};
    habits.forEach(h => {
      h.completedDays.forEach(d => {
        dateCounts[d] = (dateCounts[d] || 0) + 1;
      });
    });

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

  }, [habits]);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-8 hover:border-emerald-500/20 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.1)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Activity Map</h3>
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

export default ActivityMap;
