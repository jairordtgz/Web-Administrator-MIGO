import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MigoPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{yellow.50}',
            100: '{yellow.100}',
            200: '{yellow.200}',
            300: '{yellow.300}',
            400: '{yellow.400}',
            500: '{yellow.500}',
            600: '{yellow.600}',
            700: '{yellow.700}',
            800: '{yellow.800}',
            900: '{yellow.900}',
            950: '{yellow.950}'
        },
        focusRing: {
            width: '2px',
            style: 'solid',
            color: '{yellow.500}',
            offset: '2px'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{yellow.400}', // Usamos el 400 para un look más claro y "calmado"
                    inverseColor: '#000000',
                    hoverColor: '{yellow.500}', // El neón puro aparece al interactuar
                    activeColor: '{yellow.600}'
                },
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                }
            },
            dark: {
                primary: {
                    color: '{yellow.400}',
                    inverseColor: '#000000',
                    hoverColor: '{yellow.500}',
                    activeColor: '{yellow.300}'
                }
            }
        }
    },
    components: {
        button: {
            root: {
                paddingX: '1.25rem',
                paddingY: '0.625rem',
                borderRadius: '{migo.radius.md}'
            },
            css: ({ dt }: any) => `
                .p-button {
                    font-weight: 700;
                    transition: all ${dt('migo.transition.fast')};
                }
                .p-button:not(.p-button-text):not(.p-button-outlined) {
                    color: #000000 !important;
                }
            `
        },
        select: {
            root: {
                paddingX: '1rem',
                paddingY: '0.5rem',
                borderRadius: '{migo.radius.md}'
            }
        }
    },
    extend: {
        migo: {
            transition: {
                fast: '0.2s ease-in-out',
                normal: '0.3s ease-in-out'
            },
            radius: {
                md: '8px',
                lg: '12px'
            },
            shadow: {
                sm: '0 2px 4px rgba(0,0,0,0.05)',
                md: '0 4px 6px rgba(0,0,0,0.07)'
            }
        }
    },
    primitive: {
        yellow: {
            50: '#fffde6',
            100: '#fffbad',
            200: '#fff974',
            300: '#fff63b',
            400: '#fff202', // Un neón más claro, excelente para el estado reposo
            500: '#ffed00', // El amarillo principal Migo
            600: '#ccbd00',
            700: '#998e00',
            800: '#665f00',
            900: '#332f00',
            950: '#1a1800'
        }
    },
    css: ({ dt }: any) => `
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    `
});
