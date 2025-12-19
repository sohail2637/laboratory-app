export default function TestTypeSelector({ value, onChange }) {
return (
<div className="flex gap-4 my-4">
<button
onClick={() => onChange('simple')}
className={`px-4 py-2 rounded ${value === 'simple' ? 'bg-blue-500 text-white' : 'border'}`}
>
Simple Test
</button>
<button
onClick={() => onChange('group')}
className={`px-4 py-2 rounded ${value === 'group' ? 'bg-blue-500 text-white' : 'border'}`}
>
Group / CBC
</button>
</div>
);
}