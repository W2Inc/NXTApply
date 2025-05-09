
<p align="center">
    <a href="https://hamette.net/">
        <img src="./static//logo.svg" width="200px" alt="NXTApply" />
    </a>
</p>

<!-- <p align="center">
        <a href="https://nxtapply.com/features">Smart Applications</a> |
        <a href="https://nxtapply.com/efficiency">Streamlined Process</a> |
        <a href="https://nxtapply.com/privacy">Privacy Focused</a> |
        <a href="https://nxtapply.com/open-source">Open Source</a> |
        <a href="https://nxtapply.com/docs">Docs</a> |
        <a href="https://github.com/nxtapply/nxtapply/blob/master/CONTRIBUTING.md">Contributing</a>
</p> -->

NXTApply is a modern, lightweight, and open-source application tracking system for onboarding and testing incoming students.

## Getting started with NXTApply

NXTApply is fully open source and designed to be self-hosted on your own infrastructure.

### Installation

```bash
# Clone the repository
git clone https://github.com/nxtapply/nxtapply.git
cd nxtapply

# Install dependencies
bun install

# Run database migrations
bun --bun db:migrate

# Build the application
bun --bun run build

# Start the server
bun --bun ./build
```

---

### Self-hosting NXTApply

NXTApply can be easily deployed on your own servers. You manage your own infrastructure, installation, updates, and security, giving you full control over your application tracking system.

All features are available when self-hosting, and you have the freedom to modify the codebase to suit your specific needs.

## Technology Stack

### 🔐 Authentication & Security

- **Secure User Authentication**
    - Email and password authentication
    - Mandatory Two-factor authentication (2FA) with TOTP
    - Password reset functionality
    - Secure session management
- **Privacy & Compliance**
    - GDPR-compliant data handling

### 🖥️ Frontend

- **Framework & UI**
    - SvelteKit (Svelte 5)
    - TailwindCSS for styling (V4)
    - Bits UI components
    - Lucide Icons for SVG icons
- **User Experience**
    - Responsive design for mobile and desktop
    - Fast, lightweight interface

### ⚙️ Backend

- **Core Technologies**
    - Bun runtime
    - Drizzle ORM for database access
    - SQLite database
    - Auth system with session management + Thirdparty OAuth (Google, Apple, ...)

### 📊 Analytics
- **Privacy-Focused Tracking**
    - Integration with Plausible Analytics
    - No cookies or personal data collection
    - GDPR, CCPA, and PECR compliant
- **Performance Insights**
    - Lightweight script with minimal impact on load times
    - Real-time dashboard for visitor statistics
    - Conversion tracking and goal monitoring
- **Self-Hosted Option**
    - Deploy your own Plausible instance alongside NXTApply
    - Complete control over your analytics data
    - Simple integration with the NXTApply dashboard


## Contributors

We welcome contributions from the community! Check out [our contributor guide](https://github.com/nxtapply/nxtapply/blob/master/CONTRIBUTING.md) to get started.

<a href="https://github.com/nxtapply/nxtapply/graphs/contributors"><img src="https://opencollective.com/nxtapply/contributors.svg?width=800&button=false" /></a>

<!--
## Feedback & Roadmap

Have ideas for improving NXTApply? We'd love to hear them! Visit our [feedback board](https://nxtapply.com/feedback) to submit suggestions and vote on existing ideas.

Follow us on [Twitter](https://twitter.com/nxtapply), [LinkedIn](https://www.linkedin.com/company/nxtapply/), or join our [Discord community](https://discord.gg/nxtapply) to stay updated on the latest developments. -->

## License

NXTApply is open source under the GNU AFFERO GENERAL PUBLIC LICENSE License. You can [find it here](./LICENSE).

Copyright (c) 2023-present W2Inc B.V.
