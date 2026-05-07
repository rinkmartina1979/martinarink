import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Sober Muse Method — 90-day private mentoring";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F3EE",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: "#C8B8A2",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            height: 1,
            backgroundColor: "#C8B8A2",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#F942AA",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#8A7F72",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            The Sober Muse Method
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#1E1B17",
              lineHeight: 1.1,
              fontFamily: "serif",
              maxWidth: 920,
            }}
          >
            This is not about what you&rsquo;re giving up.
          </div>

          <div
            style={{
              width: 240,
              height: 1,
              backgroundColor: "#F942AA",
              marginTop: 36,
              marginBottom: 24,
            }}
          />

          <div
            style={{
              fontSize: 22,
              color: "#4A3728",
              fontFamily: "serif",
              fontStyle: "italic",
            }}
          >
            90 days · private · from €5,000
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontSize: 14,
            color: "#8A7F72",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          martinarink.com
        </div>
      </div>
    ),
    { ...size },
  );
}
