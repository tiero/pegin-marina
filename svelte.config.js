const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  preprocess: sveltePreprocess({
    scss: {
      renderSync: true,
      includePaths: ['./src/scss'],
    }
  }),
};