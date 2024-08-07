import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Responsive, WidthProvider } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ImageGridProps {
  images: { url: string }[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [layout, setLayout] = useState<ReactGridLayout.Layout[]>([]);
  const [rowHeight, setRowHeight] = useState(100);
  const [maxRows, setMaxRows] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRowHeight = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const columns = getColumns(containerWidth);
        const newRowHeight = containerWidth / columns;
        setRowHeight(newRowHeight);
        setMaxRows(Math.ceil(images.length / columns));
      }
    };

    updateRowHeight();
    window.addEventListener("resize", updateRowHeight);
    return () => window.removeEventListener("resize", updateRowHeight);
  }, []);

  const getColumns = (width: number) => {
    if (width >= 1024) return 7;
    if (width >= 768) return 6;
    if (width >= 640) return 5;
    if (width >= 480) return 4;
    return 3;
  };

  const generateLayout = (): ReactGridLayout.Layout[] => {
    return images.map((_, index) => ({
      i: index.toString(),
      x: index % 7,
      y: Math.floor(index / 7),
      w: 1,
      h: 1,
    }));
  };

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    setLayout(newLayout);
  };

  return (
    <div ref={containerRef}>
      <ResponsiveGridLayout
        className="layout p-0"
        layouts={{ lg: layout.length ? layout : generateLayout() }}
        breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 480, xxs: 0 }}
        cols={{ lg: 7, md: 6, sm: 5, xs: 4, xxs: 3 }}
        rowHeight={rowHeight}
        onLayoutChange={onLayoutChange}
        isResizable={false}
        maxRows={maxRows}
        compactType="horizontal"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg bg-gray-200"
          >
            <Image
              src={image.url}
              alt={`Image ${index + 1}`}
              fill
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ImageGrid;
