import React, { useState } from "react";

function Logo() {
  return <h1>My Travel List</h1>;
}

// Form to add unassigned items
function ItemForm({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false,
    };
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>➕ Add Item</button>
    </form>
  );
}

// Form to create groups
function GroupForm({ onAddGroup }) {
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

// Single item
function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={onToggleItem}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={onDeleteItem}>❌ </button>
    </li>
  );
}

// Group with header + items
function Group({ group, onAddItem, onDeleteGroup, onDeleteItem, onToggleItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false,
    };

    onAddItem(group.id, newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <div className="category-group">
      <h2>{group.name}</h2>

      {/* Item form inside group */}
      <form onSubmit={handleSubmit} className="add-form">
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <input
          type="text"
          placeholder="Item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>➕ Add Item</button>
      </form>

      <ul>
        {group.items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={() => onDeleteItem(group.id, item.id)}
            onToggleItem={() => onToggleItem(group.id, item.id)}
          />
        ))}
      </ul>

      <div className="actions">
        <button onClick={() => onDeleteGroup(group.id, false)}>
          Delete Group + Items
        </button>
        <button onClick={() => onDeleteGroup(group.id, true)}>
          Delete Group Only (Keep Items)
        </button>
      </div>
    </div>
  );
}

// Stats footer
function Stats({ groups, items }) {
  const allItems = [...items, ...groups.flatMap((g) => g.items)];
  if (!allItems.length)
    return (
      <footer className="stats">
        <em>Start adding items or groups 🚀</em>
      </footer>
    );

  const numItems = allItems.length;
  const numPacked = allItems.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        🧳 You have {numItems} items total. Packed {numPacked} ({percentage}%).
      </em>
    </footer>
  );
}

// Main App
function App() {
  const [items, setItems] = useState([]); // unassigned items
  const [groups, setGroups] = useState([]); // groups with items

  function handleAddItem(item) {
    setItems((prev) => [...prev, item]);
  }

  function handleDeleteItem(itemId) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  function handleToggleItem(itemId) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, packed: !i.packed } : i
      )
    );
  }

  function handleAddGroup(name) {
    const newGroup = { id: Date.now(), name, items: [] };
    setGroups((prev) => [...prev, newGroup]);
  }

  function handleDeleteItemFromGroup(groupId, itemId) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((i) => i.id !== itemId) }
          : g
      )
    );
  }

  function handleToggleItemInGroup(groupId, itemId) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: g.items.map((i) =>
                i.id === itemId ? { ...i, packed: !i.packed } : i
              ),
            }
          : g
      )
    );
  }

  function handleDeleteGroup(groupId, keepItems) {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      if (!group) return prev;

      if (keepItems) {
        setItems((items) => [...items, ...group.items]);
      }
      return prev.filter((g) => g.id !== groupId);
    });
  }
  function handleAddItemToGroup(groupId, item) {
  setGroups((prev) =>
    prev.map((g) =>
      g.id === groupId ? { ...g, items: [...g.items, item] } : g
    )
  );
  }
  return (
    <div className="app">
      <Logo />
      <ItemForm onAddItem={handleAddItem} />
      <GroupForm onAddGroup={handleAddGroup} />

      <div className="divider">
        {/* Left column: unassigned items */}
        <div className="single-items">
          <h2>Items</h2>
          <ul>
            {items.map((item) => (
              <Item
                key={item.id}
                item={item}
                onDeleteItem={() => handleDeleteItem(item.id)}
                onToggleItem={() => handleToggleItem(item.id)}
              />
            ))}
          </ul>
        </div>

        {/* Right column: groups */}
        <div className="groups">
          <h2>Groups</h2>
          {groups.map((group) => (
            <Group
              key={group.id}
              group={group}
              onAddItem={handleAddItemToGroup}
              onDeleteGroup={handleDeleteGroup}
              onDeleteItem={handleDeleteItemFromGroup}
              onToggleItem={handleToggleItemInGroup}
            />
          ))}
        </div>
      </div>

      <Stats groups={groups} items={items} />
    </div>
  );
}

export default App;