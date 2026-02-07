const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path[issue.path.length - 1],
        message: issue.message,
      }));
      return res.status(400).json({
        status: "fail",
        errors: formattedErrors,
      });
    }

    req.body = result.data.body;
    next();
  } catch (error) {
    next(error);
  }
};

export { validate };
