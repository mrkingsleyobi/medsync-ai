// Mock for jsdom
class JSDOM {
  constructor(html, options) {
    this.window = {
      document: {
        body: {
          innerHTML: html || '',
          textContent: this._getTextContent(html || '')
        }
      }
    };
  }

  _getTextContent(html) {
    // Simple text content extraction
    return html.replace(/<[^>]*>/g, '');
  }
}

module.exports = {
  JSDOM
};