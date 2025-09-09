import { Navigation } from "@/components/Navigation";
import { CameraCapture } from "@/components/CameraCapture";

const Camera = () => {
  return (
    <div className="min-h-screen bg-gradient-space">
      <Navigation />
      <CameraCapture />
    </div>
  );
};

export default Camera;