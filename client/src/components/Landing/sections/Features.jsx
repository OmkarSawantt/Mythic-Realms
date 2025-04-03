import React, { useState } from "react";
import {
  FaShieldAlt,
  FaRocket,
  FaLock,
  FaChartLine,
  FaClock,
  FaCoins
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const featuresData = [
  {
    id: 1,
    icon: <FaShieldAlt className="text-4xl group-hover:text-white" />,
    title: "Immutable NFT Ownership",
    description:
      "Own your cards permanently on the blockchain with true digital ownership, ensuring your assets can't be modified or revoked.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
  {
    id: 2,
    icon: <FaRocket className="text-4xl group-hover:text-white" />,
    title: "Fast and Low-Cost Transactions",
    description:
      "Built on the Avalanche blockchain, Mythic Realms offers fast and affordable transactions, ensuring a seamless gaming experience.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
  {
    id: 3,
    icon: <FaLock className="text-4xl group-hover:text-white" />,
    title: "Secure Smart Contracts",
    description:
      "Battle mechanics and asset ownership are governed by secure and audited smart contracts to protect player assets and ensure fair play.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
  {
    id: 4,
    icon: <FaClock className="text-4xl group-hover:text-white" />,
    title: "Real-Time PvP Battles",
    description:
      "Engage in real-time battles with players globally and showcase your strategic skills to climb the leaderboard.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
  {
    id: 5,
    icon: <FaChartLine className="text-4xl group-hover:text-white" />,
    title: "Skill-Based Battle Mechanics",
    description:
      "Master the strategy of Mythic Realms with skill-based gameplay and intelligent AI opponents to keep you on your toes.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
  {
    id: 6,
    icon: <FaCoins className="text-4xl group-hover:text-white" />,
    title: "Player-Centric Economy",
    description:
      "Drive the game's economy with real-time trading and token staking mechanisms that reward active players.",
    color: "from-siteDimBlack via-siteViolet to-siteDimBlack"
  },
];

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();
  return (
    <section className="pb-20 " id="features">
      <div className="container1 mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-16">

          <h2 className="text-5xl font-bold mb-6 text-p4 font-Inknut relative inline-block">
            <span className="absolute inset-0 blur-md bg-siteViolet opacity-30 rounded-full"></span>
            <span className="relative">⚡️ Amazing Features</span>
          </h2>

          <div className="w-24 h-1 bg-siteViolet mx-auto rounded-full mb-8"></div>

          <p className="text-center text-lg text-p5  max-w-3xl mx-auto">
            Explore the innovative features that make Mythic Realms a pioneer in Web3 NFT gaming.
            <span className="block mt-2 text-siteViolet">Built for players, by players.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-siteDimBlack rounded-2xl shadow-lg p-8 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Animated background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-90 transition-opacity duration-300 -z-0`}
              ></div>

              {/* Icon with circular background */}
              <div className="relative z-10 flex items-center justify-center mb-6">
                <div className={`p-4 rounded-full bg-opacity-20 ${hoveredFeature === feature.id ? 'bg-white' : 'bg-siteViolet'} transition-all duration-300`}>
                  {React.cloneElement(feature.icon, {
                    className: `text-4xl ${hoveredFeature === feature.id ? 'text-white' : 'text-siteViolet'} transition-colors duration-300`
                  })}
                </div>
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-2xl font-bold text-p4 mb-3 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="relative z-10 text-p5 group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-siteDimBlack rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-p4 mb-4">Ready to experience these features?</h3>
          <p className="text-p5 mb-6">Join thousands of players already exploring the Mythic Realms universe.</p>
          <button onClick={()=>navigate('/home')} className="px-8 py-3 bg-gradient-to-r from-siteViolet to-siteViolet text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Start Playing Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;