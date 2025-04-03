import React, { useState } from "react";
import { motion } from "framer-motion";
import securityIcon from "../images/security.svg";
import nftIcon from "../images/nft.svg";
import contractIcon from "../images/contract.svg";
import ipfsIcon from "../images/ipfs.svg";

// Expert Testimonials
const testimonials = [
  {
    name: "Vitalik Buterin",
    role: "Co-Founder, Ethereum",
    quote:
      "Blockchain-based asset ownership ensures that players have complete control over their digital assets, creating a truly decentralized economy.",
    avatar: "/api/placeholder/80/80" // Placeholder for avatar
  },
  {
    name: "Gavin Wood",
    role: "Founder, Polkadot",
    quote:
      "Smart contracts in blockchain games enable trustless execution and ensure fairness across the board.",
    avatar: "/api/placeholder/80/80" // Placeholder for avatar
  },
];

// Comparison Data
const comparisonData = [
  {
    title: "Ownership",
    traditional: "Centralized platforms control all in-game assets.",
    web3: "NFTs grant real ownership of game assets to players.",
    icon: nftIcon,
    color: "from-siteViolet to-[#5c1215]"
  },
  {
    title: "Security",
    traditional: "Vulnerable to hacks and data manipulation.",
    web3: "Blockchain ensures immutable asset history and transparency.",
    icon: securityIcon,
    color: "from-siteViolet to-[#5c1215]"
  },
  {
    title: "Fairness",
    traditional: "Game logic can be altered by developers.",
    web3: "Smart contracts govern gameplay, ensuring fairness.",
    icon: contractIcon,
    color: "from-siteViolet to-[#5c1215]"
  },
];

// Security Features
const securityFeatures = [
  {
    title: "Smart Contract Governance",
    icon: contractIcon,
    description: "Our game logic is powered by Ethereum smart contracts, ensuring that every battle, card mint, and reward distribution is executed without bias or interference.",
    color: "from-siteViolet to-[#5c1215]"
  },
  {
    title: "IPFS Metadata Security",
    icon: ipfsIcon,
    description: "All NFT metadata and game assets are stored securely on IPFS, ensuring that metadata remains immutable, secure, and accessible.",
    color: "from-siteViolet to-[#5c1215]"
  }
];

const SecurityOwnership = () => {
  const [activeTab, setActiveTab] = useState("comparison");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section
      id="Security"
      className="pb-24 px-6 lg:px-24 "
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold mb-4 text-p4 font-Inknut relative inline-block">
            <span className="absolute inset-0 blur-md bg-siteViolet opacity-30 rounded-full"></span>
            <span className="relative">🛡️ Security and Ownership</span>
          </h2>

          <div className="w-24 h-1 bg-siteViolet mx-auto rounded-full mb-8"></div>

          <p className="text-lg text-p5 mb-8 max-w-3xl mx-auto">
          <span className="font-bold text-xl font-Aclonica text-siteViolet">Mythic Realms</span> ensures <span className="font-bold ">secure ownership of NFT cards</span> and guarantees
            fair gameplay through smart contracts. With <span className="font-bold">blockchain transparency</span> and
            IPFS metadata storage, your assets remain secure and verifiable.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-siteDimBlack p-1 rounded-xl inline-flex">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "comparison" ? "bg-siteViolet text-white" : "text-p5 hover:text-white"
                }`}
                onClick={() => setActiveTab("comparison")}
              >
                Web3 vs Traditional
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "features" ? "bg-siteViolet text-white" : "text-p5 hover:text-white"
                }`}
                onClick={() => setActiveTab("features")}
              >
                Security Features
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "experts" ? "bg-siteViolet text-white" : "text-p5 hover:text-white"
                }`}
                onClick={() => setActiveTab("experts")}
              >
                Expert Endorsements
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Infographic */}
        {activeTab === "comparison" && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                className="bg-siteDimBlack p-8 rounded-3xl text-center shadow-lg overflow-hidden relative"
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                {/* Subtle gradient background */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`}></div>

                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 mx-auto mb-4"
                />

                <h3 className="text-2xl font-bold text-p4 mb-6">
                  {item.title}
                </h3>

                <div className="flex flex-col md:flex-row justify-between gap-6 text-left">
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <h4 className="text-lg font-semibold text-red-400">
                        Traditional
                      </h4>
                    </div>
                    <p className="text-sm text-p5 pl-5">{item.traditional}</p>
                  </div>

                  <div className="w-full md:w-1/2 md:border-l md:border-gray-700 md:pl-6">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <h4 className="text-lg font-semibold text-green-400">Web3</h4>
                    </div>
                    <p className="text-sm text-p5 pl-5">{item.web3}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Smart Contract & Security Section */}
        {activeTab === "features" && (
          <motion.div
            className="flex flex-wrap items-stretch justify-center gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-siteDimBlack rounded-3xl shadow-lg text-left w-full md:w-5/12 overflow-hidden"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(158 ,30, 34 , 0.4)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="p-4 bg-gray-800 rounded-2xl mr-4">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-12 h-12"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-p4 mt-3">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-p5 mb-6">
                    {feature.description}
                  </p>

                  {/* <div className="flex items-center text-siteViolet mt-auto">
                    <span className="font-medium">Learn more</span>
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div> */}
                </div>
              </motion.div>
            ))}

            {/* Technical Documentation Card */}
          </motion.div>
        )}

        {/* Testimonials / Expert Quotes */}
        {activeTab === "experts" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-siteDimBlack p-8 rounded-3xl shadow-lg text-left"
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(158 ,30 ,34 , 0.3)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="mb-6">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22H6V16C6 9.373 11.373 4 18 4V10C14.686 10 12 12.686 12 16V22ZM30 22H24V16C24 9.373 29.373 4 36 4V10C32.686 10 30 12.686 30 16V22Z" fill="#9e1e22"/>
                    </svg>
                  </div>

                  <p className="text-lg text-p4 italic mb-6">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center">
                    <div>
                      <h4 className="text-xl font-bold text-siteViolet">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-p3">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SecurityOwnership;