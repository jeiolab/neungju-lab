import React from 'react';
import {
  Thermometer, Sun, Mic, Ruler, Droplets, Camera,
  Wifi, Bluetooth, SignalHigh,
  Cloud, Server,
  Megaphone, Fan, Waves, Smartphone, Lightbulb, Navigation,
  Box, Cpu
} from 'lucide-react';

const icons: Record<string, React.ElementType> = {
  Thermometer, Sun, Mic, Ruler, Droplets, Camera,
  Wifi, Bluetooth, SignalHigh,
  Cloud, Server,
  Megaphone, Fan, Waves, Smartphone, Lightbulb, Navigation,
  Box, Cpu
};

interface IconMapProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconMap: React.FC<IconMapProps> = ({ name, className, size = 24 }) => {
  const IconComponent = icons[name] || Box;
  return <IconComponent className={className} size={size} />;
};
