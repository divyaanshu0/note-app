from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import psycopg2
import os

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

class NoteIn(BaseModel):
    title: str
    content: str

class NoteOut(NoteIn):
    id: int

@app.get("/notes", response_model=List[NoteOut])
def read_notes():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, content FROM notes")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [NoteOut(id=row[0], title=row[1], content=row[2]) for row in rows]

@app.post("/notes", response_model=NoteOut)
def create_note(note: NoteIn):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO notes (title, content) VALUES (%s, %s) RETURNING id", (note.title, note.content))
    note_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return NoteOut(id=note_id, **note.dict())
