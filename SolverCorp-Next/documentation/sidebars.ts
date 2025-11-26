import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/project-structure',
      ],
    },
    {
      type: 'category',
      label: 'Layout Structure',
      items: [
        'layout-structure/dark-layout',
        'layout-structure/light-layout',
      ],
    },
    {
      type: 'category',
      label: 'Basic Components',
      items: [
        'basic-component/button',
        'basic-component/input',
        'basic-component/typography',
        'basic-component/icons',
        'basic-component/tag',
        'basic-component/toggle',
        'basic-component/switch',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Components',
      items: [
        'advanced-component/accordion',
        'advanced-component/carousel',
        'advanced-component/background',
      ],
    },
  ],
};

export default sidebars;
