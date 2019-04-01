module.exports = {
    outputDir: 'docs',
    publicPath: process.env.NODE_ENV === 'production'
    // ? './'
    ? '/lucky-airdrop/'
    : '/'
}