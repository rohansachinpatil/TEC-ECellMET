const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Please provide a team name'],
    unique: true,
    trim: true,
  },
  teamCode: {
    type: String,
    unique: true,
    required: true,
  },
  collegeName: {
    type: String,
    required: [true, 'Please provide a college name'],
    trim: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  totalPoints: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate rank based on total points logic can be added here
TeamSchema.methods.calculateRank = async function () {
  const Team = mongoose.model('Team');
  const higherTeams = await Team.countDocuments({ totalPoints: { $gt: this.totalPoints } });
  this.rank = higherTeams + 1;
  await this.save();
  return this.rank;
};

// Static method to generate unique team code
TeamSchema.statics.generateTeamCode = async function () {
  // Find the latest team to confirm code sequence
  // This is a simple implementation. For production high-concurrency, use a counter collection.
  // Starting from 12300
  const lastTeam = await this.findOne().sort({ createdAt: -1 });
  let code = 12300;

  if (lastTeam && lastTeam.teamCode) {
    const lastCode = parseInt(lastTeam.teamCode);
    if (!isNaN(lastCode)) {
      code = lastCode + 1;
    }
  }

  // Double check uniqueness loop (safety)
  let isUnique = false;
  while (!isUnique) {
    const existing = await this.findOne({ teamCode: code.toString() });
    if (!existing) {
      isUnique = true;
    } else {
      code++;
    }
  }

  return code.toString();
};

module.exports = mongoose.model('Team', TeamSchema);
