"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface JsonEditorProps {
  jsonData: any
  readOnly: boolean
  onUpdate: (data: any) => void
}

export default function JsonEditor({ jsonData, readOnly, onUpdate }: JsonEditorProps) {
  const [editor, setEditor] = useState<any>(null)
  const [monaco, setMonaco] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Monaco Editor
    import("@monaco-editor/react").then((module) => {
      const { default: Editor } = module
      setEditor(Editor)
    })
  }, [])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setMonaco(monaco)

    // Set up JSON schema validation
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return

    try {
      const parsed = JSON.parse(value)
      onUpdate(parsed)
    } catch (err) {
      // Don't update if JSON is invalid
    }
  }

  if (!editor) {
    return (
      <Card className="p-4 h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading editor...</p>
        </div>
      </Card>
    )
  }

  const Editor = editor

  return (
    <Card className="border overflow-hidden">
      <Editor
        height="500px"
        language="json"
        theme="vs-dark"
        value={JSON.stringify(jsonData, null, 2)}
        options={{
          readOnly,
          minimap: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </Card>
  )
}
