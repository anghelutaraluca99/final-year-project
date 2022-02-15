module.exports = async (req, res) => {
    console.log(req.user);

    return res.status(200).send(req.user);
}