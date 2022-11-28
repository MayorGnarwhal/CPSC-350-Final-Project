function processEnv() {
    process.env.PORT = 3003;
    process.env.URL = `http://cpsc.roanoke.edu:${process.env.PORT}/`;
}

module.exports = { processEnv };