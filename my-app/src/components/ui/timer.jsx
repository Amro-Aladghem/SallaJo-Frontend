import { useEffect, useRef, useState } from "react";
import { Card } from '@/components/ui/card';
import { Timer } from "lucide-react";


export default function ApplicationTimer({ time, handelCallBackm, isStop }) {
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Parse time format: HH:MM:SS.microseconds
    const timeParts = time.split(":");
    const h = parseInt(timeParts[0], 10);
    const m = parseInt(timeParts[1], 10);
    setHours(h);
    setMinutes(m);
  }, [time]);


  useEffect(() => {
    if (isStop) {
      clearInterval(intervalRef.current);
      return;
    }
    
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setMinutes((prevMinutes) => {
        if (prevMinutes === 0) {
          setHours((prevHours) => {
            if (prevHours > 0) {
              setMinutes(59);
              return prevHours - 1;
            } else {
              clearInterval(intervalRef.current);
              handelCallBackm?.();
              return 0;
            }
          });
          return 59; // لما الدقائق توصل 0 والساعات أكتر من 0، نرجع 59
        } else {
          return prevMinutes - 1;
        }
      });
    }, 60000);

    return () => clearInterval(intervalRef.current);
  }, [isStop, handelCallBackm]);

  

  return (
    <Card className="p-4 bg-secondary/30 border-black border-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Timer</h3>
        </div>
        <div className="text-lg font-bold bg-primary/90 rounded-lg px-3 py-1 flex items-center gap-1">
          <span>{String(hours).padStart(2, "0")}</span>
          <span className="text-xs font-normal opacity-70">h</span>
          <span>:</span>
          <span>{String(minutes).padStart(2, "0")}</span>
          <span className="text-xs font-normal opacity-70">m</span>
        </div>
      </div>
    </Card>
  );
}