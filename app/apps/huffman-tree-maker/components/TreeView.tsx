import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HuffmanNode } from '../types';

interface TreeViewProps {
  rootNode: HuffmanNode | null;
}

const TreeView: React.FC<TreeViewProps> = ({ rootNode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootNode || !svgRef.current || !containerRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const marginTop = 40;
    const marginBottom = 40;

    // Create Hierarchy
    const hierarchyData = d3.hierarchy(rootNode, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : null;
    });

    const treeLayout = d3.tree<HuffmanNode>().size([width - 80, height - marginTop - marginBottom]);
    const root = treeLayout(hierarchyData);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const g = svg.append("g")
      .attr("transform", `translate(40,${marginTop})`);

    // Links
    const linkGen = d3.linkVertical<d3.HierarchyPointLink<HuffmanNode>, d3.HierarchyPointNode<HuffmanNode>>()
        .x(d => d.x)
        .y(d => d.y);

    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", linkGen)
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2);

    // Link Labels (0/1)
    g.selectAll(".link-label")
      .data(root.links())
      .join("text")
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2)
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs font-bold fill-indigo-600 bg-white")
      .text(d => {
        if (d.target.data === d.source.data.left) return "0";
        if (d.target.data === d.source.data.right) return "1";
        return "";
      });

    // Nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.data.isLeaf ? "#f0f9ff" : "#f1f5f9")
      .attr("stroke", d => d.data.isLeaf ? "#0ea5e9" : "#64748b")
      .attr("stroke-width", 2);

    // Text: Char
    node.append("text")
      .attr("dy", -2)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-bold pointer-events-none select-none")
      .text(d => d.data.char ? d.data.char : d.data.freq);
    
    // Text: Freq (Subtext for leaves)
    node.append("text")
      .attr("dy", 12)
      .attr("text-anchor", "middle")
      .attr("class", "text-[10px] fill-slate-500 pointer-events-none select-none")
      .text(d => d.data.isLeaf ? `(${d.data.freq})` : "");

  }, [rootNode]);

  return (
    <div ref={containerRef} className="w-full border rounded-lg bg-white overflow-hidden shadow-sm">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TreeView;
