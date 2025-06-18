export default function PharmacyFilterSidebar({ search, setSearch, setFiltered, data }) {
  const handleSearch = e => {
    setSearch(e.target.value);
    setFiltered(data.filter(item =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sticky top-20">
      <h2 className="font-bold text-lg mb-4">Filter</h2>
      <input
        type="text"
        placeholder="Search medicines..."
        value={search}
        onChange={handleSearch}
        className="w-full p-2 border rounded mb-4"
      />
      {/* You can add more filters here */}
    </div>
  );
}
