import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { SEED } from '../data/seed';

const PortfolioContext = createContext(null);

function applySeed(setters) {
  setters.setProfile(SEED.profile);
  setters.setSettings(SEED.settings);
  setters.setStats(SEED.stats);
  setters.setProjects(SEED.projects);
  setters.setAchievements(SEED.achievements);
  setters.setSkills(SEED.skills);
}

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(SEED.profile);
  const [settings, setSettings] = useState(SEED.settings);
  const [stats, setStats] = useState(SEED.stats);
  const [projects, setProjects] = useState(SEED.projects);
  const [achievements, setAchievements] = useState(SEED.achievements);
  const [skills, setSkills] = useState(SEED.skills);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [bundle, proj, ach, sk] = await Promise.all([
        api.profile(),
        api.projects(),
        api.achievements(),
        api.skills(),
      ]);
      setProfile(bundle.profile || SEED.profile);
      setSettings(bundle.settings || SEED.settings);
      setStats(bundle.stats || SEED.stats);
      setProjects(Array.isArray(proj) && proj.length ? proj : SEED.projects);
      setAchievements(Array.isArray(ach) && ach.length ? ach : SEED.achievements);
      setSkills(Array.isArray(sk) && sk.length ? sk : SEED.skills);
    } catch {
      applySeed({ setProfile, setSettings, setStats, setProjects, setAchievements, setSkills });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    api.pingView().catch(() => {});
  }, [refresh]);

  useEffect(() => {
    if (settings?.siteTitle) document.title = settings.siteTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (settings?.siteDescription && desc) desc.setAttribute('content', settings.siteDescription);
  }, [settings]);

  const value = useMemo(
    () => ({
      profile,
      settings,
      stats,
      projects,
      achievements,
      skills,
      loading,
      error,
      refresh,
      setProjects,
      setAchievements,
      setSkills,
      setProfile,
      setSettings,
    }),
    [profile, settings, stats, projects, achievements, skills, loading, error, refresh],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
