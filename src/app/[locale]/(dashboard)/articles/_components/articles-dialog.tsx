"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleForm } from "./articles-form";
import { Article } from "@/types";
import { useTranslations, useLocale } from "next-intl";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onClose: () => void;
}

export function ArticleDialog({
  open,
  onOpenChange,
  article,
  onClose,
}: ArticleDialogProps) {
  const t = useTranslations("ArticleDialog");
  const locale = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle>{article ? t("editTitle") : t("addTitle")}</DialogTitle>
        </DialogHeader>
        <ArticleForm
          article={article as Article}
          onClose={() => {
            onClose();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
