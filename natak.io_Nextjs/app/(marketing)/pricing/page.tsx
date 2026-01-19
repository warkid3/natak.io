import { ModernPricingPage, PricingCardProps } from "@/components/ui/animated-glassy-pricing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const pricingPlans: PricingCardProps[] = [
    {
        planName: 'OPERATOR',
        description: 'For the independent creator building their first content empire.',
        price: '29',
        credits: '500',
        features: [
            '500 Credits Refill / mo',
            'Basic & Premium Image Gen',
            '3 Character Slots (LoRA)',
            'Outfit Swap & Inpainting',
            'Quick Video (5s 720p)',
            'Community Support'
        ],
        buttonText: 'Start Pipeline',
        buttonVariant: 'secondary'
    },
    {
        planName: 'DIRECTOR',
        description: 'For professionals who need power, automation, and total control.',
        price: '79',
        credits: '2,000',
        features: [
            '2,000 Credits Refill / mo',
            'Chrome Extension Access',
            'Batch Mode (10x concurrency)',
            'NSFW & Uncensored Models',
            '10 Character Slots (LoRA)',
            'Priority Queue Processing'
        ],
        buttonText: 'Upgrade to Director',
        isPopular: true,
        buttonVariant: 'primary'
    },
    {
        planName: 'EXECUTIVE',
        description: 'For agencies running industrial-scale content operations.',
        price: '199',
        credits: '6,000',
        features: [
            '6,000 Credits Refill / mo',
            'Full API Access per seat',
            'Kanban Automation Suite',
            'Unlimited Character Slots',
            '4K Video & 20s Durations',
            'Dedicated Priority Support'
        ],
        buttonText: 'Contact Sales',
        buttonVariant: 'primary'
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black relative selection:bg-lime selection:text-black">
            <Navbar isSystemActive={false} />
            <div className="pt-20">
                <ModernPricingPage
                    title={
                        <>
                            INDUSTRIAL <span className="text-lime italic">SCALE</span>
                        </>
                    }
                    subtitle={
                        <>
                            CHOOSE THE <span className="text-white font-bold">INFRASTRUCTURE</span> THAT POWERS YOUR CONTENT EMPIRE.
                        </>
                    }
                    plans={pricingPlans}
                    showAnimatedBackground={true}
                />
            </div>
            <Footer />
        </div>
    );
}
