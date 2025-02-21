import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

// Make Sentry available globally for testing
if (process.env.NODE_ENV !== 'production') {
  window.Sentry = Sentry;
}

Sentry.init({
  dsn: "https://c02a5aedefc8f80c54ca75cf27aca6c2@o4508028501688320.ingest.us.sentry.io/4508028501884928",
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  //tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Add allowed domains to prevent ad blockers from blocking the requests
  allowUrls: [
    window.location.origin
  ],
  
  // Add this to ensure errors are properly captured
  beforeSend(event) {
    // Check if the error is being blocked by the client
    if (event.exception) {
      // Add additional context that might be helpful
      event.tags = {
        ...event.tags,
        environment: process.env.NODE_ENV
      };
    }
    return event;
  }
});
