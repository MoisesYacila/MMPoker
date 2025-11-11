import { Box } from '@mui/material';

export default function PrivacyPolicy() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box className='privacy-policy' sx={{ marginTop: '20px', width: '66%' }}>
                <h1>Privacy Policy – MMPoker</h1>
                <p className='privacy-date'><strong>Effective Date:</strong> November 12, 2025</p>

                <h2>1. Introduction</h2>
                <p>MMPoker (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>

                <h2>2. Information We Collect</h2>
                <ul>
                    <li><strong>Account Information:</strong> email, username, and profile information when you create an account.</li>
                    <li><strong>Player Data:</strong> player names, nationality, and game statistics.</li>
                    <li><strong>Posts and Comments:</strong> content you create, including text and optional images.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use your information to provide our services, track game statistics, display leaderboards, and allow interaction with posts and comments.</p>

                <h2>4. Data Deletion and Anonymization</h2>
                <ul>
                    <li><strong>User Accounts:</strong> When you delete your account, we perform a soft delete. Your username and email are anonymized (e.g., <em>deleteduser123xxx</em>). Your posts and comments remain, but your personal identifiers are removed.</li>
                    <li><strong>Players:</strong> Player names are initially random to protect personal information. Players can only be deleted if they are not linked to any games, ensuring historical game integrity.</li>
                    <li><strong>Games:</strong> Admins may delete games. Deletion removes all related data.</li>
                    <li><strong>Posts and Comments:</strong> When a user is deleted, their content remains, but authorship is anonymized. Admins may also delete posts and comments manually.</li>
                    <li><strong>Backups:</strong> If backups are implemented, deleted or anonymized data will remain anonymized to maintain privacy.</li>
                </ul>

                <h2>5. Your Rights</h2>
                <ul>
                    <li>You have the right to access, correct, or request deletion of your personal data by using the account deletion feature.</li>
                    <li>After deletion, anonymized historical data may remain for analytics or leaderboard purposes.</li>
                </ul>

                <h2>6. Cookies and Tracking</h2>
                <p>We do not use third-party cookies for tracking personal information.</p>

                <h2>7. Changes to this Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated Effective Date.</p>

                <h2>8. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or your personal data, please contact us at <strong>moises.yacila.cs@gmail.com</strong>.</p>
            </Box>
        </Box>

    );
}