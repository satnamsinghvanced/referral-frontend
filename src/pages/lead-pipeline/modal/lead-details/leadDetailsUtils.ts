export interface NoteItem {
  id: string | number;
  timestamp: string | null;
  content: string;
}

export const parseNotes = (notes: any): NoteItem[] => {
  if (!notes) return [];
  if (Array.isArray(notes)) {
    return [...notes]
      .map((note, index) => ({
        id: note._id || index,
        timestamp: note.timestamp,
        content: note.content,
      }))
      .reverse();
  }
  const notesStr = String(notes);
  const lines = notesStr.split("\n").filter((line) => line.trim());
  return lines
    .map((line, index) => {
      const match = line.match(/^\[(.*?)\]\s*(.*)$/);
      if (match) {
        return {
          id: index,
          timestamp: match[1],
          content: match[2],
        };
      }
      return {
        id: index,
        timestamp: null,
        content: line,
      };
    })
    .reverse();
};
