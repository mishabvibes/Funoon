import React, { useState, useEffect } from 'react';
import { Star, Music, Palette, Theater } from 'lucide-react';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-emerald-900 to-teal-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" 
             style={{
               backgroundSize: '40px 40px',
               backgroundImage: `repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 20px),
                                repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 20px)`
             }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Star className="text-amber-400 w-12 h-12 animate-spin-slow" />
        </div>

        {/* Header Section */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-transparent bg-clip-text">
          Funoon Fiesta
        </h1>
        <p className="text-xl md:text-2xl text-amber-100 mb-8">
          A Celebration of Islamic Art & Culture
        </p>

        {/* Coming Soon Banner */}
        <div className="relative py-3 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-pulse"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 tracking-wider animate-bounce">
            COMING SOON
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-amber-50 mb-12 max-w-3xl mx-auto leading-relaxed">
          Funoon Fiesta is a premier platform for students to showcase their talents. 
          It highlights the rich art forms of Islamic culture, presenting them to a wider audience. 
          The event fosters creativity, cultural appreciation, and artistic expression.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} 
                 className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-amber-500/20 transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-amber-200">{value}</div>
              <div className="text-amber-100/80 capitalize">{unit}</div>
            </div>
          ))}
        </div>

        {/* Event Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { 
              icon: <Palette className="w-8 h-8 text-amber-400" />,
              title: "Visual Arts", 
              desc: "Discover stunning calligraphy, traditional paintings, and modern Islamic art" 
            },
            { 
              icon: <Music className="w-8 h-8 text-amber-400" />,
              title: "Performance", 
              desc: "Experience mesmerizing musical performances and cultural presentations" 
            },
            { 
              icon: <Theater className="w-8 h-8 text-amber-400" />,
              title: "Workshops", 
              desc: "Participate in interactive sessions led by renowned artists" 
            }
          ].map((feature) => (
            <div key={feature.title} 
                 className="bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all border border-amber-500/20">
              <div className="flex items-center gap-3 mb-3">
                {feature.icon}
                <h3 className="text-xl font-bold text-amber-200">{feature.title}</h3>
              </div>
              <p className="text-amber-100/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
    </div>
  );
};

export default ComingSoon;