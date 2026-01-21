import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WordCloudViewProps {
  words: string[];
}

interface Node extends d3.SimulationNodeDatum {
  text: string;
  size: number;
  r: number; // radius for collision
}

export const WordCloudView: React.FC<WordCloudViewProps> = ({ words }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (wrapperRef.current) {
      setDimensions({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight
      });
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;

    // Count word frequency for size
    const frequency: Record<string, number> = {};
    words.forEach(w => {
      frequency[w] = (frequency[w] || 0) + 1;
    });

    const data: Node[] = Object.entries(frequency).map(([text, count]) => {
        const size = 14 + (count * 10);
        return {
            text,
            size,
            r: size, // Approximate radius
            x: width / 2,
            y: height / 2
        };
    });

    const simulation = d3.forceSimulation<Node>(data)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => d.r + 2).iterations(2));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .on("mouseover", function() {
          d3.select(this).select("text").transition().attr("font-size", (d: any) => d.size * 1.2);
      })
      .on("mouseout", function() {
          d3.select(this).select("text").transition().attr("font-size", (d: any) => d.size);
      });

    nodes.append("text")
      .text(d => d.text)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", d => d.size)
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("fill", (_, i) => colorScale(i.toString()));

    simulation.on("tick", () => {
      nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };

  }, [words, dimensions]);

  if (words.length === 0) {
    return (
        <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p>분석된 텍스트가 쌓이면 워드 클라우드가 생성됩니다.</p>
        </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border border-slate-100">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};
