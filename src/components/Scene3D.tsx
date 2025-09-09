import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, Box, Sphere } from "@react-three/drei";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, Bed, Table, Lightbulb, Image as ImageIcon, Package } from "lucide-react";
import { toast } from "sonner";

interface FurnitureItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  position: [number, number, number];
}

const Scene = ({ furniture }: { furniture: FurnitureItem[] }) => {
  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
      <Environment preset="apartment" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Room floor */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4edd"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Furniture items */}
      {furniture.map((item) => (
        <group key={item.id} position={item.position}>
          {item.name.includes('Chair') && (
            <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={item.color} />
            </Box>
          )}
          {item.name.includes('Bed') && (
            <Box args={[2, 0.5, 1.5]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color={item.color} />
            </Box>
          )}
          {item.name.includes('Table') && (
            <Box args={[1.5, 0.1, 1]} position={[0, 0.7, 0]}>
              <meshStandardMaterial color={item.color} />
            </Box>
          )}
          {item.name.includes('Lamp') && (
            <Sphere args={[0.3]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.3} />
            </Sphere>
          )}
          {item.name.includes('Art') && (
            <Box args={[1, 1.2, 0.1]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color={item.color} />
            </Box>
          )}
          {item.name.includes('Storage') && (
            <Box args={[1, 1.5, 0.6]} position={[0, 0.75, 0]}>
              <meshStandardMaterial color={item.color} />
            </Box>
          )}
        </group>
      ))}
    </>
  );
};

export const Scene3D = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);

  const furnitureTypes = [
    { name: "Modern Chair", icon: Armchair, color: "#8B5CF6" },
    { name: "Queen Bed", icon: Bed, color: "#3B82F6" },
    { name: "Coffee Table", icon: Table, color: "#F59E0B" },
    { name: "Floor Lamp", icon: Lightbulb, color: "#EF4444" },
    { name: "Wall Art", icon: ImageIcon, color: "#10B981" },
    { name: "Storage Unit", icon: Package, color: "#6B7280" },
  ];

  const addFurniture = (type: typeof furnitureTypes[0]) => {
    const newItem: FurnitureItem = {
      id: `${type.name}-${Date.now()}`,
      name: type.name,
      icon: type.icon,
      color: type.color,
      position: [
        Math.random() * 6 - 3,
        0,
        Math.random() * 6 - 3
      ],
    };

    setFurniture(prev => [...prev, newItem]);
    toast(`Added ${type.name} to your room!`);
  };

  const clearAll = () => {
    setFurniture([]);
    toast("Room cleared!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-3">
          <Card className="shadow-elegant h-[600px]">
            <CardHeader>
              <CardTitle className="bg-gradient-hero bg-clip-text text-transparent">
                3D Room Designer
              </CardTitle>
              <CardDescription>
                Drag to rotate, scroll to zoom. Click furniture below to add to your room.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-b-lg overflow-hidden">
                <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
                  <Scene furniture={furniture} />
                </Canvas>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Furniture Panel */}
        <div className="space-y-4">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg">Furniture</CardTitle>
              <CardDescription>
                Click to add items to your room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {furnitureTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.name}
                    onClick={() => addFurniture(type)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4" style={{ color: type.color }} />
                    {type.name}
                  </Button>
                );
              })}
              
              <Button
                onClick={clearAll}
                variant="destructive"
                size="sm"
                className="w-full mt-4"
                disabled={furniture.length === 0}
              >
                Clear All
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg">Room Items</CardTitle>
              <CardDescription>
                {furniture.length} items placed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {furniture.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No furniture added yet. Click items above to get started!
                </p>
              ) : (
                <div className="space-y-2">
                  {furniture.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Icon className="h-3 w-3" style={{ color: item.color }} />
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};