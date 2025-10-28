"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    router.replace({ pathname }, { locale: newLocale });
  };

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <Select onValueChange={changeLanguage} defaultValue={locale}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ar">{t("ar")}</SelectItem>
          <SelectItem value="en">{t("en")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
