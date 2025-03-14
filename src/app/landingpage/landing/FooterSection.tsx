const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="base-container w-container">
        <div className="footer-wrapper">
          <div className="footer-copyright">
            Contact us at:{" "}
            <a
              href="mailto:contact@forgelab.com"
              className="footer-copyright-link"
            >
              contact@forgelab.com
            </a>
          </div>
          <div className="footer-copyright">
            &copy; ForgeLab. All Rights Reserved 2024.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
