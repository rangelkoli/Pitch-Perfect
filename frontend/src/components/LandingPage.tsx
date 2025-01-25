import FeaturesSectionWithBentoGrid from "./feature-section-with-bento-grid";
import { HeroGeometric } from "./shape-landing-hero";
import { Tiles } from "./ui/tiles";

function LandingPage() {
  return (
    <div className='w-screen'>
      <HeroGeometric
        badge='Kokonut UI'
        title1='Elevate Your'
        title2='Digital Vision'
      />
      <FeaturesSectionWithBentoGrid />
    </div>
  );
}

export default LandingPage;
