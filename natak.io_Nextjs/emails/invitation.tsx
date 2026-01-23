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

interface InvitationEmailProps {
    inviterName: string;
    orgName: string;
    role: string;
    acceptUrl: string;
}

export const InvitationEmail = ({
    inviterName = 'A team member',
    orgName = 'NATAK Organization',
    role = 'creator',
    acceptUrl = 'https://natak.io/invite/token',
}: InvitationEmailProps) => {
    const roleLabel = role === 'admin' ? 'Administrator' : role === 'viewer' ? 'Viewer' : 'Creator';

    return (
        <Html>
            <Head />
            <Preview>You've been invited to join {orgName} on NATAK</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Text style={logoText}>NATAK</Text>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Text style={badgeText}>TEAM INVITATION</Text>
                        <Heading style={heading}>
                            YOU'RE<br />
                            <span style={accentText}>INVITED</span>
                        </Heading>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            <strong style={highlight}>{inviterName}</strong> has invited you to join{' '}
                            <strong style={highlight}>{orgName}</strong> on NATAK as a{' '}
                            <strong style={highlight}>{roleLabel}</strong>.
                        </Text>

                        {/* Org Details Box */}
                        <Section style={orgBox}>
                            <Text style={orgLabel}>ORGANIZATION</Text>
                            <Text style={orgName_}>{orgName}</Text>
                            <Text style={roleText}>Your role: {roleLabel}</Text>
                        </Section>

                        <Text style={paragraph}>
                            Join the team to collaborate on AI content generation, manage assets, and scale your creative workflow.
                        </Text>

                        {/* CTA Buttons */}
                        <Section style={buttonContainer}>
                            <Link href={acceptUrl} style={acceptButton}>
                                ACCEPT INVITATION
                            </Link>
                        </Section>

                        <Text style={declineText}>
                            Don't recognize this invitation? You can safely ignore this email.
                        </Text>
                    </Section>

                    {/* Expiry Notice */}
                    <Section style={expiryBox}>
                        <Text style={expiryText}>
                            ⏱ This invitation expires in 7 days
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            NATAK.IO — AI CONTENT INFRASTRUCTURE
                        </Text>
                        <Text style={footerMuted}>
                            You received this email because someone invited you to their organization.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default InvitationEmail;

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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#3b82f6',
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

const contentSection = {
    padding: '32px 0',
};

const paragraph = {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.7',
    margin: '0 0 24px',
};

const highlight = {
    color: '#ffffff',
};

const orgBox = {
    backgroundColor: '#1a1a1d',
    border: '1px solid #2a2a2d',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const orgLabel = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#666',
    letterSpacing: '0.2em',
    margin: '0 0 8px',
    fontStyle: 'italic',
};

const orgName_ = {
    fontSize: '20px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 8px',
    textTransform: 'uppercase' as const,
    fontStyle: 'italic',
};

const roleText = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#CCFF00',
    margin: '0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const acceptButton = {
    display: 'inline-block',
    backgroundColor: '#CCFF00',
    color: '#000000',
    fontSize: '12px',
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: '0.15em',
    padding: '16px 48px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
};

const declineText = {
    fontSize: '11px',
    color: '#555',
    textAlign: 'center' as const,
    margin: '0',
};

const expiryBox = {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    border: '1px solid rgba(234, 179, 8, 0.2)',
    borderRadius: '4px',
    padding: '12px 16px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const expiryText = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#eab308',
    margin: '0',
    letterSpacing: '0.05em',
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
