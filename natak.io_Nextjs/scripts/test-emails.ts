/**
 * Test script to send all 4 email templates
 * Run with: npx tsx scripts/test-emails.ts
 */

import { Resend } from 'resend';

// Templates
import WelcomeEmail from '../emails/welcome';
import VerifyEmail from '../emails/verify-email';
import ResetPasswordEmail from '../emails/reset-password';
import OnboardingCompleteEmail from '../emails/onboarding-complete';

const resend = new Resend(process.env.RESEND_API_KEY || 're_eUJNDNjw_PmBzB1SiWXsNTQYuHwreKZx1');
const testEmail = 'mad.klover.tech@gmail.com'; // Must be same as Resend account until domain verified

async function sendTestEmails() {
    console.log('🚀 Sending test emails to:', testEmail);
    console.log('-----------------------------------\n');

    // 1. Welcome Email
    try {
        const { data, error } = await resend.emails.send({
            from: 'NATAK <onboarding@resend.dev>',
            to: testEmail,
            subject: '[TEST] Welcome to NATAK',
            react: WelcomeEmail({ name: 'Harsh' }),
        });
        if (error) throw error;
        console.log('✅ Welcome Email sent:', data?.id);
    } catch (e) {
        console.error('❌ Welcome Email failed:', e);
    }

    // 2. Verify Email
    try {
        const { data, error } = await resend.emails.send({
            from: 'NATAK <onboarding@resend.dev>',
            to: testEmail,
            subject: '[TEST] Verify your email address',
            react: VerifyEmail({ verifyUrl: 'https://natak.io/auth/verify?token=test123' }),
        });
        if (error) throw error;
        console.log('✅ Verify Email sent:', data?.id);
    } catch (e) {
        console.error('❌ Verify Email failed:', e);
    }

    // 3. Reset Password Email
    try {
        const { data, error } = await resend.emails.send({
            from: 'NATAK <onboarding@resend.dev>',
            to: testEmail,
            subject: '[TEST] Reset your password',
            react: ResetPasswordEmail({ resetUrl: 'https://natak.io/reset-password?token=test456' }),
        });
        if (error) throw error;
        console.log('✅ Reset Password Email sent:', data?.id);
    } catch (e) {
        console.error('❌ Reset Password Email failed:', e);
    }

    // 4. Onboarding Complete Email
    try {
        const { data, error } = await resend.emails.send({
            from: 'NATAK <onboarding@resend.dev>',
            to: testEmail,
            subject: "[TEST] You're all set! Welcome to NATAK",
            react: OnboardingCompleteEmail({ name: 'Harsh', tier: 'Pro' }),
        });
        if (error) throw error;
        console.log('✅ Onboarding Complete Email sent:', data?.id);
    } catch (e) {
        console.error('❌ Onboarding Complete Email failed:', e);
    }

    console.log('\n-----------------------------------');
    console.log('📬 All test emails sent! Check your inbox.');
}

sendTestEmails();
