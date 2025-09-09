import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

export const CameraCapture = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast("Camera ready! Position your room and click capture.");
    } catch (error) {
      toast("Camera access denied. Please use file upload instead.");
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData);
      
      // Stop camera stream
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
      
      toast("Photo captured! Ready for 3D design.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setIsCapturing(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
              Capture Your Room
            </CardTitle>
            <CardDescription>
              Take a photo of your room to start designing with 3D furniture placement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!image && !isCapturing && (
              <div className="space-y-4">
                <Button
                  onClick={startCamera}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Camera className="h-5 w-5" />
                  Use Camera
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="architectural"
                  size="lg"
                  className="w-full"
                >
                  <Upload className="h-5 w-5" />
                  Upload Photo
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {isCapturing && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-space rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  onClick={capturePhoto}
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  <Check className="h-5 w-5" />
                  Capture Photo
                </Button>
              </div>
            )}

            {image && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-space rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Captured room"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={retakePhoto}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Retake
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    asChild
                  >
                    <a href="/design">
                      Start Designing
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};