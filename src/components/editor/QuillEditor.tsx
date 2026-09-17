import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  enableImage?: boolean;
}

export interface QuillEditorRef {
  insertText: (text: string) => void;
}

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(function QuillEditor({ value, onChange, placeholder = "Start typing...", enableImage = true }, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useImperativeHandle(ref, () => ({
    insertText(text: string) {
      const quill = quillRef.current;
      if (quill) {
        quill.focus();
        const range = quill.getSelection(true);
        if (range) {
          quill.insertText(range.index, text);
          quill.setSelection(range.index + text.length);
          onChange(quill.root.innerHTML || "");
        }
      }
    }
  }));

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const toolbar = [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        enableImage ? ["link", "image"] : ["link"],
        ["clean"],
      ];
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar,
        },
      });
      quillRef.current = quill;
      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const html = quill.root.innerHTML || "";
          onChange(html);
        }
      });
    }
  }, [placeholder, enableImage]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const currentContent = quill.root.innerHTML;
    if (value !== currentContent) {
      if (!value || value === "" || value === "<p><br></p>") {
        if (quill.getText().trim() !== "" || currentContent !== "<p><br></p>") {
          quill.setText("");
        }
      } else {
        const selection = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(value);
        if (selection) {
          quill.setSelection(selection);
        }
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
          border-radius: 8px 8px 0 0;
        }
        .quill-editor-wrapper .ql-container {
          background-color: #ffffff;
          border-color: rgba(0, 0, 0, 0.1);
          color: #111827;
          border-radius: 0 0 8px 8px;
        }
        .quill-editor-wrapper .ql-editor {
          min-height: 180px;
          font-size: 14px;
          line-height: 1.6;
          color: #111827;
        }
        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
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
        .dark .quill-editor-wrapper .ql-toolbar,
        [data-theme="dark"] .quill-editor-wrapper .ql-toolbar {
          background-color: #27272a;
          border-color: rgba(255, 255, 255, 0.12);
        }
        .dark .quill-editor-wrapper .ql-container,
        [data-theme="dark"] .quill-editor-wrapper .ql-container {
          background-color: #18181b;
          border-color: rgba(255, 255, 255, 0.12);
          color: #f4f4f5;
        }
        .dark .quill-editor-wrapper .ql-editor,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor {
          color: #f4f4f5 !important;
        }
        .dark .quill-editor-wrapper .ql-editor p,
        .dark .quill-editor-wrapper .ql-editor span,
        .dark .quill-editor-wrapper .ql-editor li,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor p,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor span,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor li {
          color: #f4f4f5;
        }
        .dark .quill-editor-wrapper .ql-editor.ql-blank::before,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #71717a !important;
          font-style: normal;
        }        
        .dark .quill-editor-wrapper .ql-stroke,
        [data-theme="dark"] .quill-editor-wrapper .ql-stroke {
          stroke: #d4d4d8;
        }
        .dark .quill-editor-wrapper .ql-fill,
        [data-theme="dark"] .quill-editor-wrapper .ql-fill {
          fill: #d4d4d8;
        }
        .dark .quill-editor-wrapper .ql-picker-label,
        [data-theme="dark"] .quill-editor-wrapper .ql-picker-label {
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
        .dark .quill-editor-wrapper .ql-picker-options,
        [data-theme="dark"] .quill-editor-wrapper .ql-picker-options {
          background-color: #27272a;
          border-color: rgba(255, 255, 255, 0.12);
        }
        .dark .quill-editor-wrapper .ql-picker-item:hover,
        [data-theme="dark"] .quill-editor-wrapper .ql-picker-item:hover {
          background-color: #3f3f46;
        }
        .dark .quill-editor-wrapper .ql-editor a,
        [data-theme="dark"] .quill-editor-wrapper .ql-editor a {
          color: #60a5fa;
        }
        .dark .ql-snow .ql-picker-options .ql-picker-item,
        [data-theme="dark"] .ql-snow .ql-picker-options .ql-picker-item {
          color: #f4f4f5;
          background-color: transparent !important;
        }
      `}</style>
      <div ref={editorRef} />
    </div>
  );
});

export default QuillEditor;