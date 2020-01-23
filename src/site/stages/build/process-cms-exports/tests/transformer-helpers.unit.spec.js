const { expect } = require('chai');
const {
  combineItemsInIndexedObject,
  createLink,
  getWysiwygString,
  unescapeUnicode,
  createMetaTagArray,
} = require('../transformers/helpers');

describe('CMS export transformer helpers', () => {
  describe('getWysiwygString', () => {
    it('should transform wysiwyg strings', () => {
      const raw =
        '<p>If you need support for a specific mental health problem\u2014or if you\u2019re having problems sleeping, controlling your anger, or readjusting to civilian life\u2014you are not alone. And we can help.</p>\r\n\r\n';

      const transformed =
        '<p>If you need support for a specific mental health problem—or if you’re having problems sleeping, controlling your anger, or readjusting to civilian life—you are not alone. And we can help.</p>\r\n\r\n';

      expect(getWysiwygString(raw)).to.equal(transformed);
    });
  });

  describe('combineItemsInIndexedObject', () => {
    it('turns an index-keyed object into an array', () => {
      /* eslint-disable quote-props */
      const obj = {
        '1': ['world'],
        '0': ['hello'],
      };
      /* eslint-enable quote-props */
      const arr = [['hello'], ['world']];

      expect(combineItemsInIndexedObject(obj)).to.deep.equal(arr);
    });

    it('keeps an array as an array', () => {
      expect(combineItemsInIndexedObject([['hello'], ['world']])).to.deep.equal(
        [['hello'], ['world']],
      );
    });
  });

  describe('unescapeUnicode', () => {
    // These examples came from the tome-sync content
    // rg --no-filename ".*(\\\u\d{2,4}).*" -r '$1' | sort | uniq
    it('should translate unicode code points into unicode characters', () => {
      const pairs = [
        ['\\u200', 'Ȁ'],
        ['\\u201', 'ȁ'],
        ['\\u2012', '‒'],
        ['\\u2013', '–'],
        ['\\u2014', '—'],
        ['\\u2019', '’'],
        ['\\u2022', '•'],
        ['\\u2026', '…'],
        ['\\u2122', '™'],
        ['\\u3000', '　'],
      ];
      pairs.forEach(([codePoint, character]) => {
        // Make sure it replaces all instances in a string, not just the first
        expect(unescapeUnicode(`a ${codePoint} ${codePoint} a`)).to.equal(
          `a ${character} ${character} a`,
        );
      });
    });
  });

  describe('createLink', () => {
    it('should return null for an empty array', () => {
      expect(createLink([])).to.equal(null);
    });

    it('returns a properly formatted link object', () => {
      const fieldLink = [
        {
          uri: 'foo',
          title: 'Hello, World!',
          options: ['big'],
        },
      ];

      expect(createLink(fieldLink)).to.deep.equal({
        url: {
          path: 'foo',
        },
        title: 'Hello, World!',
        options: ['big'],
      });
    });

    it('can select only part of the returned object properties', () => {
      const fieldLink = [
        {
          uri: 'foo',
          title: 'Hello, World!',
          options: ['big'],
        },
      ];

      const urlOnly = ['url'];
      const titleOnly = ['title'];

      expect(createLink(fieldLink, urlOnly)).to.deep.equal({
        url: {
          path: 'foo',
        },
      });

      expect(createLink(fieldLink, titleOnly)).to.deep.equal({
        title: 'Hello, World!',
      });

      expect(createLink(fieldLink, [...urlOnly, ...titleOnly])).to.deep.equal({
        url: {
          path: 'foo',
        },
        title: 'Hello, World!',
      });
    });
  });

  describe('createMetaTagArray', () => {
    it('should create all the tags', () => {
      /* eslint-disable camelcase */
      const raw = {
        title:
          'VA Pittsburgh health care | Veterans Town Hall on the Move | Veterans Affairs',
        twitter_cards_type: 'summary_large_image',
        og_site_name: 'Veterans Affairs',
        twitter_cards_description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        twitter_cards_title:
          'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        twitter_cards_site: '@DeptVetAffairs',
        og_title:
          'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        og_description:
          'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        og_image_height: '314',
      };
      /* eslint-enable camelcase */

      const transformed = [
        {
          __typename: 'MetaValue',
          key: 'title',
          value:
            'VA Pittsburgh health care | Veterans Town Hall on the Move | Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:card',
          value: 'summary_large_image',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:site_name',
          value: 'Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaValue',
          key: 'description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:title',
          value:
            'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        },
        {
          __typename: 'MetaValue',
          key: 'twitter:site',
          value: '@DeptVetAffairs',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:title',
          value:
            'Veterans Town Hall on the Move | VA Pittsburgh health care | Veterans Affairs',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:description',
          value:
            'VA Pittsburgh Healthcare System Interim Director Barbara Forsha invites you to attend the Town Hall event. Veterans, their families and the public are welcome to attend.',
        },
        {
          __typename: 'MetaProperty',
          key: 'og:image:height',
          value: '314',
        },
      ];

      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });

    it('should omit tags with no value', () => {
      const raw = {
        title: 'foo',
      };

      const transformed = [
        {
          __typename: 'MetaValue',
          key: 'title',
          value: 'foo',
        },
      ];

      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });

    it('should ignore unrecognized tags', () => {
      const raw = { unknown: 'Dunno' };
      const transformed = [];
      expect(createMetaTagArray(raw)).to.deep.equal(transformed);
    });
  });
});
