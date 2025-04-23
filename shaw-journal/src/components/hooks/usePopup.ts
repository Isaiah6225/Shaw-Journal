// hooks/usePopup.ts
import { useState } from "react";

export function usePopup<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = (newData?: T) => {
    if (newData) setData(newData);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setData(null);
  };
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    data,
    setData,
  };
}


