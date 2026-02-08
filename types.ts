
export type Language = 'en' | 'ar' | 'fr';

export interface Translation {
  navAbout: string;
  navFields: string;
  navFeatures: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtn: string;
  aboutTitle: string;
  aboutText: string;
  fieldsTitle: string;
  platformsTitle: string;
  featuresTitle: string;
  aiTitle: string;
  aiPlaceholder: string;
  aiGenerate: string;
  aiResultTitle: string;
  professionLabel: string;
  goalLabel: string;
  footerDev: string;
  footerCoach: string;
  whatsappTooltip: string;
}

export interface Profession {
  id: string;
  names: Record<Language, string>;
}
