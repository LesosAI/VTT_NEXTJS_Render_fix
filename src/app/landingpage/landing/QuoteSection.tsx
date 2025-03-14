const QuoteSection = () => {
  return (
    <section className="section white-background">
      <div className="w-layout-blockcontainer base-container w-container">
        <div className="quote-wrapper-with-line">
          <div className="text-full-width dark">
            "VTT empowers Game Masters and creators to bring their campaigns to
            life.{" "}
            <span className="secondary-text-span primary-text-color">
              Our AI-powered platform generates stunning visuals and immersive
              content
            </span>{" "}
            to help you{" "}
            <span className="secondary-text-span primary-text-color">
              craft unforgettable adventures for your players
            </span>
            ."
          </div>
          <div className="quote-author-wrapper">
            <h6 className="text-color-dark">
              <strong className="bold-text">Start Creating Today</strong>
            </h6>
            <p className="paragraph-small text-color-dark">
              <a href="/signup" className="text-link">
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
