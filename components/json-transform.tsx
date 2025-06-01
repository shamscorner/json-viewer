"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2 } from "lucide-react"

interface JsonTransformProps {
  jsonData: any
  onTransform: (newData: any) => void
}

export default function JsonTransform({ jsonData, onTransform }: JsonTransformProps) {
  const [transformType, setTransformType] = useState("flatten")
  const [customCode, setCustomCode] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTransform = () => {
    try {
      let transformed

      switch (transformType) {
        case "flatten":
          transformed = flattenJson(jsonData)
          break
        case "minify":
          transformed = JSON.parse(JSON.stringify(jsonData))
          break
        case "sort-keys":
          transformed = sortObjectKeys(jsonData)
          break
        case "custom":
          // Execute custom transformation code
          const transformFn = new Function("data", customCode)
          transformed = transformFn(jsonData)
          break
        default:
          transformed = jsonData
      }

      setResult(transformed)
      setError(null)
      onTransform(transformed)
    } catch (err) {
      setError(`Transformation error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Flatten nested JSON into dot notation
  const flattenJson = (obj: any, prefix = "") => {
    const result: Record<string, any> = {}

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(result, flattenJson(obj[key], newKey))
        } else {
          result[newKey] = obj[key]
        }
      }
    }

    return result
  }

  // Sort object keys alphabetically
  const sortObjectKeys = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    }

    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, any>, key) => {
        result[key] = sortObjectKeys(obj[key])
        return result
      }, {})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transform JSON</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="transform-type">Transformation Type</Label>
            <Select value={transformType} onValueChange={setTransformType}>
              <SelectTrigger id="transform-type">
                <SelectValue placeholder="Select transformation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flatten">Flatten (Dot Notation)</SelectItem>
                <SelectItem value="minify">Minify</SelectItem>
                <SelectItem value="sort-keys">Sort Keys</SelectItem>
                <SelectItem value="custom">Custom Transformation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transformType === "custom" && (
            <div>
              <Label htmlFor="custom-code">Custom Transformation Code</Label>
              <Textarea
                id="custom-code"
                placeholder="// Write JavaScript code to transform the data
// Example: return data.filter(item => item.active);
// The input data is available as 'data'
// Return the transformed result"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="font-mono h-40"
              />
            </div>
          )}

          <Button onClick={handleTransform}>
            <Wand2 className="h-4 w-4 mr-2" />
            Transform
          </Button>

          {error && <div className="text-destructive text-sm">{error}</div>}

          {result && (
            <div>
              <Label>Result</Label>
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-sm font-mono">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
