"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Image as ImageIcon, Video as VideoIcon, Sparkles, Zap, Infinity as InfinityIcon, Layers, Play, Film } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const ImageGenVisual = () => (
  <div className="flex gap-2 mb-6 justify-center h-16 items-center">
    <div className="grid grid-cols-2 gap-2 rotate-3">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
        />
      ))}
    </div>
  </div>
);

const VideoGenVisual = () => (
  <div className="flex justify-center mb-6 h-16 items-center">
    <motion.div
      className="w-32 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-sm group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 flex gap-2 opacity-20 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-full w-4 bg-white/10 -skew-x-12 transform translate-x-[-20%]" />
        ))}
      </div>
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
        <Play size={16} className="text-white fill-white ml-1" />
      </div>
    </motion.div>
  </div>
);

const BundleVisual = () => (
  <div className="flex justify-center mb-6 h-16 items-center relative">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 blur-2xl rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <div className="relative flex gap-4 items-center">
      <motion.div 
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm"
        whileHover={{ y: -5, rotate: -5 }}
      >
        <ImageIcon size={20} className="text-blue-400" />
      </motion.div>
      <div className="h-8 w-[1px] bg-white/10" />
      <motion.div 
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm"
        whileHover={{ y: -5, rotate: 5 }}
      >
        <VideoIcon size={20} className="text-orange-400" />
      </motion.div>
    </div>
  </div>
);

const plansData = [
  {
    id: "image",
    name: "Image Generation",
    description: "Perfect for creators focused on high-quality static visuals",
    basePrice: 799,
    visual: <ImageGenVisual />,
    features: [
      { text: "20+ Image Models", icon: <ImageIcon size={20} /> },
      { text: "Unlimited Generations", icon: <InfinityIcon size={20} /> },
      { text: "Commercial License", icon: <CheckCheck size={20} /> },
    ],
    includes: [
      "Access to all Image Models",
      "Fast Generation Speed",
      "Private Mode",
      "High Resolution Download",
    ],
  },
  {
    id: "video",
    name: "Video Generation",
    description: "Ideal for motion graphics and video content creation",
    basePrice: 899,
    visual: <VideoGenVisual />,
    features: [
      { text: "20+ Video Models", icon: <VideoIcon size={20} /> },
      { text: "Unlimited Generations", icon: <InfinityIcon size={20} /> },
      { text: "No Watermarks", icon: <CheckCheck size={20} /> },
    ],
    includes: [
      "Access to all Video Models",
      "High FPS Export",
      "Longer Video Duration",
      "Priority Queue",
    ],
  },
  {
    id: "bundle",
    name: "All-In-One Bundle",
    description: "The ultimate creative suite with access to everything",
    basePrice: 1399,
    popular: true,
    visual: <BundleVisual />,
    features: [
      { text: "All Image & Video Models", icon: <Sparkles size={20} /> },
      { text: "Unlimited Generations", icon: <InfinityIcon size={20} /> },
      { text: "Priority Processing", icon: <Zap size={20} /> },
    ],
    includes: [
      "Everything in Image & Video",
      "Early Access to New Models",
      "API Access",
      "Dedicated Support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-neutral-900 border border-neutral-800 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-200">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

const ConcurrencySelector = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-8 relative z-10">
      <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
        <Layers size={16} />
        Concurrency Level (Simultaneous Generations)
      </span>
      <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === level
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-gray-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {level}x
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {value > 1 ? `+${(value - 1) * 299}/mo for extra concurrency` : "Standard concurrency"}
      </p>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [concurrency, setConcurrency] = useState(1);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  const calculatePrice = (basePrice: number) => {
    const concurrencyAddon = (concurrency - 1) * 299;
    const monthlyTotal = basePrice + concurrencyAddon;
    return isYearly ? Math.round(monthlyTotal * 12 * 0.8) : monthlyTotal;
  };

  return (
    <div className="px-4 pt-32 min-h-screen mx-auto relative bg-black" ref={pricingRef}>
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #206ce8 0%, transparent 70%)
      `,
          opacity: 0.4,
          mixBlendMode: "screen",
        }}
      />

      <div className="text-center mb-6 max-w-3xl mx-auto relative z-10">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-6xl sm:text-4xl text-3xl font-medium text-white mb-4"
        >
          Plans that works best for your{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border border-dashed border-blue-500 px-2 py-1 rounded-xl bg-blue-900/30 capitalize inline-block"
          >
            business
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-gray-400 sm:w-[70%] w-[80%] mx-auto"
        >
          Trusted by millions, We help teams all around the world, Explore which
          option is right for you.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-10 flex flex-col items-center"
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
        <ConcurrencySelector value={concurrency} onChange={setConcurrency} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto relative z-10">
        {plansData.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative border-neutral-800 ${
                plan.popular ? "ring-2 ring-blue-500 bg-neutral-900" : "bg-neutral-950"
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold text-white mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-white">
                    $
                    <NumberFlow
                      value={calculatePrice(plan.basePrice)}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="text-gray-400 ml-1">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`w-full mb-6 p-4 text-xl rounded-xl ${
                    plan.popular
                      ? "bg-gradient-to-t from-blue-500 to-blue-600  shadow-lg shadow-blue-500 border border-blue-400 text-white"
                      : "bg-gradient-to-t from-neutral-900 to-neutral-800  shadow-lg shadow-neutral-900 border border-neutral-700 text-white"
                  }`}
                >
                  Get started
                </button>
                <ul className="space-y-2 font-semibold py-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-neutral-200 grid place-content-center mt-0.5 mr-3">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-gray-400">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <h4 className="font-medium text-base text-white mb-3">
                    Includes:
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-blue-900/20 border border-blue-500 rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-blue-500 " />
                        </span>
                        <span className="text-sm text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
