import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Martina Rink — Private Mentoring for High-Achieving Women'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F3EE',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Top hairline */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: '#C8B8A2',
          }}
        />

        {/* Bottom hairline */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: '#C8B8A2',
          }}
        />

        {/* Pink accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: '#F942AA',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* Wordmark */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#1E1B17',
              lineHeight: 1,
              fontFamily: 'serif',
            }}
          >
            MARTINA RINK
          </div>

          {/* Pink underline */}
          <div
            style={{
              width: 240,
              height: 1,
              backgroundColor: '#F942AA',
              marginTop: 20,
              marginBottom: 28,
            }}
          />

          {/* Positioning line */}
          <div
            style={{
              fontSize: 24,
              color: '#4A3728',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'serif',
              fontWeight: 400,
            }}
          >
            Private Mentoring · Munich · Ibiza · Berlin
          </div>
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            fontSize: 14,
            color: '#8A7F72',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          martinarink.com
        </div>
      </div>
    ),
    { ...size }
  )
}
