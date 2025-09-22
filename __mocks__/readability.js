// Mock for @mozilla/readability
class Readability {
  constructor(document) {
    this.document = document;
  }

  parse() {
    return {
      title: 'Mock Title',
      content: this.document.body.innerHTML,
      textContent: this.document.body.textContent,
      length: this.document.body.textContent.length
    };
  }
}

module.exports = {
  Readability
};