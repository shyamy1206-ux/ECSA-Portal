"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ScrollStoryContextType = {
  activeChapter: string;
  setActiveChapter: (chapter: string) => void;
};

const ScrollStoryContext = createContext<ScrollStoryContextType>({
  activeChapter: "hero",
  setActiveChapter: () => {},
});

export function ScrollStoryProvider({ children }: { children: ReactNode }) {
  const [activeChapter, setActiveChapter] = useState("hero");

  const value = React.useMemo(() => ({
    activeChapter,
    setActiveChapter
  }), [activeChapter]);

  return (
    <ScrollStoryContext.Provider value={value}>
      {children}
    </ScrollStoryContext.Provider>
  );
}

export function useActiveStorySection() {
  return useContext(ScrollStoryContext);
}
