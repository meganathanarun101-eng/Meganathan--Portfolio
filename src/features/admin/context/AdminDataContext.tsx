import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import {
  PortfolioDataStore,
  portfolioDataService,
} from '../services/portfolioDataService';
import {
  ProjectItem,
  SkillItem,
  EducationItem,
  ExperienceItem,
  ServiceItem,
  CertificateItem,
  AchievementItem,
  ResumeVersion,
  BlogPostItem,
  TestimonialItem,
  ProfileData,
  SiteSettings,
} from '../types/portfolio';
import { ContactMessage, AdminNotification } from '../types/messages';

interface AdminDataContextType extends PortfolioDataStore {
  refreshData: () => void;
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;

  // Projects
  saveProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;

  // Skills
  saveSkill: (skill: SkillItem) => void;
  deleteSkill: (id: string) => void;

  // Education
  saveEducation: (edu: EducationItem) => void;
  deleteEducation: (id: string) => void;

  // Experience
  saveExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;

  // Services
  saveService: (srv: ServiceItem) => void;
  deleteService: (id: string) => void;

  // Certificates
  saveCertificate: (cert: CertificateItem) => void;
  deleteCertificate: (id: string) => void;

  // Achievements
  saveAchievement: (ach: AchievementItem) => void;
  deleteAchievement: (id: string) => void;

  // Resume
  saveResume: (res: ResumeVersion) => void;
  setActiveResume: (id: string) => void;
  deleteResume: (id: string) => void;

  // Blog
  saveBlogPost: (post: BlogPostItem) => void;
  deleteBlogPost: (id: string) => void;

  // Testimonials
  saveTestimonial: (test: TestimonialItem) => void;
  deleteTestimonial: (id: string) => void;

  // Messages
  saveMessage: (msg: ContactMessage) => void;
  deleteMessage: (id: string) => void;
  replyToMessage: (id: string, replyText: string) => void;
  markMessageRead: (id: string, read: boolean) => void;
  toggleMessageStarred: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Profile & Settings
  updateProfile: (profile: ProfileData) => void;
  updateSettings: (settings: SiteSettings) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<PortfolioDataStore>(() => portfolioDataService.loadStore());

