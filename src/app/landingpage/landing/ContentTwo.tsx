const ContentTwo = () => {
  return (
    <section className="section-dark large-space overflow-hidden">
      <div className="artist-slider-wrapper">
        <div className="text-info-small-width">
          <h2
            data-w-id="b58966b7-15de-5bc3-9ba2-a29335b1add8"
            className="margin-bottom-medium"
          >
            <span className="secondary-text-span">Our </span>
            Demo Examples
          </h2>
          <p data-w-id="bf997277-e5bf-df4c-0ec6-8e70a8ae6e68">
            Experience ForgeLab's powerful campaign and art generation tools.
            Create stunning visuals and engaging campaigns for your virtual
            tabletop adventures.
          </p>
        </div>
        <div
          data-delay="5000"
          data-animation="slide"
          className="artists-slider w-slider"
          data-autoplay="false"
          data-easing="ease-out-quart"
        >
          <div className="artists-mask w-slider-mask" id="w-slider-mask-0">
            {/* First Demo - Sign Up */}
            <div className="artists-slide w-slide">
              <div className="artists-list-wrapper w-dyn-list">
                <div className="artists-list w-dyn-items">
                  <div className="artists-item w-dyn-item">
                    <a
                      href="/signup"
                      className="full-height-link overflow-hidden w-inline-block"
                    >
                      <img
                        loading="lazy"
                        src="./Home 1 - Art_files/64a6ba40c7c50d4bdb6647ed_Kaylynn Bator.jpg"
                        alt="Campaign Generation Demo"
                        className="artists-image"
                      />
                    </a>
                    <a href="/signup" className="w-inline-block">
                      <h4 className="title-hover-white">
                        Try Campaign Generation
                      </h4>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Second Demo - Sign In */}
            <div className="artists-slide w-slide">
              <div className="artists-list-wrapper w-dyn-list">
                <div className="artists-list w-dyn-items">
                  <div className="artists-item w-dyn-item">
                    <a
                      href="/signin"
                      className="full-height-link overflow-hidden w-inline-block"
                    >
                      <img
                        loading="lazy"
                        src="./Home 1 - Art_files/64a6ba4f3423bc66901bcd3b_Kianna Septimus.jpg"
                        alt="Art Generation Demo"
                        className="artists-image"
                      />
                    </a>
                    <a href="/signin" className="w-inline-block">
                      <h4 className="title-hover-white">
                        Explore Art Generation
                      </h4>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation arrows */}
          <div className="artists-arrow-left w-slider-arrow-left">
            <img
              alt="left arrow icon"
              loading="lazy"
              src="./Home 1 - Art_files/64a6c3fb0da92d30ef39ba64_left arrow icon.svg"
              className="artists-arrow"
            />
          </div>
          <div className="artists-arrow-right w-slider-arrow-right">
            <img
              alt="right arrow icon"
              loading="lazy"
              src="./Home 1 - Art_files/64a6c3fb0da92d30ef39ba64_left arrow icon.svg"
              className="artists-arrow right"
            />
          </div>
          <div className="hidden w-slider-nav w-round w-num"></div>
        </div>
      </div>
    </section>
  );
};

export default ContentTwo;
