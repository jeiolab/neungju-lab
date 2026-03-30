import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Database, FileArchive, FileCode } from 'lucide-react';

const ArchivesTab: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Simple Huffman Tree Data for Visualization
  const treeData = {
    name: "ROOT",
    children: [
      {
        name: "0 (빈도 높음)",
        children: [
            { name: "A (00)", value: 45 },
            { name: "B (01)", value: 30 }
        ]
      },
      {
        name: "1 (빈도 낮음)",
        children: [
            { name: "C (10)", value: 20 },
            { name: "D (11)", value: 5 }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 300;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(20, 20)");

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<any>().size([height - 40, width - 100]);
    treeLayout(root);

    // Links
    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2);

    // Nodes
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    nodes.append('circle')
      .attr('r', 6)
      .attr('fill', (d) => d.children ? '#3b82f6' : '#22c55e');

    nodes.append('text')
      .attr('dy', (d) => d.children ? -10 : 3)
      .attr('dx', (d) => d.children ? 0 : 10)
      .style('text-anchor', (d) => d.children ? 'middle' : 'start')
      .text((d: any) => d.data.name)
      .attr('fill', '#475569')
      .style('font-size', '12px')
      .style('font-family', 'monospace');

  }, []);

  return (
    <div className="space-y-6">
       <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-sm flex items-center gap-3">
          <Database className="text-purple-600" />
          <h2 className="text-xl font-bold text-slate-800">동아리 자료실</h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <FileArchive size={20} className="text-yellow-600"/>
                    무손실 vs 손실 압축
                  </h3>
                  <ul className="space-y-3 text-slate-600 text-sm">
                      <li className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-green-600 block mb-1">무손실 압축 (Lossless)</strong>
                        원본을 100% 복구할 수 있음. 글자, 비밀 문서, 실행 파일에 사용. (우리가 배우는 RLE, Lempel-Ziv가 여기 해당)
                      </li>
                      <li className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-red-600 block mb-1">손실 압축 (Lossy)</strong>
                        사람이 눈치채지 못할 정도만 남기고 데이터를 버림. 사진(JPEG), 음악(MP3)에 사용. 복구 시 원본과 약간 다름.
                      </li>
                  </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <FileCode size={20} className="text-blue-600"/>
                    허프만 코딩 (Huffman Coding)
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                      자주 나오는 글자에는 '짧은 비트'를, 가끔 나오는 글자에는 '긴 비트'를 부여하는 방식입니다. 우측 트리가 그 예시입니다.
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      "A"는 자주 나와서 "00" (2비트), "D"는 가끔 나와서 "11" (2비트)를 배정받는 구조입니다. 실제로는 빈도수에 따라 트리가 훨씬 복잡해집니다.
                  </p>
              </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-slate-600 text-sm mb-4 self-start">허프만 트리 시각화 (예시)</h3>
              <div className="bg-slate-50 rounded-lg p-4 w-full flex justify-center overflow-hidden border border-slate-200">
                <svg ref={svgRef}></svg>
              </div>
              <p className="mt-4 text-xs text-slate-500 text-center">
                  D3.js로 렌더링된 트리 구조. 루트에서 내려가며 0(왼쪽), 1(오른쪽)을 따라가면 코드가 생성됩니다.
              </p>
          </div>
       </div>
    </div>
  );
};

export default ArchivesTab;