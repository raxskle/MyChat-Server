const Response = (msg, data, code = 200) => {
  return {
    msg: msg,
    data: data,
    code: code,
  };
};

module.exports = { Response };
