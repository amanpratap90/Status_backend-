
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Habit } from '../types';

interface DailyProgressHistogramProps {
  habits: Habit[];
}

const DailyProgressHistogram: React.FC<DailyProgressHistogramProps> = ({ habits }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => {
      const count = habits.filter(h => h.completedDays.includes(date)).length;
      return { date, count };
    });
  }, [habits]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 800 200`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.date))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.count) || 0, 5)])
      .range([height, 0]);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.05)
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => "")
      );

    // Bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("rx", 4)
      .attr("fill", "#22c55e")
      .attr("opacity", 0.8)
      .transition()
      .duration(800)
      .attr("y", d => y(d.count))
      .attr("height", d => height - y(d.count));

    // X Axis (simplified)
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues([data[0].date, data[14].date, data[29].date]))
      .attr("color", "#444")
      .selectAll("text")
      .style("font-size", "10px")
      .attr("dy", "1em");

    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#444")
      .style("font-size", "10px");

  }, [data]);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 shadow-sm hover:border-purple-500/20 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.1)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">Daily Performance Histogram</h3>
          <p className="text-xs text-gray-500">Completions over the last 30 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Completed</span>
          </div>
        </div>
      </div>
      <div className="w-full h-[200px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default DailyProgressHistogram;
