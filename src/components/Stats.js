export default function Stats({ groups, items, onClearAll, sortBy, setSortBy }) {
  const allItems = [...items, ...groups.flatMap((g) => g.items)];

  if (!allItems.length) {
    return (
      <footer className="stats">
        <em>Start adding items or groups 🚀</em>
      </footer>
    );
  }

  const numItems = allItems.length;
  const numPacked = allItems.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "🎉 You got everything!"
          : `🧳 You have ${numItems} items total. Packed ${numPacked} (${percentage}%).`}
      </em>
      <div className="actions">
        <button onClick={onClearAll}>🗑️ Clear All</button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input Order</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by Packed Status</option>
        </select>
      </div>
    </footer>
  );
}