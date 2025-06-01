"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Copy, RefreshCw, FileUp, Trash2, Eye, Code, BarChart2 } from "lucide-react"
import JsonEditor from "@/components/json-editor"
import JsonVisualizer from "@/components/json-visualizer"
import JsonSearch from "@/components/json-search"
import JsonTransform from "@/components/json-transform"

export default function JsonTool() {
  const [jsonData, setJsonData] = useState<any>(null)
  const [jsonString, setJsonString] = useState("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        setJsonData(parsed)
        setJsonString(JSON.stringify(parsed, null, 2))
        setError(null)
      } catch (err) {
        setError("Invalid JSON file. Please check the file and try again.")
      }
    }
    reader.readAsText(file)
  }

  const handlePasteJson = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setJsonString(content)

    try {
      if (content.trim()) {
        const parsed = JSON.parse(content)
        setJsonData(parsed)
        setError(null)
      } else {
        setJsonData(null)
      }
    } catch (err) {
      setError("Invalid JSON. Please check your input and try again.")
    }
  }

  const handleFormatJson = () => {
    try {
      if (jsonString.trim()) {
        const parsed = JSON.parse(jsonString)
        const formatted = JSON.stringify(parsed, null, 2)
        setJsonString(formatted)
        setJsonData(parsed)
        setError(null)
      }
    } catch (err) {
      setError("Invalid JSON. Please check your input and try again.")
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonString)
  }

  const handleClear = () => {
    setJsonData(null)
    setJsonString("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownload = () => {
    if (!jsonData) return

    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const updateJsonData = (newData: any) => {
    setJsonData(newData)
    setJsonString(JSON.stringify(newData, null, 2))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="json-upload" className="block mb-2">
                Upload JSON File
              </Label>
              <div className="flex gap-2">
                <Input
                  id="json-upload"
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleFormatJson} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Format JSON
              </Button>
              <Button onClick={handleCopyToClipboard} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleClear} variant="outline" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button onClick={handleDownload} variant="outline" disabled={!jsonData} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="json-paste" className="block mb-2">
              Paste JSON
            </Label>
            <Textarea
              id="json-paste"
              placeholder="Paste your JSON here..."
              value={jsonString}
              onChange={handlePasteJson}
              className="font-mono h-40"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {jsonData && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="view" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="view">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </TabsTrigger>
                <TabsTrigger value="edit">
                  <Code className="h-4 w-4 mr-2" />
                  Edit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="view" className="mt-4">
                <JsonEditor jsonData={jsonData} readOnly={true} onUpdate={updateJsonData} />
              </TabsContent>

              <TabsContent value="edit" className="mt-4">
                <JsonEditor jsonData={jsonData} readOnly={false} onUpdate={updateJsonData} />
              </TabsContent>
            </Tabs>

            <JsonSearch jsonData={jsonData} />
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="visualize" className="w-full">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="visualize">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Visualize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualize" className="mt-4">
                <JsonVisualizer jsonData={jsonData} />
              </TabsContent>
            </Tabs>

            <JsonTransform jsonData={jsonData} onTransform={updateJsonData} />
          </div>
        </div>
      )}
    </div>
  )
}
