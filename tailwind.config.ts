import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				/* Shadcn semantic tokens */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#E8F4FC',
					100: '#C5E3F7',
					200: '#8BC7EF',
					300: '#51ABE7',
					400: '#1A8FD7',
					500: '#0063A6',
					600: '#005590',
					700: '#004577',
					800: '#00365E',
					900: '#002745',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},

				/* Brand color scales — Hospital Ángeles */
				blue: {
					50: '#EEF4FF',
					100: '#E9EEFF',
					200: '#C5DAFF',
					300: '#AAC8FF',
					400: '#5794F5',
					500: '#006CEC',
					600: '#005AC4',
					700: '#00489C',
					800: '#003674',
					900: '#00254C',
				},
				neutral: {
					50: '#F7F8F9',
					100: '#EFF1F2',
					200: '#DEE1E3',
					300: '#C5CACD',
					400: '#A0A8AD',
					500: '#7B868C',
					600: '#636D72',
					700: '#4C5459',
					800: '#363C40',
					900: '#222729',
				},
				red: {
					50: '#FFF1F2',
					100: '#FFE0E2',
					200: '#FFC7CA',
					300: '#FFA0A5',
					400: '#FF6B73',
					500: '#FF3845',
					600: '#E62030',
					700: '#BF1522',
					800: '#99151E',
					900: '#7D1519',
				},
				green: {
					50: '#ECFDF8',
					100: '#D1FAF0',
					200: '#A7F3E3',
					300: '#6EE7CF',
					400: '#34D4B8',
					500: '#00B19A',
					600: '#00957F',
					700: '#007A68',
					800: '#006154',
					900: '#004F47',
				},
				amber: {
					50: '#FFFAEB',
					100: '#FFF0C6',
					200: '#FFDF88',
					300: '#FFCD4A',
					400: '#FFB720',
					500: '#FF9A00',
					600: '#E07C00',
					700: '#B85F00',
					800: '#944800',
					900: '#7A3A00',
				},
				rose: {
					50: '#FFF5F5',
					100: '#FFE8E9',
					200: '#FFD8D9',
					300: '#FFB5B8',
					400: '#FF8B91',
					500: '#FF616A',
					600: '#E64350',
					700: '#BF303C',
					800: '#99262F',
					900: '#802025',
				},
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'brand': 'var(--shadow-brand)',
				'card': 'var(--shadow-card)',
				'elevated': 'var(--shadow-elevated)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
