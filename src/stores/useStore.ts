import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface TimeRange {
  start: string;
  end: string;
}

interface AppState {
  // Auth
  user: { email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Language
  locale: "en" | "ar";
  setLocale: (locale: "en" | "ar") => void;

  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, "id" | "createdAt">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  reorderArticles: (newOrder: Article[]) => void;

  profileImage: string | null;
  setProfileImage: (url: string | null) => void;

  // Working Hours
  schedule: Record<string, TimeRange[]>;
  updateDaySchedule: (day: string, ranges: TimeRange[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        if (email === "admin@admin.com" && password === "12345678") {
          set({ user: { email } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),

      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

      locale: "en",
      setLocale: (locale) => set({ locale }),

      profileImage: null,
      setProfileImage: (url) => set({ profileImage: url }),

      articles: [],
      addArticle: (article) =>
        set((state) => ({
          articles: [
            ...state.articles,
            {
              ...article,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateArticle: (id, updates) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        })),
      reorderArticles: (newOrder) => set({ articles: newOrder }),

      schedule: {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
      },
      updateDaySchedule: (day, ranges) =>
        set((state) => ({
          schedule: { ...state.schedule, [day]: ranges },
        })),
    }),
    {
      name: "kb-dashboard",
    }
  )
);
