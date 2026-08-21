import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Domain Finder - Find the Perfect Startup Name';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#a5b4fc',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Domain Finder
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Find the best name and digital identity you can realistically own.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 24,
            color: '#c7d2fe',
            textAlign: 'center',
          }}
        >
          AI names - Domain checks - Brand scores - Honest recommendations
        </div>
      </div>
    ),
    { ...size }
  );
}
