import { Resend } from 'resend';

// Import email templates
import WelcomeEmail from '@/emails/welcome';
import VerifyEmail from '@/emails/verify-email';
import ResetPasswordEmail from '@/emails/reset-password';
import OnboardingCompleteEmail from '@/emails/onboarding-complete';
import InvitationEmail from '@/emails/invitation';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'NATAK <onboarding@resend.dev>';

export type EmailResult = {
    success: boolean;
    messageId?: string;
    error?: string;
};

/**
 * Centralized email service for NATAK
 * Uses Resend + React Email for beautiful, type-safe emails
 */
export const emailService = {
    /**
     * Send welcome email after signup
     */
    async sendWelcome(to: string, name: string): Promise<EmailResult> {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: 'Welcome to NATAK',
                react: WelcomeEmail({ name }),
            });

            if (error) {
                console.error('[EMAIL] Welcome email failed:', error);
                return { success: false, error: error.message };
            }

            console.log('[EMAIL] Welcome email sent:', data?.id);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] Welcome email error:', err);
            return { success: false, error: String(err) };
        }
    },

    /**
     * Send email verification link
     */
    async sendVerification(to: string, verifyUrl: string): Promise<EmailResult> {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: 'Verify your email address',
                react: VerifyEmail({ verifyUrl }),
            });

            if (error) {
                console.error('[EMAIL] Verification email failed:', error);
                return { success: false, error: error.message };
            }

            console.log('[EMAIL] Verification email sent:', data?.id);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] Verification email error:', err);
            return { success: false, error: String(err) };
        }
    },

    /**
     * Send password reset link
     */
    async sendPasswordReset(to: string, resetUrl: string): Promise<EmailResult> {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: 'Reset your password',
                react: ResetPasswordEmail({ resetUrl }),
            });

            if (error) {
                console.error('[EMAIL] Password reset email failed:', error);
                return { success: false, error: error.message };
            }

            console.log('[EMAIL] Password reset email sent:', data?.id);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] Password reset email error:', err);
            return { success: false, error: String(err) };
        }
    },

    /**
     * Send onboarding complete / welcome aboard email
     */
    async sendOnboardingComplete(to: string, name: string, tier: string): Promise<EmailResult> {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to,
                subject: "You're all set! Welcome to NATAK",
                react: OnboardingCompleteEmail({ name, tier }),
            });

            if (error) {
                console.error('[EMAIL] Onboarding complete email failed:', error);
                return { success: false, error: error.message };
            }

            console.log('[EMAIL] Onboarding complete email sent:', data?.id);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] Onboarding complete email error:', err);
            return { success: false, error: String(err) };
        }
    },

    /**
     * Send organization invitation email
     */
    async sendInvitation(options: {
        to: string;
        inviterName: string;
        orgName: string;
        role: string;
        acceptUrl: string;
    }): Promise<EmailResult> {
        try {
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: options.to,
                subject: `You've been invited to join ${options.orgName} on NATAK`,
                react: InvitationEmail({
                    inviterName: options.inviterName,
                    orgName: options.orgName,
                    role: options.role,
                    acceptUrl: options.acceptUrl,
                }),
            });

            if (error) {
                console.error('[EMAIL] Invitation email failed:', error);
                return { success: false, error: error.message };
            }

            console.log('[EMAIL] Invitation email sent:', data?.id);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] Invitation email error:', err);
            return { success: false, error: String(err) };
        }
    },
};

export default emailService;

