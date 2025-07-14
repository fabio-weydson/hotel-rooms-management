import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from './button';
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { ptBR } from "date-fns/locale";
import { formatWeekdayName } from "react-day-picker";

function DatePicker({selected, onChange}) {
  const [date, setDate] = useState(selected || null);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    onChange(selectedDate);
  };

  if (selected && date !== new Date(selected).toDateString()) {
    setDate(new Date(selected).toDateString());
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-3" />
          {selected ? format(date, "PPP", {
            locale: ptBR
          }) : <span>Escolha uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-50">
        <Calendar mode="single" selected={date} 
        formatters={{
            formatDay: (date) => date.toLocaleString("pt-BR", { day: "2-digit" }),
            formatMonth: (date) => date.toLocaleString("pt-BR", { month: "long" }),
            formatYear: (date) => date.toLocaleString("pt-BR", { year: "numeric" }),
            formatWeekdayName: (date) => formatWeekdayName(date, { locale: ptBR }),
        }}
        onSelect={(e)=>{
          handleDateChange(new Date(e).toDateString())
        }} />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }