import React from 'react';

export const WorldMapBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Deep Midnight Cosmic Navy Base Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, #0f1938 0%, #090e24 55%, #050716 100%)',
        }}
      />

      {/* 2. Soft Ambient Atmospheric Illumination for Center Flag Contrast */}
      <div
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-[80px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(99, 102, 241, 0.12) 45%, transparent 70%)',
        }}
      />

      {/* 3. Subtle Digital Coordinate Grid Pattern (Latitude/Longitude Nodes) */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 4. Main Vector World Map System */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Continent Gradient: Premium deep indigo to navy */}
          <linearGradient id="continentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2c56" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#141e3d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0f1730" stopOpacity="0.45" />
          </linearGradient>

          {/* Glowing Beacon Radial Gradient */}
          <radialGradient id="beaconGlowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="beaconGlowAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Flight route gradient */}
          <linearGradient id="routeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* --- GEOGRAPHICAL GRATICULE (Latitude & Longitude Grid) --- */}
        <g opacity="0.22" stroke="#38bdf8" strokeWidth="0.8">
          {/* Parallels (Latitudes) */}
          <line x1="0" y1="200" x2="800" y2="200" strokeDasharray="3 4" />
          <line x1="0" y1="350" x2="800" y2="350" strokeDasharray="2 4" />
          {/* Equator (Highlighted) */}
          <line x1="0" y1="520" x2="800" y2="520" stroke="#38bdf8" strokeWidth="1.2" opacity="0.45" />
          <line x1="0" y1="690" x2="800" y2="690" strokeDasharray="2 4" />
          <line x1="0" y1="840" x2="800" y2="840" strokeDasharray="3 4" />
          <line x1="0" y1="990" x2="800" y2="990" strokeDasharray="4 4" />

          {/* Meridians (Longitudes) */}
          <line x1="120" y1="0" x2="120" y2="1200" strokeDasharray="2 5" />
          <line x1="260" y1="0" x2="260" y2="1200" strokeDasharray="2 5" />
          {/* Prime Meridian (Highlighted) */}
          <line x1="400" y1="0" x2="400" y2="1200" stroke="#38bdf8" strokeWidth="1.2" opacity="0.45" />
          <line x1="540" y1="0" x2="540" y2="1200" strokeDasharray="2 5" />
          <line x1="680" y1="0" x2="680" y2="1200" strokeDasharray="2 5" />

          {/* Radar Geographic Concentric Target Rings */}
          <circle cx="400" cy="520" r="180" fill="none" strokeDasharray="4 6" opacity="0.35" />
          <circle cx="400" cy="520" r="320" fill="none" strokeDasharray="6 8" opacity="0.25" />
          <circle cx="400" cy="520" r="480" fill="none" strokeDasharray="8 10" opacity="0.15" />
        </g>

        {/* --- CONTINENTS (Clean Modern Stylized Vector Outlines & Fills) --- */}
        <g
          fill="url(#continentGrad)"
          stroke="#38bdf8"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.85"
        >
          {/* NORTH AMERICA */}
          {/* Alaska & Canada & US Mainland & Mexico */}
          <path
            d="
              M 110 240
              Q 150 210, 210 220
              T 280 230
              Q 310 250, 310 290
              T 270 340
              Q 260 380, 240 400
              L 210 430
              Q 190 470, 180 500
              L 160 480
              Q 150 440, 130 400
              T 100 340
              Q 90 280, 110 240
              Z
            "
          />
          {/* Greenland */}
          <path
            d="
              M 300 170
              Q 340 160, 360 190
              T 330 240
              Q 290 220, 300 170
              Z
            "
          />
          {/* Caribbean Arc Islands */}
          <circle cx="230" cy="460" r="3.5" fill="#38bdf8" />
          <circle cx="245" cy="470" r="3" fill="#38bdf8" />
          <circle cx="260" cy="480" r="3.5" fill="#38bdf8" />

          {/* SOUTH AMERICA */}
          <path
            d="
              M 220 520
              Q 260 520, 280 550
              T 290 620
              Q 280 690, 260 740
              L 240 800
              Q 230 840, 220 860
              T 210 820
              Q 200 740, 200 680
              T 190 580
              Q 200 540, 220 520
              Z
            "
          />

          {/* EUROPE */}
          {/* Scandinavia, British Isles, Western & Eastern Europe */}
          <path
            d="
              M 390 250
              Q 410 220, 440 230
              T 460 280
              Q 440 300, 450 330
              T 430 370
              Q 390 380, 370 360
              T 370 300
              Q 380 270, 390 250
              Z
            "
          />
          {/* British Isles */}
          <path
            d="
              M 350 270
              Q 365 260, 370 280
              T 360 310
              Q 345 300, 350 270
              Z
            "
          />

          {/* AFRICA */}
          <path
            d="
              M 370 410
              Q 430 400, 470 430
              T 490 500
              Q 480 570, 460 630
              T 440 700
              Q 430 740, 410 760
              T 390 730
              Q 370 660, 360 580
              T 340 500
              Q 350 440, 370 410
              Z
            "
          />
          {/* Madagascar */}
          <path
            d="
              M 480 660
              Q 490 650, 495 680
              T 485 710
              Q 475 690, 480 660
              Z
            "
          />

          {/* ASIA */}
          {/* Middle East, India, Russia, East Asia, Southeast Asia */}
          <path
            d="
              M 470 250
              Q 560 230, 660 250
              T 710 320
              Q 690 380, 680 430
              T 640 480
              Q 600 500, 580 540
              L 540 540
              Q 520 490, 500 450
              T 460 410
              Q 450 340, 460 290
              T 470 250
              Z
            "
          />
          {/* Indian Subcontinent Triangle */}
          <path
            d="
              M 525 450
              Q 560 470, 565 520
              L 545 565
              Q 530 540, 515 490
              Z
            "
          />
          {/* Japan Arch */}
          <path
            d="
              M 700 350
              Q 715 370, 710 400
              T 695 420
              Q 690 390, 700 350
              Z
            "
          />
          {/* Southeast Asian Archipelago (Indonesia/Philippines) */}
          <ellipse cx="630" cy="550" rx="20" ry="6" />
          <ellipse cx="660" cy="570" rx="15" ry="5" />
          <ellipse cx="610" cy="580" rx="14" ry="4" />

          {/* AUSTRALIA & OCEANIA */}
          <path
            d="
              M 640 680
              Q 700 660, 730 700
              T 720 780
              Q 680 810, 630 800
              T 610 740
              Q 615 700, 640 680
              Z
            "
          />
          {/* New Zealand */}
          <path
            d="
              M 750 780
              Q 760 790, 755 820
              T 745 840
              Z
            "
          />
        </g>

        {/* --- GEODESIC INTERCONTINENTAL CONNECTION ARCS (Flight & Capital Links) --- */}
        <g fill="none" strokeWidth="1.5" opacity="0.6">
          {/* London to New York Route */}
          <path
            d="M 370 290 Q 280 260 200 340"
            stroke="url(#routeGrad1)"
            strokeDasharray="4 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-36"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>

          {/* London to Tokyo Route */}
          <path
            d="M 370 290 Q 530 190 700 370"
            stroke="url(#routeGrad1)"
            strokeDasharray="4 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-36"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>

          {/* New York to Brasilia Route */}
          <path
            d="M 200 340 Q 230 460 250 640"
            stroke="url(#routeGrad1)"
            strokeDasharray="4 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-36"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Cairo to Sydney Route */}
          <path
            d="M 430 430 Q 560 590 680 750"
            stroke="url(#routeGrad1)"
            strokeDasharray="4 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-36"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* --- PULSING CAPITAL BEACONS (World Geo-Hubs) --- */}
        <g>
          {/* London (UK) */}
          <g transform="translate(370, 290)">
            <circle cx="0" cy="0" r="14" fill="url(#beaconGlowCyan)">
              <animate attributeName="r" values="6;16;6" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Washington / New York */}
          <g transform="translate(200, 340)">
            <circle cx="0" cy="0" r="14" fill="url(#beaconGlowCyan)">
              <animate attributeName="r" values="6;16;6" dur="3.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Tokyo (Japan) */}
          <g transform="translate(700, 370)">
            <circle cx="0" cy="0" r="16" fill="url(#beaconGlowAmber)">
              <animate attributeName="r" values="6;18;6" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#fbbf24" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Cairo (Egypt) */}
          <g transform="translate(430, 430)">
            <circle cx="0" cy="0" r="12" fill="url(#beaconGlowCyan)">
              <animate attributeName="r" values="5;14;5" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />
          </g>

          {/* Brasilia (Brazil) */}
          <g transform="translate(250, 640)">
            <circle cx="0" cy="0" r="14" fill="url(#beaconGlowAmber)">
              <animate attributeName="r" values="5;15;5" dur="3.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#fbbf24" />
          </g>

          {/* Sydney / Canberra (Australia) */}
          <g transform="translate(680, 750)">
            <circle cx="0" cy="0" r="14" fill="url(#beaconGlowCyan)">
              <animate attributeName="r" values="5;15;5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
          </g>

          {/* Dhaka / South Asia Hub */}
          <g transform="translate(545, 475)">
            <circle cx="0" cy="0" r="14" fill="url(#beaconGlowAmber)">
              <animate attributeName="r" values="6;16;6" dur="2.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3.5" fill="#fbbf24" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>
        </g>

        {/* --- HIGH-TECH TELEMETRY & COORDINATE MARKS --- */}
        <g fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="700" opacity="0.35">
          <text x="35" y="515">EQUATOR 00°00′</text>
          <text x="35" y="345">TROPIC OF CANCER 23°26′N</text>
          <text x="35" y="685">TROPIC OF CAPRICORN 23°26′S</text>
          <text x="395" y="1150" textAnchor="middle">PRIME MERIDIAN 00°00′</text>
          <text x="680" y="1150" textAnchor="middle">120°E</text>
          <text x="120" y="1150" textAnchor="middle">120°W</text>
        </g>

        {/* Compass Rose Accent Top-Right */}
        <g transform="translate(720, 80)" opacity="0.4">
          <circle cx="0" cy="0" r="24" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="-28" x2="0" y2="28" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="-28" y1="0" x2="28" y2="0" stroke="#38bdf8" strokeWidth="1.2" />
          <polygon points="0,-24 4,-8 -4,-8" fill="#38bdf8" />
          <text x="0" y="-32" fill="#38bdf8" fontSize="9" fontWeight="900" textAnchor="middle">N</text>
        </g>

        {/* Global Cartography HUD Label Top-Left */}
        <g transform="translate(40, 80)" opacity="0.45">
          <rect x="0" y="0" width="160" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="80" y="14" fill="#38bdf8" fontSize="8.5" fontWeight="900" textAnchor="middle" letterSpacing="1">
            WORLD ATLAS • GPS GRID
          </text>
        </g>
      </svg>

      {/* 5. Clean Edge Vignette Overlay (Dark luxury fade to frame edges) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(6, 10, 24, 0.7) 80%, rgba(5, 8, 20, 0.95) 100%)',
        }}
      />
    </div>
  );
};
