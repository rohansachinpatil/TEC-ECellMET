const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'YouTube', icon: '▶️', url: '#' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <img src="/logo.png" alt="E-Cell Logo" className="h-12 w-12" />
            <img src="/teclogo.svg" alt="TEC Logo" className="h-10 w-10" />
            <div>
              <div className="text-gradient font-racing text-xl">E-Cell MET</div>
              <div className="font-inter text-xs text-white/50">TEC Event</div>
            </div>
          </div>
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="glass-morphism flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl transition-all duration-300 hover:border-f1-red/50 hover:bg-f1-red/20"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="font-inter text-sm text-white/50">
              © {new Date().getFullYear()} E-Cell. All rights reserved.
            </p>
            <p className="mt-1 font-inter text-xs text-white/30">Built for innovation</p>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-f1-red to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
