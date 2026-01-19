import React from 'react';
import { 
  Activity, Thermometer, Camera, MapPin, 
  Wifi, Radio, 
  Cpu, Database, 
  Smartphone, PhoneCall, Droplets, Monitor, 
  Music, TrafficCone, Zap,
  Award, Medal, HelpCircle, CheckCircle, XCircle
} from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  Activity, Thermometer, Camera, MapPin,
  Wifi, Radio,
  Cpu, Database,
  Smartphone, PhoneCall, Droplets, Monitor,
  Music, TrafficCone, Zap,
  Award, Medal, HelpCircle, CheckCircle, XCircle
};

interface BlockIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const BlockIcon: React.FC<BlockIconProps> = ({ name, size = 24, className = "" }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};