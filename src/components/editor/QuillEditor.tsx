import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  enableImage?: boolean;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  enableImage = true,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Build toolbar configuration
      const toolbar = [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        enableImage ? ["link", "image"] : ["link"],
        ["clean"],
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar,
        },
      });

      // Handle text change
      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";
        onChange(html);
      });
    }
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      if (value !== currentContent) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div className="quill-editor-wrapper">
      <style>{`
        /* Light Mode Styles */
        .quill-editor-wrapper .ql-toolbar {
          background-color: #f9fafb;
          border-color: rgba(0, 0, 0, 0.1);
        }
        
        .quill-editor-wrapper .ql-container {
          background-color: #ffffff;
          border-color: rgba(0, 0, 0, 0.1);
          color: #000000;
        }
        
        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
        
        .quill-editor-wrapper .ql-stroke {
          stroke: #374151;
        }
        
        .quill-editor-wrapper .ql-fill {
          fill: #374151;
        }
        
        .quill-editor-wrapper .ql-picker-label {
          color: #374151;
        }
        
        .quill-editor-wrapper button:hover .ql-stroke,
        .quill-editor-wrapper button:focus .ql-stroke,
        .quill-editor-wrapper button.ql-active .ql-stroke {
          stroke: #2563eb;
        }
        
        .quill-editor-wrapper button:hover .ql-fill,
        .quill-editor-wrapper button:focus .ql-fill,
        .quill-editor-wrapper button.ql-active .ql-fill {
          fill: #2563eb;
        }
        
        .quill-editor-wrapper button:hover,
        .quill-editor-wrapper button:focus,
        .quill-editor-wrapper button.ql-active {
          background-color: #e5e7eb;
        }

        /* Dark Mode Styles */
        .dark .quill-editor-wrapper .ql-toolbar {
          background-color: rgba(39, 39, 42, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .dark .quill-editor-wrapper .ql-container {
          background-color: rgba(24, 24, 27, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        
        .dark .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #71717a;
        }
        
        .dark .quill-editor-wrapper .ql-stroke {
          stroke: #d4d4d8;
        }
        
        .dark .quill-editor-wrapper .ql-fill {
          fill: #d4d4d8;
        }
        
        .dark .quill-editor-wrapper .ql-picker-label {
          color: #d4d4d8;
        }
        
        .dark .quill-editor-wrapper button:hover .ql-stroke,
        .dark .quill-editor-wrapper button:focus .ql-stroke,
        .dark .quill-editor-wrapper button.ql-active .ql-stroke {
          stroke: #60a5fa;
        }
        
        .dark .quill-editor-wrapper button:hover .ql-fill,
        .dark .quill-editor-wrapper button:focus .ql-fill,
        .dark .quill-editor-wrapper button.ql-active .ql-fill {
          fill: #60a5fa;
        }
        
        .dark .quill-editor-wrapper button:hover,
        .dark .quill-editor-wrapper button:focus,
        .dark .quill-editor-wrapper button.ql-active {
          background-color: rgba(63, 63, 70, 0.8);
        }
        
        .dark .quill-editor-wrapper .ql-picker-options {
          background-color: #27272a;
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .dark .quill-editor-wrapper .ql-picker-item:hover {
          background-color: #3f3f46;
        }
        
        .dark .quill-editor-wrapper .ql-editor a {
          color: #60a5fa;
        }

        .dark .ql-snow .ql-picker-options .ql-picker-item {
          color: #fff;
          background-color: transparent !important;
        }
        
        /* Common Styles */
        .quill-editor-wrapper .ql-editor {
          min-height: 300px;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .quill-editor-wrapper .ql-toolbar {
          border-radius: 6px 6px 0 0;
        }
        
        .quill-editor-wrapper .ql-container {
          border-radius: 0 0 6px 6px;
        }
      `}</style>
      <div ref={editorRef} />
    </div>
  );
}
