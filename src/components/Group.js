import { useState } from "react";
import Item from "./Item";

export default function Group({
  group,
  onAddItem,
  onDeleteGroup,
  onDeleteItem,
  onToggleItem,
  sortBy,
}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    const safeQty = Number(quantity);
    if (!description || !safeQty || safeQty < 1) return;

    onAddItem(group.id, {
      id: Date.now(),
      description,
      quantity: safeQty,
      packed: false,
    });

    setDescription("");
    setQuantity(1);
  }

  function sortItems(list) {
    if (sortBy === "description") {
      return [...list].sort((a, b) => a.description.localeCompare(b.description));
    }
    if (sortBy === "packed") {
      return [...list].sort((a, b) => Number(a.packed) - Number(b.packed));
    }
    return list;
  }

  return (
    <div className="category-group">
      <h2>{group.name}</h2>

      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const num = Number(e.target.value);
            setQuantity(Number.isNaN(num) ? "" : num);
          }}
          placeholder="Quantity"
        />
        <input
          type="text"
          placeholder="Item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>➕ Add Item</button>
      </form>

      <ul>
        {sortItems(group.items).map((item) => (
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