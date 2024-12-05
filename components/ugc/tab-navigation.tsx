interface TabNavigationProps {
  activeTab: 'realistic' | 'styled' | 'custom';
  onTabChange: (tab: 'realistic' | 'styled' | 'custom') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 border-b border-slate-800">
      <button
        onClick={() => onTabChange('realistic')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'realistic' 
            ? 'text-white border-b-2 border-indigo-500' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Realistic Avatar
      </button>
      <button
        onClick={() => onTabChange('styled')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'styled' 
            ? 'text-white border-b-2 border-indigo-500' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Styled Avatar
      </button>
      <button
        onClick={() => onTabChange('custom')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'custom' 
            ? 'text-white border-b-2 border-indigo-500' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Custom Avatar
      </button>
    </div>
  );
} 