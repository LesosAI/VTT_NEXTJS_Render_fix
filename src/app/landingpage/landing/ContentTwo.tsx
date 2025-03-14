import Image from "next/image";

const ContentTwo = () => {
  const demos = [
    {
      title: "Campaign Generation",
      description: "Create complete adventures with AI",
      href: "/signup",
      imageSrc: "/Leonardo_8.avif",
    },
    {
      title: "Character Art",
      description: "Generate unique character portraits",
      href: "/signin",
      imageSrc: "/Leonardo_4.avif",
    },
  ];

  return (
    <section className="section-dark large-space overflow-hidden">
      <div className="artist-slider-wrapper">
        <div className="text-info-small-width">
          <h2 className="margin-bottom-medium">
            <span className="secondary-text-span">Our </span>
            Demo Examples
          </h2>
          <p>
            Experience ForgeLab's powerful campaign and art generation tools.
            Create stunning visuals and engaging campaigns for your virtual
            tabletop adventures.
          </p>
        </div>
        <div
          className="demo-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            marginTop: "3rem",
            maxWidth: "900px",
            margin: "3rem auto 0",
          }}
        >
          {demos.map((demo, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
            >
              <a href={demo.href} className="demo-card">
                <div style={{ position: "relative", height: "320px" }}>
                  <Image
                    src={demo.imageSrc}
                    alt={demo.title}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <h4
                    className="title-hover-white"
                    style={{
                      marginBottom: "0.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    {demo.title}
                  </h4>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                  >
                    {demo.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentTwo;
