import type { Metadata } from "next"
import Image from "next/image"
import JsonTool from "@/components/json-tool"

export const metadata: Metadata = {
  title: "ShamsJSON - Advanced JSON Viewer, Editor & Formatter",
  description: "ShamsJSON is a comprehensive JSON tool that lets you format, validate, search, transform, and visualize JSON data. Features include syntax highlighting, tree visualization, data search, and JSON path queries.",
  keywords: [
    "JSON tool",
    "JSON viewer",
    "JSON editor",
    "JSON formatter",
    "JSON validator",
    "JSON parser",
    "JSON transformer",
    "JSON visualizer",
    "JSON search",
    "JSON path",
    "data visualization",
    "developer tools"
  ],
  openGraph: {
    title: "ShamsJSON - Advanced JSON Viewer, Editor & Formatter",
    description: "ShamsJSON is a comprehensive JSON tool that lets you format, validate, search, transform, and visualize JSON data.",
  },
}

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Image
            src="/android-chrome-192x192.png"
            alt="ShamsJSON Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ShamsJSON
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Advanced JSON Viewer, Editor & Formatter
        </p>
      </div>
      <JsonTool />
    </main>
  )
}
