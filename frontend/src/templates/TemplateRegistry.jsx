import React from 'react';
import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeTemplate from './CreativeTemplate';
import DeveloperTemplate from './DeveloperTemplate';
import PlainTemplate from './PlainTemplate';
import BlueWhiteTemplate from './BlueWhiteTemplate';

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean two-column layout with vibrant blue accents.',
    badge: 'Popular',
    component: ModernTemplate
  },
  {
    id: 'blue-white',
    name: 'Blue & White Elegance',
    description: 'Professional dual-tone blue header banner with crisp white body.',
    badge: 'Blue & White',
    component: BlueWhiteTemplate
  },
  {
    id: 'plain',
    name: 'Plain Classic',
    description: 'Ultra-clean high contrast plain text template for 100% ATS parsing.',
    badge: 'Plain Text',
    component: PlainTemplate
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional corporate layout ideal for business & finance.',
    badge: 'ATS Classic',
    component: ProfessionalTemplate
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean single column optimized for high ATS readability.',
    badge: '100% ATS Friendly',
    component: MinimalTemplate
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium dark header banner layout for senior leaders.',
    badge: 'Executive',
    component: ExecutiveTemplate
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern visual layout with gradient header and side badges.',
    badge: 'Design & Marketing',
    component: CreativeTemplate
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Tech-focused monospace layout highlighting code stack & GitHub.',
    badge: 'Tech & Engineering',
    component: DeveloperTemplate
  }
];

export default function ResumeTemplateRenderer({ templateId = 'modern', data }) {
  const selected = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const Component = selected.component;
  return <Component data={data} />;
}
