"use client";

import { useState } from "react";
import { useStore } from "@/stores/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const locale = useLocale();
  const { profileImage, setProfileImage } = useStore();
  const [preview, setPreview] = useState<string | null>(profileImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="container mx-auto p-6 max-w-2xl"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || undefined} alt={t("avatarAlt")} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="profile-image">{t("imageLabel")}</Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t("imageHint")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
