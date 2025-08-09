let userSocketMap = {};
let ioInstance = null;

module.exports = {
  userSocketMap,
  setIo: (io) => { ioInstance = io; },
  getIo: () => ioInstance
};
