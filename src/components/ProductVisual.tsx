import React from 'react';
import Image from 'next/image';

interface Props {
  slug: string;
  category: string;
  className?: string;
  children?: React.ReactNode;
  emoji?: string;
  /** Real product preview image (basePath-relative). When set, it replaces the SVG mockup. */
  image?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; accent: string; light: string }> = {
  communication: { bg: '#E8F4FB', accent: '#0077B6', light: '#B8DFF0' },
  affichage:     { bg: '#FDEEED', accent: '#E94B3C', light: '#F8BBB7' },
  evenementiel:  { bg: '#E6F4F0', accent: '#43AA8B', light: '#A8DBCF' },
  papeterie:     { bg: '#FEF9E7', accent: '#D4A017', light: '#F4D98A' },
  packaging:     { bg: '#F0EBF8', accent: '#7B5EA7', light: '#C9B8E8' },
  goodies:       { bg: '#FEF0E6', accent: '#E8740C', light: '#F9C090' },
};

function CardeMockup({ accent, light }: { accent: string; light: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute" style={{ transform: 'rotate(8deg) translate(12px,6px)', width: 120, height: 72, borderRadius: 8, background: light, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
      <div className="absolute" style={{ transform: 'rotate(3deg) translate(4px,2px)', width: 120, height: 72, borderRadius: 8, background: '#F5F5F5', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
      <div className="relative" style={{ width: 120, height: 72, borderRadius: 8, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
        <div style={{ height: 20, background: accent, borderRadius: '8px 8px 0 0' }} />
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, width: '70%' }} />
          <div style={{ height: 4, background: '#E5E7EB', borderRadius: 3, width: '50%' }} />
          <div style={{ height: 4, background: '#E5E7EB', borderRadius: 3, width: '60%' }} />
        </div>
      </div>
    </div>
  );
}

function FlyerMockup({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute" style={{ transform: 'rotate(-4deg) translate(-8px,6px)', width: 88, height: 124, borderRadius: 6, background: '#F0F0F0', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
      <div style={{ width: 88, height: 124, borderRadius: 6, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.14)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: 44, background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)` }}>
          <div style={{ margin: '8px 10px', height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 3, width: '75%' }} />
          <div style={{ margin: '4px 10px', height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 3, width: '55%' }} />
        </div>
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '90%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '80%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '85%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '60%' }} />
          <div style={{ height: 18, background: accent, borderRadius: 4, width: '60%', marginTop: 4 }} />
        </div>
      </div>
    </div>
  );
}

function AfficheMockup({ accent, light }: { accent: string; light: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={{ width: 90, height: 120, borderRadius: 4, border: `3px solid ${accent}`, padding: 6, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
        <div style={{ width: '100%', height: 64, borderRadius: 3, background: `linear-gradient(135deg, ${light} 0%, ${accent}40 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          🎨
        </div>
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ height: 5, background: accent, borderRadius: 3, width: '80%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '60%' }} />
        </div>
      </div>
    </div>
  );
}

function BanderoleMockup({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={{ position: 'relative' }}>
        <div style={{ width: 160, height: 50, borderRadius: 4, background: `linear-gradient(90deg, ${accent} 0%, ${accent}CC 100%)`, boxShadow: '0 4px 14px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.7)', borderRadius: 3, width: '70%' }} />
          <div style={{ height: 4, background: 'rgba(255,255,255,0.45)', borderRadius: 3, width: '50%' }} />
        </div>
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
          <div key={x} style={{ position: 'absolute', top: -6, left: x, width: 2, height: 6, background: '#9CA3AF' }} />
        ))}
      </div>
    </div>
  );
}

function RollupMockup({ accent, light }: { accent: string; light: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 52, height: 112, borderRadius: '4px 4px 0 0', background: `linear-gradient(180deg, ${light} 0%, white 100%)`, border: `2px solid ${accent}30`, boxShadow: '0 4px 14px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', padding: 6, gap: 4 }}>
          <div style={{ height: 28, borderRadius: 3, background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)` }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '80%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '65%' }} />
          <div style={{ height: 4, background: '#D1D5DB', borderRadius: 3, width: '75%' }} />
        </div>
        <div style={{ width: 64, height: 8, borderRadius: '0 0 4px 4px', background: '#9CA3AF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
}

function BrochureMockup({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={{ display: 'flex', gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 44, height: 62, borderRadius: 2, background: i === 0 ? `linear-gradient(180deg, ${accent} 30%, white 100%)` : 'white', border: `1px solid ${accent}30`, boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', padding: 4, gap: 3 }}>
            {i === 0 && <div style={{ height: 16, background: accent, borderRadius: 1, margin: '-4px -4px 4px -4px' }} />}
            <div style={{ height: 3, background: i === 0 ? 'rgba(255,255,255,0.7)' : '#D1D5DB', borderRadius: 2 }} />
            <div style={{ height: 3, background: i === 0 ? 'rgba(255,255,255,0.5)' : '#D1D5DB', borderRadius: 2, width: '75%' }} />
            <div style={{ height: 3, background: '#D1D5DB', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericMockup({ accent, light, emoji }: { accent: string; light: string; emoji: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={{ width: 100, height: 100, borderRadius: 16, background: `linear-gradient(135deg, ${light} 0%, ${accent}20 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: `0 8px 24px ${accent}30` }}>
        {emoji}
      </div>
    </div>
  );
}

const PRODUCT_EMOJIS: Record<string, string> = {
  'papeterie-entreprise': '✉️',
  'autocollants-stickers': '🏷️',
  'cartes-postales': '💌',
  'calendriers': '📅',
  'tshirts-personnalises': '👕',
  'mugs-personnalises': '☕',
};

export default function ProductVisual({ slug, category, className = '', children, emoji, image }: Props) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.communication;

  // Real Préscript preview image takes priority over the SVG mockup.
  if (image) {
    // next/image (unoptimized) does NOT prepend basePath, so public/ assets must
    // be prefixed manually to resolve under the GitHub Pages subpath.
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const src = image.startsWith('/') ? `${base}${image}` : image;
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-white ${className}`}>
        <Image src={src} alt={slug} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-3" unoptimized />
        {children}
      </div>
    );
  }

  let inner: React.ReactNode;
  switch (slug) {
    case 'cartes-de-visite':
      inner = <CardeMockup accent={colors.accent} light={colors.light} />;
      break;
    case 'flyers-tracts':
      inner = <FlyerMockup accent={colors.accent} />;
      break;
    case 'affiches-posters':
      inner = <AfficheMockup accent={colors.accent} light={colors.light} />;
      break;
    case 'banderoles':
      inner = <BanderoleMockup accent={colors.accent} />;
      break;
    case 'roll-up-kakemono':
      inner = <RollupMockup accent={colors.accent} light={colors.light} />;
      break;
    case 'brochures-depliants':
      inner = <BrochureMockup accent={colors.accent} />;
      break;
    default:
      inner = <GenericMockup accent={colors.accent} light={colors.light} emoji={emoji ?? PRODUCT_EMOJIS[slug] ?? '🖨️'} />;
  }

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: `radial-gradient(ellipse at 60% 40%, ${colors.light}80 0%, ${colors.bg} 70%)` }}
    >
      {inner}
      {children}
    </div>
  );
}
