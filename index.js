const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { Reclaim } = require('@reclaimprotocol/reclaim-sdk');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('MONGODB_CONNECION_URL', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a Claim schema for MongoDB
const claimSchema = new mongoose.Schema({
  id: String,
  status: String,
});
const Claim = mongoose.model('Claim', claimSchema);

// Initialising the ReclaimSDK
const reclaim = new Reclaim();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST /generateClaim
app.post('/generateClaim', async (req, res) => {
  const { walletAddress } = req.body;

  try {
    // Generate the claim using the Reclaim SDK
    const claim = await reclaim.generateClaim(walletAddress);

    // Save the claim to the MongoDB database
    const newClaim = new Claim({
      id: claim.id,
      status: 'in_progress',
    });
    await newClaim.save();

    // Send back the response template to the TPH website
    res.json({
      claim,
    });
  } catch (error) {
    // Handle any errors that occurred during claim generation
    res.status(500).json({
      error: 'Claim generation failed',
    });
  }
});

// GET /claimStatus
app.get('/claimStatus', async (req, res) => {
  const { claimId } = req.query;

  try {
    // Fetch the claim status from the MongoDB database
    const claim = await Claim.findOne({ id: claimId });

    // Check if the claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      claimStatus: claim,
    });
  } catch (error) {
    // Handle any errors that occurred during claim status retrieval
    res.status(500).json({
      error: 'Failed to retrieve claim status',
    });
  }
});

// PUT /claimStatus
app.put('/claimStatus', async (req, res) => {
  const { claimId, status } = req.body;

  try {
    // Update the claim status in the MongoDB database
    const claim = await Claim.findOneAndUpdate({ id: claimId }, { status }, { new: true });

    // Check if the claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      message: 'Claim status updated successfully',
    });
  } catch (error) {
    // Handle any errors that occurred during claim status update
    res.status(500).json({
      error: 'Failed to update claim status',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
