import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("ArticleForm");

  return <div>{t("title.label")}</div>;
}
