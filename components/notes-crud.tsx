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
  FiCalendar,
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <FiFileText className="text-xl text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Notas</h1>
        </div>
        <p className="text-gray-600 ml-12">
          Organiza y administra tus notas de manera eficiente
        </p>
      </header>

      {/* Add Note Form */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPlus className="text-emerald-600" />
          Agregar Nueva Nota
        </h2>
        <form onSubmit={handleSubmitNote}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              name="title"
              placeholder="Escribe el título de tu nota..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isAddingNote}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isAddingNote || !title.trim()}
              className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isAddingNote ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Añadir
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      {/* Notes List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Mis Notas ({notes.length})
          </h2>
          {notes.length > 0 && (
            <div className="text-sm text-gray-500">
              {notes.length} nota{notes.length !== 1 ? "s" : ""} total
              {notes.length !== 1 ? "es" : ""}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <FiLoader className="animate-spin text-3xl mb-4 text-emerald-500" />
            <p className="text-lg">Cargando notas...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <FiFileText className="mx-auto h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No hay notas aún
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza creando tu primera nota usando el formulario de arriba
            </p>
            <div className="w-full max-w-md mx-auto h-px bg-gray-200"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <article
                key={note.id}
                className={`
                  border rounded-xl p-6 transition-all duration-200
                  ${
                    editingNoteId === note.id
                      ? "bg-emerald-50 border-emerald-200 shadow-md"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }
                  ${deletingNoteId === note.id ? "opacity-50" : ""}
                `}
              >
                {editingNoteId === note.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Editando nota
                      </label>
                      <Input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full h-12 text-base"
                        autoFocus
                        placeholder="Título de la nota"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-emerald-200">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiUser className="text-xs" />
                          Usuario: {note.user_id}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEditNote}
                          className="flex items-center gap-2 px-4"
                        >
                          <FiX className="text-sm" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEditNote(note.id)}
                          disabled={!editTitle.trim()}
                          className="flex items-center gap-2 px-4 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <FiSave className="text-sm" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 break-words leading-tight">
                          {note.title}
                        </h3>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEditNote(note)}
                          disabled={
                            editingNoteId !== null || deletingNoteId !== null
                          }
                          className="flex items-center gap-2 px-3 h-9"
                        >
                          <FiEdit className="text-sm" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={
                            editingNoteId !== null || deletingNoteId !== null
                          }
                          className="flex items-center gap-2 px-3 h-9"
                        >
                          {deletingNoteId === note.id ? (
                            <>
                              <FiLoader className="animate-spin text-sm" />
                              <span className="hidden sm:inline">
                                Eliminando...
                              </span>
                            </>
                          ) : (
                            <>
                              <FiTrash2 className="text-sm" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <FiUser className="text-xs" />
                        Usuario: {note.user_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-xs" />
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* Preview while adding */}
            {isAddingNote && (
              <article className="border rounded-xl p-6 bg-emerald-50 border-emerald-200 transition-all duration-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-700">
                      {title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <FiLoader className="animate-spin" />
                    Añadiendo...
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-emerald-200">
                  <span className="flex items-center gap-1">
                    <FiUser className="text-xs" />
                    Usuario: {Math.floor(Math.random() * 1000) + 1}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-xs" />
                    Nueva nota
                  </span>
                </div>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
