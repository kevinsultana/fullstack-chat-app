export const getAllConnectedUsers = (req, res) => {
  // Logic to get all connected users
  res.status(200).json({ message: "List of all connected users", users: [] });
};
