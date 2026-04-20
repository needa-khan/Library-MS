"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Tag, Send, Check } from "lucide-react"

interface BookProps {
  title: string;
  author: string;
  category: string;
  isAvailable: boolean;
}

export default function BookCard({ title, author, category, isAvailable }: BookProps) {
  const [isRequested, setIsRequested] = useState(false)

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-muted-foreground/20 flex flex-col h-full group">
      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
        <BookOpen className="w-12 h-12 text-muted-foreground/40 transition-transform duration-500 group-hover:scale-110" />
        <Badge
          variant={isAvailable ? "default" : "destructive"}
          className="absolute top-3 right-3 shadow-md backdrop-blur-sm"
        >
          {isAvailable ? "Available" : "Out of Stock"}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold truncate leading-tight group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 opacity-60" /> {author}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 opacity-60" /> {category}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => setIsRequested(true)}
          disabled={isRequested}
          variant={isRequested ? "secondary" : "default"}
          className={`w-full transition-all duration-500 relative overflow-hidden ${
            isRequested 
              ? "bg-slate-100 text-slate-500 cursor-default" 
              : "hover:shadow-lg active:scale-95"
          }`}
        >
          {isRequested ? (
            <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
               <Check className="w-4 h-4 text-green-600" /> Requested
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Request Book
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

