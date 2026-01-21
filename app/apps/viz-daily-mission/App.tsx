import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DailyMission } from './components/DailyMission';
import { TheoryTab } from './components/TheoryTab';
import { TemplatesTab } from './components/TemplatesTab';
import { QuizTab } from './components/QuizTab';
import { ReflectionTab } from './components/ReflectionTab';
import { loadProfile, saveProfile } from './utils/storage';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState(1); // Default to Mission
  const [profile, setProfile] = useState<UserProfile>({
    streak: 0,
    lastCompletedDate: null,
    totalCompleted: 0,
    badges: []
  });

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <TheoryTab />;
      case 1: return <DailyMission profile={profile} setProfile={setProfile} />;
      case 2: return <TemplatesTab />;
      case 3: return <QuizTab />;
      case 4: return <ReflectionTab />;
      default: return <DailyMission profile={profile} setProfile={setProfile} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} profile={profile}>
      {renderContent()}
    </Layout>
  );
}