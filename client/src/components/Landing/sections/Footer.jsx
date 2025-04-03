import { FaDiscord, FaTwitter, FaTelegram, FaGithub } from "react-icons/fa";
import logo from '../images/iconFoot.svg'; // Add your game logo
import { Link as LinkScroll } from "react-scroll";
import button1 from '../images/button4.svg';
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-r from-siteDimBlack via-siteDimBlack/5 to-siteDimBlack  py-12">
      <div className="container1 mx-auto px-6 lg:px-20">

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-700 pb-8">

          {/* Brand + Tagline */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Mythic Realms Logo" className="h-20 w-auto" />
            <div>
              <h2 className="text-4xl  tracking-wide text-p4 font-Aclonica">Mythic Realms</h2>
              <button onClick={()=>navigate('/home')}>
                <img src={button1} alt="Mythic Realms Logo" className="h-10 w-32 hover:w-36 transition-all duration-300 ease-in-out cursor-pointer" />
              </button>
            </div>

          </div>

          {/* Quick Links */}
          <div className="mt-6 lg:mt-0 grid grid-cols-2 md:grid-cols-3 gap-8 text-gray-300">
            <div>
              <h4 className="text-lg font-semibold mb-2">Game</h4>
              <ul className="space-y-1">
                <li><LinkScroll to="features" offset={-100} spy smooth activeClass="nav-active" className="hover:text-p3 cursor-pointer">Features</LinkScroll></li>
                <li><LinkScroll to="Gameplay" offset={-100} spy smooth activeClass="nav-active" className="hover:text-p3 cursor-pointer">Gameplay</LinkScroll></li>
                <li><LinkScroll to="Security" offset={-100} spy smooth activeClass="nav-active" className="hover:text-p3 cursor-pointer">Security</LinkScroll></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Community</h4>
              <ul className="space-y-1">
                <li><a href="https://discord.gg" className="hover:text-p3">Discord</a></li>
                <li><a href="https://twitter.com" className="hover:text-p3">Twitter</a></li>
                <li><a href="https://t.me" className="hover:text-p3">Telegram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Support</h4>
              <ul className="space-y-1">
              <li><LinkScroll to="faq" offset={-100} spy smooth activeClass="nav-active" className="hover:text-p3 cursor-pointer">FAQ</LinkScroll></li>
              <li><LinkScroll to="contact" offset={-100} spy smooth activeClass="nav-active" className="hover:text-p3 text-p5 cursor-pointer">Contact Us</LinkScroll></li>
                <li><a href="https://github.com" className="hover:text-p3">GitHub</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Social + Blockchain Transparency */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-center text-gray-400">

          {/* Social Media */}
          <div className="flex space-x-6 text-xl">
            <a href="https://discord.gg" className="hover:text-blue-500"><FaDiscord /></a>
            <a href="https://twitter.com" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="https://t.me" className="hover:text-blue-300"><FaTelegram /></a>
            <a href="https://github.com" className="hover:text-gray-300"><FaGithub /></a>
          </div>

          {/* Blockchain Transparency */}
          <p className="mt-6 lg:mt-0 text-sm text-gray-500">
            Built on <a
              href="https://www.avax.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              <span className="text-yellow-400">Avalanche Blockchain</span>
              </a> | Secured by Smart Contracts
          </p>

        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Mythic Realms. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
