import Image from "next/image";

const FeaturedWork = () => {
  const collections = [
    {
      title: "Mystical Realm",
      year: "2023",
      imageSrc: "/Leonardo_0.avif",
    },
    {
      title: "Ancient Secrets",
      year: "2023",
      imageSrc: "/Leonardo_3.avif",
    },
    {
      title: "Dragon's Lair",
      year: "2023",
      imageSrc: "/Leonardo_4.avif",
    },
    {
      title: "Enchanted Forest",
      year: "2023",
      imageSrc: "/Leonardo_5.avif",
    },
    {
      title: "Crystal Caverns",
      year: "2023",
      imageSrc: "/Leonardo_6.avif",
    },
    {
      title: "Forgotten Temple",
      year: "2023",
      imageSrc: "/Leonardo_8.avif",
    },
  ];

  return (
    <section className="section-dark large-space">
      <div className="w-layout-blockcontainer base-container w-container">
        <div className="section-wrapper">
          <h2 className="title-small">
            <span className="secondary-text-span">ForgeLab </span>
            work
          </h2>
          <p>
            Experience the power of ForgeLab's campaign generation and art
            creation tools. Our platform helps you bring your virtual tabletop
            adventures to life with stunning visuals and engaging storylines.
          </p>
        </div>

        <div
          id="collections"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {/* Large feature image */}
          <div style={{ gridColumn: "span 8" }}>
            <div
              className="image-card"
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
              }}
            >
              <Image
                src={collections[0].imageSrc}
                alt={collections[0].title}
                width={1200}
                height={800}
                style={{
                  width: "100%",
                  height: "600px",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
              <div
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ margin: 0 }}>{collections[0].title}</h4>
                <span>{collections[0].year}</span>
              </div>
            </div>
          </div>

          {/* Vertical stack of two smaller images */}
          <div
            style={{
              gridColumn: "span 4",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {collections.slice(1, 3).map((item, index) => (
              <div
                key={index}
                className="image-card"
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                  flex: 1,
                }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={800}
                  height={600}
                  style={{
                    width: "100%",
                    height: "290px",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: 0 }}>{item.title}</h4>
                  <span>{item.year}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row of three equal-sized images */}
          {collections.slice(3).map((item, index) => (
            <div key={index} style={{ gridColumn: "span 4" }}>
              <div
                className="image-card"
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={800}
                  height={600}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: 0 }}>{item.title}</h4>
                  <span>{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
