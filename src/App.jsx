import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MentorsSection from './components/MentorsSection';
import Navbar from './components/Navbar';
import TeamsSection from './components/TeamsSection';
import TimelineSection from './components/TimelineSection';

function App() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <MentorsSection />
      <TeamsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
