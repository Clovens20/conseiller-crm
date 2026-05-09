'use client';

import { posthog } from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import React, { useEffect } from 'react';

if (typeof window !== 'undefined') {
  posthog.init('phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs', {
    api_host: 'https://app.posthog.com',
    person_profiles: 'identified_only',
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
