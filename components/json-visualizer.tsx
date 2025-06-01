"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NetworkGraph } from "@/components/network-graph"
import { TreeGraph } from "@/components/tree-graph"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface JsonVisualizerProps {
  jsonData: any
}

export default function JsonVisualizer({ jsonData }: JsonVisualizerProps) {
  const [visualizationType, setVisualizationType] = useState("tree")
  const [zoom, setZoom] = useState([120])

  const handleZoomIn = () => {
    setZoom([Math.min(zoom[0] + 10, 200)])
  }

  const handleZoomOut = () => {
    setZoom([Math.max(zoom[0] - 10, 50)])
  }

  const handleResetZoom = () => {
    setZoom([120])
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>JSON Visualization</CardTitle>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="visualization-type" className="mb-2 block">
              Visualization Type
            </Label>
            <Select value={visualizationType} onValueChange={setVisualizationType}>
              <SelectTrigger id="visualization-type">
                <SelectValue placeholder="Select visualization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tree">Tree View</SelectItem>
                <SelectItem value="network">Network Graph</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="zoom">Zoom: {zoom}%</Label>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Slider id="zoom" min={50} max={200} step={5} value={zoom} onValueChange={setZoom} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[700px] w-full border rounded-md overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
          <div
            className="w-full h-full"
            style={{ transform: `scale(${zoom[0] / 100})`, transformOrigin: "center center" }}
          >
            {visualizationType === "tree" ? <TreeGraph data={jsonData} /> : <NetworkGraph data={jsonData} />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
