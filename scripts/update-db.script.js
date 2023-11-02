/**
 * Update MongoDB script
 */
const { connect, connection, disconnect } = require('mongoose');

(async () => {
  try {
    await connect(process.env.MONGODB_URI);

    const users = connection.collection('users');

    await users.updateMany({}, { $set: { availableGPTModels: ['gpt-3.5-turbo'] } }, { new: true });
    await users.updateMany(
      { $or: [{ role: 'admin' }, { role: 'super-admin' }] },
      { $set: { availableGPTModels: ['gpt-3.5-turbo', 'GigaChat:latest'] } },
      { new: true },
    );

    // eslint-disable-next-line no-console
    console.info(`MongoDB (${process.env.MONGODB_URI}) has been updated successfully!`);
  } finally {
    disconnect();
  }
})();
