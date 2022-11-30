// Components
import AppHeader from '../components/app/header';
import AppFooter from '../components/app/footer';
import TopSection from '../modules/home/top-section';
import HowItWorksSection from '../modules/home/how-it-works-section';
import FeaturesSection from '../modules/home/features-section';
import PricingSection from '../modules/home/pricing-section';
import FaqSection from '../modules/home/faq-section';

// Assets
import './home.css';

function HomePage() {
  return (
    <div className="home-page">
      <AppHeader />

      <TopSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />

      <AppFooter />
    </div>
  );
}

export default HomePage;
