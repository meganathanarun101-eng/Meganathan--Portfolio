import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Briefcase,
  CheckCircle,
  Eye,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Twitter,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageUploader } from '../components/common/ImageUploader';
import { useAdminData } from '../context/AdminDataContext';
import { ProfileData } from '../types/portfolio';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  professionalTitle: z.string().min(3, 'Professional Title is required'),
  shortBio: z.string().min(10, 'Short Bio must be at least 10 characters'),
  aboutMe: z.string().min(20, 'About Me must be at least 20 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),
  avatarUrl: z.string().min(1, 'Profile image is required'),
  resumeUrl: z.string().min(1, 'Resume URL is required'),
  availabilityStatus: z.enum(['available', 'busy', 'open_to_offers']),
  github: z.string().url('Enter a valid GitHub URL'),
  linkedin: z.string().url('Enter a valid LinkedIn URL'),
  instagram: z.string().url('Enter a valid Instagram URL'),
  twitter: z.string().url('Enter a valid Twitter URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const { profile, updateProfile } = useAdminData();
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      professionalTitle: profile.professionalTitle,
      shortBio: profile.shortBio,
      aboutMe: profile.aboutMe,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      avatarUrl: profile.avatarUrl,
      resumeUrl: profile.resumeUrl,
      availabilityStatus: profile.availabilityStatus,
      github: profile.socialLinks.github,
      linkedin: profile.socialLinks.linkedin,
      instagram: profile.socialLinks.instagram,
      twitter: profile.socialLinks.twitter ?? '',
    },
  });

  const watchedAvatar = watch('avatarUrl');
  const watchedValues = watch();

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updated: ProfileData = {
      ...profile,
      fullName: data.fullName,
      professionalTitle: data.professionalTitle,
      shortBio: data.shortBio,
      aboutMe: data.aboutMe,
      email: data.email,
      phone: data.phone,
      location: data.location,
      avatarUrl: data.avatarUrl,
      resumeUrl: data.resumeUrl,
      availabilityStatus: data.availabilityStatus,
      socialLinks: {
        github: data.github,
        linkedin: data.linkedin,
        instagram: data.instagram,
        twitter: data.twitter || undefined,
      },
    };

    updateProfile(updated);
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Profile &amp; Biography
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information, contact credentials, bio, and social presence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="gap-2 rounded-xl border-white/10"
          >
            <Eye className="h-4 w-4" /> Live Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || saving}
            onClick={() => reset()}
            className="rounded-xl border-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Photo & Availability */}
          <div className="space-y-6 lg:col-span-1">
            {/* Image Card */}
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile Portrait
              </Label>
              <ImageUploader
                value={watchedAvatar}
                onChange={(url) => setValue('avatarUrl', url, { shouldDirty: true })}
                label="Profile Picture"
              />
              {errors.avatarUrl && (
                <p className="text-xs text-rose-400">{errors.avatarUrl.message}</p>
              )}
            </div>

            {/* Availability Status Card */}
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Work Availability
              </Label>
              <div className="space-y-2">
                {[
                  { id: 'available', label: 'Available for work', desc: 'Ready for freelance & full-time' },
                  { id: 'busy', label: 'Currently busy', desc: 'Under heavy project load' },
                  { id: 'open_to_offers', label: 'Open to offers', desc: 'Selective discussions only' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                      watchedValues.availabilityStatus === item.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <input
                      type="radio"
                      value={item.id}
                      {...register('availabilityStatus')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.label}</p>
                      <p className="text-[0.65rem] text-muted-foreground">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Bio */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Details */}
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
              <h3 className="font-display text-base font-bold text-foreground">Primary Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-400">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalTitle" className="text-xs">Professional Title</Label>
                  <Input
                    id="professionalTitle"
                    {...register('professionalTitle')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.professionalTitle && (
                    <p className="text-xs text-rose-400">{errors.professionalTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="location" className="text-xs">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.location && (
                    <p className="text-xs text-rose-400">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bios */}
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
              <h3 className="font-display text-base font-bold text-foreground">Biography &amp; Narrative</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shortBio" className="text-xs">Short Hero Subtitle (1-2 sentences)</Label>
                  <Input
                    id="shortBio"
                    {...register('shortBio')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.shortBio && (
                    <p className="text-xs text-rose-400">{errors.shortBio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutMe" className="text-xs">About Me Narrative (Main Section)</Label>
                  <Textarea
                    id="aboutMe"
                    rows={6}
                    {...register('aboutMe')}
                    className="rounded-2xl border-white/10 bg-white/[0.03] text-sm leading-relaxed"
                  />
                  {errors.aboutMe && (
                    <p className="text-xs text-rose-400">{errors.aboutMe.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
              <h3 className="font-display text-base font-bold text-foreground">Social &amp; Developer Links</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-xs flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5 text-primary" /> GitHub URL
                  </Label>
                  <Input
                    id="github"
                    {...register('github')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.github && (
                    <p className="text-xs text-rose-400">{errors.github.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-xs flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    {...register('linkedin')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.linkedin && (
                    <p className="text-xs text-rose-400">{errors.linkedin.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-xs flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-primary" /> Instagram URL
                  </Label>
                  <Input
                    id="instagram"
                    {...register('instagram')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                  {errors.instagram && (
                    <p className="text-xs text-rose-400">{errors.instagram.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-xs flex items-center gap-1.5">
                    <Twitter className="h-3.5 w-3.5 text-primary" /> Twitter / X URL (Optional)
                  </Label>
                  <Input
                    id="twitter"
                    {...register('twitter')}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl border-white/10 bg-card/95 p-6 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              Portfolio Profile Preview
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <img
                src={watchedAvatar || '/assets/profile.jpg'}
                alt={watchedValues.fullName}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-primary/50 shadow-xl"
              />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {watchedValues.fullName}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {watchedValues.professionalTitle}
                </p>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
                  <MapPin className="h-3 w-3" /> {watchedValues.location}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {watchedValues.aboutMe}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> {watchedValues.availabilityStatus}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
