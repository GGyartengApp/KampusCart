import React from 'react';

export default function ProductIllustration({ art = 'sneaker', color = '#18181b', accent = '#f58220', size = 120 }) {
  const s = size;

  if (art === 'headphones') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="56" fill={color} fillOpacity="0.09" />
        <path
          d="M32 76C32 52 48 34 70 34C92 34 108 52 108 76"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <rect x="22" y="68" width="20" height="36" rx="10" fill={accent} />
        <rect x="98" y="68" width="20" height="36" rx="10" fill={accent} />
        <rect x="27" y="74" width="10" height="24" rx="5" fill="#fff" fillOpacity="0.4" />
        <rect x="103" y="74" width="10" height="24" rx="5" fill="#fff" fillOpacity="0.4" />
      </svg>
    );
  }

  if (art === 'sneaker') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="74" r="54" fill={color} fillOpacity="0.08" />
        <path
          d="M22 88C24 72 34 62 46 62L62 46C66 56 76 62 88 64L114 74C120 77 122 84 120 92H22V88Z"
          fill={color}
        />
        <path d="M20 92H122V101C122 104 119 106 116 106H24C21 106 20 103 20 100V92Z" fill="#ffffff" stroke={color} strokeWidth="2.5" />
        <path d="M52 72L78 65" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <path d="M56 80L84 73" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (art === 'laptop') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill={color} fillOpacity="0.08" />
        <rect x="28" y="38" width="84" height="54" rx="8" fill={color} />
        <rect x="34" y="44" width="72" height="42" rx="4" fill="#e0f2fe" />
        <path d="M44 74L60 58L72 68L92 50" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 96H122L114 106H26L18 96Z" fill="#334155" />
      </svg>
    );
  }

  if (art === 'food') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill={accent} fillOpacity="0.12" />
        <path d="M28 70H112C112 94 94 108 70 108C46 108 28 94 28 70Z" fill={color} />
        <circle cx="52" cy="60" r="12" fill={accent} />
        <circle cx="74" cy="54" r="14" fill="#22c55e" />
        <circle cx="92" cy="62" r="10" fill="#facc15" />
        <rect x="48" y="106" width="44" height="7" rx="3.5" fill="#1e293b" />
      </svg>
    );
  }

  if (art === 'tutoring') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill={color} fillOpacity="0.09" />
        <rect x="34" y="30" width="68" height="82" rx="10" fill={color} />
        <rect x="42" y="38" width="52" height="66" rx="6" fill="#ffffff" />
        <path d="M50 54H84M50 66H84M50 78H72" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="98" cy="94" r="16" fill={accent} />
        <path d="M92 94L96 98L105 89" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (art === 'printing') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill={color} fillOpacity="0.08" />
        <rect x="40" y="28" width="60" height="28" rx="4" fill="#e2e8f0" />
        <rect x="24" y="50" width="92" height="42" rx="10" fill={color} />
        <rect x="40" y="76" width="60" height="36" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="98" cy="62" r="4" fill={accent} />
        <path d="M50 88H90M50 98H80" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (art === 'shirt') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="54" fill={color} fillOpacity="0.09" />
        <path
          d="M44 34L22 52L34 66L44 58V110H96V58L106 66L118 52L96 34L82 40C75 44 65 44 58 40L44 34Z"
          fill={color}
        />
        <path d="M58 40C65 46 75 46 82 40" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <rect x="54" y="64" width="32" height="10" rx="5" fill={accent} />
      </svg>
    );
  }

  if (art === 'bag') {
    return (
      <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="72" r="54" fill={accent} fillOpacity="0.12" />
        <path d="M50 52V42C50 31 59 24 70 24C81 24 90 31 90 42V52" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <rect x="32" y="50" width="76" height="62" rx="12" fill={color} />
        <rect x="44" y="64" width="52" height="14" rx="7" fill={accent} />
      </svg>
    );
  }

  // services / default
  return (
    <svg width={s} height={s} viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <circle cx="70" cy="70" r="54" fill={color} fillOpacity="0.1" />
      <rect x="34" y="38" width="72" height="64" rx="14" fill={color} />
      <circle cx="70" cy="70" r="18" fill={accent} />
      <path d="M63 70L68 75L78 65" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
