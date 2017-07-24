import React from 'react';
import { render } from 'react-dom';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import storeCreator from './scribing/store';
import ScribingAnswer from './scribing/ScribingAnswer';

$(document).ready(() => {
  const mountNodeElems = document.getElementsByClassName('scribing-answer');

  if (mountNodeElems) {
    for (let i = 0; i < mountNodeElems.length; i++) {
      const mountNode = mountNodeElems[i];
      const store = storeCreator({ scribingAnswer: {} });
      const data = JSON.parse(mountNode.getAttribute('data'));

      render(
        <ProviderWrapper {...{ store }}>
          <ScribingAnswer data={data} />
        </ProviderWrapper>,
        mountNode
      );
    }
  }
});
