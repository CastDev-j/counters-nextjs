"use client";

import { addNote, deleteNote, getNotes, updateNote } from "@/app/actions/notes";
import { Note } from "@/lib/interfaces";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const NotesCrud = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const notes = await getNotes();
        setNotes(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleSubmitNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const note: Partial<Note> = {
      id: Date.now(),
      title,
    };

    setIsAddingNote(true);
    try {
      const newNote = await addNote(note);
      setNotes((prev) => [...prev, newNote]);
      setTitle("");
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    setDeletingNoteId(id);
    try {
      const deletedNote = await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== deletedNote.id));
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleStartEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setEditTitle("");
  };

  const handleSaveEditNote = async (id: number) => {
    try {
      const updatedNote = await updateNote(id, { title: editTitle });
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      setEditingNoteId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <form onSubmit={handleSubmitNote}>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            name="title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isAddingNote}
          />
          <Button type="submit" disabled={isAddingNote}>
            {isAddingNote ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="mt-4 text-center text-gray-500">Cargando notas...</div>
      ) : (
        <ul className="mt-4 space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`flex items-center gap-2 p-2 rounded-md ${
                editingNoteId === note.id
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-white border"
              } ${
                deletingNoteId === note.id ? "opacity-50 bg-gray-100" : ""
              } transition-all duration-300`}
            >
              {editingNoteId === note.id ? (
                <>
                  <Input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSaveEditNote(note.id)}
                    disabled={!editTitle.trim()}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEditNote}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{note.title}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEditNote(note)}
                    disabled={editingNoteId !== null || deletingNoteId !== null}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={editingNoteId !== null || deletingNoteId !== null}
                  >
                    {deletingNoteId === note.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </>
              )}
            </li>
          ))}

          {isAddingNote && (
            <li className="flex items-center gap-2 p-2 rounded-md bg-blue-50 border border-blue-200 transition-all duration-300">
              <span className="flex-1 text-gray-500">{title}</span>
              <div className="text-sm text-blue-500">Añadiendo...</div>
            </li>
          )}
        </ul>
      )}

      {notes.length === 0 && !isLoading && (
        <div className="mt-4 text-center text-gray-500">
          No hay notas aún. ¡Agrega una!
        </div>
      )}
    </div>
  );
};
