import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    'bg-main': 'bg-ctp-base text-ctp-text',
  },
  theme: {
    colors: {
      'ctp-rosewater': 'var(--ctp-rosewater)',
      'ctp-flamingo': 'var(--ctp-flamingo)',
      'ctp-pink': 'var(--ctp-pink)',
      'ctp-mauve': 'var(--ctp-mauve)',
      'ctp-red': 'var(--ctp-red)',
      'ctp-maroon': 'var(--ctp-maroon)',
      'ctp-peach': 'var(--ctp-peach)',
      'ctp-yellow': 'var(--ctp-yellow)',
      'ctp-green': 'var(--ctp-green)',
      'ctp-teal': 'var(--ctp-teal)',
      'ctp-sky': 'var(--ctp-sky)',
      'ctp-sapphire': 'var(--ctp-sapphire)',
      'ctp-blue': 'var(--ctp-blue)',
      'ctp-lavender': 'var(--ctp-lavender)',
      'ctp-text': 'var(--ctp-text)',
      'ctp-subtext1': 'var(--ctp-subtext1)',
      'ctp-subtext0': 'var(--ctp-subtext0)',
      'ctp-overlay2': 'var(--ctp-overlay2)',
      'ctp-overlay1': 'var(--ctp-overlay1)',
      'ctp-overlay0': 'var(--ctp-overlay0)',
      'ctp-surface2': 'var(--ctp-surface2)',
      'ctp-surface1': 'var(--ctp-surface1)',
      'ctp-surface0': 'var(--ctp-surface0)',
      'ctp-base': 'var(--ctp-base)',
      'ctp-mantle': 'var(--ctp-mantle)',
      'ctp-crust': 'var(--ctp-crust)',
    },
  }
})
