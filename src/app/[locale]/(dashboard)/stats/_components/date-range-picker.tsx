"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations, useLocale } from "next-intl";

interface DateRangePickerProps {
  onDateChange: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
}

export function DateRangePicker({
  onDateChange,
  initialRange,
}: DateRangePickerProps) {
  const t = useTranslations("DateRangePicker");
  const locale = useLocale();
  const [range, setRange] = React.useState<DateRange | undefined>(initialRange);

  React.useEffect(() => {
    onDateChange(range);
  }, [range, onDateChange]);

  const formatDate = (date: Date) => {
    return format(date, "LLL dd, y", {
      locale: locale === "ar" ? undefined : undefined,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !range?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon
            className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")}
          />
          {range?.from ? (
            range.to ? (
              <>
                {formatDate(range.from)} - {formatDate(range.to)}
              </>
            ) : (
              formatDate(range.from)
            )
          ) : (
            <span>{t("placeholder")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <Calendar
          initialFocus
          mode="range"
          selected={range}
          onSelect={(newRange: DateRange | undefined) => setRange(newRange)}
          numberOfMonths={2}
          disabled={(date) =>
            date > new Date() ||
            date <
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        />
      </PopoverContent>
    </Popover>
  );
}
