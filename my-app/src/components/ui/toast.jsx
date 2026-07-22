import { X } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { MessageSquareWarningIcon } from "lucide-react";
import {  useEffect } from "react";

const icons = {
  success: <CheckIcon className="h-6 w-6 text-green-500" />,
  error: <X className="h-6 w-6 text-red-500" />,
  warning: <MessageSquareWarningIcon className="h-6 w-6 text-yellow-500" />,
  warnning:<MessageSquareWarningIcon className="h-6 w-6 text-yellow-500" />
};



export default function Toast({open,type,message,handleCloseCallBack}) {
  
  function getborderColor()
  {
    switch(type)
    {
     case "success": return "border-green-500"
     case "error" : return "border-red-500"
     case "warning": return "border-yellow-500" 
     case "warnning":return "border-yellow-500" 
     default: return "border-green-500"
    }
  }

  useEffect(()=>{
    setTimeout(()=>{
      handleCloseCallBack();
    },6500);

  },[open]);

    if(!open)
        return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[9999] w-[calc(100%-2.5rem)] sm:w-full max-w-sm rounded-xl border-l-4 bg-white/80 p-4 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out transform hover:scale-105 ${getborderColor()}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 capitalize">{type}</p>
          <p className="mt-1 text-sm text-gray-700">{message || 'An unexpected error occurred.'}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            onClick={handleCloseCallBack}
            className="inline-flex rounded-md bg-white/0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
