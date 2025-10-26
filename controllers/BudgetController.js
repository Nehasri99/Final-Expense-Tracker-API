const UserModel = require("../Models/User");
const setBudget = async (req, res) => {
  const { category, limit } = req.body;
  const userId = req.user._id;

  try {
    const numLimit = Number(limit);
    if (isNaN(numLimit) || numLimit <= 0) {
      return res.status(400).json({ message: "Invalid budget limit" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.budgets = user.budgets || [];
    const budgetIndex = user.budgets.findIndex(b => b.category === category);

    if (budgetIndex > -1) {
      user.budgets[budgetIndex].limit = numLimit;
    } else {
      user.budgets.push({ category, limit: numLimit });
    }

    await user.save();
    res.status(200).json({ success: true, data: user.budgets });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const getBudgets = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user.budgets });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


module.exports = {
    setBudget,
    getBudgets 
};