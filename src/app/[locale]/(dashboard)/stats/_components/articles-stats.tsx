"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  isWithinInterval,
} from "date-fns";
import { Article } from "@/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Line, LineChart } from "recharts";
import { Cell, Pie, PieChart, Legend } from "recharts";
import { useTranslations, useLocale } from "next-intl";

interface ArticlesStatsProps {
  filteredArticles: Article[];
}

export function ArticlesStats({ filteredArticles }: ArticlesStatsProps) {
  const t = useTranslations("ArticlesStats");
  const locale = useLocale();

  const chartData = useMemo(() => {
    const now = new Date();

    const earliestTimestamp =
      filteredArticles.length > 0
        ? Math.min(
            ...filteredArticles.map((a) =>
              new Date(a.createdAt || a.publishDate || now).getTime()
            )
          )
        : now.getTime();

    const earliestDate = new Date(earliestTimestamp);

    const months = eachMonthOfInterval({
      start: startOfMonth(earliestDate),
      end: endOfMonth(now),
    });

    const monthlyData = months.map((month) => {
      const count = filteredArticles.filter((a) => {
        const date = new Date(a.publishDate || a.createdAt || now);
        return isWithinInterval(date, {
          start: month,
          end: endOfMonth(month),
        });
      }).length;

      return { month: format(month, "MMM yy"), articles: count };
    });

    const categoriesCount = filteredArticles.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCount = {
      Published: filteredArticles.filter((a) => a.isPublished).length,
      Draft: filteredArticles.filter((a) => !a.isPublished && !a.publishDate)
        .length,
      Scheduled: filteredArticles.filter((a) => !a.isPublished && a.publishDate)
        .length,
    };

    const statusData = [
      {
        name: "Status",
        Published: statusCount.Published,
        Draft: statusCount.Draft,
        Scheduled: statusCount.Scheduled,
      },
    ];

    return { monthlyData, categoriesCount, statusCount, statusData };
  }, [filteredArticles, locale]);

  const PALETTE = [
    "hsl(12, 76%, 61%)",
    "hsl(173, 58%, 39%)",
    "hsl(197, 37%, 24%)",
    "hsl(43, 74%, 66%)",
    "hsl(27, 87%, 67%)",
    "hsl(200, 70%, 50%)",
    "hsl(160, 60%, 45%)",
  ] as const;

  const chartConfig = useMemo(() => {
    const cfg: ChartConfig = {};

    Object.keys(chartData.categoriesCount).forEach((cat, i) => {
      cfg[cat] = {
        label: t(`categories.${cat}`),
        color: PALETTE[i % PALETTE.length],
      };
    });

    cfg["Published"] = { label: t("status.Published"), color: PALETTE[0] };
    cfg["Draft"] = { label: t("status.Draft"), color: PALETTE[1] };
    cfg["Scheduled"] = { label: t("status.Scheduled"), color: PALETTE[2] };

    cfg["articles"] = {
      label: t("lineChart.label"),
      color: "hsl(var(--primary))",
    };

    return cfg;
  }, [chartData.categoriesCount, t]);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("lineChart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={chartData.monthlyData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="articles"
                stroke={chartConfig.articles?.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("pieChart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={Object.entries(chartData.categoriesCount)}
                dataKey="1"
                nameKey="0"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${t(`categories.${name}`)} ${(percent * 100).toFixed(0)}%`
                }
              >
                {Object.entries(chartData.categoriesCount).map(([cat]) => (
                  <Cell
                    key={cat}
                    fill={chartConfig[cat]?.color ?? "hsl(var(--muted))"}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("barChart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData.statusData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Published" fill={chartConfig.Published?.color} />
              <Bar dataKey="Draft" fill={chartConfig.Draft?.color} />
              <Bar dataKey="Scheduled" fill={chartConfig.Scheduled?.color} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
