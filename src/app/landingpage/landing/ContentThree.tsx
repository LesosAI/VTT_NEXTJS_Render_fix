const ContentThree = () => {
  return (
    <section className="section-dark large-bottom-space">
      <div className="w-layout-blockcontainer base-container w-container">
        <h2
          data-w-id="6571e6c0-f2fb-b65b-79a0-416ea77b7cc4"
          style={{
            opacity: 1,
            transform:
              "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
            transformStyle: "preserve-3d",
          }}
          className="margin-bottom-xlarge-center"
        >
          Example <span className="secondary-text-span">Campaigns</span>
        </h2>
        <div className="news-collection-list-wrapper w-dyn-list">
          <div role="list" className="news-collection-list w-dyn-items">
            {campaigns.map((campaign) => (
              <div
                key={campaign.title}
                data-w-id="62c08fd9-0e76-157e-e483-36e638cf311c"
                style={{
                  opacity: 1,
                  transform:
                    "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                  transformStyle: "preserve-3d",
                }}
                role="listitem"
                className="news-collection-item w-dyn-item"
              >
                <div className="news-text-info">
                  <div className="margin-bottom-small w-inline-block">
                    <h4 className="title-hover">{campaign.title}</h4>
                  </div>
                  <p className="news-description">{campaign.description}</p>
                  <div className="news-category-list-wrapper w-dyn-list">
                    <div role="list" className="news-category-list w-dyn-items">
                      {campaign.categories.map((category) => (
                        <div
                          key={category}
                          role="listitem"
                          className="news-category-item w-dyn-item"
                        >
                          <span className="category-link-with-border">
                            {category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="news-image-holder w-inline-block">
                  <img
                    alt={campaign.imageAlt}
                    loading="lazy"
                    src={campaign.imageSrc}
                    className="news-image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const campaigns = [
  {
    title: "Character Portrait Studio",
    description:
      "Explore our AI-powered portrait generator that creates stunning character artwork. Perfect for quickly visualizing your RPG characters with customizable features and styles.",
    categories: ["Portraits", "Character Art"],
    imageAlt: "AI character portrait example",
    imageSrc: "./Home 1 - Art_files/64a6d51bb3affa85132265f1_news picture.jpg",
  },
  {
    title: "Map Forge Workshop",
    description:
      "Create detailed battle maps and world maps with our intuitive AI tools. From fantasy dungeons to sci-fi space stations, bring your settings to life instantly.",
    categories: ["Maps", "Worldbuilding"],
    imageAlt: "AI-generated map example",
    imageSrc: "./Home 1 - Art_files/64a6d5239347739128b3e674_post image.webp",
  },
  {
    title: "Item & Prop Generator",
    description:
      "Design unique weapons, artifacts, and props for your campaigns. Our AI understands context and style, ensuring each item fits perfectly into your game world.",
    categories: ["Items", "Props"],
    imageAlt: "AI-generated item example",
    imageSrc: "./Home 1 - Art_files/64a6d52a84183d8ce30a5d46_nature image.webp",
  },
];

export default ContentThree;
