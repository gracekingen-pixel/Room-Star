"use client";

import { Navigation } from "@/components/Navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

/* --- Types --- */
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
  photos?: string[];
};

/* --- Defaults --- */
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

/* --- 3D Furniture Component --- */
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
  photos,
  onPhotosChange,
  onBack,
}: {
  roomType: string;
  existingFurniture?: PlacedFurniture[];
  onFurnitureChange?: (f: PlacedFurniture[]) => void;
  photos?: string[];
  onPhotosChange?: (photos: string[]) => void;
  onBack?: () => void;
}) => {
  const [furniture, setFurniture] = useState<PlacedFurniture[]>(existingFurniture || []);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<PlacedFurniture | null>(null);

  useEffect(() => {
    onFurnitureChange?.(furniture);
  }, [furniture]);

  /* --- Handle Key Events --- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId === null) return;

      const selected = furniture.find((f) => f.id === selectedId);
      if (!selected) return;

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        setFurniture(furniture.filter((f) => f.id !== selectedId));
        setSelectedId(null);
        return;
      }

      // Copy / Paste
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        setClipboard(selected);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (clipboard) {
          const newItem: PlacedFurniture = {
            ...clipboard,
            id: Date.now(),
            position: [
              clipboard.position[0] + 1,
              clipboard.position[1],
              clipboard.position[2] + 1,
            ],
          };
          setFurniture([...furniture, newItem]);
          setSelectedId(newItem.id);
        }
        return;
      }

      // Arrow movement
      setFurniture((prev) =>
        prev.map((f) => {
          if (f.id !== selectedId) return f;
          let [x, y, z] = f.position;
          switch (e.key) {
            case "ArrowUp":
              z -= 0.2;
              break;
            case "ArrowDown":
              z += 0.2;
              break;
            case "ArrowLeft":
              x -= 0.2;
              break;
            case "ArrowRight":
              x += 0.2;
              break;
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

  /* --- Add Furniture --- */
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
    };
    setFurniture([...furniture, newItem]);
    setSelectedId(newItem.id);
  };

  /* --- Update Furniture --- */
  const selectedItem = furniture.find((f) => f.id === selectedId) ?? null;

  const updateSize = (dim: number, val: number) => {
    if (!selectedItem) return;
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
    if (!selectedItem) return;
    setFurniture((prev) =>
      prev.map((f) =>
        f.id === selectedId
          ? {
              ...f,
              rotation: f.rotation.map((r, i) => (i === axis ? r + delta : r)) as [number, number, number],
            }
          : f
      )
    );
  };

  const updateHeight = (val: number) => {
    if (!selectedItem) return;
    setFurniture((prev) =>
      prev.map((f) =>
        f.id === selectedId
          ? { ...f, position: [f.position[0], Math.max(val, f.size[1] / 2), f.position[2]] }
          : f
      )
    );
  };

  const updateColor = (hex: string) => {
    if (!selectedItem) return;
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, color: hex } : f))
    );
  };

  /* --- Photo Upload --- */
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onPhotosChange) return;
    const urls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    onPhotosChange([...photos || [], ...urls]);
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        {onBack && (
          <button onClick={onBack} className="mb-4 w-full bg-gray-700 hover:bg-gray-600 p-2 rounded">
            ← Back
          </button>
        )}
        <h2 className="font-bold mb-2">Add Furniture</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {roomFurniture[roomType]?.map((type) => (
            <button
              key={type}
              onClick={() => addFurniture(type)}
              className="block w-full bg-gray-700 hover:bg-gray-600 p-2 rounded capitalize"
            >
              {type}
            </button>
          ))}
        </div>

        {/* Upload Photos */}
        <div className="mt-4">
          <label className="block mb-1">Upload Photos</label>
         <input
  type="file"
  multiple
  onChange={(e) => {
    const files = e.target.files;
    if (!files) return;
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    onPhotosChange?.((prev) => [...(prev || []), ...newUrls]);
    e.target.value = ""; // reset input so same file can be uploaded again
  }}
  className="w-full text-black"
/>

        </div>

        {/* Selected Item Controls */}
        {selectedItem && (
          <div className="mt-4 text-black overflow-y-auto space-y-2">
            <h3 className="font-semibold">Modify Selected</h3>
            {(["X Size", "Y Size", "Z Size"] as string[]).map((label, i) => (
              <div key={i}>
                <label>{label}</label>
                <input
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={selectedItem.size[i]}
                  onChange={(e) => updateSize(i, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <div className="flex gap-2 flex-wrap mt-2">
              <button onClick={() => rotateFurniture(0, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ X+</button>
              <button onClick={() => rotateFurniture(0, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ X-</button>
              <button onClick={() => rotateFurniture(1, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ Y+</button>
              <button onClick={() => rotateFurniture(1, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ Y-</button>
              <button onClick={() => rotateFurniture(2, Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↻ Z+</button>
              <button onClick={() => rotateFurniture(2, -Math.PI / 12)} className="bg-blue-600 px-2 py-1 rounded">↺ Z-</button>
            </div>
            <div>
              <label>Height (Y)</label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={selectedItem.position[1]}
                onChange={(e) => updateHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>Color</label>
              <input type="color" value={selectedItem.color} onChange={(e) => updateColor(e.target.value)} className="w-16 h-10 p-0 border-none cursor-pointer" />
            </div>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 bg-gray-200">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} sectionSize={5} fadeDistance={30} />
          {furniture.map((item) => (
            <FurniturePrimitive
              key={item.id}
              position={item.position}
              size={item.size}
              color={item.color}
              rotation={item.rotation}
              shape={item.shape}
              isSelected={selectedId === item.id}
              onClick={(e: any) => { e.stopPropagation(); setSelectedId(item.id); }}
            />
          ))}
          <OrbitControls />
        </Canvas>

        {/* Photo preview */}
        <div className="flex flex-wrap p-2 gap-2 bg-gray-100">
          {photos?.map((src, i) => (
            <img key={i} src={src} alt="Uploaded" className="w-32 h-32 object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- Main Design Page --- */
export default function DesignPage() {
  const [roomType, setRoomType] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentFurniture, setCurrentFurniture] = useState<PlacedFurniture[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const saveProject = () => {
    if (!roomType) return;
    const name = prompt("Project Name:", editingProject?.name || "My Room");
    if (!name) return;
    const newProject: Project = {
      id: editingProject?.id || Date.now(),
      name,
      roomType,
      furniture: currentFurniture,
      photos,
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
      setPhotos([]);
    }
  };

  const startEditingProject = (project: Project) => {
    setEditingProject(project);
    setRoomType(project.roomType);
    setCurrentFurniture(project.furniture);
    setPhotos(project.photos || []);
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
      onFurnitureChange={setCurrentFurniture}
      photos={photos}
      onPhotosChange={setPhotos}
      onBack={() => { setRoomType(null); setEditingProject(null); setCurrentFurniture([]); setPhotos([]); }}
    />
  );
}
