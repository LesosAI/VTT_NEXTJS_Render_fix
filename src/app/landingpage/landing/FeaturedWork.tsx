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
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-[#e90026]">ForgeLab </span>
            work
          </h2>
          <p className="text-lg text-gray-200">
            Experience the power of ForgeLab's campaign generation and art
            creation tools. Our platform helps you bring your virtual tabletop
            adventures to life with stunning visuals and engaging storylines.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 mt-8">
          {/* Large feature image */}
          <div className="col-span-8">
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
              <Image
                src={collections[0].imageSrc}
                alt={collections[0].title}
                width={1200}
                height={800}
                className="w-full h-[600px] object-cover object-top"
              />
              <div className="flex justify-between items-center p-4">
                <h4 className="text-white m-0">{collections[0].title}</h4>
                <span className="text-gray-300">{collections[0].year}</span>
              </div>
            </div>
          </div>

          {/* Vertical stack of two smaller images */}
          <div className="col-span-4 flex flex-col gap-8">
            {collections.slice(1, 3).map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden flex-1"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-[290px] object-cover object-top"
                />
                <div className="flex justify-between items-center p-4">
                  <h4 className="text-white m-0">{item.title}</h4>
                  <span className="text-gray-300">{item.year}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row of three equal-sized images */}
          {collections.slice(3).map((item, index) => (
            <div key={index} className="col-span-4">
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-[300px] object-cover object-top"
                />
                <div className="flex justify-between items-center p-4">
                  <h4 className="text-white m-0">{item.title}</h4>
                  <span className="text-gray-300">{item.year}</span>
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
