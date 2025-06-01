"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface TreeGraphProps {
  data: any
}

interface TreeNode {
  name: string
  children?: TreeNode[]
  value?: any
}

export function TreeGraph({ data }: TreeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    // Convert JSON data to hierarchical structure
    const hierarchicalData = convertToHierarchy(data)

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create root hierarchy
    const root = d3.hierarchy(hierarchicalData)

    // Count max depth and number of leaf nodes to determine spacing
    const maxDepth = d3.max(root.descendants(), (d) => d.depth) || 0
    const leafCount = root.leaves().length

    // Calculate dynamic spacing based on tree size
    const horizontalSpacing = Math.max(width / (maxDepth + 2), 180)
    const verticalSpacing = Math.max(height / (leafCount + 1), 40)

    // Create tree layout with much more spacing
    const treeLayout = d3
      .tree()
      .size([height - 100, width - 200])
      .nodeSize([verticalSpacing, horizontalSpacing])
      .separation((a, b) => (a.parent === b.parent ? 2 : 3))

    // Apply layout to hierarchy
    const treeData = treeLayout(root)

    // Create SVG group element with initial transform
    const svg = d3.select(svgRef.current)
    const g = svg.append("g").attr("transform", "translate(100, 20)")

    // Add links between nodes with curved paths
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x),
      )
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7)
      .attr("stroke-dasharray", (d: any) => (d.target.data.children ? "none" : "5,5"))

    // Create node groups
    const node = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)

    // Helper function to estimate text width
    function getTextWidth(d: any) {
      const name = d.data.name
      const value = d.data.value

      let text = name
      if (value !== undefined && typeof value !== "object") {
        text = `${name}: ${String(value).substring(0, 20)}`
        if (String(value).length > 20) text += "..."
      }

      // Adjust width based on text length and font size
      return text.length * 7.5
    }

    // Add background rectangles for node labels
    node
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", (d: any) => (d.children ? -12 - getTextWidth(d) : 12))
      .attr("y", -16)
      .attr("width", (d: any) => getTextWidth(d) + 24)
      .attr("height", 32)
      .attr("fill", (d: any) => {
        // Different colors based on node type
        if (!d.children && !d.data.children) {
          return "#f3f4f6" // Leaf nodes (values)
        } else if (d.depth === 0) {
          return "#e0f2fe" // Root node
        } else if (Array.isArray(d.data.value)) {
          return "#f5f3ff" // Array nodes
        } else {
          return "#ecfdf5" // Object nodes
        }
      })
      .attr("stroke", (d: any) => {
        if (d.depth === 0) return "#7dd3fc"
        if (Array.isArray(d.data.value)) return "#c4b5fd"
        if (!d.children && !d.data.children) return "#cbd5e1"
        return "#6ee7b7"
      })
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.9)
      .attr("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))")

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", (d: any) => (d.depth === 0 ? 8 : 6))
      .attr("fill", (d: any) => {
        if (d.depth === 0) return "#0ea5e9" // Root
        if (!d.children && !d.data.children) return "#94a3b8" // Leaf
        if (Array.isArray(d.data.value)) return "#8b5cf6" // Array
        return "#10b981" // Object
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // Add labels for nodes
    node
      .append("text")
      .attr("dy", ".31em")
      .attr("x", (d: any) => (d.children ? -16 : 16))
      .attr("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => {
        const name = d.data.name
        const value = d.data.value

        if (value !== undefined && typeof value !== "object") {
          const valueStr = String(value)
          // Truncate long values
          const displayValue = valueStr.length > 20 ? valueStr.substring(0, 20) + "..." : valueStr
          return `${name}: ${displayValue}`
        }
        return name
      })
      .attr("font-size", "13px")
      .attr("font-family", "system-ui, sans-serif")
      .attr("fill", "#1e293b")
      .attr("font-weight", (d: any) => (d.depth === 0 ? "bold" : "normal"))

    // Add tooltips for nodes with full value
    node.append("title").text((d: any) => {
      const name = d.data.name
      const value = d.data.value

      if (value !== undefined && typeof value !== "object") {
        return `${name}: ${value}`
      } else if (Array.isArray(value)) {
        return `${name} (Array with ${value.length} items)`
      } else if (value !== null && typeof value === "object") {
        return `${name} (Object with ${Object.keys(value).length} properties)`
      }
      return name
    })

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom as any)

    // Calculate bounds of the tree
    let minX = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    treeData.descendants().forEach((d: any) => {
      minX = Math.min(minX, d.y)
      maxX = Math.max(maxX, d.y)
      minY = Math.min(minY, d.x)
      maxY = Math.max(maxY, d.x)
    })

    // Add padding around the tree
    const padding = 80
    const treeWidth = maxX - minX + 2 * padding

    const treeHeight = maxY - minY + 2 * padding

    // Calculate the center of the tree
    const treeCenterX = (minX + maxX) / 2
    const treeCenterY = (minY + maxY) / 2

    // Calculate the center of the viewport
    const viewportCenterX = width / 2
    const viewportCenterY = height / 2

    // Set initial scale to 120% (1.2)
    const initialScale = 1.2

    // Calculate translation to center the tree at 120% zoom
    const translateX = viewportCenterX - treeCenterX * initialScale
    const translateY = viewportCenterY - treeCenterY * initialScale

    // Apply initial transform to center the tree at 120% zoom
    svg.call((zoom as any).transform, d3.zoomIdentity.translate(translateX, translateY).scale(initialScale))
  }, [data])

  // Convert JSON data to hierarchical structure for D3
  const convertToHierarchy = (data: any, key = "root"): TreeNode => {
    if (data === null) {
      return { name: key, value: "null" }
    }

    if (typeof data !== "object") {
      return { name: key, value: data }
    }

    if (Array.isArray(data)) {
      return {
        name: key,
        value: data,
        children: data.map((item, index) => convertToHierarchy(item, `[${index}]`)),
      }
    }

    return {
      name: key,
      value: data,
      children: Object.entries(data).map(([k, v]) => convertToHierarchy(v, k)),
    }
  }

  return <svg ref={svgRef} width="100%" height="100%" className="bg-white dark:bg-slate-900" />
}
