import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const autoSuggestTitle = (
  <p>
    If you know the name of your condition, you can type it here. You can write
    whatever you want and we’ll make suggestions for possible disabilities.
    (Shorter descriptions are better. For example, foot pain, back pain, or
    hearing loss.)
  </p>
);

export const uiDescription = (
  <div>
    <AdditionalInfo triggerText="What if I don’t know the name of my condition?">
      <p>
        If you don’t know the name of your condition or aren’t finding a match,
        you can type in your symptoms and we’ll help you figure out the name of
        your condition during the exam process.
      </p>
      <p>Shorter descriptions are better. For example:</p>
      <ul>
        <li>My knee hurts when I walk.</li>
        <li>I have trouble hearing when other people talk.</li>
        <li>My doctor says my cancer may be related to my service.</li>
      </ul>
    </AdditionalInfo>
  </div>
);
