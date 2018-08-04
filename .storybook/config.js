import { configure } from '@storybook/react';

function loadStories() {
  require('../src/StoryBook');
}

configure(loadStories, module);
