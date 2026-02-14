import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import useMousePosition from '../hooks/useMousePosition';

const TimelineSection = () => {
  const sectionRef = useRef(null);
  const [lineProgress, setLineProgress] = useState(0);
  const mousePosition = useMousePosition();

  const phases = [
    { id: 1, name: 'Registration', desc: 'Join the race', position: { x: 10, y: 15 } },
    { id: 2, name: 'Ideation', desc: 'Fuel your concept', position: { x: 30, y: 10 } },
    { id: 3, name: 'Prototype', desc: 'Build the engine', position: { x: 55, y: 20 } },
    { id: 4, name: 'Market Fit', desc: 'Test the track', position: { x: 75, y: 15 } },
    { id: 5, name: 'Pitching', desc: 'Accelerate ahead', position: { x: 85, y: 40 } },
    { id: 6, name: 'The Finish Line', desc: 'Demo Day', position: { x: 70, y: 70 } },
  ];

  // Calculate line progress based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start animating when section is in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.max(
          0,
          Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
        );
        setLineProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="relative min-h-screen overflow-hidden py-20">
      {/* Carbon Fiber Background */}
      <div className="carbon-fiber absolute inset-0" />

      {/* Mouse Tracking Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 24, 1, 0.15), transparent 80%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 font-orbitron text-4xl font-bold text-white sm:text-5xl md:text-7xl">
            The <span className="text-f1-red">Circuit</span>
          </h2>
          <p className="px-4 font-inter text-lg text-white/70 md:text-xl">
            Navigate through 6 phases of innovation
          </p>
        </motion.div>

        {/* SVG Race Track */}
        <div className="relative h-[450px] w-full sm:h-[550px] md:h-[700px]">
          <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            {/* Track Background Path */}
            <path
              d="M 10 15 Q 20 5, 30 10 T 55 20 Q 70 10, 75 15 T 85 40 Q 90 55, 85 60 T 70 70 Q 55 75, 40 70 T 20 60 Q 10 50, 10 15"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />

            {/* Animated Red Path */}
            <path
              d="M 10 15 Q 20 5, 30 10 T 55 20 Q 70 10, 75 15 T 85 40 Q 90 55, 85 60 T 70 70 Q 55 75, 40 70 T 20 60 Q 10 50, 10 15"
              fill="none"
              stroke="#FF1801"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - lineProgress * 1000}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 24, 1, 0.8))',
                transition: 'stroke-dashoffset 0.3s ease-out',
              }}
            />

            {/* Checkpoints */}
            {phases.map((phase, index) => (
              <g key={phase.id}>
                {/* Checkpoint Circle */}
                <circle
                  cx={phase.position.x}
                  cy={phase.position.y}
                  r="2"
                  fill={
                    lineProgress > index / phases.length ? '#FF1801' : 'rgba(255, 255, 255, 0.3)'
                  }
                  stroke={
                    lineProgress > index / phases.length ? '#FF1801' : 'rgba(255, 255, 255, 0.5)'
                  }
                  strokeWidth="0.3"
                  style={{
                    filter:
                      lineProgress > index / phases.length
                        ? 'drop-shadow(0 0 4px rgba(255, 24, 1, 1))'
                        : 'none',
                    transition: 'all 0.3s ease-out',
                  }}
                />

                {/* Checkpoint Number */}
                <text
                  x={phase.position.x}
                  y={phase.position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="1.5"
                  fontFamily="Orbitron"
                  fontWeight="bold"
                >
                  {phase.id}
                </text>
              </g>
            ))}
          </svg>

          {/* Phase Details Cards */}
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism group absolute rounded-lg border border-white/10 p-4 transition-all duration-300 hover:border-f1-red/50"
              style={{
                left: `${phase.position.x}%`,
                top: `${phase.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-f1-red/20 font-racing text-f1-red transition-transform group-hover:scale-110">
                  {phase.id}
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-white">{phase.name}</h3>
                  <p className="font-inter text-xs text-white/60">{phase.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
