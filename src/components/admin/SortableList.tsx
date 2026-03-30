"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

interface SortableListProps<T> {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  idKey?: string;
}

export default function SortableList<T>({
  items,
  onReorder,
  renderItem,
  idKey = "id",
}: SortableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const getId = useCallback(
    (item: T): string => (item as Record<string, unknown>)[idKey] as string,
    [idKey]
  );

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", String(index));
    // Slight delay so the dragged element renders before going transparent
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    });
  }

  function handleDragEnd() {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setOverIndex(index);
  }

  function handleDragLeave() {
    setOverIndex(null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const orderedIds = reordered.map((item) => getId(item));
    onReorder(orderedIds);
    handleDragEnd();
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const isOver = overIndex === index && dragIndex !== index;
        const isDragging = dragIndex === index;

        return (
          <div
            key={getId(item)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center gap-3 bg-white border rounded-lg px-4 py-3 transition-all
              ${isDragging ? "opacity-40" : ""}
              ${isOver ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]" : "border-border"}
            `}
            style={{ cursor: "grab" }}
          >
            <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
              <GripVertical size={18} />
            </div>
            <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
          </div>
        );
      })}
    </div>
  );
}
