import React from 'react'
import HeroSection from './_components/HeroSection'
import FeaturesSection from './_components/FeaturedSection'
import DiscoverSection from './_components/DiscoverSection'
import CallToActionSection from './_components/CallToActionSection'
import FooterSection from '@/components/FooterSection'

export default function page() {
    return (
        <div>
            <HeroSection />
            <FeaturesSection />
            <DiscoverSection />
            <CallToActionSection />
            <FooterSection />
        </div>
    )
}
