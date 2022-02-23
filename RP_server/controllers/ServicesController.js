module.exports = async (req, res) => {

    const service_1 = {
        name: "Service 1",
        url: "http://localhost:4001"
    }
    const service_2 = {
        name: "Service 2",
        url: "http://localhost:4003"
    }

    return res.send([service_1, service_2]);
}