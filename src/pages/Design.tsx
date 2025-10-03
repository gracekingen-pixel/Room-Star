"use client";

import { Navigation } from "@/components/Navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

type FurnitureShape = "box" | "cylinder" | "sphere" | "roundedBox" | "rectangle";

type DefaultFurniture = {
  size: [number, number, number];
  color: string;
  shape?: FurnitureShape;
};

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

export type Project = {
  id: number;
  name: string;
  roomType: string;
  furniture: PlacedFurniture[];
};

/* --- defaults --- */
const furnitureDefaults: Record<string, DefaultFurniture> = {
  wall: { size: [10, 8, 0.5], color: "#F5F5DC", shape: "box" },
  door: { size: [1, 2, 0.1], color: "#8B4513", shape: "box" },
  window: { size: [2, 1.5, 0.1], color: "#87CEEB", shape: "box" },
  stair_step: { size: [2, 0.2, 1], color: "#A0522D", shape: "box" },


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
  stairwell: ["stair_step","plant", "wall", "window", "door", "bookshelf", "mirror", "ceilinglight", "fan", "lamp"]
};

/* --- 3D Furniture Primitive --- */
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

/* --- 3D Scene Component --- */
export const Scene3D = ({
  roomType,
  existingFurniture,
  onFurnitureChange,
  onBack,
}: {
  roomType: string;
  existingFurniture?: PlacedFurniture[];
  onFurnitureChange?: (f: PlacedFurniture[]) => void;
  onBack?: () => void;
}) => {
  const [furniture, setFurniture] = useState<PlacedFurniture[]>(existingFurniture || []);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<PlacedFurniture | null>(null);

  useEffect(() => {
    onFurnitureChange?.(furniture);
  }, [furniture]);

  // handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onFurnitureChange?.(furniture);
        alert("Project saved!");
        return;
      }
      if (selectedId === null) return;

      if (e.key === "Backspace" || e.key === "Delete") {
        setFurniture((prev) => prev.filter((f) => f.id !== selectedId));
        setSelectedId(null);
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "c") {
          const item = furniture.find((f) => f.id === selectedId);
          if (item) setClipboard(item);
        }
        if (e.key.toLowerCase() === "v") {
          if (clipboard) {
            const newItem: PlacedFurniture = {
              ...clipboard,
              id: Date.now(),
              position: [clipboard.position[0] + 1, clipboard.position[1], clipboard.position[2] + 1],
            };
            setFurniture((prev) => [...prev, newItem]);
            setSelectedId(newItem.id);
          }
        }
      }

      setFurniture((prev) =>
        prev.map((f) => {
          if (f.id !== selectedId) return f;
          let [x, y, z] = f.position;
          switch (e.key) {
            case "ArrowUp": z -= 0.2; break;
            case "ArrowDown": z += 0.2; break;
            case "ArrowLeft": x -= 0.2; break;
            case "ArrowRight": x += 0.2; break;
          }
          const minY = f.size[1] / 2;
          y = Math.max(y, minY);
          return { ...f, position: [x, y, z] };
        })
      );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, furniture, clipboard]);

  const addFurniture = (type: string) => {
    const def = furnitureDefaults[type];
    if (!def) return;
    const newItem: PlacedFurniture = {
      id: Date.now(),
      type,
      position: [0, def.size[1] / 2, 0],
      size: def.size,
      rotation: [0, 0, 0],
      color: def.color,
      shape: def.shape,
      note: "",
    };
    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const selectedItem = furniture.find((f) => f.id === selectedId) ?? null;

  const updateSize = (dim: number, val: number) => {
    setFurniture((prev) =>
      prev.map((f) =>
        f.id === selectedId
          ? {
              ...f,
              size: f.size.map((s, i) => (i === dim ? val : s)) as [number, number, number],
              position: [f.position[0], Math.max(f.position[1], val / 2), f.position[2]],
            }
          : f
      )
    );
  };

  const rotateFurniture = (axis: number, delta: number) => {
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, rotation: f.rotation.map((r, i) => (i === axis ? r + delta : r)) as [number, number, number] } : f))
    );
  };

  const updateHeight = (value: number) => {
    setFurniture((prev) => prev.map((f) => (f.id === selectedId ? { ...f, position: [f.position[0], Math.max(value, f.size[1] / 2), f.position[2]] } : f)));
  };

  const updateColor = (hex: string) => {
    setFurniture((prev) => prev.map((f) => (f.id === selectedId ? { ...f, color: hex } : f)));
  };

  const updateNote = (text: string) => {
    setFurniture((prev) => prev.map((f) => (f.id === selectedId ? { ...f, note: text } : f)));
  };

  return (
    <div className="flex h-screen relative">
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        {onBack && (
          <button onClick={onBack} className="mb-4 w-full bg-gray-700 hover:bg-gray-600 p-2 rounded">
            ← Back to Design Home
          </button>
        )}
        <h2 className="font-bold mb-2">Add Furniture</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {roomFurniture[roomType]?.map((type) => (
            <button key={type} onClick={() => addFurniture(type)} className="block w-full bg-gray-700 hover:bg-gray-600 p-2 rounded capitalize">{type}</button>
          ))}
        </div>

        <button onClick={() => { setFurniture([]); setSelectedId(null); }} className="mt-4 block w-full bg-red-600 hover:bg-red-500 p-2 rounded">
          Clear All
        </button>

        {selectedId !== null && selectedItem && (
          <div className="mt-4 space-y-4 overflow-y-auto">
            <h3 className="font-semibold">Modify Selected</h3>
            {(["Length (X)", "Height (Y)", "Width (Z)"] as string[]).map((label, i) => (
              <div key={i}>
                <label className="block text-sm">{label}</label>
                <input type="range" min={0.2} max={10} step={0.1} value={selectedItem.size[i]} onChange={(e) => updateSize(i, parseFloat(e.target.value))} className="w-full" />
              </div>
            ))}
            <div className="flex gap-2 flex-wrap mt-2">
              <button onClick={() => rotateFurniture(1, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ Y+</button>
              <button onClick={() => rotateFurniture(1, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ Y-</button>
              <button onClick={() => rotateFurniture(0, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ X+</button>
              <button onClick={() => rotateFurniture(0, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ X-</button>
              <button onClick={() => rotateFurniture(2, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ Z+</button>
              <button onClick={() => rotateFurniture(2, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ Z-</button>
            </div>
            <div className="mt-2">
              <label className="block">Height (Y Position)</label>
              <input type="range" min={0} max={10} step={0.1} value={selectedItem.position[1]} onChange={(e) => updateHeight(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="mt-2">
              <label className="block">Color</label>
              <input type="color" value={selectedItem.color || "#ffffff"} onChange={(e) => updateColor(e.target.value)} className="w-16 h-10 p-0 border-none cursor-pointer" />
            </div>
            <div className="mt-2">
              <label className="block">Notes</label>
              <textarea value={selectedItem.note || ""} onChange={(e) => updateNote(e.target.value)} placeholder="Write a note..." className="w-full p-2 rounded text-black" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-200">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} sectionSize={5} fadeDistance={30} />
          {furniture.map((item) => (
            <FurniturePrimitive key={item.id} position={item.position} size={item.size} color={item.color} rotation={item.rotation} shape={item.shape} isSelected={selectedId === item.id} onClick={(e: any) => { e.stopPropagation(); setSelectedId(item.id); }} />
          ))}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

/* --- Main Design Page with Projects --- */
export default function Design() {
  const [roomType, setRoomType] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentFurniture, setCurrentFurniture] = useState<PlacedFurniture[]>([]);

  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveProject();
      }
    };
    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [currentFurniture, editingProject, roomType]);

  const saveProject = () => {
    if (!roomType) return;
    const name = prompt("Enter project name:", editingProject?.name || "My Room");
    if (!name) return;
    const newProject: Project = {
      id: editingProject?.id || Date.now(),
      name,
      roomType,
      furniture: currentFurniture,
    };
    const updatedProjects = editingProject
      ? projects.map((p) => (p.id === editingProject.id ? newProject : p))
      : [...projects, newProject];

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setEditingProject(newProject);
    alert("Project saved!");
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    if (editingProject?.id === id) {
      setEditingProject(null);
      setRoomType(null);
      setCurrentFurniture([]);
    }
  };

  const startEditingProject = (project: Project) => {
    setEditingProject(project);
    setRoomType(project.roomType);
    setCurrentFurniture(project.furniture);
  };

  if (!roomType) {
    return (
      <div className="h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold">Choose a Room to Design</h1>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(roomFurniture).map((room) => (
              <button key={room} onClick={() => setRoomType(room)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 capitalize">{room}</button>
            ))}
          </div>

          {projects.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
              <ul className="space-y-2">
                {projects.map((p) => (
                  <li key={p.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{p.name} ({p.roomType})</span>
                    <div className="flex gap-2">
                      <button onClick={() => startEditingProject(p)} className="bg-green-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => deleteProject(p.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  

  return (
    <Scene3D
      roomType={roomType}
      existingFurniture={currentFurniture}
      onFurnitureChange={(f) => setCurrentFurniture(f)}
      onBack={() => { setRoomType(null); setEditingProject(null); setCurrentFurniture([]); }}
    />
  );
}
