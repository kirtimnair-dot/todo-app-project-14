export function LoginSunsetBackdrop() {
  return (
    <svg
      viewBox="0 0 520 620"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sunsetSky" x1="260" y1="0" x2="260" y2="540" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#dc5a0c" />
          <stop offset="30%" stopColor="#f37c1e" />
          <stop offset="62%" stopColor="#faa44c" />
          <stop offset="100%" stopColor="#fde0b6" />
        </linearGradient>
        <radialGradient id="sunsetGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(295 320) rotate(90) scale(210 250)">
          <stop stopColor="#fff7dd" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffc374" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff7b24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ridgeFar" x1="260" y1="315" x2="260" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c47852" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#854933" stopOpacity="0.74" />
        </linearGradient>
        <linearGradient id="ridgeMid" x1="260" y1="365" x2="260" y2="540" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6c392b" stopOpacity="0.84" />
          <stop offset="100%" stopColor="#3c1e16" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="rockCliff" x1="160" y1="440" x2="220" y2="620" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a1b16" />
          <stop offset="100%" stopColor="#120b09" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="520" height="620" fill="url(#sunsetSky)" />
      <rect width="520" height="620" fill="url(#sunsetGlow)" />

      {/* Warm Sun Disc */}
      <circle cx="295" cy="316" r="46" fill="#fff6d6" fillOpacity="0.75" />
      <circle cx="295" cy="316" r="78" fill="#ffe1a8" fillOpacity="0.22" />

      {/* Soft distant clouds */}
      <ellipse cx="140" cy="145" rx="165" ry="28" fill="#ffb877" fillOpacity="0.22" />
      <ellipse cx="380" cy="215" rx="180" ry="24" fill="#ffd5a6" fillOpacity="0.2" />

      {/* Distant sunlit mountain ridge */}
      <path
        d="M-20 400L72 342L152 374L244 330L342 368L438 334L540 388V520H-20V400Z"
        fill="url(#ridgeFar)"
      />

      {/* Mid misty mountain ridge */}
      <path
        d="M-20 442L60 398L142 426L230 378L318 418L422 372L540 434V570H-20V442Z"
        fill="url(#ridgeMid)"
      />

      {/* Valley mist */}
      <ellipse cx="290" cy="450" rx="280" ry="38" fill="#fbd1a2" fillOpacity="0.32" />

      {/* Right foreground slope */}
      <path
        d="M270 545L395 478L540 508V620H240L270 545Z"
        fill="#1f1411"
        fillOpacity="0.94"
      />

      {/* Left foreground rock outcrop */}
      <path
        d="M-10 495L88 470L178 468L244 494L305 552L345 620H-10V495Z"
        fill="url(#rockCliff)"
      />
      <path
        d="M88 470L178 468L220 486L155 496L92 488Z"
        fill="#54362b"
        fillOpacity="0.65"
      />

      {/* Seated traveler silhouette looking at horizon */}
      <g fill="#100a08">
        <path d="M168 416C174 414 185 418 190 428L195 456L164 462L156 440C156 428 161 418 168 416Z" />
        <rect x="148" y="422" width="16" height="28" rx="6" transform="rotate(-10 148 422)" />
        <circle cx="179" cy="404" r="10.5" />
        <path d="M174 454L202 452C208 452 212 456 213 463L216 485H204L200 467L174 468Z" />
        <path d="M184 428L204 446L199 452L178 436Z" />
      </g>
    </svg>
  );
}

export function StayProductiveIllustration() {
  return (
    <svg
      viewBox="0 0 260 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 sm:w-56 h-auto select-none shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clipBoardWood" x1="115" y1="22" x2="215" y2="155" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7cc9f" />
          <stop offset="1" stopColor="#de9f6b" />
        </linearGradient>
        <linearGradient id="stayPot" x1="60" y1="118" x2="96" y2="158" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2b274" />
          <stop offset="1" stopColor="#c77030" />
        </linearGradient>
      </defs>

      <ellipse cx="136" cy="158" rx="92" ry="11" fill="#e5baa0" fillOpacity="0.38" />

      {/* Green Potted Plant */}
      <g>
        <path d="M74 120C68 94 52 76 34 72C48 90 58 104 68 120H74Z" fill="#2d7a36" />
        <path d="M76 120C76 90 80 64 94 46C96 72 88 98 82 120H76Z" fill="#1b5e24" />
        <path d="M80 120C90 96 104 82 118 78C104 96 92 108 85 120H80Z" fill="#3b9445" />
        <path d="M70 120C58 102 44 98 28 102C44 110 56 114 65 120H70Z" fill="#46a350" />
        <path d="M56 118H96L90 152C89 156 86 158 82 158H70C66 158 63 156 62 152L56 118Z" fill="url(#stayPot)" />
        <rect x="53" y="114" width="46" height="7" rx="3.5" fill="#f5bc83" />
      </g>

      {/* Clipboard */}
      <g transform="rotate(-7 166 92)">
        <rect x="114" y="22" width="104" height="136" rx="14" fill="url(#clipBoardWood)" />
        <rect x="124" y="34" width="84" height="114" rx="8" fill="#ffffff" />
        <rect x="148" y="12" width="36" height="18" rx="5" fill="#5e5751" />
        <circle cx="166" cy="17" r="3" fill="#fff3e6" />

        <rect x="135" y="52" width="17" height="17" rx="4" fill="#ff6b00" />
        <path d="M139 60.5L142 63.5L148 57.5" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="159" y="56" width="38" height="4.5" rx="2.25" fill="#d9cfc5" />
        <rect x="159" y="64" width="24" height="3.5" rx="1.75" fill="#ece4dc" />

        <rect x="135" y="80" width="17" height="17" rx="4" fill="#ff6b00" />
        <path d="M139 88.5L142 91.5L148 85.5" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="159" y="84" width="36" height="4.5" rx="2.25" fill="#d9cfc5" />
        <rect x="159" y="92" width="28" height="3.5" rx="1.75" fill="#ece4dc" />

        <rect x="135" y="108" width="17" height="17" rx="4" fill="#16a34a" />
        <path d="M139 116.5L142 119.5L148 113.5" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="159" y="112" width="38" height="4.5" rx="2.25" fill="#d9cfc5" />
        <rect x="159" y="120" width="20" height="3.5" rx="1.75" fill="#ece4dc" />
      </g>
    </svg>
  );
}
