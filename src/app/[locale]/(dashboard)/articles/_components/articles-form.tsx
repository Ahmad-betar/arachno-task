"use client";

import { useForm, Controller } from "react-hook-form";
import { useStore } from "@/stores/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Article } from "@/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useTranslations, useLocale } from "next-intl";

interface ArticleFormProps {
  article?: Article;
  onClose: () => void;
}

const categories = ["Technology", "Health", "Education", "Business"];

export function ArticleForm({ article, onClose }: ArticleFormProps) {
  const t = useTranslations("ArticleForm");
  const locale = useLocale();
  const { addArticle, updateArticle } = useStore();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: article || {
      title: "",
      category: "",
      tags: [],
      coverImage: null,
      content: "<p>Start writing...</p>",
      isPublished: false,
      publishDate: null,
    },
  });

  const [tagsInput, setTagsInput] = useState(article?.tags?.join(", ") || "");
  const [imageUrl, setImageUrl] = useState(article?.coverImage || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: article?.content || t("editorPlaceholder"),
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px]",
        dir: locale === "ar" ? "rtl" : "ltr",
      },
    },
  });

  const { isPublished } = watch();

  const onSubmit = (data: any) => {
    const tags = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const payload = {
      ...data,
      tags,
      coverImage: imageUrl,
    };

    if (article?.id) {
      updateArticle(article.id, payload);
    } else {
      addArticle(payload);
    }
    onClose();
  };

  useMemo(() => editor, [editor]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("title.label")}</Label>
        <Input
          id="title"
          {...register("title", { required: t("title.required") })}
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">{t("category.label")}</Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: t("category.required") }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t("category.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-sm text-destructive mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">{t("tags.label")}</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder={t("tags.placeholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">{t("coverImage.label")}</Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setImageUrl(url);
              setValue("coverImage", url);
            }
          }}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={t("coverImage.previewAlt")}
            className="mt-3 w-full max-w-xs h-40 object-cover rounded-md"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>{t("content.label")}</Label>
        {editor ? (
          <div className="border rounded-md">
            <div className="border-b p-2 bg-muted/50 flex gap-1 flex-wrap">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                  "text-xs",
                  editor.isActive("bold") && "bg-accent"
                )}
              >
                {t("editor.bold")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "text-xs",
                  editor.isActive("italic") && "bg-accent"
                )}
              >
                {t("editor.italic")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  "text-xs",
                  editor.isActive("heading", { level: 1 }) && "bg-accent"
                )}
              >
                {t("editor.h1")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  "text-xs",
                  editor.isActive("bulletList") && "bg-accent"
                )}
              >
                {t("editor.list")}
              </Button>
            </div>
            <EditorContent editor={editor} className="p-4 prose max-w-none" />
          </div>
        ) : (
          <p>{t("editor.loading")}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label>{t("published.label")}</Label>
      </div>

      {isPublished && (
        <div className="space-y-2">
          <Label htmlFor="publishDate">{t("publishDate.label")}</Label>
          <Controller
            name="publishDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="publishDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value), "PPP")
                      : t("publishDate.placeholder")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date?.toISOString() || null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("actions.cancel")}
        </Button>
        <Button type="submit">
          {article ? t("actions.update") : t("actions.create")}
        </Button>
      </div>
    </form>
  );
}
