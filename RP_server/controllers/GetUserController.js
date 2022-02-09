module.exports = async (req, res) => {
    console.log(req.user);

    // const user = {
    //     email : req.user.email,
    //     name : req.user.name,
    //     username: req.user.username
    // };

    return res.status(200).send(req.user);
}