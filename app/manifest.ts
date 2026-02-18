import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'The Goal Time Capsule',
        short_name: 'Time Capsule',
        description: 'Secure your future messages.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/logo-light.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}
