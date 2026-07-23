import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col pb-24 lg:pb-0" data-testid="page-home">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
