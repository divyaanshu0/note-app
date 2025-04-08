import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchNotes = async () => {
    const res = await axios.get("http://3.80.118.127:8000/notes");
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post("http://3.80.118.127:8000/notes", form);
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📒 Notes</h1>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <br />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <br />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <b>{note.title}</b>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
