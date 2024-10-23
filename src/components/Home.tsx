import React, { useState, useRef, useEffect } from "react";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface CardProps {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  isFullGif?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  bgColor,
  isFullGif,
}) => {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      controls.start({
        x: (x - rect.width / 2) / 20,
        y: (y - rect.height / 2) / 20,
        transition: { duration: 0.2 },
      });
    }
  };

  const handleHoverEnd = () => {
    controls.start({ x: 0, y: 0, transition: { duration: 0.2 } });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center lg:p-4 sm:p-2">
      <motion.div
        ref={cardRef}
        className={`w-full max-w-sm mx-auto h-[400px] rounded-3xl overflow-hidden ${
          isFullGif ? "" : "p-8 flex flex-col justify-between"
        } ${bgColor}`}
        animate={controls}
        whileHover={{ scale: 1.05 }}
        onMouseMove={handleHover}
        onMouseLeave={handleHoverEnd}
      >
        {isFullGif ? (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="p-4">
                <h3 className="text-2xl font-bold text-white mb-2 text-shadow">
                  {title}
                </h3>
                <p className="text-white text-shadow">{description}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
              <p className="text-white mb-6">{description}</p>
            </div>
            <img
              src={image}
              alt={title}
              className="w-full rounded-lg shadow-lg"
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

const FeatureCards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cards: CardProps[] = [
    {
      title: "End-to-End Encryption",
      description: "Secure your files with CryptoJS encryption",
      image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXQ1bDA5ZXhuczBhdmM0YWJjcDF3aDZqcHQ3M2lib2tyMDh0bWt3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/REPL2BIiGhyFO/giphy.gif",
      bgColor: "bg-gradient-to-b from-purple-400 to-indigo-600",
      isFullGif: true,
    },
    {
      title: "Resumable Transfers",
      description: "Never lose progress with Resumable.js",
      image: "https://media.giphy.com/media/dDCy1VKsop5N22Nulf/giphy.gif?cid=790b7611qjer241ezpur4d0ysg715osh9gny8pb3xllhzewf&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-green-400 to-teal-600",
      isFullGif: true,
    },
    {
      title: "Fast Transfers",
      description: "Lightning-fast file transfers, even on slow connections",
      image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHQ1b3k4YTVlY2Y2YWFpYXp2NDlncHd4dW02Y3BhbXd2Z3N3aHk3MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Emb1u5OKSGqtQixcEV/giphy.gif",
      bgColor: "bg-gradient-to-b from-yellow-400 to-orange-600",
      isFullGif: true,
    },
    {
      title: "Secure Sharing",
      description: "Share files securely with customizable permissions",
      image: "https://media.giphy.com/media/9r73dCeJarx5kdXmu2/giphy.gif?cid=790b7611j7r0cesyfrasvkpfcmd6robhgy1exzpqtu0y80e3&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-red-400 to-pink-600",
      isFullGif: true,
    },
    {
      title: "Cloud Integration",
      description: "Seamlessly integrate with popular cloud storage services",
      image: "https://media.giphy.com/media/3oFyD2RpK1Qs4Cl9rq/giphy.gif?cid=790b7611zh5es36523gupnek7rrxx0dlq0qyfyana2hiuoc0&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      bgColor: "bg-gradient-to-b from-indigo-400 to-purple-600",
      isFullGif: true,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(window.innerWidth >= 1024 ? 3 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextCard = () =>
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, cards.length - visibleCards)
    );
  const prevCard = () =>
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      prevCard();
    } else if (info.offset.x < -100) {
      nextCard();
    }
  };

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === cards.length - visibleCards;

  return (
    <div className="w-full bg-[#0C1816] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            What do we have in store for you?
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevCard}
              className={`rounded-full p-2 transition-colors duration-300 ${
                isFirstCard
                  ? "bg-gray-600 text-gray-400"
                  : "bg-indigo-600 text-white"
              }`}
              aria-label="Previous card"
              disabled={isFirstCard}
            >
              ←
            </button>
            <button
              onClick={nextCard}
              className={`rounded-full p-2 transition-colors duration-300 ${
                isLastCard
                  ? "bg-gray-600 text-gray-400"
                  : "bg-indigo-600 text-white"
              }`}
              aria-label="Next card"
              disabled={isLastCard}
            >
              →
            </button>
          </div>
        </div>
        <div ref={constraintsRef} className="overflow-hidden">
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            animate={{ x: `${-currentIndex * (100 / visibleCards)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className={`flex-shrink-0 px-2 ${
                  visibleCards === 1 ? "w-full" : "w-1/3"
                }`}
              >
                <Card {...card} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const styles = {
    container: "bg-gradient-to-b from-[#101212] to-[#08201D] relative",
    header: "absolute inset-x-0 top-0 z-10 w-full",
    headerContent: "px-4 mx-auto sm:px-6 lg:px-8",
    headerFlex: "flex items-center justify-between h-16 lg:h-20",
    logo: "w-auto h-8 mr-8",
    navLinks: "hidden lg:flex lg:items-center lg:justify-center lg:space-x-10",
    navLink:
      "text-base text-white transition-all duration-200 hover:text-opacity-80",
    actionBtns:
      "lg:flex lg:items-center lg:justify-end lg:space-x-6 sm:ml-auto",
    loginBtn:
      "hidden text-base text-white transition-all duration-200 lg:inline-flex hover:text-opacity-80",
    applyBtn:
      "inline-flex items-center justify-center px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-200 text-white bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg",
    menuBtn:
      "inline-flex p-2 ml-1 text-white transition-all duration-200 rounded-md sm:ml-4 lg:hidden focus:bg-gray-800 hover:bg-gray-800",
    section:
      "relative pt-24 pb-10 sm:pt-32 sm:pb-16 lg:pb-24",
    sectionContent: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-20",
    title: "text-4xl font-bold sm:text-6xl",
    titleGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-white",
    description: "mt-5 text-base text-white sm:text-xl",
    ctaBtn:
      "inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg sm:mt-16 hover:bg-blue-700 focus:bg-blue-700",
    statsGrid:
      "grid grid-cols-1 px-20 mt-12 text-left gap-x-12 gap-y-8 sm:grid-cols-3 sm:px-0",
    statItem: "flex items-center",
    statIcon: "w-8 h-8 text-[#28CC9D]",
    statText: "ml-3 text-sm text-white",
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <div className="max-w-xl mx-auto text-center">
            <h1 className={styles.title}>
              <span className={styles.titleGradient}>
                Simplifying File Sharing for Everyone
              </span>
            </h1>
            <p className={styles.description}>
              Upload, share, and manage your files with ease. Get started today
              and enjoy the benefits of a premium file sharing platform.
            </p>
          </div>
        </div>
      </section>
      <div className="flex flex-col items-center justify-center w-full h-screen  sm:flex sm:flex-row">
        <FeatureCards />
      </div>
    </div>
  );
};

export default Home;