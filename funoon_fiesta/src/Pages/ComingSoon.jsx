import React, { useState, useEffect, useMemo } from 'react';
import { Star, Music, Palette, Theater, Loader } from 'lucide-react';

// Custom hook for countdown timer
const useCountdown = (targetDays = 6) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = now + (targetDays * 24 * 60 * 60 * 1000);
    const difference = target - now;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-white/5 backdrop-blur-lg rounded-lg p-6 hover:bg-white/10 transition-all 
                  border border-amber-500/20 transform hover:-translate-y-1 duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className="transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
        {title}
      </h3>
    </div>
    <p className="text-amber-100/80 group-hover:text-amber-100 transition-colors">
      {description}
    </p>
  </div>
);

// Timer Block Component
const TimerBlock = ({ value, label }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-amber-500/20 
                  transform hover:scale-105 transition-all duration-300
                  relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    <div className="text-4xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-amber-100/80 capitalize">{label}</div>
  </div>
);

const ComingSoon = () => {
  const [isLoading, setIsLoading] = useState(true);
  const timeLeft = useCountdown(6);

  const features = useMemo(() => [
    { 
      icon: <Palette className="w-8 h-8 text-amber-400" />,
      title: "Visual Arts", 
      description: "Discover stunning calligraphy, traditional paintings, and modern Islamic art" 
    },
    { 
      icon: <Music className="w-8 h-8 text-amber-400" />,
      title: "Performance", 
      description: "Experience mesmerizing musical performances and cultural presentations" 
    },
    { 
      icon: <Theater className="w-8 h-8 text-amber-400" />,
      title: "Workshops", 
      description: "Participate in interactive sessions led by renowned artists" 
    }
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-emerald-900 to-teal-900">
        <Loader className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-emerald-900 to-teal-900 
                    text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-full h-full animate-pulse"
             style={{
               backgroundSize: '40px 40px',
               backgroundImage: `repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 20px),
                                repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 20px)`
             }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
        {/* Logo Star */}
        <div className="flex justify-center mb-8 transform hover:scale-110 transition-transform duration-300">
          <Star className="text-amber-400 w-12 h-12 animate-[spin_3s_linear_infinite]" />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 
                       text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-300">
          Funoon Fiesta
        </h1>
        
        <p className="text-xl md:text-2xl text-amber-100 mb-8 animate-fade-in-up">
          A Celebration of Islamic Art & Culture
        </p>

        {/* Coming Soon Banner */}
        <div className="relative py-3 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 tracking-wider animate-bounce">
            COMING SOON
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-amber-50 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Funoon Fiesta is a premier platform for students to showcase their talents. 
          It highlights the rich art forms of Islamic culture, presenting them to a wider audience. 
          The event fosters creativity, cultural appreciation, and artistic expression.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(timeLeft).map(([label, value]) => (
            <TimerBlock key={label} value={value} label={label} />
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-100" />
    </div>
  );
};

export default ComingSoon;