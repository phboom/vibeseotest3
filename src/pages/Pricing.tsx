import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import ROICalculator from '@/components/pricing/ROICalculator';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';
import { useEffect } from 'react';
import Head from 'next/head';

const Pricing = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen cinematic-section">
      <Head>
        <title>Pricing</title>
        <meta name="description" content="Explore our pricing plans, calculate ROI, and choose the option that best fits your needs." />
        <meta name="keywords" content="pricing, plans, subscription, ROI calculator, cost, packages" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pricing" />
        <meta property="og:description" content="Explore our pricing plans, calculate ROI, and choose the option that best fits your needs." />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing" />
        <meta name="twitter:description" content="Explore our pricing plans, calculate ROI, and choose the option that best fits your needs." />
      </Head>
      <ModernHeader />
      
      <main className="pt-16">
        <PricingHero />
        <ROICalculator />
        <PricingPlans />
        <PricingFAQ />
        <PricingCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;