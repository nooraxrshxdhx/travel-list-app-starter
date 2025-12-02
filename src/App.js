import { useState } from "react";
import Logo from "./components/Logo";
import ItemForm from "./components/ItemForm";
import GroupForm from "./components/GroupForm";
import Item from "./components/Item";
import Group from "./components/Group";
import Stats from "./components/Stats";

function App() {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sortBy, setSortBy] = useState("input"); // "input", "description", "packed"

  // --- Item handlers ---
  function handleAddItem(item) {
    setItems((prev) => [...prev, item]);
  }
  function handleDeleteItem(itemId) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }
  function handleToggleItem(itemId) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, packed: !i.packed } : i))
    );
  }

  // --- Group handlers ---
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

  // --- Enhancements ---
  function handleClearAll() {
    setItems([]);
    setGroups([]);
  }

  function sortItems(list) {
    if (sortBy === "description") {
      return [...list].sort((a, b) => a.description.localeCompare(b.description));
    }
    if (sortBy === "packed") {
      return [...list].sort((a, b) => Number(a.packed) - Number(b.packed));
    }
    return list; // input order
  }

  function sortGroups(list) {
    if (sortBy === "description") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list; // input order
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
            {sortItems(items).map((item) => (
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
          {sortGroups(groups).map((group) => (
            <Group
              key={group.id}
              group={group}
              onAddItem={handleAddItemToGroup}
              onDeleteGroup={handleDeleteGroup}
              onDeleteItem={handleDeleteItemFromGroup}
              onToggleItem={handleToggleItemInGroup}
              sortBy={sortBy}
            />
          ))}
        </div>
      </div>

      <Stats
        groups={groups}
        items={items}
        onClearAll={handleClearAll}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  );
}

export default App;