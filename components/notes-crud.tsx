"use client";

import { addNote, deleteNote, getNotes, updateNote } from "@/app/actions/notes";
import { Note } from "@/lib/interfaces";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSave,
  FiX,
  FiUser,
  FiFileText,
  FiLoader,
} from "react-icons/fi";

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
    <div className="">
      <div className="flex items-center gap-2 mb-6 text-blue-600">
        <FiFileText className="text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Notas</h2>
      </div>

      <form onSubmit={handleSubmitNote}>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            name="title"
            placeholder="Título de la nota"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isAddingNote}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isAddingNote}
            className="min-w-[120px] flex items-center gap-2"
          >
            {isAddingNote ? <FiLoader className="animate-spin" /> : <FiPlus />}
            {isAddingNote ? "Añadiendo..." : "Añadir"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="mt-4 text-center text-gray-500 py-8">
          <FiLoader className="inline-block animate-spin text-2xl mb-2 text-blue-500" />
          <p>Cargando notas...</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`flex flex-col p-4 rounded-md border ${
                editingNoteId === note.id
                  ? "bg-blue-50 border-blue-300 shadow-sm"
                  : "bg-white border-gray-200"
              } ${
                deletingNoteId === note.id ? "opacity-60 bg-gray-100" : ""
              } transition-all duration-300`}
            >
              {editingNoteId === note.id ? (
                <>
                  <Input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 mb-2"
                    autoFocus
                  />
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <FiUser className="mr-1" />
                    User ID: {note.user_id}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSaveEditNote(note.id)}
                      disabled={!editTitle.trim()}
                      className="flex items-center gap-1"
                    >
                      <FiSave className="text-sm" />
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEditNote}
                      className="flex items-center gap-1"
                    >
                      <FiX className="text-sm" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <span className="flex-1 text-gray-800 font-medium">
                      {note.title}
                    </span>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEditNote(note)}
                        disabled={
                          editingNoteId !== null || deletingNoteId !== null
                        }
                        className="h-8 px-3 flex items-center gap-1"
                      >
                        <FiEdit className="text-sm" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={
                          editingNoteId !== null || deletingNoteId !== null
                        }
                        className="h-8 px-3 flex items-center gap-1"
                      >
                        {deletingNoteId === note.id ? (
                          <FiLoader className="animate-spin text-sm" />
                        ) : (
                          <FiTrash2 className="text-sm" />
                        )}
                        {deletingNoteId === note.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <FiUser className="mr-1" />
                    User ID: {note.user_id}
                  </div>
                </>
              )}
            </li>
          ))}

          {isAddingNote && (
            <li className="flex flex-col p-4 rounded-md bg-blue-50 border border-blue-200 transition-all duration-300">
              <div className="flex items-start justify-between">
                <span className="flex-1 text-gray-500">{title}</span>
                <div className="flex items-center text-sm text-blue-500 ml-4">
                  <FiLoader className="animate-spin mr-1" />
                  Añadiendo...
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-2">
                <FiUser className="mr-1" />
                User ID: {Math.floor(Math.random() * 1000) + 1}
              </div>
            </li>
          )}
        </ul>
      )}

      {notes.length === 0 && !isLoading && (
        <div className="mt-6 text-center text-gray-500 py-8 border border-dashed rounded-lg">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p>No hay notas aún. ¡Agrega una!</p>
        </div>
      )}
    </div>
  );
};
