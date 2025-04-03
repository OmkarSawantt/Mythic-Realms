import React, { useState } from "react";
import { motion } from "framer-motion";
import connectIcon from "../images/connect.svg";
import deckIcon from "../images/deck.svg";
import battleIcon from "../images/battle.svg";
import rewardIcon from "../images/reward.svg";

// Gameplay Steps with Detailed Descriptions
const gameplaySteps = [
  {
    id: 1,
    icon: connectIcon,
    title: "Connect Wallet",
    description:
      "Start your Mythic Realms journey by securely connecting your crypto wallet. We support MetaMask and WalletConnect. Your wallet ensures true ownership of your NFT cards.",
    strategyTip:
      "💡 Tip: Always double-check wallet permissions before signing transactions to protect your assets.",
  },
  {
    id: 2,
    icon: deckIcon,
    title: "Choose Deck",
    description:
      "Build your ultimate deck by selecting NFT cards with unique abilities and powers. Each card is stored securely on the blockchain, ensuring provable ownership.",
    strategyTip:
      "💡 Tip: Combine high-attack cards with defensive spells for balanced gameplay. Experiment with different strategies to dominate!",
  },
  {
    id: 3,
    icon: battleIcon,
    title: "Battle & Conquer",
    description:
      "Engage in intense PvP battles where strategy and timing decide the victor. Outmaneuver your opponents and earn NFTs and crypto rewards.",
    strategyTip:
      "💡 Tip: Pay attention to the turn-based system. Timing your attacks and defense properly can shift the tides in your favor.",
  },
  {
    id: 4,
    icon: rewardIcon,
    title: "Earn Rewards",
    description:
      "Win battles and climb the leaderboard to earn valuable rewards. Your victories can unlock rare NFT cards, token airdrops, and exclusive perks.",
    strategyTip:
      "💡 Tip: Participate in weekly tournaments for bonus rewards and improve your ranking.",
  },
];

