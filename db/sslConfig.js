function getSslConfig(connectionString) {
    if (!connectionString) return false;

    const hostname = new URL(connectionString).hostname;

    if (["localhost", "127.0.0.1", "::1"].includes(hostname)) {
        return false;
    }

    return { rejectUnauthorized: false };
}

module.exports = { getSslConfig };