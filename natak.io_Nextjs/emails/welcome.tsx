import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail = ({ name = 'Operator' }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to NATAK - Your AI Content Factory</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Text style={logoText}>NATAK</Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Heading style={heading}>
                            WELCOME,<br />
                            <span style={accentText}>{name.toUpperCase()}</span>
                        </Heading>
                        <Text style={subheading}>
                            YOUR OPERATOR CREDENTIALS ARE NOW ACTIVE
                        </Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            You've just unlocked access to the most advanced AI content factory on the planet.
                            Train digital twins, generate hyper-realistic content, and scale your creative output to infinity.
                        </Text>

                        <Section style={featureBox}>
                            <Text style={featureTitle}>WHAT'S NEXT?</Text>
                            <Text style={featureItem}>→ Complete your onboarding</Text>
                            <Text style={featureItem}>→ Train your first character LoRA</Text>
                            <Text style={featureItem}>→ Generate production-ready content</Text>
                        </Section>

                        <Link href="https://natak.io/assets" style={ctaButton}>
                            ENTER THE FACTORY
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            NATAK.IO — AI CONTENT INFRASTRUCTURE
                        </Text>
                        <Text style={footerMuted}>
                            You received this email because you signed up for NATAK.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

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

const featureBox = {
    backgroundColor: '#1a1a1d',
    border: '1px solid #2a2a2d',
    borderRadius: '4px',
    padding: '24px',
    margin: '24px 0',
};

const featureTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#CCFF00',
    letterSpacing: '0.2em',
    margin: '0 0 16px',
    fontStyle: 'italic',
};

const featureItem = {
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
    marginTop: '16px',
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
