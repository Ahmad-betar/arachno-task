"use client";

import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Edit, Download } from "lucide-react";
import { useState } from "react";
import { Article } from "@/types";
import { ArticleDialog } from "./articles-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as XLSX from "xlsx";
import { useTranslations, useLocale } from "next-intl";

export function ArticleList() {
  const t = useTranslations("ArticleList");
  const locale = useLocale();

  const { articles, deleteArticle, reorderArticles } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingArticle(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = articles.findIndex((a) => a.id === active.id);
    const newIdx = articles.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(articles, oldIdx, newIdx);
    reorderArticles(reordered);
  };

  const exportToExcel = () => {
    if (!articles.length) return;

    const data = articles.map((a) => ({
      [t("export.id")]: a.id,
      [t("export.title")]: a.title,
      [t("export.category")]: a.category,
      [t("export.tags")]: a.tags.join(", "),
      [t("export.coverImage")]: a.coverImage || t("export.none"),
      [t("export.published")]: a.isPublished ? t("export.yes") : t("export.no"),
      [t("export.publishDate")]: a.publishDate || t("export.na"),
      [t("export.createdAt")]: new Date(a.createdAt).toLocaleDateString(locale),
      [t("export.contentPreview")]:
        a.content.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, t("export.sheetName"));
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${t("export.filename")}-${date}.xlsx`);
  };

  return (
    <>
      <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t("title")}</h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={exportToExcel}
              disabled={!articles.length}
              aria-label={t("export.buttonAria")}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("export.button")}
            </Button>

            <Button asChild>
              <Link href={`/${locale}/articles/new`}>{t("addButton")}</Link>
            </Button>
          </div>
        </div>

        {!articles.length ? (
          <p className="text-muted-foreground text-center py-8">
            {t("emptyState")}
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={articles.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {articles.map((article) => (
                  <SortableArticleItem
                    key={article.id}
                    article={article}
                    onEdit={openEditDialog}
                    onDelete={deleteArticle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editingArticle}
        onClose={closeDialog}
      />
    </>
  );
}

function SortableArticleItem({
  article,
  onEdit,
  onDelete,
}: {
  article: Article;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("ArticleList");
  const locale = useLocale();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-all ${
        isDragging ? "shadow-lg scale-[1.02]" : ""
      }`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          aria-label={t("dragHandle")}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium">{article.title}</h3>
          <p className="text-sm text-muted-foreground">
            {article.category} • {article.tags.join(", ")}
          </p>
          {article.content && (
            <p
              className="text-sm text-muted-foreground mt-1 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html:
                  article.content.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
              }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(article)}
          aria-label={t("editAria")}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(article.id)}
          aria-label={t("deleteAria")}
        >
          <Trash2 className="h-4 w-4 stroke-red-500" />
        </Button>
      </div>
    </div>
  );
}
