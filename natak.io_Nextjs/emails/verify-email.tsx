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

interface VerifyEmailProps {
    verifyUrl: string;
}

export const VerifyEmail = ({ verifyUrl = 'https://natak.io/auth/verify' }: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Verify your email to activate your NATAK account</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Text style={logoText}>NATAK</Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Heading style={heading}>
                            VERIFY<br />
                            <span style={accentText}>EMAIL</span>
                        </Heading>
                        <Text style={subheading}>
                            ONE CLICK TO ACTIVATE YOUR OPERATOR STATUS
                        </Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            Click the button below to verify your email address and activate your NATAK account.
                            This link will expire in 24 hours.
                        </Text>

                        <Link href={verifyUrl} style={ctaButton}>
                            VERIFY EMAIL ADDRESS
                        </Link>

                        <Text style={mutedText}>
                            If the button doesn't work, copy and paste this link into your browser:
                        </Text>
                        <Text style={linkText}>{verifyUrl}</Text>
                    </Section>

                    {/* Security Notice */}
                    <Section style={securityBox}>
                        <Text style={securityTitle}>SECURITY NOTICE</Text>
                        <Text style={securityText}>
                            If you didn't create a NATAK account, you can safely ignore this email.
                            Someone may have entered your email address by mistake.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            NATAK.IO — AI CONTENT INFRASTRUCTURE
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default VerifyEmail;

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
    marginBottom: '24px',
};

const mutedText = {
    fontSize: '11px',
    color: '#555',
    margin: '24px 0 8px',
};

const linkText = {
    fontSize: '11px',
    color: '#CCFF00',
    wordBreak: 'break-all' as const,
    margin: '0',
};

const securityBox = {
    backgroundColor: '#1a1a1d',
    border: '1px solid #2a2a2d',
    borderRadius: '4px',
    padding: '20px',
    margin: '24px 0',
};

const securityTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#666',
    letterSpacing: '0.2em',
    margin: '0 0 8px',
    fontStyle: 'italic',
};

const securityText = {
    fontSize: '12px',
    color: '#666',
    margin: '0',
    lineHeight: '1.6',
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
    margin: '0',
    fontStyle: 'italic',
};
