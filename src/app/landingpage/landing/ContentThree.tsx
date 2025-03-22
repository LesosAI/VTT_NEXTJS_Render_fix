import Image from "next/image";

const ContentThree = () => {
  const campaigns = [
    {
      title: "Character Portrait Studio",
      description:
        "Explore our AI-powered portrait generator that creates stunning character artwork. Perfect for quickly visualizing your RPG characters with customizable features and styles.",
      categories: ["Portraits", "Character Art"],
      imageSrc: "/Leonardo_3.avif",
    },
    {
      title: "Map Forge Workshop",
      description:
        "Create detailed battle maps and world maps with our intuitive AI tools. From fantasy dungeons to sci-fi space stations, bring your settings to life instantly.",
      categories: ["Maps", "Worldbuilding"],
      imageSrc: "/Leonardo_5.avif",
    },
    {
      title: "Item & Prop Generator",
      description:
        "Design unique weapons, artifacts, and props for your campaigns. Our AI understands context and style, ensuring each item fits perfectly into your game world.",
      categories: ["Items", "Props"],
      imageSrc: "/Leonardo_12.avif",
    },
  ];

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Example <span className="text-[#e90026]">Campaigns</span>
        </h2>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.title}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={campaign.imageSrc}
                  alt={campaign.title}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="p-6">
                <h4 className="text-2xl font-bold text-white mb-4 hover:text-[#e90026] transition-colors">
                  {campaign.title}
                </h4>
                <p className="text-gray-200 mb-4">{campaign.description}</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-sm text-white border border-[#e90026] rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentThree;
