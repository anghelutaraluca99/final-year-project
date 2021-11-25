module.exports.PostReg = (req, res) => {
    console.log(req.body);
    res.status(200).send({
        page: 'Post Reg page'
    });
}