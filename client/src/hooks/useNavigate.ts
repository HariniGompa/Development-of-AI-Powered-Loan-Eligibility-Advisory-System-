import { useState, useEffect } from "react";

type Page = "landing" | "login" | "signup" | "home" | "profile";

let currentPage: Page = "landing";
let listeners: Array<(page: Page) => void> = [];

export const useNavigate = () => {
  const [, setPage] = useState<Page>(currentPage);

  useEffect(() => {
    const listener = (page: Page) => {
      setPage(page);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const navigate = (page: Page) => {
    currentPage = page;
    listeners.forEach((listener) => listener(page));
  };

  return navigate;
};

export const usePage = () => {
  const [page, setPage] = useState<Page>(currentPage);

  useEffect(() => {
    const listener = (newPage: Page) => {
      setPage(newPage);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return page;
};
