import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, FriendNode, FriendLink } from '../types';

interface NetworkGraphProps {
  data: GraphData;
  highlightNodes?: Set<string>; // IDs of nodes to highlight (e.g. infected)
  activeNodeId?: string | null;
  onNodeClick?: (node: FriendNode) => void;
  width?: number;
  height?: number;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  data, 
  highlightNodes = new Set(), 
  activeNodeId, 
  onNodeClick,
  width = 600,
  height = 400
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Deep copy data to prevent D3 from mutating original props directly in a way that affects React state
    const nodes = data.nodes.map(d => ({ ...d })) as FriendNode[];
    const links = data.links.map(d => ({ ...d })) as FriendLink[];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, FriendNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node Circles
    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        if (highlightNodes.has(d.id)) return "#ef4444"; // Red for highlighted
        if (activeNodeId === d.id) return "#3b82f6"; // Blue for active selection
        return d.group === 1 ? "#86efac" : d.group === 2 ? "#fca5a5" : "#cbd5e1";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    // Labels
    nodeGroup.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#1e293b")
      .style("pointer-events", "none")
      .style("font-weight", "bold");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as FriendNode).x!)
        .attr("y1", d => (d.source as FriendNode).y!)
        .attr("x2", d => (d.target as FriendNode).x!)
        .attr("y2", d => (d.target as FriendNode).y!);

      nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, highlightNodes, activeNodeId, width, height, onNodeClick]);

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" className="w-full h-full min-h-[400px]" />
    </div>
  );
};

export default NetworkGraph;
