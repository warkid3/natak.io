import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface OnboardingCompleteEmailProps {
    name: string;
    tier: string;
}

export const OnboardingCompleteEmail = ({
    name = 'Operator',
    tier = 'Starter'
}: OnboardingCompleteEmailProps) => {
    const tierBenefits: Record<string, string[]> = {
        'Starter': ['5,000 monthly credits', '10 identity slots', 'Standard rendering'],
        'Pro': ['15,000 monthly credits', '50 identity slots', 'Priority rendering', '4K video output'],
        'Agency': ['Unlimited credits', 'Unlimited identities', 'API access', 'Dedicated support'],
    };

    const benefits = tierBenefits[tier] || tierBenefits['Starter'];

    return (
        <Html>
            <Head />
            <Preview>You're all set! Welcome to NATAK, {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Text style={logoText}>NATAK</Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Text style={badgeText}>ONBOARDING COMPLETE</Text>
                        <Heading style={heading}>
                            YOU'RE<br />
                            <span style={accentText}>ALL SET</span>
                        </Heading>
                        <Text style={subheading}>
                            {tier.toUpperCase()} OPERATOR STATUS ACTIVATED
                        </Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            Congratulations, {name}! Your NATAK account is now fully configured and ready for production.
                            You've unlocked the full power of AI content generation.
                        </Text>

                        {/* Tier Benefits */}
                        <Section style={tierBox}>
                            <Text style={tierTitle}>{tier.toUpperCase()} TIER BENEFITS</Text>
                            {benefits.map((benefit, i) => (
                                <Text key={i} style={tierItem}>✓ {benefit}</Text>
                            ))}
                        </Section>

                        {/* Quick Start */}
                        <Section style={quickStartBox}>
                            <Text style={quickStartTitle}>QUICK START GUIDE</Text>
                            <Text style={quickStartItem}>1. Upload character reference images</Text>
                            <Text style={quickStartItem}>2. Train your first LoRA model</Text>
                            <Text style={quickStartItem}>3. Generate content at scale</Text>
                        </Section>

                        <Link href="https://natak.io/assets" style={ctaButton}>
                            START CREATING
                        </Link>
                    </Section>

                    {/* Support */}
                    <Section style={supportBox}>
                        <Text style={supportTitle}>NEED HELP?</Text>
                        <Text style={supportText}>
                            Our support team is available 24/7. Visit the{' '}
                            <Link href="https://natak.io/support" style={supportLink}>Support Terminal</Link>
                            {' '}for assistance.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            NATAK.IO — AI CONTENT INFRASTRUCTURE
                        </Text>
                        <Text style={footerMuted}>
                            Welcome to the future of content creation.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OnboardingCompleteEmail;

// Styles
const main = {
    backgroundColor: '#0a0a0b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '560px',
};

const headerSection = {
    padding: '20px 0',
    borderBottom: '1px solid #1a1a1d',
};

const logoText = {
    fontSize: '24px',
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#CCFF00',
    letterSpacing: '-0.05em',
    margin: '0',
};

const heroSection = {
    padding: '48px 0 32px',
};

const badgeText = {
    display: 'inline-block',
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    border: '1px solid rgba(204, 255, 0, 0.3)',
    color: '#CCFF00',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '0.2em',
    padding: '6px 12px',
    marginBottom: '16px',
    fontStyle: 'italic',
};

const heading = {
    fontSize: '42px',
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: '-0.03em',
    lineHeight: '1.1',
    margin: '0 0 16px',
    textTransform: 'uppercase' as const,
};

const accentText = {
    color: '#CCFF00',
};

const subheading = {
    fontSize: '10px',
    fontWeight: '700',
    color: '#666',
    letterSpacing: '0.2em',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const contentSection = {
    padding: '32px 0',
};

const paragraph = {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.7',
    margin: '0 0 24px',
};

const tierBox = {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    border: '1px solid rgba(204, 255, 0, 0.2)',
    borderRadius: '4px',
    padding: '24px',
    margin: '24px 0',
};

const tierTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#CCFF00',
    letterSpacing: '0.2em',
    margin: '0 0 16px',
    fontStyle: 'italic',
};

const tierItem = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    margin: '8px 0',
};

const quickStartBox = {
    backgroundColor: '#1a1a1d',
    border: '1px solid #2a2a2d',
    borderRadius: '4px',
    padding: '24px',
    margin: '24px 0',
};

const quickStartTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#666',
    letterSpacing: '0.2em',
    margin: '0 0 16px',
    fontStyle: 'italic',
};

const quickStartItem = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#888',
    margin: '8px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
};

const ctaButton = {
    display: 'inline-block',
    backgroundColor: '#CCFF00',
    color: '#000000',
    fontSize: '12px',
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: '0.15em',
    padding: '16px 32px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    marginTop: '8px',
};

const supportBox = {
    backgroundColor: '#1a1a1d',
    border: '1px solid #2a2a2d',
    borderRadius: '4px',
    padding: '20px',
    margin: '24px 0',
};

const supportTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#666',
    letterSpacing: '0.2em',
    margin: '0 0 8px',
    fontStyle: 'italic',
};

const supportText = {
    fontSize: '12px',
    color: '#666',
    margin: '0',
    lineHeight: '1.6',
};

const supportLink = {
    color: '#CCFF00',
    textDecoration: 'underline',
};

const footer = {
    padding: '32px 0 0',
    borderTop: '1px solid #1a1a1d',
    marginTop: '32px',
};

const footerText = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#444',
    letterSpacing: '0.2em',
    margin: '0 0 8px',
    fontStyle: 'italic',
};

const footerMuted = {
    fontSize: '11px',
    color: '#333',
    margin: '0',
};
