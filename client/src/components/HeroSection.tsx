import { Button } from "./ui/button";
import { Shield, Heart, ArrowRight, Play, Pause, Flag } from "lucide-react";
import { useState, useRef } from "react";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-width video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop"
        >
          <source src="https://cdn.pixabay.com/video/2023/10/15/187470-872624007_medium.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')"
            }}
          ></div>
        </video>
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-palestine-black/60 via-palestine-black/40 to-palestine-red/30 z-10"></div>

      {/* Video controls */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={toggleVideo}
          className="w-12 h-12 bg-palestine-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-palestine-white/30 transition-all duration-300 transform hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-palestine-white" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 text-palestine-white ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Live badge with Palestine colors */}
      <div className="absolute top-6 right-6 z-30">
        <div className="bg-gradient-to-r from-palestine-red to-palestine-red-dark backdrop-blur-sm text-palestine-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-palestine-white rounded-full animate-pulse"></div>
          مباشر الآن
        </div>
      </div>

      {/* Main content overlay */}
      <div className="container mx-auto px-6 relative z-20 text-center" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-palestine-red/20 to-palestine-green/20 backdrop-blur-sm text-palestine-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-palestine-white/20">
            <Flag className="w-4 h-4" />
            Palestine Soldiers
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-palestine-white mb-6 leading-tight text-shadow-xl">
            <span className="bg-gradient-to-l from-palestine-red-light via-palestine-red to-palestine-red-dark bg-clip-text text-transparent">
              نبض فلسطين
            </span>
            <span className="block mt-2">الإعلام المقاوم</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-palestine-white/90 mb-10 leading-relaxed max-w-3xl mx-auto text-shadow-lg">
            منصة إعلامية رقمية شاملة تواجه التضليل، تحافظ على التراث، وتدعم الشعب الفلسطيني 
            من خلال التوثيق المرئي والتعليم المجاني
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-palestine-red to-palestine-red-dark hover:from-palestine-red-dark hover:to-palestine-red text-palestine-white shadow-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              شاهد الأخبار المصورة
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-palestine-white/30 text-palestine-white hover:bg-palestine-green/20 bg-palestine-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              اكتشف التراث الفلسطيني
            </Button>
          </div>

          {/* Stats with Palestine flag colors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center bg-gradient-to-br from-palestine-red/10 to-palestine-red/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-palestine-red/20">
              <div className="text-3xl font-bold text-palestine-white text-shadow">١٠٠+</div>
              <div className="text-sm text-palestine-red-light mt-1 text-shadow">صانع محتوى</div>
            </div>
            <div className="text-center bg-gradient-to-br from-palestine-green/10 to-palestine-green/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-palestine-green/20">
              <div className="text-3xl font-bold text-palestine-white text-shadow">٥٠+</div>
              <div className="text-sm text-palestine-green-light mt-1 text-shadow">دورة مجانية</div>
            </div>
            <div className="text-center bg-gradient-to-br from-palestine-red/10 to-palestine-red/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-palestine-red/20">
              <div className="text-3xl font-bold text-palestine-white text-shadow">٢٠٠+</div>
              <div className="text-sm text-palestine-red-light mt-1 text-shadow">قصة تراثية</div>
            </div>
            <div className="text-center bg-gradient-to-br from-palestine-green/10 to-palestine-green/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-palestine-green/20">
              <div className="text-3xl font-bold text-palestine-white text-shadow">٧٥+</div>
              <div className="text-sm text-palestine-green-light mt-1 text-shadow">دولة داعمة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom overlay with Palestinian flag accent */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20" dir="rtl">
        <div className="bg-gradient-to-r from-palestine-black/80 to-palestine-black/60 backdrop-blur-sm rounded-xl p-4 text-palestine-white text-center border border-palestine-white/10">
          <h3 className="font-semibold text-lg mb-1 text-shadow flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-palestine-red" fill="currentColor" />
            صوت الحقيقة
          </h3>
          <p className="text-sm text-palestine-white/80 text-shadow">توثيق الواقع الفلسطيني بالصورة والصوت</p>
        </div>
      </div>

      {/* Scroll indicator with Palestine colors */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-palestine-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-palestine-red to-palestine-green rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Decorative elements with Palestine colors */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-palestine-red/10 rounded-full blur-3xl z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-palestine-green/10 rounded-full blur-3xl z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-palestine-white/5 rounded-full blur-2xl z-10"></div>

      {/* Palestinian flag stripe at the very top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-palestine-flag z-30 animate-flag-wave"></div>
    </section>
  );
}