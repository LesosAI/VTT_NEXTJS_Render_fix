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
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="text-[#e90026]">Our </span>
            Demo Examples
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Experience ForgeLab's powerful campaign and art generation tools.
            Create stunning visuals and engaging campaigns for your virtual
            tabletop adventures.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {demos.map((demo, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="relative h-80">
                <Image
                  src={demo.imageSrc}
                  alt={demo.title}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 border-t border-white/10">
                <h4 className="text-xl text-white mb-2 hover:text-white transition-colors">
                  {demo.title}
                </h4>
                <p className="text-gray-400 text-sm">{demo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentTwo;
