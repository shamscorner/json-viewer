"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface NetworkGraphProps {
  data: any
}

interface Node {
  id: string
  group: number
  label: string
  value?: any
}

interface Link {
  source: string
  target: string
  value: number
}

export function NetworkGraph({ data }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    // Convert JSON data to network structure
    const { nodes, links } = convertToNetwork(data)

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create SVG
    const svg = d3.select(svgRef.current)

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Create links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Create nodes
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", (d: any) => d3.schemeCategory10[d.group % 10])
      .call(drag(simulation) as any)

    // Add tooltips
    node.append("title").text((d: any) => {
      if (d.value !== undefined && typeof d.value !== "object") {
        return `${d.label}: ${d.value}`
      }
      return d.label
    })

    // Add labels
    const labels = svg
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", "10px")
      .text((d: any) => (d.label.length > 10 ? d.label.substring(0, 10) + "..." : d.label))
      .attr("dy", 15)

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform)
      })

    svg.call(zoom as any)
  }, [data])

  // Drag behavior for nodes
  const drag = (simulation: any) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: any) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  }

  // Convert JSON data to network structure for D3
  const convertToNetwork = (data: any) => {
    const nodes: Node[] = []
    const links: Link[] = []
    let nodeId = 0

    function processObject(obj: any, parentId: string | null = null, key = "root") {
      const currentId = `node${nodeId++}`

      // Add node
      nodes.push({
        id: currentId,
        group: typeof obj === "object" ? 1 : 2,
        label: key,
        value: typeof obj !== "object" ? obj : undefined,
      })

      // Add link to parent
      if (parentId !== null) {
        links.push({
          source: parentId,
          target: currentId,
          value: 1,
        })
      }

      // Process children if object
      if (obj !== null && typeof obj === "object") {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            processObject(item, currentId, `[${index}]`)
          })
        } else {
          Object.entries(obj).forEach(([k, v]) => {
            processObject(v, currentId, k)
          })
        }
      }

      return currentId
    }

    processObject(data)

    return { nodes, links }
  }

  return <svg ref={svgRef} width="100%" height="100%" />
}
