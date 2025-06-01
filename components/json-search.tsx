"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight } from "lucide-react"

interface JsonSearchProps {
  jsonData: any
}

interface SearchResult {
  path: string
  value: any
  type: string
}

export default function JsonSearch({ jsonData }: JsonSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [jsonPath, setJsonPath] = useState("")

  const searchJson = (obj: any, term: string, path = "", results: SearchResult[] = []) => {
    if (!obj) return results

    // Check if current object/value matches search term
    const objString = typeof obj === "object" ? JSON.stringify(obj) : String(obj)
    if (objString.toLowerCase().includes(term.toLowerCase())) {
      results.push({
        path: path || "/",
        value: obj,
        type: typeof obj,
      })
    }

    // If object is array or object, search its properties
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key
        searchJson(obj[key], term, newPath, results)
      })
    }

    return results
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results = searchJson(jsonData, searchTerm)
    setSearchResults(results)
  }

  const evaluateJsonPath = () => {
    if (!jsonPath.trim()) return

    try {
      // Simple JSON path evaluation (basic dot notation)
      const path = jsonPath.split(".")
      let result = jsonData

      for (const key of path) {
        if (key === "$") continue // Root symbol
        if (result === undefined) break

        // Handle array indices
        if (key.includes("[") && key.includes("]")) {
          const arrayKey = key.substring(0, key.indexOf("["))
          const indexStr = key.substring(key.indexOf("[") + 1, key.indexOf("]"))
          const index = Number.parseInt(indexStr)

          result = result[arrayKey][index]
        } else {
          result = result[key]
        }
      }

      setSearchResults([
        {
          path: jsonPath,
          value: result,
          type: typeof result,
        },
      ])
    } catch (err) {
      setSearchResults([
        {
          path: jsonPath,
          value: "Path not found or invalid",
          type: "error",
        },
      ])
    }
  }

  const getValuePreview = (value: any, type: string) => {
    if (type === "object" && value !== null) {
      return JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? "..." : "")
    }
    return String(value)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="JSONPath (e.g. $.users[0].name)"
              value={jsonPath}
              onChange={(e) => setJsonPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && evaluateJsonPath()}
            />
            <Button onClick={evaluateJsonPath}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Evaluate
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {searchResults.map((result, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                    <div className="flex items-center gap-2 text-left">
                      <span className="font-mono text-sm">{result.path}</span>
                      <Badge variant="outline">{result.type}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="bg-muted p-3 rounded-md overflow-x-auto">
                      <pre className="text-sm font-mono">
                        {typeof result.value === "object" && result.value !== null
                          ? JSON.stringify(result.value, null, 2)
                          : getValuePreview(result.value, result.type)}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
