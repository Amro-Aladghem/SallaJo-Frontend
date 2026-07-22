import { ChevronDown } from "lucide-react";

export const PrimarySelect = ({ 
    value, 
    placeholder, 
    options, 
    isOpen, 
    setIsOpen, 
    onSelect, 
    icon  
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-[#FFFF05] focus:outline-none transition-colors duration-200 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className={(value || value==0) ? 'text-gray-900' : 'text-gray-500'}>
            {(value || value==0)?value : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-black text-left hover:bg-[#FFFF05] hover:bg-opacity-20 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

