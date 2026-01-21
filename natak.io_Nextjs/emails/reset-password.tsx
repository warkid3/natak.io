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

interface ResetPasswordEmailProps {
    resetUrl: string;
}

export const ResetPasswordEmail = ({ resetUrl = 'https://natak.io/auth/reset' }: ResetPasswordEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your NATAK password</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Text style={logoText}>NATAK</Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Heading style={heading}>
                            PASSWORD<br />
                            <span style={accentText}>RESET</span>
                        </Heading>
                        <Text style={subheading}>
                            SECURE CREDENTIAL RECOVERY PROTOCOL
                        </Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            We received a request to reset your password. Click the button below to create a new password.
                            This link will expire in 1 hour.
                        </Text>

                        <Link href={resetUrl} style={ctaButton}>
                            RESET PASSWORD
                        </Link>

                        <Text style={mutedText}>
                            If the button doesn't work, copy and paste this link into your browser:
                        </Text>
                        <Text style={linkText}>{resetUrl}</Text>
                    </Section>

                    {/* Security Notice */}
                    <Section style={warningBox}>
                        <Text style={warningTitle}>⚠ SECURITY ALERT</Text>
                        <Text style={warningText}>
                            If you didn't request a password reset, your account may be at risk.
                            Please secure your account immediately or contact support.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            NATAK.IO — AI CONTENT INFRASTRUCTURE
                        </Text>
                        <Text style={footerMuted}>
                            This is an automated security email. Please do not reply.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ResetPasswordEmail;

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

const warningBox = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '4px',
    padding: '20px',
    margin: '24px 0',
};

const warningTitle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#ef4444',
    letterSpacing: '0.2em',
    margin: '0 0 8px',
    fontStyle: 'italic',
};

const warningText = {
    fontSize: '12px',
    color: '#ef4444',
    margin: '0',
    lineHeight: '1.6',
    opacity: 0.8,
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
