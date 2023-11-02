/**
 * Update MongoDB script
 */
import { connect, connection, disconnect } from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/store-local';

(async () => {
  try {
    await connect(MONGODB_URI);

    const users = connection.collection('users');

    await users.updateMany({}, { $set: { availableGPTModels: ['gpt-3.5-turbo'] } }, { new: true });
    await users.updateMany(
      { $or: [{ role: 'admin' }, { role: 'super-admin' }] },
      { $set: { availableGPTModels: ['gpt-3.5-turbo', 'GigaChat:latest'] } },
      { new: true },
    );

    // eslint-disable-next-line no-console
    console.info(`MongoDB (${MONGODB_URI}) has been updated successfully!`);
  } finally {
    disconnect();
  }
})();
