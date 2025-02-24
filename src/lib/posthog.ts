import posthog from 'posthog-js'

const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY

// Enable debug mode in development
if (window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
    posthog.debug()
}

if (!POSTHOG_API_KEY) {
    console.error('PostHog API key not found. Please set POSTHOG_API_KEY in your environment variables.')
}

posthog.init(POSTHOG_API_KEY || '', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'always'
})

export default posthog