  const refreshData = useCallback(() => {
    setStore(portfolioDataService.loadStore());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('portfolio_store_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('portfolio_store_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);

  // Reset
  const resetToDefaults = () => {
    const fresh = portfolioDataService.resetDefaults();
    setStore(fresh);
    toast.success('Portfolio data successfully reset to defaults');
  };

  const exportJSON = () => {
    return portfolioDataService.exportJSON();
  };

  const importJSON = (jsonStr: string) => {
    const success = portfolioDataService.importJSON(jsonStr);
    if (success) {
      refreshData();
      toast.success('Portfolio data imported successfully');
      return true;
    } else {
      toast.error('Failed to import JSON data. Invalid format.');
      return false;
    }
  };

  // Projects
  const saveProject = (project: ProjectItem) => {
    portfolioDataService.saveProject(project);
    refreshData();
    toast.success(`Project "${project.title}" saved successfully`);
  };

  const deleteProject = (id: string) => {
    const deleted = store.projects.find((p) => p.id === id);
    portfolioDataService.deleteProject(id);
    refreshData();
    toast.success(`Project "${deleted?.title ?? 'Item'}" deleted`);
  };

  const duplicateProject = (id: string) => {
    const orig = store.projects.find((p) => p.id === id);
    if (!orig) return;
    const duplicated: ProjectItem = {
      ...orig,
      id: `proj-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      slug: `${orig.slug}-copy`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    portfolioDataService.saveProject(duplicated);
    refreshData();
    toast.success(`Project duplicated as draft`);
  };

  // Skills
  const saveSkill = (skill: SkillItem) => {
    portfolioDataService.saveSkill(skill);
    refreshData();
    toast.success(`Skill "${skill.name}" saved`);
  };

  const deleteSkill = (id: string) => {
    portfolioDataService.deleteSkill(id);
    refreshData();
    toast.success('Skill deleted');
  };

  // Education
  const saveEducation = (edu: EducationItem) => {
    portfolioDataService.saveEducation(edu);
    refreshData();
    toast.success(`Education entry saved`);
  };

  const deleteEducation = (id: string) => {
    portfolioDataService.deleteEducation(id);
    refreshData();
    toast.success('Education record removed');
  };

  // Experience
  const saveExperience = (exp: ExperienceItem) => {
    portfolioDataService.saveExperience(exp);
    refreshData();
    toast.success(`Experience at ${exp.company} saved`);
  };

  const deleteExperience = (id: string) => {
    portfolioDataService.deleteExperience(id);
    refreshData();
    toast.success('Experience record deleted');
  };

  // Services
  const saveService = (srv: ServiceItem) => {
    portfolioDataService.saveService(srv);
    refreshData();
    toast.success(`Service "${srv.name}" saved`);
  };

  const deleteService = (id: string) => {
    portfolioDataService.deleteService(id);
    refreshData();
    toast.success('Service removed');
  };

  // Certificates
  const saveCertificate = (cert: CertificateItem) => {
    portfolioDataService.saveCertificate(cert);
    refreshData();
    toast.success(`Certificate "${cert.name}" saved`);
  };

  const deleteCertificate = (id: string) => {
    portfolioDataService.deleteCertificate(id);
    refreshData();
    toast.success('Certificate removed');
  };

  // Achievements
  const saveAchievement = (ach: AchievementItem) => {
    portfolioDataService.saveAchievement(ach);
    refreshData();
    toast.success(`Achievement "${ach.title}" saved`);
  };

  const deleteAchievement = (id: string) => {
    portfolioDataService.deleteAchievement(id);
    refreshData();
    toast.success('Achievement deleted');
  };

  // Resume
  const saveResume = (res: ResumeVersion) => {
    portfolioDataService.saveResume(res);
    refreshData();
    toast.success(`Resume version ${res.version} saved`);
  };

  const setActiveResume = (id: string) => {
    portfolioDataService.setActiveResume(id);
    refreshData();
    toast.success('Active resume version updated');
  };

  const deleteResume = (id: string) => {
    portfolioDataService.deleteResume(id);
    refreshData();
    toast.success('Resume version deleted');
  };

  // Blog
  const saveBlogPost = (post: BlogPostItem) => {
    portfolioDataService.saveBlogPost(post);
    refreshData();
    toast.success(`Blog post "${post.title}" saved`);
  };

  const deleteBlogPost = (id: string) => {
    portfolioDataService.deleteBlogPost(id);
    refreshData();
    toast.success('Blog post deleted');
  };

  // Testimonials
  const saveTestimonial = (test: TestimonialItem) => {
    portfolioDataService.saveTestimonial(test);
    refreshData();
    toast.success(`Testimonial from ${test.name} saved`);
  };

  const deleteTestimonial = (id: string) => {
    portfolioDataService.deleteTestimonial(id);
    refreshData();
    toast.success('Testimonial removed');
  };

  // Messages
  const saveMessage = (msg: ContactMessage) => {
    portfolioDataService.saveMessage(msg);
    refreshData();
    toast.success('Message updated');
  };

  const deleteMessage = (id: string) => {
    portfolioDataService.deleteMessage(id);
    refreshData();
    toast.success('Message deleted');
  };

  const replyToMessage = (id: string, replyText: string) => {
    const updated = portfolioDataService.replyToMessage(id, replyText);
    if (updated) {
      refreshData();
      toast.success('Reply recorded and dispatched');
    }
  };

  const markMessageRead = (id: string, read: boolean) => {
    const msg = store.messages.find((m) => m.id === id);
    if (!msg) return;
    portfolioDataService.saveMessage({
      ...msg,
      status: read ? 'read' : 'unread',
    });
    refreshData();
  };

  const toggleMessageStarred = (id: string) => {
    const msg = store.messages.find((m) => m.id === id);
    if (!msg) return;
    portfolioDataService.saveMessage({
      ...msg,
      starred: !msg.starred,
    });
    refreshData();
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    portfolioDataService.markNotificationRead(id);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    portfolioDataService.markAllNotificationsRead();
    refreshData();
    toast.success('All notifications marked as read');
  };

  // Profile & Settings
  const updateProfile = (profile: ProfileData) => {
    portfolioDataService.updateProfile(profile);
    refreshData();
    toast.success('Profile details updated');
  };

  const updateSettings = (settings: SiteSettings) => {
    portfolioDataService.updateSettings(settings);
    refreshData();
    toast.success('Site settings updated');
  };

  return (
    <AdminDataContext.Provider
      value={{
        ...store,
        refreshData,
        resetToDefaults,
        exportJSON,
        importJSON,
        saveProject,
        deleteProject,
        duplicateProject,
        saveSkill,
        deleteSkill,
        saveEducation,
        deleteEducation,
        saveExperience,
        deleteExperience,
        saveService,
        deleteService,
        saveCertificate,
        deleteCertificate,
        saveAchievement,
        deleteAchievement,
        saveResume,
        setActiveResume,
        deleteResume,
        saveBlogPost,
        deleteBlogPost,
        saveTestimonial,
        deleteTestimonial,
        saveMessage,
        deleteMessage,
        replyToMessage,
        markMessageRead,
        toggleMessageStarred,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        updateSettings,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
