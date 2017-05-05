import React from 'react';
import { render } from 'react-dom';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import storeCreator from './scribing/store';
import ScribingAnswer from './scribing/ScribingAnswer';

$(document).ready(() => {
  const mountNode = document.getElementById('scribing-answer');
  if (mountNode) {
    const store = storeCreator({ scribingAnswer: {} });

    render(
      <ProviderWrapper {...{ store }}>
        <ScribingAnswer />
      </ProviderWrapper>,
      mountNode
    );
  }
});