// Wallet setup instructions
const setupInstructions = {
  desktop: [
    {
      step: "Install Browser Extension",
      description: "Download and install the MetaMask or other compatible wallet extension for your browser.",
      icon: "📥"
    },
    {
      step: "Create or Import Wallet",
      description: "Set up a new wallet or import your existing wallet using your seed phrase.",
      icon: "🔑"
    },
    {
      step: "Add Avalanche Fuji Network",
      description: "Click on the network dropdown, select 'Add Network', and enter the Avalanche Fuji Testnet details: Network Name: Avalanche Fuji Testnet, RPC URL: https://api.avax-test.network/ext/bc/C/rpc, Chain ID: 43113, Symbol: AVAX, Explorer: https://testnet.snowtrace.io",
      icon: "⛰️"
    },
    {
      step: "Get Test AVAX",
      description: "Visit the Avalanche Fuji Testnet Faucet to get test AVAX for transactions.",
      icon: "💧"
    },
    {
      step: "Connect to Mythic Realms",
      description: "Return to our site and click 'Connect Wallet' to start playing.",
      icon: "🔗"
    },
  ],
  mobile: [
    {
      step: "Install Wallet App",
      description: "Download MetaMask, Trust Wallet, or another compatible wallet app from your device's app store.",
      icon: "📱"
    },
    {
      step: "Create or Import Wallet",
      description: "Set up a new wallet or import your existing wallet using your seed phrase.",
      icon: "🔑"
    },
    {
      step: "Add Avalanche Fuji Network",
      description: "Go to Settings > Networks > Add Network and enter the Avalanche Fuji Testnet details: Network Name: Avalanche Fuji Testnet, RPC URL: https://api.avax-test.network/ext/bc/C/rpc, Chain ID: 43113, Symbol: AVAX, Explorer: https://testnet.snowtrace.io",
      icon: "⛰️"
    },
    {
      step: "Open DApp Browser",
      description: "In your wallet app, locate and open the built-in browser or DApp browser.",
      icon: "🌐"
    },
    {
      step: "Navigate to Mythic Realms",
      description: "Enter our website URL in the DApp browser and connect your wallet to start playing.",
      icon: "🔗"
    },
  ],
};

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("gameplay");
  const [activeStep, setActiveStep] = useState(gameplaySteps[0]);
  const [activeSetup, setActiveSetup] = useState("desktop");
  const [activeMobileStep, setActiveMobileStep] = useState(0);
  const [activeDesktopStep, setActiveDesktopStep] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section
      id="Gameplay"
      className="pb-20 px-6 lg:px-24"
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Header with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-4 text-p4 font-Inknut relative inline-block">
            <span className="absolute inset-0 blur-md bg-siteViolet opacity-30 rounded-full"></span>
            <span className="relative">🎮 Journey to Mastery</span>
          </h2>
          <div className="w-24 h-1 bg-siteViolet mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-p5 mb-12 max-w-3xl mx-auto">
            Embark on a legendary journey in{" "}
            <span className="font-Aclonica text-2xl text-siteViolet">
              Mythic Realms
            </span>{" "}
            where every decision shapes your destiny. Choose your path below to begin your adventure.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="bg-siteDimBlack p-2 rounded-xl inline-flex"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className={`px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                activeTab === "gameplay"
                  ? "bg-siteViolet text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("gameplay")}
            >
              Gameplay
            </button>
            <button
              className={`px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                activeTab === "setup"
                  ? "bg-siteViolet text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("setup")}
            >
              Wallet Setup
            </button>
          </motion.div>
        </div>

        {/* Gameplay Tab - Always rendered but conditionally displayed */}
        <div className={activeTab === "gameplay" ? "block" : "hidden"}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeTab === "gameplay" ? "visible" : "hidden"}
            key="gameplay-content"
          >
            {/* Interactive 3D Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {gameplaySteps.map((step) => (
                <motion.div
                  key={step.id}
                  className={`cursor-pointer rounded-3xl shadow-xl overflow-hidden relative
                  ${
                    activeStep.id === step.id
                      ? "ring-4 ring-siteViolet"
                      : ""
                  }`}
                  onClick={() => setActiveStep(step)}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(158,30,34 , 0.25)"
                  }}
                  variants={itemVariants}
                >
                  <div className="bg-siteDimBlack p-8 h-full">
                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-4 bg-siteViolet text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {step.id}
                    </div>

                    {/* Icon with Glow */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-siteViolet blur-md opacity-5 rounded-full"></div>
                      <img
                        src={step.icon}
                        alt={step.title}
                        className="w-20 h-20 mx-auto relative"
                      />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3 text-p4">{step.title}</h3>
                    <p className="text-sm text-p5 mb-4">
                      {activeStep.id === step.id
                        ? step.description
                        : `${step.description.slice(0, 75)}...`}
                    </p>

                    {/* Strategy Tip - Only Visible When Active */}
                    {activeStep.id === step.id && (
                      <motion.div
                        className="mt-4 text-sm font-semibold bg-black bg-opacity-40 p-3 rounded-lg text-yellow-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {step.strategyTip}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Wallet Setup Tab - Always rendered but conditionally displayed */}
        <div className={activeTab === "setup" ? "block" : "hidden"}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeTab === "setup" ? "visible" : "hidden"}
            key="setup-content"
            className="mb-12"
          >
            {/* Device Selector - Stylized as Quest Type */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-siteViolet blur-md opacity-20 rounded-xl"></div>
              <div className="bg-siteDimBlack rounded-xl p-6 relative">
                <h3 className="text-2xl font-bold text-p4 mb-6">Choose Your Path</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                      activeSetup === "desktop"
                        ? "border-siteViolet bg-black bg-opacity-60"
                        : "border-p5 bg-siteblack bg-opacity-40"
                    }`}
                    onClick={() => setActiveSetup("desktop")}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="mr-4 text-4xl">🖥️</div>
                      <div className="text-left">
                        <h4 className={`text-xl font-semibold ${
                          activeSetup === "desktop" ? "text-siteViolet" : "text-gray-300"
                        }`}>Desktop Quest</h4>
                        <p className="text-sm text-gray-400">Browser extension path</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                      activeSetup === "mobile"
                        ? "border-siteViolet bg-black bg-opacity-60"
                        : "border-p5 bg-siteblack bg-opacity-40"
                    }`}
                    onClick={() => setActiveSetup("mobile")}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="mr-4 text-4xl">📱</div>
                      <div className="text-left">
                        <h4 className={`text-xl font-semibold ${
                          activeSetup === "mobile" ? "text-siteViolet" : "text-gray-300"
                        }`}>Mobile Quest</h4>
                        <p className="text-sm text-gray-400">Wallet app journey</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Interactive Quest Map */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-p4 mb-6">
                {activeSetup === "desktop" ? "Desktop Wallet Quest" : "Mobile Wallet Quest"}
              </h3>

              {/* Quest Progress Bar */}
              <div className="relative mb-12">
                <div className="h-2 bg-gray-800 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-[#a34b4e] to-siteViolet rounded-full transition-all"
                    style={{
                      width: activeSetup === "desktop"
                        ? `${(activeDesktopStep + 1) * 20}%`
                        : `${(activeMobileStep + 1) * 20}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  {setupInstructions[activeSetup].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${
                        idx <= (activeSetup === "desktop" ? activeDesktopStep : activeMobileStep)
                          ? "bg-siteViolet text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Interactive Card */}
              <motion.div
                className="bg-siteDimBlack rounded-2xl overflow-hidden shadow-xl"
                key={`${activeSetup}-${activeSetup === "desktop" ? activeDesktopStep : activeMobileStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-gray-900 bg-opacity-60 p-4 text-left flex items-center">
                  <div className="mr-4 p-3 bg-siteViolet rounded-lg text-4xl">
                    {setupInstructions[activeSetup][activeSetup === "desktop" ? activeDesktopStep : activeMobileStep].icon}
                  </div>
                  <h4 className="text-xl font-bold text-p4">
                    {setupInstructions[activeSetup][activeSetup === "desktop" ? activeDesktopStep : activeMobileStep].step}
                  </h4>
                </div>
                <div className="p-6">
                  <p className="text-p5 text-lg mb-8">
                    {setupInstructions[activeSetup][activeSetup === "desktop" ? activeDesktopStep : activeMobileStep].description}
                  </p>

                  <div className="flex justify-between">
                    <button
                      className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={activeSetup === "desktop" ? activeDesktopStep === 0 : activeMobileStep === 0}
                      onClick={() => {
                        if (activeSetup === "desktop") {
                          setActiveDesktopStep(Math.max(0, activeDesktopStep - 1));
                        } else {
                          setActiveMobileStep(Math.max(0, activeMobileStep - 1));
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      className="px-6 py-2 bg-siteViolet text-white rounded-lg hover:bg-[#5c1215] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        activeSetup === "desktop"
                          ? activeDesktopStep === setupInstructions.desktop.length - 1
                          : activeMobileStep === setupInstructions.mobile.length - 1
                      }
                      onClick={() => {
                        if (activeSetup === "desktop") {
                          setActiveDesktopStep(Math.min(setupInstructions.desktop.length - 1, activeDesktopStep + 1));
                        } else {
                          setActiveMobileStep(Math.min(setupInstructions.mobile.length - 1, activeMobileStep + 1));
                        }
                      }}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* All Steps Overview */}
            <motion.div
              className="mt-12 p-6 bg-siteDimBlack rounded-xl"
              variants={itemVariants}
            >
              <h4 className="text-xl font-semibold text-p4 mb-4">Complete Quest Overview</h4>
              <div className="space-y-3">
                {setupInstructions[activeSetup].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex items-center cursor-pointer transition-all
                    ${
                      (activeSetup === "desktop" ? activeDesktopStep : activeMobileStep) === idx
                        ? "bg-siteViolet bg-opacity-20 border border-siteViolet"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (activeSetup === "desktop") {
                        setActiveDesktopStep(idx);
                      } else {
                        setActiveMobileStep(idx);
                      }
                    }}
                  >
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center mr-3">
                      {step.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-p4">{step.step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;