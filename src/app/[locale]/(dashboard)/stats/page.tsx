"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/stores/useStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format, isWithinInterval } from "date-fns";
import { Article } from "@/types";
import { DateRangePicker } from "./_components/date-range-picker";
import { ArticlesStats } from "./_components/articles-stats";
import { DateRange } from "react-day-picker";
import { useTranslations, useLocale } from "next-intl";

export default function StatsPage() {
  const t = useTranslations("StatusPage");
  const locale = useLocale();
  const { articles } = useStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredArticles = useMemo(() => {
    if (!dateRange?.from) return articles;

    return articles.filter((article: Article) => {
      const date = new Date(
        article.publishDate || article.createdAt || new Date()
      );
      return isWithinInterval(date, {
        start: dateRange.from!,
        end: dateRange.to || new Date(),
      });
    });
  }, [articles, dateRange]);

  const presets = [
    {
      label: t("presets.allTime"),
      onClick: () => setDateRange(undefined),
    },
    {
      label: t("presets.last30Days"),
      onClick: () => {
        const from = new Date();
        from.setDate(from.getDate() - 30);
        setDateRange({ from });
      },
    },
  ];

  const formatDate = (date: Date) => {
    return format(date, "PPP");
  };

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {filteredArticles.length} {t("articlesCount")}
            {dateRange?.from && ` ${t("inRange")}`}
          </p>
        </div>
        <Link href={`/${locale}/articles`} className={buttonVariants()}>
          {t("viewArticles")}
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("filter.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <DateRangePicker
            onDateChange={setDateRange}
            initialRange={dateRange}
          />
          <div className="flex gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                onClick={preset.onClick}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          {dateRange?.from && (
            <p className="text-sm text-muted-foreground">
              {t("showingFrom")} {formatDate(dateRange.from)}{" "}
              {dateRange.to && `${t("to")} ${formatDate(dateRange.to)}`}
            </p>
          )}
        </CardContent>
      </Card>

      <ArticlesStats filteredArticles={filteredArticles} />
    </div>
  );
}
