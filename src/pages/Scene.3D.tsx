"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";

export type FurnitureShape = "box" | "cylinder" | "sphere" | "roundedBox" | "rectangle";

export type PlacedFurniture = {
  id: number;
  type: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  color: string;
  shape?: FurnitureShape;
  note?: string;
};

type DefaultFurniture = {
  size: [number, number, number];
  color: string;
  shape?: FurnitureShape;
};

const furnitureDefaults: Record<string, DefaultFurniture> = {
  wall: { size: [10, 8, 0.5], color: "#F5F5DC", shape: "box" },
  door: { size: [1, 2, 0.1], color: "#8B4513", shape: "box" },
  window: { size: [2, 1.5, 0.1], color: "#87CEEB", shape: "box" },
  bed: { size: [3, 1, 4], color: "#8B4513", shape: "box" },
  nightstand: { size: [0.7, 0.7, 0.5], color: "#A0522D", shape: "box" },
  desk: { size: [2.5, 1, 1.5], color: "#CD853F", shape: "box" },
  chair: { size: [1, 1, 1], color: "#D2B48C", shape: "box" },
  dresser: { size: [2.5, 2, 1], color: "#A0522D", shape: "box" },
  closet: { size: [2.5, 2.2, 1], color: "#F5DEB3", shape: "box" },
  ceilingLight: { size: [0.4, 0.4, 0.1], color: "#FFFF00", shape: "cylinder" },
  rug: { size: [4, 0.05, 3], color: "#ADD8E6", shape: "box" },
  bookshelf: { size: [1, 2, 0.5], color: "#A0522D", shape: "box" },
  lamp: { size: [0.3, 1, 0.3], color: "#FFD700", shape: "cylinder" },
  tv: { size: [2, 1, 0.1], color: "#000000", shape: "box" },
  mirror: { size: [1.2, 1.8, 0.05], color: "#C0C0C0", shape: "rectangle" },
  pillow: { size: [0.8, 0.2, 0.5], color: "#FFFFFF", shape: "rectangle" },
  blanket: { size: [2, 0.1, 2.5], color: "#000080", shape: "rectangle" },
  plant: { size: [0.7, 1.2, 0.7], color: "#008000", shape: "sphere" },
  fan: { size: [1, 0.3, 1], color: "#808080", shape: "cylinder" },
  fridge: { size: [1.2, 2.2, 1.2], color: "#C0C0C0", shape: "box" },
  stove: { size: [1.2, 1.2, 1.2], color: "#2F4F4F", shape: "box" },
  microwave: { size: [0.8, 0.8, 0.8], color: "#696969", shape: "box" },
  dishwasher: { size: [1.2, 1.2, 1.2], color: "#708090", shape: "box" },
  kitchenSink: { size: [1.5, 1, 1.5], color: "#B0C4DE", shape: "cylinder" },
  kitchenTable: { size: [3, 1.5, 2], color: "#8B4513", shape: "box" },
  kitchenChair: { size: [1, 1, 1], color: "#DEB887", shape: "box" },
  toilet: { size: [1, 1.2, 1], color: "#FFFFFF", shape: "cylinder" },
  bathroomSink: { size: [1.2, 1, 1.2], color: "#F5F5F5", shape: "cylinder" },
  shower: { size: [2, 2, 2], color: "#ADD8E6", shape: "box" },
  bathtub: { size: [2.5, 1, 1], color: "#FFFFFF", shape: "roundedBox" },
  washingMachine: { size: [1.2, 1.2, 1.2], color: "#C0C0C0", shape: "box" },
  dryer: { size: [1.2, 1.2, 1.2], color: "#D3D3D3", shape: "box" },
  sofa: { size: [3, 1.5, 2], color: "#8B0000", shape: "roundedBox" },
  coffeeTable: { size: [1.5, 0.7, 1.5], color: "#8B4513", shape: "box" },
  tvStand: { size: [2, 0.7, 1], color: "#A0522D", shape: "box" },
  television: { size: [2, 1.2, 0.1], color: "#000000", shape: "box" },
  tableLamp: { size: [0.7, 1.5, 0.7], color: "#FFA500", shape: "cylinder" },
  diningTable: { size: [3, 1.5, 2], color: "#8B4513", shape: "box" },
  diningChair: { size: [1, 1, 1], color: "#DEB887", shape: "box" },
};

const roomFurniture: Record<string, string[]> = {
  bedroom: ["bed", "nightstand", "dresser", "closet", "lamp", "rug", "pillow", "blanket", "mirror", "window", "door", "wall"],
  livingroom: ["sofa", "rug", "tv", "lamp", "bookshelf", "plant", "fan", "window", "door", "wall"],
  office: ["desk", "chair", "bookshelf", "lamp", "plant", "rug", "window", "door", "wall"],
  kitchen: ["fridge", "stove", "microwave", "dishwasher", "kitchenSink", "kitchenTable", "kitchenChair", "window", "door", "wall"],
  bathroom: ["toilet", "bathroomSink", "shower", "bathtub", "mirror", "window", "door", "wall"],
  laundry: ["washingMachine", "dryer", "window", "door", "wall"],
};

const FurniturePrimitive = ({
  position,
  size,
  color,
  rotation,
  isSelected,
  onClick,
  shape,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation: [number, number, number];
  isSelected: boolean;
  onClick: (e: any) => void;
  shape?: FurnitureShape;
}) => {
  const material = <meshStandardMaterial color={isSelected ? "yellow" : color} />;

  switch (shape) {
    case "cylinder": {
      const radius = Math.max(0.01, Math.min(size[0], size[2]) / 2);
      return (
        <mesh position={position} rotation={rotation} onClick={onClick} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, size[1], 32]} />
          {material}
        </mesh>
      );
    }
    case "sphere": {
      const radius = Math.max(0.01, Math.min(size[0], size[1], size[2]) / 2);
      return (
        <mesh position={position} rotation={rotation} onClick={onClick} castShadow receiveShadow>
          <sphereGeometry args={[radius, 32, 32]} />
          {material}
        </mesh>
      );
    }
    case "roundedBox":
    case "rectangle":
    case "box":
    default:
      return (
        <mesh position={position} rotation={rotation} onClick={onClick} castShadow receiveShadow>
          <boxGeometry args={size} />
          {material}
        </mesh>
      );
  }
};

export { furnitureDefaults, roomFurniture, FurniturePrimitive };
