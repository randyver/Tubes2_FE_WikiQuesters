"use client";

import React, { useEffect, useRef, useState } from "react";

export type MapItem = {
  [key: string]: string[];
};

interface Props {
  mapData: MapItem[];
  startPage: string;
  targetPage: string;
  showGraph: boolean;
}

const DrawGraph: React.FC<Props> = ({ mapData, startPage, targetPage, showGraph }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxChildren = Math.max(
    ...mapData.map((item) => Object.values(item)[0].length)
  );
  const offsetX = 200;
  const offsetY = 100;
  const canvasWidth = offsetX * maxChildren;
  const canvasHeight = 1000;
  const startX = canvasWidth / 2;
  const startY = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const visited = new Set<string>();
    const nodePositions = new Map<string, { x: number; y: number }>();

    const drawLine = (
      start: { x: number; y: number },
      end: { x: number; y: number }
    ) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawNode = (name: string, x: number, y: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(name, x, y - 40);
    };

    const getTitleFromUrl = (url: string): string => {
      let title = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

      const pathIndex = title.lastIndexOf("/");
      if (pathIndex !== -1) {
        title = title.substring(pathIndex + 1);
      }

      return title;
    };

    const drawGraph = (
      url: string,
      x: number,
      y: number,
      offsetX = 200,
      offsetY = 100,
      depth = 0,
    ) => {
      if (visited.has(url)) return;
      visited.add(url);

      const title = getTitleFromUrl(url);
      let color;
      if (url === startPage) {
        color = "green"; // Start page
      } else if (url === targetPage) {
        color = "yellow"; // Target page
      } else {
        color = "white"; // Other pages
      }
      drawNode(title, x, y, color);

      nodePositions.set(url, { x, y });

      const item = mapData.find((item) => Object.keys(item)[0] === url);
      if (!item) return;

      const children = item[url];
      let nextX = x - (offsetX * (children.length - 1)) / 2; // Set nextX to the leftmost
      let nextY = y + offsetY; // Set nextY to be below the current node

      children.forEach((childUrl, index) => {
        if (index !== 0) {
          nextX += offsetX; // Move nextX to the right for each child
        }

        if (nodePositions.has(childUrl)) {
          const childPosition = nodePositions.get(childUrl);
          if (childPosition) {
            drawLine({ x, y }, childPosition);
          }
        } else {
          drawLine({ x, y }, { x: nextX, y: nextY });
          drawGraph(childUrl, nextX, nextY, offsetX, offsetY, depth + 1);
        }
      });
    };

    drawGraph(startPage, startX, startY, offsetX, offsetY, 0);
    drawGraph(targetPage, startX, startY + 200, offsetX, offsetY, 0);
  }, [mapData, startPage, targetPage]);

  return (
    showGraph && <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ border: "1px solid white" }}
    />
  );
};

export default DrawGraph;
