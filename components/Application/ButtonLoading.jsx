import React from 'react'
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ButtonLoading = ({type,text,loading,onClick, className, ...props }) => {
  return (
    <div>
       <Button size="sm" type={type} disabled={loading} onClick={onClick}{...props} className={cn("",className)}>
      {loading &&
        <Loader2 className="animate-spin" />}
      {text}
    </Button>
    </div>
  )
}

export default ButtonLoading
