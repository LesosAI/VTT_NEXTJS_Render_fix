const QuoteSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-xl md:text-2xl text-black">
            "VTT empowers Game Masters and creators to bring their campaigns to
            life.{" "}
            <span className="text-[#e90026]">
              Our AI-powered platform generates stunning visuals and immersive
              content
            </span>{" "}
            to help you{" "}
            <span className="text-[#e90026]">
              craft unforgettable adventures for your players
            </span>
            ."
          </div>
          <div className="space-y-2">
            <h6 className="text-lg font-bold text-black">
              Start Creating Today
            </h6>
            <p className="text-sm text-black">
              <a
                href="/signup"
                className="hover:text-[#e90026] transition-colors"
              >
                Create Your Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
