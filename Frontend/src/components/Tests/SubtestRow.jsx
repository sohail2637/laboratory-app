import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

export default function SubtestRow({ units, onChange, onRemove }) {
  const [data, setData] = useState({
    test_name: '',
    min_value: '',
    max_value: '',
    unit: '',
    price: '',
  });

  const update = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onChange(updated);
  };

  return (
    <div className="relative grid items-end grid-cols-12 gap-2">
      
      {/* ❌ Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute p-1 text-gray-400 bg-white border rounded-full -top-2 -right-2 hover:text-red-500 hover:border-red-500"
        title="Remove subtest"
      >
        <RxCross2 size={14} />
      </button>

      {/* Name */}
      <div className="col-span-4">
        <input
          type="text"
          placeholder="Subtest name"
          value={data.test_name}
          onChange={e => update('test_name', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>

      {/* Min */}
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Min"
          value={data.min_value}
          onChange={e => update('min_value', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>

      {/* Max */}
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Max"
          value={data.max_value}
          onChange={e => update('max_value', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>

      {/* Unit */}
      <div className="col-span-2">
        <select
          value={data.unit}
          onChange={e => update('unit', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        >
          <option value="">Unit</option>
          {units.map(u => (
            <option key={u._id} value={u._id}>
              {u.unit_name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Price"
          value={data.price}
          onChange={e => update('price', e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>
    </div>
  );
}
