import { useState } from "react";

export default function GroupForm({ onAddGroup }) {
  const [groupName, setGroupName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!groupName) return;
    onAddGroup(groupName);
    setGroupName("");
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder="New group name..."
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button>➕ Add Group</button>
    </form>
  );
}