import { motion } from 'framer-motion';

const MentorsSection = () => {
  const mentors = [
    { id: 1, name: 'Dr. Sarah Chen', expertise: ['Marketing', 'Growth'], image: null },
    { id: 2, name: 'Alex Kumar', expertise: ['Tech', 'AI/ML'], image: null },
    { id: 3, name: 'Maria Rodriguez', expertise: ['Finance', 'VC'], image: null },
    { id: 4, name: 'James Park', expertise: ['Product', 'UX'], image: null },
    { id: 5, name: 'Priya Sharma', expertise: ['Legal', 'IP'], image: null },
    { id: 6, name: 'Michael Brown', expertise: ['Sales', 'B2B'], image: null },
  ];

  return (
    <section id="mentors" className="relative min-h-screen bg-deep-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="relative inline-block">
            <h2 className="relative z-10 mb-2 px-4 font-orbitron text-4xl font-black tracking-tight text-white sm:text-6xl md:text-8xl">
              THE{' '}
              <span className="text-f1-red drop-shadow-[0_0_30px_rgba(255,24,1,0.8)]">
                PIT CREW
              </span>
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-f1-red/20 to-transparent blur-2xl" />
          </div>
          <p className="mt-4 px-4 font-orbitron text-lg font-bold uppercase tracking-widest text-f1-red sm:text-2xl md:text-3xl">
            Expert mentors to fuel your journey
          </p>
          <div className="mx-auto mt-6 h-1 w-32 bg-gradient-to-r from-transparent via-f1-red to-transparent" />
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-morphism group relative cursor-pointer rounded-2xl border-2 border-white/10 p-6 transition-all duration-300 hover:border-f1-red hover:shadow-red-glow"
            >
              {/* Mentor Image Placeholder */}
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-f1-red/30 bg-gradient-to-br from-f1-red/30 to-f1-red/10 transition-all group-hover:border-f1-red">
                <svg
                  className="h-20 w-20 text-f1-red/50 transition-colors group-hover:text-f1-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Mentor Info */}
              <div className="text-center">
                <h3 className="mb-2 font-orbitron text-xl font-bold text-white">{mentor.name}</h3>

                {/* Expertise Tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {mentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-f1-red/40 bg-f1-red/20 px-3 py-1 font-montserrat text-xs font-medium text-f1-red"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-f1-red/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;
