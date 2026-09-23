import { ALL_PERMISSIONS } from '../../constants/permissions';

export default function PermissionSelector({ selectedPermissions, onChange, disabled = false }) {
  
  const handleToggle = (permissionId) => {
    if (disabled) return;
    
    if (selectedPermissions.includes(permissionId)) {
      onChange(selectedPermissions.filter(p => p !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ALL_PERMISSIONS.map(perm => {
        const isSelected = selectedPermissions.includes(perm.id);
        return (
          <div 
            key={perm.id}
            onClick={() => handleToggle(perm.id)}
            className={`
              relative flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-colors
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-50'}
              ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white'}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center
                ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'}
              `}>
                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`font-semibold text-sm ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                {perm.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 ml-6">
              {perm.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
