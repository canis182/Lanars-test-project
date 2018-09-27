module.exports = class ErrorService {
  static transformJoiDetails(details) {
    return details.map(detail => {
      const { key: field } = detail.context;
      return {
        field,
        message: `Incorrect ${field}`
      };
    });
  }
};
