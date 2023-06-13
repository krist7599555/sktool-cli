<svelte:options immutable />

<script lang="ts">
import { MetaTags } from 'svelte-meta-tags';

import {
  PUBLIC_BASE_URL,
  PUBLIC_FACEBOOK_APP_ID,
  PUBLIC_OG_DESCRIPTION,
  PUBLIC_OG_TITLE
} from '$env/static/public';

export let title: string = PUBLIC_OG_TITLE;
export let description: string = PUBLIC_OG_DESCRIPTION;
export let og_image: URL = new URL('/og.jpg', PUBLIC_BASE_URL);
export let keywords: string[] = ['Inside the Sandbox', 'Deadline Always Exists'];
</script>

<MetaTags
  additionalMetaTags={[
    { name: 'keywords', content: keywords.join(', ') },
    { name: 'author', content: 'Inside the Sandbox, Deadline Always Exists' },
    { name: 'twitter:creator', content: '@ExistsAlways' }
  ]}
  {description}
  facebook={{
    appId: PUBLIC_FACEBOOK_APP_ID
  }}
  openGraph={{
    type: 'website',
    title,
    description,
    images: [{ url: og_image.href, alt: description, width: 1200, height: 630 }]
  }}
  {title}
  twitter={{
    site: '@ExistsAlways',
    title,
    description,
    cardType: 'summary_large_image',
    image: og_image.href,
    imageAlt: description
  }}
/>

<slot />
