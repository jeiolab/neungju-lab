import React from 'react';
import { 
  Shield, 
  EyeOff, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Users, 
  Cpu, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  BrainCircuit,
  Sword
} from 'lucide-react';

export const IconMap: Record<string, React.FC<{ className?: string }>> = {
  Shield,
  EyeOff,
  ShieldCheck,
  Activity,
  Lock,
  Users,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  BrainCircuit,
  Sword
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = IconMap[name] || Shield;
  return <IconComponent className={className} />;
};
