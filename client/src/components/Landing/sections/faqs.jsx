import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import plus from "../images/plus.svg";
import minus from "../images/minus.svg";
import Contact from "./Contact";

// Expanded FAQ Data with categories
const faqData = {
  categories: [
    { id: "getting-started", name: "Getting Started" },
    { id: "gameplay", name: "Gameplay" },
    { id: "nfts", name: "NFTs & Ownership" },
    { id: "technical", name: "Technical" }
  ],
  faqs: [
    {
      question: "🎮 How do I connect my wallet to Mythic Realms?",
      answer:
        "To connect your wallet, click the 'Connect Wallet' button on the homepage. You can use MetaMask or any compatible Web3 wallet. We support Metamask, WalletConnect, Coinbase Wallet, and other popular options.",
      category: "getting-started"
    },
    {
      question: "🃏 How does NFT ownership work?",
      answer:
        "Each card in Mythic Realms is an NFT stored on the Avalanche blockchain. Once minted, it is securely linked to your wallet, ensuring true ownership. You can view your NFTs in your game inventory or any compatible NFT marketplace.",
      category: "nfts"
    },
    {
      question: "⚔️ What happens when I win a battle?",
      answer:
        "Winning battles rewards players with token rewards and experience points, which can be used to upgrade your cards. The higher the difficulty of the battle, the greater the rewards. Weekly tournaments offer special rewards and exclusive NFTs.",
      category: "gameplay"
    },
    {
      question: "🔒 Is my data secure in Mythic Realms?",
      answer:
        "Yes, Mythic Realms uses smart contracts to secure transactions, and all NFT metadata is stored on IPFS, ensuring immutability. We undergo regular security audits from trusted third parties to ensure the highest security standards.",
      category: "technical"
    },
    {
      question: "📚 How do I mint new cards?",
      answer:
        "Minting new cards requires AVAX tokens. You can mint through the 'Mint NFT' section in the game dashboard. We offer different rarity tiers with varying costs and special limited edition collections periodically.",
      category: "nfts"
    },
    {
      question: "🏆 Can I trade or sell my cards?",
      answer:
        "Yes! All NFTs can be freely traded, sold, or transferred on any compatible NFT marketplace like OpenSea. You retain full ownership rights and can leverage the secondary market to enhance your collection or monetize your gameplay.",
      category: "nfts"
    },
    {
      question: "💡 What is the benefit of owning NFTs in Mythic Realms?",
      answer:
        "Owning NFTs gives players exclusive in-game perks, rewards, and a say in governance decisions. Card holders can participate in DAO voting, gain access to special events, earn passive staking rewards, and unlock unique gameplay features.",
      category: "nfts"
    },
    {
      question: "🎯 How does the battle system work?",
      answer:
        "Battles in Mythic Realms are turn-based strategy matches where players use their cards' unique abilities and attributes to defeat opponents. Strategy and deck composition are key to success. You can battle against AI opponents or other players in PvP mode.",
      category: "gameplay"
    },
    {
      question: "📱 Is there a mobile version available?",
      answer:
        "Yes, Mythic Realms is available on both iOS and Android devices. You can download the app from the App Store or Google Play Store, and sync your wallet to access your NFTs across all devices.",
      category: "technical"
    },
    {
      question: "🌐 What blockchain does Mythic Realms use?",
      answer:
        "Mythic Realms is built on the Avalanche blockchain, chosen for its high speed, low transaction costs, and environmental sustainability. This ensures a smooth gaming experience with minimal gas fees.",
      category: "technical"
    }
  ]
};

const FAQSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredFaqs, setFilteredFaqs] = useState(faqData.faqs);

  // Filter FAQs based on search term and active category
  useEffect(() => {
    let result = faqData.faqs;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(faq => faq.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        faq =>
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(result);
  }, [searchTerm, activeCategory]);

  // Toggle Accordion
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <section
        id="faq"
        className="pb-24 px-6 lg:px-24 "
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 text-p4 font-Inknut relative inline-block">
              <span className="absolute inset-0 blur-md bg-siteViolet opacity-30 rounded-full"></span>
              <span className="relative">🔥 FAQ and Support</span>
            </h2>

            <div className="w-24 h-1 bg-siteViolet mx-auto rounded-full mb-8"></div>

            <p className="text-lg text-p5 max-w-3xl mx-auto mb-12">
              Have questions about Mythic Realms? Explore our most frequently
              asked questions or get in touch with our support team for personalized help!
            </p>

            {/* Search and Filter Controls */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === "all"
                        ? "bg-siteViolet text-white"
                        : "bg-siteDimBlack text-p5 hover:bg-gray-800"
                    }`}
                  >
                    All
                  </button>

                  {faqData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-siteViolet text-white"
                          : "bg-siteDimBlack text-p5 hover:bg-gray-800"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Results Summary */}
          {searchTerm && (
            <div className="text-center mb-8 text-p5">
              <p>
                {filteredFaqs.length > 0
                  ? `Found ${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} for "${searchTerm}"`
                  : `No results found for "${searchTerm}". Please try another search or contact support.`
                }
              </p>
            </div>
          )}

          {/* FAQ Accordion Section */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={`faq-${index}`}
                    className="bg-siteDimBlack mb-4 rounded-2xl shadow-lg overflow-hidden border border-gray-800"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left px-6 py-5 text-xl font-semibold text-p4 flex justify-between items-center hover:bg-gray-800/30 transition-colors duration-300"
                      aria-expanded={activeIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="pr-8">{faq.question}</span>
                      <span className="text-2xl flex-shrink-0">
                        {activeIndex === index ?
                          <img src={minus} alt="collapse" className="w-6 h-6" /> :
                          <img src={plus} alt="expand" className="w-6 h-6" />
                        }
                      </span>
                    </button>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-siteblack/60 px-6 py-5 text-p5">
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 px-6 bg-siteDimBlack rounded-2xl"
                >
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-p4 mb-2">No matching FAQs found</h3>
                  <p className="text-p5 mb-6">
                    Can't find what you're looking for? Our support team is happy to help!
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center px-6 py-3 bg-siteViolet rounded-full text-white font-medium hover:bg-purple-700 transition-colors duration-300"
                  >
                    Contact Support
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>
      </section>

      <Contact />
    </>
  );
};

export default FAQSupport;