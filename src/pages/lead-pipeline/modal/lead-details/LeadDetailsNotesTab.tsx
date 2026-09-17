import { Button, Textarea } from "@heroui/react";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { NoteItem } from "./leadDetailsUtils";

interface LeadDetailsNotesTabProps {
  parsedNotes: NoteItem[];
  newNote: string;
  setNewNote: (val: string) => void;
  addingNote: boolean;
  onAddNote: () => void;
  setNoteIdToDelete: (id: string | number | null) => void;
}

const LeadDetailsNotesTab = ({
  parsedNotes,
  newNote,
  setNewNote,
  addingNote,
  onAddNote,
  setNoteIdToDelete,
}: LeadDetailsNotesTabProps) => {
  return (
    <div className="pt-4 space-y-6">
      <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
        <div className="flex items-center gap-2">
          <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
          <h3 className="font-bold text-sm text-foreground">Lead Notes</h3>
        </div>
        <Textarea
          placeholder="Add a new note..."
          minRows={3}
          variant="flat"
          className="bg-gray-50 dark:bg-white/5 rounded-xl"
          value={newNote}
          onValueChange={setNewNote}
        />
        <Button
          color="primary"
          variant="flat"
          startContent={<HiOutlinePlus className="size-4" />}
          className="font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400"
          onPress={onAddNote}
          isLoading={addingNote}
          isDisabled={!newNote.trim()}
        >
          Add Note
        </Button>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h4 className="font-bold text-sm text-foreground">Notes History</h4>
            <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium">
              {parsedNotes.length} {parsedNotes.length === 1 ? "note" : "notes"}
            </span>
          </div>
          {parsedNotes.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-foreground/10 rounded-xl bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                No notes available.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {parsedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 border border-foreground/10 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-bold uppercase tracking-wider">
                      Lead Note
                    </span>
                    <div className="flex items-center gap-2">
                      {note.timestamp && (
                        <span className="text-[10px] text-gray-400 dark:text-foreground/45 font-medium">
                          {note.timestamp}
                        </span>
                      )}
                      <button
                        onClick={() => setNoteIdToDelete(note.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-0.5 rounded hover:bg-foreground/5"
                        title="Delete note"
                      >
                        <HiOutlineTrash className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsNotesTab;
