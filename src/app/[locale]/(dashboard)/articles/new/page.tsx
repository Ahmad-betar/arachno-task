"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "../_components/articles-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function AddArticlePage() {
  const t = useTranslations("AddArticlePage");
  const locale = useLocale();
  const router = useRouter();

  const handleClose = () => {
    router.push(`/${locale}/articles`);
  };

  return (
    <div
      className="container mx-auto p-6 max-w-2xl"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button asChild variant="outline">
          <Link href={`/${locale}/articles`}>{t("cancel")}</Link>
        </Button>
      </div>
      <ArticleForm onClose={handleClose} />
    </div>
  );
}
