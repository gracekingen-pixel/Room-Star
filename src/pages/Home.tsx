import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Box, Sparkles, ArrowRight, Zap, Users, Shield } from "lucide-react";
import heroImage from "@/assets/hero-room.jpg";

const Home = () => {
  const features = [
  //Changed from "capture" to "Photograph Your Space"
    {
      icon: Camera,
      title: "Photograph Your Space",
      description: "Take photos of your space and let our AI understand your room's dimensions and layout."
    },
    {
      icon: Box,
      title: "3D Furniture Placement",
      description: "Drag and drop furniture, art, and storage solutions in realistic 3D space."
    },
    {
      icon: Zap,
      title: "Instant Visualization",
      description: "See how your design choices look in real-time with advanced 3D rendering."
    },
    {
      icon: Users,
      title: "Share & Collaborate",
      description: "Share your designs with family or get feedback from interior design professionals. Allow other app users to get inspriration from your designs!"
    //Added Allow other app users to get inspriration from your designs!
    }

  ];

  return (
    <div className="min-h-screen bg-gradient-space">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">Interior Design Made Simple</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Transform Your
                  <span className="bg-gradient-hero bg-clip-text text-transparent block">
                    Room with AI
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Take a photo of your room and design it with 3D furniture placement. 
                  Visualize before you buy, create before you commit.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="xl"
                  asChild
                >
                  <a href="/camera" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Start Designing
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="architectural" 
                  size="xl"
                  asChild
                >
                  <a href="/design">
                    View 3D Demo
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gold" />
                  Free to try
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gold" />
                  Instant results
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold" />
                  Share designs
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-float">
                <img 
                  src={heroImage}
                  alt="Modern interior design room"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              How Room Star Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From photo to perfect design in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-float transition-smooth border-border/50">
                  <CardHeader>
                    <div className="bg-gradient-hero p-3 rounded-lg w-fit shadow-glow">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
           
             {/* Added Search Bar*/}
          {/* 🔍 Search Designers Unit */}
          <div className="mt-16 flex flex-col items-center space-y-4">
            <h3 className="text-2xl font-semibold">Find Inspiration from Other Designers</h3>
            <div className="flex w-full max-w-md items-center space-x-2">
              <input 
                type="text" 
                placeholder="Search designers or styles..." 
                className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button variant="gold" size="lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
          
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-depth text-primary-foreground shadow-float">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold">
                  Ready to Design Your Dream Room?
                </h3>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Join thousands of homeowners who have transformed their spaces with Room Star's 3D design tools.
                </p>
                <Button variant="gold" size="xl" asChild>
                  <a href="/camera" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Start Your First Design
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
