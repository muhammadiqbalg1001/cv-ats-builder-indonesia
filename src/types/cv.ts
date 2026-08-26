export type EducationLevel = 'S1' | 'SMA/SMK';
export type SocialType = 'Github' | 'Instagram' | 'X' | 'Dribbble' | 'Behance';

export interface CVData {
  personal: {
    fullName: string;
    position: string;
    photoUrl: string;
    domicile: string;
    phone: string;
    email: string;
    linkedin: string;
    socialType: SocialType;
    socialLink: string;
    portfolio: string;
    summary: string;
  };
  experience: {
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    id: string;
    level: EducationLevel;
    major: string;
    faculty: string;
    degree: string;
    gpaOrNem: string;
    institution: string;
    documentLink: string;
    description: string;
  }[];
  certifications: {
    id: string;
    name: string;
    credentialLink: string;
    issueDate: string;
    expiryDate: string;
    organization: string;
    description: string;
  }[];
  skills: {
    main: string;
    others: string;
    languages: string;
  };
}