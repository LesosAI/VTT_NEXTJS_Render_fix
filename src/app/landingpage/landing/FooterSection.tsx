const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-200">
            Contact us at:{" "}
            <a
              href="mailto:contact@forgelab.com"
              className="text-[#e90026] hover:text-white transition-colors"
            >
              contact@forgelab.com
            </a>
          </div>
          <div className="text-gray-200">
            &copy; ForgeLab. All Rights Reserved 2024.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
