module.exports = {
  validate(schema) {
    return async function (req, res, next) {
      try {
        await schema.validate({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (error) {
        if (error.errors) {
          return res.status(400).json({ mensagem: error.message });
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
      }
    };
  },
};
