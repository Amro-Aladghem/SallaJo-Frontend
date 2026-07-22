import * as React from "react"
import { cn } from "@/lib/utils"


function Badge({ className, ...props }) {
  return (
    <div className={cn("inline-flex bg-gray-100/80 items-center rounded-full  px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} 
    {...props} />
  )
}

export { Badge }
